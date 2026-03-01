# PREPROCESS_LOG

Registro de acciones para el preprocesado de manuals (PDF → JSON).

Fecha: 2026-03-01

- Creado `scripts/convert_manuals.js`: script Node que lee `public/manuals/*.pdf`, extrae texto por página con `pdfjs-dist` y escribe `src/data/manuals_parsed.json`.
- Añadido script npm `preprocess:manuals` en `package.json`.

Cómo usar (en tu entorno local):

1. Instalar dependencias (si no están ya):

```bash
npm install
```

2. Ejecutar el preprocesado:

```bash
npm run preprocess:manuals
```

Salida esperada:
- `src/data/manuals_parsed.json` con una entrada por cada PDF procesado, cada una con `name` y `pages: string[]`.

Notas y siguientes pasos:
- Este script crea JSON con el texto plano por página. Dependiendo del formato que necesites para `occ_rdf.json` y `skills_rdf.json`, puede ser necesario un transformador adicional que extraiga secciones, tablas o patrones específicos.
- Alternativa: si los manuals ya existen en un formato estructurado fuera del repo, preferible integrarlos directamente en `src/data/` y omitir el parseo en el build.

---

## Ejecución realizada (2026-03-01)

- Ejecuté `npm install pdf-parse` y `npm run preprocess:manuals`.
- Resultado inicial: Se generó `src/data/manuals_parsed.json` con estructura pero sin texto (`pages` vacía) debido a dificultades de compatibilidad con pdf-parse en el entorno Node.
- Script actualizado a CommonJS y documentado en `scripts/convert_manuals.js` como base para preprocesado futuro.

### Alternativas recomendadas para extracción de texto completa:

1. **Herramienta externa (pdftotext)**:
   ```bash
   pdftotext public/manuals/Robotech\ -\ Book1\ -\ Main.pdf -
   ```
   Luego procesar manualmente el output y crear `src/data/manuals_parsed.json`.

2. **Script Python** (más robusto):
   ```bash
   pip install PyPDF2
   python scripts/convert_manuals.py
   ```

3. **Usar pdfdesc o herramientas CLI** como `pdf2json` y procesar el JSON resultante.

### Estructura de `src/data/manuals_parsed.json` esperada:
```json
{
  "Robotech - Book1 - Main.pdf": {
    "name": "Robotech - Book1 - Main.pdf",
    "pages": [
      "Página 1: texto completo aquí...",
      "Página 2: más texto..."
    ],
    "numPages": 2
  }
}
```

Una vez que tengas el JSON con texto real, el resto del pipeline (memoización, cálculos, UI) funciona sin problemas.

***
