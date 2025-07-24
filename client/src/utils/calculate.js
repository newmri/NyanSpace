export function toNumber(num) {
  const parsedNum = parseFloat(num);
  return isNaN(parsedNum) ? 0 : parsedNum;
}

export function displayValue(num) {
  return 0 === num ? "" : num;
}

export function formatNumber(num, digits = 2) {
  if ("" === num || null === num || isNaN(num)) return "";
  const str = num.toString();
  if (str.includes(".")) {
    const decimalPart = str.split(".")[1];
    if (decimalPart.length > digits) {
      return num.toFixed(digits);
    }
  }
  return num;
}
