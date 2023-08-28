/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
}

export function buyDefaultHomeRam(ns) {
  const THRESHOLD = 1048576
  const homeRam = ns.getServerMaxRam("home")
  if (homeRam < THRESHOLD) {
    ns.singularity.upgradeHomeRam()
  }
  ns.singularity.upgradeHomeCores()
}


/** @param {import(".").NS } ns */
export function buyProgram(ns) {
  ns.singularity.purchaseTor()
  ns.singularity.purchaseProgram("BruteSSH.exe")
  ns.singularity.purchaseProgram("FTPCrack.exe")
  ns.singularity.purchaseProgram("relaySMTP.exe")
  ns.singularity.purchaseProgram("HTTPWorm.exe")
  ns.singularity.purchaseProgram("SQLInject.exe")
}
