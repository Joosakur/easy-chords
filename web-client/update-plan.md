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

## Phase 5: Update Storybook

**Goal:** Update to modern Storybook with Vite (enables visual validation for later phases)

**Remove:**
- `@storybook/addon-knobs` (deprecated)
- `@storybook/addons` (replaced by @storybook/manager-api)
- `@storybook/preset-create-react-app`

**Update:**
- `@storybook/react` → 8.x
- `@storybook/addon-actions` → 8.x
- `@storybook/addon-links` → 8.x
- `@storybook/theming` → 8.x

**Add:**
- `@storybook/react-vite`

**Tasks:**
1. Update Storybook packages
2. Create new `.storybook/main.ts` config for Vite
3. Migrate stories to CSF3 format
4. Replace knobs with built-in controls (args)
5. Update storybook scripts in package.json

---

## Phase 6: Remove Semantic UI

**Goal:** Remove unmaintained Semantic UI, keep styled-components only

**Remove:**
- `semantic-ui-react`
- `semantic-ui-checkbox`
- `semantic-ui-dropdown`
- `semantic-ui-input`

**Tasks:**
1. Audit current Semantic UI usage in codebase
2. Replace each component with styled-components equivalents
3. For dropdowns: evaluate small libraries (react-select, downshift) or build custom
4. Remove Semantic UI CSS imports if any
5. Use Storybook to visually validate replacement components

---

## Phase 7: Update Redux Ecosystem

**Goal:** Update Redux packages (keep redux-saga)

**Update:**
- `@reduxjs/toolkit` 1.3.6 → 2.x
- `redux` 4.0.5 → 5.x
- `react-redux` 7.2.0 → 9.x
- `redux-saga` 1.1.3 → 1.4.x

**Remove:**
- `@types/react-redux` (included in react-redux 8+)

**Tasks:**
1. Update packages
2. Fix any API changes in RTK 2.x
3. Verify saga functionality still works

---

## Phase 8: Update Remaining Dependencies

**Update:**
- `axios` 0.19.2 → 1.x
- `styled-components` 5.1.0 → 6.x
- `@fortawesome/fontawesome-svg-core` → 6.x
- `@fortawesome/free-solid-svg-icons` → 6.x
- `@fortawesome/react-fontawesome` → 0.2.x
- `classnames` → latest
- `lodash` → latest
- `polished` → 4.x
- `@types/lodash` → latest
- `@types/styled-components` → latest

**Tasks:**
1. Update axios, handle any request/response interceptor changes
2. Update styled-components, fix any API changes
3. Update Font Awesome, check for renamed icons
4. Update utility libraries

---

## Phase 9: Migrate react-dnd to dnd-kit

**Goal:** Modern drag-and-drop (low priority feature)

**Remove:**
- `react-dnd`
- `react-dnd-html5-backend`

**Add:**
- `@dnd-kit/core`
- `@dnd-kit/sortable` (if needed)
- `@dnd-kit/utilities` (if needed)

**Tasks:**
1. Audit current drag-and-drop usage
2. Replace DndProvider with DndContext
3. Update draggable/droppable components to dnd-kit API
4. Update drag handlers

---

## Phase 10: Cleanup

**Tasks:**
1. Run `npm audit fix`
2. Remove unused imports throughout codebase
3. Update eslint config if needed (remove react-app extends if CRA-specific)
4. Verify build works
5. Verify dev server works
6. Test all functionality manually

---

## Dependency Summary

### Final Dependencies
```
dependencies:
  @dnd-kit/core
  @dnd-kit/sortable (if needed)
  @fortawesome/fontawesome-svg-core ^6.x
  @fortawesome/free-solid-svg-icons ^6.x
  @fortawesome/react-fontawesome ^0.2.x
  @reduxjs/toolkit ^2.x
  axios ^1.x
  classnames ^2.5.x
  lodash ^4.17.x
  polished ^4.x
  react ^18.x
  react-dom ^18.x
  react-redux ^9.x
  redux ^5.x
  redux-saga ^1.4.x
  styled-components ^6.x
  wouter ^3.x

devDependencies:
  @storybook/addon-actions ^8.x
  @storybook/addon-links ^8.x
  @storybook/react ^8.x
  @storybook/react-vite ^8.x
  @storybook/theming ^8.x
  @types/lodash
  @types/node
  @types/react
  @types/react-dom
  @types/styled-components
  @vitejs/plugin-react
  lint-staged (evaluate)
  prettier ^3.x
  typescript ^5.x
  vite
```

### Removed
- react-scripts (CRA)
- react-router-dom
- react-dnd, react-dnd-html5-backend
- semantic-ui-react, semantic-ui-checkbox, semantic-ui-dropdown, semantic-ui-input
- husky
- All @testing-library packages
- @storybook/addon-knobs
- @storybook/preset-create-react-app
- redux-mock-store
- Various @types packages (now included in main packages)
