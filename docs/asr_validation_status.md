# ASR Validation Status — Phase 8.6

## Overall Status: PARTIALLY VALIDATED

| Check | Status |
|---|---|
| Model file exists | ✅ CONFIRMED |
| File size (196,977,855 bytes) | ✅ CONFIRMED |
| SHA-256 verified | ✅ CONFIRMED (`b99a01834cd1a72cd9be682a0b9543df6b152ef7dfceba88d3dbf59fbb77075d`) |
| ONNX session loads | ✅ CONFIRMED |
| Tensor contract verified | ✅ CONFIRMED (inputs/outputs match manifest) |
| Synthetic smoke inference | ✅ CONFIRMED (forward pass executes, log_probs shape `(1, T, 5633)`) |
| **Real acoustic inference** | ⏳ **DEFERRED** |
| **WER on real speech** | ⏳ **DEFERRED** |
| **CER on real speech** | ⏳ **DEFERRED** |
| **Clinical entity recall** | ⏳ **DEFERRED** |
| **Negation preservation** | ⏳ **DEFERRED** |

## Model Provenance

| Field | Value |
|---|---|
| Original model | `ai4bharat/indicconformer_stt_hi_hybrid_ctc_rnnt_large` |
| Original authors | AI4Bharat (MIT license) |
| Conversion repository | `meetsync/indic-conformer-onnx-sherpa` (**third-party**, NOT official AI4Bharat release) |
| Commit | `e19ba0d2f49c243fe4ce79ae3334526a03e753ae` |
| Quantization | INT8 |
| Runtime | sherpa-onnx (preferred) / onnxruntime-cpu (fallback) |
| Model size | 196,977,855 bytes (197.0 MB) |
| Local SHA-256 | `b99a01834cd1a72cd9be682a0b9543df6b152ef7dfceba88d3dbf59fbb77075d` |

## Supported Languages — THIS MODEL ONLY

ASR inference supports **8 languages**:

| Code | Language |
|---|---|
| `as` | Assamese |
| `bn` | Bengali |
| `brx` | Bodo |
| `gu` | Gujarati |
| `hi` | Hindi |
| `kn` | Kannada |
| `ks` | Kashmiri |
| `mr` | Marathi |

> ⚠️ **Tamil (`ta`) is NOT supported by this ASR model.**
> Tamil support is available only through the deterministic NLP/NER extractor.

## Language Coverage Separation

| Layer | Languages |
|---|---|
| ASR (IndicConformer) | as, bn, brx, gu, hi, kn, ks, mr |
| OCR (Tesseract) | eng, hin (+ additional packs if installed) |
| NLP/NER (deterministic) | en, hi, mr, ta, gu |

## ONNX Tensor Contract (Verified Against Physical Model)

```
Inputs:
  processed_signal        float32  [batch, 80, time]
  processed_signal_length int64    [batch]

Outputs:
  log_probs               float32  [batch, time_out, 5633]
  output_length           int64    [batch]

vocab_size : 5633
sample_rate: 16000 Hz
n_mel      : 80
CTC blank  : token index 5632 (<blk>, NeMo EncDecCTCModelBPE convention: vocab_size-1)
```

## What Remains Deferred

Before ASR can be reported as ACCURACY VALIDATED:

1. Real human-recorded speech WAV files (NOT TTS, NOT sine tones)
2. Independent human-transcribed ground truth (NOT derived from ASR output)
3. Minimum 10 utterances across the 8 supported languages
4. WER, CER computed on those real utterances
5. Clinical entity recall, negation/medication/numeric preservation computed on real transcripts

**Test class:** `TestASRRealHumanSpeech` in `backend/tests/test_asr_engine.py` — currently `@pytest.mark.skip(reason="DEFERRED")`
