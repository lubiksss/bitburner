/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
}

const FRACTION_DIGITS = 3;

export function formatTime(number) {
  return (number / 1000).toFixed(FRACTION_DIGITS);
}

export function floor(number) {
  return Math.floor(number);
}

export function ceil(number) {
  return Math.ceil(number);
}

export function formatFloat(number) {
  return (number).toFixed(FRACTION_DIGITS)
}

export function formatMoney(number) {
  if (number >= 1e9) {
    return (number / 1e9).toFixed(FRACTION_DIGITS) + 'g';
  } else if (number >= 1e3) {
    return (number / 1e6).toFixed(FRACTION_DIGITS) + 'm';
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(FRACTION_DIGITS) + 'k';
  } else {
    return number.toFixed(FRACTION_DIGITS).toString();
  }
}
