import {Logger} from "/src/utils/logger";

/** @param {NS} ns */
/** @param {import("../hack").NS } ns */
export async function main(ns) {
  const logger = new Logger(ns)

  const hwgw = [1, 2, 3, 4]
  const hwgwQue = hwgw.flatMap((num, i) => {
    if (i === 0) {
      return Array(num).fill('h')
    } else if (i === 1) {
      return Array(num).fill('wh')
    } else if (i === 2) {
      return Array(num).fill('g')
    } else if (i === 3) {
      return Array(num).fill('wg')
    }
  })
  ns.tprint(hwgwQue)
}