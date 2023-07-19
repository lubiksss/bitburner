/** @param {NS} ns */
import {formatFloat, formatMoney, formatTime} from "/src/utils/formatter";

/** @param {import(".").NS } ns */
export async function main(ns) {
  ns.disableLog('ALL')

  const targetServer = ns.args[0]

  while (true) {
    await ns.sleep(10)

    const currentMoney = formatMoney(ns.getServerMoneyAvailable(targetServer))
    const maxMoney = formatMoney(ns.getServerMaxMoney(targetServer))

    const minSecurityLevel = ns.getServerMinSecurityLevel(targetServer)
    const currentSecurityLevel = formatFloat(ns.getServerSecurityLevel(targetServer))

    const growthRate = ns.getServerGrowth(targetServer)
    const hackChance = formatFloat(ns.hackAnalyzeChance(targetServer))

    const hackTime = formatTime(ns.getHackTime(targetServer))
    const growTime = formatTime(ns.getGrowTime(targetServer))
    const weakTime = formatTime(ns.getWeakenTime(targetServer))

    ns.print(`currentMoney: ${currentMoney}`)
    ns.print(`maxMoney: ${maxMoney}`)
    ns.print("-----------------")
    ns.print(`minSecurityLevel: ${minSecurityLevel}`)
    ns.print(`currentSecurityLevel: ${currentSecurityLevel}`)
    ns.print("-----------------")
    ns.print(`growthRate: ${growthRate}`)
    ns.print(`hackChance: ${hackChance}`)
    ns.print("-----------------")
    ns.print(`hackTime: ${hackTime}`)
    ns.print(`growTime: ${growTime}`)
    ns.print(`weakTime: ${weakTime}`)
  }
}
