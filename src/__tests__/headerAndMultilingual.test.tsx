import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { Header } from '../components/Header';
import { LanguageProvider, useTranslation, SUPPORTED_LANGUAGES_META } from '../i18n';
import { SAMPLE_SCENARIOS } from '../data/sampleScenarios';
import { TranscriptInput } from '../components/TranscriptInput';
import { SOAPNoteHeader } from '../components/soap-note/SOAPNoteHeader';
import { AstraSutra } from '../design/components/AstraSutra';
import { PatientForm } from '../components/PatientForm';

describe('VAIDHYA Header, Multilingual & Record Localization Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders Header with 3 distinct zones (Product Identity, System State, User Controls)', () => {
    render(
      <LanguageProvider>
        <Header
          onOpenHistory={vi.fn()}
          onOpenAnalytics={vi.fn()}
          onSelectSampleScenario={vi.fn()}
          onNavigateToLanding={vi.fn()}
          onNavigateToAstrax={vi.fn()}
          totalEncountersCount={3}
          isOfflineMode={false}
          onToggleOfflineMode={vi.fn()}
        />
      </LanguageProvider>
    );

    // Zone A: Product Identity
    expect(screen.getByText('VAIDHYA')).toBeInTheDocument();
    expect(screen.getByText(/CLINICAL INTELLIGENCE/i)).toBeInTheDocument();
    expect(screen.getByText(/Sovereign Clinical Workstation/i)).toBeInTheDocument();
    expect(screen.getByText(/MEMBER OF THE ASTRAX FAMILY/i)).toBeInTheDocument();

    // Zone B: System State Badges
    expect(screen.getByText(/● CLOUD/i)).toBeInTheDocument();
    expect(screen.getByText(/● PERSISTENCE/i)).toBeInTheDocument();
    expect(screen.getByText(/✓ AUDIT/i)).toBeInTheDocument();

    // Zone C: User Controls
    expect(screen.getByRole('button', { name: /Select language/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Theme selector/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Load clinical sample cases/i })).toBeInTheDocument();
    expect(screen.getByTitle(/View Encounters History/i)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // Encounters count badge
    expect(screen.getByTitle(/Clinic Productivity Metrics/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clinician Profile and Settings/i })).toBeInTheDocument();
  });

  it('opens compact Language Popover and lists all 5 supported languages (EN, HI, MR, TA, ES)', () => {
    render(
      <LanguageProvider>
        <Header
          onOpenHistory={vi.fn()}
          onOpenAnalytics={vi.fn()}
          onSelectSampleScenario={vi.fn()}
          totalEncountersCount={0}
        />
      </LanguageProvider>
    );

    const langTrigger = screen.getByRole('button', { name: /Select language/i });
    expect(langTrigger).toHaveTextContent('EN');

    // Click to open language popover
    fireEvent.click(langTrigger);

    // Verify all 5 language options are displayed with native names
    expect(screen.getByRole('menuitem', { name: /EN English/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /HI हिन्दी/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /MR मराठी/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /TA தமிழ்/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /ES Español/i })).toBeInTheDocument();
  });

  it('switches application UI language across all 5 locales and persists to localStorage', () => {
    const TestComponent = () => {
      const { language, setLanguage, t } = useTranslation();
      return (
        <div>
          <span data-testid="current-lang">{language}</span>
          <span data-testid="translated-title">{t.patientForm.title}</span>
          <button onClick={() => setLanguage('es')}>Set ES</button>
          <button onClick={() => setLanguage('hi')}>Set HI</button>
          <button onClick={() => setLanguage('mr')}>Set MR</button>
          <button onClick={() => setLanguage('ta')}>Set TA</button>
          <button onClick={() => setLanguage('en')}>Set EN</button>
        </div>
      );
    };

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    // Initial English
    expect(screen.getByTestId('current-lang')).toHaveTextContent('en');
    expect(screen.getByTestId('translated-title')).toHaveTextContent('Patient Demographic & Clinical Context');

    // Switch to Spanish
    fireEvent.click(screen.getByText('Set ES'));
    expect(screen.getByTestId('current-lang')).toHaveTextContent('es');
    expect(screen.getByTestId('translated-title')).toHaveTextContent('Datos Demográficos y Contexto Clínico del Paciente');
    expect(localStorage.getItem('vaidhya_language_v2')).toBe('es');

    // Switch to Hindi
    fireEvent.click(screen.getByText('Set HI'));
    expect(screen.getByTestId('current-lang')).toHaveTextContent('hi');
    expect(screen.getByTestId('translated-title')).toHaveTextContent('रोगी जनसांख्यिकी एवं नैदानिक संदर्भ');
    expect(localStorage.getItem('vaidhya_language_v2')).toBe('hi');

    // Switch to Marathi
    fireEvent.click(screen.getByText('Set MR'));
    expect(screen.getByTestId('current-lang')).toHaveTextContent('mr');
    expect(screen.getByTestId('translated-title')).toHaveTextContent('रुग्ण जनसांख्यिकी आणि नैदानिक संदर्भ');
    expect(localStorage.getItem('vaidhya_language_v2')).toBe('mr');

    // Switch to Tamil
    fireEvent.click(screen.getByText('Set TA'));
    expect(screen.getByTestId('current-lang')).toHaveTextContent('ta');
    expect(screen.getByTestId('translated-title')).toHaveTextContent('நோயாளி விவரங்கள் மற்றும் மருத்துவ சூழல்');
    expect(localStorage.getItem('vaidhya_language_v2')).toBe('ta');

    // Switch back to English
    fireEvent.click(screen.getByText('Set EN'));
    expect(screen.getByTestId('current-lang')).toHaveTextContent('en');
    expect(screen.getByTestId('translated-title')).toHaveTextContent('Patient Demographic & Clinical Context');
  });

  it('renders Sample Cases dropdown grouped by language and enables selecting Spanish case', () => {
    const handleSelectScenario = vi.fn();

    render(
      <LanguageProvider>
        <Header
          onOpenHistory={vi.fn()}
          onOpenAnalytics={vi.fn()}
          onSelectSampleScenario={handleSelectScenario}
          totalEncountersCount={0}
        />
      </LanguageProvider>
    );

    const casesDropdownBtn = screen.getByRole('button', { name: /Load clinical sample cases/i });
    fireEvent.click(casesDropdownBtn);

    // Verify language groups in cases dropdown
    expect(screen.getByText(/English Cases/i)).toBeInTheDocument();
    expect(screen.getByText(/Spanish Cases \(Español\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Hindi Cases/i)).toBeInTheDocument();
    expect(screen.getByText(/Marathi Cases/i)).toBeInTheDocument();
    expect(screen.getByText(/Tamil Cases/i)).toBeInTheDocument();

    // Find and click the Spanish case
    const spanishCaseBtn = screen.getByText('Spanish Consultation (Gastroenteritis & Fever)');
    fireEvent.click(spanishCaseBtn);

    expect(handleSelectScenario).toHaveBeenCalledWith('spanish-consultation-fever');
  });

  it('decouples UI Locale from Medical Record Language and displays RECORD · ESPAÑOL badge', () => {
    const spanishScenario = SAMPLE_SCENARIOS.find((sc) => sc.id === 'spanish-consultation-fever');
    expect(spanishScenario).toBeDefined();

    render(
      <LanguageProvider>
        <TranscriptInput
          transcript={spanishScenario?.transcript || ''}
          onChangeTranscript={vi.fn()}
          onSelectScenario={vi.fn()}
          onGenerateSOAP={vi.fn()}
          isGenerating={false}
          selectedScenarioId="spanish-consultation-fever"
          isOfflineMode={false}
        />
      </LanguageProvider>
    );

    // UI is in English, but the transcript is marked as Spanish record
    expect(screen.getByText(/Clinical Dictation & Consultation Transcript/i)).toBeInTheDocument();
    const recordBadge = screen.getByText(/RECORD · ESPAÑOL/i);
    expect(recordBadge).toBeInTheDocument();
  });

  it('displays RECORD badge in SOAPNoteHeader when a non-English record language is active', () => {
    render(
      <LanguageProvider>
        <SOAPNoteHeader
          isEditing={false}
          copiedEHR={false}
          isReadingAloud={false}
          recordLanguage="es"
          onEdit={vi.fn()}
          onSaveEdits={vi.fn()}
          onCancelEdits={vi.fn()}
          onCopyEHR={vi.fn()}
          onReadAloud={vi.fn()}
          onOpenPrintPrescription={vi.fn()}
          onSaveEncounter={vi.fn()}
        />
      </LanguageProvider>
    );

    const soapRecordBadge = screen.getByText(/RECORD · ESPAÑOL/i);
    expect(soapRecordBadge).toBeInTheDocument();
  });

  it('localizes the AstraSutra clinical workflow stages dynamically when locale changes', () => {
    const WorkflowWithControls = () => {
      const { setLanguage } = useTranslation();
      return (
        <div>
          <button onClick={() => setLanguage('es')}>Switch to Spanish</button>
          <AstraSutra currentStage="intake" />
        </div>
      );
    };

    render(
      <LanguageProvider>
        <WorkflowWithControls />
      </LanguageProvider>
    );

    // Initial English stages
    expect(screen.getByText('Patient Intake')).toBeInTheDocument();
    expect(screen.getByText('Consultation')).toBeInTheDocument();
    expect(screen.getByText('SOAP Structuring')).toBeInTheDocument();

    // Trigger switch to Spanish
    fireEvent.click(screen.getByText('Switch to Spanish'));

    expect(screen.getByText('Admisión del Paciente')).toBeInTheDocument();
    expect(screen.getByText('Consulta Médica')).toBeInTheDocument();
    expect(screen.getByText('Estructuración SOAP')).toBeInTheDocument();
  });
});
