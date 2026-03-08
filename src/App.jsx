import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PersonalDataPage from "./pages/PersonalDataPage";
import FactionPage from "./pages/FactionPage";
import AttributesPage from "./pages/AttributesPage";
import VitalityPage from "./pages/VitalityPage";
import OCCPage from "./pages/OCCPage";
import SkillsPage from "./pages/SkillsPage";
import EquipmentPage from "./pages/EquipmentPage";
import MechaPage from "./pages/MechaPage";
import AlignmentPage from "./pages/AlignmentPage";
import SummaryPage from "./pages/SummaryPage";
import ManualsPage from "./pages/ManualsPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center p-6 bg-retrobg text-retrotext font-retro">
        <header className="w-full max-w-5xl flex justify-between items-center border-b border-retrogray pb-4 mb-6">
          <h1 className="text-3xl font-bold text-retroblue tracking-widest uppercase">
            Robotech Character Builder
          </h1>
          <nav className="flex gap-4 text-sm sm:text-base text-retrotext">
            <Link to="/" className="hover:text-retroblue">Personal</Link>
            <Link to="/faction" className="hover:text-retroblue">Faction</Link>
            <Link to="/attributes" className="hover:text-retroblue">Attributes</Link>
            <Link to="/vitality" className="hover:text-retroblue">Vitality</Link>
            <Link to="/occ" className="hover:text-retroblue">O.C.C.</Link>
            <Link to="/skills" className="hover:text-retroblue">Skills</Link>
            <Link to="/equipment" className="hover:text-retroblue">Equipment</Link>
            <Link to="/mecha" className="hover:text-retroblue">Mecha</Link>
            <Link to="/alignment" className="hover:text-retroblue">Alignment</Link>
            <Link to="/summary" className="hover:text-retroblue font-semibold">Summary</Link>
            <Link to="/manuals" className="hover:text-retroblue">Manuales</Link>
          </nav>
        </header>

        <main className="w-full max-w-5xl">
          <Routes>
            <Route path="/" element={<PersonalDataPage />} />
            <Route path="/personal" element={<PersonalDataPage />} />
            <Route path="/faction" element={<FactionPage />} />
            <Route path="/attributes" element={<AttributesPage />} />
            <Route path="/vitality" element={<VitalityPage />} />
            <Route path="/occ" element={<OCCPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/mecha" element={<MechaPage />} />
            <Route path="/alignment" element={<AlignmentPage />} />
            <Route path="/summary" element={<SummaryPage />} />
            <Route path="/manuals" element={<ManualsPage />} />
          </Routes>
        </main>

        <footer className="text-center mt-10 text-xs text-gray-500">
          Robotech RDF Builder v1.0 — Powered by React + Tailwind + Vite
        </footer>
      </div>
    </Router>
  );
}
