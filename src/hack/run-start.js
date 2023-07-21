import {Logger} from "/src/utils/logger";
import {
  getAvailableServers,
  getAvailableServerThreads,
  getMaxServerThreads,
  getProgramCnt,
  scanAll
} from "/src/utils/scan";

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

  if (ns.args > 0) {
    ns.exec(`${ROOT_SRC}/start.js`, "home", 1, ...ns.args)
  } else {
    ns.tail(`${ROOT_SRC}/run-start.js`, "home")
    const target = ns.ps('home')
      .filter((script) => script.filename.includes("run-start"))
      .map((script) => script.pid)[0]
    ns.resizeTail(590, 195, target)
    ns.moveTail(470, 0, target)

    const PORT_THRESHOLD = 4
    const THREAD_THRESHOLD = 1000
    const EXTRA_HOME_RAM = Math.max(5, ns.getServerMaxRam('home') * 0.1)
    const SCRIPT_RAM = 1.75

    let portCnt = getProgramCnt(ns)
    let servers = scanAll(ns)
    let availableServers = getAvailableServers(ns, servers)
    let availableThreads = getAvailableServerThreads(ns, availableServers, SCRIPT_RAM, EXTRA_HOME_RAM)

    if (portCnt < PORT_THRESHOLD || availableThreads < THREAD_THRESHOLD) {
      const args = ["--doSetup", "--doHack"]
      ns.exec(`${ROOT_SRC}/start.js`, "home", 1, ...args)
    }

    //TODO
    // buy all program

    while (portCnt < PORT_THRESHOLD || availableThreads < THREAD_THRESHOLD) {
      await ns.sleep(10000)
      portCnt = getProgramCnt(ns)
      availableServers = getAvailableServers(ns, servers)
      availableThreads = getMaxServerThreads(ns, availableServers, 1.75, EXTRA_HOME_RAM)
      logger.warn(`pCnt: ${portCnt}, maxThr: ${availableThreads}`)
    }

    if (true) {
      const args = ["--doSetup", "--doHwgw", "--doServer", "--maxPurchaseServerSize", "--1048576"]
      ns.exec(`${ROOT_SRC}/start.js`, "home", 1, ...args)
    }
  }
}