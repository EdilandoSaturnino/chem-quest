import { LoaderCircle, Mic, MicOff } from "lucide-react";
import type { VoiceActivityDetector } from "../../domain/voice/voice-activity-detector";

interface VoiceActivityControlProps {
  detector: VoiceActivityDetector;
}

export function VoiceActivityControl({ detector }: VoiceActivityControlProps) {
  const loading = detector.state === "loading";

  async function toggleListening() {
    if (detector.isListening) {
      await detector.stop();
      return;
    }

    await detector.start();
  }

  return (
    <button
      aria-label={getAccessibleLabel(detector)}
      disabled={loading}
      onClick={() => void toggleListening()}
      title={getAccessibleLabel(detector)}
      style={{
        alignItems: "center", background: "rgba(20,14,8,0.88)",
        border: `1px solid ${getAccentColor(detector)}`, borderRadius: "50%",
        bottom: 16, boxShadow: `0 0 18px ${getAccentColor(detector)}55`,
        color: getAccentColor(detector), display: "flex", height: 46,
        justifyContent: "center", left: 16, padding: 0, position: "fixed",
        transition: "border-color 160ms ease, box-shadow 160ms ease, color 160ms ease",
        width: 46, zIndex: 60,
      }}
    >
      <StatusIcon state={detector.state} />
    </button>
  );
}

function StatusIcon({ state }: { state: VoiceActivityDetector["state"] }) {
  if (state === "loading") {
    return <LoaderCircle aria-hidden size={20} style={{ animation: "spin 1s linear infinite" }} />;
  }

  return state === "idle" || state === "error"
    ? <MicOff aria-hidden size={20} />
    : <Mic aria-hidden size={20} />;
}

function getAccessibleLabel(detector: VoiceActivityDetector): string {
  switch (detector.state) {
    case "loading":
      return "Preparando detector de voz";
    case "idle":
      return "Ativar microfone";
    case "listening":
      return "Desativar microfone";
    case "speaking":
      return "Fala detectada. Desativar microfone";
    case "error":
      return detector.errorMessage ?? "Microfone indisponível";
  }
}

function getAccentColor(detector: VoiceActivityDetector): string {
  switch (detector.state) {
    case "error":
      return "#f87171";
    case "listening":
      return "#60a5fa";
    case "speaking":
      return "#10d96a";
    case "loading":
    case "idle":
      return "#d4af37";
  }
}
