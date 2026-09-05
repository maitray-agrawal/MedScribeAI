# Product Requirements Document (prd.md)

---

## 1. Feature Matrix: Implemented vs. Planned

| Feature Category | Feature Description | Component / File | Status | Scope Tier |
| :--- | :--- | :--- | :--- | :--- |
| **Patient Demographics** | Demographic and baseline clinical record form (name, age, biological sex, medical history, current meds, allergies, encounter type, location). | `src/components/PatientForm.tsx` | Reused from MedScribe Lite | Core Engine Baseline |
| **Dictation & Audio** | Ambient Web Speech API live speech-to-text dictation & 25MB max audio file upload preview/playback. | `src/components/TranscriptInput.tsx` | Reused from MedScribe Lite | Core Engine Baseline |
| **Sample Scenarios** | Curated clinical scenario library covering acute, chronic, pediatric, maternal, and multi-lingual encounters. | `src/data/sampleScenarios.ts` | Reused from MedScribe Lite | Core Engine Baseline |
| **SOAP Note Generation** | Express server bridge calling Gemini 3.8 Flash with clinical fact-extraction guardrails to output structured JSON SOAP notes. | `server.ts` | Reused from MedScribe Lite | Core Engine Baseline |
| **SOAP Note Display & Edits** | Interactive tabbed view (S, O, A, P), inline editing of fields, text-to-speech read aloud, and plain-text EHR copy format. | `src/components/SOAPNoteView.tsx` | Reused from MedScribe Lite | Core Engine Baseline |
| **Clinical Safety Alerts** | Automated detection of drug-drug interactions, allergy flags, missing information, and clinical uncertainty indicators. | `src/components/SafetyAlertsPanel.tsx` | Reused from MedScribe Lite | Core Engine Baseline |
| **Billing & Coding** | Automated ICD-10 diagnostic code suggestions with confidence scores and CPT Evaluation & Management codes with rationales. | `src/components/BillingCodingPanel.tsx` | Reused from MedScribe Lite | Core Engine Baseline |
| **Prescription Slip** | Printable modal dialog formatted for patient prescription and home care instructions. | `src/components/PrintPrescriptionModal.tsx` | Reused from MedScribe Lite | Core Engine Baseline |
| **Encounter History** | Browser LocalStorage persistence (`medscribe_lite_encounters_v1`) with search, filter, and reload functionality. | `src/components/EncounterHistoryModal.tsx` | Reused from MedScribe Lite | Core Engine Baseline |
| **Clinic Productivity Metrics** | Analytics modal calculating total encounters, hours saved, safety flags audited, and top documented diagnoses breakdown. | `src/components/ClinicAnalyticsModal.tsx` | Reused from MedScribe Lite | Core Engine Baseline |
| **FHIR R4 Generation** | Standardized HL7 FHIR R4 Bundle generator (`Bundle`, `Patient`, `Encounter`, `Condition`, `MedicationRequest`, `Composition`). | `src/utils/fhirConverter.ts` | Reused from MedScribe Lite | Core Engine Baseline |
| **Offline Local Clinical Engine** | Zero-dependency browser-local diagnostic decision tree engine for offline and low-connectivity environments. | `src/utils/offlineLocalEngine.ts` | Reused from MedScribe Lite | Core Engine Baseline |
| **Multi-Language i18n** | Zero-dependency bilingual context dictionary (`en`, `es`) with localized UI components and language detection. | `src/i18n/` | Reused from MedScribe Lite | Core Engine Baseline |
| **(a) Kiosk UI Shell** | Patient-facing, high-contrast, touch-first kiosk interface with oversized targets, large typography, inactivity resets, and privacy safeguards. | Kiosk Shell Component (TBD) | Planned — SIH Pivot | Phase 6: SIH Pivot |
| **(b) ABHA Identity + Consent** | Ayushman Bharat Health Account (ABHA ID/Address) verification, QR code scanning, and patient informed consent flow in local languages. | ABHA Auth Screen (TBD) | Planned — SIH Pivot | Phase 6: SIH Pivot |
| **(c) Adaptive Voice+Touch Interview** | Conversational, symptom-directed intake agent guiding patient through dynamic follow-up queries via bilingual voice & touch. | Interview Engine (TBD) | Planned — SIH Pivot | Phase 6: SIH Pivot |
| **(d) AYUSH / Ayurveda History Mode** | Specialized intake capturing Prakriti traits, Agni, Kostha, Ahara/Vihara lifestyle, and Dosha symptom manifestations per AIIA guidelines. | AYUSH Intake Panel (TBD) | Planned — SIH Pivot | Phase 6: SIH Pivot |
| **(e) Document Upload + Digitization** | Camera capture / file upload of physical prescriptions, diagnostic labs, and discharge slips with OCR clinical extraction. | Document Digitizer (TBD) | Planned — SIH Pivot | Phase 6: SIH Pivot |
| **(f) Real-Time Red-Flag Triage** | Automated emergency detection (chest pain, acute dyspnea, stroke signs, extreme vitals) triggering instant visual alarms and emergency routing. | Triage Guardrail (TBD) | Planned — SIH Pivot | Phase 6: SIH Pivot |
| **(g) Summary Handoff + FHIR/ABDM Push** | Synthesis of pre-consultation intake into doctor-ready briefing and ABDM-compliant FHIR R4 push to the clinician's workstation queue. | ABDM Handoff Service (TBD) | Planned — SIH Pivot | Phase 6: SIH Pivot |

---

## 2. Requirement Scope Separation

### Reused from MedScribe Lite (Inherited Foundation)
- Local browser dictation, transcript parsing, sample scenario library.
- Direct integration with `@google/genai` on Express backend (`server.ts`).
- Deterministic drug-drug, drug-condition, and drug-allergy interaction checking engine.
- Structured clinical SOAP note generation, prescription table editing, and printable prescription slips.
- HL7 FHIR R4 Bundle conversion utility (`src/utils/fhirConverter.ts`).
- Browser-local offline clinical engine fallback (`src/utils/offlineLocalEngine.ts`).
- Lightweight multi-language framework and internationalization architecture.

### Planned — SIH Pivot (Phase 6 Implementation)
- **Kiosk Form Factor & Ergonomics:** High-contrast, large-button, distraction-free patient touch interface.
- **National Health Stack (ABDM):** ABHA identity authentication, QR-based check-in, and explicit patient data consent.
- **Dynamic Pre-Consultation Interview:** Adaptive, symptom-branching dialogue using voice + touch for patients of all literacy levels.
- **Integrative AYUSH / Ayurveda Intake:** Specialized diagnostic history framework tailored to Ministry of AYUSH and AIIA standards.
- **Prescription & Report OCR:** On-kiosk document digitization turning physical records into structured patient history.
- **Safety Triage & Escalation:** Immediate detection and visual/auditory escalation of life-threatening clinical symptoms.
- **Clinician Workstation Handoff:** Instant delivery of pre-consultation intake to the doctor's screen before the patient enters the room.


---

## 3. Monetization & Three-Tier Pricing Structure

| Tier Name | Target Customer Segment | Pricing | Key Capabilities & Limits |
| :--- | :--- | :--- | :--- |
| **Community Outreach (Free)** | Solo rural health workers, mobile clinics, open-source testers | *$0* / month** | Ambient dictation, 5 sample clinical scenarios, standard Gemini 3.6 SOAP generation, client-side LocalStorage history, basic drug safety alerts, printable prescription slips. |
| **Independent Clinic ($19/mo)** | Small independent clinics & community health centers (1-5 providers) | **$19 / clinic / mo** | Everything in Free + priority API throughput, custom clinic header on printable prescriptions, FHIR/EHR export options, unlimited encounter history export, automated Clinical Safety Copilot guardrails audit. |
| **Multi-Provider Health Center ($49/mo)** | Regional primary care networks & multi-provider health facilities | **$49 / center / mo** | Everything in Clinic + multi-provider team workspaces, role-based access control, localized drug interaction overrides, regional ICD-10/CPT coding custom rules, priority SLA support. |

