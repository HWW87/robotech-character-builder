# Plan de mejoras — Robotech Character Builder

Objetivo: priorizar e implementar mejoras para reducir duplicación, mejorar rendimiento y preparar el proyecto para futuras refactorizaciones.

1) Unificar estado del personaje (prioridad: alta)
   - Usar `useCharacterData` como fuente única de verdad.
   - Cambios: eliminar `currentCharacter` en `src/App.jsx`, hacer que todas las páginas/components consuman el hook (o un Context basado en él).
   - Beneficio: evita desincronizaciones entre componentes y centraliza persistencia en `localStorage`.

2) Evitar parseo de PDFs en hilo principal (prioridad: alta)
   - Mover parseo fuera del bundle (preprocesar a JSON) o ejecutar en Web Worker/backend.

3) Debounce y persistencia eficiente (prioridad: medium)
   - Debounce en escritura a `localStorage` en `useCharacterData` (300–500ms).

4) Memoización de cálculos costosos (prioridad: medium)
   - `calculateSkills` y `calcModifiers` deberían memoizarse con `useMemo` o caches internas.

5) Separar lógica y presentación (priority: medium)
   - Extraer lógica de páginas a hooks o controllers.

6) Validaciones y feedback de UI (priority: low)
   - Mejor manejo de import/export, errores y confirmaciones.

7) Tests unitarios (priority: low)
   - Añadir tests para `calculateSkills`, `calcModifiers` y `useCharacterData`.

Implementación actual: aplicaré la mejora #1 con cambios mínimos a:
- `src/hooks/useCharacterData.js` (soportar reemplazo total del objeto)
- `src/App.jsx` (remover estado local y props redundantes)
- `src/pages/SummaryPage.jsx` (usar `useCharacterData` como las demás páginas)

Paso siguiente: ejecutar la refactor mínima y comprobar que la app compila.
