import { addNumberSuffixes, addThousandsSeparators, addSymbol } from './numberFormatting';

export const formatKeys = (metricsKeyMap, seriesIDMap, key) => {
	let foundItem = null;

	if (metricsKeyMap) foundItem = metricsKeyMap[key];
	if (!foundItem && seriesIDMap) foundItem = seriesIDMap[key];

	if (foundItem && foundItem.name) return foundItem.name;
	else {
    if (key === 'cs') return 'Circulating Supply';
    if (key === 'mc') return 'Market Cap';
    if (key === 'volume') return 'Volume';
    if (key === 'TCI') return 'TCI';
    if (key === 'TCI_CV') return 'TCI Critical Level';
    if (key === 'MCM') return 'Market Cycle Model';
    if (key === 'MBI') return 'MBI';
    if (key === 'MDC_CV') return 'MDC';
    if (key === 'UDPI_S') return 'UDPI Short';
    if (key === 'UDPI_M') return 'UDPI Medium';
    if (key === 'UDPI_L') return 'UDPI Long';

    return key;
  }
}

export const formatTooltipValues = (metricsKeyMap, metricKey, value) => {
  let metricData = {display_type: 'formula'};
  if (metricKey === 'label') metricData.display_type = 'label';

  let foundItem = metricsKeyMap[metricKey];
  if (foundItem) metricData = foundItem;

  let textValue;

  if (value === undefined || value === null) {
    textValue = 'N/A';
  }
  else if (metricData.display_type === 'text') {
    textValue = value;
  }
  else {
    let number = parseFloat(value);
    if (isNaN(number)) textValue = 'N/A';
    else {
      textValue = addNumberSuffixes(number, metricData);
      textValue = addThousandsSeparators(textValue);
      textValue = addSymbol(metricData, textValue);
    }
  }

  return textValue;
}

export const formatDate = (date) => {
  let dateWithoutDay = date.match(/\b[\w']+(?:[^\w\n]+[\w']+){0,3}\b/g);
  return dateWithoutDay[0];
};
