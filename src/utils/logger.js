import {getKoreanTime} from "/src/utils/time.js";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const logger = new Logger(ns);
  logger.info("Hello, world!");
  logger.warn("Hello, world!");
  logger.error("Hello, world!");
}

export class Logger {
  LEVEL_PAD_LENGTH = 5;
  PAD_CHARACTER = ` `;

  COLOR_RED = '\x1b[31m';
  COLOR_GREEN = '\x1b[32m';
  COLOR_YELLOW = '\x1b[33m';
  COLOR_BLUE = '\x1b[34m';
  COLOR_MAGENTA = '\x1b[35m';
  COLOR_RESET = '\x1b[0m';

  constructor(ns, logPath = "/log/combined.txt", specificLogPath = "/log/specific.txt") {
    this.combinedLogLevels = ['info', 'warn'];
    this.specificLogLevels = ['error'];
    this.ns = ns;
    this.logPath = logPath;
    this.specificLogPath = specificLogPath;
  }

  log(level, color, ...args) {
    const timestamp = getKoreanTime();
    const levelMessage = level.toUpperCase().padEnd(this.LEVEL_PAD_LENGTH, this.PAD_CHARACTER);
    const logMessage = `[${timestamp}] [${levelMessage}]: ${args.join(' ')}\n`;
    const noLevelLogMessage = `[${timestamp}]: ${args.join(' ')}\n`;

    const coloredLevelMessage = `${color}${levelMessage}${this.COLOR_RESET}`;
    const coloredLogMessage = `[${timestamp}] [${coloredLevelMessage}]: ${args.join(' ')}\n`;

    if (level === 'info' || level === 'error') {
      this.ns.print(logMessage);
      this.ns.tprint(coloredLogMessage);
    } else if (level === 'warn') {
      this.ns.print(logMessage);
    } else if (level === 'mon') {
      this.ns.print(noLevelLogMessage);
    }

    // if (this.combinedLogLevels.includes(level)) {
    //   this.ns.write(this.logPath, logMessage, 'a');
    // }
    if (this.specificLogLevels.includes(level)) {
      this.ns.write(this.specificLogPath, logMessage, 'a');
    }
  }

  info(...args) {
    this.log('info', this.COLOR_BLUE, ...args);
  }

  warn(...args) {
    this.log('warn', this.COLOR_YELLOW, ...args);
  }

  error(...args) {
    this.log('error', this.COLOR_RED, ...args);
  }

  mon(...args) {
    this.log('mon', null, ...args);
  }
}






