/** @param {NS} ns */
/** @param {import(".").NS } ns */
export async function main(ns) {
  let hwgw = [100, 20, 200, 30]
  ns.tprint(hwgw)
  const targetSum = 119

  const availableTask = availableHwgw(hwgw, targetSum)[0]
  ns.tprint(availableTask)
  hwgw = availableHwgw(hwgw, targetSum)[1]
  ns.tprint(hwgw)
}

export function availableHwgw(inputArray, targetSum) {
  let remainingSum = targetSum;
  const resultArray1 = [];
  const resultArray2 = [];

  for (const num of inputArray) {
    if (num <= remainingSum) {
      resultArray1.push(num);
      resultArray2.push(0);
      remainingSum -= num;
    } else {
      resultArray1.push(remainingSum);
      resultArray2.push(num - remainingSum);
      remainingSum = 0;
    }
  }

  return [resultArray1, resultArray2];
}
