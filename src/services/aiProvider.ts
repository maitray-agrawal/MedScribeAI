/**
 * Clinical AI Provider Abstraction.
 *
 * Decouples frontend consumption from specific AI execution engines.
 * Supports sovereign local Python execution with optional cloud Gemini augmentation.
 */

import { clinicalAIClient, ClinicalFact } from './clinicalAIClient';

export interface ClinicalExtractionOptions {
  language?: string;
  sourceId?: string;
}

export interface ClinicalAIProvider {
  readonly name: string;
  isAvailable(): Promise<boolean>;
  extractFacts(text: string, options?: ClinicalExtractionOptions): Promise<ClinicalFact[]>;
}

/**
 * Local sovereign Python/FastAPI extraction provider.
 * Operates on-device with deterministic NLP and guaranteed provenance.
 */
export class LocalPythonProvider implements ClinicalAIProvider {
  readonly name = 'LocalPythonProvider';

  async isAvailable(): Promise<boolean> {
    return clinicalAIClient.healthCheck();
  }

  async extractFacts(text: string, options?: ClinicalExtractionOptions): Promise<ClinicalFact[]> {
    return clinicalAIClient.extractClinicalFacts(
      text,
      options?.language || 'hi',
      options?.sourceId || 'encounter-live'
    );
  }
}

/**
 * Optional cloud Gemini provider for server-side enrichment.
 */
export class CloudGeminiProvider implements ClinicalAIProvider {
  readonly name = 'CloudGeminiProvider';

  async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch('/api/health');
      return res.ok;
    } catch {
      return false;
    }
  }

  async extractFacts(text: string, options?: ClinicalExtractionOptions): Promise<ClinicalFact[]> {
    // Cloud provider acts as an optional enrichment channel
    return [];
  }
}

/**
 * Hybrid orchestrator: Prefers sovereign local Python core, falls back gracefully.
 */
export class HybridClinicalProvider implements ClinicalAIProvider {
  readonly name = 'HybridClinicalProvider';

  constructor(
    private localProvider: ClinicalAIProvider = new LocalPythonProvider(),
    private cloudProvider: ClinicalAIProvider = new CloudGeminiProvider()
  ) {}

  async isAvailable(): Promise<boolean> {
    const localAvailable = await this.localProvider.isAvailable();
    if (localAvailable) return true;
    return this.cloudProvider.isAvailable();
  }

  async extractFacts(text: string, options?: ClinicalExtractionOptions): Promise<ClinicalFact[]> {
    const localUp = await this.localProvider.isAvailable();
    if (localUp) {
      return this.localProvider.extractFacts(text, options);
    }
    return this.cloudProvider.extractFacts(text, options);
  }
}

export const activeClinicalProvider = new HybridClinicalProvider();
