import React from "react";
import RetroCard from "./RetroCard";

/**
 * EquipmentView - Presentational component for displaying equipment and wages
 * Per CHARACTER_CREATION_SPEC: Screen F
 */
export default function EquipmentView({ 
  standardEquipment, 
  wages, 
  personalSavings,
  onRerollSavings 
}) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-retroblue uppercase tracking-widest">
        Step 4: Equipment & Credits
      </h2>

      {/* Standard Equipment Card */}
      <RetroCard title="Standard Issue Equipment">
        <p className="text-sm text-gray-600 mb-4">
          All equipment below is provided by the RDF at no cost. Lost or damaged equipment
          must be replaced from personal funds or requisitioned through proper channels.
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          {standardEquipment.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </RetroCard>

      {/* Wages Card */}
      <RetroCard title="Monthly Wages">
        <div className="bg-retroblue bg-opacity-10 p-4 rounded border border-retroblue">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-600">
                Monthly Pay (Levels {wages?.levelRange || "1-5"})
              </div>
              <div className="text-3xl font-bold text-retrogreen">
                {wages?.monthly?.toLocaleString() || "0"} cr
              </div>
            </div>
            <div className="text-xs text-gray-600 text-right max-w-xs">
              <p>Paid on the 1st of each month.</p>
              <p>Deductions: taxes, barracks fees, mess hall (if applicable)</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 <strong>Note:</strong> Wages increase with promotions and level advancement.
        </p>
      </RetroCard>

      {/* Personal Savings Card */}
      <RetroCard title="Personal Savings (Starting Credits)">
        <div className="bg-retroyellow bg-opacity-10 p-4 rounded border border-retroyellow">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-600">Starting Credits</div>
              <div className="text-3xl font-bold text-retroblue">
                {personalSavings?.toLocaleString() || "0"} cr
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Rolled: 2d6 × 100 credits
              </div>
            </div>
            <button
              onClick={onRerollSavings}
              className="bg-retroyellow hover:bg-yellow-600 text-retrotext font-bold py-2 px-4 rounded border border-retrotext"
            >
              🎲 Re-roll Savings
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3">
          These are your personal funds accumulated before joining the RDF. Use them wisely
          for personal gear, equipment upgrades, or off-duty expenses.
        </p>
      </RetroCard>

      {/* Equipment Notes */}
      <div className="bg-gray-100 border-l-4 border-retroblue p-4 text-sm">
        <h3 className="font-bold mb-2">📦 Equipment Guidelines</h3>
        <ul className="space-y-1 list-disc list-inside text-gray-700">
          <li>
            <strong>Standard Issue:</strong> Cannot be sold. Damage/loss may result in
            disciplinary action.
          </li>
          <li>
            <strong>Personal Purchases:</strong> Available at base store or off-base vendors.
            Prices vary by location.
          </li>
          <li>
            <strong>Black Market:</strong> Illegal items available at 2-5× normal cost with
            connections and risk.
          </li>
          <li>
            <strong>Mecha Weapons:</strong> Mission-specific ordinance issued by armory.
            Personal modifications require approval.
          </li>
        </ul>
      </div>
    </div>
  );
}

import PropTypes from "prop-types";

EquipmentView.propTypes = {
  standardEquipment: PropTypes.arrayOf(PropTypes.string).isRequired,
  wages: PropTypes.shape({
    monthly: PropTypes.number,
    levelRange: PropTypes.string,
  }),
  personalSavings: PropTypes.number,
  onRerollSavings: PropTypes.func.isRequired,
};
