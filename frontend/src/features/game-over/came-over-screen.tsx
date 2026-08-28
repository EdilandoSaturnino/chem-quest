import { useState } from "react";
import { Wizard } from "../../components/wizard/wizard";
import { GoldButton, GhostButton } from "../../components/ui/button";
import { SpeechBubble } from "../../components/ui/speech-bubble";
import { leaderboardRepository } from "../../infra/local-storage-leaderboard-repository";
import type { GameMode } from "../../domain/game/game-mode";
import { MODE_CONFIG } from "../../domain/game/game-mode";

interface GameOverScreenProps {
  score: number;
  mode: GameMode;
  
  discoveredCount?: number;
  onBack: () => void;
}

export function GameOverScreen({ score, mode, discoveredCount, onBack }: GameOverScreenProps) {
  const [name,  setName]  = useState("");
  const [saved, setSaved] = useState(false);

  const isPeriodicMode = mode === "table";
  const trimmedName = name.trim();

  function handleSave() {
    if (!trimmedName || saved || score <= 0) return;
    leaderboardRepository.add({ name: trimmedName.slice(0, 20), score, mode });
    setSaved(true);
  }

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px", overflow: "auto",
    }} className="scrollbar">

      <div style={{
        maxWidth: 540, width: "100%",
        background: "linear-gradient(160deg, rgba(40,28,15,0.85), rgba(20,14,8,0.95))",
        border: "1px solid rgba(212,175,55,0.4)",
        borderRadius: 14, padding: 32,
        boxShadow: "0 0 48px rgba(212,175,55,0.18)",
        animation: "result-rise 0.5s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <div style={{
          display: "flex", alignItems: "flex-start",
          gap: 16, marginBottom: 24,
        }}>
          <Wizard size={120} intensity={0.7} />
          <SpeechBubble>
            <p style={{
              fontFamily: '"Cinzel", serif', color: "#d4af37",
              fontWeight: 600, margin: "0 0 6px",
            }}>
              Sua jornada termina aqui...
            </p>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.4 }}>
              Mas o conhecimento que você adquiriu permanece. Registre seu
              nome no <em>Hall da Fama</em>, jovem alquimista!
            </p>
          </SpeechBubble>
        </div>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase",
            color: "rgba(232,213,168,0.45)", marginBottom: 4,
          }}>
            Pontuação Final
          </div>
          <div style={{
            fontFamily: '"Cinzel", serif', fontWeight: 900,
            fontSize: 64, color: "#d4af37",
            textShadow: "0 0 24px rgba(212,175,55,0.55)",
            lineHeight: 1,
          }}>
            {score}
          </div>
          {isPeriodicMode && discoveredCount !== undefined && (
            <div style={{
              fontSize: 13, fontStyle: "italic",
              color: "rgba(232,213,168,0.6)", marginTop: 8,
            }}>
              {discoveredCount} de 118 elementos descobertos
            </div>
          )}
          <div style={{
            fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
            color: "rgba(232,213,168,0.5)", marginTop: 8,
            fontFamily: '"Cinzel", serif',
          }}>
            {MODE_CONFIG[mode]?.emoji} {MODE_CONFIG[mode]?.title}
          </div>
        </div>

        {score > 0 && !saved && (
          <NameInput
            name={name}
            onChange={setName}
            onSave={handleSave}
            canSave={trimmedName.length > 0}
          />
        )}

        {saved && (
          <div style={{
            textAlign: "center", padding: "12px",
            background: "rgba(16,217,106,0.1)",
            border: "1px solid rgba(16,217,106,0.4)",
            borderRadius: 8, marginBottom: 20,
            color: "#10d96a",
            fontFamily: '"Cinzel", serif', fontSize: 13,
            letterSpacing: "0.2em", textTransform: "uppercase",
          }}>
            ✦ Nome registrado!
          </div>
        )}

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <GhostButton onClick={onBack}>VOLTAR AO MENU</GhostButton>
        </div>
      </div>
    </div>
  );
}

interface NameInputProps {
  name: string;
  onChange: (v: string) => void;
  onSave: () => void;
  canSave: boolean;
}

function NameInput({ name, onChange, onSave, canSave }: NameInputProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: "block", fontSize: 10,
        letterSpacing: "0.25em", textTransform: "uppercase",
        color: "rgba(232,213,168,0.55)", marginBottom: 6,
        fontFamily: '"Cinzel", serif',
      }}>
        Seu nome de alquimista
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={name}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === "Enter" && canSave && onSave()}
          maxLength={20}
          placeholder="Ex: Aprendiz Magnus"
          style={{
            flex: 1, padding: "10px 14px",
            background: "rgba(20,14,8,0.85)",
            border: "1.5px solid rgba(212,175,55,0.4)",
            borderRadius: 6, color: "#e8d5a8",
            fontSize: 15, fontFamily: '"Cinzel", serif',
            letterSpacing: "0.05em", outline: "none",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#d4af37"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)"; }}
          autoFocus
        />
        <GoldButton onClick={onSave} disabled={!canSave}>
          REGISTRAR
        </GoldButton>
      </div>
    </div>
  );
}