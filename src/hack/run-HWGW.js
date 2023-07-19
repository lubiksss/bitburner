import {Logger} from "/src/utils/logger";
import {getAvailableServers, getAvailableServerThreads, scanAll} from "/src/utils/scan";
import {ceil, floor} from "/src/utils/formatter";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  ns.disableLog('ALL')

  const ROOT_SRC = '/src/hack/basic'
  const EXTRA_HOME_RAM = 20

  const INTERVAL_TIME = 50
  const GROW_SEC_MULTIPLIER = 0.004
  const WEAKEN_SEC_MULTIPLIER = 0.05
  const HACK_MONEY_MULTIPLIER = 0.9
  const SCRIPT_RAM = 1.75

  const logger = new Logger(ns)

  const servers = scanAll(ns)
  const neededRamToHack = ns.getScriptRam(`${ROOT_SRC}/hack.js`)
  const neededRamToGrow = ns.getScriptRam(`${ROOT_SRC}/grow.js`)
  const neededRamToWeaken = ns.getScriptRam(`${ROOT_SRC}/weaken.js`)

  while (true) {
    // const hackableServers = getHackableServers(ns, servers)
    const availableServers = getAvailableServers(ns, servers)

    // because of growth rate, first only hack n00dles server
    for (const targetServer of ['n00dles']) {

      const hackTime = ns.getHackTime(targetServer)
      const growTime = ns.getGrowTime(targetServer)
      const weakenTime = ns.getWeakenTime(targetServer)

      // don't use, because they are all 1.75(1.70)
      // const neededRamToHack = ns.getScriptRam(`${ROOT_SRC}/hack.js`)
      // const neededRamToGrow = ns.getScriptRam(`${ROOT_SRC}/grow.js`)
      // const neededRamToWeaken = ns.getScriptRam(`${ROOT_SRC}/weaken.js`)

      const currentMoney = ns.getServerMoneyAvailable(targetServer)
      const targetMoney = currentMoney * HACK_MONEY_MULTIPLIER
      const hackThread = ns.hackAnalyzeThreads(targetServer, targetMoney)
      const hackChance = ns.hackAnalyzeChance(targetServer)
      const hackThreadChanceMax = ceil(hackThread / hackChance)
      const aroseSecByHack = ns.hackAnalyzeSecurity(hackThreadChanceMax, targetServer)

      const minSecurityLevel = ns.getServerMinSecurityLevel(targetServer)
      const securityLevelAfterHack = ns.getServerSecurityLevel(targetServer) + aroseSecByHack
      const weakenThreadAfterHack = ceil((securityLevelAfterHack - minSecurityLevel) / WEAKEN_SEC_MULTIPLIER)

      const maxMoney = ns.getServerMaxMoney(targetServer)
      const moneyAfterHack = 1
      const growthThread = ceil(ns.growthAnalyze(targetServer, maxMoney / moneyAfterHack))
      // ns.growthAnalyze() function has a bug
      // const aroseSecByGrowth = ns.growthAnalyzeSecurity(1, targetServer)
      const aroseSecByGrowth = growthThread * GROW_SEC_MULTIPLIER

      const securityLevelAfterGrow = ns.getServerSecurityLevel(targetServer) + aroseSecByGrowth
      const weakenThreadAfterGrow = ceil((securityLevelAfterGrow - minSecurityLevel) / WEAKEN_SEC_MULTIPLIER)

      const hwgw = [hackThreadChanceMax, weakenThreadAfterHack, growthThread, weakenThreadAfterGrow]
      const neededThreads = hwgw.reduce((a, b) => a + b, 0)
      const availableServerThreads = getAvailableServerThreads(ns, availableServers, SCRIPT_RAM)

      const hwgwQue = hwgw.flatMap((num, i) => {
        if (i === 0) {
          return Array(num).fill('h')
        } else if (i === 1) {
          return Array(num).fill('wh')
        } else if (i === 2) {
          return Array(num).fill('g')
        } else if (i === 3) {
          return Array(num).fill('wg')
        }
      })

      if (availableServerThreads >= neededThreads) {
        for (const availableServer of availableServers) {
          const serverRam = ns.getServerMaxRam(availableServer)
          const usedRam = ns.getServerUsedRam(availableServer)
          const availableRam = availableServer === "home" ? serverRam - usedRam - EXTRA_HOME_RAM : serverRam - usedRam
          const availableThreads = floor(availableRam / SCRIPT_RAM)

          for (const _ of Array(availableThreads).fill(1)) {
            const neededFunc = hwgwQue.shift()

            if (neededFunc === 'h') {
              const delayHack = weakenTime - INTERVAL_TIME - hackTime
              ns.exec(`${ROOT_SRC}/hack.js`, availableServer, 1, targetServer, delayHack)
              // logger.info("hack")
            } else if (neededFunc === 'wh') {
              const delayFirstWeak = 0
              ns.exec(`${ROOT_SRC}/weaken.js`, availableServer, 1, targetServer, delayFirstWeak)
              // logger.info("weak hack")
            } else if (neededFunc === 'g') {
              const delayGrow = weakenTime + INTERVAL_TIME - growTime
              ns.exec(`${ROOT_SRC}/grow.js`, availableServer, 1, targetServer, delayGrow)
              // logger.info("grow")
            } else if (neededFunc === 'wg') {
              const delaySecondWeak = 2 * INTERVAL_TIME
              ns.exec(`${ROOT_SRC}/weaken.js`, availableServer, 1, targetServer, delaySecondWeak)
              // logger.info("weak grow")
            } else {
              break
            }
          }
        }
      }
      await ns.sleep(10 * INTERVAL_TIME)
    }
  }
}
