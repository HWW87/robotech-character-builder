import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

export async function parseManuals() {
  // Si ya los leímos antes, no los parseamos otra vez
  const cached = localStorage.getItem("robotech_manual_data");
  if (cached) return JSON.parse(cached);

  const manuals = [
    { key: "RDF", path: "/manuals/Robotech-Book1-Main.pdf" },
    { key: "SC", path: "/manuals/Robotech-Book4-SouthernCross.pdf" },
  ];

  const parsed = {};

  for (const { key, path } of manuals) {
    try {
      const pdf = await pdfjsLib.getDocument(path).promise;
      let text = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(" ") + " ";
      }

      parsed[key] = extractData(key, text);
    } catch (err) {
      console.error(`Error parsing ${path}:`, err);
    }
  }

  localStorage.setItem("robotech_manual_data", JSON.stringify(parsed));
  return parsed;
}

/**
 * Extrae OCC y habilidades de texto PDF según la facción
 */
function extractData(faction, text) {
  const data = { occ: [], skills: [] };

  if (faction === "RDF") {
    // Ejemplo: “Veritech Fighter Pilot O.C.C.” → Veritech Fighter Pilot
    const occMatches = [...text.matchAll(/([A-Z][A-Za-z'\- ]+?) O\.C\.C\./g)].map(m => m[1]);
    data.occ = Array.from(new Set(occMatches));

    // Skills comunes, separadas por categoría
    const skillMatches = [...text.matchAll(/([A-Z][A-Za-z]+)\s+Skills/gi)].map(m => m[1]);
    data.skills = Array.from(new Set(skillMatches));
  }

  if (faction === "SC") {
    const occMatches = [...text.matchAll(/([A-Z][A-Za-z'\- ]+?) O\.C\.C\./g)].map(m => m[1]);
    data.occ = Array.from(new Set(occMatches));

    const skillMatches = [...text.matchAll(/([A-Z][A-Za-z]+)\s+Skills/gi)].map(m => m[1]);
    data.skills = Array.from(new Set(skillMatches));
  }

  return data;
}
