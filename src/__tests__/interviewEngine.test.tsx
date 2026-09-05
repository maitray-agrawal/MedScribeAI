import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InterviewEngine } from '../components/kiosk/InterviewEngine';
import { LanguageProvider } from '../i18n/LanguageContext';

describe('InterviewEngine Component', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url) => {
        if (url.includes('/api/kiosk/interview-turn')) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                question: 'What is your main health concern or symptom bringing you in today?',
                category: 'chief_complaint',
                suggestedOptions: [
                  'Chest Pain / Discomfort',
                  'Abdominal / Stomach Pain',
                  'Fever & Chills',
                  'Severe Headache',
                ],
                inputType: 'choice_or_voice',
                redFlags: [],
                triagePriority: 'routine',
                isComplete: false,
              }),
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders initial question and multiple choice option cards', async () => {
    render(
      <LanguageProvider>
        <InterviewEngine onComplete={vi.fn()} />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText('What is your main health concern or symptom bringing you in today?')
      ).toBeInTheDocument();
    });

    expect(screen.getByText('Chest Pain / Discomfort')).toBeInTheDocument();
    expect(screen.getByText('Abdominal / Stomach Pain')).toBeInTheDocument();
    expect(screen.getByText('Fever & Chills')).toBeInTheDocument();
    expect(screen.getByText('Severe Headache')).toBeInTheDocument();
  });

  it('submits selected option and triggers next turn fetch', async () => {
    const handleComplete = vi.fn();
    render(
      <LanguageProvider>
        <InterviewEngine onComplete={handleComplete} />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Chest Pain / Discomfort')).toBeInTheDocument();
    });

    const chestPainOption = screen.getByText('Chest Pain / Discomfort');
    fireEvent.click(chestPainOption);

    // Fetch should be called for turn 2
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  it('displays emergency red-flag banner when red flag is present', async () => {
    (global.fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            question: 'How severe is the pain?',
            category: 'socrates_severity',
            suggestedOptions: ['1-3', '4-6', '7-8', '9-10'],
            inputType: 'scale_1_to_10',
            redFlags: ['Crushing retrosternal chest pain radiating to left arm'],
            triagePriority: 'emergency',
            isComplete: false,
          }),
      })
    );

    render(
      <LanguageProvider>
        <InterviewEngine onComplete={vi.fn()} />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Potential Clinical Red Flag Detected/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Crushing retrosternal chest pain radiating to left arm/i)
      ).toBeInTheDocument();
    });
  });
});
