/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const targetDirectory = ns.args[0];
  ns.ls("home", targetDirectory).forEach((item) => {
    if (ns.fileExists(item)) {
      ns.rm(item)
    } else (
      ns.run("/src/hack/rmDirectory.js", item)
    )
  })
}