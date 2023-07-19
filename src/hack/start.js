import {Logger} from "src/utils/logger";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const ROOT_SRC = '/src/hack'
  const ROOT_WATCHER_SRC = '/src/watcher'
  const WATCHER_TARGET = 'n00dles'
  const logger = new Logger(ns)

  if (ns.isRunning('start.js', 'home')) {
    ns.exit()
  }
  logger.info(`Start watcher`)
  ns.run(`${ROOT_WATCHER_SRC}/tailWatcher.js`, 1, WATCHER_TARGET)
  ns.tail(`${ROOT_WATCHER_SRC}/tailWatcher.js`, "home", WATCHER_TARGET)

  logger.info(`Start setup process`)
  ns.exec(`${ROOT_SRC}/run-setup.js`, "home", 1)

  logger.info(`Start server purchase process`)
  ns.exec(`${ROOT_SRC}/run-server.js`, "home", 1)

  logger.info(`Start exp process`)
  ns.exec(`${ROOT_SRC}/run-exp.js`, "home", 1)

  do {
    await ns.sleep(5000)
  } while (ns.isRunning(`${ROOT_SRC}/run-exp.js`, 'home'))

  logger.info(`Start hack process`)
  ns.exec(`${ROOT_SRC}/run-hwgw.js`, "home", 1)
}
