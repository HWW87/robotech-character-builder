/**
 * Skill Repository
 * Punto 8: Carga y validación de skills desde JSON
 * Punto 5: Proporciona métodos para resolver IDs y buscar skills
 *
 * Responsabilidades:
 * - Cargar skills_rdf.json
 * - Validar con Zod
 * - Construir índices (by ID, by name, etc.)
 * - Proporcionar getSkillById(), resolveSkillId(), etc.
 */

import type { Skill, SkillInstance } from '../../domain/skills/skill';
import type { SkillId } from '../../domain/shared/types';
import { createSkillId, SkillCategory } from '../../domain/shared/types';
import { validateSkills } from '../../domain/validation/schemas';
import { generateSkillId, normalizeSkillName } from '../../domain/skills/skill-id-generator';
import skillsRdfData from '../../data/skills_rdf.json';

/**
 * Singleton para manejar skills
 */
export class SkillRepository {
  private static instance: SkillRepository | null = null;
  private skillsById: Map<SkillId, Skill> = new Map();
  private skillsByName: Map<string, SkillId> = new Map(); // normalized name → id
  private occAliasByNormalizedName: Map<string, string> = new Map([
    ['weapon systems', 'Weapon Systems (missiles, lasers, etc.)'],
    ['navigation', 'Navigation (Air, Land, Water)'],
    ['laser communications', 'Laser'],
    ['radio scramblers', 'Radio: Scrambler'],
    ['radio satellite relay', 'Radio: Satellite'],
    ['computer operations', 'Computer Operation'],
    ['electrical engineering', 'Electrical Engineer'],
    ['basic mathematics', 'Mathematics: Basic'],
    ['advanced mathematics', 'Mathematics: Advanced'],
    ['medical paramedic', 'Paramedic'],
    ['mecha mechanic', 'Mecha Mechanics'],
    ['mecha all destroids', 'Mecha (Destroid only)'],
    ['mecha combat choose two', 'Mecha Combat'],
    ['veritech fighter', 'Jet'],
    ['surveillance systems', 'Surveillance'],
    ['automobile', 'Automobile'],
    ['jet', 'Jet'],
    ['hand to hand basic', 'Hand to Hand: Basic'],
    ['hand to hand expert', 'Hand to Hand: Expert'],
    ['hand to hand martial arts', 'Hand to Hand: Martial Arts'],
  ]);

  private constructor() {
    this.initialize();
  }

  /**
   * Obtiene la instancia singleton
   */
  static getInstance(): SkillRepository {
    if (!SkillRepository.instance) {
      SkillRepository.instance = new SkillRepository();
    }
    return SkillRepository.instance;
  }

  /**
   * Inicializa el repositorio: carga y valida skills
   */
  private initialize(): void {
    try {
      // Convertir formato skills_rdf.json a array de skills
      const skillsArray = this.convertRdfToSkillArray(skillsRdfData);

      // Validar con Zod
      const validatedSkills = validateSkills(skillsArray);

      // Construir índices
      for (const skill of validatedSkills) {
        const skillId = createSkillId(skill.id);
        const skillObj: Skill = {
          id: skillId,
          name_es: skill.name_es,
          name_en: skill.name_en,
          category: skill.category as SkillCategory,
          base: skill.base,
          perLevel: skill.perLevel,
          exclusiveToOcc: skill.exclusiveToOcc,
          hasPerLevelAdvance: skill.hasPerLevelAdvance,
        };

        this.skillsById.set(skillId, skillObj);

        // Índice normalizado para búsqueda fuzzy
        const normalized = normalizeSkillName(skill.name_es);
        this.skillsByName.set(normalized, skillId);
      }

      console.log(`✅ Loaded ${this.skillsById.size} validated skills`);
    } catch (error) {
      console.error('❌ Failed to initialize SkillRepository:', error);
      throw error;
    }
  }

  /**
   * Convierte el formato skills_rdf.json (skills_by_category) a array
   */
  private convertRdfToSkillArray(data: any): any[] {
    const skills: any[] = [];
    const skillsByCategory = data.skills_by_category || {};

    // Map para normalizar categorías del JSON a valores del enum
    const categoryMap: Record<string, SkillCategory> = {
      'PILOT': SkillCategory.PILOT,
      'COMBAT': SkillCategory.COMBAT,
      'TECHNICAL': SkillCategory.TECHNICAL,
      'COMMUNICATIONS': SkillCategory.COMMUNICATIONS,
      'DOMESTIC': SkillCategory.DOMESTIC,
      'PHYSICAL': SkillCategory.PHYSICAL,
      'ESPIONAGE': SkillCategory.ESPIONAGE,
    };

    for (const [categoryKey, categorySkills] of Object.entries(skillsByCategory)) {
      // Normalizar la categoría usando el mapa
      const normalizedCategory = categoryMap[categoryKey] || (categoryKey as SkillCategory);
      
      for (const [nameEs, skillData] of Object.entries(categorySkills || {})) {
        const sk = skillData as any;
        skills.push({
          id: generateSkillId(nameEs, normalizedCategory).toString(),
          name_es: nameEs,
          name_en: sk.name_en || nameEs,
          category: normalizedCategory, // Use normalized category
          base: sk.base || 0,
          perLevel: sk.per_level || 0,
          exclusiveToOcc: sk.exclusive_to_occ,
          hasPerLevelAdvance: sk.has_per_level_advance !== false,
        });
      }
    }

    return skills;
  }

  /**
   * Obtiene un skill por su ID
   * @param skillId El ID único del skill
   * @returns El skill si existe, undefined en caso contrario
   */
  getSkillById(skillId: SkillId): Skill | undefined {
    return this.skillsById.get(skillId);
  }

  /**
   * Obtiene un skill por su ID de forma segura (con error si no existe)
   */
  getSkillByIdOrThrow(skillId: SkillId): Skill {
    const skill = this.skillsById.get(skillId);
    if (!skill) {
      throw new Error(`Skill no encontrado: ${skillId}`);
    }
    return skill;
  }

  /**
   * Resuelve un nombre de skill a su ID
   * Soporta:
   * - IDs directos: "PILOT_PILOT_JET_v1" → "PILOT_PILOT_JET_v1"
   * - Nombres en español: "Pilot Jet" → resuelve automáticamente
   *
   * @param skillIdentifier El nombre o ID del skill
   * @returns El ID único si se encuentra, null si no
   */
  resolveSkillId(skillIdentifier: string | SkillId): SkillId | null {
    // Si ya es un SkillId (está en el mapa), devolver directamente
    if (this.skillsById.has(skillIdentifier as SkillId)) {
      return skillIdentifier as SkillId;
    }

    // Normalizar y buscar por nombre
    const normalized = normalizeSkillName(skillIdentifier);
    const directMatch = this.skillsByName.get(normalized);
    if (directMatch) {
      return directMatch;
    }

    // Resolver aliases frecuentes del dataset OCC al nombre canónico del catálogo de skills
    const canonicalName = this.occAliasByNormalizedName.get(normalized);
    if (canonicalName) {
      const canonicalNormalized = normalizeSkillName(canonicalName);
      return this.skillsByName.get(canonicalNormalized) || null;
    }

    return null;
  }

  /**
   * Resuelve un nombre de skill a su ID o lanza error
   */
  resolveSkillIdOrThrow(skillIdentifier: string | SkillId): SkillId {
    const skillId = this.resolveSkillId(skillIdentifier);
    if (!skillId) {
      throw new Error(`No se pudo resolver skill: ${skillIdentifier}`);
    }
    return skillId;
  }

  /**
   * Obtiene todos los skills como array
   */
  getAllSkills(): Skill[] {
    return Array.from(this.skillsById.values());
  }

  /**
   * Obtiene todos los skills como Map
   */
  getSkillsMap(): Map<SkillId, Skill> {
    return new Map(this.skillsById);
  }

  /**
   * Busca skills que cumplan un predicado
   */
  findSkills(predicate: (skill: Skill) => boolean): Skill[] {
    return Array.from(this.skillsById.values()).filter(predicate);
  }
}

/**
 * Exportar instancia singleton
 */
export const skillRepository = SkillRepository.getInstance();

/**
 * Métodos públicos convenientes
 */
export const getSkillById = (skillId: SkillId): Skill | undefined =>
  skillRepository.getSkillById(skillId);

export const resolveSkillId = (skillIdentifier: string | SkillId): SkillId | null =>
  skillRepository.resolveSkillId(skillIdentifier);

export const getAllSkills = (): Skill[] => skillRepository.getAllSkills();

export const getSkillsMap = (): Map<SkillId, Skill> => skillRepository.getSkillsMap();
