import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { SAMPLE_SCENARIOS } from '../data/sampleScenarios';
import { Mic, MicOff, Upload, Sparkles, Trash2, Play, Pause, AlertCircle, RefreshCw, Cpu, AlertTriangle } from 'lucide-react';
import { useTranslation, SUPPORTED_LANGUAGES_META, SupportedLanguage } from '../i18n';
import { isNonEnglishTranscript, detectTranscriptLanguage } from '../utils/languageDetector';
import { AstraBindu } from '../design/components';

interface TranscriptInputProps {
  transcript: string;
  onChangeTranscript: (text: string) => void;
  onSelectScenario: (scenarioId: string) => void;
  onGenerateSOAP: (audioData?: { base64: string; mimeType: string }) => void;
  isGenerating: boolean;
  selectedScenarioId?: string;
  isOfflineMode?: boolean;
}

export const TranscriptInput: React.FC<TranscriptInputProps> = ({
  transcript,
  onChangeTranscript,
  onSelectScenario,
  onGenerateSOAP,
  isGenerating,
  selectedScenarioId,
  isOfflineMode,
}) => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [audioFile, setAudioFile] = useState<{ file: File; url: string; base64: string } | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Determine record language based on scenario or transcript
  const activeScenario = SAMPLE_SCENARIOS.find((sc) => sc.id === selectedScenarioId);
  const activeRecordLang: SupportedLanguage | null =
    activeScenario?.language || (transcript.trim() ? detectTranscriptLanguage(transcript) : null);

  // Initialize Web Speech API if supported in browser
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    } else {
      setSpeechSupported(true);
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(t.transcriptInput.micNotSupported);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptChunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            currentTranscript += transcriptChunk + ' ';
          }
        }
        if (currentTranscript) {
          onChangeTranscript(transcript ? `${transcript}\n${currentTranscript}` : currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert('Audio file size exceeds 25MB. Please choose a smaller audio file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || '';
      const url = URL.createObjectURL(file);
      setAudioFile({
        file,
        url,
        base64,
      });
    };
    reader.readAsDataURL(file);
  };

  const removeAudioFile = () => {
    if (audioFile) {
      URL.revokeObjectURL(audioFile.url);
    }
    setAudioFile(null);
    setIsPlayingAudio(false);
  };

  const toggleAudioPlayback = () => {
    if (!audioRef.current || !audioFile) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;
  const characterCount = transcript.length;

  return (
    <div id="transcript-input-section" className="vx-card overflow-hidden transition-all duration-200">
      {/* Section Header */}
      <div id="transcript-header" className="px-5 py-3.5 bg-[var(--vx-surface)] border-b border-[var(--vx-border)] flex flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-3">
          <AstraBindu size={14} color="var(--vx-primary)" />
          <h2 id="transcript-title" className="font-editorial text-sm sm:text-base font-semibold text-[var(--vx-text)] tracking-tight">
            {t.transcriptInput.title}
          </h2>
          <span className="font-mono text-[11px] text-[var(--vx-text-muted)] font-medium">
            ({wordCount} {t.transcriptInput.wordCount} | {characterCount} {t.transcriptInput.charCount})
          </span>
          {activeRecordLang && (
            <span
              id="badge-record-language"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--vx-radius-xs)] font-mono text-[10px] font-bold uppercase tracking-wider bg-[var(--vx-surface-muted)] text-[var(--vx-secondary)] border border-[var(--vx-border)]"
              title={`${t.recordLanguage.recordLanguage}: ${SUPPORTED_LANGUAGES_META[activeRecordLang]?.nativeName || activeRecordLang}`}
            >
              <span>{t.recordLanguage.badge} · {SUPPORTED_LANGUAGES_META[activeRecordLang]?.nativeName.toUpperCase() || activeRecordLang.toUpperCase()}</span>
            </span>
          )}
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2">
          {/* Mic dictation button */}
          <button
            id="btn-toggle-mic"
            type="button"
            onClick={toggleRecording}
            className={
              isRecording
                ? 'vx-btn-primary px-3 py-1.5 text-xs bg-[var(--vx-danger)] hover:bg-[var(--vx-danger)] shadow-md animate-pulse'
                : 'vx-btn-outline px-3 py-1.5 text-xs'
            }
            title={speechSupported ? t.transcriptInput.micStart : t.transcriptInput.micNotSupported}
          >
            {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-[var(--vx-secondary)]" />}
            <span>{isRecording ? t.transcriptInput.micListening : t.transcriptInput.micStart}</span>
          </button>

          {/* Audio upload button */}
          <label
            id="label-audio-upload"
            className="vx-btn-outline px-3 py-1.5 text-xs cursor-pointer inline-flex items-center gap-1.5"
            title={t.transcriptInput.uploadAudio}
          >
            <Upload className="w-3.5 h-3.5 text-[var(--vx-secondary)]" />
            <span className="hidden sm:inline">{t.transcriptInput.uploadAudio}</span>
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioUpload}
              className="hidden"
            />
          </label>

          {/* Clear button */}
          {transcript && (
            <button
              id="btn-clear-transcript"
              type="button"
              onClick={() => onChangeTranscript('')}
              className="vx-btn-outline p-1.5 hover:text-[var(--vx-danger)] hover:border-[var(--vx-danger)]"
              title={t.transcriptInput.clearAudio}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Scenario Pills */}
      <div id="quick-scenarios-bar" className="px-5 py-2.5 bg-[var(--vx-surface-secondary)] border-b border-[var(--vx-border)] flex items-center gap-2 overflow-x-auto text-xs scrollbar-thin select-none">
        <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[var(--vx-text-muted)] whitespace-nowrap flex items-center gap-1.5 mr-1">
          <Sparkles className="w-3 h-3 text-[var(--vx-secondary)]" />
          <span>{t.transcriptInput.scenarioSelect}:</span>
        </span>
        {SAMPLE_SCENARIOS.map((sc) => {
          const isSelected = selectedScenarioId === sc.id;
          return (
            <button
              key={sc.id}
              id={`btn-scenario-${sc.id}`}
              type="button"
              onClick={() => onSelectScenario(sc.id)}
              className={`whitespace-nowrap px-3 py-1 rounded-[var(--vx-radius-sm)] text-xs font-medium transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-[var(--vx-primary)] text-[var(--vx-primary-text)] border-[var(--vx-primary)] shadow-xs font-semibold'
                  : 'bg-[var(--vx-surface)] hover:bg-[var(--vx-surface-muted)] text-[var(--vx-text)] border-[var(--vx-border)]'
              }`}
            >
              {sc.title}
            </button>
          );
        })}
      </div>

      {/* Audio File Player Preview */}
      {audioFile && (
        <div id="audio-file-preview" className="px-5 py-2 bg-[var(--vx-surface-muted)] border-b border-[var(--vx-border)] flex items-center justify-between text-xs text-[var(--vx-text)] font-mono">
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleAudioPlayback}
              className="w-6 h-6 rounded-full bg-[var(--vx-secondary)] text-white flex items-center justify-center font-bold cursor-pointer"
            >
              {isPlayingAudio ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
            </button>
            <span className="font-semibold truncate max-w-xs font-sans">{audioFile.file.name}</span>
            <span className="vx-badge vx-badge-copper">
              {(audioFile.file.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
          <audio
            ref={audioRef}
            src={audioFile.url}
            onEnded={() => setIsPlayingAudio(false)}
            className="hidden"
          />
          <button
            onClick={removeAudioFile}
            className="text-[var(--vx-text-muted)] hover:text-[var(--vx-danger)] p-1 cursor-pointer"
            title={t.transcriptInput.clearAudio}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Textarea */}
      <div className="p-5 relative bg-[var(--vx-surface)]">
        {/* Offline Mode Non-English Warning Banner */}
        {isOfflineMode && isNonEnglishTranscript(transcript) && (
          <div id="offline-non-english-warning" className="mb-4 p-3.5 bg-[var(--vx-surface-muted)] border border-[var(--vx-border-accent)] rounded-[var(--vx-radius-sm)] flex items-start gap-3 text-[var(--vx-text)] text-xs shadow-xs">
            <AlertTriangle className="w-4 h-4 text-[var(--vx-secondary)] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold font-editorial text-sm">
                {t.transcriptInput.offlineLanguageWarningTitle}
              </p>
              <p className="mt-0.5 text-[var(--vx-text-secondary)] leading-relaxed">
                {t.transcriptInput.offlineLanguageWarning}
              </p>
            </div>
          </div>
        )}

        {isGenerating ? (
          <div id="transcript-skeleton-overlay" className="w-full bg-[var(--vx-surface-secondary)] border border-[var(--vx-border)] rounded-[var(--vx-radius-md)] p-6 min-h-[220px] flex flex-col justify-between space-y-4 shadow-inner relative overflow-hidden">
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--vx-surface-muted)] to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            />

            <div className="flex items-center gap-2.5 text-[var(--vx-primary)] font-mono font-semibold text-xs z-10">
              <AstraBindu size={14} color="var(--vx-primary)" pulse={true} />
              <span>{t.transcriptInput.generatingBtn}</span>
            </div>

            <div className="space-y-3 z-10">
              <motion.div
                className="h-3.5 bg-[var(--vx-surface-muted)] rounded-md w-11/12"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              />
              <motion.div
                className="h-3.5 bg-[var(--vx-surface-muted)] rounded-md w-4/5"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
              />
              <motion.div
                className="h-3.5 bg-[var(--vx-surface-muted)] rounded-md w-9/12"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }}
              />
              <motion.div
                className="h-3.5 bg-[var(--vx-surface-muted)] rounded-md w-2/3"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: 0.6 }}
              />
            </div>

            <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-[var(--vx-text-muted)] z-10 border-t border-[var(--vx-border)]">
              <span>{t.banner.title}</span>
              <span>{t.banner.guardrails}</span>
            </div>
          </div>
        ) : (
          <textarea
            id="textarea-transcript"
            rows={10}
            placeholder={t.transcriptInput.placeholder}
            value={transcript}
            onChange={(e) => onChangeTranscript(e.target.value)}
            className="w-full bg-[var(--vx-surface-secondary)] border border-[var(--vx-border)] rounded-[var(--vx-radius-sm)] p-4 text-[var(--vx-text)] text-xs sm:text-sm focus:bg-[var(--vx-surface)] focus:outline-none focus:border-[var(--vx-primary)] focus:ring-1 focus:ring-[var(--vx-primary)] font-mono leading-relaxed resize-y min-h-[200px]"
          />
        )}

        {/* Recording active indicator */}
        {isRecording && !isGenerating && (
          <div className="absolute bottom-8 right-8 bg-[var(--vx-danger)] text-white px-3 py-1.5 rounded-[var(--vx-radius-sm)] text-xs font-mono font-bold flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <span>{t.transcriptInput.micListening}</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div id="transcript-footer" className="px-5 py-3.5 bg-[var(--vx-surface)] border-t border-[var(--vx-border)] flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-[var(--vx-text-muted)] flex items-center gap-2 font-mono">
          <AlertCircle className="w-3.5 h-3.5 text-[var(--vx-secondary)] shrink-0" />
          <span>{t.transcriptInput.subtitle}</span>
        </div>

        <button
          id="btn-generate-soap"
          type="button"
          disabled={isGenerating || (!transcript.trim() && !audioFile)}
          onClick={() => {
            if (audioFile) {
              onGenerateSOAP({
                base64: audioFile.base64,
                mimeType: audioFile.file.type,
              });
            } else {
              onGenerateSOAP();
            }
          }}
          className={`vx-btn-primary px-6 py-2.5 text-xs sm:text-sm font-semibold tracking-wide ${
            isGenerating || (!transcript.trim() && !audioFile)
              ? 'opacity-50 cursor-not-allowed'
              : 'shadow-sm'
          }`}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>{t.transcriptInput.generatingBtn}</span>
            </>
          ) : (
            <>
              <AstraBindu size={12} color="#FFFFFF" />
              <span>{t.transcriptInput.generateBtn}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
