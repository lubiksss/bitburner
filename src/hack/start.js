import {Logger} from "src/utils/logger";

/** @param {NS} ns */
/** @param {import(".").NS } ns */

export async function main(ns) {
  const data = ns.flags([
    ['doSetup', false],
    ['doServer', false],
    ['doExp', false],
    ['doHack', false],
    ['doHwgw', false],
    ['doHwgwH', false],
    ['extraHomeRamRatio', 0.05],
    ['maxPurchaseServerSize', 1024],
    ['targetHackLevel', 100],
  ])
  const DO_SETUP = data.doSetup
  const DO_PURCHASE_SERVER = data.doServer
  const DO_FARM_EXP = data.doExp
  const DO_HACK = data.doHack
  const DO_Hwgw = data.doHwgw
  const DO_HwgwH = data.doHwgwH
  const EXTRA_HOME_RAM_RATIO = data.extraHomeRamRatio
  const MAX_PURCHASE_SERVER_SIZE = data.maxPurchaseServerSize
  const TARGET_HACK_LEVEL = data.targetHackLevel

  const ROOT_SRC = '/src/hack'
  const ROOT_WATCHER_SRC = '/src/watcher'
  const WATCHER_TARGETS = ['n00dles']

  const EXTRA_HOME_RAM = Math.max(5, ns.getServerMaxRam('home') * EXTRA_HOME_RAM_RATIO)

  const logger = new Logger(ns)

  const runningScripts = ns.ps('home')
    .filter((script) => !script.filename.includes("start"))
    .map((script) => script.pid)
  runningScripts.forEach((pid) => {
    ns.closeTail(pid)
    ns.kill(pid, 'home')
  })


  logger.info(`Start watcher`)
  WATCHER_TARGETS.forEach((WATCHER_TARGET) => {
    ns.run(`${ROOT_WATCHER_SRC}/tailWatcher.js`, 1, WATCHER_TARGET)
    ns.tail(`${ROOT_WATCHER_SRC}/tailWatcher.js`, "home", WATCHER_TARGET)

    const target = ns.ps('home')
      .filter((script) => script.filename.includes("tailWatcher") && script.args.includes(WATCHER_TARGET))
      .map((script) => script.pid)[0]

    ns.resizeTail(290, 395, target)
    ns.moveTail(1650, 5, target)
  })

  if (DO_SETUP) {
    logger.info(`Start setup process`)
    ns.exec(`${ROOT_SRC}/run-setup.js`, "home", 1)
  }

  if (DO_PURCHASE_SERVER) {
    logger.info(`Start server purchase process`)
    ns.exec(`${ROOT_SRC}/run-server.js`, "home", 1, MAX_PURCHASE_SERVER_SIZE)
    ns.tail(`${ROOT_SRC}/run-server.js`, "home", MAX_PURCHASE_SERVER_SIZE)

    const target = ns.ps('home')
      .filter((script) => script.filename.includes("run-server") && script.args.includes(MAX_PURCHASE_SERVER_SIZE))
      .map((script) => script.pid)[0]

    ns.resizeTail(590, 200, target)
    ns.moveTail(1538, 445, target)
  }

  if (DO_FARM_EXP) {
    logger.info(`Start exp process`)
    ns.exec(`${ROOT_SRC}/run-exp.js`, "home", 1, EXTRA_HOME_RAM, TARGET_HACK_LEVEL)
  }

  if (DO_HACK) {
    logger.info(`Start hack process`)
    ns.exec(`${ROOT_SRC}/run-hack.js`, "home", 1, EXTRA_HOME_RAM)
  }
  if (DO_Hwgw) {
    logger.info(`Start hwgw process`)
    ns.exec(`${ROOT_SRC}/run-hwgw.js`, "home", 1, EXTRA_HOME_RAM)
  }
  if (DO_HwgwH) {
    logger.info(`Start hwgw home process`)
    ns.exec(`${ROOT_SRC}/run-hwgw-home.js`, "home", 1, EXTRA_HOME_RAM)
  }
}

export function autocomplete(data, args) {
  const serverSizes = [...Array(21).keys()].map((i) => Math.pow(2, i))
  return [
    "--doSetup",
    "--doServer",
    "--doExp",
    "--doHack",
    "--doHwgw",
    "--doHwgwH",
    "--extraHomeRamRatio",
    "--maxPurchaseServerSize",
    "--targetHackLevel",
    ...serverSizes
  ]
}
