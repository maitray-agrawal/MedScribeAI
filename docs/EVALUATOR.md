# MedScribeAI — Evaluator Quickstart & Verification Guide

This document provides evaluators, jury members, and clinical auditors with a streamlined, 3-minute reproducible path to evaluate **MedScribeAI** (Smart India Hackathon 2026, Problem Statement SIH26047).

---

## Important Evaluator Notice

> **SYNTHETIC TEST ENVIRONMENT NOTICE**  
> All patient records, symptoms, case dictations, and clinical histories bundled with this evaluation release are strictly synthetic test cases. MedScribeAI is an SIH 2026 engineering prototype designed to demonstrate offline-first sovereign case-taking and clinical safety guardrails. It is not approved for unsupervised clinical diagnosis or treatment without certified physician oversight.

---

## 3-Minute Fast-Path Evaluation

Evaluators can follow this timed walkthrough to verify core system capabilities:

```
+-------------------------------------------------------------------------------+
|  0:00 - Launch Application (Desktop or Web Demo)                             |
|  0:20 - Register Synthetic Patient                                            |
|  0:40 - Review & Grant Separated Consent                                      |
|  1:00 - Run Case-Taking (Interactive Kiosk or Dictated Encounter)             |
|  1:30 - Review Extracted ClinicalFacts & Provenance Grounding                |
|  2:00 - Trigger & Inspect Deterministic Red-Flag Safety Alerts                |
|  2:20 - Physician Review Surface & Assertion State Edits                      |
|  2:40 - Enter Physician Credentials & Approve Encounter                       |
|  3:00 - Export Local FHIR Bundle & PDF Prescription Summary                   |
+-------------------------------------------------------------------------------+
```

### Minute 0:00 — Launch the Application
- **Windows Desktop:** Launch `MedScribeAI` from the desktop shortcut or Start menu.
- **Web Demo:** Open the public demo URL in Chrome, Edge, or Firefox and click **Try Web Demo**.
- Verify that the workstation initializes with the status `LOCAL_ONLY` active.

### Minute 0:20 — Register Synthetic Patient
- Click **Register Patient** or select **Kwame Mensah (Synthetic Demo 28M)** from the pre-loaded scenarios.
- Verify that the system assigns a local encounter ID and marks the patient status as registered.

### Minute 0:40 — Grant Separated Consent
- Inspect the consent modal:
  1. **Intake Processing Consent:** Required for clinical intake. Click **Grant Consent**.
  2. **Hospital Sharing Consent:** Optional and unbundled. Notice that it remains unchecked by default.
- Verify that the application records distinct cryptographic audit timestamps for both consent domains.

### Minute 1:00 — Execute Case-Taking
- In the **Transcript Input** or **Patient Kiosk** interface, click **Load Sample Scenario** (e.g., Scenario 1: *Acute Falciparum Malaria* or Scenario 2: *Type 2 Diabetes Follow-up*).
- Click **Generate Clinical Note & Safety Audit**.
- Observe instantaneous deterministic extraction (< 1 millisecond on CPU).

### Minute 1:30 — Review ClinicalFacts & Evidence Grounding
- In the extracted SOAP note, inspect the **ClinicalFacts** drawer.
- Note the canonical representation for each fact:
  - `conceptId`: e.g., `SYM_FEVER`, `SYM_CHEST_PAIN`, `MED_METFORMIN`
  - `assertion`: `present`, `absent`, `hypothetical`, or `possible`
  - `provenance`: verbatim source phrase from transcript (e.g., `"high fever for 3 days"`)
- Confirm that 100% of extracted facts are anchored to source evidence in the validation corpus.

### Minute 2:00 — Trigger Deterministic Safety Engine
- Switch to Scenario 4 (*Hypertensive Crisis with Chest Pain*) or add `"severe crushing chest pain and shortness of breath"` into the transcript.
- Click **Generate Clinical Note**.
- Observe the **Deterministic Red-Flag Triage Banner**:
  - High-priority clinical alert triggers immediately.
  - Emergency escalation recommendation displays before note approval.

### Minute 2:20 — Physician Review Surface
- Verify that the clinical note status is locked in `AI_DRAFT`.
- Click **Begin Physician Review**. Status transitions to `REVIEWING`.
- Clinicians can adjust dosages, modify temporality (`acute` vs `chronic`), or toggle assertion statuses.

### Minute 2:40 — Physician Approval
- Enter physician name or review PIN and click **Approve Encounter**.
- State transitions to `APPROVED`. The clinical record is now cryptographically locked against subsequent modification.

### Minute 3:00 — Local Export
- Click **Export FHIR Bundle** or **Print Prescription Slip**.
- Verify that export unlocks only after physician approval is complete.
- Verify that attempting an outbound remote sync without explicit hospital-sharing consent displays a security warning blocking transmission.

---

## Offline Physical Test (Airplane Mode)

This test confirms that MedScribeAI executes sovereignly without internet connectivity.

### Test Protocol
1. Launch the installed **MedScribeAI Windows Desktop Application**.
2. Physically disconnect your machine from the network:
   - Turn on **Airplane Mode** or disable Wi-Fi and Ethernet.
3. Open Windows PowerShell or Command Prompt and confirm network isolation:
   ```powershell
   ping -n 1 8.8.8.8
   # Expected: General failure / Request timed out
   ```
4. Return to the MedScribeAI window.
5. Perform a complete intake encounter:
   - Select a synthetic patient scenario.
   - Run case-taking and NLP extraction.
   - Verify ClinicalFacts extraction occurs without error.
   - Verify deterministic safety alerts trigger.
   - Complete physician review and approve the note.
   - Export the local FHIR JSON payload to disk.
6. Verify network audit:
   - Zero outbound requests are initiated.
   - No cloud API keys or tokens are requested.
   - No silent degradation or network error dialog appears.

---

## Declared System Boundaries

| Subsystem | Baseline Status | Evaluator Guidance |
| :--- | :--- | :--- |
| **Local Clinical NLP** | Fully Validated | Deterministic regex/ontology matcher executes in 0.24ms on CPU. |
| **Safety Engine** | Fully Validated | Red-flag triage and drug interaction alerts enforce safety invariants. |
| **Physician Gate** | Fully Validated | `AI_DRAFT` state strictly gates export until physician sign-off. |
| **Local SQLite DB** | Fully Validated | Encounters, facts, and consent audit logs persist locally. |
| **FHIR Converter** | Fully Validated | Valid FHIR R4 Bundle generated with zero cloud transmission. |
| **Local ASR** | Partially Validated | IndicConformer ONNX model executes on CPU; validated technically. |
| **OCR Service** | Host Gated | Requires host Tesseract binary; cleanly reports unavailable if missing. |
| **Clinical Use** | SIH Prototype | Built for SIH 2026 evaluation; requires clinical trial before production. |
