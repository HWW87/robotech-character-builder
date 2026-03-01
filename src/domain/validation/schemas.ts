/**
 * Esquemas de validación con Zod
 * Punto 8: Introducir validación de datos con Zod para OCC, Skills y Mechas
 *
 * Ventajas:
 * - Validación en tiempo de carga (startup)
 * - TypeError nunca llega a TypeScript code
 * - Feedback claro de qué datos son inválidos
 * - Tipado automático from validation
 */

import { z } from 'zod';
import { Era, SkillCategory } from '../shared/types';

/**
 * Esquema para validar un Skill desde JSON
 */
export const SkillSchema = z.object({
  id: z.string().min(1),
  name_es: z.string().min(1),
  name_en: z.string().min(1),
  category: z.nativeEnum(SkillCategory),
  base: z.number().int().min(0).max(98),
  perLevel: z.number().int().min(0).max(10),
  exclusiveToOcc: z.string().optional(),
  hasPerLevelAdvance: z.boolean().default(true),
});

export type ValidatedSkill = z.infer<typeof SkillSchema>;

/**
 * Esquema para validar una OCC desde JSON
 */
export const OccSchema = z.object({
  id: z.string().min(1),
  name_es: z.string().min(1),
  name_en: z.string().min(1),
  category: z.string().min(1),
  era: z.nativeEnum(Era),
  description_es: z.string(),
  factions: z.array(z.string()),
  primarySkills: z.array(z.string()),
  secondarySkillsAllowed: z.object({
    count: z.number().int().positive(),
    categories: z.array(z.nativeEnum(SkillCategory)),
  }),
});

export type ValidatedOcc = z.infer<typeof OccSchema>;

/**
 * Esquema para validar una ubicación de MDC
 */
const MDCLocationSchema = z.object({
  value: z.number().int().positive(),
  each: z.boolean(),
});

/**
 * Esquema para validar un sistema de armas
 */
const WeaponSystemSchema = z.object({
  name_es: z.string().min(1),
  name_en: z.string().min(1),
  damage: z.string().min(1),
  range: z.string().min(1),
  notes: z.string().optional(),
});

/**
 * Esquema para validar un Mecha desde JSON
 * Punto 12: Validar estructura normalizada de MDC y armas
 */
export const MechaSchema = z.object({
  id: z.string().min(1),
  name_es: z.string().min(1),
  name_en: z.string().min(1),
  era: z.nativeEnum(Era),
  category: z.string().min(1),
  description_es: z.string(),
  mdcByLocation: z.record(z.string(), MDCLocationSchema),
  weaponSystems: z.array(WeaponSystemSchema),
  modes: z.array(z.string()).optional(),
});

export type ValidatedMecha = z.infer<typeof MechaSchema>;

/**
 * Funciones de validación principales
 * Usadas en carga de datos (repositories)
 */

export function validateSkills(data: unknown): ValidatedSkill[] {
  try {
    return z.array(SkillSchema).parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n');
      console.error('❌ Error validando skills:', issues);
      throw new Error(`Skills validation failed: ${error.message}`);
    }
    throw error;
  }
}

export function validateOccs(data: unknown): ValidatedOcc[] {
  try {
    return z.array(OccSchema).parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n');
      console.error('❌ Error validando OCCs:', issues);
      throw new Error(`OCCs validation failed: ${error.message}`);
    }
    throw error;
  }
}

export function validateMechas(data: unknown): ValidatedMecha[] {
  try {
    return z.array(MechaSchema).parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n');
      console.error('❌ Error validando Mechas:', issues);
      throw new Error(`Mechas validation failed: ${error.message}`);
    }
    throw error;
  }
}
