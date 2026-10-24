import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Cpu, LoaderCircle, TriangleAlert, Usb, X } from "lucide-react";
import type { ChemHardwareControls } from "../../hooks/useChemHardware";
import { theme } from "../../styles/theme";

interface EngineMenuProps {
  hardware: ChemHardwareControls;
}

export function EngineMenu({ hardware }: EngineMenuProps) {
  const [open, setOpen] = useState(false);
  const [configurationOpen, setConfigurationOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const connecting = hardware.status === "connecting";
  const connected = hardware.status === "connected";

  const closeConfiguration = useCallback(() => {
    setConfigurationOpen(false);
    hardware.dismissConnectionError();
  }, [hardware]);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (configurationOpen) closeConfiguration();
      else setOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [configurationOpen, closeConfiguration]);

  useEffect(() => {
    if (configurationOpen) dialogRef.current?.focus();
  }, [configurationOpen]);

  async function toggleArduinoConnection() {
    if (connected) await hardware.disconnect();
    else await hardware.connect();
  }

  const connectionLabel = connected
    ? "Arduino conectado"
    : connecting
      ? "Conectando ao Arduino"
      : hardware.status === "unsupported"
        ? "Web Serial indisponível"
        : hardware.status === "error"
          ? "Falha na conexão"
          : "Arduino desconectado";
  const actionLabel = connected ? "Desconectar" : connecting ? "Conectando…" : "Conectar Arduino";

  function openConfiguration() {
    setOpen(false);
    setConfigurationOpen(true);
  }

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
          width: 40,
          height: 40,
          justifyContent: "center",
          padding: 0,
        }}
      >
        <Cpu size={18} color={theme.colors.gold} aria-hidden />
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

          <button
            type="button"
            role="menuitem"
            className="press"
            onClick={openConfiguration}
            style={{
              width: "100%",
              minHeight: 48,
              padding: "9px 10px",
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radii.sm,
              background: "rgba(212,175,55,0.07)",
              color: theme.colors.text,
              display: "flex",
              alignItems: "center",
              gap: 10,
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <Usb size={19} color={theme.colors.gold} />
            <span style={{ flex: 1 }}>
              <span style={{
                display: "block",
                fontFamily: theme.fonts.heading,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}>
                Configurar Arduino
              </span>
              <span style={{ display: "block", marginTop: 2, color: theme.colors.textDim, fontSize: 15 }}>
                {connectionLabel}
              </span>
            </span>
          </button>
        </div>
      )}

      {configurationOpen && (
        <div
          role="presentation"
          onMouseDown={closeConfiguration}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 150,
            padding: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(4,2,10,0.82)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="arduino-configuration-title"
            tabIndex={-1}
            onMouseDown={event => event.stopPropagation()}
            style={{
              width: "min(100%, 420px)",
              padding: 24,
              border: `1px solid ${theme.colors.gold}`,
              borderRadius: theme.radii.lg,
              background: "linear-gradient(160deg, rgba(48,34,16,0.98), rgba(14,9,6,0.99))",
              boxShadow: "0 0 60px rgba(212,175,55,0.3), inset 0 0 28px rgba(212,175,55,0.06)",
              animation: "result-rise 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
              <div>
                <div style={{ color: theme.colors.gold, fontFamily: theme.fonts.heading, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em" }}>
                  CENTRAL DE CONTROLE
                </div>
                <h2 id="arduino-configuration-title" style={{ margin: "5px 0 0", color: theme.colors.text, fontFamily: theme.fonts.heading, fontSize: 22 }}>
                  Arduino
                </h2>
              </div>
              <button
                type="button"
                className="press"
                aria-label="Fechar configuração do Arduino"
                onClick={closeConfiguration}
                style={{
                  width: 34,
                  height: 34,
                  padding: 0,
                  display: "grid",
                  placeItems: "center",
                  border: `1px solid ${theme.colors.borderStrong}`,
                  borderRadius: theme.radii.sm,
                  background: "rgba(40,28,15,0.6)",
                  color: theme.colors.text,
                  cursor: "pointer",
                }}
              >
                <X size={17} aria-hidden />
              </button>
            </div>

            <div style={{
              marginTop: 20,
              padding: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
              border: `1px solid ${connected ? "rgba(16,217,106,0.45)" : theme.colors.border}`,
              borderRadius: theme.radii.md,
              background: connected ? "rgba(16,217,106,0.08)" : "rgba(212,175,55,0.06)",
            }}>
              {connecting ? <LoaderCircle size={24} color={theme.colors.gold} style={{ animation: "spin 1s linear infinite" }} />
                : connected ? <Check size={24} color={theme.colors.success} />
                  : <Cpu size={24} color={hardware.status === "error" ? theme.colors.danger : theme.colors.gold} />}
              <div>
                <div style={{ color: connected ? theme.colors.success : theme.colors.text, fontFamily: theme.fonts.heading, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em" }}>
                  {connectionLabel}
                </div>
                <div style={{ marginTop: 3, color: theme.colors.textDim, fontSize: 16 }}>
                  {connected ? "Controle do caldeirão pronto para uso." : "Conecte o dispositivo pela porta serial."}
                </div>
              </div>
            </div>

            {hardware.error && (
              <div role="alert" style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 7,
                marginTop: 12,
                color: theme.colors.danger,
                fontSize: 15,
                lineHeight: 1.3,
              }}>
                <TriangleAlert size={17} style={{ flexShrink: 0, marginTop: 1 }} aria-hidden />
                {hardware.error}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
              <button
                type="button"
                className="press"
                onClick={closeConfiguration}
                style={{
                  minHeight: 40,
                  padding: "0 14px",
                  border: `1px solid ${theme.colors.borderStrong}`,
                  borderRadius: theme.radii.sm,
                  background: "rgba(40,28,15,0.6)",
                  color: theme.colors.text,
                  fontFamily: theme.fonts.heading,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                }}
              >
                FECHAR
              </button>
              <button
                type="button"
                className="press"
                disabled={connecting || hardware.status === "unsupported"}
                onClick={() => void toggleArduinoConnection()}
                style={{
                  minHeight: 40,
                  padding: "0 14px",
                  border: "1px solid #5a4216",
                  borderRadius: theme.radii.sm,
                  background: connected ? "rgba(16,217,106,0.16)" : "linear-gradient(180deg, #f4d066 0%, #d4af37 35%, #8b6914 100%)",
                  color: connected ? theme.colors.success : "#1a0a02",
                  fontFamily: theme.fonts.heading,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  cursor: connecting || hardware.status === "unsupported" ? "default" : "pointer",
                  opacity: connecting || hardware.status === "unsupported" ? 0.55 : 1,
                }}
              >
                {actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
