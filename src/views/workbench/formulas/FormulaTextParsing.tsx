/* eslint-disable no-loop-func */
import { processAdvancedFormula } from './FormulaProcessing';
import { priority1Operations, priority2Operations } from './OperationsRegexes';
import { formulaRegexes } from './FormulaRegexes';

let debugProcessing = false;

let constantTerm2Required = [
  "sma", "ema", "median", "med", "sum", "std",
  "percentage_change", "percent_change", "pc", "diff",
  "rsi", "shift", "linreg", "lreg", "z_score"
];
let constantTerm3Required = ["corr"];

/**
 * Main formula text processing function, used by the external code to process the formula text
 */

export async function parseFormulaText(metricData: any, metricItem: any) {
  try {
    let start = new Date().getTime();

    // get and clean formula text
    let formulaText = metricItem.formulaInput;
    let originalFormulaText = formulaText;
    formulaText = formulaText.toLowerCase().replace(/\s+/gm, '');
    if (!formulaText) return [];

    // get other series
    let otherSeries = metricData.filter((series: any) => series !== metricItem);

    // identify used series
    let usedSeriesCodes = formulaText.match(/(m|f)\d+/gm) || [];
    let usedSeries = otherSeries.filter((series: any) => {
      return usedSeriesCodes.includes("m" + series.m) ||
        usedSeriesCodes.includes("f" + series.f);
    });
    if (usedSeries.length === 0) {
      let usedSeriesItem = otherSeries.filter((series: any) => series.selectedMetric !== "Formula")[0];
      usedSeries.push(usedSeriesItem);
    }
    if (usedSeries.length === 0) {
      throw new Error("Sorry, we were unable to parse this formula. Please check the syntax and try again.");
    }

    // wait for all metrics used in the formula to be loaded
    let checkUsedSeriesLoaded = () => {
      return usedSeries.every((series: any) => !series || series.data !== null);
    }
    let usedSeriesLoaded = checkUsedSeriesLoaded();
    while (!usedSeriesLoaded) {
      await new Promise(resolve => setTimeout(resolve, 100));
      usedSeriesLoaded = checkUsedSeriesLoaded();
    }

    let startSinceDataLoad = new Date().getTime();

    // wait 100ms more to ensure all series data is loaded (prevent race conditions)
    await new Promise(resolve => setTimeout(resolve, 100));

    // replace implicit multipliers with explicit ones (e.g. 2(x) -> 2*(x))
    formulaText = formulaText.replace(/(\))(?=\d+|\w+)/gm, '$1*'); // e.g. (3)2 -> (3)*2
    formulaText = formulaText.replace(/(\))\(/gm, '$1*('); // e.g. (3)(2) -> (3)*(2)
    formulaText = formulaText.replace(/(\d+)\(/gm, '$1*('); // e.g. 3(2) -> 3*(2)
    formulaText = formulaText.replace(/(m\d+)\(/gm, '$1*('); // e.g. m1(2) -> m1*(2)
    formulaText = formulaText.replace(/(f\d+)\(/gm, '$1*('); // e.g. f1(2) -> f1*(2)
    formulaText = formulaText.replace(/(\d+)(m\d+)/gm, '$1*$2'); // e.g. 3m1 -> 3*m1
    formulaText = formulaText.replace(/(\d+)(f\d+)/gm, '$1*$2'); // e.g. 3f1 -> 3*f1
    formulaText = formulaText.replace(/(m\d+)(m\d+)/gm, '$1*$2'); // e.g. m1m2 -> m1*m2
    formulaText = formulaText.replace(/(f\d+)(f\d+)/gm, '$1*$2'); // e.g. f1f2 -> f1*f2
    formulaText = formulaText.replace(/(m\d+)(f\d+)/gm, '$1*$2'); // e.g. m1f2 -> m1*f2
    formulaText = formulaText.replace(/(f\d+)(m\d+)/gm, '$1*$2'); // e.g. f1m2 -> f1*m2
    formulaText = formulaText.replace(/(\d+)([a-z])/gm, '$1*$2'); // e.g. 3x -> 3*x

    // replace implicit 0s with explicit ones (e.g. .5 -> 0.5)
    formulaText = formulaText.replace(/(\D|^)\.(\d)/gm, '$10.$2');
    if (debugProcessing) {
      console.log("Formula text after standardization", formulaText, originalFormulaText);
    }

    // get series with the longest data
    let longestLength = Math.max.apply(null, otherSeries
      .filter((series: any) => series.selectedMetric !== "Formula")
      .map((series: any) => series.data && series.data.length ? series.data.length : 0)
    );
    let longestSeries = otherSeries
      .filter((series: any) => series.selectedMetric !== "Formula")
      .filter((series: any) => series.data && series.data.length === longestLength)[0];
    if (!longestSeries) longestSeries = metricItem;

    let allOtherSeriesCodes = otherSeries
      .map((series: any) => {
        if (series.selectedMetric !== "Formula") return "m" + series.m;
        if (series.selectedMetric === "Formula") return "f" + series.f;
      });

    // normalize series data
    if (!longestSeries) {
      throw new Error("Sorry, we were unable to parse this formula. Please check the syntax and try again.");
    }

    if (debugProcessing) {
      console.log("Original data", JSON.parse(JSON.stringify(longestSeries.data)));
    }

    // start calculation template, by copying the longest series time points, and replacing each data point with the formula text
    let calculatedData = JSON.parse(JSON.stringify(longestSeries.data));
    calculatedData.forEach((row: any) => row[1] = formulaText);
    extendDataIfNeeded(formulaText, calculatedData, otherSeries);

    if (debugProcessing) {
      console.log("Starting data", JSON.parse(JSON.stringify(calculatedData)));
    }

    // replace all series codes with their respective data (e.g. m1, m2, m3, f1, f2, f3)
    if (debugProcessing) {
      console.log("Replacing series codes", allOtherSeriesCodes);
    }

    let calculatedDataTimeMap: any = {};
    calculatedData.forEach((row: any) => {
      calculatedDataTimeMap[row[0]] = row[1];
    });

    allOtherSeriesCodes.forEach((seriesCode: any) => {
      let hasThisSeries = usedSeriesCodes.includes(seriesCode);
      if (!hasThisSeries) return;

      let targetSeries = getSeriesByID(seriesCode, metricData);
      if (!targetSeries) {
        console.log("Series not found", seriesCode);
        formulaText = formulaText.replaceAll(seriesCode, '0');
        return;
      }
      else targetSeries = JSON.parse(JSON.stringify(targetSeries));

      let targetSeriesData = targetSeries ? targetSeries.data : [];
      let targetSeriesTimeMap: any = {};
      targetSeriesData.forEach((row: any) => {
        targetSeriesTimeMap[row[0]] = row[1];
      });

      calculatedData.forEach((row: any) => {
        let targetSeriesRowData = targetSeriesTimeMap[row[0]];
        row[1] = row[1].replaceAll(seriesCode, targetSeriesRowData);
      });

      formulaText = formulaText.replaceAll(seriesCode, '0');
    });

    if (debugProcessing) {
      console.log("Data after series replacement", JSON.parse(JSON.stringify(calculatedData)));
    }

    // identify and parse all calculations and formulas
    let formulaParsed = false;

    try {
      // initialize iteration counter
      let iterations = 1;

      // as long as the original formula text has not been reduced to a single number, keep parsing
      while (!formulaText.match(/^\-*(\d+\.\d+|\d+)$/)) {
        // parse 1st-level priority operations (e.g. exponentiation, multiplication, division)
        formulaText = processOperationsExhaustively(formulaText, calculatedData, true);

        // parse 2nd-level priority operations (e.g. addition, subtraction)
        formulaText = processOperationsExhaustively(formulaText, calculatedData, false);

        // increase iteration counter
        iterations++;

        // limit iterations, and conclude there's a parsing error if it exceeds the limit
        if (iterations > 200) throw new Error("Sorry, we were unable to parse this formula. Please check the syntax and try again.");
      }

      // convert all calculated data points to numbers, for proper chart rendering
      calculatedData.forEach((row: any) => {
        row[1] = row[1] === undefined ? "undefined" : row[1].toString();
        row[1] = row[1].includes('undefined') ? null : parseFloat(row[1]);
        if (isNaN(row[1])) row[1] = null;
      });

      formulaParsed = true;
    }
    catch (e: any) {
      console.log("Parsing error", e);
      console.log("Last data point", calculatedData[calculatedData.length - 1]);
      console.log("Calculated data state at the time of error", calculatedData);
      console.log("Formula text state at the time of error", formulaText);
    }

    // log processing time
    let end = new Date().getTime();
    if (debugProcessing) {
      console.log("Processed formula", originalFormulaText);
      console.log("Formula processing time", end - start, "ms");
      console.log("Formula processing time since data load", end - startSinceDataLoad, "ms");
    }

    // return calculated data
    return formulaParsed ? calculatedData : "error";
  }
  catch (e) {
    console.log("Error processing formula", e);
    return "error";
  }
}

/**
 *  This function will process the formula, identify math operations, and calculate the results
 */

function processOperationsExhaustively(formulaText: any, calculatedData: any, primary: any) {
  // get operations set, based on priority
  let operationRegexes = primary ? priority1Operations : priority2Operations;
  let first = true;
  let noMoreMatches = false;

  // loop through all operations until there are no more matches
  while (first || !noMoreMatches) {
    let anyMatchesThisSet = false;

    // eslint-disable-next-line no-loop-func
    operationRegexes.forEach((operationRegex: any) => {
      // attempt to find a match for the current operation
      let regex = operationRegex.regex;
      let matchIndex = operationRegex.matchGroup;
      let matches = [...formulaText.matchAll(regex)][0];
      if (matches && matches.length) anyMatchesThisSet = true;

      // if any math operations are found, calculate them
      while (matches && matches.length) {
        let matchedOperation = matches[matchIndex];

        // loop through each data point and perform the math operation
        calculatedData.forEach((row: any, rowIndex: any) => {
          let theseMatches = null;
          try { theseMatches = [...row[1].matchAll(regex)][0]; } catch(e) {}

          let thisMatch = theseMatches ? theseMatches[matchIndex] : null;
          if (thisMatch === null || thisMatch === undefined || thisMatch === '') return true;
          if (thisMatch.includes('undefined')) {
            row[1] = row[1].replace(thisMatch, 'undefined');
            return true;
          }

          // extract the operation (keep match string intact)
          let operation = thisMatch;

          // ensure exponentiation is evaluated correctly
          // (spaces around the exponentiation operator affect precedence)
          if (operation.includes('^')) {
            operation = operation
              .replaceAll(/(\-|\+)*(\d*\.*\d+)\^(\-|\+)*(\d*\.*\d+)/g,
                '$1($2**$3$4)');
          }

          // ensure double negatives are evaluated correctly
          operation = operation.replaceAll('--', '+');

          // perform the math operation
          try {
            row[1] = row[1].replace(thisMatch, eval(operation));
            row[1] = row[1].replace('--', '+');
          }
          catch(e) {
            console.log(e);
            console.log("Matched operation", thisMatch);
            console.log("Prepared operation", operation);
            console.log("New value", row[1]);
            throw new Error("Error processing operation. Either a bug or incorrect syntax.");
          }
        });

        // update formula text to reflect solved calculation
        formulaText = formulaText.replace(matchedOperation, '0');
        matches = formulaText.matchAll(regex);

        if (debugProcessing) {
          console.log("Matched operation string", matchedOperation);
          console.log("Result data", JSON.parse(JSON.stringify(calculatedData)));
          console.log("New formula text", formulaText);
        }
      }

      // remember original formula text
      let previousFormulaText = formulaText;

      // find and calculate any formulas
      formulaText = processCalculationsExhaustively(formulaText, calculatedData);

      // determine if any formula calculations were performed, and if so, continue checking for math operations
      if (formulaText !== previousFormulaText) anyMatchesThisSet = true;
    });

    // if no matches were found, stop looping
    if (!anyMatchesThisSet) noMoreMatches = true;
    first = false;
  }

  return formulaText;
}

/**
 * This function will process the formula, identify calculations, and calculate the results
 */

function processCalculationsExhaustively(formulaText: any, calculatedData: any) {
  let first = true;
  let noMoreMatches = false;

  // loop through all formulas until there are no more matches
  while (first || !noMoreMatches) {
    let anyMatchesThisSet = false;

    // eslint-disable-next-line no-loop-func
    formulaRegexes.forEach((formulaRegex: any) => {
      // attempt to find a match for the current formula
      let regex = formulaRegex;
      let matches = [...formulaText.matchAll(regex)][0];
      if (matches && matches.length) anyMatchesThisSet = true;

      // if any formulas are found, calculate them
      while (matches && matches.length) {
        let matchedFormula = matches[0];
        let formulaName = matches[1];
        let term1 = matches[2];
        let term2 = matches[3];
        let term3 = matches[4];

        // for each data row, extract the arguments for the formula calculations
        let term1Data: any = [];
        let term2Data: any = [];
        let term3Data: any = [];
        let trueData: any = [];
        let falseData: any = [];

        calculatedData.forEach((row: any) => {
          // get matches for this data point
          let theseMatches = [...row[1].matchAll(regex)][0];

          // extract arguments for formula calculations
          let term1Value: any = undefined;
          let term2Value: any = undefined;
          let term3Value: any = undefined;

          if (theseMatches) {
            term1Value = theseMatches[2];
            term2Value = theseMatches[3];
            term3Value = theseMatches[4];
            if (formulaName === "if") term2Value = theseMatches[4];
          }

          term1Data.push({
            x: row[0],
            y: term1Value !== undefined ? parseFloat(term1Value) : undefined
          });

          term2Data.push({
            x: row[0],
            y: term2Value !== undefined ? parseFloat(term2Value): undefined
          });

          term3Data.push({
            x: row[0],
            y: term3Value !== undefined ? parseFloat(term3Value) : undefined
          });

          // extract arguments for IF formula calculation
          if (formulaName === "if") {
            let trueVal: any = undefined;
            let falseVal: any = undefined;

            if (theseMatches) {
                trueVal = theseMatches[5];
                falseVal = theseMatches[6];
            }

            trueData.push({
              x: row[0],
              y: trueVal !== undefined && trueVal !== 'na' ? parseFloat(trueVal) : undefined
            });

            falseData.push({
              x: row[0],
              y: falseVal !== undefined && falseVal !== 'na' ? parseFloat(falseVal) : undefined
            });
          }
        });

        let validTerm2Data = term2Data.filter((row: any) => row.y !== undefined && !isNaN(row.y));
        let validTerm3Data = term3Data.filter((row: any) => row.y !== undefined && !isNaN(row.y));

        if (constantTerm2Required.includes(formulaName) && term2 !== undefined && term2 !== null) {
          if ((validTerm2Data.length === 0 ||
              !validTerm2Data.every((row: any) => row.y === validTerm2Data[0]?.y))) {
            console.log("Term 2 is not a constant", JSON.parse(JSON.stringify(term2Data)));
            throw new Error("Error processing formula. Term 2 must be a constant for this formula.");
          }
          else term2 = validTerm2Data[0]?.y;
        }

        if (constantTerm3Required.includes(formulaName)) {
          if (validTerm3Data.length === 0 ||
            !validTerm3Data.every((row: any) => row.y === validTerm3Data[0]?.y)) {
            console.log("Term 3 is not a constant", JSON.parse(JSON.stringify(term3Data)));
            throw new Error("Error processing formula. Term 3 must be a constant for this formula.");
          }
          else term3 = validTerm3Data[0]?.y;
        }

        // calculate the formula
        let resultData = processAdvancedFormula(
          formulaName,
          term1Data,
          term2Data,
          trueData,
          falseData,
          term2,
          term3
        );

        // sort calculated data by time
        calculatedData.sort((a: any, b: any) => a[0] - b[0]);

        // replace formula text in each row with the calculated value
        calculatedData.forEach((row: any, index: any) => {
          if (row[1] === undefined || !row[1].matchAll) return true;

          try {
            let theseMatches = [...row[1].matchAll(regex)][0];
            let thisMatch = theseMatches ? theseMatches[0] : null;
            if (thisMatch === null || thisMatch === undefined || thisMatch === '') return true;
            if (thisMatch.includes('undefined')) {
              row[1] = row[1].replace(thisMatch, 'undefined');
              return true;
            }

            if (formulaName === "shift") {
              row[0] = resultData[index].x;
              row[1] = row[1].replace(thisMatch, resultData[index].y);
            }
            else {
              row[1] = row[1].replace(thisMatch, resultData[index]);
            }
          }
          catch(e) {
            console.log(e);
            console.log(row[1]);
          }
        });

        // update formula text to reflect solved formula
        formulaText = formulaText.replace(matchedFormula, '0');

        // determine if there are any other formulas to solve (if it should keep iterating)
        matches = formulaText.matchAll(regex);

        // data this iteration
        if (debugProcessing) {
          console.log("Matched formula string", matchedFormula);
          console.log("Formula name", formulaName, "Term 1", term1, "Term 2", term2, "Term 3", term3);
          console.log("Result data", JSON.parse(JSON.stringify(calculatedData)));
          console.log("New formula text", formulaText);
        }
      }
    });

    if (!anyMatchesThisSet) noMoreMatches = true;
    first = false;
  }

  return formulaText;
}

/**
 * Helper function to get the series data by its ID/code: e.g. m1, f2, etc.
 */

function getSeriesByID(id: any, allSeries: any) {
  return allSeries.filter((series: any) => {
    if (id[0] === "m" && series.selectedMetric !== "Formula" && parseInt(id[1]) === series.m) return true;
    if (id[0] === "f" && series.selectedMetric === "Formula" && parseInt(id[1]) === series.f) return true;
    return false;
  })[0] || null;
}

/**
 * Helper function to extend the data points of the calculated data, if needed
 * Checks if the formula is based on another formula series, and extends the data points if needed
 */

function extendDataIfNeeded(formulaText: any, calculatedData: any, otherSeries: any) {
  let formulaSeries = otherSeries.filter((series: any) => series.selectedMetric === "Formula");
  if (!formulaSeries) return;

  let usedFormulaSeriesCodes = formulaText.match(/f\d+/gm);
  if (!usedFormulaSeriesCodes) return;

  let usedFormulaSeries = formulaSeries.filter((series: any) => usedFormulaSeriesCodes.includes("f" + series.f));
  if (!usedFormulaSeries) return;

  usedFormulaSeries.forEach((series: any) => {
    let missingDataPoints = series.data.filter((row: any) => {
      return !calculatedData.some((calculatedRow: any) => calculatedRow[0] === row[0]);
    });
    missingDataPoints = JSON.parse(JSON.stringify(missingDataPoints));
    missingDataPoints.forEach((row: any) => {
      calculatedData.push([row[0], formulaText]);
    });
  });
}
