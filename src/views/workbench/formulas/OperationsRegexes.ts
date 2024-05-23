// operations with 1st level priority
let priority1Operations = [
  {
    // exponentiation, multiplication, division
    regex: /(\d+\.*\d*([\*|\/|\^]\-*\d+\.*\d*)+)/gm,
    matchGroup: 0
  },
  {
    // extract single number in parentheses
    regex: /\W*(\(\-*\d+\.*\d*\))/g,
    matchGroup: 1
  }
];

// operations with 2nd level priority
let priority2Operations = [
  {
    // addition, subtraction
    regex: /(\-*\d+\.*\d*([\+|\-]\-*\d+\.*\d*)+)/gm,
    matchGroup: 0
  },
  {
    // extract single number in parentheses
    regex: /\W*(\(\-*\d+\.*\d*\))/g,
    matchGroup: 1
  }
];

export { priority1Operations, priority2Operations };
