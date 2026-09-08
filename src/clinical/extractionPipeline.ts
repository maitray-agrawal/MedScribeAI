/**
 * Headless Canonical Clinical Fact Extraction Pipeline.
 *
 * Runs entirely independent of React component state or UI event loops.
 * Ingests unstructured patient utterances, transcripts, or document texts and emits
 * strictly typed, evidence-anchored Canonical ClinicalFact[] instances.
 */

import {
  ClinicalFact,
  FactDomain,
  FactAssertion,
  FactElicitation,
  FactTemporality,
  FactExperiencer,
  FactSourceType,
  generateFactId,
  createClinicalFact,
  MedicationAttributes,
  AYUSHAttributes,
} from './clinicalFactModel';
import { validateClinicalFact } from './evidenceGate';
import { extractMultilingualConcepts, ExtractedClinicalConcept } from '../nlp/codeSwitchingExtractor';
import { analyzeHindiTranscript, ExtractedFact, ClinicalConcept } from './hindiClinicalMatcher';
import { normalizeMedications } from '../nlp/medicationNormalizer';
import hindiSymptoms from '../dictionaries/medical/hindi_symptoms.json';
import hindiNegation from '../dictionaries/medical/hindi_negation.json';
import hindiTemporal from '../dictionaries/medical/hindi_temporal.json';

export interface ExtractionContext {
  encounterId?: string;
  sourceType?: FactSourceType;
  sourceId?: string;
  language?: string;
  experiencer?: FactExperiencer;
  turnIndex?: number;
}

/**
 * Parses dosage, unit, and frequency from clinical medication phrases.
 * e.g., "Tab. Metformin 500mg BD" -> { dose: "500", unit: "mg", frequency: "BD" }
 */
export function parseMedicationComponents(text: string): {
  drugName?: string;
  dose?: string;
  unit?: string;
  frequency?: string;
  route?: string;
} {
  const result: {
    drugName?: string;
    dose?: string;
    unit?: string;
    frequency?: string;
    route?: string;
  } = {};

  // Route / Form
  const routeMatch = text.match(/\b(tab(?:let)?|cap(?:sule)?|syp|syrup|inj(?:ection)?|drops?|cream|gel|oint(?:ment)?)\b/i);
  if (routeMatch) {
    result.route = routeMatch[1].toLowerCase();
  }

  // Dose & Unit (e.g. 500mg, 500 mg, 0.5mg, 5ml, 10 units, 20/120mg)
  const doseMatch = text.match(/(\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)?)\s*(mg|g|mcg|ml|units?|tablets?|capsules?|drops?|iu)\b/i);
  if (doseMatch) {
    result.dose = doseMatch[1];
    result.unit = doseMatch[2].toLowerCase();
  }

  // Frequency (e.g. OD, BD, BID, TDS, TID, QID, QDS, PRN, once daily, twice daily, raat ko, subah)
  const freqMatch = text.match(/\b(od|bd|bid|tds|tid|qid|qds|prn|stat|sos|hs|once\s+daily|twice\s+daily|thrice\s+daily|din\s+me\s+do\s+baar|subah\s+sham|raat\s+ko)\b/i);
  if (freqMatch) {
    result.frequency = freqMatch[1].toUpperCase();
  }

  return result;
}

/**
 * Adapts legacy ExtractedClinicalConcept to canonical ClinicalFact.
 */
export function adaptExtractedConceptToFact(
  concept: ExtractedClinicalConcept,
  context: ExtractionContext = {}
): ClinicalFact {
  const assertion: FactAssertion =
    concept.assertion === 'affirmed'
      ? 'AFFIRMED'
      : concept.assertion === 'negated'
      ? 'NEGATED'
      : 'UNKNOWN';

  const domain: FactDomain =
    concept.category === 'symptom'
      ? 'symptom'
      : concept.category === 'condition'
      ? 'condition'
      : concept.category === 'investigation'
      ? 'investigation'
      : concept.category === 'anatomy'
      ? 'anatomy'
      : 'symptom';

  const sourceType: FactSourceType = context.sourceType || 'PATIENT_VOICE';

  return createClinicalFact({
    factId: generateFactId(concept.conceptId, sourceType),
    encounterId: context.encounterId,
    domain,
    canonicalId: concept.conceptId,
    preferredTerm: concept.surfaceText,
    assertion,
    elicitation: 'ELICITED',
    temporality: 'CURRENT',
    experiencer: context.experiencer || 'PATIENT',
    confidence: concept.confidence || 0.9,
    evidence: [
      {
        text: concept.evidence || concept.surfaceText,
        verbatimText: concept.evidence || concept.surfaceText,
        startOffset: 0,
        endOffset: (concept.evidence || concept.surfaceText).length,
        startChar: 0,
        endChar: (concept.evidence || concept.surfaceText).length,
      },
    ],
    provenance: {
      sourceType,
      sourceId: context.sourceId,
      language: concept.language || context.language || 'en',
      extractionEngine: 'codeSwitchingExtractor',
      confidence: concept.confidence || 0.9,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Adapts Hindi ExtractedFact to canonical ClinicalFact.
 */
export function adaptHindiFactToFact(
  fact: ExtractedFact,
  rawTranscript: string,
  context: ExtractionContext = {},
  temporal?: any
): ClinicalFact {
  let assertion: FactAssertion =
    fact.assertion === 'present'
      ? 'AFFIRMED'
      : fact.assertion === 'negated'
      ? 'NEGATED'
      : 'UNKNOWN';

  const lowerTranscript = rawTranscript.toLowerCase();
  const isSuspected =
    /\b(maybe|perhaps|possible|possibly|might be|suspect|shayad|lagta hai|ho sakta hai)\b/i.test(
      lowerTranscript
    );
  const isConditional =
    /\b(if\b|in case|whenever|agar\b|yadi\b|jab\b)/i.test(lowerTranscript);

  if (assertion === 'AFFIRMED') {
    if (isSuspected) {
      assertion = 'SUSPECTED';
    } else if (isConditional) {
      assertion = 'CONDITIONAL';
    }
  }

  const domain: FactDomain = fact.category === 'condition' ? 'condition' : 'symptom';
  const sourceType: FactSourceType = context.sourceType || 'PATIENT_VOICE';

  let startOffset = 0;
  let endOffset = rawTranscript.length;
  if (fact.matchedPhrase && rawTranscript.includes(fact.matchedPhrase)) {
    startOffset = rawTranscript.indexOf(fact.matchedPhrase);
    endOffset = startOffset + fact.matchedPhrase.length;
  } else if (fact.evidence && rawTranscript.includes(fact.evidence)) {
    startOffset = rawTranscript.indexOf(fact.evidence);
    endOffset = startOffset + fact.evidence.length;
  }

  const durationStr =
    temporal?.value && temporal?.unit ? `${temporal.value} ${temporal.unit}` : undefined;

  return createClinicalFact({
    factId: generateFactId(fact.conceptId, sourceType),
    encounterId: context.encounterId,
    domain,
    canonicalId: fact.conceptId,
    preferredTerm: fact.canonicalEnglish,
    assertion,
    elicitation: 'ELICITED',
    temporality: temporal ? 'PAST_ONGOING' : 'CURRENT',
    experiencer: context.experiencer || 'PATIENT',
    confidence: fact.confidence,
    attributes: durationStr ? { duration: durationStr } : undefined,
    evidence: [
      {
        text: fact.matchedPhrase || fact.evidence || rawTranscript,
        verbatimText: fact.matchedPhrase || fact.evidence || rawTranscript,
        startOffset,
        endOffset,
        startChar: startOffset,
        endChar: endOffset,
      },
    ],
    provenance: {
      sourceType,
      sourceId: context.sourceId,
      language: context.language || 'hi',
      extractionEngine: 'hindiClinicalMatcher',
      confidence: fact.confidence,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Detects explicit allergy discussions:
 * - "I have no allergies" / "allergy nahi hai" -> NEGATED
 * - "Allergic to penicillin" -> AFFIRMED
 */
export function extractAllergyFacts(
  text: string,
  context: ExtractionContext = {}
): ClinicalFact[] {
  const facts: ClinicalFact[] = [];
  const sourceType: FactSourceType = context.sourceType || 'PATIENT_VOICE';

  // 1. Explicit denial of allergies
  const explicitNegationRegex = /\b(no\s+(known\s+)?(drug\s+)?allerg(?:y|ies)|not\s+allergic|allergy\s+(nahi|nahin)\s+hai|kisi\s+dawa(?:i)?\s+se\s+allergy\s+(nahi|nahin))\b/i;
  const negMatch = text.match(explicitNegationRegex);
  if (negMatch) {
    facts.push(
      createClinicalFact({
        factId: generateFactId('ALLERGY_NKDA', sourceType),
        encounterId: context.encounterId,
        domain: 'allergy',
        canonicalId: 'ALLERGY_DRUG_GENERAL',
        preferredTerm: 'No Known Drug Allergy (Explicit Patient Denial)',
        assertion: 'NEGATED',
        elicitation: 'ELICITED',
        temporality: 'CURRENT',
        experiencer: context.experiencer || 'PATIENT',
        evidence: [
          {
            text: negMatch[0],
            verbatimText: negMatch[0],
            startOffset: negMatch.index,
            endOffset:
              negMatch.index !== undefined ? negMatch.index + negMatch[0].length : undefined,
            startChar: negMatch.index,
            endChar:
              negMatch.index !== undefined ? negMatch.index + negMatch[0].length : undefined,
          },
        ],
        provenance: {
          sourceType,
          sourceId: context.sourceId,
          language: context.language || 'en',
          extractionEngine: 'allergyPatternMatcher',
          confidence: 0.98,
          timestamp: new Date().toISOString(),
        },
      })
    );
    return facts;
  }

  // 2. Specific drug allergy mention (e.g. penicillin allergy, sulfa allergy)
  const allergyMentionRegex = /\b(allergic\s+to\s+([a-z0-9]+)|([a-z0-9]+)\s+allergy)\b/i;
  const posMatch = text.match(allergyMentionRegex);
  if (posMatch) {
    const allergen = posMatch[2] || posMatch[3];
    if (allergen && !['no', 'nahi', 'not'].includes(allergen.toLowerCase())) {
      facts.push(
        createClinicalFact({
          factId: generateFactId(`ALLERGY_${allergen.toUpperCase()}`, sourceType),
          encounterId: context.encounterId,
          domain: 'allergy',
          canonicalId: `ALLERGY_${allergen.toUpperCase()}`,
          preferredTerm: `Allergy to ${allergen}`,
          value: allergen,
          assertion: 'AFFIRMED',
          elicitation: 'ELICITED',
          temporality: 'CHRONIC',
          experiencer: context.experiencer || 'PATIENT',
          evidence: [
            {
              text: posMatch[0],
              verbatimText: posMatch[0],
              startOffset: posMatch.index,
              endOffset:
                posMatch.index !== undefined ? posMatch.index + posMatch[0].length : undefined,
              startChar: posMatch.index,
              endChar:
                posMatch.index !== undefined ? posMatch.index + posMatch[0].length : undefined,
            },
          ],
          provenance: {
            sourceType,
            sourceId: context.sourceId,
            language: context.language || 'en',
            extractionEngine: 'allergyPatternMatcher',
            confidence: 0.95,
            timestamp: new Date().toISOString(),
          },
        })
      );
    }
  }

  // 3. Explicit patient uncertainty: "I don't know" / "not sure" / "pata nahi" -> UNKNOWN + ELICITED
  const allergyUncertaintyRegex = /\b(don'?t\s+know(\s+if|\s+about)?\s+allerg(?:y|ies)?|not\s+sure\s+about\s+allerg(?:y|ies)?|allergy.*(pata\s+nahi|maloom\s+nahi|yaad\s+nahi)|(pata\s+nahi|maloom\s+nahi).*allergy)\b/i;
  const uncertMatch = text.match(allergyUncertaintyRegex);
  if (uncertMatch) {
    facts.push(
      createClinicalFact({
        factId: generateFactId('ALLERGY_UNCERTAIN', sourceType),
        encounterId: context.encounterId,
        domain: 'allergy',
        canonicalId: 'ALLERGY_UNSPECIFIED',
        preferredTerm: 'Allergy Status: Unknown / Uncertain by Patient',
        assertion: 'UNKNOWN',
        elicitation: 'ELICITED',
        temporality: 'CURRENT',
        experiencer: context.experiencer || 'PATIENT',
        evidence: [
          {
            text: uncertMatch[0],
            verbatimText: uncertMatch[0],
            startOffset: uncertMatch.index,
            endOffset: uncertMatch.index !== undefined ? uncertMatch.index + uncertMatch[0].length : undefined,
            startChar: uncertMatch.index,
            endChar: uncertMatch.index !== undefined ? uncertMatch.index + uncertMatch[0].length : undefined,
          },
        ],
        provenance: {
          sourceType,
          sourceId: context.sourceId,
          language: context.language || 'en',
          extractionEngine: 'allergyPatternMatcher',
          confidence: 0.95,
          timestamp: new Date().toISOString(),
        },
      })
    );
  }

  return facts;
}

/**
 * Creates an unelicited allergy fact indicating allergies were never discussed.
 * UNKNOWN + NOT_ELICITED. Never defaults to NKDA!
 */
export function createUnelicitedAllergyFact(context: ExtractionContext = {}): ClinicalFact {
  return createClinicalFact({
    factId: generateFactId('ALLERGY_UNELICITED', context.sourceType || 'SYSTEM_DERIVED'),
    encounterId: context.encounterId,
    domain: 'allergy',
    canonicalId: 'ALLERGY_STATUS',
    preferredTerm: 'Allergy History',
    assertion: 'UNKNOWN',
    elicitation: 'NOT_ELICITED',
    temporality: 'UNSPECIFIED',
    experiencer: context.experiencer || 'PATIENT',
    evidence: [],
    provenance: {
      sourceType: context.sourceType || 'SYSTEM_DERIVED',
      sourceId: context.sourceId,
      language: context.language || 'en',
      extractionEngine: 'systemElicitationTracker',
      confidence: 1.0,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Extracts patient-reported AYUSH Prakriti and constitutional tendencies.
 * Preserves PATIENT_REPORTED distinction from clinician-assessed Dashavidha Pariksha.
 */
export function extractAYUSHFacts(
  text: string,
  context: ExtractionContext = {}
): ClinicalFact[] {
  const facts: ClinicalFact[] = [];
  const sourceType: FactSourceType = context.sourceType || 'PATIENT_VOICE';

  const prakritiRegex = /\b(prakriti|prakruti|dosha|body\s+type)\s*(?:hai|is|:)?\s*([a-z\s-]+)\b/i;
  const match =
    text.match(prakritiRegex) ||
    text.match(/\b(vata-pitta|pitta-kapha|vata-kapha|tridoshaja|vata|pitta|kapha)\b/i);

  if (match) {
    const rawDosha = (match[2] || match[1] || '').trim();
    let normalized = 'Tridoshaja';
    if (/vata-pitta/i.test(rawDosha)) normalized = 'Vata-Pitta';
    else if (/pitta-kapha/i.test(rawDosha)) normalized = 'Pitta-Kapha';
    else if (/vata-kapha/i.test(rawDosha)) normalized = 'Vata-Kapha';
    else if (/vata/i.test(rawDosha)) normalized = 'Vata';
    else if (/pitta/i.test(rawDosha)) normalized = 'Pitta';
    else if (/kapha/i.test(rawDosha)) normalized = 'Kapha';

    const ayushAttrs: AYUSHAttributes = {
      ayushCategory: 'prakriti',
      constitutionalRole: normalized,
      prakriti: normalized,
      reporterType: 'PATIENT_REPORTED',
    };

    facts.push(
      createClinicalFact({
        factId: generateFactId(
          `AYUSH_PRAKRITI_${normalized.toUpperCase().replace(/[^A-Z]/g, '_')}`,
          sourceType
        ),
        encounterId: context.encounterId,
        domain: 'ayush',
        canonicalId: `AYUSH_PRAKRITI_${normalized.toUpperCase().replace(/[^A-Z]/g, '_')}`,
        preferredTerm: `Patient-Reported Prakriti: ${normalized}`,
        value: normalized,
        attributes: ayushAttrs,
        assertion: 'AFFIRMED',
        elicitation: 'ELICITED',
        temporality: 'CHRONIC',
        experiencer: context.experiencer || 'PATIENT',
        reporterType: 'PATIENT_REPORTED',
        evidence: [
          {
            text: match[0],
            verbatimText: match[0],
            startOffset: match.index,
            endOffset: match.index !== undefined ? match.index + match[0].length : undefined,
            startChar: match.index,
            endChar: match.index !== undefined ? match.index + match[0].length : undefined,
          },
        ],
        provenance: {
          sourceType,
          sourceId: context.sourceId,
          language: context.language || 'hi',
          extractionEngine: 'ayushConceptMatcher',
          confidence: 0.95,
          timestamp: new Date().toISOString(),
        },
      })
    );
  }

  // Agni
  const agniMatch = text.match(/\b(samagni|tikshnagni|mandagni|vishamagni)\b/i);
  if (agniMatch) {
    const agniType = agniMatch[1];
    const normalizedAgni =
      agniType.toLowerCase() === 'samagni'
        ? 'Samagni'
        : agniType.toLowerCase() === 'tikshnagni'
        ? 'Tikshnagni'
        : agniType.toLowerCase() === 'mandagni'
        ? 'Mandagni'
        : 'Vishamagni';

    const agniAttrs: AYUSHAttributes = {
      ayushCategory: 'agni',
      agniType: normalizedAgni,
      reporterType: 'PATIENT_REPORTED',
    };

    facts.push(
      createClinicalFact({
        factId: generateFactId(`AYUSH_AGNI_${normalizedAgni.toUpperCase()}`, sourceType),
        encounterId: context.encounterId,
        domain: 'ayush',
        canonicalId: `AYUSH_AGNI_${normalizedAgni.toUpperCase()}`,
        preferredTerm: `Digestive Fire: ${normalizedAgni}`,
        value: normalizedAgni,
        attributes: agniAttrs,
        assertion: 'AFFIRMED',
        elicitation: 'ELICITED',
        temporality: 'CURRENT',
        experiencer: context.experiencer || 'PATIENT',
        reporterType: 'PATIENT_REPORTED',
        evidence: [
          {
            text: agniMatch[0],
            verbatimText: agniMatch[0],
            startOffset: agniMatch.index,
            endOffset:
              agniMatch.index !== undefined ? agniMatch.index + agniMatch[0].length : undefined,
            startChar: agniMatch.index,
            endChar:
              agniMatch.index !== undefined ? agniMatch.index + agniMatch[0].length : undefined,
          },
        ],
        provenance: {
          sourceType,
          sourceId: context.sourceId,
          language: context.language || 'hi',
          extractionEngine: 'ayushConceptMatcher',
          confidence: 0.95,
          timestamp: new Date().toISOString(),
        },
      })
    );
  }

  return facts;
}

/**
 * Extracts medications with dose and frequency.
 * Treats mentions as MEDICATION history (MedicationStatement), NOT prescription orders!
 */
export function extractMedicationFacts(
  text: string,
  context: ExtractionContext = {}
): ClinicalFact[] {
  const facts: ClinicalFact[] = [];
  const sourceType: FactSourceType = context.sourceType || 'PATIENT_VOICE';

  const normalizedMatches = normalizeMedications(text);
  const parsedComp = parseMedicationComponents(text);

  for (const m of normalizedMatches) {
    const rawDose = parsedComp.dose || m.dosage || text.match(/(\d+\s*mg)/i)?.[1];
    const unit = parsedComp.unit || 'mg';
    const dosage = rawDose
      ? rawDose.toLowerCase().includes(unit.toLowerCase())
        ? rawDose
        : `${rawDose}${unit}`
      : undefined;
    const freq =
      parsedComp.frequency ||
      m.frequency ||
      text.match(/\b(bd|bid|tds|tid|od|qd|sos)\b/i)?.[1]?.toUpperCase();

    const medAttrs: MedicationAttributes = {
      drugName: m.genericName,
      dose: rawDose,
      dosage,
      unit,
      frequency: freq,
      route: parsedComp.route,
      isPrescriptionOrder: false, // Patient/document mention is NEVER an order!
    };

    let startOffset = 0;
    let endOffset = text.length;
    if (m.surfaceText && text.includes(m.surfaceText)) {
      startOffset = text.indexOf(m.surfaceText);
      endOffset = startOffset + m.surfaceText.length;
    }

    facts.push(
      createClinicalFact({
        factId: generateFactId(m.canonicalId, sourceType),
        encounterId: context.encounterId,
        domain: 'medication',
        canonicalId: m.canonicalId,
        preferredTerm: m.genericName,
        value: `${m.genericName}${medAttrs.dose ? ` ${medAttrs.dose}` : ''}${medAttrs.frequency ? ` ${medAttrs.frequency}` : ''}`,
        attributes: medAttrs,
        assertion: 'AFFIRMED',
        elicitation: 'ELICITED',
        temporality: 'CURRENT',
        experiencer: context.experiencer || 'PATIENT',
        confidence: m.confidence,
        evidence: [
          {
            text: m.surfaceText || text.trim(),
            verbatimText: m.surfaceText || text.trim(),
            startOffset,
            endOffset,
            startChar: startOffset,
            endChar: endOffset,
          },
        ],
        provenance: {
          sourceType,
          sourceId: context.sourceId,
          language: context.language || 'en',
          extractionEngine: 'medicationNormalizer',
          confidence: m.confidence,
          timestamp: new Date().toISOString(),
        },
      })
    );
  }

  return facts;
}

/**
 * Master Headless Canonical Fact Extractor.
 * Runs deterministic bilingual NLP + medication + AYUSH + allergy matching.
 * Validates each fact through the Evidence Gate before returning.
 */
export function extractCanonicalFacts(
  input: string,
  context: ExtractionContext = {}
): ClinicalFact[] {
  if (!input || !input.trim()) {
    return [];
  }

  const raw = input.trim();
  const facts: ClinicalFact[] = [];
  const seenCanonicalIds = new Set<string>();

  // 1. Check if Hindi / Romanized Hindi is present
  const isDevanagari = /[\u0900-\u097F]/.test(raw);
  const isHindiKeywords =
    /\b(dard|bukhar|sirdard|chakkar|ulti|dast|khasi|seene|chhati|nahi|nahin|lekin|sar\s+dard)\b/i.test(
      raw
    );

  if (isDevanagari || isHindiKeywords) {
    const hindiResult = analyzeHindiTranscript(
      raw,
      hindiSymptoms as unknown as ClinicalConcept[],
      hindiNegation as any,
      hindiTemporal as any
    );
    for (const hf of hindiResult.facts) {
      const canonical = adaptHindiFactToFact(hf, raw, context, hindiResult.temporal);
      facts.push(canonical);
      seenCanonicalIds.add(canonical.canonicalId);
    }
  }

  // 2. Multilingual concept extractor
  const concepts = extractMultilingualConcepts(raw, 'patient_voice', context.language);
  for (const c of concepts) {
    if (!seenCanonicalIds.has(c.conceptId)) {
      const canonical = adaptExtractedConceptToFact(c, context);
      facts.push(canonical);
      seenCanonicalIds.add(canonical.canonicalId);
    }
  }

  // 3. Medication Extraction (with dose, unit, frequency)
  const medFacts = extractMedicationFacts(raw, context);
  for (const mf of medFacts) {
    if (!seenCanonicalIds.has(mf.canonicalId)) {
      facts.push(mf);
      seenCanonicalIds.add(mf.canonicalId);
    }
  }

  // 4. AYUSH Extraction
  const ayushFacts = extractAYUSHFacts(raw, context);
  for (const af of ayushFacts) {
    if (!seenCanonicalIds.has(af.canonicalId)) {
      facts.push(af);
      seenCanonicalIds.add(af.canonicalId);
    }
  }

  // 5. Allergy Extraction
  const allergyFacts = extractAllergyFacts(raw, context);
  for (const alf of allergyFacts) {
    if (!seenCanonicalIds.has(alf.canonicalId)) {
      facts.push(alf);
      seenCanonicalIds.add(alf.canonicalId);
    }
  }

  // 6. Run all facts through the Evidence Gatekeeper
  const validatedFacts = facts.filter((f) => {
    const validation = validateClinicalFact(f);
    if (!validation.valid) {
      console.warn(`[EvidenceGate] Rejected invalid fact:`, validation.violations, f);
      return false;
    }
    return true;
  });

  return validatedFacts;
}

/**
 * Headless extraction runner for multi-turn dialogues or multi-sentence batches.
 * Fully decoupled from React or UI lifecycle.
 */
export function runHeadlessClinicalExtractionPipeline(
  inputs: string[],
  options?: { includeUnelicitedAllergy?: boolean; context?: ExtractionContext }
): { facts: ClinicalFact[] } {
  const allFacts: ClinicalFact[] = [];
  for (const input of inputs) {
    allFacts.push(...extractCanonicalFacts(input, options?.context));
  }
  if (options?.includeUnelicitedAllergy) {
    const hasAllergy = allFacts.some(
      (f) => f.domain === 'allergy' || f.domain === 'ALLERGY'
    );
    if (!hasAllergy) {
      allFacts.push(createUnelicitedAllergyFact(options?.context));
    }
  }
  return { facts: allFacts };
}
