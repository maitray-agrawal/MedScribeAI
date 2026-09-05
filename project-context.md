# Project Context & Overview (project-context.md)

---

## 1. Problem Statement

In India's overburdened healthcare system—from central tertiary hospitals (AIIMS, AIIA) to district hospitals, Community Health Centres (CHCs), and Primary Health Centres (PHCs)—outpatient departments (OPDs) face staggering patient volumes. Clinicians routinely consult between 80 to over 100 patients in a single shift, compressing doctor-patient consultation time to an alarming **2 to 5 minutes per patient**.

Up to 80% of this critical consultation window is consumed by repetitive, basic history-taking: identifying chief complaints, symptom chronologies, past medical history, current medications, drug allergies, lifestyle habits, and familial background. Because clinicians are forced to spend these precious minutes gathering routine preliminary details under extreme time pressure, history-taking becomes rushed and incomplete, critical red flags (such as atypical chest pain, severe drug contraindications, or acute respiratory distress) are overlooked, and almost no time remains for physical examination, empathetic patient communication, or personalized treatment planning.

Under Smart India Hackathon (SIH) Problem Statement 26047 issued by the **Ministry of AYUSH / All India Institute of Ayurveda (AIIA)**, there is an urgent mandate to automate and streamline pre-consultation clinical history collection at the point of entry before the patient enters the doctor's examination room.

---

## 2. Target Users & Target Segment

- **Primary End User — The Outpatient (Patient & Caregiver):**
  - Patients operating a self-service kiosk independently (or assisted by an attendant/Asha worker) in the hospital OPD waiting area or registration queue prior to seeing the clinician.
  - Accommodates India's diverse demographic landscape: varying digital and health literacy levels, multiple regional languages, elderly patients, and users requiring accessible touch-first and conversational voice interfaces.
- **Secondary End User — The Outpatient Clinician (Allopathic & AYUSH / Ayurveda):**
  - Doctors receiving a structured, pre-synthesized clinical intake summary (SOAP format + Ayurvedic diagnostic parameters) along with triaged red flags and verified ABHA medical history prior to starting the consultation.
- **Target Deployment Facilities:**
  - High-footfall government and municipal hospitals, AYUSH dispensaries, All India Institute of Ayurveda (AIIA) facilities, Community Health Centres (CHCs), and charitable outpatient polyclinics.

---

## 3. Current Project Stage

- **Status:** Strategic Pivot from "MedScribe Lite" (a clinician-facing post-consultation documentation copilot) to **"MediKiosk"** (a patient-facing pre-consultation self-service history-taking kiosk) under SIH Problem Statement 26047.
- **Inherited & Reused Core Engine:** Robust, tested clinical foundation developed in MedScribe Lite—including structured clinical extraction, drug-drug and drug-allergy interaction checker, local offline clinical inference engine, multi-language processing, and HL7 FHIR R4 Bundle generation.
- **Pivot Objectives (Phase 6):** Build a dedicated touch-and-voice kiosk shell, ABHA ID identity verification and consent, adaptive dual-modality interview engine (Allopathic & AYUSH / Ayurveda), physical document OCR digitization, automated red-flag triage escalation, and seamless doctor workstation handoff via ABDM/FHIR.

---

## 4. Elevator Pitch

> **MediKiosk** is an AI-powered, multilingual self-service patient intake and history-taking kiosk developed for India's high-volume OPDs under SIH Problem Statement 26047 (Ministry of AYUSH / All India Institute of Ayurveda). Positioned in hospital waiting areas, MediKiosk empowers patients to independently complete an adaptive, voice-and-touch clinical interview—capturing comprehensive Allopathic and Ayurvedic health histories, verifying ABHA identity, digitizing past physical prescriptions, and flagging urgent red flags—before stepping into the consultation room. By transforming the preliminary history-taking bottleneck into a rich, structured clinical briefing, MediKiosk enables doctors to reclaim their 2–5 minute consultation window for thorough physical examination, diagnostic precision, and compassionate patient care.

