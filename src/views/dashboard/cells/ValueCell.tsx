import React from 'react';
import { Link } from 'react-router-dom';

import {
  addNumberSuffixes,
  addSymbol,
  addThousandsSeparators
} from '../../../utils/numberFormatting';

const styles = {
  lightRed: {
    color: "#F6BDC0",
    fontSize: "17px",
    fontWeight: 400,
    fontFamily: "Space Grotesk"
  },
  darkRed: {
    color: "#e11149",
    fontSize: "17px",
    fontWeight: 400,
    fontFamily: "Space Grotesk"
  },
  lightGreen: {
    color: "#ABE098",
    fontSize: "17px",
    fontWeight: 400,
    fontFamily: "Space Grotesk"
  },
  darkGreen: {
    color: "#1edb8d",
    fontSize: "17px",
    fontWeight: 400,
    fontFamily: "Space Grotesk"
  },
  white: {
    color: "#FFFFFF",
    fontSize: "17px",
    fontWeight: 400,
    fontFamily: "Space Grotesk"
  }
};

const determineStyle = (metricData: any, data:any, number: any) => {
  let style:any;
  let colorCoding = metricData?.color_coding;
  if (!colorCoding) return styles.white;

  colorCoding = colorCoding.trim();

  function replaceFields(str: any, data: any) {
    return str.replace(/value\.(\w+)/g, function(match: any, field: any) {
      return data.hasOwnProperty(field) ? data[field] : match;
    });
  }

  colorCoding = replaceFields(colorCoding, data);

  let rule:any;
  if (colorCoding.startsWith('value')) {
    rule = 'let value = ' + number + ';';
    rule += 'return ' + colorCoding;
  }
  else if (colorCoding.startsWith('if')) {
    rule = 'let value = ' + number + ';';
    rule += ' ' + colorCoding;
  }
  else {
    rule = 'return ' + colorCoding;
  }

  if (rule) {
    let stylesText:any;
    stylesText = 'let lightRed = ' + JSON.stringify(styles.lightRed) + ';';
    stylesText += 'let darkRed = ' + JSON.stringify(styles.darkRed) + ';';
    stylesText += 'let lightGreen = ' + JSON.stringify(styles.lightGreen) + ';';
    stylesText += 'let darkGreen = ' + JSON.stringify(styles.darkGreen) + ';';
    stylesText += 'let white = ' + JSON.stringify(styles.white) + ';';

    rule = `(function() { ${stylesText + rule} })()`;

    try {
      style = eval(rule);
    }
    catch (e) {
      console.log('error evaluating color coding rule: ' + rule);
      console.log(e);
    }
  }

  if (!style) style = styles.white;

  return style;
}

const ValueCell: ({cellValue, data, metric, metricData}: {
  cellValue: any;
  data: any;
  metric: any;
  metricData: any;
}) => any = ({cellValue, data, metric, metricData}) => {
  let style:any;
  let textValue:any;

  if (cellValue === undefined || cellValue === null) {
    textValue = 'N/A';
  }
  else if (metricData.display_type === 'text') {
    textValue = cellValue;
  }
  else {
    let number = parseFloat(cellValue);
    if (isNaN(number)) textValue = 'N/A';
    else {
      style = determineStyle(metricData, data, number);
      textValue = addNumberSuffixes(number, metricData);
      textValue = addThousandsSeparators(textValue);
      textValue = addSymbol(metricData, textValue);
    }
  }

  if (metricData.show_on_workbench) {
    let stateObject = { coinData: data, metric: metric };
    if (metric === 'price') {
      delete stateObject.metric;
    }

    return (
      <>
        <Link to="/risk" state={stateObject}>
          <a style={style}>{textValue}</a>
        </Link>
      </>
    )
  }
  else {
    return (
      <>
        <span style={style}>{textValue}</span>
      </>
    )
  }
}

export default ValueCell;
