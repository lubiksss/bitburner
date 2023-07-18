import {Logger} from "/src/utils/logger";

/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const logger = new Logger(ns)

  const ts = "n00dles"

  const anal = ns.hackAnalyze("n00dles")
  const anal1 = ns.hackAnalyzeChance("n00dles")
  const anal11 = ns.hackAnalyzeSecurity("n00dles")
  const maxMoney = ns.getServerMaxMoney("n00dles")
  const anal2 = ns.hackAnalyzeThreads("n00dles", maxMoney)

  ns.tprint(anal)
  ns.tprint(maxMoney)
  ns.tprint(anal2)

  const anal3 = ns.growthAnalyze(ts)
}