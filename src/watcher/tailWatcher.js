/** @param {NS} ns */
import {formatFloat, formatMoney, formatTime2} from "/src/utils/formatter";

/** @param {import(".").NS } ns */
export async function main(ns) {
  ns.disableLog('ALL')

  const targetServer = ns.args[0]

  while (true) {
    //TODO
    // connect joesguns;connect nectar-net;connect omega-net;connect johnson-ortho;connect I.I.I.I
    await ns.sleep(5)

    const currentMoney = formatMoney(ns.getServerMoneyAvailable(targetServer))
    const maxMoney = formatMoney(ns.getServerMaxMoney(targetServer))

    const minSecurityLevel = ns.getServerMinSecurityLevel(targetServer)
    const currentSecurityLevel = formatFloat(ns.getServerSecurityLevel(targetServer))

    const growthRate = ns.getServerGrowth(targetServer)
    const hackChance = formatFloat(ns.hackAnalyzeChance(targetServer))

    const hackTime = formatTime2(ns.getHackTime(targetServer))
    const growTime = formatTime2(ns.getGrowTime(targetServer))
    const weakTime = formatTime2(ns.getWeakenTime(targetServer))

    ns.print("=================")
    ns.print(targetServer)
    ns.print("=================")
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
