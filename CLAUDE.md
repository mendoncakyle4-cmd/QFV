# Quantum Field Explorer (QFV) — Project Instructions

> Loaded into Claude's context at the start of every session.

---

## 🧭 Project Overview

**Quantum Field Explorer** is a React 18 + TypeScript + Vite + TailwindCSS web app for exploring quantum physics, field theory, and the "Perspectives of Reality" across scientific and philosophical frameworks (Vedic, Tesla, Faraday, Maxwell, Einstein, Bohm, VQFTG).

- **Repo:** `https://github.com/mendoncakyle4-cmd/QFV`
- **Owner:** Kyle Mendonca (`mendoncakyle4@gmail.com`)
- **Live dev:** `npm run dev` → `http://localhost:3000`
- **Stack:** React 18, TypeScript, Vite, TailwindCSS, Zustand, Three.js / react-three-fiber, Framer Motion

---

## ⚡ Common Commands

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Production build | `npm run build` |
| Type-check only | `npx tsc --noEmit` |
| Preview build | `npm run preview` |
| Lint | `npm run lint` |

---

## 🏗 Architecture

```
src/
  components/       # Reusable UI (layout/, perspectives/, visualizations/)
  views/            # Full-page views per route
    perspectives/   # Individual perspective detail pages
  state/            # Zustand stores (useNavigationStore, etc.)
  data/             # Static typed data (perspectivesData.ts, etc.)
  types/            # Shared TypeScript interfaces
  hooks/            # Custom React hooks
```

### Routing
- No React Router — navigation is handled by **Zustand** (`src/state/useNavigationStore.ts`)
- `AppRoute` type controls valid routes (e.g. `'/'`, `'/perspectives'`, `'/vacuum'`)
- `activeExperimentSlug` drives sub-page rendering within a route

### State Management
- **Zustand** only — no Redux, no Context API for global state
- Keep stores thin; derive computed values inside components

---

## 🔬 Scientific Integrity Rules (NON-NEGOTIABLE)

1. **Three-Layer Disclosure** on every Perspective card: Source → Visual → Science comparison
2. **Non-equivalence warnings** must appear when mixing ancient/modern frameworks
3. **VQFTG** always shows the persistent red disclaimer:
   > "Proposed Contemporary Framework · Not peer-reviewed or experimentally verified"
4. No pseudo-science claims presented as established fact
5. False-color visualizations must include a legend + "what am I seeing?" panel

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#06090E` (near-black navy) |
| Accent cyan | `#06B6D4` |
| Accent violet | `#8B5CF6` |
| Warning red | `#EF4444` |
| Font | Inter (sans-serif) |

- Animations: **Framer Motion** for page transitions, `react-three-fiber` for 3D
- All interactive elements must have accessible `aria-*` attributes

---

## 🔐 Secrets & Environment

- API keys and secrets live in **`.env`** (gitignored — never commit this)
- Safe-to-commit template: **`.env.example`**
- Load env vars via `import.meta.env.VITE_*` (Vite convention)

---

## 📐 Code Style

- **TypeScript strict mode** — no `any` types unless absolutely unavoidable
- Prefer named exports over default exports for components
- File naming: `PascalCase` for components/views, `camelCase` for hooks/utils
- Max component length: ~200 lines — split if larger
- Co-locate component-specific types in the component file unless shared
- Always handle loading + error states in async hooks
