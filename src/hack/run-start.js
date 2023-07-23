import {Logger} from "/src/utils/logger";
import {tail} from "/src/utils/tail";
import {getAvailableServers, getProgramCnt, scanAll} from "/src/utils/scan";
import {formatMemory, formatMoney, formatPercent} from "/src/utils/formatter";

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

  const servers = scanAll(ns)

  if ((ns.args).length > 0) {
    ns.exec(`${ROOT_SRC}/start.js`, "home", 1, ...ns.args)
  } else {
    tail(ns, `${ROOT_SRC}/run-start.js`, 683, 4, 1450, 438)

    let levelFlag = Array(5).fill(0)
    let homeRamUsageQue = Array(10).fill(1)
    let serverRamUsageQue = Array(10).fill(1)

    while (true) {
      const availableServers = getAvailableServers(ns, servers)
      const availableServersExceptHome = availableServers.filter((server) => server !== 'home')

      const homeMaxRam = ns.getServerMaxRam('home')
      const homeUsedRam = ns.getServerUsedRam('home')
      const homeRamUsage = homeUsedRam / homeMaxRam
      homeRamUsageQue.shift()
      homeRamUsageQue.push(homeRamUsage)
      const avgHomeRamUsage = homeRamUsageQue.reduce((a, b) => a + b, 0) / homeRamUsageQue.length

      const serverMaxRam = availableServersExceptHome.map((server) => ns.getServerMaxRam(server)).reduce((a, b) => a + b, 0)
      const serverUsedRam = availableServersExceptHome.map((server) => ns.getServerUsedRam(server)).reduce((a, b) => a + b, 0)
      const serverRamUsage = serverUsedRam / serverMaxRam
      serverRamUsageQue.shift()
      serverRamUsageQue.push(serverRamUsage)
      const avgServerRamUsage = serverRamUsageQue.reduce((a, b) => a + b, 0) / serverRamUsageQue.length

      const serverMaxMoney = availableServersExceptHome.map((server) => ns.getServerMaxMoney(server)).reduce((a, b) => a + b, 0)
      const sererCurrentMoney = availableServersExceptHome.map((server) => ns.getServerMoneyAvailable(server)).reduce((a, b) => a + b, 0)

      const purchasedServers = ns.getPurchasedServers()
      const purchasedServersIndex = purchasedServers.findIndex(
        (server, index) => index !== 0 && server.split('-').pop() !== purchasedServers[index - 1].split('-').pop()
      )
      const purChasedLastServer = purchasedServersIndex === -1 ? purchasedServers.pop() : purchasedServers[purchasedServersIndex - 1]

      const pgmCnt = getProgramCnt(ns)

      const lvl1 = pgmCnt < 4
      const lvl2 = pgmCnt >= 4
      const lvl3 = pgmCnt >= 4 && avgServerRamUsage <= 0.3 && levelFlag[2] === 1
      const lvl4 = pgmCnt >= 4 && avgHomeRamUsage <= 0.1 && levelFlag[3] === 1

      if (lvl1 && levelFlag[1] === 0) {
        levelFlag[1] = 1
        const args = ["--doHack"]
        ns.exec(`${ROOT_SRC}/start.js`, "home", 1, ...args)
      }
      if (lvl2 && levelFlag[2] === 0) {
        levelFlag[2] = 1
        const args = ["--doHwgw", "--doServer"]
        ns.exec(`${ROOT_SRC}/start.js`, "home", 1, ...args)
      }
      if (lvl3 && levelFlag[3] === 0) {
        levelFlag[3] = 1
        const args = ["--doHwgw", "--doServer", "--intervalTime", 1]
        ns.exec(`${ROOT_SRC}/start.js`, "home", 1, ...args)
      }
      if (lvl4 && levelFlag[4] === 0) {
        levelFlag[4] = 1
        const args = ["--doHwgw", "--intervalTime", 1, "--doHwgwH"]
        ns.exec(`${ROOT_SRC}/start.js`, "home", 1, ...args)
      }

      ns.print(`[Home  ] ${formatMemory(homeUsedRam)}/${formatMemory(homeMaxRam)} | ${ns.getServer('home').cpuCores}Core | ${pgmCnt}Pgm`)
      ns.print(`[Server] ${formatMemory(serverUsedRam)}/${formatMemory(serverMaxRam)} | ${formatMoney(sererCurrentMoney)}/${formatMoney(serverMaxMoney)}`)
      ns.print(`[HomeRamUsg] ${formatPercent(avgHomeRamUsage)} | [ServerRamUsg] ${formatPercent(avgServerRamUsage)}`)
      ns.print(`[Purchased] ${purChasedLastServer} | [Level]: ${levelFlag.slice(1,)}`)

      await ns.sleep(1000)
    }
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
