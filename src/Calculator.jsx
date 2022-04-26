import React, { useEffect, useState } from 'react';
import InputField from './components/InputField';
import ResultField from './components/ResultField';
import { OPERAND_ERROR_VALUE, OPERAND_MAX_LENGTH, STORAGE_KEY } from './constants';
import { operation } from './util';

function Calculator() {
  const [expression, setExpression] = useState(initialExpression);

  const initialExpression = localStorage.getItem(STORAGE_KEY)
    ? JSON.parse(localStorage.getItem(STORAGE_KEY))
    : {
        firstOperand: '',
        secondOperand: '',
        operator: '',
      };

  const saveResult = (e) => {
    e.preventDefault();
    e.returnValue = '';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expression));
  };

  const updateOperandWithNewDigit = (newDigit) => {
    const { firstOperand, secondOperand, operator } = expression;
    if (operator === '') {
      if (isOverOperandMaxLength(firstOperand)) {
        return;
      }

      setExpression({
        ...expression,
        firstOperand: firstOperand === OPERAND_ERROR_VALUE ? newDigit : firstOperand + newDigit,
      });
      return;
    }

    if (isOverOperandMaxLength(secondOperand)) {
      return;
    }
    setExpression({
      ...expression,
      secondOperand: secondOperand + newDigit,
    });
  };

  const updateOperation = (newOperation) => {
    if (expression.firstOperand === OPERAND_ERROR_VALUE) return;

    if (newOperation === '=') {
      calculate();
      return;
    }

    if (expression.operator !== '') return;
    setExpression({
      ...expression,
      operator: newOperation,
    });
  };

  function isOverOperandMaxLength(number) {
    return number.length >= OPERAND_MAX_LENGTH;
  }

  function calculate() {
    const { firstOperand, secondOperand, operator } = expression;
    if (!operation[expression.operator]) return;

    const result = operation[operator](+firstOperand, +secondOperand);

    setExpression({
      firstOperand: Number.isFinite(result) ? String(result) : OPERAND_ERROR_VALUE,
      secondOperand: '',
      operator: '',
    });
  }

  function resetExpression() {
    setExpression({
      firstOperand: '',
      secondOperand: '',
      operator: '',
    });
  }

  useEffect(() => {
    window.addEventListener('beforeunload', saveResult);
    return () => {
      window.removeEventListener('beforeunload', saveResult);
    };
  });

  return (
    <div className="App">
      <div className="calculator">
        <ResultField expression={expression} />
        <InputField
          updateOperandWithNewDigit={updateOperandWithNewDigit}
          updateOperation={updateOperation}
          resetExpression={resetExpression}
        />
      </div>
    </div>
  );
}

export default Calculator;
