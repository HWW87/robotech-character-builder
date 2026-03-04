/**
 * Mecha Repository
 * Punto 12: Carga y validación de Mechas desde JSON
 * Punto 5: Proporciona métodos para resolver IDs y buscar Mechas
 */

import type { Mecha } from '../../domain/mecha/mecha';
import type { MechaId } from '../../domain/shared/types';
import { createMechaId } from '../../domain/shared/types';
import { validateMechas } from '../../domain/validation/schemas';
import mechasData from '../../data/mechas.json';

/**
 * Singleton para manejar Mechas
 */
class MechaRepository {
  private static instance: MechaRepository | null = null;
  private mechasById: Map<MechaId, Mecha> = new Map();
  private mechasByName: Map<string, MechaId> = new Map(); // name_es → id

  private constructor() {
    this.initialize();
  }

  static getInstance(): MechaRepository {
    if (!MechaRepository.instance) {
      MechaRepository.instance = new MechaRepository();
    }
    return MechaRepository.instance;
  }

  /**
   * Inicializa el repositorio: carga y valida Mechas
   */
  private initialize(): void {
    try {
      // Convertir formato mechas.json a array
      const mechasArray = this.convertToMechaArray(mechasData);

      // Validar con Zod
      const validatedMechas = validateMechas(mechasArray);

      // Construir índices
      for (const mecha of validatedMechas) {
        const mechaId = createMechaId(mecha.id);
        // Use name_es si existe, fallback a name o name_en
        const primaryName = mecha.name_es || (mecha as any).name || mecha.name_en || '';
        
        const mechaObj: Mecha = {
          id: mechaId,
          name_es: primaryName,
          name_en: mecha.name_en || (mecha as any).name || primaryName,
          era: mecha.era as any,
          category: mecha.category,
          description_es: mecha.description_es,
          mdcByLocation: mecha.mdcByLocation || {},
          weaponSystems: mecha.weaponSystems || [],
          modes: mecha.modes as readonly string[] | undefined,
        };

        this.mechasById.set(mechaId, mechaObj);
        if (primaryName) {
          this.mechasByName.set(primaryName, mechaId);
        }
      }

      console.log(`✅ Loaded ${this.mechasById.size} validated Mechas`);
    } catch (error) {
      console.error('❌ Failed to initialize MechaRepository:', error);
      throw error;
    }
  }

  /**
   * Convierte el formato mechas.json a array
   */
  private convertToMechaArray(data: any): any[] {
    return (data.mecha || []).map((m: any) => ({
      id: m.id,
      name_es: m.name_es || m.name || '',
      name_en: m.name_en || m.name || '',
      name: m.name, // Keep both formats for flexible matching
      era: m.era || 'Macross',
      category: m.category || 'Unknown',
      description_es: m.description_es || m.description || '',
      description: m.description,
      mdcByLocation: m.mdc_by_location || m.mdcByLocation || {},
      mdc_by_location: m.mdc_by_location || {},
      weaponSystems: m.weapon_systems || m.weaponSystems || [],
      weapon_systems: m.weapon_systems || [],
      modes: m.modes,
    }));
  }

  /**
   * Obtiene una Mecha por su ID
   */
  getMechaById(mechaId: MechaId): Mecha | undefined {
    return this.mechasById.get(mechaId);
  }

  /**
   * Obtiene una Mecha por su nombre en español
   */
  getMechaByName(name_es: string): Mecha | undefined {
    const mechaId = this.mechasByName.get(name_es);
    return mechaId ? this.mechasById.get(mechaId) : undefined;
  }

  /**
   * Resuelve una Mecha por nombre o ID
   */
  resolveMechaId(mechaIdentifier: string | MechaId): MechaId | null {
    // Si ya es un MechaId, devolver directamente
    if (this.mechasById.has(mechaIdentifier as MechaId)) {
      return mechaIdentifier as MechaId;
    }

    // Buscar por nombre
    return this.mechasByName.get(mechaIdentifier) || null;
  }

  /**
   * Resuelve una Mecha o lanza error
   */
  resolveMechaIdOrThrow(mechaIdentifier: string | MechaId): MechaId {
    const mechaId = this.resolveMechaId(mechaIdentifier);
    if (!mechaId) {
      throw new Error(`No se pudo resolver Mecha: ${mechaIdentifier}`);
    }
    return mechaId;
  }

  /**
   * Obtiene todas las Mechas
   */
  getAllMechas(): Mecha[] {
    return Array.from(this.mechasById.values());
  }

  /**
   * Obtiene Mechas por era
   */
  getMechasByEra(era: string): Mecha[] {
    return Array.from(this.mechasById.values()).filter(mecha => mecha.era === era);
  }

  /**
   * Obtiene Mechas por categoría
   */
  getMechasByCategory(category: string): Mecha[] {
    return Array.from(this.mechasById.values()).filter(mecha =>
      mecha.category === category
    );
  }

  /**
   * Busca Mechas por patrón de nombre (fuzzy match)
   */
  searchMechasByName(pattern: string): Mecha[] {
    const lowerPattern = pattern.toLowerCase();
    return Array.from(this.mechasById.values()).filter(mecha =>
      mecha.name_es.toLowerCase().includes(lowerPattern) ||
      mecha.name_en.toLowerCase().includes(lowerPattern)
    );
  }

  /**
   * Obtiene el mapa de Mechas
   */
  getMechasMap(): Map<MechaId, Mecha> {
    return new Map(this.mechasById);
  }
}

/**
 * Exportar instancia singleton
 */
export const mechaRepository = MechaRepository.getInstance();

/**
 * Métodos públicos convenientes
 */
export const getMechaById = (mechaId: MechaId): Mecha | undefined =>
  mechaRepository.getMechaById(mechaId);

export const resolveMechaId = (mechaIdentifier: string | MechaId): MechaId | null =>
  mechaRepository.resolveMechaId(mechaIdentifier);

export const getAllMechas = (): Mecha[] => mechaRepository.getAllMechas();

export const getMechasByEra = (era: string): Mecha[] =>
  mechaRepository.getMechasByEra(era);

export const getMechasByCategory = (category: string): Mecha[] =>
  mechaRepository.getMechasByCategory(category);

export const searchMechasByName = (pattern: string): Mecha[] =>
  mechaRepository.searchMechasByName(pattern);
