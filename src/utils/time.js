/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  const time = getKoreanTime();
  ns.tprint(time)
}


const KOREAN_TIME_OFFSET = 9 * 60 * 60 * 1000;

export function getKoreanTime() {
  const now = new Date();
  const nowInKorea = now.getTime() + KOREAN_TIME_OFFSET;
  return new Date(nowInKorea).toISOString()
}