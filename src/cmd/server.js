/** @param {NS} ns */

import {tail} from "/src/utils/tail";

/** @param {import(".").NS } ns */
export async function main(ns) {
  const ROOT_SRC = "/src/hack"

  ns.exec(`${ROOT_SRC}/run-server.js`, "home", 1)
  tail(ns, `${ROOT_SRC}/run-server.js`, 683, 3, 1450, 438 + 130 + 150 + 300)
}

export function autocomplete(data, args) {
  return [...Array(21).keys()].map((i) => Math.pow(2, i))
}
