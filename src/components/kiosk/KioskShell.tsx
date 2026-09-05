import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import {
  CreditCard,
  ShieldCheck,
  Stethoscope,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Volume2,
  VolumeX,
  Globe,
  AlertTriangle,
  X,
  HeartPulse,
  Sparkles,
} from 'lucide-react';
import { AbhaVerificationStep, VerifiedAbhaProfile } from './AbhaVerificationStep';
import { ConsentStep, ConsentPreferences } from './ConsentStep';
import { InterviewEngine } from './InterviewEngine';
import { StructuredPatientIntake } from '../../types';

export type KioskStep = 'abha' | 'consent' | 'interview' | 'documents' | 'summary';

interface StepConfig {
  id: KioskStep;
  stepNumber: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepConfig[] = [
  {
    id: 'abha',
    stepNumber: 1,
    title: 'ABHA Identity Verification',
    subtitle: 'Enter your 14-digit ABHA ID or scan your Ayushman Bharat QR card',
    icon: CreditCard,
  },
  {
    id: 'consent',
    stepNumber: 2,
    title: 'Patient Informed Consent',
    subtitle: 'Review and approve digital health record processing for this consultation',
    icon: ShieldCheck,
  },
  {
    id: 'interview',
    stepNumber: 3,
    title: 'Adaptive Clinical Interview',
    subtitle: 'Tell us about your main symptoms, duration, and health history',
    icon: Stethoscope,
  },
  {
    id: 'documents',
    stepNumber: 4,
    title: 'Document & Prescription Upload',
    subtitle: 'Scan previous physical prescriptions, lab tests, or discharge summaries',
    icon: UploadCloud,
  },
  {
    id: 'summary',
    stepNumber: 5,
    title: 'Intake Complete & Handoff',
    subtitle: 'Your intake briefing has been compiled and routed to the doctor',
    icon: CheckCircle2,
  },
];

export interface KioskShellProps {
  onExit: () => void;
  onSwitchToWorkstation?: () => void;
}

export const KioskShell: React.FC<KioskShellProps> = ({ onExit, onSwitchToWorkstation }) => {
  const { language, setLanguage } = useTranslation();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [inactivitySeconds, setInactivitySeconds] = useState<number>(120);

  // Kiosk Session State
  const [verifiedProfile, setVerifiedProfile] = useState<VerifiedAbhaProfile | null>(null);
  const [consent, setConsent] = useState<ConsentPreferences | null>(null);
  const [structuredIntake, setStructuredIntake] = useState<StructuredPatientIntake | null>(null);

  const currentStep = STEPS[currentStepIndex];

  // Inactivity countdown simulation for patient privacy
  useEffect(() => {
    const timer = setInterval(() => {
      setInactivitySeconds((prev) => {
        if (prev <= 1) {
          // Reset to start on timeout
          handleReset();
          return 120;
        }
        return prev - 1;
      });
    }, 1000);

    const resetTimer = () => setInactivitySeconds(120);
    window.addEventListener('touchstart', resetTimer);
    window.addEventListener('mousedown', resetTimer);
    window.addEventListener('keydown', resetTimer);

    return () => {
      clearInterval(timer);
      window.removeEventListener('touchstart', resetTimer);
      window.removeEventListener('mousedown', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, []);

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setVerifiedProfile(null);
    setConsent(null);
    setStructuredIntake(null);
    setCurrentStepIndex(0);
    setInactivitySeconds(120);
  };

  const StepIcon = currentStep.icon;

  return (
    <div
      id="kiosk-terminal-root"
      className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between select-none overflow-y-auto font-sans"
    >
      {/* KIOSK HEADER: Institutional Branding, Language, & Kiosk Step Progress */}
      <header className="bg-slate-900/95 border-b border-slate-800 px-4 sm:px-8 py-4 shrink-0 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400">
              <HeartPulse className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white">MediKiosk</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wide">
                  SIH 26047
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                All India Institute of Ayurveda & Ministry of AYUSH • OPD Intake
              </p>
            </div>
          </div>

          {/* Prominent Language Selector & Voice Guidance */}
          <div className="flex items-center gap-3">
            {/* Audio Guidance Toggle */}
            <button
              id="kiosk-audio-toggle"
              onClick={() => setAudioEnabled((prev) => !prev)}
              aria-label="Toggle Voice Guidance"
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-center ${
                audioEnabled
                  ? 'bg-teal-500/20 border-teal-400/50 text-teal-300 hover:bg-teal-500/30'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
              }`}
              title={audioEnabled ? 'Voice Guidance Active' : 'Voice Guidance Muted'}
            >
              {audioEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </button>

            {/* Language Selector Buttons */}
            <div className="flex items-center p-1 bg-slate-800 rounded-2xl border border-slate-700">
              <button
                id="kiosk-lang-en"
                onClick={() => setLanguage('en')}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all cursor-pointer flex items-center gap-2 ${
                  language === 'en'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>English</span>
              </button>
              <button
                id="kiosk-lang-es"
                onClick={() => setLanguage('es')}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all cursor-pointer flex items-center gap-2 ${
                  language === 'es'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Español</span>
              </button>
            </div>

            {/* Exit to Clinician Mode Button */}
            <button
              id="kiosk-exit-btn"
              onClick={() => setShowExitConfirm(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              title="Staff Exit"
            >
              Exit Kiosk
            </button>
          </div>
        </div>

        {/* STEP PROGRESS BAR: Large Icon-Driven Navigation */}
        <div className="max-w-6xl mx-auto mt-5 pt-4 border-t border-slate-800/80">
          <div className="grid grid-cols-5 gap-2 sm:gap-4">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;

              return (
                <button
                  key={step.id}
                  id={`kiosk-step-${step.id}`}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer text-center sm:text-left ${
                    isActive
                      ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-lg shadow-teal-950/40 ring-2 ring-teal-400/30'
                      : isPast
                      ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-400 hover:bg-slate-800'
                      : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${
                      isActive
                        ? 'bg-teal-400 text-slate-950'
                        : isPast
                        ? 'bg-emerald-500/30 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="hidden md:block overflow-hidden">
                    <div className="text-[11px] font-bold uppercase tracking-wider opacity-70">
                      Step {step.stepNumber}
                    </div>
                    <div className="text-xs font-extrabold truncate">{step.title}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* KIOSK MAIN STAGE */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-8 flex flex-col justify-center items-center">
        {currentStep.id === 'abha' ? (
          <AbhaVerificationStep
            initialProfile={verifiedProfile}
            onVerified={(profile) => {
              setVerifiedProfile(profile);
              handleNext();
            }}
          />
        ) : currentStep.id === 'consent' ? (
          <ConsentStep
            initialConsent={consent || undefined}
            onConsentGiven={(prefs) => {
              setConsent(prefs);
              handleNext();
            }}
            onBack={handleBack}
          />
        ) : currentStep.id === 'interview' ? (
          <InterviewEngine
            patientDemographics={{
              fullName: verifiedProfile?.fullName || 'Aarav Sharma',
              age: verifiedProfile?.age || 38,
              gender: verifiedProfile?.gender || 'Male',
              abhaId: verifiedProfile?.abhaId || '91-8765-4321-0987',
            }}
            initialIntake={structuredIntake}
            onComplete={(intake) => {
              setStructuredIntake(intake);
              handleNext();
            }}
            onBackToConsent={handleBack}
          />
        ) : (
          /* Placeholder Screens for subsequent sub-phases (documents, summary) */
          <div className="w-full bg-slate-900/80 border-2 border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-sm text-center flex flex-col items-center">
            {/* Step Icon Badge */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-teal-500/20 to-blue-600/20 border-2 border-teal-400/30 flex items-center justify-center text-teal-300 mb-6 shadow-xl">
              <StepIcon className="w-12 h-12 sm:w-14 sm:h-14" />
            </div>

            {/* Step Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4" />
              Step {currentStep.stepNumber} of {STEPS.length}
            </div>

            {/* Step Title (Minimal, High-Contrast) */}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
              {currentStep.title}
            </h1>

            {/* Minimal Body Text */}
            <p className="text-base sm:text-xl text-slate-300 max-w-xl mb-10 leading-relaxed">
              {currentStep.subtitle}
            </p>

            {/* Placeholder Notice Badge */}
            <div className="mb-10 px-5 py-3 rounded-2xl bg-slate-800/60 border border-slate-700 text-slate-400 text-sm max-w-md">
              <p className="font-semibold text-slate-300">Phase 6: Planned Module</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Interactive logic for this step will be connected in subsequent sub-phases.
              </p>
            </div>

            {/* Primary Big Touch Controls */}
            <div className="w-full max-w-md flex flex-col sm:flex-row items-center justify-center gap-4">
              {currentStepIndex > 0 && (
                <button
                  id="kiosk-back-btn"
                  onClick={handleBack}
                  className="w-full sm:w-1/3 h-16 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-base sm:text-lg border-2 border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
              )}

              {currentStepIndex < STEPS.length - 1 ? (
                <button
                  id="kiosk-continue-btn"
                  onClick={handleNext}
                  className="w-full sm:flex-1 h-16 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-slate-950 font-black text-lg sm:text-xl transition-all cursor-pointer flex items-center justify-center gap-3 shadow-xl shadow-teal-950/60 active:scale-95"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-6 h-6" />
                </button>
              ) : (
                <div className="w-full flex flex-col gap-3">
                  <button
                    id="kiosk-finish-btn"
                    onClick={handleReset}
                    className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg sm:text-xl transition-all cursor-pointer flex items-center justify-center gap-3 shadow-xl active:scale-95"
                  >
                    <RotateCcw className="w-6 h-6" />
                    <span>Start New Intake</span>
                  </button>

                  {onSwitchToWorkstation && (
                    <button
                      id="kiosk-workstation-handoff-btn"
                      onClick={onSwitchToWorkstation}
                      className="w-full h-14 rounded-2xl bg-blue-600/30 hover:bg-blue-600/40 border border-blue-500/40 text-blue-300 font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>View in Doctor Workstation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* KIOSK FOOTER: Privacy Inactivity Reset & Emergency Help */}
      <footer className="bg-slate-900/90 border-t border-slate-800 px-4 sm:px-8 py-3 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
          {/* Inactivity Privacy Watchdog */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Public terminal active</span>
            <span className="text-slate-600">•</span>
            <span>Privacy reset in <strong className="text-teal-300">{inactivitySeconds}s</strong></span>
            <button
              onClick={() => setInactivitySeconds(120)}
              className="text-teal-400 underline hover:text-teal-300 ml-1 cursor-pointer"
            >
              Extend
            </button>
          </div>

          {/* Quick Reset & Staff Help */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Screen</span>
            </button>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500">Need help? Ask hospital kiosk attendant</span>
          </div>
        </div>
      </footer>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Exit Public Kiosk Terminal?</h3>
            <p className="text-slate-300 text-sm mb-6">
              This will close the self-service kiosk and return to the clinician workstation or landing page.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors cursor-pointer"
              >
                Stay on Kiosk
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onExit();
                }}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-colors cursor-pointer"
              >
                Confirm Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
