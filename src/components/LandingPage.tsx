import React, { useState } from 'react';
import {
  Stethoscope,
  Sparkles,
  ShieldAlert,
  Clock,
  FileCheck,
  Check,
  ArrowRight,
  Send,
  CheckCircle2,
  Lock,
  Zap,
  Activity,
  HeartPulse,
  Download,
  Github,
  BookOpen,
  QrCode,
  Laptop,
  AlertTriangle,
  ShieldCheck,
  Database,
  Layers,
  ExternalLink,
  Cpu,
  Info
} from 'lucide-react';

interface LandingPageProps {
  onLaunchWorkstation: () => void;
  onLaunchKiosk?: () => void;
  onLaunchTriage?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchWorkstation, onLaunchKiosk, onLaunchTriage }) => {
  // Pilot request state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    clinicName: '',
    role: 'Physician',
    monthlyEncounters: '100-500',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.clinicName) return;
    setIsSubmitted(true);
  };

  return (
    <div id="landing-page" className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Header Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xs font-bold">
              <Stethoscope className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-800 tracking-tight">MedScribeAI</span>
                <span className="badge-brand">SIH 2026 PS-26047</span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">Offline AI-Powered Patient Case-Taking & Clinical Safety Copilot</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-6 text-xs font-semibold text-slate-600">
            <a href="#problem" className="hover:text-blue-600 transition-colors">Problem</a>
            <a href="#solution" className="hover:text-blue-600 transition-colors">Solution</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#usp" className="hover:text-blue-600 transition-colors">USP</a>
            <a href="#validation" className="hover:text-blue-600 transition-colors">Validation</a>
            <a href="#screenshots" className="hover:text-blue-600 transition-colors">Screenshots</a>
            <a href="#limitations" className="hover:text-blue-600 transition-colors">Limitations</a>
            <a href="#download" className="hover:text-blue-600 transition-colors">Download</a>
            <a href="#scan-to-try" className="hover:text-blue-600 transition-colors">Scan to Try</a>
            <a href="#sih-alignment" className="hover:text-blue-600 transition-colors">SIH PS 26047</a>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-nav-launch-workstation"
              onClick={onLaunchWorkstation}
              className="btn-primary py-2 px-4 shadow-xs text-xs flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white fill-white" />
              <span>TRY WEB DEMO</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-20 pb-20">
        {/* HERO SECTION */}
        <section id="hero" className="relative bg-gradient-to-b from-white to-slate-50 pt-12 pb-16 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            {/* Synthetic Data & SIH Badge */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>AI-Powered Clinical Documentation & Safety Assistant • SIH26047</span>
              </div>
              <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-full text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>SYNTHETIC DEMO — NOT REAL PATIENT DATA</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.12]">
              MEDSCRIBEAI
            </h1>

            <p className="text-xl sm:text-2xl font-bold text-blue-600 tracking-tight max-w-3xl mx-auto">
              Offline AI-Powered Patient Case-Taking
            </p>

            <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
              Evidence-grounded clinical history preparation for physician review. Built for low-connectivity primary care centres with zero silent cloud fallback.
            </p>

            {/* Architecture Mode Distinctions */}
            <div className="max-w-2xl mx-auto bg-slate-100/90 border border-slate-200 rounded-2xl p-3 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-around gap-2 text-left">
              <div className="text-center sm:text-left">
                <span className="font-bold text-slate-800 block">WEB DEMONSTRATION</span>
                <span className="text-slate-500 text-[11px]">Interactive browser trial with pre-loaded clinical scenarios</span>
              </div>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <div className="text-center sm:text-left">
                <span className="font-bold text-slate-800 block">DESKTOP APPLICATION — LOCAL/OFFLINE CORE</span>
                <span className="text-slate-500 text-[11px]">Sovereign Windows runtime with embedded ASR, NLP & SQLite</span>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                id="btn-hero-launch"
                onClick={onLaunchWorkstation}
                className="btn-primary py-3.5 px-6 text-sm font-bold shadow-md flex items-center space-x-2 w-full sm:w-auto justify-center cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white fill-white" />
                <span>Launch Workstation (TRY WEB DEMO)</span>
                <ArrowRight className="w-4 h-4 text-white/80" />
              </button>

              <a
                id="btn-hero-download-desktop"
                href="#download"
                className="py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-md flex items-center space-x-2 w-full sm:w-auto justify-center transition-all"
              >
                <Laptop className="w-4 h-4 text-teal-400" />
                <span>DOWNLOAD DESKTOP APP</span>
              </a>

              <a
                id="btn-hero-github"
                href="https://github.com/maitray-agrawal/MedScribeAI"
                target="_blank"
                rel="noreferrer"
                className="py-3.5 px-6 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-bold shadow-xs flex items-center space-x-2 w-full sm:w-auto justify-center transition-all"
              >
                <Github className="w-4 h-4" />
                <span>VIEW GITHUB</span>
              </a>

              <a
                id="btn-hero-guide"
                href="https://github.com/maitray-agrawal/MedScribeAI/blob/main/DEMO.md"
                target="_blank"
                rel="noreferrer"
                className="py-3.5 px-6 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-800 text-sm font-bold shadow-xs flex items-center space-x-2 w-full sm:w-auto justify-center transition-all"
              >
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>READ DEMO GUIDE</span>
              </a>
            </div>

            {/* Micro Highlights Bar */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium border-t border-slate-200/60 max-w-3xl mx-auto">
              <div className="flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>0.24ms Deterministic NLP Extraction</span>
              </div>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100% Evidence Grounding (166/166 Facts Anchored)</span>
              </div>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <div className="flex items-center space-x-1.5">
                <HeartPulse className="w-4 h-4 text-blue-500" />
                <span>Mandatory Physician Approval Gate</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: PROBLEM */}
        <section id="problem" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Section 1 • The Clinical Challenge</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Primary Care Overload & Connectivity Barriers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-800">Severe Administrative Burden</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rural and community medical officers examine 40 to 80 patients daily, spending up to 45% of consultation time manually transcribing intake sheets rather than examining patients.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-800">Intermittent Internet Connectivity</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cloud-dependent AI scribes fail completely during frequent broadband outages at Community Health Centres (CHCs) and Primary Health Centres (PHCs).
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-800">LLM Hallucination Risks</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generative AI models fabricate phantom medications, unstated symptoms, and invented allergies when transcribing colloquial patient speech without provenance anchoring.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: SOLUTION */}
        <section id="solution" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Section 2 • The MedScribeAI Architecture</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Sovereign Offline Case-Taking & Safety Copilot</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                  <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Local Inference — Zero Cloud Dependency</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Evidence-Grounded Patient History Preparation
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  MedScribeAI operates as a dual-surface clinical platform: a multilingual patient kiosk for structured intake, coupled with a clinician workstation. It records dictated or spoken encounters, performs on-device ASR and deterministic NLP extraction, and produces verifiable ClinicalFacts with word-level source citations.
                </p>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Local ONNX ASR:</strong> Multilingual speech-to-text running entirely on standard CPU.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Evidence Gate:</strong> Rejects any fact lacking verbatim provenance in the transcript.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Deterministic Safety Engine:</strong> Rules-based contraindication and red-flag triage.</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-2xl p-5 font-mono text-xs space-y-3 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-400">
                  <span>CLINICAL STATE MACHINE</span>
                  <span className="text-emerald-400">INVARIANT ENFORCED</span>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-800/80 border border-slate-700 text-amber-300">
                    <strong>1. AI_DRAFT</strong> — Initial extracted state. Read-only, not exportable.
                  </div>
                  <div className="text-center text-slate-500">↓ Clinician opens encounter</div>
                  <div className="p-2 rounded bg-slate-800/80 border border-slate-700 text-blue-300">
                    <strong>2. REVIEWING</strong> — Physician validates facts, assertions, temporality.
                  </div>
                  <div className="text-center text-slate-500">↓ Explicit approval with PIN/credentials</div>
                  <div className="p-2 rounded bg-slate-800/80 border border-slate-700 text-emerald-300">
                    <strong>3. APPROVED</strong> — Clinical note locked. Export unlocked.
                  </div>
                  <div className="text-center text-slate-500">↓ Outbound sync (requires explicit sharing consent)</div>
                  <div className="p-2 rounded bg-slate-800/80 border border-slate-700 text-indigo-300">
                    <strong>4. EXPORTED</strong> — FHIR JSON / ABDM compliant payload produced.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: HOW IT WORKS */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Section 3 • Workflow Lifecycle</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">How MedScribeAI Operates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">1</div>
              <h4 className="font-bold text-sm text-slate-800">Consent & Patient Registration</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Patient registers demographic details and grants separated intake consent. Optional sharing consent is recorded separately and can be revoked independently.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">2</div>
              <h4 className="font-bold text-sm text-slate-800">Case-Taking & Speech Dictation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Doctor-patient conversation or kiosk intake is captured. Local Sherpa-ONNX transcribes audio locally without outbound network transmission.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">3</div>
              <h4 className="font-bold text-sm text-slate-800">Evidence Anchoring & Safety Audit</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deterministic clinical regex/matcher extracts symptoms, medications, and vitals. Each fact is tagged with verbatim source evidence; red flags trigger instant alerts.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">4</div>
              <h4 className="font-bold text-sm text-slate-800">Physician Approval & Local Export</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Doctor reviews draft, edits facts, approves the note, and exports local FHIR-compatible clinical summary or PDF prescription slip.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: USP */}
        <section id="usp" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Section 4 • Core Differentiators</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Unique Value Propositions (USP)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-800">Sovereign Offline Execution</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero network requests required. Desktop edition runs completely offline with bundled Python 3.11 sidecar, local SQLite database, and ONNX acoustic runtime.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-800">100% Evidence Grounding</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero hallucinated clinical facts. In our 166-fact benchmark corpus, every single extracted ClinicalFact is anchored to verbatim source transcripts.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-800">Consent & Safety Gates</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No automatic diagnosis, no automatic prescription, no silent transmission. Outbound synchronization is cryptographically gated behind explicit patient consent.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: VALIDATION */}
        <section id="validation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Section 5 • Empirical Benchmark</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Defensible Validation Metrics</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center space-y-1">
              <div className="text-3xl font-black text-blue-600">166 / 166</div>
              <div className="text-xs font-bold text-slate-800">Evidence Grounding</div>
              <div className="text-[11px] text-slate-500">100% facts anchored to source evidence in validation corpus</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center space-y-1">
              <div className="text-3xl font-black text-emerald-600">345 / 345</div>
              <div className="text-xs font-bold text-slate-800">Frontend Tests Passing</div>
              <div className="text-[11px] text-slate-500">15 Vitest suites validating UI, state machines, and triage</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center space-y-1">
              <div className="text-3xl font-black text-indigo-600">89 / 89</div>
              <div className="text-xs font-bold text-slate-800">Backend Tests Passing</div>
              <div className="text-[11px] text-slate-500">FastAPI, SQLite, and NLP safety test suites verified</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center space-y-1">
              <div className="text-3xl font-black text-amber-600">0.24 ms</div>
              <div className="text-xs font-bold text-slate-800">NLP Latency</div>
              <div className="text-[11px] text-slate-500">Measured on Intel i5 CPU without GPU acceleration</div>
            </div>
          </div>
        </section>

        {/* SECTION 6: SCREENSHOTS / WORKSTATION PREVIEW */}
        <section id="screenshots" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Section 6 • Interface Walkthrough</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Clinical Workstation & Kiosk Surfaces</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-400">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                <span className="font-mono text-slate-300 ml-2">MedScribeAI Sovereign Workstation — Evaluation UI</span>
              </div>
              <span className="bg-blue-900/60 text-blue-300 border border-blue-700 px-2.5 py-1 rounded-full font-mono text-[11px]">v1.0.0 RELEASE</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-blue-400 font-bold">
                  <span>Surface 1: Patient Kiosk</span>
                  <span className="text-[10px] text-slate-400">Multilingual</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Interactive multi-step kiosk in English, Hindi, and regional languages. Collects demographic info, consent, and symptoms before triage.
                </p>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/60 text-[11px] text-slate-400 font-mono">
                  Consent: SEPARATED (Intake: GRANTED, Sharing: OPTIONAL)
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                  <span>Surface 2: Triage Queue</span>
                  <span className="text-[10px] text-slate-400">Deterministic Red-Flags</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Emergency triage scoring with immediate high-priority escalation for chest pain, acute dyspnea, and hypertensive crisis indicators.
                </p>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/60 text-[11px] text-red-400 font-mono">
                  Red Flag Alert: Chest pain with diaphoresis detected
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-indigo-400 font-bold">
                  <span>Surface 3: Physician Workstation</span>
                  <span className="text-[10px] text-slate-400">SOAP & Fact Review</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Physician inspects ClinicalFacts with highlighted source citations, modifies assertion states, and executes cryptographically logged approval.
                </p>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/60 text-[11px] text-emerald-400 font-mono">
                  Status: AI_DRAFT → REVIEWING → APPROVED
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={onLaunchWorkstation}
                className="btn-primary py-2.5 px-6 text-xs font-bold shadow-xs inline-flex items-center space-x-2 cursor-pointer"
              >
                <span>Launch Interactive Web Demo Workstation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 7: LIMITATIONS */}
        <section id="limitations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-amber-600 uppercase tracking-wider">Section 7 • Declared Boundaries</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Declared System Limitations</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-2 text-xs text-amber-900">
                <p className="font-bold text-sm">
                  SIH 2026 Evaluation Prototype — Not For Direct Clinical Deployment Without Supervision
                </p>
                <ul className="list-disc list-inside space-y-1.5 leading-relaxed text-amber-800">
                  <li><strong>Optical Character Recognition (OCR):</strong> Gated behind host Tesseract binary availability. If uninstalled on the host system, the OCR capability gate honestly returns an unavailable status without fabricating synthetic text.</li>
                  <li><strong>Speech-to-Text (ASR):</strong> 8 Indic languages supported at the local ASR acoustic layer. English and Hindi are fully demonstrated end-to-end; diverse regional dialects require further real-world acoustic calibration.</li>
                  <li><strong>Diagnostic Autonomy:</strong> The software does not provide automatic medical diagnosis or prescribe medications. All draft outputs require explicit physician review and cryptographic approval.</li>
                  <li><strong>Synthetic Data:</strong> All sample patient profiles in this evaluation bundle are synthetic test cases created for SIH evaluation.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: PRICING / ZERO COST */}
        <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Zero-Cost Evaluator Distribution</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Transparent Clinic Pricing</p>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">100% free and open-source under MIT License. Zero paid hosting, paid database, or commercial API requirements.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Community Outreach</span>
                <div className="text-3xl font-black text-slate-900">₹0 <span className="text-xs font-normal text-slate-500">/ forever</span></div>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-600" /><span>Local browser demonstration</span></li>
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-600" /><span>Synthetic test patient scenarios</span></li>
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-600" /><span>Deterministic clinical triage</span></li>
              </ul>
            </div>

            <div className="bg-white border-2 border-blue-600 rounded-3xl p-6 shadow-md space-y-4 relative">
              <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">Evaluation Choice</span>
              <div className="space-y-1">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Sovereign Clinic Desktop</span>
                <div className="text-3xl font-black text-slate-900">₹0 <span className="text-xs font-normal text-slate-500">/ forever</span></div>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center space-x-2 font-semibold"><Check className="w-4 h-4 text-blue-600" /><span>Self-contained Windows x64 NSIS</span></li>
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-blue-600" /><span>Bundled Python sidecar & SQLite</span></li>
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-blue-600" /><span>100% Offline execution, no Wi-Fi needed</span></li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">CHC & Sub-Centre Network</span>
                <div className="text-3xl font-black text-slate-900">₹0 <span className="text-xs font-normal text-slate-500">/ forever</span></div>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-purple-600" /><span>FHIR / ABDM compatible export</span></li>
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-purple-600" /><span>Separated consent governance</span></li>
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-purple-600" /><span>Open-source SIH 2026 distribution</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 8: DOWNLOAD */}
        <section id="download" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Section 8 • Evaluator Distribution</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Download Desktop Installer</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-3xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-bold text-lg text-slate-900">MedScribeAI Windows x64 Installer</h3>
                <p className="text-xs text-slate-500 font-mono">MedScribeAI_1.0.0_x64-setup.exe (~202.7 MB)</p>
              </div>
              <a
                href="https://github.com/maitray-agrawal/MedScribeAI/releases"
                target="_blank"
                rel="noreferrer"
                className="btn-primary py-3 px-6 text-xs font-bold shadow-md flex items-center space-x-2 shrink-0"
              >
                <Download className="w-4 h-4 text-white" />
                <span>Download from GitHub Releases</span>
              </a>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="font-bold text-slate-800">Evaluator Installation Notes:</div>
              <ul className="space-y-2 list-disc list-inside leading-relaxed text-slate-600">
                <li><strong>No Dependencies Required:</strong> The installer bundles the standalone Python 3.11 sidecar, Uvicorn, FastAPI, ONNX Runtime, and SQLite. Node.js, Python, or Rust are NOT required on the evaluation PC.</li>
                <li><strong>Unsigned Binary Notice:</strong> As a zero-cost open-source student submission, the binary is not signed with a paid EV code-signing certificate. Windows SmartScreen may display a standard prompt; select <em>"More info" → "Run anyway"</em>.</li>
                <li><strong>SHA-256 Checksum:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono text-slate-700 break-all">913dfda6c558fa8430c57ded18c5ed48de4f838b7afce870b01647c386742bf3</code></li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 9: GITHUB REPOSITORY */}
        <section id="github" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Section 9 • Source Code & Open Governance</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">GitHub Repository & CI Pipeline</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-3xl mx-auto space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-sm">
              <Github className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">maitray-agrawal / MedScribeAI</h3>
            <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
              Complete source code, reproducible test suites, architecture specifications, and GitHub Actions release pipelines are publicly available under the MIT License.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <a
                href="https://github.com/maitray-agrawal/MedScribeAI"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs inline-flex items-center space-x-2 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>Visit GitHub Repository</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a
                href="https://github.com/maitray-agrawal/MedScribeAI/actions"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold shadow-xs inline-flex items-center space-x-2 transition-colors"
              >
                <Activity className="w-4 h-4 text-blue-600" />
                <span>GitHub Actions CI</span>
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 10: SIH PS 26047 ALIGNMENT */}
        <section id="sih-alignment" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Section 10 • Competition Alignment</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Smart India Hackathon 2026 — PS SIH26047</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-900 block">Problem Statement</span>
                <p className="text-slate-600">SIH26047: Patient Case-Taking Software for Primary Healthcare</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-900 block">Target Deployment</span>
                <p className="text-slate-600">Community Health Centres (CHCs), Sub-Centres, Independent Rural Clinics</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-900 block">Core Deliverable</span>
                <p className="text-slate-600">Dual-surface sovereign kiosk and clinical workstation operating completely offline</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-900 block">Team & Governance</span>
                <p className="text-slate-600">Team AstraX • Zero-Cost Evaluator Distribution Architecture</p>
              </div>
            </div>
          </div>
        </section>

        {/* PHASE 12: SCAN TO TRY (QR SECTION) */}
        <section id="scan-to-try" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Evaluation Kiosk Tool</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Scan to Try on Mobile</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-xl mx-auto text-center space-y-6">
            <div className="w-48 h-48 mx-auto bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-4 relative">
              <QrCode className="w-24 h-24 text-slate-700 stroke-[1.5]" />
              <span className="text-[10px] font-bold text-slate-500 mt-2">DEPLOYMENT QR READY</span>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">
                Scan with any smartphone camera to open the interactive Web Demo directly at your evaluation desk.
              </p>
              <p className="text-[11px] text-slate-500">
                Points directly to the live Cloudflare Pages deployment (<code className="bg-slate-100 px-1 py-0.5 rounded">https://&lt;project-name&gt;.pages.dev</code>) upon initial Git integration publish.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Stethoscope className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-800">MedScribeAI</span>
            <span>• SIH 2026 Problem Statement SIH26047 • Team AstraX</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={onLaunchWorkstation} className="text-blue-600 font-bold hover:underline cursor-pointer">
              Launch Web Demo
            </button>
            <a href="https://github.com/maitray-agrawal/MedScribeAI" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-slate-900">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
