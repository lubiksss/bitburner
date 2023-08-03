/** @param {NS} ns */


/** @param {import(".").NS } ns */
export async function main(ns) {
  const info = ns.gang.getGangInformation()
  ns.tprint(info.wantedPenalty)
}

