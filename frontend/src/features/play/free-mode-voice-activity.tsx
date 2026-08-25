import { VoiceActivityControl } from "../../components/voice/voice-activity-control";
import { useSileroVoiceActivityDetector } from "../../infra/voice/use-silero-voice-activity-detector";

export function FreeModeVoiceActivity() {
  const detector = useSileroVoiceActivityDetector();

  return <VoiceActivityControl detector={detector} />;
}
