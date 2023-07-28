/** @param {NS} ns */


/** @param {import(".").NS } ns */
export async function main(ns) {
  const bitNodeMulti = ns.getBitNodeMultipliers()
  ns.tprint(`bitNodeMulti: ${JSON.stringify(bitNodeMulti)}`)
}

