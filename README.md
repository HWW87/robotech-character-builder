# Robotech Character Builder

Una aplicación interactiva para crear personajes RPG en el universo de Robotech, desarrollada con React + Vite + Tailwind CSS.

## 🎯 Características

- **Datos Personales**: Nombre, apodo, edad, alineamiento (sistema Palladium de 7 alineamientos), foto
- **Selección de Facción**: RDF o Southern Cross
- **Atributos**: Generación de características base (Fuerza, Destreza, Constitución, etc.)
- **O.C.C. (Occupational Character Class)**: Selecciona tu profesión/clase con habilidades asociadas
- **Sistema de Habilidades**: 
  - Habilidades primarias por O.C.C. con bonos automáticos
  - Selección de habilidades secundarias con límites configurables
  - Bonos manuales adicionales
  - Cálculo automático de totales: Base + OCC Bonus + Manual Extras + Per-Level × (Level - 1)
- **Asignación de Mecha**: Selecciona desde un catálogo completo con estadísticas detalladas (M.D.C. por ubicación, armamento, etc.)
- **Resumen Completo**: Vista de todo el personaje con exportación/importación (en desarrollo)

## 🛠 Tech Stack

- **React 18** — UI library
- **Vite 7** — Build tool & dev server
- **Tailwind CSS 3** — Styling (retro theme)
- **React Router 6** — Navigation
- **Vitest + Testing Library** — Unit testing

## 🚀 Inicio Rápido

### Requisitos previos
- Node.js 16+ 
- npm o pnpm

### Instalación

```bash
git clone https://github.com/tu-usuario/robotech-character-builder.git
cd "Robotech Character Builder"
npm install
```

### Desarrollo

```bash
npm run dev
```

Abre http://localhost:5173/ en tu navegador.

### Tests

```bash
npm test
npm test -- --run --silent  # Modo no-watch
```

### Build

```bash
npm run build
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── pages/              # Páginas principales (rutas)
│   ├── PersonalDataPage.jsx
│   ├── FactionPage.jsx
│   ├── AttributesPage.jsx
│   ├── OCCPage.jsx
│   ├── SkillsPage.jsx
│   ├── MechaPage.jsx
│   └── SummaryPage.jsx
├── components/         # Componentes reutilizables
│   ├── PersonalDataForm.jsx
│   ├── FactionView.jsx
│   ├── OCCSelector.jsx
│   ├── SkillManager.jsx
│   ├── MechaSelector.jsx
│   ├── SummaryView.jsx
│   └── RetroCard.jsx   # Contenedor estilizado
├── hooks/              # Custom hooks
│   └── useCharacterData.js  # Estado global del personaje
├── utils/              # Funciones auxiliares
│   ├── occRules.js     # Lógica de O.C.C. y habilidades
│   ├── skillCalculator.js   # Cálculo de totales
│   ├── mechaStats.js   # Catálogo de mechas
│   └── modifiers.js    # Cálculo de modificadores
└── data/               # Datos estáticos en JSON
    ├── occ_rdf.json    # Definiciones de O.C.C.
    ├── skills_rdf.json # Catálogo de habilidades
    ├── mechas.json     # Resumen de mechas
    └── alignments.json # Alineamientos Palladium
```

## 🎮 Flujo del Personaje

1. **Datos Personales** → Nombre, foto, alineamiento
2. **Facción** → RDF o Southern Cross
3. **Atributos** → Puntuaciones de características
4. **O.C.C.** → Selecciona clase y recibe habilidades base
5. **Habilidades** → Completa habilidades secundarias y añade bonos extra
6. **Mecha** → Escoge tu unidad móvil
7. **Resumen** → Visualiza y exporta tu personaje

## 🧪 Tests

Los tests están ubicados junto a los componentes con sufijo `.test.jsx` o `.test.js`.

Cobertura actual: 
- ✅ Utils (occRules, skillCalculator, modifiers)
- ✅ Componentes principales (OCCSelector, SkillManager, SummaryView, FactionView)
- ⏳ Hooks y Pages (parcialmente skipped en CI)

## 📝 Datos Disponibles

### O.C.C. (Operación Clases de Personaje)
Profesiones incluidas: Piloto de Veritech, Operador de Destroid, Soldado, Técnico, etc.

### Habilidades
Catálogo normalizado con:
- Valor base
- Bonificación por nivel
- Categorización (Piloto, Combate, Técnico, etc.)

### Mechas
Catálogo Robotech Macross era:
- Veritech VF-1 series (transformables)
- Destroid Excaliber, Gladiator, Raidar X, Spartan
- M.A.C. II (Monster)

Con detalles completos: M.D.C., armamento, especificaciones.

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/MiFeature`)
3. Commit tus cambios (`git commit -m 'Add: MiFeature'`)
4. Push a la rama (`git push origin feature/MiFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT © 2026

---

**Nota**: Este proyecto está en desarrollo activo. Algunas características están en construcción.
