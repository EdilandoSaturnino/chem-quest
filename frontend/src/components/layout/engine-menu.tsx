import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Cpu, LoaderCircle, TriangleAlert, Usb } from "lucide-react";
import type { ChemHardwareControls } from "../../hooks/useChemHardware";
import { theme } from "../../styles/theme";

interface EngineMenuProps {
  hardware: ChemHardwareControls;
}

export function EngineMenu({ hardware }: EngineMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const connecting = hardware.status === "connecting";
  const connected = hardware.status === "connected";

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  async function connectArduino() {
    await hardware.connect();
  }

  const actionLabel = connected ? "Arduino conectado" : "Conectar Arduino";

  return (
    <div ref={menuRef} style={{ position: "fixed", top: 12, left: 16, zIndex: 100 }}>
      <button
        type="button"
        className="press"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Abrir painel do motor"
        onClick={() => setOpen(current => !current)}
        style={{
          background: "linear-gradient(160deg, rgba(56,40,18,0.96), rgba(20,14,8,0.98))",
          border: `1px solid ${open ? theme.colors.gold : theme.colors.borderStrong}`,
          borderRadius: theme.radii.sm,
          boxShadow: open ? "0 0 22px rgba(212,175,55,0.28)" : "0 4px 16px rgba(0,0,0,0.3)",
          color: theme.colors.text,
          display: "flex",
          alignItems: "center",
          gap: 7,
          minHeight: 40,
          padding: "7px 10px",
        }}
      >
        <Cpu size={18} color={theme.colors.gold} aria-hidden />
        <span style={{
          fontFamily: theme.fonts.heading,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.16em",
        }}>
          MOTOR
        </span>
        <ChevronDown
          size={15}
          aria-hidden
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.18s" }}
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Opções do motor"
          style={{
            width: 248,
            marginTop: 8,
            padding: 8,
            border: `1px solid ${theme.colors.borderStrong}`,
            borderRadius: theme.radii.md,
            background: "linear-gradient(160deg, rgba(40,28,15,0.98), rgba(12,8,6,0.99))",
            boxShadow: "0 16px 36px rgba(0,0,0,0.52), 0 0 22px rgba(212,175,55,0.14)",
            animation: "fade-up 0.18s ease-out",
          }}
        >
          <div style={{
            padding: "5px 8px 8px",
            color: theme.colors.textFaint,
            fontFamily: theme.fonts.heading,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}>
            Dispositivos do laboratório
          </div>

          <button
            type="button"
            role="menuitem"
            className="press"
            disabled={connecting || connected || hardware.status === "unsupported"}
            onClick={() => void connectArduino()}
            style={{
              width: "100%",
              minHeight: 48,
              padding: "9px 10px",
              border: `1px solid ${connected ? "rgba(16,217,106,0.45)" : theme.colors.border}`,
              borderRadius: theme.radii.sm,
              background: connected ? "rgba(16,217,106,0.10)" : "rgba(212,175,55,0.07)",
              color: connected ? theme.colors.success : theme.colors.text,
              display: "flex",
              alignItems: "center",
              gap: 10,
              textAlign: "left",
              opacity: hardware.status === "unsupported" ? 0.5 : 1,
              cursor: connecting || connected || hardware.status === "unsupported" ? "default" : "pointer",
            }}
          >
            {connecting ? <LoaderCircle size={19} style={{ animation: "spin 1s linear infinite" }} />
              : connected ? <Check size={19} />
                : <Usb size={19} color={theme.colors.gold} />}
            <span style={{ flex: 1 }}>
              <span style={{
                display: "block",
                fontFamily: theme.fonts.heading,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}>
                {connecting ? "Conectando…" : actionLabel}
              </span>
              <span style={{ display: "block", marginTop: 2, color: theme.colors.textDim, fontSize: 15 }}>
                {hardware.status === "unsupported" ? "Web Serial não disponível" : "Controle do caldeirão"}
              </span>
            </span>
          </button>

          {hardware.error && (
            <div role="alert" style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 6,
              margin: "8px 3px 2px",
              color: theme.colors.danger,
              fontSize: 14,
              lineHeight: 1.25,
            }}>
              <TriangleAlert size={15} style={{ flexShrink: 0, marginTop: 1 }} aria-hidden />
              {hardware.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
