# MedScribeAI — Release & Distribution Specification

## 1. Architecture Overview

MedScribeAI is an offline-first clinical case-taking and documentation platform built for primary healthcare facilities operating with intermittent or zero broadband connectivity.

```
+---------------------------------------------------------------------------------+
|                                 TAURI DESKTOP                                   |
|                                                                                 |
|  +---------------------------+             +---------------------------------+  |
|  |   Frontend Interface      |  IPC / HTTP |   PyInstaller FastAPI Sidecar   |  |
|  |   React 19 + TypeScript   |<----------->|   Python 3.11 + Uvicorn         |  |
|  |   Tailwind CSS v4         |  127.0.0.1  |   SQLite Sovereign Database     |  |
|  |   Kiosk & Clinician Views |             |   IndicConformer ASR (ONNX)     |  |
|  +---------------------------+             |   Deterministic Safety Engine   |  |
|                                            +---------------------------------+  |
+---------------------------------------------------------------------------------+
```

### Sovereign Desktop Distribution
- **Host Shell:** Tauri v2 Windows x64 native wrapper.
- **Embedded Clinical Backend:** Standalone PyInstaller sidecar binary (`medscribe-backend-x86_64-pc-windows-msvc.exe`, ~210 MB) packaging Python 3.11, Uvicorn, FastAPI, ONNX Runtime CPU, SciPy, NumPy, and SQLite.
- **Packaging Format:** Nullsoft Scriptable Install System (NSIS) Windows installer (`MedScribeAI_1.0.0_x64-setup.exe`, ~202.7 MB).
- **Target OS:** Windows 10 (Build 19041+) / Windows 11 x64.

---

## 2. Windows System Requirements

### Evaluator Machine Prerequisites
- **Operating System:** Windows 10 x64 or Windows 11 x64.
- **Memory:** 4 GB RAM minimum (8 GB recommended for concurrent ASR inference).
- **Disk Space:** 600 MB free storage space for application and local SQLite database.
- **Runtimes Required on Host:** **NONE**.
  - No Node.js required.
  - No Python required.
  - No Rust required.
  - No Git required.
  - No Visual Studio C++ build tools required.

### Code Signing & Windows SmartScreen
As an open-source student submission for Smart India Hackathon 2026, the installer binary is not signed with a commercial Extended Validation (EV) certificate. 

When launching the installer for the first time:
1. Windows SmartScreen may display: *"Windows protected your PC"*.
2. Click **More info**.
3. Click **Run anyway**.

---

## 3. Web Demonstration vs Desktop Sovereign Core

| Capability | Public Web Demonstration | Sovereign Desktop Application |
| :--- | :--- | :--- |
| **Hosting** | Cloudflare Pages Free (`*.pages.dev`) | Local Windows Host (Offline) |
| **Backend Dependency** | None (100% Client-side Synthetic Demo) | Bundled FastAPI + SQLite Sidecar |
| **Data Persistence** | Browser LocalStorage (Demo only) | Local SQLite Database on Disk |
| **Offline Execution** | Requires initial page load | 100% Offline (Zero internet needed) |
| **ASR Speech-to-Text** | Web Speech API fallback | On-device IndicConformer ONNX model |
| **Primary Purpose** | Fast evaluator showcase on phone/web | Full sovereign clinical workstation |

---

## 4. ASR Acoustic Model Packaging Strategy

MedScribeAI integrates the IndicConformer multilingual acoustic model converted for ONNX Runtime inference:
- **Model Identifier:** `meetsync-indic-conformer-onnx-int8` (derived from AI4Bharat IndicConformer CTC).
- **Model File:** `models/asr/indic-conformer/model.int8.onnx` (187.8 MB).
- **Vocabulary:** `models/asr/indic-conformer/tokens.txt` (5,633 BPE tokens).
- **Supported Languages:** 8 Indic languages (Hindi, Marathi, Bengali, Assamese, Gujarati, Kannada, Kashmiri, Bodo).

### Secondary Asset Packaging Architecture
To keep the primary Windows NSIS installer compact and reliable over low-bandwidth connections:
1. The backend implements deterministic multi-path model resolution (`_find_model_file()`):
   - `MEDSCRIBE_ASR_MODEL_PATH` environment variable.
   - `MEDSCRIBE_ASR_MODEL_DIR` environment variable.
   - Relative directory `models/asr/indic-conformer/model.int8.onnx`.
   - Local HuggingFace cache snapshot fallback.
2. If the ONNX file is not detected on first run, the backend gracefully starts, serves deterministic clinical NLP, triage, and physician workflows without crashing, and clearly flags `asr_available: false`.
3. Evaluators can place `model.int8.onnx` in the application directory or set `MEDSCRIBE_ASR_MODEL_DIR` to unlock local speech-to-text.

---

## 5. Automated GitHub Actions Release Pipeline

Release builds are automatically assembled and published using `.github/workflows/release.yml` on standard GitHub-hosted `windows-latest` runners.

### Release Workflow Stages
1. **Checkout & Environment Setup:** Node 20, Python 3.11, Rust stable.
2. **Deterministic Verification:** Runs TypeScript linting, 345 Vitest unit/integration tests, and 89 Pytest backend tests.
3. **Sidecar Assembly:** Prepares `medscribe-backend-x86_64-pc-windows-msvc.exe`.
4. **Tauri NSIS Compilation:** Generates `MedScribeAI_1.0.0_x64-setup.exe`.
5. **Integrity Manifest:** Calculates cryptographic SHA-256 hashes and outputs `SHA256SUMS.txt`.
6. **Publication:** Uploads release assets to GitHub Releases.

---

## 6. Declared Limitations

1. **OCR Host Dependency:** Optical Character Recognition requires an installed Tesseract binary on the host machine. If absent, the OCR capability gate honestly returns an unavailable status without fabricating synthetic text.
2. **ASR Dialect Calibration:** While Hindi and English speech have been demonstrated end-to-end, colloquial dialectal variations in rural primary care require localized acoustic training.
3. **No Autonomous Prescribing:** MedScribeAI generates draft clinical documentation (`AI_DRAFT`) and red-flag alerts. It never replaces the diagnostic autonomy or clinical judgment of a licensed medical practitioner.

---

## 7. Security & Privacy Audit Summary

- **Local Storage:** Patient encounters and clinical facts remain within the local SQLite database.
- **No Cloud Fallback:** When in `LOCAL_ONLY` mode, all outbound network requests are hard-blocked at the HTTP transport layer.
- **No Hardcoded Credentials:** Automated scans confirm 0 API keys, secrets, or private tokens committed to the repository.
- **Separated Consent Records:** Intake consent and hospital data-sharing consent are strictly decoupled.
