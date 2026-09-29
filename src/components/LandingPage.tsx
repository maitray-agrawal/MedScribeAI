import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Send,
  Lock,
  Layers,
  FileCheck,
  Cpu,
  Database,
  Building,
  Activity,
  SlidersHorizontal,
} from 'lucide-react';
import { VaidhyaMark } from '../design/components/VaidhyaMark';
import { AstraMark } from '../design/components/AstraMark';
import { AstraSeal } from '../design/components/AstraSeal';
import { AstraAttribution } from '../design/components/AstraAttribution';
import { ThemeSwitcher } from '../design/components/ThemeSwitcher';

interface LandingPageProps {
  onLaunchWorkstation: () => void;
  onNavigateToAstrax?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchWorkstation,
  onNavigateToAstrax,
}) => {
  // Request access form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    clinicName: '',
    role: 'Attending Physician',
    monthlyEncounters: '100-500',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.clinicName) return;
    setIsSubmitted(true);
  };

  return (
    <div id="landing-page" className="min-h-screen bg-[var(--vx-bg)] text-[var(--vx-text)] flex flex-col font-sans transition-colors duration-300">
      {/* 1. Institutional Top Navigation */}
      <header className="border-b border-[var(--vx-border)] sticky top-0 z-40 bg-[var(--vx-surface)]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <VaidhyaMark size={36} />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-bold text-base text-[var(--vx-text)] tracking-tight">
                  VAIDHYA
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--vx-primary)] border border-[var(--vx-primary)]/20 bg-[var(--vx-primary-soft)] px-2 py-0.5 rounded-xs">
                  CLINICAL INTELLIGENCE
                </span>
              </div>
              <AstraAttribution onClick={onNavigateToAstrax} />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-xs font-mono tracking-wider uppercase text-[var(--vx-text-muted)]">
            <a href="#foundations" className="hover:text-[var(--vx-primary)] transition-colors">Foundations</a>
            <a href="#architecture" className="hover:text-[var(--vx-primary)] transition-colors">Architecture</a>
            <a href="#sovereignty" className="hover:text-[var(--vx-primary)] transition-colors">Sovereignty</a>
            <a href="#request-access" className="hover:text-[var(--vx-primary)] transition-colors">Access</a>
          </div>

          <div className="flex items-center space-x-3">
            <ThemeSwitcher />
            <button
              id="btn-nav-launch-workstation"
              onClick={onLaunchWorkstation}
              className="vx-btn-primary py-2 px-3.5 text-xs flex items-center space-x-2 cursor-pointer"
            >
              <span>Launch Workstation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-20 pb-20">
        {/* 2. Editorial Intelligence Hero */}
        <section id="hero" className="relative pt-16 pb-20 border-b border-[var(--vx-border)] overflow-hidden">
          {/* Subtle Geometric Background */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-[var(--vx-border)]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-[var(--vx-border-strong)] border-dashed" />
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[var(--vx-border)]" />
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[var(--vx-border)]" />
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <div className="inline-flex items-center space-x-2.5 bg-[var(--vx-surface-muted)] border border-[var(--vx-border)] px-3.5 py-1.5 rounded-full text-xs font-mono">
              <span className="w-2 h-2 rotate-45 bg-[var(--vx-secondary)]"></span>
              <span className="text-[var(--vx-text-muted)] uppercase tracking-wider">
                AI-Powered Clinical Documentation & Safety Assistant · AN ASTRA X INTELLIGENCE SYSTEM
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[var(--vx-text)] tracking-tight leading-[1.12]">
              Sovereign Clinical Intelligence for Evidence-Grounded Healthcare
            </h1>

            <p className="text-base sm:text-lg text-[var(--vx-text-muted)] max-w-2xl mx-auto leading-relaxed font-normal">
              VAIDHYA transforms unstructured doctor-patient consultation discourse into verified SOAP notes,
              ICD-10/CPT coding, and proactive clinical guardrail audits with mathematical precision.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                id="btn-hero-launch"
                onClick={onLaunchWorkstation}
                className="vx-btn-primary py-3 px-6 text-sm font-semibold flex items-center space-x-2.5 w-full sm:w-auto justify-center cursor-pointer shadow-sm"
              >
                <span>Launch Clinical Workstation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#request-access"
                className="vx-btn-secondary py-3 px-6 text-sm font-semibold w-full sm:w-auto text-center"
              >
                Request Sovereign Deployment
              </a>
            </div>

            {/* Micro Pillars */}
            <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto border-t border-[var(--vx-border)] text-left text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[var(--vx-secondary)] font-bold block text-[10px] tracking-widest uppercase">
                  01 · GROUNDED EVIDENCE
                </span>
                <p className="text-[var(--vx-text-muted)] font-sans">
                  Direct citation and provenance mapping to patient utterance recordings.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[var(--vx-primary)] font-bold block text-[10px] tracking-widest uppercase">
                  02 · PRIVACY SOVEREIGNTY
                </span>
                <p className="text-[var(--vx-text-muted)] font-sans">
                  On-device and air-gapped local inference capability with zero cloud mandate.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[var(--vx-text)] font-bold block text-[10px] tracking-widest uppercase">
                  03 · HUMAN APPROVAL
                </span>
                <p className="text-[var(--vx-text-muted)] font-sans">
                  Clinician review and signature required before any record finalization.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Clinical Workflow Architecture */}
        <section id="architecture" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--vx-secondary)] font-semibold">
              MATHEMATICAL GRAMMAR · CLINICAL SUTRA
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--vx-text)] tracking-tight">
              Continuous Clinical Progression Architecture
            </h2>
            <p className="text-xs sm:text-sm text-[var(--vx-text-muted)] max-w-xl mx-auto">
              Every patient case follows a six-stage deterministic workflow ensuring full clinical reasoning accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="vx-card p-6 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--vx-primary)] bg-[var(--vx-primary-soft)] px-2 py-0.5 rounded-xs font-semibold">
                  STAGES 01–02
                </span>
                <div className="w-5 h-5 rotate-45 border border-[var(--vx-border-strong)] flex items-center justify-center">
                  <div className="w-2 h-2 rotate-45 bg-[var(--vx-secondary)]"></div>
                </div>
              </div>
              <h3 className="font-serif font-semibold text-base text-[var(--vx-text)]">
                Intake & Encounter Capture
              </h3>
              <p className="text-xs text-[var(--vx-text-muted)] leading-relaxed">
                Structured capture of demographics, allergies, and prior history alongside raw consultation dictation or ambient audio recordings.
              </p>
            </div>

            <div className="vx-card p-6 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--vx-secondary)] bg-[var(--vx-secondary-soft)] px-2 py-0.5 rounded-xs font-semibold">
                  STAGES 03–04
                </span>
                <div className="w-5 h-5 rotate-45 border border-[var(--vx-border-strong)] flex items-center justify-center">
                  <div className="w-2 h-2 rotate-45 bg-[var(--vx-primary)]"></div>
                </div>
              </div>
              <h3 className="font-serif font-semibold text-base text-[var(--vx-text)]">
                Structuring & Evidence Grounding
              </h3>
              <p className="text-xs text-[var(--vx-text-muted)] leading-relaxed">
                Separation into Subjective, Objective, Assessment, and Plan domains, accompanied by verified drug-drug interaction and contraindication auditing.
              </p>
            </div>

            <div className="vx-card p-6 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--vx-text)] bg-[var(--vx-surface-muted)] px-2 py-0.5 rounded-xs font-semibold border border-[var(--vx-border)]">
                  STAGES 05–06
                </span>
                <div className="w-5 h-5 rotate-45 border border-[var(--vx-border-strong)] flex items-center justify-center">
                  <div className="w-2 h-2 rotate-45 bg-[var(--vx-text)]"></div>
                </div>
              </div>
              <h3 className="font-serif font-semibold text-base text-[var(--vx-text)]">
                Physician Review & Sign-Off
              </h3>
              <p className="text-xs text-[var(--vx-text-muted)] leading-relaxed">
                Complete physician editorial control, ICD-10/CPT coding approval, HL7 FHIR R4 interoperability bundle generation, and patient advice slip printing.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Sovereignty & Governance */}
        <section id="sovereignty" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="vx-card p-8 md:p-12 space-y-8 bg-gradient-to-br from-[var(--vx-surface)] to-[var(--vx-surface-muted)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[var(--vx-border)] pb-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--vx-secondary)] font-semibold">
                  PRIVACY & DATA RESIDENCY
                </span>
                <h3 className="font-serif font-bold text-2xl text-[var(--vx-text)]">
                  Sovereign Clinical Computing
                </h3>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono text-[var(--vx-primary)] bg-[var(--vx-primary-soft)] px-3 py-1.5 rounded-xs border border-[var(--vx-primary)]/20">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero PHI Cloud Leakage Architecture</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xs bg-[var(--vx-surface)] border border-[var(--vx-border)] flex items-center justify-center text-[var(--vx-primary)]">
                  <Cpu className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-semibold text-sm text-[var(--vx-text)]">Local Offline Engine</h4>
                <p className="text-[var(--vx-text-muted)] leading-relaxed">
                  Operate entirely without an active internet connection using integrated rule-based extraction engines and on-premise local models.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xs bg-[var(--vx-surface)] border border-[var(--vx-border)] flex items-center justify-center text-[var(--vx-secondary)]">
                  <Database className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-semibold text-sm text-[var(--vx-text)]">Encrypted Device Vault</h4>
                <p className="text-[var(--vx-text-muted)] leading-relaxed">
                  Clinical records and encounters persist strictly in local browser or workstation storage under doctor control.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xs bg-[var(--vx-surface)] border border-[var(--vx-border)] flex items-center justify-center text-[var(--vx-text)]">
                  <Building className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-semibold text-sm text-[var(--vx-text)]">ABDM & FHIR Compliance</h4>
                <p className="text-[var(--vx-text-muted)] leading-relaxed">
                  Native export to HL7 FHIR Release 4 JSON specification ready for institutional EHR integration.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Transparent Clinic Pricing */}
        <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--vx-secondary)] font-semibold">
              TRANSPARENT VALUE
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--vx-text)] tracking-tight">
              Transparent Clinic Pricing & Deployment Models
            </h2>
            <p className="text-xs sm:text-sm text-[var(--vx-text-muted)] max-w-xl mx-auto">
              Predictable, low-overhead clinical intelligence packages tailored for independent practices, community clinics, and sovereign hospital systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="vx-card p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--vx-text-muted)] font-semibold">
                  COMMUNITY HEALTH
                </span>
                <h3 className="font-serif font-bold text-xl text-[var(--vx-text)]">Open Sovereign</h3>
                <div className="text-2xl font-serif font-bold text-[var(--vx-primary)]">$0 <span className="text-xs font-sans text-[var(--vx-text-muted)] font-normal">/ forever local</span></div>
              </div>
              <p className="text-xs text-[var(--vx-text-muted)]">
                Complete browser-local offline engine, local SQLite/encrypted storage, full SOAP note extraction, and zero external network calls.
              </p>
              <ul className="text-xs space-y-2 text-[var(--vx-text)] pt-2 border-t border-[var(--vx-border)]">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[var(--vx-primary)]" /> 100% On-Device Privacy</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[var(--vx-primary)]" /> Unlimited Local Encounters</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[var(--vx-primary)]" /> HL7 FHIR R4 Bundle Export</li>
              </ul>
            </div>

            <div className="vx-card p-6 space-y-4 border-[var(--vx-secondary)]/40 relative">
              <div className="absolute top-3 right-3 text-[9px] font-mono uppercase tracking-wider bg-[var(--vx-secondary-soft)] text-[var(--vx-secondary)] border border-[var(--vx-secondary)]/30 px-2 py-0.5 rounded-xs font-semibold">
                RECOMMENDED
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--vx-secondary)] font-semibold">
                  CLINICAL PRACTICE
                </span>
                <h3 className="font-serif font-bold text-xl text-[var(--vx-text)]">Active Intelligence</h3>
                <div className="text-2xl font-serif font-bold text-[var(--vx-secondary)]">$49 <span className="text-xs font-sans text-[var(--vx-text-muted)] font-normal">/ clinician / mo</span></div>
              </div>
              <p className="text-xs text-[var(--vx-text-muted)]">
                Dual-engine orchestration with Gemini 3.6 Flash cloud inference and instant offline fallback, real-time drug interaction database, and ambient audio transcription.
              </p>
              <ul className="text-xs space-y-2 text-[var(--vx-text)] pt-2 border-t border-[var(--vx-border)]">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[var(--vx-primary)]" /> Ambient Microphone Streaming</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[var(--vx-primary)]" /> ICD-10 & CPT Automated Coding</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[var(--vx-primary)]" /> Multi-Language (EN/ES) Clinical Mode</li>
              </ul>
            </div>

            <div className="vx-card p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--vx-text-muted)] font-semibold">
                  HEALTH AUTHORITY
                </span>
                <h3 className="font-serif font-bold text-xl text-[var(--vx-text)]">Sovereign Enterprise</h3>
                <div className="text-2xl font-serif font-bold text-[var(--vx-text)]">Custom <span className="text-xs font-sans text-[var(--vx-text-muted)] font-normal">/ on-premise</span></div>
              </div>
              <p className="text-xs text-[var(--vx-text-muted)]">
                Air-gapped hospital server deployment, custom hospital formulary integrations, sovereign audit ledgers, and dedicated institutional engineering.
              </p>
              <ul className="text-xs space-y-2 text-[var(--vx-text)] pt-2 border-t border-[var(--vx-border)]">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[var(--vx-primary)]" /> Air-Gapped Hospital Appliance</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[var(--vx-primary)]" /> Dedicated Fine-Tuned Models</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[var(--vx-primary)]" /> ABDM / Epic / Cerner Integration</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Request Sovereign Access Form */}
        <section id="request-access" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--vx-primary)] font-semibold">
              INSTITUTIONAL ENROLLMENT
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--vx-text)] tracking-tight">
              Request Sovereign Deployment
            </h2>
            <p className="text-xs sm:text-sm text-[var(--vx-text-muted)]">
              Equip your medical facility, rural clinic, or health authority with VAIDHYA clinical intelligence.
            </p>
          </div>

          <div className="vx-card p-6 sm:p-8">
            {isSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[var(--vx-primary-soft)] border border-[var(--vx-primary)]/20 text-[var(--vx-primary)] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[var(--vx-text)]">Deployment Request Received</h3>
                <p className="text-xs text-[var(--vx-text-muted)] max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-[var(--vx-text)]">{formData.fullName}</span>. An AstraX intelligence specialist will coordinate your institution's configuration for {formData.clinicName}.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="vx-btn-ghost py-1.5 px-4 text-xs font-mono"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[var(--vx-text-muted)] font-mono text-[10px] uppercase tracking-wider font-semibold">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Dr. Anandita Sharma"
                      className="w-full bg-[var(--vx-surface)] border border-[var(--vx-border-strong)] rounded-sm p-2 text-[var(--vx-text)] focus:border-[var(--vx-primary)] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[var(--vx-text-muted)] font-mono text-[10px] uppercase tracking-wider font-semibold">
                      Institutional Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="asharma@hospital.org"
                      className="w-full bg-[var(--vx-surface)] border border-[var(--vx-border-strong)] rounded-sm p-2 text-[var(--vx-text)] focus:border-[var(--vx-primary)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[var(--vx-text-muted)] font-mono text-[10px] uppercase tracking-wider font-semibold">
                      Healthcare Facility *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.clinicName}
                      onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                      placeholder="Sub-District Health Center"
                      className="w-full bg-[var(--vx-surface)] border border-[var(--vx-border-strong)] rounded-sm p-2 text-[var(--vx-text)] focus:border-[var(--vx-primary)] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[var(--vx-text-muted)] font-mono text-[10px] uppercase tracking-wider font-semibold">
                      Clinical Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-[var(--vx-surface)] border border-[var(--vx-border-strong)] rounded-sm p-2 text-[var(--vx-text)] focus:border-[var(--vx-primary)] focus:outline-none"
                    >
                      <option value="Physician">Attending Physician</option>
                      <option value="Medical Director">Medical Director / CMO</option>
                      <option value="Nurse Practitioner">Nurse Practitioner / Paramedic</option>
                      <option value="Health Administrator">Clinic Administrator</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[var(--vx-text-muted)] font-mono text-[10px] uppercase tracking-wider font-semibold">
                      Monthly Volume
                    </label>
                    <select
                      value={formData.monthlyEncounters}
                      onChange={(e) => setFormData({ ...formData, monthlyEncounters: e.target.value })}
                      className="w-full bg-[var(--vx-surface)] border border-[var(--vx-border-strong)] rounded-sm p-2 text-[var(--vx-text)] focus:border-[var(--vx-primary)] focus:outline-none"
                    >
                      <option value="<100">&lt; 100 Encounters</option>
                      <option value="100-500">100–500 Encounters</option>
                      <option value="500-2000">500–2,000 Encounters</option>
                      <option value="2000+">2,000+ Encounters</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full vx-btn-primary py-3 text-xs font-semibold flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Sovereign Access Inquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* 6. AstraX Institutional Footer */}
      <footer className="border-t border-[var(--vx-border)] bg-[var(--vx-surface)] py-8 text-xs text-[var(--vx-text-muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <VaidhyaMark size={28} />
            <div>
              <p className="font-serif font-bold text-[var(--vx-text)]">VAIDHYA · CLINICAL INTELLIGENCE</p>
              <p className="text-[10px] font-mono tracking-wider text-[var(--vx-text-subtle)]">
                AN ASTRA X INTELLIGENCE SYSTEM
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <AstraAttribution onClick={onNavigateToAstrax} />
            <span className="text-[var(--vx-text-subtle)]">·</span>
            <AstraSeal size={32} />
          </div>
        </div>
      </footer>
    </div>
  );
};
