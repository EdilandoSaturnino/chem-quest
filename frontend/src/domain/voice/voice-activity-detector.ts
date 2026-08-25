export type VoiceActivityDetectorState =
  | "loading"
  | "idle"
  | "listening"
  | "speaking"
  | "error";

export interface VoiceActivityDetectorCallbacks {
  /** Called when the detector first suspects speech. */
  readonly onSpeechStart?: () => void;
  /** Called once speech is confirmed and is not a VAD misfire. */
  readonly onSpeechValidated?: () => void;
  /** Receives the completed 16 kHz speech segment for future transcription transport. */
  readonly onSpeechEnd?: (audio: Float32Array) => void;
}

export interface VoiceActivityDetector {
  readonly state: VoiceActivityDetectorState;
  readonly isListening: boolean;
  readonly isSpeaking: boolean;
  readonly errorMessage: string | null;

  start(): Promise<void>;
  stop(): Promise<void>;
}
