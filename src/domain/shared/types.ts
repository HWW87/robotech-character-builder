/**
 * Tipos base del dominio - Shared types
 * Punto 3: Definir tipos base: SkillId, OccId, MechaId, AlignmentId
 * Punto 1: CharacterState completo per CHARACTER_CREATION_SPEC
 */

// Branded types para máxima seguridad de tipo
export type SkillId = string & { readonly __brand: 'SkillId' };
export type OccId = string & { readonly __brand: 'OccId' };
export type MechaId = string & { readonly __brand: 'MechaId' };
export type AlignmentId = string & { readonly __brand: 'AlignmentId' };

// Funciones para crear branded types
export const createSkillId = (value: string): SkillId => value as SkillId;
export const createOccId = (value: string): OccId => value as OccId;
export const createMechaId = (value: string): MechaId => value as MechaId;
export const createAlignmentId = (value: string): AlignmentId => value as AlignmentId;

// Atributos base del sistema Palladium
export enum Attribute {
  IQ = 'IQ',
  ME = 'ME',
  MA = 'MA',
  PS = 'PS',
  PP = 'PP',
  PE = 'PE',
  PB = 'PB',
  SPD = 'SPD',
}

// Eras del universo Robotech
export enum Era {
  MACROSS = 'Macross',
  SOUTHERN_CROSS = 'Southern Cross',
  INVID = 'Invid',
}

// Categorías de skills
export enum SkillCategory {
  PILOT = 'PILOT',
  COMBAT = 'COMBAT',
  TECHNICAL = 'TECHNICAL',
  COMMUNICATIONS = 'COMMUNICATIONS',
  DOMESTIC = 'DOMESTIC',
  PHYSICAL = 'PHYSICAL',
  ESPIONAGE = 'ESPIONAGE',
}

// Alignment groups per Palladium system
export type AlignmentGroup = 'Good' | 'Selfish' | 'Evil';

// ============================================================================
// CHARACTER_STATE TYPES (per CHARACTER_CREATION_SPEC)
// ============================================================================

export interface AttributeValues {
  IQ: number;
  ME: number;
  MA: number;
  PS: number;
  PP: number;
  PE: number;
  PB: number;
  Spd: number;
}

export interface AttributeBonuses {
  iqBonusPercent?: number; // If IQ >= 17, one-time skill bonus
}

export interface PersonalData {
  name: string;
  age?: number;
  rank?: string;
  faction: string;
}

export interface LevelData {
  currentLevel: number; // >= 1
}

export interface HitPoints {
  base: number; // PE value
  initialRoll: number; // 1d6 at creation
  totalAtLevel1: number; // base + initialRoll
}

export interface SdcData {
  baseByOcc: number; // OCC-dependent
  fromSkills?: number; // from skills like Boxing
  total: number; // base + fromSkills
}

export interface VitalityData {
  hitPoints: HitPoints;
  sdc: SdcData;
}

export interface OccData {
  occId: OccId;
  occName: string;
  occSkills: SkillId[]; // Real skill IDs
  otherSkillsChosen: SkillId[]; // User-selected "other skills"
}

export interface CalculatedSkill {
  skillId: SkillId;
  name: string;
  base: number;
  occBonus?: number;
  iqBonus?: number;
  perLevel: number;
  perLevelComponent: number; // perLevel * (level - 1)
  manualBonus?: number;
  total: number; // clamped at 98%
}

export interface GlobalSkillBonuses {
  iqBonusPercent?: number; // Applied once to all skills if IQ >= 17
  occSkillBonuses?: Record<string, number>; // per-skill entry from OCC
}

export interface SkillsData {
  calculatedSkills: CalculatedSkill[];
  globalSkillBonuses: GlobalSkillBonuses;
}

export interface EquipmentData {
  standardEquipment: string[]; // OCC-provided gear
  wages?: {
    monthly: number;
    levelRange?: string; // e.g., "1-5", "6-10"
  };
  personalSavings?: number; // Generated from OCC formula
}

export interface AlignmentData {
  alignmentId: AlignmentId;
  alignmentName: string;
  alignmentGroup: AlignmentGroup;
}

export interface MechaData {
  mechaId: MechaId;
  mechaName: string;
}

export interface CharacterState {
  personal: PersonalData;
  level: LevelData;
  attributes: AttributeValues;
  attributeBonuses: AttributeBonuses;
  vitality: VitalityData;
  occ: OccData;
  skills: SkillsData;
  equipment: EquipmentData;
  alignment?: AlignmentData;
  mecha?: MechaData;
}

