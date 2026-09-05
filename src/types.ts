export interface PatientInfo {
  id?: string;
  name: string;
  age: number | string;
  sex?: 'Male' | 'Female' | 'Other' | string;
  gender?: string;
  medicalHistory?: string;
  currentMedications?: string;
  knownAllergies?: string;
  encounterType?: string; // e.g. "Routine Follow-up", "Acute Visit", "Antenatal Care"
  clinicLocation?: string;
}

export interface Prescription {
  medication: string;
  dosage: string;
  frequency: string;
  instructions: string;
  duration?: string;
}

export interface Subjective {
  chief_complaint: string;
  history_of_present_illness: string;
  review_of_systems?: string;
  current_medications: string[];
  allergies: string[];
}

export interface Objective {
  vital_signs: string;
  physical_exam: string;
  labs_and_imaging: string;
}

export interface Assessment {
  primary_diagnosis: string;
  differential_diagnoses: string[];
  clinical_summary: string;
}

export interface Plan {
  prescriptions: Prescription[];
  diagnostic_tests_ordered: string[];
  patient_education: string;
  follow_up: string;
}

export interface ICD10Code {
  code: string;
  description: string;
  confidence: 'High' | 'Medium' | 'Low';
}

export interface CPTCode {
  code: string;
  description: string;
  rationale: string;
}

export interface BillingSuggestions {
  icd_10_codes: ICD10Code[];
  cpt_codes: CPTCode[];
}

export interface SafetyAlert {
  type: 'Drug Interaction' | 'Allergy Alert' | 'Missing Info' | 'Red Flag' | string;
  severity: 'High' | 'Medium' | 'Low';
  message: string;
}

export interface MetaInfo {
  uncertainty_flagged: boolean;
  time_saved_estimate_minutes: number;
}

export interface SectionDocumentationScore {
  score: number; // 0 - 100 percentage score representing transcript support & detail completeness
  reasoning: string;
  missing_information?: string[];
}

export interface DocumentationConfidence {
  overall_score: number;
  subjective: SectionDocumentationScore;
  objective: SectionDocumentationScore;
  assessment: SectionDocumentationScore;
  plan: SectionDocumentationScore;
}

export interface SOAPNote {
  subjective: Subjective;
  objective: Objective;
  assessment: Assessment;
  plan: Plan;
  billing_suggestions?: BillingSuggestions;
  safety_alerts?: SafetyAlert[];
  meta?: MetaInfo;
  documentation_confidence?: DocumentationConfidence;
}

export interface EncounterRecord {
  id: string;
  timestamp: string;
  patientInfo: PatientInfo;
  transcript: string;
  soapNote: SOAPNote;
  status: 'draft' | 'finalized';
  notesEdited?: boolean;
}

export interface SampleScenario {
  id: string;
  title: string;
  category: string;
  description: string;
  patientInfo: PatientInfo;
  transcript: string;
}

// ==========================================
// STRUCTURED CLINICAL INTAKE (SOCRATES + DISCRETE MEDICAL HISTORY)
// ==========================================

/**
 * SOCRATES Framework for Pain & Symptom Analysis:
 * Site: Location of the symptom
 * Onset: When did it start? Was it sudden or gradual?
 * Character: Nature of pain/symptom (sharp, dull, burning, aching, throbbing, etc.)
 * Radiation: Does it spread/radiate anywhere?
 * Associated symptoms: Other symptoms (nausea, vomiting, dyspnea, fever, diaphoresis)
 * Timing / Duration: Constant, intermittent, fluctuating, frequency
 * Exacerbating / Aggravating factors: What worsens it
 * Relieving factors: What improves it (rest, medications, position)
 * Severity: 1-10 numerical scale or Mild/Moderate/Severe
 */
export interface SocratesHPI {
  site?: string;
  onset?: string;
  character?: string;
  radiation?: string;
  associatedSymptoms?: string[];
  timing?: string;
  exacerbatingFactors?: string[];
  relievingFactors?: string[];
  severity?: number | string; // 1-10 scale or 'Mild' | 'Moderate' | 'Severe'
  progression?: 'Improving' | 'Worsening' | 'Static' | 'Fluctuating' | string;
}

/**
 * Discrete Past Medical History Entry
 */
export interface DiscreteMedicalCondition {
  condition: string;
  diagnosedYear?: string | number;
  status: 'Active' | 'Resolved' | 'Controlled' | 'Unknown';
  currentTreatment?: string;
  notes?: string;
}

/**
 * Discrete Past Surgical History Entry
 */
export interface DiscreteSurgery {
  procedure: string;
  approximateYear?: string | number;
  hospitalOrSurgeon?: string;
  complications?: string;
}

/**
 * Discrete Family History Entry
 */
export interface DiscreteFamilyHistory {
  relationship: 'Father' | 'Mother' | 'Sibling' | 'Maternal Grandparent' | 'Paternal Grandparent' | 'Child' | 'Other' | string;
  condition: string;
  ageAtOnset?: number | string;
  notes?: string;
}

/**
 * Discrete Personal & Social History
 */
export interface PersonalSocialHistory {
  smokingStatus?: 'Never' | 'Former' | 'Current Smoker' | 'Tobacco Chewer (Gutkha/Khaini)' | 'Unknown';
  alcoholConsumption?: 'Never' | 'Occasional' | 'Moderate' | 'Heavy' | 'Former' | 'Unknown';
  dietType?: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Eggetarian' | 'Jain' | string;
  occupation?: string;
  physicalActivityLevel?: 'Sedentary' | 'Light' | 'Moderate' | 'Vigorous';
  sleepQuality?: 'Good' | 'Fair' | 'Insomnia / Disturbed' | 'Poor';
}

/**
 * Review of Systems (ROS) Structured Checklist
 */
export interface ReviewOfSystemsChecklist {
  general?: {
    fever?: boolean;
    chills?: boolean;
    weightLoss?: boolean;
    fatigue?: boolean;
    nightSweats?: boolean;
  };
  cardiovascular?: {
    chestPain?: boolean;
    palpitations?: boolean;
    orthopnea?: boolean;
    edemaOrSwelling?: boolean;
  };
  respiratory?: {
    shortnessOfBreath?: boolean;
    cough?: boolean;
    wheezing?: boolean;
    hemoptysis?: boolean;
    sputumProduction?: boolean;
  };
  gastrointestinal?: {
    abdominalPain?: boolean;
    nauseaOrVomiting?: boolean;
    heartburnOrAcidReflux?: boolean;
    diarrhea?: boolean;
    constipation?: boolean;
    lossOfAppetite?: boolean;
  };
  genitourinary?: {
    dysuriaOrPainfulUrination?: boolean;
    increasedFrequency?: boolean;
    hematuria?: boolean;
  };
  musculoskeletal?: {
    jointPain?: boolean;
    jointSwelling?: boolean;
    muscleAches?: boolean;
    stiffness?: boolean;
  };
  neurological?: {
    headache?: boolean;
    dizziness?: boolean;
    numbnessOrTingling?: boolean;
    weakness?: boolean;
    alteredSensorium?: boolean;
  };
  integumentary?: {
    rash?: boolean;
    itching?: boolean;
    skinLesions?: boolean;
  };
  otherNotes?: string[];
}

/**
 * Discrete Medication
 */
export interface DiscreteMedication {
  name: string;
  dosage?: string;
  frequency?: string;
  purpose?: string;
  compliance?: 'Regular' | 'Irregular' | 'Discontinued';
}

/**
 * Discrete Allergy
 */
export interface DiscreteAllergy {
  allergen: string;
  allergyType?: 'Drug' | 'Food' | 'Environmental' | 'Other';
  reaction?: string;
  severity?: 'Mild' | 'Moderate' | 'Severe (Anaphylaxis)';
}

/**
 * Single turn in the conversational intake interview
 */
export interface InterviewTurn {
  turnNumber: number;
  timestamp: string;
  question: string;
  questionCategory: string;
  answer: string;
  inputMode: 'voice' | 'touch_pill' | 'scale' | 'typed';
  optionsProvided?: string[];
}

/**
 * Complete Structured Patient Intake Model
 * Collected by MediKiosk pre-consultation engine and feeds into downstream clinical summaries.
 */
export interface StructuredPatientIntake {
  intakeId: string;
  startedAt: string;
  completedAt?: string;
  abhaId?: string;
  patientDemographics: {
    fullName: string;
    age: number | string;
    gender: string;
    mobile?: string;
    state?: string;
  };
  chiefComplaint: string;
  socratesHpi: SocratesHPI;
  pastMedicalHistory: DiscreteMedicalCondition[];
  pastSurgicalHistory: DiscreteSurgery[];
  familyHistory: DiscreteFamilyHistory[];
  personalHistory: PersonalSocialHistory;
  reviewOfSystems: ReviewOfSystemsChecklist;
  currentMedications: DiscreteMedication[];
  knownAllergies: DiscreteAllergy[];
  conversationTurns: InterviewTurn[];
  triageClassification?: 'Green (Routine)' | 'Yellow (Priority)' | 'Red (Immediate Emergency)';
  redFlagsDetected: string[];
  isComplete: boolean;
}

/**
 * Response format for Gemini per-turn adaptive question endpoint
 */
export interface AdaptiveInterviewTurnResponse {
  question: string;
  category:
    | 'chief_complaint'
    | 'socrates_onset'
    | 'socrates_character'
    | 'socrates_radiation'
    | 'socrates_severity'
    | 'socrates_associated'
    | 'socrates_timing'
    | 'socrates_exacerbating_relieving'
    | 'past_history'
    | 'medications_allergies'
    | 'review_of_systems'
    | 'conclusion';
  suggestedOptions: string[];
  inputType: 'choice_or_voice' | 'scale_1_to_10' | 'yes_no';
  extractedData?: {
    socratesPatch?: Partial<SocratesHPI>;
    chiefComplaint?: string;
    pastConditions?: string[];
    medications?: string[];
    allergies?: string[];
    rosFlags?: Record<string, boolean>;
  };
  redFlags?: string[];
  triagePriority?: 'routine' | 'urgent' | 'emergency';
  isComplete: boolean;
  clinicalSummarySoFar?: string;
}

