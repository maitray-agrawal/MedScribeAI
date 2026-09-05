/**
 * Deterministic Red Flag Safety Engine for Indian Primary Care Kiosk.
 * Evaluates canonical clinical concept combinations (NOT raw keywords).
 * Catches life-threatening emergencies immediately with clear triage guidance.
 */

import { ExtractedClinicalConcept } from '../nlp/codeSwitchingExtractor';

export interface RedFlagAlert {
  ruleId: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  clinicalSummary: string;
  matchedConcepts: string[];
  recommendedImmediateAction: string;
}

interface RedFlagRule {
  ruleId: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  clinicalSummary: string;
  recommendedImmediateAction: string;
  evaluate: (affirmedConceptIds: Set<string>, allConcepts: ExtractedClinicalConcept[]) => boolean;
}

const DETERMINISTIC_RED_FLAG_RULES: RedFlagRule[] = [
  // 1. Acute Coronary Syndrome: Chest Pain + Dyspnea / Breathlessness
  {
    ruleId: 'RED_FLAG_ACS_DYSPNEA',
    title: 'Possible Acute Coronary Syndrome (Chest Pain + Dyspnea)',
    severity: 'CRITICAL',
    clinicalSummary: 'Patient reports chest pain associated with breathlessness/shortness of breath. High suspicion for myocardial ischemia or infarction.',
    recommendedImmediateAction: 'Immediate triage to emergency resuscitation area. Obtain urgent 12-lead ECG, establish IV access, and alert the on-duty medical officer.',
    evaluate: (ids) => ids.has('SYM_CHEST_PAIN') && ids.has('SYM_BREATHLESSNESS'),
  },

  // 2. Cardiogenic / Vasovagal Syncope with Chest Pain
  {
    ruleId: 'RED_FLAG_CARDIAC_SYNCOPE',
    title: 'Chest Discomfort with Syncope or Loss of Consciousness',
    severity: 'CRITICAL',
    clinicalSummary: 'Combination of chest symptoms with syncope or altered consciousness suggests dangerous dysrhythmia or major hemodynamic compromise.',
    recommendedImmediateAction: 'Check vitals immediately (BP, pulse, SpO2), continuous cardiac monitoring, defibrillator on standby, immediate clinician review.',
    evaluate: (ids) => ids.has('SYM_CHEST_PAIN') && (ids.has('SYM_ALTERED_CONSCIOUSNESS') || ids.has('SYM_DIZZINESS')),
  },

  // 3. Acute Stroke / CVA (FAST Signs)
  {
    ruleId: 'RED_FLAG_ACUTE_STROKE',
    title: 'Suspected Acute Stroke (FAST Protocol)',
    severity: 'CRITICAL',
    clinicalSummary: 'Signs of acute focal neurological deficit, facial asymmetry, limb weakness, or sudden altered consciousness.',
    recommendedImmediateAction: 'Note time of onset precisely. Urgent non-contrast CT brain, maintain airway, check capillary blood glucose, alert nearest stroke center.',
    evaluate: (ids) => ids.has('EMERG_STROKE_FAST') || (ids.has('SYM_HEADACHE') && ids.has('SYM_ALTERED_CONSCIOUSNESS')),
  },

  // 4. Critical Respiratory Failure / Severe Dyspnea Alone
  {
    ruleId: 'RED_FLAG_SEVERE_DYSPNEA',
    title: 'Severe Breathlessness / Respiratory Distress',
    severity: 'HIGH',
    clinicalSummary: 'Acute dyspnea reported without relief.',
    recommendedImmediateAction: 'Administer supplemental oxygen to maintain SpO2 >= 94%, position patient upright, auscultate chest, nebulize if wheezing present.',
    evaluate: (ids) => ids.has('SYM_BREATHLESSNESS'),
  },

  // 5. Unconsciousness / Unresponsive State
  {
    ruleId: 'RED_FLAG_UNRESPONSIVE',
    title: 'Loss of Consciousness / Unresponsive Patient',
    severity: 'CRITICAL',
    clinicalSummary: 'Patient reported to have fainted or become unresponsive.',
    recommendedImmediateAction: 'Assess Airway, Breathing, Circulation (ABC), check blood sugar (r/o hypoglycemia), place in recovery position if breathing normally.',
    evaluate: (ids) => ids.has('SYM_ALTERED_CONSCIOUSNESS') || ids.has('EMERG_UNRESPONSIVE'),
  },

  // 6. Gastrointestinal Hemorrhage (Melena / Hematemesis)
  {
    ruleId: 'RED_FLAG_GI_BLEED',
    title: 'Active Gastrointestinal Bleeding',
    severity: 'HIGH',
    clinicalSummary: 'Evidence of blood in stool or vomiting blood.',
    recommendedImmediateAction: 'Assess for postural hypotension and pallor, large-bore IV cannula, type and cross-match blood, urgent gastrointestinal review.',
    evaluate: (ids) => ids.has('SYM_BLOOD_IN_STOOL'),
  }
];

/**
 * Runs deterministic red-flag rules against affirmed canonical clinical concepts.
 * Ignores concepts that were explicitly negated (e.g. "BP nahi hai" or "chest pain nahi hai").
 */
export function evaluateRedFlags(extractedConcepts: ExtractedClinicalConcept[]): RedFlagAlert[] {
  // Only affirmed concepts contribute to clinical red flags!
  const affirmedConcepts = extractedConcepts.filter(c => c.assertion === 'affirmed');
  const affirmedIds = new Set(affirmedConcepts.map(c => c.conceptId));

  const alerts: RedFlagAlert[] = [];

  for (const rule of DETERMINISTIC_RED_FLAG_RULES) {
    if (rule.evaluate(affirmedIds, extractedConcepts)) {
      const matched = affirmedConcepts
        .filter(c => affirmedIds.has(c.conceptId))
        .map(c => `${c.conceptId} (${c.surfaceText})`);

      alerts.push({
        ruleId: rule.ruleId,
        title: rule.title,
        severity: rule.severity,
        clinicalSummary: rule.clinicalSummary,
        matchedConcepts: matched,
        recommendedImmediateAction: rule.recommendedImmediateAction,
      });
    }
  }

  return alerts;
}
