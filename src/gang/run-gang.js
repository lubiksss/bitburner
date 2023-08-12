import {Logger} from "/src/utils/logger";

/** @param {NS} ns */
/** @param {import("../hack").NS } ns */
export async function main(ns) {
  ns.disableLog("ALL")
  const SLEEP_TIME = 1000
  const GANG_MEMBER_NAMES = [
    'whishaw', 'randy', 'dane', 'eli', 'ethan',
    'ben', 'jake', 'justin', 'liam', 'hendo',
    'cookie', 'jaylene'
  ]
  const DEFAULT_TASK = 'Mug People'
  const GOOD_TASK = "Vigilante Justice"
  const TRAIN_TASK = "Train Combat"
  const WARFARE_TASK = "Territory Warfare"
  const TRAIN_TASK_THRESHOLD = 50
  const WANTED_LEVEL_UPPER_THRESHOLD = 500000
  const WANTED_LEVEL_LOWER_THRESHOLD = 1.1
  const WANTED_PENALTY_UPPER_THRESHOLD = 0.99
  const WANTED_PENALTY_LOWER_THRESHOLD = 0.8
  const ASCENDING_EXP_THRESHOLD = 1
  const INITIAL_ASCENDING_EXP_THRESHOLD = 4000
  const WARFARE_THRESHOLD = 0.55

  const logger = new Logger(ns)
  const equips = ns.gang.getEquipmentNames()
  const sortedEquips = equips.sort((a, b) => {
    const aCost = ns.gang.getEquipmentCost(a)
    const bCost = ns.gang.getEquipmentCost(b)
    return aCost - bCost
  })
  const equipsRelatedToHack = sortedEquips.filter((equip) => {
    const stats = ns.gang.getEquipmentStats(equip)
    return stats.hack > 0
  })
  const equipsRelatedToCombat = sortedEquips.filter((equip) => {
    const stats = ns.gang.getEquipmentStats(equip)
    return !(stats.hack > 0)
  })

  const otherGangs = ns.gang.getOtherGangInformation()

  while (true) {
    const members = ns.gang.getMemberNames()
    const gang = ns.gang.getGangInformation()
    const isStrongest = Object.keys(otherGangs)
      .filter((g) => g !== gang.faction)
      .every((gang) => ns.gang.getChanceToWinClash(gang) > WARFARE_THRESHOLD)
    const isOverLevel = members.every((member) => {
      const info = ns.gang.getMemberInformation(member)
      return info.str > 5000
    })

    // First of all, recruit
    if (ns.gang.canRecruitMember()) {
      const nextMember = GANG_MEMBER_NAMES.find((name) => !members.includes(name))
      ns.gang.recruitMember(nextMember)
      logger.mon(`Recruit ${nextMember}`)
    }

    // Engage in warfare
    isStrongest ? ns.gang.setTerritoryWarfare(true) : ns.gang.setTerritoryWarfare(false)

    // Ascend
    members.forEach((member) => {
      const info = ns.gang.getMemberInformation(member)
      const expCondition =
        info.str_exp > INITIAL_ASCENDING_EXP_THRESHOLD
        && info.str_exp / info.str_asc_points > ASCENDING_EXP_THRESHOLD
      if (expCondition) {
        ns.gang.ascendMember(member)
        logger.mon(`Ascend ${member}`)
      }
    })

    // Purchase equipment and augmentations
    equipsRelatedToCombat.concat(equipsRelatedToHack).forEach((equip) => {
      members.forEach((member) => {
        if (ns.gang.purchaseEquipment(member, equip)) {
          // logger.mon(`Purchase ${equip} for ${member}`)
        }
      })
    })

    // Set task
    members.forEach((member) => {
      const info = ns.gang.getMemberInformation(member)
      if (info.str < TRAIN_TASK_THRESHOLD) {
        ns.gang.setMemberTask(member, TRAIN_TASK)
      } else if (!isStrongest && isOverLevel && members.length == 12) {
        ns.gang.setMemberTask(member, WARFARE_TASK)
      } else {
        if (info.task === GOOD_TASK && gang.wantedLevel !== 1 && (gang.wantedLevel > WANTED_LEVEL_LOWER_THRESHOLD || gang.wantedPenalty < WANTED_PENALTY_UPPER_THRESHOLD)) {
          // Do not change task
        } else if (gang.wantedLevel !== 1 && (gang.wantedLevel > WANTED_LEVEL_UPPER_THRESHOLD || gang.wantedPenalty < WANTED_PENALTY_LOWER_THRESHOLD)) {
          ns.gang.setMemberTask(member, GOOD_TASK)
        } else {
          if (info.str > 300) {
            ns.gang.setMemberTask(member, "Human Trafficking")
          } else if (info.str > 150) {
            ns.gang.setMemberTask(member, "Traffick Illegal Arms")
          } else if (info.str > 50) {
            ns.gang.setMemberTask(member, "Strongarm Civilians")
          } else {
            ns.gang.setMemberTask(member, DEFAULT_TASK)
          }
        }
      }
    })
    await ns.sleep(SLEEP_TIME)
  }
}

/**
 * info
 "name": "jake0",
 "task": "Ethical Hacking",
 "earnedRespect": 73489.77526802776,
 "hack": 3161, "str": 1, "def": 1, "dex": 1, "agi": 1, "cha": 255,
 "hack_exp": 428834.9125902668, "str_exp": 0, "def_exp": 0, "dex_exp": 0, "agi_exp": 0, "cha_exp": 20426.106165225636,
 "hack_mult": 1.7107860000000001, "str_mult": 1.04, "def_mult": 1.04, "dex_mult": 1, "agi_mult": 1.04, "cha_mult": 1.04,
 "hack_asc_mult": 8.594223505179233, "str_asc_mult": 1, "def_asc_mult": 1, "dex_asc_mult": 1, "agi_asc_mult": 1, "cha_asc_mult": 2.072494870835255,
 "hack_asc_points": 147721.35531395045, "str_asc_points": 0, "def_asc_points": 0, "dex_asc_points": 0, "agi_asc_points": 0, "cha_asc_points": 8590.469979276879,
 "upgrades": ["Jack the Ripper", "Baseball Bat", "Demon Rootkit", "NUKE Rootkit", "Soulstealer Rootkit", "Hmap Node", "Ford Flex V20"],
 "augmentations": [],
 "respectGain": 0,
 "wantedLevelGain": -0.1638228571428589,
 "moneyGain": 1365.0366803570332
 */

/**
 * after ascending
 "name": "jake0",
 "task": "Money Laundering",
 "earnedRespect": 5.1703733307522866,
 "hack": 830, "str": 1, "def": 1, "dex": 1, "agi": 1, "cha": 26,
 "hack_exp": 1773.4721869291225, "str_exp": 0, "def_exp": 0, "dex_exp": 0, "agi_exp": 0, "cha_exp": 105.09361486647092,
 "hack_mult": 1, "str_mult": 1, "def_mult": 1, "dex_mult": 1, "agi_mult": 1, "cha_mult": 1,
 "hack_asc_mult": 17.380185152416455, "str_asc_mult": 1, "def_asc_mult": 1, "dex_asc_mult": 1, "agi_asc_mult": 1, "cha_asc_mult": 3.8666874043053663,
 "hack_asc_points": 604141.6718645548, "str_asc_points": 0, "def_asc_points": 0, "dex_asc_points": 0, "agi_asc_points": 0, "cha_asc_points": 29902.54296522754,
 "upgrades": [],
 "augmentations": [],
 "respectGain": 0.08464164157126475,
 "wantedLevelGain": 0.11207550708079454,
 "moneyGain": 1823.936619115215
 */


