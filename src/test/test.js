/** @param {NS} ns */


import {scanAll} from "src/utils/scan";

/** @param {import(".").NS } ns */
export async function main(ns) {
  const servers = scanAll(ns)
  ns.tprint(servers.length)
}

