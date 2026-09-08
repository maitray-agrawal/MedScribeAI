/**
 * Clinical AI Core API Client.
 *
 * Centralized boundary between the React frontend and the sovereign Python/FastAPI backend.
 * Provides typed access to canonical ClinicalFact extraction and service health.
 */

export interface FactProvenance {
  source_id: string;
  start_char: number;
  end_char: number;
  matched_text?: string | null;
  engine: string;
}

export type FactAssertion = 'present' | 'negated' | 'uncertain' | 'not_elicited';
export type FactCategory = 'symptom' | 'condition' | 'medication' | 'allergy' | 'investigation' | 'anatomy' | 'ayush';
export type FactTemporality = 'current' | 'historical' | 'acute' | 'chronic' | 'unknown';
export type FactExperiencer = 'patient' | 'family_member' | 'clinician' | 'other';
export type FactSource =
  | 'patient_transcript'
  | 'patient_voice'
  | 'patient_tap'
  | 'uploaded_document'
  | 'clinician_entered'
  | 'system_derived';

export interface ClinicalFact {
  concept_id: string;
  canonical_text: string;
  category: FactCategory;
  assertion: FactAssertion;
  temporality: FactTemporality;
  experiencer: FactExperiencer;
  evidence: string;
  source: FactSource;
  confidence: number;
  language: string;
  provenance: FactProvenance;
}

export interface ClinicalExtractionResponse {
  facts: ClinicalFact[];
  language_detected?: string;
}

export class ClinicalAIClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://127.0.0.1:8000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Checks whether the sovereign Python AI core backend is running and healthy.
   */
  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`, { method: 'GET' });
      if (!res.ok) return false;
      const data = await res.json();
      return data?.status === 'ok';
    } catch {
      return false;
    }
  }

  /**
   * Retrieves the Python AI core service version.
   */
  async getVersion(): Promise<string | null> {
    try {
      const res = await fetch(`${this.baseUrl}/version`, { method: 'GET' });
      if (!res.ok) return null;
      const data = await res.json();
      return data?.version || null;
    } catch {
      return null;
    }
  }

  /**
   * Extracts canonical ClinicalFact models with evidence grounding from patient/clinician text.
   */
  async extractClinicalFacts(
    text: string,
    language: string = 'hi',
    sourceId: string = 'encounter-live'
  ): Promise<ClinicalFact[]> {
    if (!text || !text.trim()) {
      return [];
    }

    try {
      const res = await fetch(`${this.baseUrl}/api/v1/clinical/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language,
          source_id: sourceId,
        }),
      });

      if (!res.ok) {
        throw new Error(`Clinical extraction HTTP error: ${res.status}`);
      }

      const data: ClinicalExtractionResponse = await res.json();
      return data.facts || [];
    } catch (err) {
      console.warn('FastAPI clinical extraction unavailable:', err);
      return [];
    }
  }
}

export const clinicalAIClient = new ClinicalAIClient();
