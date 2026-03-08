/**
 * Dominio Mecha - Interfaz y tipos
 * Punto 4: Interfaces formales para Mecha
 * Punto 12: Estructura normalizada con MDC, armas, modos
 */

import type { MechaId, Era } from '../shared/types';

/**
 * Ubicación de MDC (Mobile Defense Capability)
 * Punto 12: estructura clara para cada localización
 */
export interface MDCLocation {
  readonly value: number;
  readonly each: boolean; // true si es 2x, false si es único
}

/**
 * Sistema de armas de un mecha
 * Punto 12: armas estructuradas con atributos completos
 */
export interface WeaponSystem {
  readonly name_es: string;
  readonly name_en: string;
  readonly damage: string;
  readonly range: string;
  readonly notes?: string;
}

/**
 * Definición de un Mecha
 * Immutable, representa el mecha como está definido en mechas.json
 * Punto 12: Estructura normalizada lista para batalla
 */
export interface Mecha {
  readonly id: MechaId;
  readonly name_es: string;
  readonly name_en: string;
  readonly era: Era;
  readonly category: string;
  readonly description_es: string;
  readonly mdcByLocation: Record<string, MDCLocation>;
  readonly weaponSystems: WeaponSystem[];
  readonly modes?: readonly string[]; // Fighter, Battloid, GERWALK, etc.
}
