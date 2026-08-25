import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getDefaultReactRealTimeVADOptions } from "@ricky0123/vad-react";
import { MicVAD } from "@ricky0123/vad-web";
import type {
  VoiceActivityDetector,
  VoiceActivityDetectorCallbacks,
  VoiceActivityDetectorState,
} from "../../domain/voice/voice-activity-detector";

const VAD_ASSET_BASE_PATH = `${import.meta.env.BASE_URL}vad/`;
const { userSpeakingThreshold, ...defaultVADOptions } = getDefaultReactRealTimeVADOptions("legacy");

export function useSileroVoiceActivityDetector(
  callbacks: VoiceActivityDetectorCallbacks = {},
): VoiceActivityDetector {
  const callbacksRef = useRef(callbacks);
  const mountedRef = useRef(false);
  const vadRef = useRef<MicVAD | null>(null);
  const initializationRef = useRef<Promise<MicVAD> | null>(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      const vad = vadRef.current;
      vadRef.current = null;

      if (vad) void vad.destroy().catch(() => undefined);
    };
  }, []);

  const start = useCallback(async () => {
    setErrorMessage(null);

    try {
      const vad = await getOrCreateVAD({
        callbacksRef,
        initializationRef,
        mountedRef,
        setIsSpeaking,
        setLoading,
        vadRef,
      });

      await vad.start();
      if (vad.errored) throw new Error(vad.errored);

      setIsListening(vad.listening);
    } catch (error) {
      setIsListening(false);
      setIsSpeaking(false);
      setErrorMessage(toErrorMessage(error));
    }
  }, []);

  const stop = useCallback(async () => {
    const vad = vadRef.current;
    if (!vad) return;

    try {
      await vad.pause();
      setIsListening(false);
      setIsSpeaking(false);
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
    }
  }, []);

  const state = getDetectorState({ loading, isListening, isSpeaking, hasError: errorMessage !== null });

  return useMemo(() => ({
    state,
    isListening,
    isSpeaking,
    errorMessage,
    start,
    stop,
  }), [errorMessage, isListening, isSpeaking, start, state, stop]);
}

async function getOrCreateVAD({
  callbacksRef,
  initializationRef,
  mountedRef,
  setIsSpeaking,
  setLoading,
  vadRef,
}: {
  callbacksRef: React.RefObject<VoiceActivityDetectorCallbacks>;
  initializationRef: React.MutableRefObject<Promise<MicVAD> | null>;
  mountedRef: React.RefObject<boolean>;
  setIsSpeaking: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  vadRef: React.MutableRefObject<MicVAD | null>;
}): Promise<MicVAD> {
  if (vadRef.current) return vadRef.current;

  setLoading(true);
  const initialization = initializationRef.current ?? MicVAD.new({
    ...defaultVADOptions,
    startOnLoad: false,
    baseAssetPath: VAD_ASSET_BASE_PATH,
    onnxWASMBasePath: VAD_ASSET_BASE_PATH,
    onFrameProcessed: (probabilities) => {
      if (mountedRef.current) {
        setIsSpeaking(probabilities.isSpeech > userSpeakingThreshold);
      }
    },
    onSpeechStart: () => callbacksRef.current.onSpeechStart?.(),
    onSpeechRealStart: () => callbacksRef.current.onSpeechValidated?.(),
    onSpeechEnd: (audio) => {
      if (mountedRef.current) setIsSpeaking(false);
      return callbacksRef.current.onSpeechEnd?.(audio);
    },
    onVADMisfire: () => {
      if (mountedRef.current) setIsSpeaking(false);
    },
  });

  initializationRef.current = initialization;

  try {
    const vad = await initialization;
    vadRef.current = vad;
    return vad;
  } finally {
    if (initializationRef.current === initialization) {
      initializationRef.current = null;
      if (mountedRef.current) setLoading(false);
    }
  }
}

function getDetectorState({
  loading,
  isListening,
  isSpeaking,
  hasError,
}: {
  loading: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  hasError: boolean;
}): VoiceActivityDetectorState {
  if (hasError) return "error";
  if (loading) return "loading";
  if (isSpeaking) return "speaking";
  if (isListening) return "listening";
  return "idle";
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
