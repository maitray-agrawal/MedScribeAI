import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import {
  SocratesHPI,
  InterviewTurn,
  StructuredPatientIntake,
  AdaptiveInterviewTurnResponse,
  AYUSHHistory,
  DoshaType,
} from '../../types';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertOctagon,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Activity,
  Send,
  RotateCcw,
  Sliders,
  ChevronDown,
  ChevronUp,
  Leaf,
  Building2,
} from 'lucide-react';

export interface InterviewEngineProps {
  patientDemographics?: {
    fullName: string;
    age: number | string;
    gender: string;
    abhaId?: string;
  };
  clinicalDepartment?: 'Allopathic' | 'Ayurveda (AYUSH)';
  initialIntake?: StructuredPatientIntake | null;
  onComplete: (intake: StructuredPatientIntake) => void;
  onBackToConsent?: () => void;
}

export const InterviewEngine: React.FC<InterviewEngineProps> = ({
  patientDemographics = {
    fullName: 'Patient',
    age: 42,
    gender: 'Male',
    abhaId: '91-8765-4321-0987',
  },
  clinicalDepartment = 'Allopathic',
  initialIntake,
  onComplete,
  onBackToConsent,
}) => {
  const { language } = useTranslation();
  const isSpanish = language === 'es';
  const isAyurveda = clinicalDepartment === 'Ayurveda (AYUSH)';

  // Accumulated Clinical Intake State
  const [turns, setTurns] = useState<InterviewTurn[]>(initialIntake?.conversationTurns || []);
  const [chiefComplaint, setChiefComplaint] = useState<string>(initialIntake?.chiefComplaint || '');
  const [socratesHpi, setSocratesHpi] = useState<SocratesHPI>(initialIntake?.socratesHpi || {});
  const [ayushHistory, setAyushHistory] = useState<AYUSHHistory>(
    initialIntake?.ayushHistory || {
      department: 'Ayurveda (AYUSH)',
      facilityStandard: 'Ministry of AYUSH / AIIA Outpatient Guidelines',
      recordedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dashavidhaPariksha: {
        prakriti: {},
        vikriti: {},
        sara: {},
        samhanana: {},
        pramana: {},
        satmya: {},
        sattva: {},
        aharaShakti: {},
        vyayamaShakti: {},
        vaya: {},
      },
      aharaVihara: {
        dietPatterns: {},
        viharaHabits: {},
      },
      nidanaSamprapti: {
        identifiedNidana: {},
        sampraptiGhatakas: {},
      },
    }
  );
  const [redFlags, setRedFlags] = useState<string[]>(initialIntake?.redFlagsDetected || []);
  const [triagePriority, setTriagePriority] = useState<'routine' | 'urgent' | 'emergency'>('routine');

  // Current Turn Engine State
  const [currentQuestionData, setCurrentQuestionData] = useState<AdaptiveInterviewTurnResponse | null>(null);
  const [isLoadingNextQuestion, setIsLoadingNextQuestion] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Input states (Voice, Touch, Scale, Custom text)
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedInput, setTypedInput] = useState<string>('');
  const [severityRating, setSeverityRating] = useState<number>(6);
  const [showCustomText, setShowCustomText] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Speech Recognition (Web Speech API)
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceInterimText, setVoiceInterimText] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  // Text to Speech (SpeechSynthesis)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Initial Question Fetch on Mount
  useEffect(() => {
    if (turns.length === 0) {
      fetchNextQuestion([]);
    } else if (!currentQuestionData) {
      fetchNextQuestion(turns);
    }
  }, []);

  // Stop active speech recognition & speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Fetch next question from Gemini server route
  const fetchNextQuestion = async (existingTurns: InterviewTurn[]) => {
    setIsLoadingNextQuestion(true);
    setErrorMessage(null);
    setSelectedOption(null);
    setTypedInput('');
    setVoiceInterimText('');
    setShowCustomText(false);

    try {
      const res = await fetch('/api/kiosk/interview-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientDemographics,
          language,
          department: clinicalDepartment,
          clinicalDepartment,
          turns: existingTurns,
          chiefComplaint,
          socratesHpi,
          ayushHistory,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: AdaptiveInterviewTurnResponse = await res.json();
      setCurrentQuestionData(data);

      if (data.redFlags && data.redFlags.length > 0) {
        setRedFlags((prev) => Array.from(new Set([...prev, ...(data.redFlags || [])])));
      }
      if (data.triagePriority) {
        setTriagePriority(data.triagePriority);
      }
    } catch (err: any) {
      console.error('Failed to load adaptive clinical question:', err);
      setErrorMessage('Could not load next clinical question. You may retry or finish the interview.');
    } finally {
      setIsLoadingNextQuestion(false);
    }
  };

  // Text-To-Speech for Current Question
  const speakCurrentQuestion = (text?: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !window.speechSynthesis) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const questionToSpeak = text || currentQuestionData?.question;
    if (!questionToSpeak) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(questionToSpeak);
    utterance.rate = 0.95;
    utterance.lang = isSpanish ? 'es-ES' : 'en-IN';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Web Speech API Voice Dictation
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        isSpanish
          ? 'El reconocimiento de voz no es compatible con este navegador. Por favor seleccione una opción tocando la pantalla.'
          : 'Speech recognition is not supported in this browser. Please tap an option on screen.'
      );
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = isSpanish ? 'es-ES' : 'en-IN';

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          interim += event.results[i][0].transcript;
        }
        setVoiceInterimText(interim);
        setTypedInput(interim);
      };

      recognition.onerror = (event: any) => {
        console.error('Kiosk voice recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err);
      setIsRecording(false);
    }
  };

  // Process & Advance to next turn
  const handleAnswerSubmit = (chosenAnswer?: string, mode: 'touch_pill' | 'voice' | 'scale' | 'typed' = 'touch_pill') => {
    if (isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsRecording(false);
    }

    if (isSpeaking && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const finalAnswer = (chosenAnswer || typedInput || (currentQuestionData?.inputType === 'scale_1_to_10' ? `${severityRating}/10` : selectedOption) || '').trim();

    if (!finalAnswer) {
      return;
    }

    const category = currentQuestionData?.category || 'general';

    // Update internal SOCRATES and AYUSH states
    const updatedSocrates: SocratesHPI = { ...socratesHpi };
    const updatedAyush: AYUSHHistory = { ...ayushHistory };
    let updatedChiefComplaint = chiefComplaint;

    if (isAyurveda) {
      if (category === 'ayush_chief_complaint' || category === 'chief_complaint' || turns.length === 0) {
        updatedChiefComplaint = finalAnswer;
        setChiefComplaint(finalAnswer);
        updatedAyush.nidanaSamprapti = {
          ...updatedAyush.nidanaSamprapti,
          chiefComplaintAyush: finalAnswer,
        };
        updatedSocrates.site = finalAnswer;
      } else if (category === 'ayush_prakriti') {
        const parts = finalAnswer.split(':');
        const rawDominant = parts[0]?.trim() || '';
        const dominant: DoshaType =
          rawDominant.includes('Vata-Pitta') ? 'Vata-Pitta' :
          rawDominant.includes('Pitta-Kapha') ? 'Pitta-Kapha' :
          rawDominant.includes('Vata-Kapha') ? 'Vata-Kapha' :
          rawDominant.includes('Vata') ? 'Vata' :
          rawDominant.includes('Pitta') ? 'Pitta' :
          rawDominant.includes('Kapha') ? 'Kapha' : 'Tridoshaja / Samadosha';

        updatedAyush.dashavidhaPariksha = {
          ...updatedAyush.dashavidhaPariksha,
          prakriti: {
            dominantPrakriti: dominant,
            observations: finalAnswer,
          },
        };
      } else if (category === 'ayush_vikriti') {
        const parts = finalAnswer.split(':');
        const rawDosha = parts[0]?.trim() || '';
        const doshaVal: 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha' | 'Sannipata' =
          rawDosha.includes('Vata-Pitta') ? 'Vata-Pitta' :
          rawDosha.includes('Pitta-Kapha') ? 'Pitta-Kapha' :
          rawDosha.includes('Vata-Kapha') ? 'Vata-Kapha' :
          rawDosha.includes('Vata') ? 'Vata' :
          rawDosha.includes('Pitta') ? 'Pitta' :
          rawDosha.includes('Kapha') ? 'Kapha' : 'Sannipata';

        updatedAyush.dashavidhaPariksha = {
          ...updatedAyush.dashavidhaPariksha,
          vikriti: {
            aggravatedDosha: [doshaVal],
            manifestations: [finalAnswer],
          },
        };
      } else if (category === 'ayush_ahara_shakti_agni') {
        const agni = finalAnswer.includes('Samagni')
          ? 'Samagni (Balanced digestive fire)' as const
          : finalAnswer.includes('Tikshnagni')
          ? 'Tikshnagni (Excessive / Intense fire)' as const
          : finalAnswer.includes('Mandagni')
          ? 'Mandagni (Low / Slow fire)' as const
          : 'Vishamagni (Variable / Irregular fire)' as const;
        updatedAyush.dashavidhaPariksha = {
          ...updatedAyush.dashavidhaPariksha,
          aharaShakti: {
            ...updatedAyush.dashavidhaPariksha?.aharaShakti,
            agniType: agni,
            abhyavaharanaShakti: 'Madhyama (Average intake)',
          },
        };
      } else if (category === 'ayush_kostha_ahara') {
        const kostha = finalAnswer.includes('Krura')
          ? 'Krura Kostha (Hard stools / Constipated tendency)' as const
          : finalAnswer.includes('Mridu')
          ? 'Mridu Kostha (Loose stools / Rapid evacuation)' as const
          : 'Madhyama Kostha (Regular normal bowel movement)' as const;
        updatedAyush.aharaVihara = {
          ...updatedAyush.aharaVihara,
          kosthaNature: kostha,
        };
      } else if (category === 'ayush_vihara_nidra') {
        const nidra = finalAnswer.toLowerCase().includes('sukha') || finalAnswer.toLowerCase().includes('sound')
          ? 'Sukha Nidra (Sound restful sleep)' as const
          : finalAnswer.toLowerCase().includes('atinidra') || finalAnswer.toLowerCase().includes('excessive')
          ? 'Atinidra (Excessive sleep / Drowsiness)' as const
          : 'Alpanidra / Anidra (Disturbed / Insomnia)' as const;
        updatedAyush.aharaVihara = {
          ...updatedAyush.aharaVihara,
          viharaHabits: {
            ...updatedAyush.aharaVihara?.viharaHabits,
            nidraPattern: nidra,
            ratriJagarana: finalAnswer.toLowerCase().includes('jagarana') || finalAnswer.toLowerCase().includes('late'),
          },
        };
      } else if (category === 'ayush_sattva_vyayama') {
        const sattvaLevel = finalAnswer.includes('Pravara')
          ? 'Pravara Sattva (High psychic endurance / Calm & Resilient)' as const
          : finalAnswer.includes('Madhyama')
          ? 'Madhyama Sattva (Moderate psychic endurance)' as const
          : 'Avara Sattva (Low endurance / Anxious & Vulnerable)' as const;
        const vyayamaLevel = finalAnswer.includes('Pravara')
          ? 'Pravara (High physical stamina)' as const
          : finalAnswer.includes('Madhyama')
          ? 'Madhyama (Moderate endurance)' as const
          : 'Avara (Poor / Quickly fatigued)' as const;
        updatedAyush.dashavidhaPariksha = {
          ...updatedAyush.dashavidhaPariksha,
          sattva: {
            resilienceLevel: sattvaLevel,
          },
          vyayamaShakti: {
            capacityLevel: vyayamaLevel,
            dailyExertionLevel: finalAnswer,
          },
        };
      }
      setAyushHistory(updatedAyush);
    }

    if (category === 'chief_complaint' || turns.length === 0) {
      updatedChiefComplaint = finalAnswer;
      setChiefComplaint(finalAnswer);
      updatedSocrates.site = finalAnswer;
    } else if (category === 'socrates_onset') {
      updatedSocrates.onset = finalAnswer;
    } else if (category === 'socrates_character') {
      updatedSocrates.character = finalAnswer;
    } else if (category === 'socrates_radiation') {
      updatedSocrates.radiation = finalAnswer;
    } else if (category === 'socrates_severity') {
      updatedSocrates.severity = finalAnswer;
    } else if (category === 'socrates_associated') {
      const existing = updatedSocrates.associatedSymptoms || [];
      updatedSocrates.associatedSymptoms = [...existing, finalAnswer];
    } else if (category === 'socrates_timing') {
      updatedSocrates.timing = finalAnswer;
    } else if (category === 'socrates_exacerbating_relieving') {
      const existing = updatedSocrates.relievingFactors || [];
      updatedSocrates.relievingFactors = [...existing, finalAnswer];
    }

    setSocratesHpi(updatedSocrates);

    // Record turn
    const newTurn: InterviewTurn = {
      turnNumber: turns.length + 1,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      question: currentQuestionData?.question || 'Clinical Inquiry',
      questionCategory: category,
      answer: finalAnswer,
      inputMode: mode,
      optionsProvided: currentQuestionData?.suggestedOptions,
    };

    const newTurns = [...turns, newTurn];
    setTurns(newTurns);

    // Check if finished or if Gemini signaled isComplete
    if (currentQuestionData?.isComplete || newTurns.length >= 7) {
      compileAndFinish(newTurns, updatedSocrates, updatedChiefComplaint, updatedAyush);
    } else {
      fetchNextQuestion(newTurns);
    }
  };

  // Compile final structured intake model
  const compileAndFinish = (
    finalTurns: InterviewTurn[],
    finalHpi: SocratesHPI,
    finalComplaint: string,
    finalAyush?: AYUSHHistory
  ) => {
    const activeAyush = finalAyush || ayushHistory;
    const intake: StructuredPatientIntake = {
      intakeId: `INT-${Date.now()}`,
      startedAt: turns[0]?.timestamp || new Date().toLocaleTimeString(),
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      clinicalDepartment: clinicalDepartment === 'Ayurveda (AYUSH)' ? 'Ayurveda (AYUSH)' : 'Allopathic',
      abhaId: patientDemographics.abhaId,
      patientDemographics: {
        fullName: patientDemographics.fullName,
        age: patientDemographics.age,
        gender: patientDemographics.gender,
      },
      chiefComplaint: finalComplaint || (isAyurveda ? 'Ayurveda OPD consultation intake' : 'Primary consultation intake'),
      socratesHpi: finalHpi,
      ayushHistory: isAyurveda ? activeAyush : undefined,
      pastMedicalHistory: [],
      pastSurgicalHistory: [],
      familyHistory: [],
      personalHistory: {
        dietType: isAyurveda ? 'Vegetarian / Ayurvedic Pathya' : 'Vegetarian',
      },
      reviewOfSystems: {
        cardiovascular: {
          chestPain: finalComplaint.toLowerCase().includes('chest') || (finalHpi.character || '').includes('Pressure'),
        },
      },
      currentMedications: [],
      knownAllergies: [],
      conversationTurns: finalTurns,
      triageClassification:
        redFlags.length > 0 || triagePriority === 'emergency'
          ? 'Red (Immediate Emergency)'
          : triagePriority === 'urgent'
          ? 'Yellow (Priority)'
          : 'Green (Routine)',
      redFlagsDetected: redFlags,
      isComplete: true,
    };

    onComplete(intake);
  };

  // Step back to previous turn
  const handleUndoPreviousTurn = () => {
    if (turns.length === 0) {
      if (onBackToConsent) {
        onBackToConsent();
      }
      return;
    }

    const revisedTurns = turns.slice(0, turns.length - 1);
    setTurns(revisedTurns);
    fetchNextQuestion(revisedTurns);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      {/* Emergency Red-Flag Banner */}
      {redFlags.length > 0 && (
        <div className="w-full mb-6 p-4 rounded-3xl bg-red-950/80 border-2 border-red-500 text-red-200 flex items-start gap-4 shadow-2xl animate-pulse">
          <div className="p-2.5 rounded-2xl bg-red-600 text-white shrink-0">
            <AlertOctagon className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-red-500 text-slate-950 font-black text-xs uppercase tracking-wider">
                Emergency Alert
              </span>
              <h4 className="font-extrabold text-white text-base">Potential Clinical Red Flag Detected</h4>
            </div>
            <p className="text-xs sm:text-sm text-red-200 mt-1 leading-relaxed">
              {redFlags.join('. ')}. Kiosk triage has flagged this encounter for high priority. If you feel dizzy, severely breathless, or experiencing crushing chest pain, please notify clinic staff immediately.
            </p>
          </div>
        </div>
      )}

      {/* Progress & Breadcrumb */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-4 px-2">
        <div className="flex flex-wrap items-center gap-2">
          {isAyurveda ? (
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ayurveda OPD • Dashavidha Pariksha</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Allopathic OPD • SOCRATES Intake</span>
            </span>
          )}
          <span className="px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>Question {turns.length + 1} of ~7</span>
          </span>
          {currentQuestionData?.category && (
            <span className="hidden sm:inline px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono font-bold">
              {currentQuestionData.category.replace(/_/g, ' ').toUpperCase()}
            </span>
          )}
        </div>

        {turns.length > 0 && (
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs font-bold text-slate-400 hover:text-teal-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{showHistory ? 'Hide History' : `History (${turns.length})`}</span>
            {showHistory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Collapsible History Drawer */}
      {showHistory && turns.length > 0 && (
        <div className="w-full mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2.5 max-h-56 overflow-y-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Responses Recorded So Far:
          </span>
          {turns.map((t, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
              <span className="text-slate-400 font-bold block mb-0.5">
                Q{idx + 1}: {t.question}
              </span>
              <span className="text-teal-300 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.answer}</span>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Primary Question Stage Card */}
      <div className="w-full bg-slate-900/95 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm flex flex-col gap-6 relative">
        {isLoadingNextQuestion ? (
          <div className="py-16 flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="w-12 h-12 text-teal-400 animate-spin" />
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-black text-white">Formulating Next Clinical Inquiry...</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xs">
                Adaptive clinical engine analyzing prior responses using SOCRATES framework
              </p>
            </div>
          </div>
        ) : errorMessage ? (
          <div className="py-8 flex flex-col items-center justify-center gap-4 text-center">
            <AlertOctagon className="w-10 h-10 text-amber-400" />
            <p className="text-sm text-slate-300">{errorMessage}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => fetchNextQuestion(turns)}
                className="px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-sm"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={() => compileAndFinish(turns, socratesHpi, chiefComplaint)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-sm"
              >
                Proceed to Documents
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* The Active Question */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex-1">
                <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
                  {currentQuestionData?.question ||
                    (isSpanish
                      ? '¿Cuál es su síntoma principal el día de hoy?'
                      : 'What is your main health concern today?')}
                </h2>
                <span className="text-xs text-slate-400 mt-1 block">
                  Tap an answer below, speak your answer into the microphone, or rate on the scale.
                </span>
              </div>

              {/* Text-To-Speech Listen Button */}
              <button
                id="kiosk-listen-question-btn"
                type="button"
                onClick={() => speakCurrentQuestion()}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer shrink-0 flex items-center justify-center ${
                  isSpeaking
                    ? 'bg-amber-500/30 border-amber-400 text-amber-300 ring-2 ring-amber-400/40 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-teal-400 hover:text-white'
                }`}
                title="Read question aloud"
                aria-label="Listen to question"
              >
                {isSpeaking ? <VolumeX className="w-7 h-7" /> : <Volume2 className="w-7 h-7" />}
              </button>
            </div>

            {/* Input Modality 1: 1-10 Scale (if inputType is scale_1_to_10) */}
            {currentQuestionData?.inputType === 'scale_1_to_10' && (
              <div className="w-full flex flex-col gap-4 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Select Pain / Severity Level (1 to 10)
                  </span>
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    {severityRating} / 10
                  </span>
                </div>

                {/* Big Touch Scale 1 to 10 */}
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSeverityRating(val)}
                      className={`h-14 sm:h-16 rounded-2xl font-black text-lg sm:text-xl transition-all cursor-pointer border-2 ${
                        severityRating === val
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg scale-105'
                          : val <= 3
                          ? 'bg-slate-800/80 hover:bg-slate-700 text-emerald-300 border-slate-700'
                          : val <= 6
                          ? 'bg-slate-800/80 hover:bg-slate-700 text-amber-300 border-slate-700'
                          : 'bg-slate-800/80 hover:bg-slate-700 text-red-300 border-slate-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase px-1">
                  <span>1 (Very Mild)</span>
                  <span>5 (Moderate)</span>
                  <span>10 (Worst Possible)</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAnswerSubmit(`${severityRating} / 10`, 'scale')}
                  className="w-full h-14 mt-2 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-slate-950 font-black text-base sm:text-lg transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl"
                >
                  <span>Confirm Rating ({severityRating}/10)</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Input Modality 2: Tapped Multiple Choice Pills (Primary Kiosk Interaction) */}
            {currentQuestionData?.inputType !== 'scale_1_to_10' &&
              currentQuestionData?.suggestedOptions && (
                <div className="w-full flex flex-col gap-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Touch One Answer to Proceed:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQuestionData.suggestedOptions.map((option, idx) => {
                      const isSelected = selectedOption === option;
                      return (
                        <button
                          key={idx}
                          id={`kiosk-option-${idx}`}
                          type="button"
                          onClick={() => {
                            setSelectedOption(option);
                            handleAnswerSubmit(option, 'touch_pill');
                          }}
                          className={`min-h-[58px] p-4 rounded-2xl border-2 text-left font-bold text-sm sm:text-base transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-teal-500 text-slate-950 border-teal-300 shadow-xl'
                              : 'bg-slate-800/90 hover:bg-slate-750 text-white border-slate-700 hover:border-teal-400/60 active:scale-98'
                          }`}
                        >
                          <span className="leading-snug">{option}</span>
                          <span className="w-6 h-6 rounded-full bg-slate-950/40 flex items-center justify-center shrink-0">
                            <ArrowRight className="w-3.5 h-3.5 text-teal-300" />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Input Modality 3: Web Speech API Microphone (Voice Spoken Answer) */}
            <div className="w-full p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${isRecording ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-teal-500/20 text-teal-300'}`}>
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Prefer to Speak Your Answer?</h4>
                    <p className="text-xs text-slate-400">
                      Tap the microphone and describe your symptoms in your own words.
                    </p>
                  </div>
                </div>

                <button
                  id="kiosk-mic-toggle-btn"
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`h-12 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer border ${
                    isRecording
                      ? 'bg-red-600 hover:bg-red-500 text-white border-red-400 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-teal-300 border-slate-700 hover:text-white'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      <span>Stop Listening</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Start Speaking</span>
                    </>
                  )}
                </button>
              </div>

              {/* Real-time speech transcript feedback */}
              {isRecording && (
                <div className="w-full p-3 rounded-xl bg-slate-900 border border-red-500/50 text-slate-200 text-sm flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping shrink-0" />
                  <span className="italic flex-1">
                    {voiceInterimText || 'Listening to your voice... speak clearly into the kiosk microphone.'}
                  </span>
                </div>
              )}

              {/* Submitting voice transcript */}
              {!isRecording && typedInput && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={typedInput}
                    onChange={(e) => setTypedInput(e.target.value)}
                    placeholder="Review or edit your spoken answer..."
                    className="flex-1 h-12 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-teal-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleAnswerSubmit(typedInput, 'voice')}
                    className="h-12 px-5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md"
                  >
                    <span>Send</span>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Fallback Custom Typing Toggle */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowCustomText(!showCustomText)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-300 underline cursor-pointer"
              >
                {showCustomText ? 'Hide Keyboard Input' : 'Type a custom answer instead'}
              </button>

              {turns.length >= 4 && (
                <button
                  type="button"
                  onClick={() => compileAndFinish(turns, socratesHpi, chiefComplaint)}
                  className="text-xs font-bold text-teal-400 hover:text-teal-300 underline cursor-pointer"
                >
                  I'm done answering questions (Proceed)
                </button>
              )}
            </div>

            {showCustomText && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={typedInput}
                  onChange={(e) => setTypedInput(e.target.value)}
                  placeholder="Enter your exact answer here..."
                  className="flex-1 h-12 px-4 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-teal-400"
                />
                <button
                  type="button"
                  onClick={() => handleAnswerSubmit(typedInput, 'typed')}
                  className="h-12 px-5 rounded-xl bg-teal-500 text-slate-950 font-bold text-sm cursor-pointer"
                >
                  Submit
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Navigation Controls & Back */}
      <div className="w-full flex items-center justify-between mt-6 px-1">
        <button
          id="kiosk-interview-undo-btn"
          type="button"
          onClick={handleUndoPreviousTurn}
          className="h-14 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border-2 border-slate-700 transition-all cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{turns.length === 0 ? 'Back to Consent' : 'Undo Last Answer'}</span>
        </button>

        {turns.length >= 5 && (
          <button
            id="kiosk-interview-finish-early-btn"
            type="button"
            onClick={() => compileAndFinish(turns, socratesHpi, chiefComplaint)}
            className="h-14 px-7 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-base transition-all cursor-pointer flex items-center gap-2 shadow-xl"
          >
            <span>Complete & Go to Documents</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
