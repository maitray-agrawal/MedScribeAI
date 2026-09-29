# VAIDHYA — CLINICAL INTELLIGENCE
### An AstraX Intelligence System · Member of the AstraX Family

> **Sovereign, evidence-grounded, privacy-conscious clinical intelligence for healthcare workflows.**  
> Transforming unstructured doctor-patient consultation discourse into verified SOAP notes, ICD-10/CPT billing codes, proactive clinical guardrail audits, and HL7 FHIR R4 interoperability bundles with mathematical precision.

---

## 🏛️ AstraX Family Relationship & Sovereignty

**VAIDHYA** is the clinical intelligence product in the **AstraX** institutional family.

```
                  ASTRAX
                     ↓
                  VAIDHYA
                     ↓
            CLINICAL INTELLIGENCE
```

- **Family DNA**: Built upon Indian mathematical grammar, Bindu core geometry, directional axes, continuous Sutra lines, editorial typography, and restrained institutional surfaces.
- **Dedicated Product Identity**: VAIDHYA features its own unique product mark derived from AstraX geometry—featuring a central vertical axis, diamond nodes, an 18×18 diamond copper Bindu, and bilateral forest green care wings.
- **Focused Clinical Workspace**: In accordance with AstraX sovereign architecture, cross-product navigation is not mixed into the primary clinical workflow. Attribution to the AstraX institution is presented via a subtle attribution pill (`MEMBER OF THE ASTRAX FAMILY`), linking to a dedicated `/astrax` directory detailing the Navadisha 9 domains with direct `← BACK TO VAIDHYA` navigation.

---

## 🎨 Design System & Theming

VAIDHYA implements a centralized, tokenized design system rooted in mathematical proportions and institutional restraint:

### 1. Typography Hierarchy
- **Display & Headings**: `Fraunces` — Large editorial serif communicating human care and institutional discipline.
- **Interface & Body**: `Inter` — Highly legible, neutral sans-serif optimized for dense clinical records.
- **Technical & Metadata**: `IBM Plex Mono` — Monospaced type for ICD-10 codes, CPT levels, FHIR timestamps, and engine status indicators.

### 2. Four Coherent Themes
Theme switching updates background surfaces, elevated surfaces, typography, borders, logos, status badges, and data visualization:

| Theme | Background | Primary Surfaces | Accent (Primary) | Institutional Accent | Text |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary** | Ivory (`#FDF7EC`) | Warm Sandstone (`#EADCC8`) | Forest Green (`#166534`) | Copper (`#B87333`) | Deep Ink (`#221B14`) |
| **Dark** | Deep Ink (`#15100B`) | Dark Elevated Ink (`#1F1712`) | Forest Green (`#22C55E`) | Radiant Copper (`#D97706`) | Warm Ivory (`#FDF7EC`) |
| **Monochrome** | High-Contrast White | Pure Neutral Grays | Pitch Black | Charcoal Gray | Pure Black (`#000000`) |
| **Sandstone** | Warm Sandstone (`#EADCC8`) | Light Parchment (`#FAF4E9`) | Copper (`#B87333`) | Forest Green (`#166534`) | Dark Umber / Ink |

### 3. Reusable Geometric Primitives
- `VaidhyaMark`: Pure scalable SVG mark with radial geometry, copper Bindu, and bilateral care crescents.
- `AstraMark`: Master 8-point geometric star with curved crescent arms.
- `AstraBindu`: 18×18 diamond core node indicating core intelligence and active inference.
- `AstraSutra`: Continuous 6-stage clinical progression stepper (`Intake` → `Transcription` → `Structuring` → `Evidence` → `Review` → `Approval`).
- `AstraSeal`: Circular institutional seal for authenticated documentation.
- `EvidencePanel`: Grounded clinical signal provenance system linking extracted facts directly to transcript utterances.

---

## 🌟 Clinical Intelligence Functional Architecture

1. **Ambient & Dictated Consultation Scribing**:
   - Audio recording (Web Speech API / MediaRecorder) or text paste of doctor-patient dialogue.
   - Dual-engine orchestration: Cloud Gemini 3.6 Flash inference with automatic fallback to the local browser engine.
2. **Clinical Safety & Fact Integrity Guardrails**:
   - Real-time audit of drug-drug interactions, drug-condition contraindications, and known patient allergies.
   - Severity-classified safety alerts requiring explicit physician verification.
3. **Structured Bento SOAP Documentation**:
   - **Subjective (S)**: Chief complaint, history of present illness, review of systems, current medications, allergies.
   - **Objective (O)**: Vital signs, physical examination findings, labs and imaging reviewed.
   - **Assessment (A)**: Working primary diagnosis, differential diagnoses, clinical synthesis summary.
   - **Plan (P)**: Prescriptions with dosage and instructions, diagnostic orders, patient education, follow-up safety netting.
4. **Automated Billing & Coding**:
   - ICD-10 diagnostic code mapping with confidence scoring.
   - CPT Evaluation & Management (E/M) code suggestions with clinical rationale.
5. **HL7 FHIR Release 4 Export**:
   - Generates compliant FHIR R4 Bundle containing `Patient`, `Encounter`, `Condition`, `MedicationRequest`, and `Composition` resources.
6. **Sovereign Advice & Prescription Printing**:
   - Clean, institutional print layout formatted for physical patient delivery with physician signature line and AstraX seal.

---

## 🔒 Privacy, Security & Sovereignty

- **Local Persistence Vault**: Encounter records and consultation notes remain stored on the local device (`localStorage` / local SQLite/device storage).
- **Air-Gapped Operation**: Integrated offline local engine allows 100% functionality without internet connectivity.
- **Human Approval Mandate**: AI outputs are strictly clinical suggestions; all clinical decisions, medication orders, and diagnosis submissions require attending clinician sign-off.

---

## 🚀 Quick Start & Development

### Prerequisites
- Node.js (v18+)
- npm

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 3. Running Locally
```bash
# Start frontend and backend development server
npm run dev
```
Open `http://localhost:3000` (or `http://localhost:5173` via Vite dev).

### 4. Running Test Suite
```bash
# Run all unit, component, and resilience tests
npm test
```

### 5. Typechecking & Linting
```bash
npm run lint
```

### 6. Production Build
```bash
npm run build
npm start
```

---

## 📦 Directory Structure

```
src/
├── components/                 # Core application views and modals
│   ├── soap-note/              # SOAP sections (Subjective, Objective, Assessment, Plan, FHIR)
│   ├── Header.tsx              # Institutional header with Vaidhya branding & theme switcher
│   ├── PatientForm.tsx         # Patient demographic & clinical context intake
│   ├── TranscriptInput.tsx     # Audio dictation & scenario input workspace
│   ├── SOAPNoteView.tsx        # Bento grid SOAP workspace
│   ├── SafetyAlertsPanel.tsx   # Clinical safety guardrails audit
│   ├── BillingCodingPanel.tsx  # ICD-10 / CPT suggestions
│   ├── LandingPage.tsx         # Editorial marketing showcase
│   └── PrintPrescriptionModal.tsx # Printable prescription slip
├── design/                     # AstraX / Vaidhya Design System
│   ├── tokens/                 # colors.css, typography.css, motion.css, geometry.css, themes.css
│   └── components/             # VaidhyaMark, AstraMark, AstraBindu, AstraSutra, ThemeSwitcher, etc.
├── data/                       # Pre-populated clinical scenarios
├── i18n/                       # Multi-language clinical translations (EN / ES)
├── utils/                      # Drug interaction checker, offline NLP engine, FHIR converter
└── types.ts                    # Clinical data models
```

---

## ⚠️ Limitations & Future Scope

- **Audio File Transcription**: Ambient speech recognition relies on browser Web Speech API in client mode; for server-side audio processing, Gemini multimodal API is utilized when online.
- **Offline Language Coverage**: The offline local engine currently extracts English consultation discourse; Spanish consultation translation utilizes the cloud pipeline.
- **Future Scope**: Direct ABDM (Ayushman Bharat Digital Mission) M1/M2/M3 gateway integration, localized Whisper.cpp WASM model bundling, and DICOM imaging attachment viewer.

---

## 📄 License
This project is licensed under the MIT License.
