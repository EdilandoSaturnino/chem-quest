import { LoaderCircle, Mic, MicOff } from "lucide-react";

interface VoiceActivityControlProps {
  readonly status: "connecting" | "connected" | "error";
  readonly isMuted: boolean;
  readonly isSpeaking: boolean;
  readonly errorMessage?: string;
  readonly onToggleMute: () => void;
}

export function VoiceActivityControl({
  status,
  isMuted,
  isSpeaking,
  errorMessage,
  onToggleMute,
}: VoiceActivityControlProps) {
  const loading = status === "connecting";
  const failed = status === "error";
  const label = getAccessibleLabel({ status, isMuted, isSpeaking, errorMessage });

  return (
    <button
      aria-label={label}
      disabled={loading || failed}
      onClick={onToggleMute}
      title={label}
      style={{
        alignItems: "center", background: "rgba(20,14,8,0.88)",
        border: `1px solid ${getAccentColor({ status, isMuted, isSpeaking })}`, borderRadius: "50%",
        bottom: 16, boxShadow: `0 0 18px ${getAccentColor({ status, isMuted, isSpeaking })}55`,
        color: getAccentColor({ status, isMuted, isSpeaking }), display: "flex", height: 46,
        justifyContent: "center", left: 16, padding: 0, position: "fixed",
        transition: "border-color 160ms ease, box-shadow 160ms ease, color 160ms ease",
        width: 46, zIndex: 60,
      }}
    >
      <StatusIcon status={status} isMuted={isMuted} />
    </button>
  );
}

function StatusIcon({ status, isMuted }: { status: VoiceActivityControlProps["status"]; isMuted: boolean }) {
  if (status === "connecting") {
    return <LoaderCircle aria-hidden size={20} style={{ animation: "spin 1s linear infinite" }} />;
  }

  return isMuted || status === "error" ? <MicOff aria-hidden size={20} /> : <Mic aria-hidden size={20} />;
}

function getAccessibleLabel({
  status,
  isMuted,
  isSpeaking,
  errorMessage,
}: Pick<VoiceActivityControlProps, "status" | "isMuted" | "isSpeaking" | "errorMessage">): string {
  switch (status) {
    case "connecting":
      return "Conectando assistente de voz";
    case "error":
      return errorMessage ?? "Assistente de voz indisponível";
    case "connected":
      if (isMuted) return "Ativar microfone";
      return isSpeaking ? "Assistente falando. Silenciar microfone" : "Silenciar microfone";
  }
}

function getAccentColor({
  status,
  isMuted,
  isSpeaking,
}: Pick<VoiceActivityControlProps, "status" | "isMuted" | "isSpeaking">): string {
  switch (status) {
    case "error":
      return "#f87171";
    case "connecting":
      return "#d4af37";
    case "connected":
      if (isMuted) return "#d4af37";
      return isSpeaking ? "#10d96a" : "#60a5fa";
  }
}
