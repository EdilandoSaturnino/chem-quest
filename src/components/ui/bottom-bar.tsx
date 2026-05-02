import { useMemo } from "react";
import type { ChemicalElement } from "../../domain/elements/element";
import { MiniFlask } from "./mini-flask";
import { GoldButton } from "./button";

interface BottomBarProps {
  selectedElements: readonly ChemicalElement[];
  brewing: boolean;
  
  maxElements?: number;
  onRemoveAt: (index: number) => void;
  onClear: () => void;
  onBrew: () => void;
}


export function BottomBar({
  selectedElements,
  brewing,
  maxElements,
  onRemoveAt,
  onClear,
  onBrew,
}: BottomBarProps) {
  const liquidHue = useMemo(() => {
    if (selectedElements.length === 0) return 220;
    const sum = selectedElements.reduce((acc, el) => acc + el.hue, 0);
    return Math.round(sum / selectedElements.length);
  }, [selectedElements]);

  const counterText =
    maxElements
      ? `${selectedElements.length} / ${maxElements}`
      : `${selectedElements.length} ${selectedElements.length === 1 ? "elemento" : "elementos"}`;

  return (
    <div style={{
      background: "linear-gradient(160deg, rgba(40,28,15,0.7), rgba(20,14,8,0.9))",
      border: "1px solid rgba(212,175,55,0.3)",
      borderRadius: 10,
      padding: "12px 16px",
      flexShrink: 0,
    }}>
      {selectedElements.length === 0
        ? <EmptyState />
        : <FilledState
            elements={selectedElements}
            brewing={brewing}
            counterText={counterText}
            liquidHue={liquidHue}
            onRemoveAt={onRemoveAt}
            onClear={onClear}
            onBrew={onBrew}
          />
      }
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 12, padding: "4px 0",
      fontStyle: "italic", color: "rgba(232,213,168,0.45)", fontSize: 14,
    }}>
      <MiniFlask hue={220} filled={false} />
      <span>Toque um elemento para começar a misturar.</span>
    </div>
  );
}

interface FilledStateProps {
  elements: readonly ChemicalElement[];
  brewing: boolean;
  counterText: string;
  liquidHue: number;
  onRemoveAt: (index: number) => void;
  onClear: () => void;
  onBrew: () => void;
}

function FilledState({
  elements, brewing, counterText, liquidHue,
  onRemoveAt, onClear, onBrew,
}: FilledStateProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0,
        animation: brewing ? "brew-shake 0.4s ease-in-out infinite" : "none",
      }}>
        <MiniFlask hue={liquidHue} filled bubbling={brewing} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
          <div style={{
            fontFamily: '"Cinzel", serif', fontSize: 10,
            letterSpacing: "0.22em", textTransform: "uppercase",
            fontWeight: 600, color: "rgba(232,213,168,0.65)",
          }}>
            {brewing ? "Fermentando..." : counterText}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {elements.map((el, idx) => (
              <span
                key={`${el.sym}-${idx}`}
                onClick={() => !brewing && onRemoveAt(idx)}
                style={{
                  cursor: brewing ? "default" : "pointer",
                  animation: "pop-in 0.25s ease-out",
                  background:  `hsla(${el.hue},55%,22%,0.6)`,
                  border:      `1px solid hsla(${el.hue},65%,55%,0.55)`,
                  color:       `hsl(${el.hue},75%,82%)`,
                  fontFamily:  '"Cinzel", serif',
                  padding: "2px 8px", borderRadius: 4, fontSize: 12,
                }}
              >
                {el.sym}
              </span>
            ))}
          </div>
        </div>
      </div>

      {!brewing && (
        <button
          onClick={onClear}
          title="Esvaziar"
          style={{
            background: "transparent", border: "none",
            color: "rgba(232,213,168,0.4)", fontSize: 22,
            padding: "0 8px", cursor: "pointer",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#e8d5a8"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(232,213,168,0.4)"; }}
        >
          ⊗
        </button>
      )}

      <GoldButton
        onClick={onBrew}
        disabled={brewing}
        style={{
          padding: "12px 28px",
          fontSize: 13,
          whiteSpace: "nowrap",
          animation: brewing ? "none" : "pulse-aura 2.4s ease-in-out infinite",
        }}
      >
        {brewing ? "..." : "FERMENTAR"}
      </GoldButton>
    </div>
  );
}