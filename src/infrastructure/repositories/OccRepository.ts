/**
 * OCC Repository
 * Punto 8: Carga y validación de OCCs desde JSON
 * Punto 5: Proporciona métodos para resolver IDs y buscar OCCs
 * Punto 2-FIX: Resuelve skills a IDs reales usando SkillRepository
 */

import type { OCC } from '../../domain/occ/occ';
import type { OccId, SkillId } from '../../domain/shared/types';
import { createOccId } from '../../domain/shared/types';
import { validateOccs } from '../../domain/validation/schemas';
import occRdfData from '../../data/occ_rdf.json';
import { skillRepository } from './SkillRepository';

/**
 * Singleton para manejar OCCs
 */
class OccRepository {
  private static instance: OccRepository | null = null;
  private occsById: Map<OccId, OCC> = new Map();
  private occsByName: Map<string, OccId> = new Map(); // name_en → id

  private constructor() {
    this.initialize();
  }

  static getInstance(): OccRepository {
    if (!OccRepository.instance) {
      OccRepository.instance = new OccRepository();
    }
    return OccRepository.instance;
  }

  /**
   * Inicializa el repositorio: carga y valida OCCs
   */
  private initialize(): void {
    try {
      // Convertir formato occ_rdf.json a array de OCCs
      const occsArray = this.convertRdfToOccArray(occRdfData);

      // Validar con Zod
      const validatedOccs = validateOccs(occsArray);

      // Construir índices
      for (const occ of validatedOccs) {
        const occId = createOccId(occ.id);
        const occObj: OCC = {
          id: occId,
          name_es: occ.name_es,
          name_en: occ.name_en,
          category: occ.category,
          era: occ.era,
          description_es: occ.description_es,
          factions: occ.factions,
          // FIX 2: primarySkills ya son SkillIds reales del convertRdfToOccArray
          primarySkills: (occ.primarySkills as any[]) || [],
          secondarySkillsAllowed: occ.secondarySkillsAllowed || {
            count: 6,
            categories: [],
          },
        };

        this.occsById.set(occId, occObj);
        this.occsByName.set(occ.name_en, occId);
      }

      console.log(`✅ Loaded ${this.occsById.size} validated OCCs`);
    } catch (error) {
      console.error('❌ Failed to initialize OccRepository:', error);
      throw error;
    }
  }

  /**
   * Convierte el formato occ_rdf.json a array de OCC
   */
  private convertRdfToOccArray(data: any): any[] {
    const occs: any[] = [];
    const occsData = data.occs || [];

    // Map para normalizar categorías de skills del JSON a valores del enum
    const categoryMap: Record<string, string> = {
      'Communications': 'COMMUNICATIONS',
      'Domestic': 'DOMESTIC',
      'Electrical': 'TECHNICAL', // Map to TECHNICAL
      'Espionage': 'ESPIONAGE',
      'Mechanical': 'TECHNICAL',
      'Medical': 'TECHNICAL',
      'Physical': 'PHYSICAL',
      'Pilot': 'PILOT',
      'Pilot Related': 'PILOT',
      'Science': 'TECHNICAL',
      'Technology': 'TECHNICAL',
      'Technical': 'TECHNICAL',
      'W.P.': 'COMBAT',
      // Uppercase versions
      'COMMUNICATIONS': 'COMMUNICATIONS',
      'DOMESTIC': 'DOMESTIC',
      'ESPIONAGE': 'ESPIONAGE',
      'PHYSICAL': 'PHYSICAL',
      'PILOT': 'PILOT',
      'COMBAT': 'COMBAT',
      'TECHNICAL': 'TECHNICAL',
    };

    for (const occ of occsData) {
      // FIX 2: Extraer skill names y resolver a IDs reales
      const primarySkillIds: SkillId[] = [];
      const primarySkillNames = (occ.occ_skills || [])
        .map((s: any) => s.skill || '')
        .filter((s: string) => s.length > 0);

      for (const skillName of primarySkillNames) {
        const resolvedId = skillRepository.resolveSkillId(skillName);
        if (resolvedId) {
          primarySkillIds.push(resolvedId);
        } else {
          // DEV warning para detectar skills no resueltas
          console.warn(`[OCC] Skill no resuelta: ${skillName} en OCC ${occ.name_en}`);
        }
      }

      // Normalizar allowed_categories
      let allowedCategories = [];
      if (occ.other_skills?.allowed_categories) {
        allowedCategories = (occ.other_skills.allowed_categories || [])
          .map((catObj: any) => {
            const cat = catObj.category || catObj;
            return categoryMap[cat] || cat;
          })
          .filter((c: string) => c.length > 0);
      }

      occs.push({
        id: occ.id,
        name_es: occ.name_es,
        name_en: occ.name_en,
        category: occ.category || 'Unknown',
        era: occ.era || 'Macross',
        description_es: occ.description_es || '',
        factions: occ.factions || [],
        primarySkills: primarySkillIds,
        secondarySkillsAllowed: {
          count: occ.other_skills?.select_count || 6,
          categories: allowedCategories,
        },
      });
    }

    return occs;
  }

  /**
   * Obtiene una OCC por su ID
   */
  getOccById(occId: OccId): OCC | undefined {
    return this.occsById.get(occId);
  }

  /**
   * Obtiene una OCC por su nombre en inglés
   */
  getOccByName(name_en: string): OCC | undefined {
    const occId = this.occsByName.get(name_en);
    return occId ? this.occsById.get(occId) : undefined;
  }

  /**
   * Resuelve una OCC por nombre o ID
   */
  resolveOccId(occIdentifier: string | OccId): OccId | null {
    // Si ya es un OccId, devolver directamente
    if (this.occsById.has(occIdentifier as OccId)) {
      return occIdentifier as OccId;
    }

    // Buscar por nombre
    return this.occsByName.get(occIdentifier) || null;
  }

  /**
   * Resuelve una OCC o lanza error
   */
  resolveOccIdOrThrow(occIdentifier: string | OccId): OccId {
    const occId = this.resolveOccId(occIdentifier);
    if (!occId) {
      throw new Error(`No se pudo resolver OCC: ${occIdentifier}`);
    }
    return occId;
  }

  /**
   * Obtiene todas las OCCs
   */
  getAllOccs(): OCC[] {
    return Array.from(this.occsById.values());
  }

  /**
   * Obtiene OCCs por era
   */
  getOccsByEra(era: string): OCC[] {
    return Array.from(this.occsById.values()).filter(occ => occ.era === era);
  }

  /**
   * Obtiene OCCs por facción
   */
  getOccsByFaction(faction: string): OCC[] {
    return Array.from(this.occsById.values()).filter(occ =>
      occ.factions.includes(faction)
    );
  }

  /**
   * Obtiene el mapa de OCCs
   */
  getOccsMap(): Map<OccId, OCC> {
    return new Map(this.occsById);
  }
}

/**
 * Exportar instancia singleton
 */
export const occRepository = OccRepository.getInstance();

/**
 * Métodos públicos convenientes
 */
export const getOccById = (occId: OccId): OCC | undefined =>
  occRepository.getOccById(occId);

export const resolveOccId = (occIdentifier: string | OccId): OccId | null =>
  occRepository.resolveOccId(occIdentifier);

export const getAllOccs = (): OCC[] => occRepository.getAllOccs();

export const getOccsByEra = (era: string): OCC[] => occRepository.getOccsByEra(era);

export const getOccsByFaction = (faction: string): OCC[] =>
  occRepository.getOccsByFaction(faction);
