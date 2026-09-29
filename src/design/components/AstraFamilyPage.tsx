import React from 'react';
import { ArrowLeft, ExternalLink, ShieldCheck, Compass, Sparkles, Activity } from 'lucide-react';
import { AstraMark } from './AstraMark';
import { VaidhyaMark } from './VaidhyaMark';
import { AstraSeal } from './AstraSeal';
import { AstraBindu } from './AstraBindu';

export interface AstraFamilyPageProps {
  onBackToVaidhya: () => void;
}

interface DomainSystem {
  id: string;
  name: string;
  domain: string;
  motto: string;
  keywords: string;
  colorName: string;
  accentColor: string;
  active?: boolean;
}

const NAVADISHA_SYSTEMS: DomainSystem[] = [
  {
    id: 'vaidhya',
    name: 'Vaidhya',
    domain: 'Clinical Intelligence',
    motto: 'Healthcare · Accessibility · Accuracy · Better Outcomes',
    keywords: 'PEOPLE · CARE · BETTER HEALTH',
    colorName: 'Forest Green + Copper',
    accentColor: '#166534',
    active: true,
  },
  {
    id: 'kubersetu',
    name: 'KuberSetu',
    domain: 'Financial Intelligence',
    motto: 'Wealth · Opportunity · Market Intelligence · Inclusion',
    keywords: 'CONNECTING OPPORTUNITIES',
    colorName: 'Indigo + Copper',
    accentColor: '#1E3A8A',
  },
  {
    id: 'vajra',
    name: 'Vajra',
    domain: 'Crisis Intelligence',
    motto: 'Resilience · Rapid Response · Risk Analysis · Continuity',
    keywords: 'OBSERVE · RESPOND · RECOVER',
    colorName: 'Vermilion + Copper',
    accentColor: '#DC2626',
  },
  {
    id: 'niyukti',
    name: 'Niyukti',
    domain: 'Talent Intelligence',
    motto: 'People · Skills · Opportunity · Growth',
    keywords: 'TALENT MEETS OPPORTUNITY',
    colorName: 'Indigo + Saffron',
    accentColor: '#4338CA',
  },
  {
    id: 'margdarshi',
    name: 'Margdarshi',
    domain: 'Career Intelligence',
    motto: 'Guidance · Learning · Pathways · Potential',
    keywords: 'CLARITY · DIRECTION · GROWTH',
    colorName: 'Teal + Saffron',
    accentColor: '#0D9488',
  },
  {
    id: 'agni',
    name: 'Agni',
    domain: 'Research Intelligence',
    motto: 'Research · Innovation · Knowledge · Real Impact',
    keywords: 'IDEAS · ANALYZE · TRANSFORM',
    colorName: 'Copper + Vermilion',
    accentColor: '#B87333',
  },
  {
    id: 'satyam',
    name: 'Satyam',
    domain: 'Trust & Governance',
    motto: 'Verification · Transparency · Compliance · Trust',
    keywords: 'EVIDENCE · VERIFICATION · TRUST',
    colorName: 'Indigo + Copper',
    accentColor: '#1E40AF',
  },
  {
    id: 'domain8',
    name: 'Domain 8',
    domain: 'Strategic Sovereign Infrastructure',
    motto: 'Reserved Sovereign Capability',
    keywords: 'CONTINUOUS EVOLUTION',
    colorName: 'Ochre + Slate',
    accentColor: '#CA8A04',
  },
  {
    id: 'domain9',
    name: 'Domain 9',
    domain: 'Autonomous Operations',
    motto: 'Reserved Sovereign Capability',
    keywords: 'MATHEMATICAL GRAMMAR',
    colorName: 'Ink + Parchment',
    accentColor: '#221B14',
  },
];

export const AstraFamilyPage: React.FC<AstraFamilyPageProps> = ({ onBackToVaidhya }) => {
  return (
    <div id="astrax-family-page" className="min-h-screen bg-[var(--vx-bg)] text-[var(--vx-text)] font-sans flex flex-col selection:bg-[var(--vx-primary)] selection:text-white">
      {/* 1. Header Bar */}
      <header className="border-b border-[var(--vx-border)] bg-[var(--vx-surface)] sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          id="btn-back-to-vaidhya"
          type="button"
          onClick={onBackToVaidhya}
          className="vx-btn-outline text-xs px-3.5 py-1.5 flex items-center gap-2 cursor-pointer font-medium hover:bg-[var(--vx-surface-muted)]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← BACK TO VAIDHYA</span>
        </button>

        <div className="flex items-center gap-2.5">
          <AstraMark size={24} showGuideCircle={false} />
          <span className="font-editorial text-sm font-semibold tracking-wide">
            ASTRAX INSTITUTIONAL DIRECTORY
          </span>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 text-center space-y-6">
        <div className="flex justify-center mb-2">
          <AstraMark size={72} showGuideCircle={true} />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--vx-secondary)] font-semibold">
            Institutional Master Identity
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-semibold tracking-tight text-[var(--vx-text)]">
            A S T R A X
          </h1>
          <p className="font-mono text-xs sm:text-sm uppercase tracking-wider text-[var(--vx-text-muted)] max-w-xl mx-auto">
            Intelligence, Built on Indian Mathematical Grammar
          </p>
        </div>

        <p className="font-sans text-sm sm:text-base text-[var(--vx-text-secondary)] max-w-2xl mx-auto leading-relaxed">
          AstraX develops sovereign intelligence systems engineered with mathematical precision, continuous Sutra geometry, and institutional discipline. VAIDHYA is the clinical intelligence flagship of this institutional family.
        </p>

        {/* Mathematical Principles Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="vx-badge vx-badge-copper">01 Core Bindu</span>
          <span className="vx-badge vx-badge-neutral">02 Navadisha (9 Directions)</span>
          <span className="vx-badge vx-badge-neutral">03 Diamond Geometry</span>
          <span className="vx-badge vx-badge-neutral">04 Continuous Sutra</span>
          <span className="vx-badge vx-badge-primary">05 Sovereign Execution</span>
        </div>
      </section>

      <hr className="rule-astra-horizontal max-w-6xl mx-auto w-full" />

      {/* 3. Navadisha (9 Domains) Grid */}
      <section className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--vx-secondary)] font-semibold block">
              Navadisha Architecture
            </span>
            <h2 className="font-editorial text-2xl font-semibold tracking-tight">
              AstraX Intelligence Systems
            </h2>
          </div>
          <p className="font-mono text-xs text-[var(--vx-text-muted)] max-w-md">
            Each domain system addresses a specialized vertical through dedicated mathematical geometry and sovereign engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {NAVADISHA_SYSTEMS.map((system) => {
            const isVaidhya = system.id === 'vaidhya';

            return (
              <div
                key={system.id}
                className={`vx-card p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-200 ${
                  isVaidhya
                    ? 'ring-2 ring-[var(--vx-primary)] bg-[var(--vx-surface-elevated)] shadow-md'
                    : 'hover:border-[var(--vx-border-accent)]'
                }`}
              >
                {/* Active System Ribbon */}
                {isVaidhya && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-[var(--vx-radius-xs)] bg-[var(--vx-primary-soft)] text-[var(--vx-primary)] font-mono text-[10px] font-bold tracking-wider uppercase border border-[var(--vx-primary)]">
                    <Activity className="w-3 h-3 animate-pulse" />
                    <span>CURRENT SYSTEM</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {isVaidhya ? (
                      <VaidhyaMark size={32} showGuideCircle={false} />
                    ) : (
                      <div
                        className="w-8 h-8 rotate-45 rounded-[2px] flex items-center justify-center shrink-0 border border-[var(--vx-border-strong)]"
                        style={{ backgroundColor: system.accentColor + '18' }}
                      >
                        <div
                          className="w-3.5 h-3.5 rotate-45 rounded-[1px]"
                          style={{ backgroundColor: system.accentColor }}
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-editorial text-lg font-semibold tracking-tight leading-tight">
                        {system.name}
                      </h3>
                      <span className="font-mono text-[11px] text-[var(--vx-secondary)] font-medium block">
                        {system.domain}
                      </span>
                    </div>
                  </div>

                  <p className="font-sans text-xs text-[var(--vx-text-secondary)] leading-relaxed">
                    {system.motto}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[var(--vx-border)] flex items-center justify-between text-[10px] font-mono text-[var(--vx-text-muted)]">
                  <span>{system.keywords}</span>
                  <span className="font-medium text-[var(--vx-text-subtle)]">{system.colorName}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Mathematical Construction & Seal */}
      <section className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 my-4 vx-card-elevated rounded-[var(--vx-radius-lg)] p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--vx-secondary)] font-semibold">
              Sovereign Foundation
            </span>
            <h2 className="font-editorial text-2xl font-semibold tracking-tight">
              Clinical Intelligence Grounded in Evidence
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[var(--vx-text-secondary)] leading-relaxed">
              VAIDHYA combines sovereign local execution, clinical reasoning guardrails, and deterministic safety checks. Unlike generic medical SaaS applications, VAIDHYA operates entirely without external dependencies or cloud surveillance when in offline sovereign mode.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
              <div className="p-3 bg-[var(--vx-surface-muted)] rounded-[var(--vx-radius-sm)] border border-[var(--vx-border)]">
                <span className="block text-[10px] text-[var(--vx-text-muted)]">SOVEREIGNTY</span>
                <span className="font-semibold text-[var(--vx-primary)]">100% Offline Ready</span>
              </div>
              <div className="p-3 bg-[var(--vx-surface-muted)] rounded-[var(--vx-radius-sm)] border border-[var(--vx-border)]">
                <span className="block text-[10px] text-[var(--vx-text-muted)]">STANDARDS</span>
                <span className="font-semibold text-[var(--vx-secondary)]">FHIR R4 Bundles</span>
              </div>
              <div className="p-3 bg-[var(--vx-surface-muted)] rounded-[var(--vx-radius-sm)] border border-[var(--vx-border)] col-span-2 sm:col-span-1">
                <span className="block text-[10px] text-[var(--vx-text-muted)]">SAFETY</span>
                <span className="font-semibold text-[var(--vx-text)]">Zero Fabrication</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4">
            <AstraSeal size={130} />
            <span className="font-mono text-[10px] text-[var(--vx-text-muted)] mt-2">
              SEAL OF MATHEMATICAL GRAMMAR
            </span>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="mt-auto border-t border-[var(--vx-border)] bg-[var(--vx-surface)] py-6 px-4 text-center font-mono text-xs text-[var(--vx-text-muted)] space-y-2">
        <p>AstraX Sovereign Systems • Built on Indian Mathematical Grammar</p>
        <button
          type="button"
          onClick={onBackToVaidhya}
          className="text-[var(--vx-primary)] font-semibold hover:underline cursor-pointer"
        >
          Return to VAIDHYA Clinical Workspace →
        </button>
      </footer>
    </div>
  );
};
