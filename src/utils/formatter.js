/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
}

const FRACTION_DIGITS = 3;

export function formatTime(number) {
  return (number / 1000).toFixed(FRACTION_DIGITS);
}

export function formatTime2(number) {
  return (number / 1000).toFixed(FRACTION_DIGITS * 2);
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
  if (number >= 1e15) {
    return (number / 1e15).toFixed(FRACTION_DIGITS) + 'q';
  } else if (number >= 1e12) {
    return (number / 1e12).toFixed(FRACTION_DIGITS) + 't';
  } else if (number >= 1e9) {
    return (number / 1e9).toFixed(FRACTION_DIGITS) + 'b';
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(FRACTION_DIGITS) + 'm';
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(FRACTION_DIGITS) + 'k';
  } else {
    return number.toFixed(FRACTION_DIGITS);
  }
}

export function formatCnt(number) {
  if (number >= 1e15) {
    return (number / 1e15).toFixed(FRACTION_DIGITS) + 'p';
  } else if (number >= 1e12) {
    return (number / 1e12).toFixed(FRACTION_DIGITS) + 't';
  } else if (number >= 1e9) {
    return (number / 1e9).toFixed(FRACTION_DIGITS) + 'g';
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(FRACTION_DIGITS) + 'm';
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(FRACTION_DIGITS) + 'k';
  } else {
    return number.toFixed(FRACTION_DIGITS).toString()
  }
}

export function formatPercent(number) {
  const COLOR_RED = '\x1b[31m';
  const COLOR_GREEN = '\x1b[32m';
  const COLOR_YELLOW = '\x1b[33m';
  const COLOR_BLUE = '\x1b[34m';
  const COLOR_MAGENTA = '\x1b[35m';
  const COLOR_RESET = '\x1b[0m';
  const percentString = (number * 100).toFixed(FRACTION_DIGITS) + '%';

  if (number > 0.9) {
    return COLOR_RED + percentString + COLOR_RESET;
  } else if (number > 0.75) {
    return COLOR_MAGENTA + percentString + COLOR_RESET;
  } else if (number > 0.5) {
    return COLOR_YELLOW + percentString + COLOR_RESET;
  } else if (number > 0.25) {
    return COLOR_BLUE + percentString + COLOR_RESET;
  } else {
    return COLOR_GREEN + percentString + COLOR_RESET;
  }
}

export function formatMemory(gibibytes) {
  const sizes = ['GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  if (gibibytes === 0) return '0 GiB';
  const i = parseInt(Math.floor(Math.log(gibibytes) / Math.log(1024)));
  const formattedSize = (gibibytes / Math.pow(1024, i)).toFixed(2);
  return `${formattedSize.padStart(6)}${sizes[i]}`;
}