import { VoiceActivityControl } from "../../components/voice/voice-activity-control";
import { useSileroVoiceActivityDetector } from "../../infra/voice/use-silero-voice-activity-detector";
import { useVoiceTurnClient } from "../../infra/voice/use-voice-turn-client";

interface FreeModeVoiceActivityProps {
  mixedElementSymbols: readonly string[];
}

export function FreeModeVoiceActivity({ mixedElementSymbols }: FreeModeVoiceActivityProps) {
  const voiceTurnClient = useVoiceTurnClient({ mode: "livre", mixedElementSymbols });

  if (!voiceTurnClient.isReady) return null;

  return <FreeModeVoiceCapture voiceTurnClient={voiceTurnClient} />;
}

function FreeModeVoiceCapture({ voiceTurnClient }: {
  voiceTurnClient: ReturnType<typeof useVoiceTurnClient>;
}) {
  const detector = useSileroVoiceActivityDetector({
    onSpeechValidated: voiceTurnClient.beginTurn,
    onSpeechEnd: voiceTurnClient.completeTurn,
  });

  return <VoiceActivityControl detector={detector} />;
}
