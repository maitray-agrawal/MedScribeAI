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
- [ ] Implement kiosk document capture / file upload interface (past prescriptions, lab reports, discharge summaries)
- [ ] Build OCR / multimodal Gemini extraction pipeline for physical prescription photos
- [ ] Parse extracted medications, dosages, and historical diagnoses into active patient record
- [ ] Display digitized record verification card for patient review
- **Exit Criteria:** Patient can scan/upload past physical prescriptions, lab reports, or discharge summaries at the kiosk with OCR/Gemini extraction into structured medication and diagnostic history.

### Sub-phase (f): Real-Time Red-Flag Triage Escalation
- [ ] Implement real-time clinical red-flag detector during symptom intake (e.g., acute chest pain, breathlessness, stroke signs, vitals crisis)
- [ ] Build full-screen emergency override banner directing patient to immediately alert hospital staff / proceed to casualty
- [ ] Provide audible alert tone and immediate triage category badge (Red / Yellow / Green)
- **Exit Criteria:** Clinical emergency symptoms (e.g., chest pain, acute dyspnea, stroke signs, severe hypertension, fever with altered sensorium) instantly trigger high-priority visual alarms and direct the patient to immediate emergency triage.

### Sub-phase (g): Structured Summary Handoff + FHIR/ABDM Push
- [ ] Compile comprehensive pre-consultation intake summary combining Allopathic and AYUSH data
- [ ] Integrate existing HL7 FHIR R4 converter to generate ABDM-compliant Health Record bundle
- [ ] Build clinician review queue / handoff view simulating doctor workstation receiving the pre-intake briefing
- [ ] Generate printable / QR-coded patient intake token for consultation room handoff
- **Exit Criteria:** Pre-consultation intake is compiled into a verified structured summary (SOAP note + AYUSH assessment) and pushed as an ABDM-compliant FHIR R4 Bundle to the doctor's workstation queue before the consultation.
