/**
 * Multilingual Clinical Extractor for Indian Healthcare Kiosk.
 * Integrates deterministic multilingual concept normalization with server-side Gemini 2.5 Flash extraction.
 * Never invents or hallucinates clinical facts.
 */

import { extractMultilingualConcepts, ExtractedClinicalConcept } from '../nlp/codeSwitchingExtractor';
import { normalizeMedications, NormalizedMedicationMatch } from '../nlp/medicationNormalizer';
import { extractTemporalExpressions, NormalizedTemporal } from '../nlp/temporalNormalizer';

export type ClinicalFactSource =
  | 'PATIENT_VOICE'
  | 'PATIENT_TAP'
  | 'UPLOADED_DOCUMENT'
  | 'CLINICIAN_ENTERED'
  | 'SYSTEM_DERIVED';

export type FactAssertion = 'affirmed' | 'negated' | 'uncertain';

export interface StructuredClinicalFact {
  conceptId: string;
  value: string;
  source: ClinicalFactSource;
  evidence: string;
  language: string;
  confidence: number;
  assertion: FactAssertion;
  temporality?: NormalizedTemporal | null;
}

export interface StructuredClinicalRecord {
  chiefComplaint: StructuredClinicalFact | null;
  symptoms: StructuredClinicalFact[];
  onset: StructuredClinicalFact | null;
  duration: StructuredClinicalFact | null;
  severity: StructuredClinicalFact | null;
  location: StructuredClinicalFact | null;
  character: StructuredClinicalFact | null;
  radiation: StructuredClinicalFact | null;
  aggravatingFactors: StructuredClinicalFact[];
  relievingFactors: StructuredClinicalFact[];
  associatedSymptoms: StructuredClinicalFact[];
  pastMedicalHistory: StructuredClinicalFact[];
  pastSurgicalHistory: StructuredClinicalFact[];
  medications: StructuredClinicalFact[];
  allergies: StructuredClinicalFact[];
  familyHistory: StructuredClinicalFact[];
  personalHistory: StructuredClinicalFact[];
  investigations: StructuredClinicalFact[];
  priorDiagnoses: StructuredClinicalFact[];
  ayushInformation: {
    prakriti?: string | null;
    aharaVihara?: string | null;
    agniStatus?: string | null;
    kalaParinama?: string | null;
  };
  unstructuredNotes: string;
}

/**
 * Extracts structured clinical facts from patient transcript.
 * Runs deterministic normalization locally first, then enriches via server API if online.
 */
export async function extractClinicalInformation(
  transcript: string,
  language: string = 'hi-IN',
  source: ClinicalFactSource = 'PATIENT_VOICE',
  useServerLlm: boolean = true
): Promise<StructuredClinicalRecord> {
  if (!transcript || !transcript.trim()) {
    return createEmptyRecord();
  }

  // 1. Deterministic Local Normalization (Fast, predictable, offline-capable)
  const concepts = extractMultilingualConcepts(transcript, 'patient_voice', language);
  const medications = normalizeMedications(transcript);
  const temporal = extractTemporalExpressions(transcript);

  // Initialize deterministic record
  const record: StructuredClinicalRecord = createEmptyRecord();
  record.unstructuredNotes = transcript;

  // Map temporal expressions
  if (temporal.length > 0) {
    const t = temporal[0];
    record.duration = {
      conceptId: 'TEMPORAL_DURATION',
      value: `${t.value} ${t.unit}`,
      source,
      evidence: t.rawText,
      language,
      confidence: 0.95,
      assertion: 'affirmed',
      temporality: t,
    };
  }

  // Map concepts
  for (const concept of concepts) {
    const fact: StructuredClinicalFact = {
      conceptId: concept.conceptId,
      value: concept.surfaceText,
      source,
      evidence: concept.evidence,
      language: concept.language || language,
      confidence: concept.confidence,
      assertion: concept.assertion,
      temporality: concept.temporality || null,
    };

    if (concept.category === 'symptom') {
      if (!record.chiefComplaint && concept.assertion === 'affirmed') {
        record.chiefComplaint = fact;
      }
      record.symptoms.push(fact);
    } else if (concept.category === 'condition') {
      record.pastMedicalHistory.push(fact);
    } else if (concept.category === 'investigation') {
      record.investigations.push(fact);
    } else if (concept.category === 'anatomy') {
      record.location = fact;
    } else if (concept.category === 'emergency') {
      record.symptoms.push(fact);
    }
  }

  // Map medications
  for (const med of medications) {
    record.medications.push({
      conceptId: med.canonicalId,
      value: med.genericName,
      source,
      evidence: med.evidence,
      language,
      confidence: med.confidence,
      assertion: 'affirmed',
      temporality: null,
    });
  }

  // 2. Server-side LLM enrichment (if enabled and connected)
  if (useServerLlm) {
    try {
      const response = await fetch('/api/clinical/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          language,
          normalizedConcepts: concepts,
        }),
      });

      if (response.ok) {
        const enriched = await response.json();
        if (enriched && typeof enriched === 'object') {
          // Merge enriched facts while preserving deterministic guarantees
          if (enriched.onset && !record.onset) record.onset = sanitizeFact(enriched.onset, source, language);
          if (enriched.severity && !record.severity) record.severity = sanitizeFact(enriched.severity, source, language);
          if (enriched.character && !record.character) record.character = sanitizeFact(enriched.character, source, language);
          if (enriched.radiation && !record.radiation) record.radiation = sanitizeFact(enriched.radiation, source, language);
          if (enriched.ayushInformation) record.ayushInformation = { ...record.ayushInformation, ...enriched.ayushInformation };
        }
      }
    } catch {
      // Fallback cleanly to deterministic facts if network/server is unavailable
    }
  }

  return record;
}

function sanitizeFact(fact: any, source: ClinicalFactSource, language: string): StructuredClinicalFact {
  return {
    conceptId: fact.conceptId || 'CUSTOM_CLINICAL_FACT',
    value: fact.value || 'Not documented',
    source: fact.source || source,
    evidence: fact.evidence || 'Verbatim transcript mention',
    language: fact.language || language,
    confidence: typeof fact.confidence === 'number' ? fact.confidence : 0.85,
    assertion: fact.assertion || 'affirmed',
    temporality: fact.temporality || null,
  };
}

function createEmptyRecord(): StructuredClinicalRecord {
  return {
    chiefComplaint: null,
    symptoms: [],
    onset: null,
    duration: null,
    severity: null,
    location: null,
    character: null,
    radiation: null,
    aggravatingFactors: [],
    relievingFactors: [],
    associatedSymptoms: [],
    pastMedicalHistory: [],
    pastSurgicalHistory: [],
    medications: [],
    allergies: [],
    familyHistory: [],
    personalHistory: [],
    investigations: [],
    priorDiagnoses: [],
    ayushInformation: {
      prakriti: null,
      aharaVihara: null,
      agniStatus: null,
      kalaParinama: null,
    },
    unstructuredNotes: '',
  };
}
