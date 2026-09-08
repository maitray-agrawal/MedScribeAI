# Project Execution Checklist (todo.md)

## MediKiosk — Smart India Hackathon (SIH) Problem Statement 26047
*Ministry of AYUSH / All India Institute of Ayurveda (AIIA)*
*Pivoted from MedScribe Lite Core Engine*

---

## Baseline Phases (Completed & Inherited from MedScribe Lite)

- [x] **Phase 0: Governance Setup**
  - [x] Initial codebase audit and repository governance initialization.
  - [x] Architecture documentation, design system, and memory logging established.
- [x] **Phase 1: Startup-Polish & De-Hackathon-ify**
  - [x] Clean project branding, metadata, and environment isolation.
  - [x] Professional compliance posture (`LICENSE`, `SECURITY.md`, `CHANGELOG.md`).
- [x] **Phase 2: Code Quality & Architecture Refactoring**
  - [x] Modular SOAP view decomposition into dedicated subcomponents (`src/components/soap-note/`).
  - [x] Tailwind design token framework in `src/index.css`.
  - [x] Unit testing harness (Vitest, React Testing Library, Happy-DOM).
  - [x] Automated CI workflow (`.github/workflows/ci.yml`).
- [x] **Phase 3: Positioning & Marketing Surface**
  - [x] Public marketing landing page component (`src/components/LandingPage.tsx`).
  - [x] Interactive bento demonstration, problem/impact grid, and pricing matrix.
- [x] **Phase 4: Feature Backlog & Enterprise Standards**
  - [x] Section-level AI documentation confidence scoring with uncertainty popovers.
  - [x] Deterministic drug-drug, drug-condition, and allergy interaction engine.
  - [x] HL7 FHIR R4 Bundle conversion utility (`src/utils/fhirConverter.ts`) and export modal.
  - [x] Browser-local clinical NLP engine (`src/utils/offlineLocalEngine.ts`) for zero-connectivity fallback.
- [x] **Phase 5: Hardening**
  - [x] Security audit, dependency audit, and prompt injection delimiter defense.
  - [x] Clinical AI resilience test suite covering edge cases and network dropouts.
  - [x] Lightweight zero-dependency bilingual internationalization framework (`src/i18n/`).

---

## Phase 6: SIH Pivot (MediKiosk — Patient-Facing OPD Intake Kiosk)

### Sub-phase (a): Kiosk UI Shell
- [x] Design touch-first, high-contrast, distraction-free kiosk interface shell
- [x] Implement oversized touch targets (min 48px-64px) and large legible typography
- [x] Add session inactivity timeout modal with countdown and automatic state wipe for patient privacy
- [x] Build multilingual language selection header with prominent toggle buttons
- [x] Create kiosk audio guidance toggle (text-to-speech voice prompts)
- **Exit Criteria:** Touch-first, high-contrast, distraction-free kiosk interface with oversized touch targets, multilingual navigation, session timeouts, and privacy-shielded kiosk mode is operational. [COMPLETED]

### Sub-phase (b): ABHA Identity + Consent Screen
- [x] Build Ayushman Bharat Health Account (ABHA) check-in screen (ABHA Number / ABHA Address)
- [x] Add simulated/mock ABHA QR code scanner scanner interface for rapid check-in
- [x] Design patient informed consent modal explaining data collection in patient's selected language
- [x] Store session ABHA profile tokens securely in transient session memory
- [x] Integrate native SpeechSynthesis audio read-aloud controls for accessible consent playback
- **Exit Criteria:** Patient can verify/input ABHA ID or scan an ABHA QR code, view explicit data processing consent in their preferred language, and authenticate session. [COMPLETED]

### Sub-phase (c): Adaptive Voice+Touch Interview Engine (Allopathic)
- [x] Build conversational intake step-by-step wizard (Chief Complaint -> Onset -> Severity -> Associated Symptoms)
- [x] Support hybrid input: patient can tap oversized category pills OR speak naturally via microphone
- [x] Implement dynamic follow-up questioning based on detected symptoms (e.g., chest pain -> radiation, shortness of breath)
- [x] Integrate real-time voice transcription into structured symptom cards
- **Exit Criteria:** Multilingual conversational intake agent guides the patient through dynamic, symptom-specific follow-up questions using voice and large on-screen touch options. [COMPLETED]

### Sub-phase (d): AYUSH / Ayurveda History Mode
- [x] Build AYUSH / Ayurveda intake toggle / tab aligned with AIIA guidelines (DepartmentSelectionStep in Kiosk workflow)
- [x] Create Prakriti assessment module (Vata, Pitta, Kapha constitutional tendencies)
- [x] Implement Agni (digestive capacity) and Kostha (bowel habit) quick-check selectors
- [x] Capture Ahara (dietary patterns) and Vihara (sleep, physical exertion, stress) questions
- [x] Map patient complaints to Ayurvedic symptom terminology (e.g., Jvara, Shwasa, Kasa, Sandhivata, Amlapitta)
- **Exit Criteria:** Patient can select or be routed to an AYUSH/Ayurveda intake flow capturing Prakriti traits, Agni (digestive fire), Kostha, Ahara/Vihara (diet/lifestyle), and Dhatu/Dosha-oriented symptom chronologies aligned with AIIA guidelines. [COMPLETED]

### Sub-phase (e): Document Upload + Digitization
- [x] Implement kiosk document capture / file upload interface (past prescriptions, lab reports, discharge summaries)
- [x] Build OCR / multimodal Gemini extraction pipeline for physical prescription photos
- [x] Parse extracted medications, dosages, and historical diagnoses into active patient record
- [x] Display digitized record verification card for patient review with SafetyAlertsPanel out-of-range visual highlights and chronological sorting
- **Exit Criteria:** Patient can scan/upload past physical prescriptions, lab reports, or discharge summaries at the kiosk with OCR/Gemini extraction into structured medication and diagnostic history. [COMPLETED]

### Sub-phase (f): Real-Time Red-Flag Triage Escalation
- [x] Implement real-time clinical red-flag detector during symptom intake (e.g., acute chest pain, breathlessness, stroke signs, vitals crisis)
- [x] Build full-screen emergency override banner directing patient to immediately alert hospital staff / proceed to casualty
- [x] Provide audible alert tone and immediate triage category badge (Red / Yellow / Green)
- **Exit Criteria:** Clinical emergency symptoms (e.g., chest pain, acute dyspnea, stroke signs, severe hypertension, fever with altered sensorium) instantly trigger high-priority visual alarms and direct the patient to immediate emergency triage. [COMPLETED]

### Sub-phase (g): Structured Summary Handoff + FHIR/ABDM Push
- [x] Compile comprehensive pre-consultation intake summary combining Allopathic and AYUSH data in standard sequence (Chief complaint → HPI → Past medical/surgical → Drug & allergy → Family → Personal → ROS → prior investigations summary) (`src/utils/intakeSummaryGenerator.ts`)
- [x] Implement automated background push of HL7 FHIR R4 Bundle to mocked ABDM / HIS gateway endpoint (`/api/abdm/push`) upon kiosk flow completion (`src/utils/fhirConverter.ts`)
- [x] Reuse existing SOAP note presentation components as the Physician Confirmation Screen upon patient arrival in the doctor's consultation room
- [x] Enforce zero data retention on the kiosk public terminal by wiping session memory immediately upon handoff or finish to protect patient privacy
- **Exit Criteria:** Pre-consultation intake is compiled into a verified structured summary (SOAP note + AYUSH assessment) and pushed as an ABDM-compliant FHIR R4 Bundle to the doctor's workstation queue with zero kiosk terminal data retention. [COMPLETED]

---

## Targeted TypeScript & Build Integrity Fixes (2026-09-09)
- [x] **Item 1 (Missing Dependency)**: Declare `@testing-library/dom` (`^10.4.0`) explicitly in `devDependencies` in `package.json` to satisfy `@testing-library/react` peerDependency; record in `dependency-lockbase.md`.
- [x] **Item 2 (InterviewEngine.tsx dead AYUSH branches)**: Add `'ayush_kostha_ahara'` and `'ayush_vihara_nidra'` to the `AdaptiveInterviewTurnResponse.category` union type in `src/types.ts` to restore dead branches at lines 340 & 350; add tests in `src/__tests__/interviewEngine.test.tsx` verifying both question types update AYUSH intake state.
- [x] **Item 3 (MultilingualVoiceInput.tsx:172 property regression)**: Resolve `SpeechSessionRecord` language property correctly (`activeSession?.language || activeSession?.detectedLanguages?.[0] || currentLocale`) instead of non-existent `.detectedLanguage.language`.
- [x] **Item 4 (KioskShell.tsx:474 & kioskAYUSH.test.tsx prop mismatch)**: Add `selectedDepartment?: 'Allopathic' | 'Ayurveda (AYUSH)' | null;` and `onBack?: () => void;` to `DepartmentSelectionStepProps` in `DepartmentSelectionStep.tsx` and initialize state with `selectedDepartment || initialDepartment || null` to enable visual selection highlights.
- [x] **Item 5 (KioskShell.tsx:513 type mismatch)**: Allow `patientContext.age` in `DocumentUploadStepProps` to accept `number | string` (consistent with `PatientInfo.age: number | string`), preventing falsified age coercions (`Age=0`/`Age=NaN`) sent to the multimodal Gemini clinical extraction endpoint.
- [x] **Item 6 (documentationConfidence.test.tsx:80 missing prop)**: Provide required `onUpdateSOAP={vi.fn()}` callback prop to `<SOAPNoteView />` in `documentationConfidence.test.tsx`.
- [x] **Item 7 (Full Verification)**: Run `npm run lint` (0 errors), `npm test` (12 test files, 219 tests passed), and `npm run build` (clean Vite + esbuild production bundle).

---

## Sovereign Python Clinical AI Platform Migration (2026-09-09)
- [x] **Phase 0 (Read-Only Architecture Audit)**: Traced all 6 clinical flows; documented what runs in TS vs Server, clean boundaries, duplicates to avoid, and minimum migration path.
- [x] **Phase 1 (Python Project Setup)**: Created minimal `backend/` directory (`requirements.txt`, `app/`, `tests/`, `README.md`).
- [x] **Phase 2 (Python Domain Model)**: Implemented canonical `ClinicalFact` Pydantic model (`concept_id`, `canonical_text`, `category`, `assertion`, `temporality`, `experiencer`, `evidence`, `source`, `confidence`, `language`, `provenance`).
- [x] **Phase 3 (FastAPI Service Boundary)**: Created FastAPI service with `GET /health`, `GET /version`, and `POST /api/v1/clinical/extract` backed by deterministic extractor.
- [x] **Phase 4 (Frontend Integration Boundary)**: Created `src/services/clinicalAIClient.ts` as the centralized TypeScript client for the Python backend.
- [x] **Phase 5 (Provider Abstraction)**: Built `src/services/aiProvider.ts` defining `ClinicalAIProvider`, `LocalPythonProvider`, `CloudGeminiProvider`, and `HybridClinicalProvider`.
- [x] **Phase 6 (Local-First Architecture Documentation)**: Documented future sovereign architecture in `backend/README.md` explicitly distinguishing IMPLEMENTED vs PLANNED capabilities.
- [x] **Phase 7 (Dependency Discipline)**: Kept `requirements.txt` strictly minimal (FastAPI + Pydantic + Uvicorn + HTTPX + Pytest).
- [x] **Phase 8 (Python Test Suite)**: Implemented 11 Pytest tests covering validation, present/negated assertions, not-elicited distinction, experiencer, evidence, provenance, and contrastive Hindi negation (`"BP ka problem nahi hai lekin sar dard hai"`).
- [x] **Phase 9 (Full System Verification)**: Verified clean passes across both stacks (`npm run lint` 0 errors, `npm test` 224/224 passed, `npm run build` clean, `pytest` 11/11 passed).
- [x] **Phase 10 (Architectural Integrity Verification)**: Confirmed zero regressions, zero fact hallucinations, and zero cloud lock-in for core operations.
- [x] **Phase 11 (Documentation & Change Control)**: Updated `todo.md`, `memory.md`, `dependency-lockbase.md`, and `backend/README.md`.

---

## Phase 7B: Canonical ClinicalFact Migration & Zero-Fabrication Enforcement (2026-09-09)
- [x] **Read-Only Architecture Audit**: Traced 5 clinical cases end-to-end, identified 5 competing clinical fact models, and cataloged 5 active fabrication paths.
- [x] **Pillar 1: Typed Canonical ClinicalFact**: Defined typed schema in `src/clinical/clinicalFactModel.ts` with domain, canonicalId/code, preferredTerm/term, evidence spans, provenance, and attributes.
- [x] **Pillar 2: Strict Assertion & Elicitation Semantics**: Implemented AFFIRMED, NEGATED, SUSPECTED, CONDITIONAL, UNKNOWN with ELICITED vs NOT_ELICITED distinction.
- [x] **Pillar 3: Headless Extraction Pipeline**: Built `src/clinical/extractionPipeline.ts` outside React running multilingual Hindi symptom extraction, medication parsing, AYUSH attributes, and allergy negation.
- [x] **Pillar 4: Conservative FHIR R4 Projection**: Updated `src/utils/fhirConverter.ts` to map patient meds to `MedicationStatement`, unconfirmed conditions to `Condition`, omit unelicited `AllergyIntolerance`, and only emit `MedicationRequest` on clinician orders.
- [x] **Pillar 5: Conflict-Preserving Fact Store**: Implemented `src/clinical/clinicalFactStore.ts` storing facts without destructive overwrites and providing `getConflictingFacts(canonicalId)`.
- [x] **Pillar 6: Active Evidence & Fabrication Gate**: Implemented `src/clinical/evidenceGate.ts` (`validateClinicalFact`, `auditProjectionIntegrity`, `assertZeroFabrication`) detecting unanchored GERD/Amlapitta, fake vitals (120/80), fake physical exams, and unanchored prescriptions.
- [x] **Eradication of Synthetic Data Paths**: Removed catch-block fallback in `DocumentUploadStep.tsx`, eradicated hardcoded GERD/Amlapitta/vitals in `intakeSummaryGenerator.ts`, isolated legacy demo presets behind `{ isDemoMode: true }` in `offlineLocalEngine.ts`, and eliminated default NKDA in `SOAPNoteView.tsx` and `PrintPrescriptionModal.tsx`.
- [x] **Integration**: Connected `ClinicalFactStore` and `evidenceGate` to `InterviewEngine.tsx` and `KioskShell.tsx`.
- [x] **Comprehensive Test Suite**: Added 22 integration tests in `src/__tests__/canonicalClinicalFacts.test.ts`. Verified 246/246 tests pass in Vitest, 11/11 in Pytest, `npm run lint` 0 errors, and `npm run build` succeeds cleanly.



