# Dependency Update Plan

## Phase 1: Migrate to Vite

**Goal:** Replace Create React App with Vite

**Remove:**
- `react-scripts`
- `@storybook/preset-create-react-app`

**Add:**
- `vite`
- `@vitejs/plugin-react`

**Tasks:**
1. Create `vite.config.ts`
2. Update `index.html` (move to root, add script entry point)
3. Update `tsconfig.json` for Vite
4. Replace `react-scripts` scripts in package.json
5. Update environment variable usage (`REACT_APP_` → `VITE_`)
6. Remove CRA-specific files

---

## Phase 2: Update React & TypeScript

**Goal:** Update core framework

**Update:**
- `react` 16.13.1 → 18.x
- `react-dom` 16.13.1 → 18.x
- `typescript` 3.7.5 → 5.x
- `@types/react` → 18.x
- `@types/react-dom` → 18.x
- `@types/node` → latest

**Tasks:**
1. Update packages
2. Change `ReactDOM.render()` to `createRoot()` API
3. Fix any TypeScript errors from stricter types

---

## Phase 3: Remove Unused Dependencies

**Goal:** Clean up unused packages early to reduce noise

**Remove:**
- `husky`
- `@testing-library/jest-dom`
- `@testing-library/react`
- `@testing-library/user-event`
- `@types/jest`
- `@types/classnames` (classnames has built-in types)
- `redux-mock-store`

**Tasks:**
1. Remove packages
2. Remove husky config from package.json
3. Delete any `.husky` directory if exists
4. Evaluate lint-staged: keep if using eslint, remove otherwise

---

## Phase 4: Replace react-router with wouter

**Goal:** Lighter-weight routing

**Remove:**
- `react-router-dom`
- `@types/react-router-dom`

**Add:**
- `wouter`

**Tasks:**
1. Install wouter
2. Replace imports and components:
   - `BrowserRouter` → `Router` (or remove, wouter auto-detects)
   - `Switch` → `Switch` (similar API)
   - `Route` → `Route`
   - `useHistory` → `useLocation`
   - `useParams` → `useParams`
   - `Link` → `Link`
3. Update any programmatic navigation

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
