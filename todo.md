# Project Progress Tracker (todo.md)

**Last updated:** 2026-07-28

*Refer to `phases.md` for full phase details, descriptions, and exit criteria.*

---

## Phase 0: Governance Setup (Completed)
- [x] Analyze existing codebase stack (`package.json`, `server.ts`, `src/App.tsx`, `SOAPNoteView.tsx`, etc.)
- [x] Create 11 root governance files (`system-instructions.md`, `todo.md`, `architecture.md`, `ui-dna.md`, `dependency-lockbase.md`, `project-context.md`, `prd.md`, `rules.md`, `phases.md`, `design.md`, `memory.md`)
- [x] Log Phase 0 completion in `memory.md`

---

## Phase 1: Startup-Polish & De-Hackathon-ify (Completed)
- [x] Rename `package.json` project name from `react-example` to `medscribe-lite`
- [x] Integrate `motion` sub-200ms enter/exit transitions across all modals (`EncounterHistoryModal`, `PrintPrescriptionModal`, `ClinicAnalyticsModal`)
- [x] Implement accessibility focus trap, Escape key closing, ARIA tags (`aria-modal`, `aria-labelledby`), and visible focus rings
- [x] Add skeleton-loading states for `TranscriptInput` and `SOAPNoteView` during AI note generation
- [x] Upgrade `SafetyAlertsPanel` alert cards with motion spring hover/focus states and high-severity glowing indicators
- [x] Update `index.html` title from `My Google AI Studio App` to `MedScribe Lite — AI Clinical Assistant`
- [x] Clean `src/components/Header.tsx`: remove model version badge (`Gemini 3.6 Engine`) and stray `Bento AI` tag
- [x] Rewrite `README.md` to professional startup standards
- [x] Create repository metadata files (`LICENSE`, `SECURITY.md`, `CHANGELOG.md`)
- [x] Document environment variable requirements (`.env.example` audit)
- [x] Audit UI empty states, error fallbacks, and loading indicators across all components

---

## Phase 2: Code Quality & Refactoring (Completed)
- [x] Refactor `src/components/SOAPNoteView.tsx` (772 lines) into modular subcomponents inside `src/components/soap-note/`
- [x] Define concrete design tokens in `ui-dna.md` (colors, typography scale, spacing scale, component variants)
- [x] Wire design tokens into Tailwind CSS v4 config (`src/index.css`)
- [x] Systematically refactor all components across `src/components/` to use token-based classes
- [x] Set up automated unit/component test harness (`vitest` + `@testing-library/react`)
- [x] Resolve Vitest worker startup CI crash by switching test environment from `jsdom` to `happy-dom`
- [x] Configure CI/CD check pipeline (`.github/workflows/ci.yml`)

---

## Phase 3: Positioning & Launch Assets
- [x] Lock target customer segment to Small Independent Clinics & Community Health Centers in `project-context.md`
- [x] Define concrete 3-tier pricing structure ($0 Free / $19 Clinic / $49 Multi-Provider) in `prd.md`
- [x] Execute UI copy pass in `Header.tsx`, `App.tsx`, and `TranscriptInput.tsx` to highlight "Clinical Safety Copilot" positioning
- [x] Design standalone product marketing landing page (`src/components/LandingPage.tsx`) with hero positioning, problem grid, Bento product preview, 3 pricing tiers, and request access CTA form
- [ ] Generate high-impact product screenshots and visual assets
- [ ] Finalize startup positioning documentation

---

## Phase 4: Feature Backlog
- [ ] Multi-language consultation input & translation support
- [x] FHIR JSON export integration
- [x] Real-time drug-drug interaction database lookup
- [x] Documentation Confidence scoring per SOAP section (Subjective, Objective, Assessment, Plan metrics with reasoning tooltips)
- [x] Offline/local-model mode (Browser-local clinical NLP fallback engine & mode toggle)
