import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildPeriodicLookup,
  CATEGORY_HUE,
  normalizeText,
  PERIODIC_ELEMENTS,
} from "../../domain/periodic/periodic-table";
import { useCountdown } from "../../hooks/useCountdown";

const TOTAL_TIME    = 45;
const POINTS_EACH   = 10;
const STARTER_COUNT = 8;


function pickStarters(count: number): number[] {
  const nums = PERIODIC_ELEMENTS.map(e => e.num);
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = nums[i]!;
    nums[i] = nums[j]!;
    nums[j] = tmp;
  }
  return nums.slice(0, count);
}

interface PeriodicGameScreenProps {
  onBack: () => void;
  onFinished: (params: { score: number; discoveredCount: number }) => void;
}

type Feedback = { kind: "ok" | "dup" | "no"; text: string };

export function PeriodicGameScreen({ onBack, onFinished }: PeriodicGameScreenProps) {
  const [starters] = useState<Set<number>>(() => new Set(pickStarters(STARTER_COUNT)));
  const [discovered, setDiscovered] = useState<Set<number>>(() => new Set(starters));
  const [input,      setInput]      = useState("");
  const [feedback,   setFeedback]   = useState<Feedback | null>(null);
  const [running,    setRunning]    = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const lookup = useMemo(() => buildPeriodicLookup(), []);

  const onTimeout = useRef<() => void>(() => {});


  const earned = Math.max(0, discovered.size - starters.size);

  useEffect(() => {
    onTimeout.current = () => {
      setRunning(false);
      onFinished({ score: earned * POINTS_EACH, discoveredCount: earned });
    };
  }, [earned, onFinished]);

  const { formatted, isLow } = useCountdown({
    totalSeconds: TOTAL_TIME,
    running,
    onFinish: () => onTimeout.current(),
  });

  useEffect(() => { inputRef.current?.focus(); }, []);


  useEffect(() => {
    if (!feedback) return;
    const id = setTimeout(() => setFeedback(null), 1500);
    return () => clearTimeout(id);
  }, [feedback]);

  function tryGuess() {
    const v = input.trim();
    if (!v) return;

    const key = v.length <= 3 ? v.toLowerCase() : normalizeText(v);
    const num = lookup.get(key);

    if (num !== undefined) {
      if (discovered.has(num)) {
        setFeedback({ kind: "dup", text: "já descoberto!" });
      } else {
        const found = PERIODIC_ELEMENTS.find(p => p.num === num);
        setDiscovered(curr => {
          const next = new Set(curr);
          next.add(num);
          return next;
        });
        setFeedback({ kind: "ok", text: `+1 ${found?.name ?? "?"}!` });
      }
    } else {
      setFeedback({ kind: "no", text: "não é um elemento" });
    }
    setInput("");
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <PeriodicTopBar
        onBack={onBack}
        timeStr={formatted}
        timeIsLow={isLow}
        discoveredCount={earned}
        score={earned * POINTS_EACH}
      />

      <InputRow
        inputRef={inputRef}
        value={input}
        onChange={setInput}
        onSubmit={tryGuess}
        feedback={feedback}
      />

      <main style={{ flex: 1, padding: "8px 16px 16px", overflow: "auto" }} className="scrollbar">
        <PeriodicGrid discovered={discovered} starters={starters} />
      </main>
    </div>
  );
}

interface PeriodicTopBarProps {
  onBack: () => void;
  timeStr: string;
  timeIsLow: boolean;
  discoveredCount: number;
  score: number;
}

function PeriodicTopBar({
  onBack, timeStr, timeIsLow, discoveredCount, score,
}: PeriodicTopBarProps) {
  return (
    <header style={{
      padding: "12px 24px", display: "flex", alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid rgba(212,175,55,0.15)",
      flexShrink: 0,
    }}>
      <button
        onClick={onBack}
        className="press"
        style={{
          background: "transparent", border: "none",
          color: "rgba(232,213,168,0.6)",
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 12px", borderRadius: 6, cursor: "pointer",
        }}
      >
        <span style={{ fontSize: 18 }}>←</span>
        <span style={{
          fontSize: 15, letterSpacing: "0.2em", textTransform: "uppercase",
          fontFamily: '"Cinzel", serif',
        }}>Menu</span>
      </button>

      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
        <Stat
          label="Tempo"
          value={timeStr}
          color={timeIsLow ? "#f87171" : "#d4af37"}
          glow={timeIsLow ? "rgba(248,113,113,0.6)" : "rgba(212,175,55,0.4)"}
          shake={timeIsLow}
        />
        <Stat
          label="Acertos"
          value={<><span>{discoveredCount}</span><span style={{ fontSize: 17, color: "rgba(232,213,168,0.4)" }}>/118</span></>}
          color="#10d96a"
        />
        <Stat label="Score" value={score} color="#d4af37" />
      </div>
    </header>
  );
}

function Stat({
  label, value, color, glow, shake = false,
}: {
  label: string;
  value: React.ReactNode;
  color: string;
  glow?: string;
  shake?: boolean;
}) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontSize: 13, letterSpacing: "0.25em", textTransform: "uppercase",
        color: "rgba(232,213,168,0.45)",
      }}>{label}</div>
      <div style={{
        fontFamily: '"Cinzel", serif', fontSize: 28, fontWeight: 700,
        color, textShadow: glow ? `0 0 12px ${glow}` : "none",
        animation: shake ? "brew-shake 0.6s ease-in-out infinite" : "none",
      }}>
        {value}
      </div>
    </div>
  );
}

interface InputRowProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  feedback: Feedback | null;
}

function InputRow({ inputRef, value, onChange, onSubmit, feedback }: InputRowProps) {
  return (
    <div style={{
      padding: "16px 24px", flexShrink: 0,
      display: "flex", justifyContent: "center", alignItems: "center", gap: 12,
    }}>
      <div style={{ position: "relative", maxWidth: 400, width: "100%" }}>
        <input
          ref={inputRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onSubmit()}
          placeholder="Digite símbolo ou nome (ex: H, Ferro, Au...)"
          style={{
            width: "100%", padding: "12px 18px",
            background: "rgba(20,14,8,0.85)",
            border: "1.5px solid rgba(212,175,55,0.4)",
            borderRadius: 8, color: "#e8d5a8",
            fontSize: 17, textAlign: "center",
            fontFamily: '"Cinzel", serif', letterSpacing: "0.05em",
            outline: "none",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#d4af37"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)"; }}
        />
        {feedback && (
          <div style={{
            position: "absolute", top: "100%", left: 0, right: 0,
            textAlign: "center", marginTop: 6,
            fontSize: 17, fontWeight: 600,
            fontFamily: '"Cinzel", serif', letterSpacing: "0.1em",
            color: feedback.kind === "ok" ? "#10d96a"
              : feedback.kind === "dup" ? "#fbbf24"
              : "#f87171",
            animation: "fade-up 0.3s ease-out",
          }}>
            {feedback.text}
          </div>
        )}
      </div>
    </div>
  );
}

function PeriodicGrid({ discovered, starters }: { discovered: Set<number>; starters: Set<number> }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(18, minmax(0, 1fr))",
      gridTemplateRows: "repeat(10, minmax(0, 1fr))",
      gap: 3, height: "100%", minHeight: 380,
      maxWidth: 1400, margin: "0 auto",
    }}>
      {PERIODIC_ELEMENTS.map((p) => {
        const isDiscovered = discovered.has(p.num);
        const isGiven = starters.has(p.num);
        const hue = CATEGORY_HUE[p.cat];
        return (
          <div key={p.num} style={{
            gridRow: p.row, gridColumn: p.col,
            background: isGiven
              ? `linear-gradient(160deg, hsla(${hue},30%,18%,0.9), hsla(${hue},35%,10%,0.9))`
              : isDiscovered
              ? `linear-gradient(160deg, hsla(${hue},65%,30%,0.95), hsla(${hue},80%,16%,0.95))`
              : "rgba(20,14,8,0.5)",
            border: isGiven
              ? `1px dashed hsla(${hue},45%,55%,0.45)`
              : isDiscovered
              ? `1px solid hsla(${hue},85%,65%,0.85)`
              : "1px solid rgba(212,175,55,0.08)",
            borderRadius: 4,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: 2, position: "relative",
            boxShadow: isDiscovered && !isGiven ? `0 0 8px hsla(${hue},85%,55%,0.4)` : "none",
            transition: "all 0.4s",
          }}>
            {isDiscovered ? (
              <>
                <span style={{
                  position: "absolute", top: 1, left: 3,
                  fontSize: 10, color: `hsl(${hue},60%,80%)`, opacity: 0.7,
                }}>{p.num}</span>
                <span style={{
                  fontFamily: '"Cinzel", serif', fontWeight: 700,
                  fontSize: "clamp(10px, 1.1vw, 16px)",
                  color: isGiven ? `hsl(${hue},35%,58%)` : `hsl(${hue},85%,82%)`,
                  textShadow: isGiven ? "none" : `0 0 8px hsl(${hue},80%,55%)`,
                }}>{p.sym}</span>
              </>
            ) : (
              <span style={{
                fontSize: "clamp(12px, 1.2vw, 16px)",
                color: "rgba(212,175,55,0.15)",
              }}>?</span>
            )}
          </div>
        );
      })}
    </div>
  );
}