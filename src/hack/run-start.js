import {Logger} from "/src/utils/logger";
import {getAvailableServers, getMaxServerThreads, scanAll} from "/src/utils/scan";

/** @param {NS} ns */
/** @param {import("./index").NS } ns */
export async function main(ns) {
  ns.disableLog("ALL")
  const logger = new Logger(ns)

  const ROOT_SRC = '/src/hack'

  const runningScripts = ns.ps('home')
    .filter((script) => script.filename.includes("run-start"))
    .map((script) => script.pid)
  if (runningScripts.length > 1) {
    runningScripts.slice(0, 1).forEach((pid) => {
      ns.closeTail(pid)
      ns.kill(pid, 'home')
    })
  }

  if ((ns.args).length > 0) {
    ns.exec(`${ROOT_SRC}/start.js`, "home", 1, ...ns.args)
  } else {
    ns.tail(`${ROOT_SRC}/run-start.js`, "home")
    const target = ns.ps('home')
      .filter((script) => script.filename.includes("run-start"))
      .map((script) => script.pid)[0]
    ns.resizeTail(590, 195, target)
    ns.moveTail(470, 0, target)

    const PORT_THRESHOLD = 3
    const THREAD_THRESHOLD = 500
    const INTERVAL_THRESHOLD = 1024
    const HWGW_HOME_THRESHOLD = 8192

    const EXTRA_HOME_RAM = Math.max(5, ns.getServerMaxRam('home') * 0.1)
    const SCRIPT_RAM = 1.75

    let servers = scanAll(ns)
    let availableServers = getAvailableServers(ns, servers)
    let maxThreads = getMaxServerThreads(ns, availableServers, SCRIPT_RAM, EXTRA_HOME_RAM)

    let firstLevel = maxThreads > THREAD_THRESHOLD
    if (!firstLevel) {
      const args = ["--doSetup", "--doHack"]
      ns.exec(`${ROOT_SRC}/start.js`, "home", 1, ...args)
    }

    //TODO
    // buy all program

    while (!firstLevel) {
      await ns.sleep(10000)
      availableServers = getAvailableServers(ns, servers)
      maxThreads = getMaxServerThreads(ns, availableServers, 1.75, EXTRA_HOME_RAM)
      firstLevel = maxThreads > THREAD_THRESHOLD

      logger.warn(`maxThr: ${maxThreads}`)
    }

    let leastServerSize = 1
    let secondLevel = leastServerSize > INTERVAL_THRESHOLD

    if (!secondLevel) {
      const args = ["--doSetup", "--doHwgw", "--doServer", "--maxPurchaseServerSize", "1048576"]
      ns.exec(`${ROOT_SRC}/start.js`, "home", 1, ...args)
    }

    while (!secondLevel) {
      await ns.sleep(10000)
      leastServerSize = ns.getPurchasedServers().reverse().shift().split('-')[2]
      secondLevel = leastServerSize > INTERVAL_THRESHOLD

      logger.warn(`serverSize: ${leastServerSize}`)
    }

    const args = ["--doSetup", "--doHwgw", "--intervalTime", "1", "--doServer", "--maxPurchaseServerSize", "1048576"]
    ns.exec(`${ROOT_SRC}/start.js`, "home", 1, ...args)

    ns.closeTail(target)
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
