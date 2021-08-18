const operators = {
  add: '+',
  sub: '-',
  div: '/',
  mlt: '*',
};

const precedence = {
  [operators.add]: 1,
  [operators.sub]: 1,
  [operators.div]: 2,
  [operators.mlt]: 2,
};

const operations = {
  [operators.add]: (a, b) => a + b,
  [operators.sub]: (a, b) => a - b,
  [operators.mlt]: (a, b) => a * b,
  [operators.div]: (a, b) => {
    if (b === 0) {
      throw 'TypeError: Division by zero.';
    }
    return a / b;
  },
};

function expressionCalculator(exp) {
  if (!checkPairedBrackets(exp)) {
    throw 'ExpressionError: Brackets must be paired';
  }

  const numbersStack = [];
  const operatorsStack = [];
  const arrayExpr = makeExprArray(exp);

  for (let i = 0; i < arrayExpr.length; i++) {
    if (
      operatorsStack.length > 1 &&
      precedence[operatorsStack[operatorsStack.length - 1]] &&
      precedence[operatorsStack[operatorsStack.length - 2]] &&
      precedence[operatorsStack[operatorsStack.length - 1]] ===
        precedence[operatorsStack[operatorsStack.length - 2]]
    ) {
      const currentOperator = operatorsStack.splice(
        [operatorsStack.length - 2],
        1
      );
      const n1 = +numbersStack.pop();
      const n2 = +numbersStack.pop();
      const result = operations[currentOperator](n2, n1);
      numbersStack.push(result);
    }

    if (isFinite(arrayExpr[i])) {
      numbersStack.push(arrayExpr[i]);
    }
    if (precedence[arrayExpr[i]]) {
      if (
        operatorsStack.length === 0 ||
        operatorsStack[operatorsStack.length - 1] === '('
      ) {
        operatorsStack.push(arrayExpr[i]);
      } else if (
        precedence[arrayExpr[i]] >
        precedence[operatorsStack[operatorsStack.length - 1]]
      ) {
        operatorsStack.push(arrayExpr[i]);
      } else if (
        precedence[arrayExpr[i]] <=
        precedence[operatorsStack[operatorsStack.length - 1]]
      ) {
        const result = calcCurrentResult(numbersStack, operatorsStack);
        numbersStack.push(result);
        operatorsStack.push(arrayExpr[i]);
      }
    }

    if (arrayExpr[i] === '(') {
      operatorsStack.push(arrayExpr[i]);
    }
    if (arrayExpr[i] === ')') {
      while (operatorsStack[operatorsStack.length - 1] !== '(') {
        const result = calcCurrentResult(numbersStack, operatorsStack);
        numbersStack.push(result);
      }
      operatorsStack.pop();
    }
  }

  while (operatorsStack.length > 0) {
    const result = calcCurrentResult(numbersStack, operatorsStack);
    numbersStack.push(result);
  }

  return numbersStack[0];
}

function calcCurrentResult(st1, st2) {
  const currentOperator = st2.pop();
  const n1 = +st1.pop();
  const n2 = +st1.pop();
  return (result = operations[currentOperator](n2, n1));
}

function makeExprArray(exp) {
  input = exp.replace(/[^0-9*\/()\-+.]/g, '');
  const arr = input.split('');
  const newArr = [];
  let number = '';
  for (let i = 0; i < arr.length; i++) {
    if (isFinite(arr[i])) {
      number += arr[i];
    } else {
      newArr.push(number);
      newArr.push(arr[i]);
      number = '';
    }
  }
  newArr.push(number);
  return newArr.filter((item) => item !== '');
}

function checkPairedBrackets(exp) {
  const arrayExpr = makeExprArray(exp);
  let brackets = 0;
  for (let i = 0; i < arrayExpr.length; i++) {
    if (arrayExpr[i] === '(') {
      brackets++;
    }
    if (arrayExpr[i] === ')') {
      brackets--;
    }
  }
  return brackets === 0;
}

module.exports = {
  expressionCalculator,
};
