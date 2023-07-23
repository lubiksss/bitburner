/** @param {NS} ns */


/** @param {import(".").NS } ns */
export async function main(ns) {
  const args = ["no"]
  const targets = ns.ps('home')
    .filter((script) => {
      const hasName = script.filename.includes("start")
      const hasArgs = args.every((arg) => script.args.includes(arg))
      return hasName && hasArgs
    })
  ns.tprint(targets)
}

