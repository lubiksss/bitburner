/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  ns.disableLog('ALL')

  const targetServer = ns.args[0]

  while (true) {
    await ns.sleep(100)

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

function formatTime(number) {
  return (number / 1000).toFixed(3);
}

function formatFloat(number) {
  return (number).toFixed(3);
}

function formatMoney(number) {
  const fractionDigits = 3;
  if (number >= 1e9) {
    return (number / 1e9).toFixed(fractionDigits) + 'g';
  } else if (number >= 1e3) {
    return (number / 1e6).toFixed(fractionDigits) + 'm';
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(fractionDigits) + 'k';
  } else {
    return number.toFixed(fractionDigits).toString();
  }
}
