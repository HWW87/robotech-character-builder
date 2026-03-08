/**
 * Faction definitions and image mappings
 * Centralized configuration for all factions in the application
 */

// Import faction images
import rdfImage from '../assets/factions/rdf.png';
import zentraediImage from '../assets/factions/zentraedi.png';
import southernCrossImage from '../assets/factions/southern_cross.png';
import refImage from '../assets/factions/ref.png';
import invidImage from '../assets/factions/invid.png';

/**
 * Unique faction identifiers
 * Lowercase with underscores to match asset file names
 */
export type FactionId = 'rdf' | 'zentraedi' | 'southern_cross' | 'ref' | 'invid';

/**
 * Faction configuration record
 * Each faction has an id, display name, optional description, and image asset
 */
export interface FactionConfig {
  id: FactionId;
  name: string;
  description?: string;
  image: string;
}

/**
 * Complete faction mappings
 * Key is FactionId, value is FactionConfig
 * Adding a new faction requires:
 * 1. Adding image to src/assets/factions/
 * 2. Importing the image above
 * 3. Adding entry to this FACTIONS record
 */
export const FACTIONS: Record<FactionId, FactionConfig> = {
  rdf: {
    id: 'rdf',
    name: 'RDF - Robotech Defense Force',
    description: 'The primary human military force defending Earth from extraterrestrial threats.',
    image: rdfImage,
  },
  zentraedi: {
    id: 'zentraedi',
    name: 'Zentraedi Regime',
    description: 'A warrior culture originating from Zeon space, converted to human ways.',
    image: zentraediImage,
  },
  southern_cross: {
    id: 'southern_cross',
    name: 'Southern Cross Army',
    description: 'Military force controlling the southern hemisphere of Earth.',
    image: southernCrossImage,
  },
  ref: {
    id: 'ref',
    name: 'REF - Robotech Expeditionary Force',
    description: 'Deep space military force operating beyond Earth\'s sphere of influence.',
    image: refImage,
  },
  invid: {
    id: 'invid',
    name: 'Invid Collective',
    description: 'Alien hive mind collective seeking technological dominance.',
    image: invidImage,
  },
};

/**
 * Get faction configuration by id
 * @param id Faction id
 * @returns Faction configuration or undefined
 */
export function getFactionById(id: FactionId | string): FactionConfig | undefined {
  return FACTIONS[id as FactionId];
}

/**
 * Get all faction ids
 * @returns Array of all faction ids
 */
export function getFactionIds(): FactionId[] {
  return Object.keys(FACTIONS) as FactionId[];
}

/**
 * Get all faction configurations
 * @returns Array of all faction configurations
 */
export function getAllFactions(): FactionConfig[] {
  return Object.values(FACTIONS);
}
