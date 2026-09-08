# MedScribeAI Sovereign Clinical AI Core (`backend/`)

## 1. Overview & Architectural Role

The `backend/` service provides a sovereign, offline-capable Python/FastAPI clinical intelligence service for the MedScribeAI platform. It establishes a strict clinical boundary where unstructured speech, text, or document inputs are normalized into verifiable `ClinicalFact` models with immutable evidence grounding.

```
React (TypeScript Kiosk & Workstation)
          │
          ▼
   clinicalAIClient.ts  (Unified Client Boundary)
          │
          ▼
   FastAPI Core (backend/app/)
          │
  ┌───────┼────────┬──────────┐
  ▼       ▼        ▼          ▼
 Local   Local    Local    Local
  ASR     OCR      NLP     Safety
[PLAN]  [PLAN]   [IMPL]    [PLAN]
  │       │        │          │
  └───────┴────────┴──────────┘
                  │
                  ▼
          ClinicalFact[]
                  │
        Evidence / Provenance
                  │
          Physician Review
                  │
            FHIR R4 / DB
```

---

## 2. Implementation Status: Implemented vs. Planned

| Capability | Status | Implementation Details |
| :--- | :--- | :--- |
| **FastAPI Service Core** | **IMPLEMENTED** | `GET /health`, `GET /version`, `POST /api/v1/clinical/extract` running with CORS on `127.0.0.1:8000`. |
| **Canonical ClinicalFact Model** | **IMPLEMENTED** | Pydantic v2 models with assertion (`present`, `negated`, `uncertain`, `not_elicited`), temporality, experiencer, and evidence spans. |
| **Evidence & Provenance Tracking** | **IMPLEMENTED** | `FactProvenance` recording source ID, character start/end offsets, matched text, and engine metadata. |
| **Deterministic Multilingual NLP** | **IMPLEMENTED** | Concept matcher supporting English and Hindi clinical terms with clause-bounded negation scoping (e.g. `"BP ka problem nahi hai lekin sar dard hai"`). |
| **TypeScript Client Adapter** | **IMPLEMENTED** | `src/services/clinicalAIClient.ts` with graceful fallback cascade. |
| **Provider Abstraction** | **IMPLEMENTED** | `src/services/aiProvider.ts` defining `LocalPythonProvider` and `CloudGeminiProvider`. |
| **Local Offline ASR (Whisper)** | **PLANNED** | Dedicated on-device acoustic model for Indic clinical dialects. |
| **Local Document OCR (Paddle/Vision)** | **PLANNED** | On-device prescription and diagnostic report OCR pipeline. |
| **Local Quantized LLM (SLM/Ollama)** | **PLANNED** | Sovereign local model for clinical summary drafting. |
| **Local SQLite & Sync Engine** | **PLANNED** | Zero-retention transient local storage and ABDM cloud sync. |

---

## 3. Strict Clinical Safety Invariants

1. **Never Invent Facts:** No diagnosis, prescription, lab value, or vital sign is ever generated or asserted without direct evidence in the source transcript or document.
2. **Missing is Not Negative:** Missing facts remain un-asserted or `NOT_ELICITED`. The engine never defaults missing review-of-systems or medical history to negative findings.
3. **Evidence Grounding:** Every `ClinicalFact` requires a non-empty `evidence` quote and explicit character spans (`start_char`, `end_char`).
4. **Negation Scope Integrity:** Explicitly negated patient statements (e.g. *"diabetes nahi hai"*) produce `assertion: negated` and are never promoted to active conditions.

---

## 4. Running and Testing

### Setup Environment
```bash
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
```

### Start the FastAPI Server
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Execute Tests
```bash
pytest
```
