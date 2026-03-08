/**
 * Vitality Domain - Pure functions for HP and SDC calculations
 * Per CHARACTER_CREATION_SPEC: Screen C
 */

import type { HitPoints, SdcData } from '../shared/types';

/**
 * Calcula Hit Points según el manual Robotech
 * HP = PE (Physical Endurance) + 1d6 roll at creation
 * 
 * @param pe - Physical Endurance attribute (3-18)
 * @param initialRoll - 1d6 roll at character creation (1-6)
 * @param level - Current character level (default 1)
 * @returns HitPoints object with base, initialRoll, totalAtLevel1
 */
export function calculateHP(
  pe: number,
  initialRoll: number,
  level: number = 1
): HitPoints {
  // Validate inputs
  if (pe < 1 || pe > 30) {
    throw new Error(`Invalid PE value: ${pe}. Expected 1-30.`);
  }
  if (initialRoll < 1 || initialRoll > 6) {
    throw new Error(`Invalid initial roll: ${initialRoll}. Expected 1-6.`);
  }

  return {
    base: pe,
    initialRoll,
    totalAtLevel1: pe + initialRoll,
  };
}

/**
 * Calcula S.D.C. (Structural Damage Capacity) según el manual Robotech
 * S.D.C. = Base (por OCC) + Bonuses (from skills like Boxing)
 * 
 * Per CHARACTER_CREATION_SPEC, base is OCC-dependent.
 * TODO: Load base from occ_rdf.json when standard_sdc is added to OCC data
 * 
 * @param baseByOcc - S.D.C. base provided by OCC (e.g., Commando gets 15, Soldier gets 10)
 * @param skillBonuses - Optional S.D.C. bonus from skills (default 0)
 * @returns SdcData object
 */
export function calculateSDC(
  baseByOcc: number,
  skillBonuses: number = 0
): SdcData {
  // Validate inputs
  if (baseByOcc < 0) {
    throw new Error(`Invalid baseByOcc: ${baseByOcc}. Expected >= 0.`);
  }
  if (skillBonuses < 0) {
    throw new Error(`Invalid skillBonuses: ${skillBonuses}. Expected >= 0.`);
  }

  const total = baseByOcc + skillBonuses;

  return {
    baseByOcc,
    fromSkills: skillBonuses > 0 ? skillBonuses : undefined,
    total,
  };
}

/**
 * Default S.D.C. base values per OCC (placeholder)
 * TODO: Load from occ_rdf.json when standard_sdc is added
 * 
 * These are estimates from Robotech manual
 */
export const DEFAULT_SDC_BY_OCC: Record<string, number> = {
  // Pilot OCCs
  occ_destroid_pilot: 20,
  occ_veritech_pilot: 20,
  // Military OCCs
  occ_rdf_soldier: 15,
  occ_military_specialist: 25,
  occ_commando: 25,
  // Support OCCs
  occ_technician: 10,
  occ_scout: 15,
  occ_communications: 10,
};

/**
 * Get S.D.C. base for an OCC (will be replaced by data load in future)
 * @param occId - OCC identifier
 * @returns S.D.C. base value or 10 as fallback
 */
export function getSDCBaseByOcc(occId: string): number {
  return DEFAULT_SDC_BY_OCC[occId] ?? 10;
}
