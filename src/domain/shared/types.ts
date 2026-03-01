/**
 * Tipos base del dominio - Shared types
 * Punto 3: Definir tipos base: SkillId, OccId, MechaId, AlignmentId
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
