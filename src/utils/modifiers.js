/**
 * Calcula los modificadores de atributos según las tablas del manual Robotech (Macross)
 * Fuente: pág. 7 del libro original.
 */
export const calcModifiers = (attrs) => {
  const mods = {};

  mods.skillsBonus = attrs.IQ >= 17 ? (attrs.IQ - 14) : 0;
  mods.saveVsInsanity = attrs.ME >= 17 ? attrs.ME - 16 : 0;
  mods.trustIntimidate = attrs.MA >= 17 ? attrs.MA - 16 : 0;
  mods.handToHandDamage = attrs.PS >= 17 ? Math.floor((attrs.PS - 15) / 2) : 0;
  mods.dodgeParryStrike = attrs.PP >= 17 ? Math.floor((attrs.PP - 16) / 2) : 0;
  mods.saveComaDeath = attrs.PE >= 17 ? (attrs.PE - 16) * 2 : 0;
  mods.charmImpress = attrs.PB >= 17 ? (attrs.PB - 16) * 5 : 0;

  return mods;
};

/**
 * Calcula bonificaciones de atributos para aplicar a skills
 * Per CHARACTER_CREATION_SPEC: si IQ >= 17, aplicar iqBonusPercent a todos los skills (one-time)
 * @param {Object} attrs - AttributeValues {IQ, ME, MA, PS, PP, PE, PB, Spd}
 * @returns {Object} {iqBonusPercent?}
 */
export const calculateAttributeBonuses = (attrs) => {
  const bonuses = {};

  // IQ >= 17 gives one-time skill bonus
  if (attrs.IQ >= 17) {
    // Bonus is IQ - 14 (matching skillsBonus from calcModifiers)
    bonuses.iqBonusPercent = attrs.IQ - 14;
  }

  return bonuses;
};
