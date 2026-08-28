import { useEffect } from "react";
import {
  ConversationProvider,
  useConversationControls,
  useConversationInput,
  useConversationMode,
  useConversationStatus,
} from "@elevenlabs/react";
import { VoiceActivityControl } from "../../components/voice/voice-activity-control";

const AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID;

interface FreeModeVoiceActivityProps {
  readonly mixedElementSymbols: readonly string[];
}

export function FreeModeVoiceActivity({ mixedElementSymbols }: FreeModeVoiceActivityProps) {
  if (!AGENT_ID) {
    return (
      <VoiceActivityControl
        status="error"
        isMuted
        isSpeaking={false}
        errorMessage="Assistente de voz não configurado. Defina VITE_ELEVENLABS_AGENT_ID."
        onToggleMute={() => undefined}
      />
    );
  }

  return (
    <ConversationProvider>
      <ElevenLabsVoiceActivity mixedElementSymbols={mixedElementSymbols} />
    </ConversationProvider>
  );
}

function ElevenLabsVoiceActivity({ mixedElementSymbols }: FreeModeVoiceActivityProps) {
  const { endSession, sendContextualUpdate, startSession } = useConversationControls();
  const { isMuted, setMuted } = useConversationInput();
  const { isSpeaking } = useConversationMode();
  const { message, status } = useConversationStatus();

  useEffect(() => {
    // React Strict Mode mounts, cleans up, and remounts effects in development.
    // Deferring the connection lets that first development-only cleanup cancel
    // before a session is opened, so the remount starts the single live session.
    const startTimer = window.setTimeout(() => {
      startSession({ agentId: AGENT_ID });
    }, 0);

    return () => {
      window.clearTimeout(startTimer);
      endSession();
    };
  }, [endSession, startSession]);

  useEffect(() => {
    if (status !== "connected") return;
    sendContextualUpdate(buildGameContext(mixedElementSymbols));
  }, [mixedElementSymbols, sendContextualUpdate, status]);

  return (
    <VoiceActivityControl
      status={status === "disconnected" ? "connecting" : status}
      isMuted={isMuted}
      isSpeaking={isSpeaking}
      errorMessage={status === "error" ? message : undefined}
      onToggleMute={() => setMuted(!isMuted)}
    />
  );
}

function buildGameContext(mixedElementSymbols: readonly string[]): string {
  const symbols = mixedElementSymbols.length > 0 ? mixedElementSymbols.join(", ") : "nenhum";
  return `Contexto do jogo: modo livre. Símbolos dos elementos ativos na mistura: ${symbols}. ` +
    "Use este contexto somente quando for relevante para responder ao usuário.";
}
