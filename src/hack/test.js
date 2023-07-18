import {Logger} from "/src/utils/logger";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const logger = new Logger(ns)

  const ts = "n00dles"

  const maxMoney = ns.getServerMaxMoney(ts)
  const currentMoney = ns.getServerMoneyAvailable(ts)
  const maxThread = ns.hackAnalyzeThreads(ts, currentMoney)
  const hackChance = ns.hackAnalyzeChance(ts)
  const chanceMaxThread = maxThread / hackChance
  const aroseSecByHack = ns.hackAnalyzeSecurity(chanceMaxThread, ts)
  const hackTime = ns.getHackTime(ts)

  ns.tprint(`maxMoney: ${maxMoney}`)
  ns.tprint(`maxThread: ${maxThread}`)
  ns.tprint(`hackChance: ${hackChance}`)
  ns.tprint(`chanceMaxThread: ${chanceMaxThread}`)
  ns.tprint(`aroseSecByHack: ${aroseSecByHack}`)
  ns.tprint(`hackTime: ${hackTime}`)

  const growthThread = ns.growthAnalyze(ts, maxMoney / currentMoney)
  const aroseSecByGrowth = ns.growthAnalyzeSecurity(1, ts)
  const growTime = ns.getGrowTime(ts)

  ns.tprint(`currentMoney: ${currentMoney}`)
  ns.tprint(`growthThread: ${growthThread}`)
  ns.tprint(`aroseSecByGrowth: ${aroseSecByGrowth}`)
  ns.tprint(`growTime: ${growTime}`)


  const minSecurityLevel = ns.getServerMinSecurityLevel(ts)
  const currentSecurityLevel = ns.getServerSecurityLevel(ts)
  const weakenThread = (currentSecurityLevel - minSecurityLevel) / 0.05
  const weakenTime = ns.getWeakenTime(ts)

  ns.tprint(`minSecurityLevel: ${minSecurityLevel}`)
  ns.tprint(`currentSecurityLevel: ${currentSecurityLevel}`)
  ns.tprint(`weakenThread: ${weakenThread}`)
  ns.tprint(`weakenTime: ${weakenTime}`)
}