import {Logger} from "/src/utils/logger";
import {tail} from "/src/utils/tail";

/** @param {NS} ns */
/** @param {import(".").NS } ns */

export async function main(ns) {
  const data = ns.flags([
    ['doSetup', true],
    ['doServer', false],
    ['doExp', false],
    ['doShare', false],
    ['doHack', false],
    ['doHwgw', false],
    ['doHwgwH', false],
    ['extraHomeRamRatio', 0.05],
    ['maxPurchaseServerSize', 1048576],
    ['targetHackLevel', 5000],
    ['intervalTime', 100],
  ])
  const DO_SETUP = data.doSetup
  const DO_PURCHASE_SERVER = data.doServer
  const DO_FARM_EXP = data.doExp
  const DO_SHARE = data.doShare
  const DO_HACK = data.doHack
  const DO_Hwgw = data.doHwgw
  const DO_HwgwH = data.doHwgwH
  const EXTRA_HOME_RAM_RATIO = data.extraHomeRamRatio
  const MAX_PURCHASE_SERVER_SIZE = data.maxPurchaseServerSize
  const TARGET_HACK_LEVEL = data.targetHackLevel
  const INTERVAL_TIME = data.intervalTime

  const ROOT_SRC = '/src/hack'
  const ROOT_WATCHER_SRC = '/src/watcher'
  const WATCHER_TARGETS = ['n00dles']

  const EXTRA_HOME_RAM = Math.max(10, ns.getServerMaxRam('home') * EXTRA_HOME_RAM_RATIO)

  const logger = new Logger(ns)

  const runningScripts = ns.ps('home')
    .filter((script) => !script.filename.includes("start"))
    .map((script) => script.pid)
  runningScripts.forEach((pid) => {
    ns.closeTail(pid)
    ns.kill(pid, 'home')
  })


  if (DO_SETUP) {
    logger.info(`Start setup process`)
    ns.exec(`${ROOT_SRC}/run-setup.js`, "home", 1)
  }

  if (DO_SHARE) {
    logger.info(`Start share process`)
    ns.exec(`${ROOT_SRC}/run-share.js`, "home", 1, EXTRA_HOME_RAM)
  }

  if (DO_HACK) {
    logger.info(`Start hack process`)
    ns.exec(`${ROOT_SRC}/run-hack.js`, "home", 1, EXTRA_HOME_RAM)
    tail(ns, `${ROOT_SRC}/run-hack.js`, 683, 5, 1450, 438 + 130, EXTRA_HOME_RAM)
  }

  if (DO_Hwgw) {
    logger.info(`Start hwgw process`)
    ns.exec(`${ROOT_SRC}/run-hwgw.js`, "home", 1, EXTRA_HOME_RAM, INTERVAL_TIME)
    tail(ns, `${ROOT_SRC}/run-hwgw.js`, 683, 5, 1450, 438 + 130, EXTRA_HOME_RAM, INTERVAL_TIME)
  }

  if (DO_PURCHASE_SERVER) {
    logger.info(`Start server purchase process`)
    ns.exec(`${ROOT_SRC}/run-server.js`, "home", 1, MAX_PURCHASE_SERVER_SIZE)
  }

  if (DO_HwgwH) {
    logger.info(`Start hwgw home process`)
    ns.exec(`${ROOT_SRC}/run-hwgw-home.js`, "home", 1, EXTRA_HOME_RAM)
    tail(ns, `${ROOT_SRC}/run-hwgw-home.js`, 683, 10, 1450, 438 + 130 + 150, EXTRA_HOME_RAM)
  }

  if (DO_FARM_EXP) {
    logger.info(`Start exp process`)
    ns.exec(`${ROOT_SRC}/run-exp.js`, "home", 1, TARGET_HACK_LEVEL)
    tail(ns, `${ROOT_SRC}/run-exp.js`, 683, 3, 1450, 438 + 130 + 150 + 300, TARGET_HACK_LEVEL)
  }
}

export function autocomplete(data, args) {
  const serverSizes = [...Array(21).keys()].map((i) => Math.pow(2, i))
  return [
    "--doSetup",
    "--doServer",
    "--doExp",
    "--doHack",
    "--doShare",
    "--doHwgw",
    "--doHwgwH",
    "--extraHomeRamRatio",
    "--maxPurchaseServerSize",
    "--targetHackLevel",
    "--intervalTime",
    ...serverSizes
  ]
}
