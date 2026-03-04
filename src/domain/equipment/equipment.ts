/**
 * Equipment Domain - Pure functions for standard equipment, wages, and savings
 * Per CHARACTER_CREATION_SPEC: Screen F
 */

import type { EquipmentData } from '../shared/types';

/**
 * Standard equipment by OCC (placeholder data)
 * TODO: Load from occ_rdf.json when standard_equipment field is added
 * 
 * Per Robotech manual, each OCC gets standard military issue plus specialization gear
 */
const STANDARD_EQUIPMENT_BY_OCC: Record<string, string[]> = {
  // Pilot OCCs
  occ_destroid_pilot: [
    "RDF uniform and dress uniform",
    "Field jacket and combat boots",
    "Survival knife (1d6 damage)",
    "Utility belt with first aid kit",
    "Flashlight and pocket mirror",
    "Portable water filter",
    "Two-way radio (short range)",
    "Pilot helmet with HUD",
    "Flight suit",
    "Personal side arm (laser pistol)",
  ],
  occ_veritech_pilot: [
    "RDF uniform and dress uniform",
    "Field jacket and combat boots",
    "Survival knife (1d6 damage)",
    "Utility belt with first aid kit",
    "Flashlight and pocket mirror",
    "Portable water filter",
    "Two-way radio (short range)",
    "Veritech pilot helmet with full HUD",
    "G-suit and flight suit",
    "Personal side arm (laser pistol)",
    "Ejection seat survival pack",
  ],
  // Military OCCs
  occ_rdf_soldier: [
    "RDF uniform and dress uniform",
    "Field jacket and combat boots",
    "Survival knife (1d6 damage)",
    "Utility belt with first aid kit",
    "Flashlight and pocket mirror",
    "Portable water filter",
    "Two-way radio (short range)",
    "Combat helmet",
    "Standard issue rifle",
    "100 rounds ammunition",
  ],
  occ_military_specialist: [
    "RDF uniform and dress uniform",
    "Field jacket and combat boots",
    "Survival knife (1d6 damage)",
    "Utility belt with first aid kit",
    "Flashlight and pocket mirror",
    "Portable water filter",
    "Two-way radio (short range)",
    "Specialist tools (varies by specialty)",
    "Personal side arm",
  ],
  occ_commando: [
    "RDF uniform and dress uniform (rarely worn)",
    "Black BDU fatigues",
    "Combat boots (reinforced)",
    "Combat knife (1d6+2 damage)",
    "Advanced utility belt with expanded first aid",
    "Tactical flashlight and night vision goggles",
    "Portable water filter and rations (7 days)",
    "Encrypted two-way radio",
    "Combat helmet with comms",
    "Choice of primary weapon (rifle/SMG)",
    "Personal side arm (heavy caliber)",
    "Rappelling gear and climbing equipment",
  ],
  // Support OCCs
  occ_technician: [
    "RDF uniform and dress uniform",
    "Field jacket and work coveralls",
    "Survival knife (1d6 damage)",
    "Utility belt with first aid kit",
    "Flashlight and pocket mirror",
    "Portable water filter",
    "Two-way radio (short range)",
    "Complete tool kit (mechanical/electrical)",
    "Diagnostic scanner",
    "Personal side arm (laser pistol)",
  ],
  occ_scout: [
    "RDF uniform and dress uniform",
    "Camouflage fatigues",
    "Survival knife (1d6 damage)",
    "Utility belt with first aid kit",
    "Binoculars and range finder",
    "Portable water filter",
    "Two-way radio (long range)",
    "Camouflage netting",
    "Sniper rifle or carbine",
    "Personal side arm",
  ],
  occ_communications: [
    "RDF uniform and dress uniform",
    "Field jacket and combat boots",
    "Survival knife (1d6 damage)",
    "Utility belt with first aid kit",
    "Flashlight and pocket mirror",
    "Portable water filter",
    "Advanced communications equipment",
    "Encryption/decryption kit",
    "Portable satellite uplink",
    "Personal side arm (laser pistol)",
  ],
};

/**
 * Monthly wages by OCC and level range
 * Per Robotech manual (approximates from military pay scales)
 */
interface WageStructure {
  levels1to5: number;
  levels6to10: number;
  levels11plus: number;
}

const WAGES_BY_OCC: Record<string, WageStructure> = {
  occ_destroid_pilot: {
    levels1to5: 2400,
    levels6to10: 3200,
    levels11plus: 4000,
  },
  occ_veritech_pilot: {
    levels1to5: 2800,
    levels6to10: 3600,
    levels11plus: 4500,
  },
  occ_rdf_soldier: {
    levels1to5: 1800,
    levels6to10: 2400,
    levels11plus: 3000,
  },
  occ_military_specialist: {
    levels1to5: 2200,
    levels6to10: 3000,
    levels11plus: 3800,
  },
  occ_commando: {
    levels1to5: 2600,
    levels6to10: 3400,
    levels11plus: 4200,
  },
  occ_technician: {
    levels1to5: 2000,
    levels6to10: 2800,
    levels11plus: 3600,
  },
  occ_scout: {
    levels1to5: 2200,
    levels6to10: 3000,
    levels11plus: 3800,
  },
  occ_communications: {
    levels1to5: 2000,
    levels6to10: 2800,
    levels11plus: 3600,
  },
};

/**
 * Get standard equipment for an OCC
 * @param occId - OCC identifier
 * @returns Array of equipment item descriptions
 */
export function getStandardEquipment(occId: string): string[] {
  return STANDARD_EQUIPMENT_BY_OCC[occId] || [
    "RDF uniform and dress uniform",
    "Field jacket and combat boots",
    "Survival knife",
    "Basic utility belt with first aid kit",
    "Flashlight",
    "Two-way radio (short range)",
  ];
}

/**
 * Calculate monthly wages based on OCC and level
 * @param occId - OCC identifier
 * @param level - Character level (1+)
 * @returns Monthly wages in credits
 */
export function calculateMonthlyWages(occId: string, level: number): number {
  const wages = WAGES_BY_OCC[occId] || {
    levels1to5: 2000,
    levels6to10: 2800,
    levels11plus: 3600,
  };

  if (level <= 5) return wages.levels1to5;
  if (level <= 10) return wages.levels6to10;
  return wages.levels11plus;
}

/**
 * Generate personal savings (starting credits)
 * Per Robotech manual: 2d6 × 100 credits for most OCCs
 * 
 * @param occId - OCC identifier
 * @returns Personal savings in credits
 */
export function generatePersonalSavings(occId: string): number {
  // Most OCCs get 2d6 × 100
  // Commando and specialists might get more
  const multiplier = occId === 'occ_commando' ? 150 : 100;
  
  const roll1 = Math.floor(Math.random() * 6) + 1;
  const roll2 = Math.floor(Math.random() * 6) + 1;
  
  return (roll1 + roll2) * multiplier;
}

/**
 * Build complete equipment data for character
 * @param occId - OCC identifier
 * @param level - Character level
 * @returns EquipmentData object
 */
export function buildEquipmentData(occId: string, level: number): EquipmentData {
  return {
    standardEquipment: getStandardEquipment(occId),
    wages: {
      monthly: calculateMonthlyWages(occId, level),
      levelRange: level <= 5 ? '1-5' : level <= 10 ? '6-10' : '11+',
    },
    personalSavings: generatePersonalSavings(occId),
  };
}
