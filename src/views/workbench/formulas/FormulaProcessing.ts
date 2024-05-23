import { log, abs, pow, std, sqrt } from 'mathjs';

/**
 * Process advanced formula and calculate the result
 */

export const processAdvancedFormula = (
  formulaName: string,
  term1Data: any,
  term2Data: any,
  trueData: any,
  falseData: any,
  term2: any,
  term3: any
) => {
  // for each formula, calculate the result using the corresponding specialized function
  let resultData: any = [];

  if (formulaName === "athpc") {
    resultData = calculateATHPC(term1Data);
  }

  if (formulaName === "log") {
    resultData = calculateLog(term1Data);
  }

  if (formulaName === "lt" ||
    formulaName === "logt") {
    resultData = calculateLog10(term1Data);
  }

  if (formulaName === "abs") {
    resultData = calculateAbs(term1Data);
  }

  if (formulaName === "range") {
    resultData = term1Data.map((row: any, index: any) => index);
  }

  if (formulaName === "cumsum" ||
    formulaName === "csum") {
    resultData = calculateCumulativeSummation(term1Data);
  }

  if (formulaName === "cumstd" ||
    formulaName === "cstd") {
    resultData = calculateCumulativeStandardDeviation(term1Data);
  }

  if (formulaName === "cummean" ||
    formulaName === "cm" ||
    formulaName === "cmean") {
    resultData = calculateCumulativeMean(term1Data);
  }

  if (formulaName === "sqrt") {
    resultData = calculateSqrt(term1Data);
  }

  if (formulaName === "pow") {
    resultData = calculatePow(term1Data, term2Data);
  }

  if (formulaName === 'percent_change' ||
    formulaName === "percentage_change" ||
    formulaName === "pc") {
    resultData = calculatePercentageChange(term1Data, (parseInt(term2) - 1));
  }

  if (formulaName === 'linreg' ||
    formulaName === "lreg") {
    let period = term2 ? parseInt(term2) : null;
    resultData = calculateLinearRegression(term1Data, period);
  }

  if (formulaName === "treg") {
    let period = term2 ? parseInt(term2) : null;
    resultData = calculateLinearRegressionLogTransform(term1Data, period);
  }

  if (formulaName === 'expreg' ||
    formulaName === "ereg") {
    let period = term2 ? parseInt(term2) : null;
    resultData = calculateExponentialRegression(term1Data, period);
  }

  if (formulaName === "zs" ||
    formulaName === "z_score") {
    let period = term2 ? parseInt(term2) : null;
    resultData = calculateZScore(term1Data, period);
  }

  if (formulaName === "exponent" ||
    formulaName === "exp") {
    resultData = term1Data.map((row: any) => row.y ** parseFloat(term2));
  }

  if (formulaName === "diff") {
    resultData = calculateDifference(term1Data, (parseInt(term2) - 1));
  }

  if (formulaName === "sma") {
    let result = calculateSMA(term1Data, parseInt(term2));
    resultData = result.map((row: any) => row.y);
  }

  if (formulaName === "ema") {
    let result = calculateEMA(term1Data, parseInt(term2));
    resultData = result.map((row: any) => row.y);
  }

  if (formulaName === "rsi") {
    let result = calculateRSI(term1Data, parseInt(term2));
    resultData = result.map((row: any) => row[1]);
  }

  if (formulaName === "corr") {
    resultData = calculateCorrelationCoefficient(term1Data.map((row: any) => row.y), term2Data.map((row: any) => row.y), parseInt(term3));
  }

  if (formulaName === "shift") {
    resultData = calculateShift(term1Data, parseInt(term2));
  }

  if (formulaName === "std") {
    resultData = calculateStandardDeviation(term1Data.map((row: any) => row.y), (parseInt(term2) - 1));
  }

  if (formulaName === "median" ||
    formulaName === "med") {
    resultData = calculateMovingMedian(term1Data.map((row: any) => row.y), (parseInt(term2) - 1));
  }

  if (formulaName === "sum") {
    resultData = calculateSummation(term1Data.map((row: any) => row.y), (parseInt(term2) - 1));
  }

  if (formulaName === "min") {
    resultData = calculateMin(term1Data.map((row: any) => row.y), term2Data.map((row: any) => row.y));
  }

  if (formulaName === "max") {
    resultData = calculateMax(term1Data.map((row: any) => row.y), term2Data.map((row: any) => row.y));
  }

  if (formulaName === "if") {
    resultData = calculateIFStatement(
      term1Data.map((row: any) => row.y),
      term2,
      term2Data.map((row: any) => row.y),
      trueData.map((row: any) => row.y),
      falseData.map((row: any) => row.y)
    )
  }

  return resultData;
}

/**
 * Process metric formula and calculate the result
 */

export function processMetricFormula(
  metricItem: any,
  priceData: any
) {
  let resultsData = priceData;
  let formulaName = metricItem.customFormula?.name;
  let days = metricItem.customFormula?.days;

  if (formulaName && days) {
    let data: any = [];

    priceData.forEach((row: any) => {
      data.push({ x: row[0], y: Number(row[1]) });
    });

    let foundFormula = false;

    if (formulaName === 'SMA') {
      resultsData = calculateSMA(data, days);
      foundFormula = true;
    }

    if (formulaName === 'EMA') {
      resultsData = calculateEMA(data, days);
      foundFormula = true;
    }

    if (formulaName === 'MM') {
      resultsData = calculateMM(data, days);
      foundFormula = true;
    }

    if (foundFormula) {
      resultsData = resultsData.map((row: any) => [row.x, row.y]);
    }
  }

  return resultsData;
}

/**
 * Specialized functions for calculating each formula type
 */

function calculateSMA(array: any, countBefore: any) {
  let countAfter = 0;
  countBefore--;

  // take out the first part of array that has undefined or NaN as y value
  let i = 0;
  while (i < array.length && (isNaN(array[i].y) || array[i].y === undefined)) {
    i++;
  }

  let prevArray = array.slice(0, i);
  let cleanArray = array.slice(i);

  const results: any = [];
  for (let i = 0; i < cleanArray.length; i++) {
    if (i < countBefore) {
      results.push({
        x: cleanArray[i].x,
        y: undefined
      });
    }
    else {
      const subArr = cleanArray.slice(
          Math.max(i - countBefore, 0),
          Math.min(i + countAfter + 1, cleanArray.length)
        )
        .map((res: any) => {
          return res.y;
        });

      const addition = subArr.reduce((a: any, b: any) => a + (isNaN(b) ? 0 : b), 0);
      const avg = addition / subArr.length;

      results.push({
        x: cleanArray[i].x,
        y: avg
      });
    }
  }

  // add the undefined values back to the beginning of the array
  prevArray.forEach((row: any) => {
    results.unshift({
      x: row.x,
      y: undefined
    });
  });

  results.sort((a: any, b: any) => a.x - b.x);

  return results;
}

function calculateEMA(array: any, count: any) {
  let multiplier = 2 / (count + 1);
  let results = [{
    x: array[0].x,
    y: array[0].y
  }];

  // take out the first part of array that has undefined or NaN as y value
  let i = 0;
  while (i < array.length && (isNaN(array[i].y) || array[i].y === undefined)) {
    i++;
  }

  let prevArray = array.slice(0, i);
  let cleanArray = array.slice(i);

  for (let i = 1; i < cleanArray.length; i++) {
    let price = cleanArray[i].y;
    let prev = results[i - 1].y;
    if (prev === undefined || isNaN(prev)) prev = price;
    let newY = (price - prev) * multiplier + prev;
    results.push({
      x: cleanArray[i].x,
      y: newY
    });
  }

  // add the undefined values back to the beginning of the array
  prevArray.forEach((row: any) => {
    results.unshift({
      x: row.x,
      y: undefined
    });
  });

  results.sort((a: any, b: any) => a.x - b.x);

  return results;
}

function calculateMM(array: any, mRange: any) {
  let multiplier = 2 / (mRange + 1);
  let results = [{
    x: array[0].x,
    y: array[0].y
  }];

  // take out the first part of array that has undefined or NaN as y value
  let i = 0;
  while (i < array.length && (isNaN(array[i].y) || array[i].y === undefined)) {
    i++;
  }

  let prevArray = array.slice(0, i);
  let cleanArray = array.slice(i);

  for (let i = 1; i < cleanArray.length; i++) {
    let price = cleanArray[i].y;
    let prev = results[i - 1].y;
    results.push({
      x: cleanArray[i].x,
      y: price * multiplier + prev * (1 - multiplier)
    });
  }

  // add the undefined values back to the beginning of the array
  prevArray.forEach((row: any) => {
    results.unshift({
      x: row.x,
      y: undefined
    });
  });

  results.sort((a: any, b: any) => a.x - b.x);

  return results;
}

function calculateATHPC(data:any) {
  let ath = 0.0; // Initialize all-time high (ATH) as 0
  let percentageChanges = []; // Array to store percentage changes

  let array = data;

  // take out the first part of array that has undefined or NaN as y value
  let i = 0;
  while (i < data.length && (isNaN(data[i].y) || data[i].y === undefined)) {
    i++;
  }

  let prevArray = array.slice(0, i);
  let cleanArray = array.slice(i);

  cleanArray.forEach((value:any) => {
    let valueY = value.y === undefined ? 0 : value.y;
    ath = Math.max(ath, valueY); // Update ATH
    let percentageChange = ((valueY - ath) / ath) * 100; // Calculate percentage change from ATH
    percentageChanges.push({
      x: value.x,
      y: percentageChange
    }); // Store the percentage change
  });

  // add the undefined values back to the beginning of the array
  prevArray.forEach((row: any) => {
    percentageChanges.unshift({
      x: row.x,
      y: undefined
    });
  });

  percentageChanges.sort((a: any, b: any) => a.x - b.x);

  return percentageChanges.map((row: any) => row.y);
}

function calculateLog(data: any) {
  let newData = [];
  data.forEach((row: any) => {
    let newValue = undefined;
    try {newValue = log(row.y);} catch (e) {}
    newData.push(newValue);
  });

  return newData;
}

function calculateLog10(data: any) {
  let newData = [];
  data.forEach((row: any) => {
    let newValue = undefined;
    try {newValue = Math.log10(row.y);} catch (e) {}
    newData.push(newValue);
  });

  return newData;
}

function calculateAbs(data: any) {
  let newData = [];
  data.forEach((row: any) => {
    let newValue = undefined;
    try {newValue = abs(row.y);} catch (e) {}
    newData.push(newValue);
  });

  return newData;
}

function calculateSqrt(data: any) {
  let newData = [];
  data.forEach((row: any) => {
    let newValue = undefined;
    try {newValue = sqrt(parseFloat(row.y));} catch (e) {}
    newData.push(newValue);
  });

  return newData;
}

function calculatePow(data: any, powerData: any) {
  let newData = [];
  data.forEach((row: any, rowIndex: any) => {
    let newValue = undefined;
    try {newValue = pow(row.y, parseFloat(powerData[rowIndex].y));} catch (e) {}
    newData.push(newValue);
  });

  return newData;
}

function calculateCumulativeSummation(arr: any) {
  const creds = arr.reduce((acc: any, val: any) => {
    let {sum, res} = acc;

    if (val.y !== undefined) {
      sum += val.y;
      res.push({x: val.x, sum});
    }
    else {
      res.push({x: val.x, sum});
    }

    return {sum, res};
  }, {
    sum: 0,
    res: []
  });

  return creds.res.map((row: any) => row.sum);
}

function calculateCumulativeStandardDeviation(data: any) {
  const result = [];
  let x = [];
  let array = data;

  // take out the first part of array that has undefined or NaN as y value
  let i = 0;
  while (i < data.length && (isNaN(data[i].y) || data[i].y === undefined)) {
    i++;
  }

  let prevArray = array.slice(0, i);
  let cleanArray = array.slice(i);

  // calculate the standard deviation for each point in the array
  for (let i = 0; i < cleanArray.length; i++) {
    x = cleanArray.slice(0, i + 1).map((res: any) => res.y);
    let newVal = undefined;
    try {newVal = std(...x);} catch (e) {}
    result.push({
      x: cleanArray[i].x,
      y: newVal
    });
  }

  // add the undefined values back to the beginning of the array
  prevArray.forEach((row: any) => {
    result.unshift({
      x: row.x,
      y: undefined
    });
  });

  result.sort((a: any, b: any) => a.x - b.x);

  return result.map((row: any) => row.y);
}

function calculateCumulativeMean(arr: any) {
  let count = 0;

  const creds = arr.reduce((acc: any, val: any) => {
    let {sum, res} = acc;

    if (val.y !== undefined) {
      count = count + 1;
      sum += val.y;
      let mean = sum / count;
      res.push({x: val.x, mean});
    }
    else {
      res.push({x: val.x, mean: val.y});
    }

    return { sum, res };
  }, {
    sum: 0,
    res: []
  });

  return creds.res.map((row: any) => row.mean);
}

function calculatePercentageChange(values: any, period: any) {
  period = Number(period);

  let countAfter = 0;
  let result = [];
  let subArrVal = [];

  let data = values.map((ele: any, i: any) => {
    let res:any;

    if (ele.y !== undefined) {
      const subArr = values.slice(
        Math.max(i - period, 0),
        Math.min(i + countAfter + 1, values.length)
      );

      if (subArr.length === period) subArrVal.push(subArr);

      const lastIndexCurrent = subArr[subArr.length - 1];
      const prevIndex = subArr[0];

      if (i <= period) res = [ele.x, undefined];
      else res = [
        ele.x,
        Number((lastIndexCurrent.y - prevIndex.y) / Math.abs(prevIndex.y))
      ];

      result.push(Number(
        (Number(lastIndexCurrent.y) - Number(prevIndex.y)) /
        Number(lastIndexCurrent.y))
      );
    }
    else {
      res = [ele.x, ele.y]
    }

    return res;
  });

  if (data && data.length > 0) {
    data = data.filter(Boolean);
  }

  return data.map((row: any) => row[1]);
}

function calculateLinearRegression(values: any, period = null) {
  let result = [];

  if (period === null) {
    // No period specified, use entire dataset
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, n = values.length;

    // Summing up all the necessary components for linear regression calculation
    values.forEach((ele:any) => {
      if (ele.y !== undefined) {
        sumX += ele.x;
        sumY += ele.y;
        sumXY += ele.x * ele.y;
        sumXX += ele.x * ele.x;
      }
    });

    // Calculating slope and intercept for the regression line
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculating the predicted y values for each x
    result = values.map((ele:any) => ({
      x: ele.x,
      y: ele.y !== undefined ? (slope * ele.x + intercept) : undefined
    }));
  }
  else {
    // Period specified, perform rolling regression
    values.forEach((ele:any, i:any) => {
      if (ele.y !== undefined && i >= period - 1) {
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        const subArr = values.slice(Math.max(i - period + 1, 0), i + 1);

        subArr.forEach(val => {
          sumX += val.x;
          sumY += val.y;
          sumXY += val.x * val.y;
          sumXX += val.x * val.x;
        });

        const slope = (period * sumXY - sumX * sumY) / (period * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / period;
        const predictedY = slope * ele.x + intercept;
        result.push({x: ele.x, y: predictedY});
      }
      else {
        result.push({x: ele.x, y: undefined});
      }
    });
  }

  return result.map((row: any) => row.y);
}

function calculateLinearRegressionLogTransform(values: any, period = null) {
  let result = [];

  const performRegression = (dataSet) => {
    let sumLnX = 0, sumLnY = 0, sumLnXLnY = 0, sumLnXLnX = 0, n = dataSet.length;

    dataSet.forEach(ele => {
      let lnX = Math.log(ele.x);
      let lnY = Math.log(ele.y);
      sumLnX += lnX;
      sumLnY += lnY;
      sumLnXLnY += lnX * lnY;
      sumLnXLnX += lnX * lnX;
    });

    if (n > 0) {
      const slope = (n * sumLnXLnY - sumLnX * sumLnY) / (n * sumLnXLnX - sumLnX * sumLnX);
      const intercept = (sumLnY - slope * sumLnX) / n;
      return { slope, intercept };
    }
    else {
      return null;
    }
  };

  if (period === null) {
    let filteredWindow = values.filter(ele => ele.y > 0 && ele.x > 0);
    let regressionParams = performRegression(filteredWindow.map(ele => ({ x: ele.x, y: ele.y })));

    if (regressionParams) {
      result = filteredWindow.map(ele => {
        const predictedLnY = regressionParams.slope * Math.log(ele.x) + regressionParams.intercept;
        return { x: ele.x, y: Math.exp(predictedLnY) };
      });
    }
  }
  else {
    for (let i = 0; i < values.length; i++) {
      if (i >= period - 1) {
        let window = values.slice(Math.max(i - period + 1, 0), i + 1);
        let filteredWindow = window.filter(ele => ele.y > 0 && ele.x > 0);
        let regressionParams = performRegression(filteredWindow.map(ele => ({ x: ele.x, y: ele.y })));

        if (regressionParams) {
          const predictedLnY = regressionParams.slope * Math.log(values[i].x) + regressionParams.intercept;
          result.push({ x: values[i].x, y: Math.exp(predictedLnY) });
        }
      }
    }
  }

  return result.map(ele => ele.y !== undefined ? ele.y : undefined);
}

function calculateExponentialRegression(values: any, period = null) {
  let result = [];

  const performRegression = (dataSet) => {
    let sumX = 0, sumLnY = 0, sumXY = 0, sumXX = 0, n = dataSet.length;

    dataSet.forEach(ele => {
      let lnY = Math.log(ele.y); // Assuming y is an array
      sumX += ele.x;
      sumLnY += lnY;
      sumXY += ele.x * lnY;
      sumXX += ele.x * ele.x;
    });

    const slope = (n * sumXY - sumX * sumLnY) / (n * sumXX - sumX * sumX);
    const intercept = (sumLnY - slope * sumX) / n;

    return { slope, intercept };
  };

  if (period === null) {
    let filteredWindow = values.filter(ele => ele.y > 0);
    let regressionParams = performRegression(filteredWindow);

    filteredWindow.forEach(ele => {
      const predictedLnY = regressionParams.slope * ele.x + regressionParams.intercept;
      const predictedY = Math.exp(predictedLnY);
      result.push({ x: ele.x, y: predictedY });
    });
  } else {
    for (let i = 0; i < values.length; i++) {
      if (i >= period - 1) {
        let window = values.slice(Math.max(i - period + 1, 0), i + 1).filter(ele => ele.y > 0);
        if (window.length > 0) {
          let regressionParams = performRegression(window);
          const predictedLnY = regressionParams.slope * values[i].x + regressionParams.intercept;
          const predictedY = Math.exp(predictedLnY);
          result.push({ x: values[i].x, y: predictedY });
        }
      }
    }
  }

  return result.map(ele => ele.y);
}

function calculateZScore(values:any, period = null) {
  let zScores = [];

  for (let i = 0; i < values.length; i++) {
    let window, sum = 0, count = 0, mean = 0, varianceSum = 0, stdDev = 0;

    if (period === null) {
      // Cumulative calculation
      window = values.slice(0, i + 1);
    }
    else {
      // Rolling window calculation
      if (i >= period - 1) {
        window = values.slice(Math.max(0, i - period + 1), i + 1);
      }
      else {
        // Not enough data points for the rolling window
        zScores.push({ x: values[i].x, y: undefined });
        continue;
      }
    }

    window.forEach(val => {
      if (val.y !== undefined) {
        sum += val.y;
        count++;
      }
    });

    if (count > 0) {
      mean = sum / count;
      window.forEach(val => {
        if (val.y !== undefined) {
          varianceSum += Math.pow(val.y - mean, 2);
        }
      });
      stdDev = Math.sqrt(varianceSum / (count - (period !== null ? 1 : 0)));
    }

    let zScore = count > 0 && stdDev > 0 && values[i].y !== undefined ? (values[i].y - mean) / stdDev : undefined;
    zScores.push({ x: values[i].x, y: zScore });
  }

  return zScores.map(ele => ele.y);
}

function calculateDifference(values: any, period: any) {
  period = Number(period);

  let countAfter = 0;
  let result = [];
  let subArrVal = [];

  let data = values.map((ele: any, i: any) => {
    let res:any;

    const subArr = values.slice(
      Math.max(i - period, 0),
      Math.min(i + countAfter + 1, values.length)
    );

    if (subArr.length === period) subArrVal.push(subArr);

    const lastIndexCurrent = subArr[subArr.length - 1];
    const prevIndex = subArr[0];

    if (i <= period) res = [ele.x, undefined];
    else res = [
      ele.x,
      Number(lastIndexCurrent.y - prevIndex.y)
    ];

    result.push(Number(
      Number(lastIndexCurrent.y) - Number(prevIndex.y))
    );

    return res;
  });

  if (data && data.length > 0) {
    data = data.filter(Boolean);
  }

  return data.map((row: any) => row[1]);
}

function calculateRSI(values: any, period: any) {
  period = Number(period);

  let rsiData: any = [];

  let countAfter = 0;
  values.map((ele: any, i: any) => {
    if (ele.y !== undefined) {
      const subArr = values.slice(
        Math.max(i - period, 0),
        Math.min(i + countAfter + 1, values.length)
      );

      let resOfRsi = calculateRSIIndicator(subArr, Number(period));
      rsiData.push([ele.x, resOfRsi]);
    }
    else {
      rsiData.push([ele.x, ele.y])
    }
  });

  if (rsiData && rsiData.length > 0) {
    rsiData = rsiData.filter(Boolean);
  }

  return rsiData;
}

function calculateRSIIndicator(values: any, _samples: any) {
  let profitAndLoss = [];

  for (let i = 0; i < values.length - 1; i++) {
    profitAndLoss.push(values[i + 1].y - values[i].y);
  }

  let avgGain = 0.0;
  let avgLoss = 0.0;

  for (let i = 0; i < _samples; i++) {
    let value = profitAndLoss[i];
    if (value >= 0) avgGain += value;
    else avgLoss += value * -1;
  }

  avgGain /= _samples;
  avgLoss /= _samples;

  for (let i = _samples; i < profitAndLoss.length; i++) {
    let value = profitAndLoss[i];
    if (value >= 0) {
      avgGain = (avgGain * (_samples - 1) + value) / _samples;
      avgLoss = (avgLoss * (_samples - 1)) / _samples;
    }
    else {
      value *= -1;
      avgLoss = (avgLoss * (_samples - 1) + value) / _samples;
      avgGain = (avgGain * (_samples - 1)) / _samples;
    }
  }

  let rs = avgGain / avgLoss;

  return 100 - (100 / (1 + rs));
}

function calculateMax(data1: any, data2: any) {
  let maxArray = data1.map((res: any, i: any) => {
    return Math.max(res, data2[i] === undefined ? 0 : data2[i]);
  });

  return [...maxArray];
}

function calculateMin(data1: any, data2: any) {
  let minArray = data1.map((res: any, i: any) => {
    return Math.min(res, data2[i] === undefined ? 0 : data2[i]);
  });

  return [...minArray];
}

function calculateCorrelationCoefficient(data1: any, data2: any, period: any) {
  let result = [];

  for (let i = 0; i < data1.length; i++) {
    let x = data1.slice(
      Math.max(i - (period - 1), 0),
      Math.min(i + 1, data1.length)
    );
    let y = data2.slice(
      Math.max(i - (period - 1), 0),
      Math.min(i + 1, data2.length)
    );
    let res = calculateCorrelationCoefficientForEntry(x, y, period);
    result.push(isNaN(res) ? undefined : res);
  }

  return result;
}

function calculateCorrelationCoefficientForEntry(X: any, Y: any, n: any) {
  let sum_X = 0, sum_Y = 0, sum_XY = 0;
  let squareSum_X = 0, squareSum_Y = 0;

  for (let i = 0; i < n; i++) {
    sum_X = sum_X + X[i];
    sum_Y = sum_Y + Y[i];
    sum_XY = sum_XY + X[i] * Y[i];
    squareSum_X = squareSum_X + X[i] * X[i];
    squareSum_Y = squareSum_Y + Y[i] * Y[i];
  }

  let corr = (n * sum_XY - sum_X * sum_Y) / Math.sqrt(
  (n * squareSum_X - sum_X * sum_X) *
    (n * squareSum_Y - sum_Y * sum_Y)
  );

  return corr;
}

function calculateStandardDeviation(data: any, period: any) {
  const result = [];

  for (let i = 0; i < data.length; i++) {
    let x = data.slice(
      Math.max(i - period, 0),
      Math.min(i + 1, data.length)
    );
    let newVal = undefined;
    try {newVal = std(...x);} catch (e) {}
    result.push(newVal);
  }

  return result;
}

function calculateMovingMedian(array: any, countBefore: any) {
  const result = [];

  for (let i = 0; i < array.length; i++) {
    const subArr = array.slice(
      Math.max(i - countBefore, 0),
      Math.min(i + 1, array.length)
    );
    const mid = Math.floor(subArr.length / 2);
    const nums = [...subArr].sort((a, b) => a - b);
    const avg = subArr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
    result.push(avg);
  }

  return result;
}

function calculateSummation(array: any, period: any) {
  let countAfter = 0;

  const result = [];
  for (let i = 0; i < array.length; i++) {
    let subArr = array.slice(
      Math.max(i - period, 0),
      Math.min(i + countAfter + 1, array.length)
    );
    let sum = subArr.reduce((a: any, b: any) => a + (isNaN(b) ? 0 : b), 0);
    result.push(sum);
  }

  return result;
}

function calculateShift(array: any, period: any) {
  let newData = [];

  // sort array
  array.sort((a: any, b: any) => a.x - b.x);

  // move data points forward by the period
  for (let i = 0; i < array.length; i++) {
    newData.push({
      x: array[i].x + period * 24 * 60 * 60 * 1000,
      y: array[i].y
    });
  }

  newData.sort((a: any, b: any) => a.x - b.x);

  return newData;
}

function calculateIFStatement(
  data1: any,
  comparison: any,
  data2: any,
  trueData: any,
  falseData: any
) {
  let operators = ["=", "!=", ">", "<", ">=", "<="];
  if (!operators.includes(comparison)) return falseData;

  return data1.map((data1Value: any, index: any) => {
    let data2Value = data2[index];
    data1Value = parseFloat(data1Value);
    data2Value = parseFloat(data2Value);
    if (data1Value === undefined || isNaN(data1Value)) return undefined;
    if (data2Value === undefined || isNaN(data2Value)) return undefined;

    let trueValue = trueData[index] === undefined ? undefined : trueData[index];
    let falseValue = falseData[index] === undefined ? undefined : falseData[index];

    if (comparison === "!=") {
      return data1Value !== data2Value ? trueValue : falseValue;
    }
    else if (comparison === ">") {
      return data1Value > data2Value ? trueValue : falseValue;
    }
    else if (comparison === "<") {
      return data1Value < data2Value ? trueValue : falseValue;
    }
    else if (comparison === ">=") {
      return data1Value >= data2Value ? trueValue : falseValue;
    }
    else if (comparison === "<=") {
      return data1Value <= data2Value ? trueValue : falseValue;
    }
    else if (comparison === "=") {
      return data1Value === data2Value ? trueValue : falseValue;
    }
    else {
      return falseValue;
    }
  });
}
