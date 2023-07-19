import {Logger} from "/src/utils/logger";
import {ceil} from "src/utils/formatter";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const EXTRA_HOME_RAM = 20

  const logger = new Logger(ns)
  const ROOT_SRC = '/src/hack/basic'
  const GROW_SEC_MULTIPLIER = 0.004
  const WEAKEN_SEC_MULTIPLIER = 0.05
  const HACK_MONEY_MULTIPLIER = 0.9
  const INTERVAL_TIME = 50

  const targetServer = 'n00dles'

  const hackTime = ns.getHackTime(targetServer)
  const growTime = ns.getGrowTime(targetServer)
  const weakenTime = ns.getWeakenTime(targetServer)

  const neededRamToHack = ns.getScriptRam(`${ROOT_SRC}/hack.js`)
  const neededRamToGrow = ns.getScriptRam(`${ROOT_SRC}/grow.js`)
  const neededRamToWeaken = ns.getScriptRam(`${ROOT_SRC}/weaken.js`)

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

  // https://bitburner.readthedocs.io/en/latest/advancedgameplay/hackingalgorithms.html?highlight=hwgw#batch-algorithms-hgw-hwgw-or-cycles
  const availableServer = "home"
  const serverRam = ns.getServerMaxRam(availableServer)
  const usedRam = ns.getServerUsedRam(availableServer)
  const availableRam = availableServer === "home" ? serverRam - usedRam - EXTRA_HOME_RAM : serverRam - usedRam

  const neededRam =
    hackThreadChanceMax * neededRamToHack
    + growthThread * neededRamToGrow
    + weakenThreadAfterGrow * neededRamToWeaken

  if (availableRam >= neededRam) {
    ns.exec(`${ROOT_SRC}/weaken.js`, "home", weakenThreadAfterGrow, targetServer)
    await ns.sleep(INTERVAL_TIME * 2)

    ns.exec(`${ROOT_SRC}/weaken.js`, "home", weakenThreadAfterGrow, targetServer)
    await ns.sleep(weakenTime - growTime - INTERVAL_TIME)

    ns.exec(`${ROOT_SRC}/grow.js`, "home", growthThread, targetServer)
    await ns.sleep(growTime - hackTime - (INTERVAL_TIME * 2))

    ns.exec(`${ROOT_SRC}/hack.js`, "home", hackThreadChanceMax, targetServer)
    // after this code sleep at least 3 interval
  } else {
    ns.tprint("There is not enough RAM to hack")
  }
}