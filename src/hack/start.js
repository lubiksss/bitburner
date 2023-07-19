import {Logger} from "src/utils/logger";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const data = ns.flags([
    ['doSetup', true],
    ['doPurchaseServer', true],
    ['doFarmExp', true],
    ['doHack', true],
    ['extraHomeRamRatio', 0.1],
    ['maxPurchaseServerSize', 8192],
    ['targetHackLevel', 500],
  ])
  const DO_SETUP = data.doSetup
  const DO_PURCHASE_SERVER = data.doPurchaseServer
  const DO_FARM_EXP = data.doFarmExp
  const DO_HACK = data.doHack
  const EXTRA_HOME_RAM_RATIO = data.extraHomeRamRatio
  const MAX_PURCHASE_SERVER_SIZE = data.maxPurchaseServerSize
  const TARGET_HACK_LEVEL = data.targetHackLevel

  const ROOT_SRC = '/src/hack'
  const ROOT_WATCHER_SRC = '/src/watcher'
  const WATCHER_TARGETS = ['n00dles']

  const EXTRA_HOME_RAM = Math.max(10, ns.getServerMaxRam('home') * EXTRA_HOME_RAM_RATIO)

  const logger = new Logger(ns)

  const runningScripts = ns.ps('home')
    .filter((script) => script.filename.includes("run") || script.filename.includes("watch"))
    .map((script) => script.pid)
  runningScripts.forEach((pid) => ns.kill(pid, 'home'))

  logger.info(`Start watcher`)
  WATCHER_TARGETS.forEach((WATCHER_TARGET) => {
    ns.run(`${ROOT_WATCHER_SRC}/tailWatcher.js`, 1, WATCHER_TARGET)
    ns.tail(`${ROOT_WATCHER_SRC}/tailWatcher.js`, "home", WATCHER_TARGET)
  })

  if (DO_SETUP) {
    logger.info(`Start setup process`)
    ns.exec(`${ROOT_SRC}/run-setup.js`, "home", 1)
  }

  if (DO_PURCHASE_SERVER) {
    logger.info(`Start server purchase process`)
    ns.exec(`${ROOT_SRC}/run-server.js`, "home", 1, MAX_PURCHASE_SERVER_SIZE)
  }

  if (DO_FARM_EXP) {
    logger.info(`Start exp process`)
    ns.exec(`${ROOT_SRC}/run-exp.js`, "home", 1, EXTRA_HOME_RAM, TARGET_HACK_LEVEL)
  }

  if (DO_HACK) {
    ns.kill(`${ROOT_SRC}/run-hwgw.js`, "home", EXTRA_HOME_RAM)
    logger.info(`Start hack process`)
    ns.exec(`${ROOT_SRC}/run-hwgw.js`, "home", 1, EXTRA_HOME_RAM)
  }
}
