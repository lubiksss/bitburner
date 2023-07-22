/** @param {NS} ns */

import {formatMemory} from "/src/utils/formatter";


/** @param {import(".").NS } ns */
export async function main(ns) {
  const homeRam = ns.getServerMaxRam("home");
  const homeRamUsed = ns.getServerUsedRam("home");

  ns.tprint(`${formatMemory(homeRamUsed)}/${formatMemory(homeRam)}`)

  ns.tprint(`${formatMemory(1024)}`)
}

