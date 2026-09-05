# Project Execution Phases (phases.md)

---

## Phase 0: Governance Setup
- **Scope:** Initial codebase analysis and creation of 11 root governance files (`system-instructions.md`, `todo.md`, `architecture.md`, `ui-dna.md`, `dependency-lockbase.md`, `project-context.md`, `prd.md`, `rules.md`, `phases.md`, `design.md`, `memory.md`).
- **Exit Criteria:** All 11 root governance markdown files are created with accurate repository citations and Phase 0 completion logged in `memory.md`.

---

## Phase 1: Startup-Polish & De-Hackathon-ify
- **Scope:**
  - Rename `package.json` project name from `react-example` to `medscribe-lite`.
  - Rewrite `index.html` page title from `My Google AI Studio App` to `MedScribe Lite — AI Clinical Assistant`.
  - Remove exposed model-version badge (`Gemini 3.6 Engine`) and stray `Bento AI` tag from `src/components/Header.tsx`.
  - Rewrite `README.md` to professional startup-grade standard.
  - Add repository root compliance files (`LICENSE`, `SECURITY.md`, `CHANGELOG.md`).
  - Document all `.env` variables in `.env.example`.
  - Enhance UI error states, empty states, and loading indicators across all views.
- **Exit Criteria:** The project repository contains no generic AI Studio boilerplate metadata, exposed internal raw tags, or undocumented environment variables, and passes human UI review.

---

## Phase 2: Code Quality & Architecture Refactoring
- **Scope:**
  - Refactor `src/components/SOAPNoteView.tsx` (772 lines) into smaller modular components (`SubjectiveSection`, `ObjectiveSection`, `AssessmentSection`, `PlanSection`, `PrescriptionTable`).
  - Implement a clean design token layer for `src/index.css` replacing the basic 2-line Tailwind import.
  - Add automated component and API unit tests using Vitest/Jest.
  - Configure GitHub Actions CI workflow to run type-checking (`npm run lint`) and tests on push.
- **Exit Criteria:** `SOAPNoteView.tsx` line count is reduced under 200 lines, custom CSS tokens are established, and `npm run test` & `npm run lint` pass cleanly with automated CI checks.

---

## Phase 3: Positioning & Public Landing Page
- **Scope:**
  - Design and build a public-facing product landing page showcasing hero value proposition, primary care workflow diagram, interactive demo preview, pricing tiers, and call-to-action (CTA).
  - Produce high-impact demo assets, workflow graphics, and UI screenshots for clinical stakeholders.
- **Exit Criteria:** Prospective clinical users can navigate the landing page, understand the product's primary care value proposition, and access the documentation workstation seamlessly.

---

## Phase 4: Feature Backlog & Enterprise Integration
- **Scope:**
  - Multi-language consultation input and automated translation support (e.g., Spanish, French, Swahili, Hindi).
  - Standardized FHIR JSON export for interoperability with hospital electronic health record systems (EHR).
  - Integration of real-time drug-drug interaction database lookup API.
  - Granular AI confidence scoring per SOAP section and section-level uncertainty flags.
- **Exit Criteria:** Clinicians can input multi-language consultations and export valid FHIR R4 JSON resources directly from the SOAP Note workspace.

---

## Phase 5: Hardening
- **Scope:**
  - Security review: Audit `npm audit` vulnerabilities, secret leakage risk, API error responses, CORS restriction, prompt injection vulnerabilities, and client storage handling.
  - Edge-case and resilience testing: Ensure robust error boundaries, graceful API failure handling, and input edge case validation across all async workflows.
  - Internationalization: Support multi-language end-to-end processing starting with Spanish-language transcript inputs.
- **Exit Criteria:** Zero committed secrets, `npm audit` clean of high/critical vulnerabilities, error boundaries on every async flow, and at least Spanish-language transcript input supported end-to-end.

---

## Phase 6: SIH Pivot (MediKiosk — SIH Problem Statement 26047)

- **Scope:**
  - Pivot from doctor-facing MedScribe Lite to patient-facing MediKiosk for outpatient pre-consultation intake under Ministry of AYUSH / All India Institute of Ayurveda (AIIA) guidelines.
  - **Sub-phase (a): Kiosk UI Shell** — Patient-facing, high-contrast, touch-optimized kiosk wrapper with oversized touch targets, multilingual navigation, inactivity timers, and privacy safeguards.
  - **Sub-phase (b): ABHA Identity + Consent Screen** — Ayushman Bharat Health Account (ABHA) address/number input, QR code scanning, and patient informed consent flow.
  - **Sub-phase (c): Adaptive Voice+Touch Interview Engine (Allopathic)** — Conversational, symptom-directed clinical intake agent presenting dynamic follow-up questions with bilingual voice input and one-tap responses.
  - **Sub-phase (d): AYUSH/Ayurveda History Mode** — Dedicated intake capturing Prakriti (constitutional traits), Agni (digestive fire), Kostha, Ahara/Vihara (dietary & lifestyle habits), and Dosha-specific symptom characteristics.
  - **Sub-phase (e): Document Upload + Digitization** — Physical prescription and lab report camera scan/upload with OCR and structured clinical data extraction.
  - **Sub-phase (f): Real-Time Red-Flag Triage Escalation** — Continuous monitoring for high-risk clinical emergencies (e.g., chest pain, acute dyspnea, neurological deficits, severe hypertension) triggering instant visual escalation banners and emergency routing.
  - **Sub-phase (g): Structured Summary Handoff + FHIR/ABDM Push** — Automated compilation of pre-consultation intake into structured clinical summary and ABDM-compliant FHIR R4 Bundle pushed to doctor's workstation queue.

- **Exit Criteria by Sub-Phase:**
  - **(a) Kiosk UI Shell:** Touch-first, high-contrast, distraction-free kiosk interface with oversized touch targets, multilingual navigation, session timeouts, and privacy-shielded kiosk mode is operational.
  - **(b) ABHA Identity + Consent Screen:** Patient can verify/input ABHA ID or scan an ABHA QR code, view explicit data processing consent in their preferred language, and authenticate session.
  - **(c) Adaptive Voice+Touch Interview Engine (Allopathic):** Multilingual conversational intake agent guides the patient through dynamic, symptom-specific follow-up questions using voice and large on-screen touch options.
  - **(d) AYUSH/Ayurveda History Mode:** Patient can select or be routed to an AYUSH/Ayurveda intake flow capturing Prakriti traits, Agni (digestive fire), Kostha, Ahara/Vihara (diet/lifestyle), and Dhatu/Dosha-oriented symptom chronologies aligned with AIIA guidelines.
  - **(e) Document Upload + Digitization:** Patient can scan/upload past physical prescriptions, lab reports, or discharge summaries at the kiosk with OCR/Gemini extraction into structured medication and diagnostic history.
  - **(f) Real-Time Red-Flag Triage Escalation:** Clinical emergency symptoms (e.g., chest pain, acute dyspnea, stroke signs, severe hypertension, fever with altered sensorium) instantly trigger high-priority visual alarms and direct the patient to immediate emergency triage.
  - **(g) Structured Summary Handoff + FHIR/ABDM Push:** Pre-consultation intake is compiled into a verified structured summary (SOAP note + AYUSH assessment) and pushed as an ABDM-compliant FHIR R4 Bundle to the doctor's workstation queue before the consultation.

