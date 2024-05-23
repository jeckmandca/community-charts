let formulaCategories = {
  oneNumberFormulas: {
    formulas: [
      'athpc',
      'log',
      'abs',
      'range',
      'cumsum',
      'csum',
      'cumstd',
      'cstd',
      'cummean',
      'cm',
      'cmean',
      'sqrt',
      'linreg',
      'lreg',
      'expreg',
      'ereg',
      'zs',
      'z_score',
      'treg',
      'lt',
      'logt'
    ],
    regex: "\\((\\-*\\d+\\.*\\d*)\\)"
  },

  twoNumberFormulas: {
    formulas: [
      'pow',
      'percent_change',
      'percentage_change',
      'pc',
      'exponent',
      'diff',
      'sma',
      'ema',
      'rsi',
      'shift',
      'std',
      'median',
      'med',
      'sum',
      'min',
      'max',
      'zs',
      'z_score',
      'linreg',
      'lreg',
      'expreg',
      'ereg',
      'treg'
    ],
    regex: "\\((\\-*\\d+\\.*\\d*),(\\-*\\d+\\.*\\d*)\\)"
  },

  threeNumberFormulas: {
    formulas: ['corr'],
    regex: "\\((\\-*\\d+\\.*\\d*),(\\-*\\d+\\.*\\d*),(\\-*\\d+\\.*\\d*)\\)"
  },

  ifFormula: {
    formulas: ['if'],
    regex: "\\((\\-*\\d+\\.*\\d*),(!=|>=|<=|>|<|=),(\\-*\\d+\\.*\\d*),(\\-*\\d+\\.*\\d*|na),(\\-*\\d+\\.*\\d*|na)\\)"
  }
};

let formulaRegexes = [];
Object.keys(formulaCategories).forEach(category => {
  let categoryData = formulaCategories[category];
  categoryData.formulas.forEach((formulaName:any) => {
    formulaRegexes.push(new RegExp("(" + formulaName + ")" + categoryData.regex, "gm"));
  });
});

export { formulaRegexes };
