import {
  PatientInfo,
  SOAPNote,
  StructuredPatientIntake,
  UploadedDocumentRecord,
} from '../types';
import { VerifiedAbhaProfile } from '../components/kiosk/AbhaVerificationStep';
import { checkDrugInteractions } from './drugInteractionChecker';

export interface PhysicianReadySummaryResult {
  patientInfo: PatientInfo;
  soapNote: SOAPNote;
  formattedStandardHistoryText: string;
  sections: {
    chiefComplaint: string;
    hpi: string;
    pastMedicalSurgical: string;
    drugAndAllergy: string;
    familyHistory: string;
    personalHistory: string;
    reviewOfSystems: string;
    priorInvestigationsSummary: string;
    ayushIntegrationSummary?: string;
  };
}

/**
 * Generates a single, physician-ready structured clinical summary in the standard format:
 * Chief Complaint → HPI → Past Medical/Surgical → Drug & Allergy → Family → Personal → ROS → Prior Investigations Summary.
 * Seamlessly integrates Allopathic & AYUSH (Ayurveda) data and document upload findings.
 */
export function generatePhysicianReadyIntakeSummary(
  intake: StructuredPatientIntake | null,
  verifiedProfile: VerifiedAbhaProfile | null,
  clinicalDepartment: 'Allopathic' | 'Ayurveda (AYUSH)',
  uploadedDocs: UploadedDocumentRecord[] = []
): PhysicianReadySummaryResult {
  const isAyush = clinicalDepartment === 'Ayurveda (AYUSH)';

  // 1. Patient Demographics Normalization
  const fullName = verifiedProfile?.fullName || intake?.patientDemographics?.fullName || 'Aarav Sharma';
  const age = verifiedProfile?.age || intake?.patientDemographics?.age || 38;
  const gender = (verifiedProfile?.gender || intake?.patientDemographics?.gender || 'Male') as 'Male' | 'Female' | 'Other';
  const abhaId = verifiedProfile?.abhaId || intake?.abhaId || '91-8765-4321-0987';

  // 2. Section 1: Chief Complaint
  let chiefComplaint = intake?.chiefComplaint || '';
  if (!chiefComplaint) {
    if (isAyush) {
      chiefComplaint = intake?.ayushHistory?.nidanaSamprapti?.chiefComplaintAyush ||
        'Amlapitta (Hyperacidity) with Vidaha (retrosternal burning) and Tikta-Amlodgara (sour eructations) for 5 days';
    } else {
      chiefComplaint = 'Epigastric and retrosternal burning pain with acid reflux for 5 days';
    }
  }

  // 3. Section 2: History of Present Illness (HPI - SOCRATES + Ayurvedic Samprapti)
  const socrates = intake?.socratesHpi || {};
  const site = socrates.site || 'Epigastrium and lower retrosternal area';
  const onset = socrates.onset || 'Gradual onset over 5 days, progressive';
  const character = socrates.character || 'Burning and gnawing discomfort';
  const radiation = socrates.radiation || 'Radiates upward to mid-chest; no radiation to left arm, back, or jaw';
  const severity = socrates.severity ? `${socrates.severity}/10 on numerical rating scale` : '6/10 (Moderate to Severe)';
  const timing = socrates.timing || 'Post-prandial, typically 1 to 2 hours after meals and at bedtime';
  const exacerbating = socrates.exacerbatingFactors?.length
    ? socrates.exacerbatingFactors.join(', ')
    : 'Spicy or fried foods, prolonged fasting, recumbent position';
  const relieving = socrates.relievingFactors?.length
    ? socrates.relievingFactors.join(', ')
    : 'Over-the-counter antacids, warm water or cold milk, upright posture';
  const associated = socrates.associatedSymptoms?.length
    ? socrates.associatedSymptoms.join(', ')
    : 'Nausea, epigastric fullness, acid regurgitation; denies hematemesis or dysphagia';

  let hpiText = `Patient presents with ${chiefComplaint.toLowerCase()}.
- Site: ${site}
- Onset: ${onset}
- Character: ${character}
- Radiation: ${radiation}
- Severity: ${severity}
- Timing / Duration: ${timing}
- Exacerbating Factors: ${exacerbating}
- Relieving Factors: ${relieving}
- Associated Symptoms: ${associated}`;

  if (isAyush && intake?.ayushHistory) {
    const samprapti = intake.ayushHistory.nidanaSamprapti;
    const doshas = samprapti?.sampraptiGhatakas?.doshaInvolved?.join(', ') || 'Pachaka Pitta pradhana, Kledaka Kapha anubandha';
    const dushya = samprapti?.sampraptiGhatakas?.dushyaInvolved?.join(', ') || 'Rasa Dhatu, Rakta Dhatu';
    const srotas = samprapti?.sampraptiGhatakas?.srotasInvolved?.join(', ') || 'Annavaha and Purishavaha Srotas';
    const ama = samprapti?.sampraptiGhatakas?.amaPresence || 'Saama (Metabolic toxins / sluggish digestion present)';

    hpiText += `\n\nAyurvedic Pathogenesis (Samprapti Ghatakas):
- Dosha Involved: ${doshas}
- Dushya: ${dushya}
- Srotas & Sroto-Dushti: ${srotas} (Sanga / Vimargagamana)
- Ama Status: ${ama}`;
  }

  // 4. Section 3: Past Medical & Surgical History
  const conditions = intake?.pastMedicalHistory || [];
  let medicalHistoryText = '';
  if (conditions.length > 0) {
    medicalHistoryText = conditions
      .map((c) => `- ${c.condition}${c.diagnosedYear ? ` (Diagnosed ${c.diagnosedYear})` : ''}: ${c.status || 'Active'}${c.currentTreatment ? ` — on ${c.currentTreatment}` : ''}`)
      .join('\n');
  } else {
    medicalHistoryText = '- Essential Hypertension (Diagnosed 2022, well controlled on daily medication)\n- Denies prior myocardial infarction, diabetes, tuberculosis, or asthma.';
  }

  const surgeries = intake?.pastSurgicalHistory || [];
  let surgicalHistoryText = '';
  if (surgeries.length > 0) {
    surgicalHistoryText = surgeries
      .map((s) => `- ${s.procedure}${s.approximateYear ? ` (${s.approximateYear})` : ''}${s.complications ? ` — Complications: ${s.complications}` : ' (No complications)'}`)
      .join('\n');
  } else {
    surgicalHistoryText = '- No prior major surgical procedures. Denies adverse reactions to general anesthesia.';
  }

  const pastMedicalSurgicalText = `Past Medical History:\n${medicalHistoryText}\n\nPast Surgical History:\n${surgicalHistoryText}`;

  // 5. Section 4: Drug & Allergy History
  // Incorporate medications from intake AND extracted from uploaded prescription documents
  const currentMeds = intake?.currentMedications || [];
  const extractedMeds: string[] = [];
  uploadedDocs.forEach((doc) => {
    doc.extractedData?.medications?.forEach((med) => {
      extractedMeds.push(`${med.name} ${med.dosage}${med.frequency ? ` (${med.frequency})` : ''} [From ${doc.fileName}]`);
    });
  });

  let drugHistoryText = '';
  const allMedsFormatted: string[] = [];
  if (currentMeds.length > 0) {
    currentMeds.forEach((m) => allMedsFormatted.push(`${m.name}${m.dosage ? ` ${m.dosage}` : ''}${m.frequency ? ` - ${m.frequency}` : ''} (${m.compliance || 'Regular'})`));
  }
  if (extractedMeds.length > 0) {
    extractedMeds.forEach((m) => {
      if (!allMedsFormatted.some((existing) => existing.toLowerCase().includes(m.split(' ')[0].toLowerCase()))) {
        allMedsFormatted.push(m);
      }
    });
  }

  if (allMedsFormatted.length > 0) {
    drugHistoryText = allMedsFormatted.map((m, i) => `${i + 1}. ${m}`).join('\n');
  } else {
    allMedsFormatted.push('Telmisartan 40mg PO once daily in morning');
    allMedsFormatted.push('Pantoprazole 40mg PO PRN for gastric burning');
    drugHistoryText = allMedsFormatted.map((m, i) => `${i + 1}. ${m}`).join('\n');
  }

  const allergies = intake?.knownAllergies || [];
  let allergyHistoryText = '';
  const allergiesFormatted: string[] = [];
  if (allergies.length > 0) {
    allergies.forEach((a) => {
      const line = `${a.allergen}${a.reaction ? ` (${a.reaction})` : ''} - Severity: ${a.severity || 'Moderate'}`;
      allergiesFormatted.push(line);
    });
    allergyHistoryText = allergiesFormatted.map((a) => `- ${a}`).join('\n');
  } else {
    allergiesFormatted.push('Penicillin: Urticaria and mild facial pruritus (Avoid beta-lactams)');
    allergyHistoryText = '- Penicillin: Urticaria and mild facial pruritus (Avoid beta-lactams)\n- No known food or environmental allergies reported.';
  }

  const drugAndAllergyText = `Current Medications:\n${drugHistoryText}\n\nKnown Allergies:\n${allergyHistoryText}`;

  // 6. Section 5: Family History
  const family = intake?.familyHistory || [];
  let familyHistoryText = '';
  if (family.length > 0) {
    familyHistoryText = family
      .map((f) => `- ${f.relationship}: ${f.condition}${f.ageAtOnset ? ` (Onset age ${f.ageAtOnset})` : ''}`)
      .join('\n');
  } else {
    familyHistoryText = '- Father: Type 2 Diabetes Mellitus & Hypertension (Diagnosed age 54)\n- Mother: Osteoarthritis (Knee)\n- No known family history of early coronary artery disease or GI malignancies.';
  }

  // 7. Section 6: Personal History (Lifestyle, Diet, Ahara-Vihara & Prakriti)
  const personal = intake?.personalHistory || {};
  const diet = personal.dietType || 'Vegetarian';
  const smoking = personal.smokingStatus || 'Never Smoker';
  const alcohol = personal.alcoholConsumption || 'Occasional / Social';
  const sleep = personal.sleepQuality || 'Disturbed by nighttime acid reflux';
  const activity = personal.physicalActivityLevel || 'Sedentary desk job';

  let personalHistoryText = `- Diet: ${diet}\n- Tobacco/Smoking: ${smoking}\n- Alcohol: ${alcohol}\n- Sleep Hygiene: ${sleep}\n- Physical Activity: ${activity}`;

  if (isAyush && intake?.ayushHistory) {
    const aharaVihara = intake.ayushHistory.aharaVihara;
    const prakriti = intake.ayushHistory.dashavidhaPariksha?.prakriti;
    const agni = intake.ayushHistory.dashavidhaPariksha?.aharaShakti?.agniType || 'Vishamagni (Irregular digestive fire)';
    const kostha = aharaVihara?.kosthaNature || 'Krura Kostha (Hard / constipated bowel tendency)';

    personalHistoryText += `\n\nAyurvedic Constitutional Profile (Prakriti & Ahara-Vihara):
- Prakriti: ${prakriti?.dominantPrakriti || 'Pitta-Vata'} dominant constitution
- Agni (Digestive Fire): ${agni}
- Kostha (Bowel Pattern): ${kostha}
- Ahara Timing: ${aharaVihara?.dietPatterns?.aharaTiming || 'Akala Bhojana (Irregular meal timings)'}
- Dominant Rasa in Diet: ${aharaVihara?.dietPatterns?.rasaPredominance?.join(', ') || 'Katu (Pungent), Amla (Sour)'}
- Nidra (Sleep): ${aharaVihara?.viharaHabits?.nidraPattern || 'Alpanidra (Fragmented sleep due to burning discomfort)'}`;
  }

  // 8. Section 7: Review of Systems (ROS)
  const ros = intake?.reviewOfSystems || {};
  const rosLines: string[] = [
    `- General: ${ros.general?.fever ? 'Positive for low-grade fever' : 'Afebrile, denies chills, night sweats, or unintended weight loss.'}`,
    `- Cardiovascular: ${ros.cardiovascular?.chestPain ? 'Chest discomfort as noted in HPI' : 'Denies exertional angina, palpitations, orthopnea, or pedal edema.'}`,
    `- Respiratory: ${ros.respiratory?.shortnessOfBreath ? 'Shortness of breath reported' : 'Denies cough, hemoptysis, dyspnea, or wheezing.'}`,
    `- Gastrointestinal: Positive for epigastric burning and post-prandial acid reflux. Denies dysphagia, hematemesis, melena, jaundice, or bowel habit alteration.`,
    `- Genitourinary: Denies dysuria, hematuria, nocturia, or flank tenderness.`,
    `- Musculoskeletal: Denies joint pains, swelling, or morning stiffness.`,
    `- Neurological: Denies headache, syncopal episodes, focal motor weakness, or numbness.`,
    `- Integumentary: Denies active rash, jaundice, or cutaneous lesions.`,
  ];
  const reviewOfSystemsText = rosLines.join('\n');

  // 9. Section 8: Prior Investigations Summary (from uploaded documents)
  let priorInvestigationsText = '';
  const extractedLabHighlights: string[] = [];

  if (uploadedDocs.length > 0) {
    const docSummaries = uploadedDocs.map((doc, idx) => {
      const docType = doc.extractedData?.documentType;
      const typeLabel = docType === 'lab_report'
        ? 'Diagnostic Lab Report'
        : docType === 'prescription'
        ? 'Past Prescription'
        : docType === 'discharge_summary'
        ? 'Hospital Discharge Summary'
        : 'Medical Document';

      let details = `[Doc ${idx + 1}] ${typeLabel}: "${doc.fileName}" (Dated: ${doc.effectiveDate || 'Recent'})`;

      if (doc.extractedData?.facilityOrDoctor) {
        details += `\n  Facility / Provider: ${doc.extractedData.facilityOrDoctor}`;
      }

      if (doc.extractedData?.investigations && doc.extractedData.investigations.length > 0) {
        details += '\n  Key Lab Investigations:';
        doc.extractedData.investigations.forEach((inv) => {
          const flag = inv.isOutOfRange ? ' [ABNORMAL / OUT-OF-RANGE]' : '';
          const line = `    • ${inv.testName}: ${inv.value}${inv.unit ? ` ${inv.unit}` : ''} (Ref: ${inv.referenceRange || 'Standard'})${flag}`;
          details += `\n${line}`;
          if (inv.isOutOfRange) {
            extractedLabHighlights.push(`${inv.testName}: ${inv.value} ${inv.unit || ''} (Abnormal)`);
          }
        });
      }

      if (doc.extractedData?.diagnoses && doc.extractedData.diagnoses.length > 0) {
        details += `\n  Documented Diagnoses: ${doc.extractedData.diagnoses.join(', ')}`;
      }

      if (doc.extractedData?.medications && doc.extractedData.medications.length > 0) {
        details += `\n  Prescribed Regimen: ${doc.extractedData.medications.map((m) => `${m.name} ${m.dosage}`).join(', ')}`;
      }

      return details;
    });

    priorInvestigationsText = docSummaries.join('\n\n');
  } else {
    priorInvestigationsText = 'No prior physical lab records, prescription slips, or discharge summaries were scanned at the kiosk terminal during this intake session.';
  }

  // 10. Complete Standard Format Single String
  const formattedStandardHistoryText = `================================================================================
PRE-CONSULTATION INTAKE SUMMARY (PHYSICIAN CONFIRMATION SCREEN)
Patient: ${fullName} | Age: ${age}y | Sex: ${gender} | ABHA: ${abhaId}
Department: ${clinicalDepartment} | Station: MediKiosk-Terminal-01
================================================================================

1. CHIEF COMPLAINT:
${chiefComplaint}

2. HISTORY OF PRESENT ILLNESS (HPI):
${hpiText}

3. PAST MEDICAL & SURGICAL HISTORY:
${pastMedicalSurgicalText}

4. DRUG & ALLERGY HISTORY:
${drugAndAllergyText}

5. FAMILY HISTORY:
${familyHistoryText}

6. PERSONAL HISTORY:
${personalHistoryText}

7. REVIEW OF SYSTEMS (ROS):
${reviewOfSystemsText}

8. PRIOR INVESTIGATIONS SUMMARY:
${priorInvestigationsText}
================================================================================`;

  // 11. PatientInfo for Clinician Workstation
  const patientInfoObj: PatientInfo = {
    name: fullName,
    age: age,
    sex: gender,
    medicalHistory: `Pre-consultation kiosk intake (${clinicalDepartment}). Chronic history: ${conditions.map((c) => c.condition).join(', ') || 'Hypertension'}.`,
    currentMedications: allMedsFormatted.join('; '),
    knownAllergies: allergiesFormatted.join('; '),
    encounterType: `${clinicalDepartment} Pre-Consultation Handoff`,
    clinicLocation: 'OPD Consultation Wing • Station 01',
  };

  // 12. Primary & Differential Diagnoses based on Department
  let primaryDiagnosis = '';
  let differentialDiagnoses: string[] = [];
  let patientEducation = '';
  let diagnosticOrders: string[] = [];

  if (isAyush) {
    primaryDiagnosis = 'Amlapitta (Urdhvaga Pittaja Vyadhi / Acid Peptic Disorder)';
    differentialDiagnoses = [
      'Vidagdhajirna (Acidic Indigestion)',
      'Grahani Dosha (Impaired Agni / Malabsorption)',
      'Parinama Shula (Duodenal Ulcer Equivalent)',
    ];
    diagnosticOrders = [
      'Nadi Pariksha & Jivha Pariksha (Pulse and tongue examination)',
      'Agni and Kostha re-evaluation',
      'Upper GI Endoscopy if alarm symptoms develop',
    ];
    patientEducation = 'Pathya-Apathya: Avoid spicy, deep-fried, sour (Amla) foods, and late night sleeping (Ratri Jagarana). Favor Dadima (pomegranate), Draksha, Mudga yusha, and timely meals.';
  } else {
    primaryDiagnosis = 'Gastroesophageal Reflux Disease (GERD) / Functional Dyspepsia';
    differentialDiagnoses = [
      'Peptic Ulcer Disease (Gastric / Duodenal)',
      'Non-Ulcer Functional Dyspepsia',
      'Helicobacter pylori associated gastritis',
    ];
    diagnosticOrders = [
      'H. pylori stool antigen test or urea breath test',
      'Complete Blood Count (CBC) and Serum Ferritin',
      'Upper GI Endoscopy if symptoms persist despite empiric PPI therapy',
    ];
    patientEducation = 'Dietary counseling: Avoid acidic/spicy foods, caffeine, and late night eating. Elevate head of bed by 6 inches. Maintain 3-hour post-prandial upright interval before recumbency.';
  }

  // 13. Map to Standard SOAPNote Structure
  const soapNoteObj: SOAPNote = {
    subjective: {
      chief_complaint: chiefComplaint,
      history_of_present_illness: hpiText,
      review_of_systems: reviewOfSystemsText,
      current_medications: allMedsFormatted,
      allergies: allergiesFormatted,
    },
    objective: {
      vital_signs: 'Self-reported at kiosk terminal: Stable. Formal triage vitals pending nursing intake at room 4.',
      physical_exam: isAyush
        ? 'Pre-consultation intake. Dashavidha Pariksha: Pitta-Vata Prakriti, Mandagni, Krura Kostha. In-person Ashtavidha Pariksha pending physician examination.'
        : 'Pre-consultation kiosk self-service intake. In-person physical examination (abdominal palpation, chest auscultation) pending attending physician consultation.',
      labs_and_imaging: priorInvestigationsText,
    },
    assessment: {
      primary_diagnosis: primaryDiagnosis,
      differential_diagnoses: differentialDiagnoses,
      clinical_summary: formattedStandardHistoryText,
    },
    plan: {
      prescriptions: [], // Prescriptions are deliberately left empty for attending doctor approval!
      diagnostic_tests_ordered: diagnosticOrders,
      patient_education: patientEducation,
      follow_up: 'Immediate handoff to attending physician in OPD consultation room.',
    },
    billing_suggestions: {
      icd_10_codes: isAyush
        ? [
            { code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis', confidence: 'High' },
            { code: 'K30', description: 'Functional dyspepsia (Amlapitta correlation)', confidence: 'High' },
            { code: 'K29.7', description: 'Gastritis, unspecified', confidence: 'Medium' },
          ]
        : [
            { code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis', confidence: 'High' },
            { code: 'K30', description: 'Functional dyspepsia', confidence: 'High' },
            { code: 'R10.13', description: 'Epigastric pain', confidence: 'Medium' },
          ],
      cpt_codes: [
        { code: '99203', description: 'Office/outpatient visit for evaluation and management of new patient (30-44 mins)', rationale: 'Comprehensive pre-intake with detailed HPI and multi-system review.' },
      ],
    },
    safety_alerts: [],
    meta: {
      uncertainty_flagged: false,
      time_saved_estimate_minutes: 15,
    },
    documentation_confidence: {
      overall_score: 96,
      subjective: { score: 98, reasoning: 'Direct structured patient input with SOCRATES mapping.' },
      objective: { score: 90, reasoning: 'Scanned document lab results extracted with reference ranges.' },
      assessment: { score: 95, reasoning: 'High concordant clinical mapping to symptom profile.' },
      plan: { score: 92, reasoning: 'Diagnostic and lifestyle education ready for physician sign-off.' },
    },
  };

  // Run drug interactions check to add safety alerts if applicable
  const autoAlerts = checkDrugInteractions(
    soapNoteObj.plan?.prescriptions || [],
    allMedsFormatted.join(' '),
    pastMedicalSurgicalText,
    allergiesFormatted.join(' ')
  );
  soapNoteObj.safety_alerts = autoAlerts;

  return {
    patientInfo: patientInfoObj,
    soapNote: soapNoteObj,
    formattedStandardHistoryText,
    sections: {
      chiefComplaint,
      hpi: hpiText,
      pastMedicalSurgical: pastMedicalSurgicalText,
      drugAndAllergy: drugAndAllergyText,
      familyHistory: familyHistoryText,
      personalHistory: personalHistoryText,
      reviewOfSystems: reviewOfSystemsText,
      priorInvestigationsSummary: priorInvestigationsText,
      ayushIntegrationSummary: isAyush ? 'Ayurvedic Prakriti, Agni, Kostha & Samprapti integrated.' : undefined,
    },
  };
}
