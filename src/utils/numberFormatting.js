export const formatDecimals = (numberToFormat, providedDecimals, type) => {
  let formattedNumber = numberToFormat.toFixed(providedDecimals);
  if (type === 'long') {
    if ((numberToFormat > 0 && numberToFormat < 1) || (numberToFormat > -1 && numberToFormat < 0)) {
      let actualDecimals = (1 - Math.floor(Math.log(Math.abs(numberToFormat)) / Math.log(10))) + 1;
      if (actualDecimals < 0) actualDecimals = 0;
      if (actualDecimals > 100) actualDecimals = 100;
      formattedNumber = numberToFormat.toFixed(actualDecimals);
    }
  }
  else if (type === 'formula') {
    let actualDecimals = (1 - Math.floor(Math.log(Math.abs(numberToFormat)) / Math.log(10))) + 1;
    if (actualDecimals < 5) actualDecimals = 5;
    if (actualDecimals > 100) actualDecimals = 100;
    formattedNumber = numberToFormat.toFixed(actualDecimals);
    formattedNumber = formattedNumber.replace(/0+$/, '');
    formattedNumber = formattedNumber.replace(/\.$/, '');
  }
  if (type === 'label') {
    if (formattedNumber.includes('.00')) {
      formattedNumber = formattedNumber.replace('.00', '');
    }
  }

  return formattedNumber;
};


export const getSuffix = (number) => {
  let suffix = '';
  let scaledNumber = number;

  if (Math.abs(number) >= 1.0e12) {
    scaledNumber = number / 1.0e12;
    suffix = 'T';
  }
  else if (Math.abs(number) >= 1.0e9) {
    scaledNumber = number / 1.0e9;
    suffix = 'B';
  }
  else if (Math.abs(number) >= 1.0e6) {
    scaledNumber = number / 1.0e6;
    suffix = 'M';
  }
  else if (Math.abs(number) >= 1.0e3) {
    scaledNumber = number / 1.0e3;
    suffix = 'K';
  }

  return {
    suffix: suffix,
    scaledNumber: scaledNumber
  };
}

export const addNumberSuffixes = (number, metricData) => {
  let decimals = metricData?.decimals;
  if (decimals === undefined) decimals = 0;

  let textValue;

  if (metricData?.display_type === 'currency_long' ||
    metricData?.display_type === 'number_long') {
    textValue = formatDecimals(number, decimals, 'long');
  }
  else if (metricData?.display_type === 'formula') {
    if (number === 0) return '0';
    else if (number >= 1 || number <= -1) {
      textValue = formatDecimals(number, 2);
    }
    else {
      textValue = formatDecimals(number, decimals, 'formula');
    }
  }
  else if (metricData?.display_type === 'label') {
    if (number === 0) return '0';
    else if (number >= 1 || number <= -1) {
      let {suffix, scaledNumber} = getSuffix(number);
      textValue = formatDecimals(scaledNumber, 2, 'label') + suffix;
    }
    else {
      textValue = formatDecimals(number, decimals, 'formula');
    }
  }
  else {
    let {suffix, scaledNumber} = getSuffix(number);
    textValue = formatDecimals(scaledNumber, decimals) + suffix;
  }

  return textValue;
}

export const addThousandsSeparators = (textValue) => {
  let parts = textValue.split('.');
  let whole = parts[0];
  let decimal = parts[1];
  let rgx = /(\d+)(\d{3})/;
  while (rgx.test(whole)) {
    whole = whole.replace(rgx, '$1' + ',' + '$2');
  }
  textValue = whole;
  if (decimal) textValue += '.' + decimal;

  return textValue;
}

export const addSymbol = (metricData, textValue) => {
  if (metricData.display_type === 'percentage') {
    textValue = textValue + '%';
  }
  else if (metricData.display_type === 'currency' ||
    metricData.display_type === 'currency_long') {
    textValue = '$' + textValue;
  }

  return textValue;
}

export const extractNumber = (number) => {
  number = number.replace(/,/g, '');
  number = number.replace(/\$/g, '');
  number = number.replace(/</g, '');
  number = number.replace(/>/g, '');

  if (number.includes('T'))
    number = Number(number.replace('T', '')) * 1000000000000;
  else if (number.includes('B'))
    number = Number(number.replace('B', '')) * 1000000000;
  else if (number.includes('M'))
    number = Number(number.replace('M', '')) * 1000000;
  else if (number.includes('K'))
    number = Number(number.replace('K', '')) * 1000;
  else number = Number(number);

  return number;
}
