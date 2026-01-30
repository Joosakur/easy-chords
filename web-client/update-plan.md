# Dependency Update Plan

## Phase 1: Migrate to Vite - COMPLETE

**Goal:** Replace Create React App with Vite

**Removed:**
- `react-scripts`

**Added:**
- `vite` ^6.0.7
- `@vitejs/plugin-react` ^4.3.4

**Also updated (required for Vite compatibility):**
- `typescript` 3.7.5 → 5.x
- `@types/node` 12.x → 22.x

**Completed:**
1. Created `vite.config.ts`
2. Moved `index.html` to root with module script entry
3. Updated `tsconfig.json` for Vite/TS5
4. Replaced `react-scripts` scripts with vite commands
5. No `REACT_APP_` variables were in use
6. Removed CRA-specific files (`react-app-env.d.ts`, `setupTests.ts`)
7. Added `src/vite-env.d.ts` for Vite types
8. Fixed absolute imports in help pages to relative imports

**Notes:**
- Storybook scripts won't work until Phase 5
- Build produces chunk size warning (can address with code-splitting later)

---

## Phase 2: Update React - COMPLETE

**Goal:** Update React to v18

**Updated:**
- `react` 16.13.1 → 18.3.1
- `react-dom` 16.13.1 → 18.3.1
- `@types/react` → 18.x
- `@types/react-dom` → 18.x
- `react-dnd` 11.x → 16.x (required for React 18 compatibility)
- `react-dnd-html5-backend` 11.x → 16.x

**Added:**
- `react-is` (required by styled-components with React 18)

**Completed:**
1. Updated packages with `--legacy-peer-deps` (old storybook/semantic-ui have React 16 peer deps)
2. Changed `ReactDOM.render()` to `createRoot()` API in index.tsx
3. Updated RTK middleware config to use callback syntax
4. Fixed react-dnd useDrag API (type moved to top level)
5. Build and dev server working

---

## Phase 3: Remove Unused Dependencies - COMPLETE

**Goal:** Clean up unused packages early to reduce noise

**Removed:**
- `husky`
- `@testing-library/jest-dom`
- `@testing-library/react`
- `@testing-library/user-event`
- `@types/jest`
- `@types/classnames`
- `redux-mock-store`
- `lint-staged` (not useful without husky)

**Completed:**
1. Removed 132 packages total
2. Removed husky config from package.json
3. No `.husky` directory existed
4. Removed lint-staged (was broken pattern anyway, not useful without git hooks)

---

## Phase 4: Replace react-router with wouter - COMPLETE

**Goal:** Lighter-weight routing

**Removed:**
- `react-router-dom`
- `@types/react-router-dom`

**Added:**
- `wouter`

**Completed:**
1. Installed wouter, removed react-router-dom (net -9 packages)
2. Updated App.tsx - removed BrowserRouter wrapper, updated Switch/Route
3. Updated Help.tsx - replaced useRouteMatch with useRoute, updated imports
4. Updated Introduction.tsx - replaced Link import
5. Bundle size reduced from 617KB to 599KB

---

## Phase 5: Update Storybook - COMPLETE

**Goal:** Update to modern Storybook with Vite (enables visual validation for later phases)

**Removed:**
- `@storybook/addon-knobs`
- `@storybook/addon-actions` (now in addon-essentials)
- `@storybook/addon-links` (now in addon-essentials)
- `@storybook/addons`
- `@storybook/preset-create-react-app`

**Added:**
- `storybook` ^8.6.15
- `@storybook/react` ^8.x
- `@storybook/react-vite` ^8.x
- `@storybook/addon-essentials` ^8.x
- `@storybook/addon-interactions` ^8.x
- `@storybook/blocks` ^8.x
- `@storybook/manager-api` ^8.x
- `@storybook/theming` ^8.x

**Completed:**
1. Removed 1333 old packages, added 171 new (net -1162 packages!)
2. Vulnerabilities reduced from 59 to 2
3. Created new `.storybook/main.ts` config for Vite
4. Updated `.storybook/preview.tsx` with new decorator format, replaced redux-mock-store with real store
5. Updated `.storybook/manager.ts` with new API
6. Migrated `flex.stories.tsx` from knobs to CSF3 with args/controls
7. Updated storybook scripts in package.json

---

## Phase 6: Remove Semantic UI - COMPLETE

**Goal:** Remove unmaintained Semantic UI, keep styled-components only

**Removed:**
- `semantic-ui-react`
- `semantic-ui-checkbox`
- `semantic-ui-dropdown`
- `semantic-ui-input`
- 24 packages total

**Created:**
- `src/Components/common/Input.tsx` - Styled input component
- Updated `src/Components/common/Dropdown.tsx` - Custom dropdown with styled-components
  - Native `<select>` for simple option lists
  - Custom menu dropdown for complex menus
  - Exports: `DropdownMenu`, `DropdownHeader`, `DropdownItem`, `DropdownDivider`

**Updated:**
- `src/Components/main-view/ActionBar.tsx` - Use new Dropdown exports
- `src/Components/left-sidebar/ChordEditor.tsx` - Use new Input
- `src/Components/right-sidebar/Settings.tsx` - Use new Input
- `src/index.tsx` - Removed semantic-ui CSS imports

**Results:**
- Bundle size: 599KB → 514KB (-85KB, -14%)
- No external dropdown library needed

---

## Tooling: Replace ESLint + Prettier with Biome - COMPLETE

**Goal:** Simplify linting/formatting tooling

**Removed:**
- `eslint` and related plugins
- `prettier`
- 167 packages total

**Added:**
- `@biomejs/biome` ^2.3.13

**Completed:**
1. Installed Biome, removed ESLint + Prettier
2. Created `biome.json` with project-appropriate rules
3. Updated package.json scripts: lint, lint-fix, format, check, check-fix
4. Ran `biome check --write --unsafe` to format/lint entire codebase
5. Removed unused React imports (new JSX transform doesn't need them)
6. Converted string concatenation to template literals

---

## Phase 7: Update Redux Ecosystem - COMPLETE

**Goal:** Update Redux packages (keep redux-saga)

**Updated:**
- `@reduxjs/toolkit` 1.9.7 → 2.11.2
- `redux` 4.2.1 → 5.0.1
- `react-redux` 7.2.9 → 9.2.0
- `redux-saga` was already at 1.4.2

**Removed:**
- `@types/react-redux` (types included in react-redux 9.x)

**API Changes Fixed:**
1. `extraReducers` object notation → builder callback pattern (RTK 2.x requirement)
   - Updated `settings-slice.ts` and `piano-slice.ts`
2. No-payload actions need explicit `prepare()` (RTK 2.x stricter typing)
   - Updated `pianoKeysUp` reducer to use prepare notation
3. Removed explicit generic from `combineReducers<RootState>()` (Redux 5.x)

**Results:**
- Bundle size: 514KB → 508KB (-6KB)

---

## Phase 8: Update Remaining Dependencies - COMPLETE

**Updated:**
- `axios` 0.19.2 → 1.13.4
- `styled-components` 5.3.11 → 6.3.8
- `@fortawesome/fontawesome-svg-core` 1.2.36 → 7.1.0
- `@fortawesome/free-solid-svg-icons` 5.15.4 → 7.1.0
- `@fortawesome/react-fontawesome` 0.1.19 → 3.1.1
- `polished` 3.7.2 → 4.3.1
- `classnames` was already at 2.5.1 (latest)
- `lodash` was already at 4.17.23 (latest)
- `@types/lodash` was already at 4.17.23 (latest)

**Removed:**
- `@types/styled-components` (types included in styled-components 6.x)

**Notes:**
- No API changes needed - all packages worked without code modifications
- Vulnerabilities reduced from 2 to 0
- Bundle size increased: 508KB → 566KB (+58KB, due to Font Awesome 7.x)

**Results:**
- Total packages: 333
- Vulnerabilities: 0

---

## Phase 9: Migrate react-dnd to dnd-kit - COMPLETE

**Goal:** Modern drag-and-drop

**Removed:**
- `react-dnd`
- `react-dnd-html5-backend`
- 10 packages total

**Added:**
- `@dnd-kit/core`
- `@dnd-kit/utilities`
- 3 packages total

**Files Updated:**
1. `App.tsx` - Replaced `DndProvider` with `DndContext` and `useSensors`
2. `RootButton.tsx` - Replaced `useDrag`/`useDragLayer` with `useDraggable`/`DragOverlay`/`useDndMonitor`
3. `PianoKey.tsx` - Replaced `useDrop` with `useDroppable`
4. `.storybook/preview.tsx` - Updated to use `DndContext`

**API Migration:**
- `DndProvider` → `DndContext` with `PointerSensor`
- `useDrag` → `useDraggable` (id-based, simpler API)
- `useDrop` → `useDroppable` (data passed via `data` prop)
- Custom drag layer → `DragOverlay` component
- Drop result handling → `useDndMonitor` with `onDragEnd`

**Results:**
- Bundle size: 566KB → 560KB (-6KB)
- Total packages: 325

---

## Phase 10: Cleanup - COMPLETE

**Verified:**
1. `npm audit` - 0 vulnerabilities
2. `npm run build` - Successful (560KB bundle)
3. `npm run dev` - Dev server starts correctly
4. `npm run storybook` - Storybook starts correctly
5. `npm run check` - All Biome checks pass

**Final Stats:**
- Total packages: 325
- Vulnerabilities: 0
- Bundle size: 560KB (gzip: 193KB)

---

## Dependency Summary

### Final Dependencies
```
dependencies:
  @dnd-kit/core ^6.x
  @dnd-kit/utilities ^3.x
  @fortawesome/fontawesome-svg-core ^7.x
  @fortawesome/free-solid-svg-icons ^7.x
  @fortawesome/react-fontawesome ^3.x
  @reduxjs/toolkit ^2.x
  axios ^1.x
  classnames ^2.x
  lodash ^4.x
  polished ^4.x
  react ^18.x
  react-dom ^18.x
  react-is ^19.x
  react-redux ^9.x
  redux ^5.x
  redux-saga ^1.x
  styled-components ^6.x
  wouter ^3.x

devDependencies:
  @biomejs/biome ^2.x
  @storybook/addon-essentials ^8.x
  @storybook/addon-interactions ^8.x
  @storybook/blocks ^8.x
  @storybook/manager-api ^8.x
  @storybook/react ^8.x
  @storybook/react-vite ^8.x
  @storybook/theming ^8.x
  @types/lodash
  @types/node
  @types/react
  @types/react-dom
  @vitejs/plugin-react
  storybook ^8.x
  typescript ^5.x
  vite ^6.x
```

### Removed
- react-scripts (CRA)
- react-router-dom
- react-dnd, react-dnd-html5-backend (replaced by @dnd-kit)
- semantic-ui-react, semantic-ui-checkbox, semantic-ui-dropdown, semantic-ui-input
- husky, lint-staged
- eslint, prettier (replaced by Biome)
- All @testing-library packages
- @storybook/addon-knobs
- @storybook/preset-create-react-app
- redux-mock-store
- @types/react-redux (included in react-redux 9.x)
- @types/styled-components (included in styled-components 6.x)
- Various @types packages (now included in main packages)

---

## Overall Summary

**All 10 phases completed successfully.**

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Build System | Create React App | Vite 6.x | Modern, faster |
| React | 16.x | 18.x | +2 major versions |
| TypeScript | 3.7 | 5.x | +2 major versions |
| Storybook | 5.x | 8.x | +3 major versions |
| Redux Toolkit | 1.x | 2.x | +1 major version |
| Vulnerabilities | 59 | 0 | -59 |
| Bundle Size | 617KB | 560KB | -57KB (-9%) |

**Key Improvements:**
- Zero security vulnerabilities
- Modern build tooling (Vite instead of CRA)
- Simplified linting/formatting (Biome instead of ESLint+Prettier)
- Lighter routing (wouter instead of react-router)
- Modern drag-and-drop (@dnd-kit instead of react-dnd)
- No external UI library dependency (custom components instead of Semantic UI)
- All dependencies on latest stable versions
