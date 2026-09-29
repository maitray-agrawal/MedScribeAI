import { SupportedLanguage } from '../i18n';

/**
 * Utility to detect non-English transcripts (e.g. Spanish, Hindi, Marathi, Tamil)
 * Used by the UI and offline local engine to warn clinicians when offline mode is active.
 */
export function isNonEnglishTranscript(transcript: string): boolean {
  if (!transcript || transcript.trim().length === 0) return false;
  const lower = transcript.toLowerCase();

  // Devanagari script (Hindi / Marathi)
  if (/[\u0900-\u097F]/.test(transcript)) return true;

  // Tamil script
  if (/[\u0B80-\u0BFF]/.test(transcript)) return true;

  // Spanish accent marks / inverted punctuation
  if (/[áéíóúñ¿¡]/.test(lower)) return true;

  // Common Spanish words in clinical dialogue
  const spanishKeywords = [
    'buenos', 'días', 'tardes', 'doctor', 'doctora', 'paciente', 'gracias',
    'fiebre', 'dolor', 'cabeza', 'pecho', 'estomago', 'diarrea', 'vomito', 'vomitos',
    'tengo', 'tiene', 'siento', 'desde', 'hace', 'dias', 'semanas', 'meses',
    'medicina', 'medicamento', 'pastillas', 'alergia', 'presion', 'sangre',
    'consulta', 'motivo', 'sintomas', 'examen', 'tratamiento', 'regresar',
    'mucho', 'mucha', 'senor', 'senora', 'embarazo', 'embarazada'
  ];

  let matches = 0;
  for (const word of spanishKeywords) {
    if (new RegExp(`\\b${word}\\b`, 'i').test(lower)) {
      matches++;
    }
  }

  return matches >= 2;
}

/**
 * Detect the specific language of a clinical transcript or record
 */
export function detectTranscriptLanguage(transcript: string): SupportedLanguage {
  if (!transcript || transcript.trim().length === 0) return 'en';

  if (/[\u0B80-\u0BFF]/.test(transcript)) return 'ta';
  
  if (/[\u0900-\u097F]/.test(transcript)) {
    // Check for Marathi characteristic keywords
    if (/\b(आहे|नाही|मला|रुग्ण|झाले|होते|औषध|तपासणी|बसा|करा|घ्या)\b/.test(transcript)) {
      return 'mr';
    }
    return 'hi';
  }

  if (/[áéíóúñ¿¡]/.test(transcript.toLowerCase()) || isNonEnglishTranscript(transcript)) {
    return 'es';
  }

  return 'en';
}
