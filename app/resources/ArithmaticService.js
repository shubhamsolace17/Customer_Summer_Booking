export const _checkIsNumberFloat = number => {
  if (Number(number) === number && number % 1 !== 0) {
    return _returnNumber2Decimal(number);
  } else {
    return number;
  }
};
const _returnNumber2Decimal = number => {
  return parseFloat(number.toFixed(2));
};

export const CommaToDot = value => {
  return value.replace(',', '.');
};
