import {Logger} from "src/utils/logger";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const ROOT_SRC = '/src/hack'
  const logger = new Logger(ns)

  if (ns.isRunning('run-setup.js', 'home')) {
    ns.exit()
  }

  logger.info(`Start setup process`)
  ns.exec(`${ROOT_SRC}/run-setup.js`, "home", 1)

  logger.info(`Start hack process`)
  ns.exec(`${ROOT_SRC}/run-hack.js`, "home", 1)
}
