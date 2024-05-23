const formulaDefinitions = {
  'sma': {
    formula: 'sma(m1,7)',
    tooltip: 'Simple Moving Average'
  },
  'ema': {
    formula: 'ema(m1,7)',
    tooltip: 'Exponential Moving Average'
  },
  'median': {
    formula: 'median(m1,7)',
    tooltip: 'Median'
  },
  'sum': {
    formula: 'sum(m1,7)',
    tooltip: 'Summation'
  },
  'cummean': {
    formula: 'cummean(m1)',
    tooltip: 'Cumulative Mean'
  },
  'cumstd': {
    formula: 'cumstd(m1)',
    tooltip: 'Cumulative Standard Deviation'
  },
  'cumsum': {
    formula: 'cumsum(m1)',
    tooltip: 'Cumulative Summation'
  },
  'std': {
    formula: 'std(m1,7)',
    tooltip: 'Standard Deviation'
  },
  'percentage_change': {
    formula: 'percentage_change(m1,7)',
    tooltip: 'Percentage Change'
  },
  'diff': {
    formula: 'diff(m1,7)',
    tooltip: 'Difference'
  },
  'log': {
    formula: 'log(m1)',
    tooltip: 'Logarithm'
  },
  'pow': {
    formula: 'pow(m1,2)',
    tooltip: 'Power'
  },
  'abs': {
    formula: 'abs(m1)',
    tooltip: 'Absolute Value'
  },
  'range': {
    formula: 'range(m1)',
    tooltip: 'Range'
  },
  'rsi': {
    formula: 'rsi(m1,7)',
    tooltip: 'Relative Strength Index'
  },
  'max': {
    formula: 'max(m1,m2)',
    tooltip: 'Maximum'
  },
  'min': {
    formula: 'min(m1,m2)',
    tooltip: 'Minimum'
  },
  'shift': {
    formula: 'shift(m1,7)',
    tooltip: 'Shift'
  },
  'corr': {
    formula: 'corr(m1,m2,7)',
    tooltip: 'Correlation Coefficient'
  },
  'sqrt': {
    formula: 'sqrt(m1)',
    tooltip: 'Square Root'
  },
  'if': {
    formula: 'if(m1,>,m2,m1,0)',
    tooltip: 'If'
  },
  'linreg': {
    formula: 'linreg(m1,7)',
    tooltip: 'Rolling linear regression performed on the selected series, over period n'
  },
  'athpc': {
    formula: 'athpc(m1)',
    tooltip: 'All Time High Percentage Change'
  },
  'z_score': {
    formula: 'z_score(m1)',
    tooltip: 'Z Score'
  }
};

export default formulaDefinitions;
