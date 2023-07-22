/** @param {NS} ns */
import {scanAll} from "/src/utils/scan";

/** @param {import("../hack").NS } ns */

export async function main(ns) {
  const servers = scanAll(ns)

  const maxServerNameLength = servers
    .map((server) => server.length)
    .reduce((a, b) => Math.max(a, b), 0)

  ns.tprint(maxServerNameLength)
}

