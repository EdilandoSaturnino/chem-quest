import { useEffect, useState } from "react";
import { TopBar } from "../../components/layout/top-bar";
import { Wizard } from "../../components/wizard/wizard";
import { GoldButton } from "../../components/ui/button";
import { findElementBySymbol } from "../../domain/elements/element-catalog";
import { pickRandomQuestions, type QuizQuestion } from "../../domain/quiz/quiz-catalog";
import { useIsDesktop } from "../../hooks/useIsDesktop";

const QUIZ_LENGTH = 8;
const POINTS_PER_CORRECT = 50;

interface QuizScreenProps {
  score: number;
  lives: number;
  onScoreGained: (delta: number) => void;
  onLifeLost: () => void;
  onBack: () => void;
  onComplete: () => void;       
  onGameOver: () => void;       
}

export function QuizScreen({
  score, lives,
  onScoreGained, onLifeLost,
  onBack, onComplete, onGameOver,
}: QuizScreenProps) {
  const isDesktop = useIsDesktop();
  const [questions] = useState(() => pickRandomQuestions(QUIZ_LENGTH));
  const [idx,        setIdx]        = useState(0);
  const [picked,     setPicked]     = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [streak,     setStreak]     = useState(0);

  const q = questions[idx]!;
  const isCorrect = picked === q.correct;

  function submit() {
    if (picked == null) return;
    setShowResult(true);
    if (isCorrect) {
      onScoreGained(POINTS_PER_CORRECT);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
      onLifeLost();
    }
  }

  function next() {
    if (idx + 1 >= questions.length) { onComplete(); return; }
    setIdx(i => i + 1);
    setPicked(null);
    setShowResult(false);
  }


  useEffect(() => {
    if (lives <= 0 && showResult) {
      const id = setTimeout(onGameOver, 1500);
      return () => clearTimeout(id);
    }
  }, [lives, showResult, onGameOver]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <TopBar
        onBack={onBack}
        modeLabel="📜 Quiz"
        score={score}
        lives={lives}
        extra={
          <div style={{
            fontFamily: '"Cinzel", serif', fontSize: 14,
            color: "#d4af37", marginTop: 2,
          }}>
            {idx + 1} / {questions.length}
          </div>
        }
      />

      <main style={{
        flex: 1, display: "grid", gap: 16, padding: 16, minHeight: 0,
        gridTemplateColumns: isDesktop ? "320px 1fr" : "1fr",
      }}>
        <QuestionPanel question={q} idx={idx} />
        <AnswerSection
          question={q}
          picked={picked}
          showResult={showResult}
          isCorrect={isCorrect}
          streak={streak}
          isLast={idx + 1 >= questions.length}
          onPick={(i) => !showResult && setPicked(i)}
          onSubmit={submit}
          onNext={next}
        />
      </main>
    </div>
  );
}

function QuestionPanel({ question, idx }: { question: QuizQuestion; idx: number }) {
  return (
    <aside key={idx} style={{
      background: "linear-gradient(160deg, rgba(40,28,15,0.6), rgba(20,14,8,0.85))",
      border: "1px solid rgba(212,175,55,0.25)",
      borderRadius: 12, padding: 20,
      display: "flex", flexDirection: "column", alignItems: "center",
      overflow: "auto",
    }} className="scrollbar">
      <Wizard size={200} />
      <div style={{ marginTop: 16, textAlign: "center", animation: "fade-up 0.4s ease-out" }}>
        <div style={{
          fontFamily: '"Cinzel", serif', fontSize: 10,
          letterSpacing: "0.3em", textTransform: "uppercase",
          color: "rgba(232,213,168,0.5)", marginBottom: 8,
        }}>
          Pergunta {idx + 1}
        </div>
        <p style={{ fontSize: 17, lineHeight: 1.4, margin: 0 }}>
          {question.q}
        </p>
      </div>
    </aside>
  );
}

interface AnswerSectionProps {
  question: QuizQuestion;
  picked: number | null;
  showResult: boolean;
  isCorrect: boolean;
  streak: number;
  isLast: boolean;
  onPick: (i: number) => void;
  onSubmit: () => void;
  onNext: () => void;
}

function AnswerSection({
  question, picked, showResult, isCorrect, streak, isLast,
  onPick, onSubmit, onNext,
}: AnswerSectionProps) {
  return (
    <section style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div style={{
        flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 12, marginBottom: 12, minHeight: 0,
      }}>
        {question.options.map((sym, i) => (
          <AnswerOption
            key={i}
            sym={sym}
            isPicked={picked === i}
            isAnswer={question.correct === i}
            showResult={showResult}
            onClick={() => onPick(i)}
          />
        ))}
      </div>

      {showResult ? (
        <ResultPanel
          isCorrect={isCorrect}
          explain={question.explain}
          streak={streak}
          isLast={isLast}
          onNext={onNext}
        />
      ) : (
        <GoldButton
          onClick={onSubmit}
          disabled={picked == null}
          style={{
            width: "100%", padding: 14, fontSize: 14,
            animation: picked == null ? "none" : "pulse-aura 2.4s ease-in-out infinite",
          }}
        >
          CONFIRMAR
        </GoldButton>
      )}
    </section>
  );
}

interface AnswerOptionProps {
  sym: string;
  isPicked: boolean;
  isAnswer: boolean;
  showResult: boolean;
  onClick: () => void;
}

function AnswerOption({ sym, isPicked, isAnswer, showResult, onClick }: AnswerOptionProps) {
  const el = findElementBySymbol(sym);
  const showRight = showResult && isAnswer;
  const showWrong = showResult && isPicked && !isAnswer;
  const hue = el?.hue ?? 0;

  return (
    <button
      onClick={onClick}
      disabled={showResult}
      className="press"
      style={{
        background: showRight
          ? "linear-gradient(160deg, rgba(16,217,106,0.25), rgba(16,217,106,0.1))"
          : showWrong
          ? "linear-gradient(160deg, rgba(248,113,113,0.25), rgba(248,113,113,0.1))"
          : isPicked
          ? `linear-gradient(160deg, hsla(${hue},65%,30%,0.95), hsla(${hue},80%,15%,0.95))`
          : "linear-gradient(160deg, rgba(40,28,15,0.7), rgba(20,14,8,0.9))",
        border: showRight ? "1.5px solid #10d96a"
          : showWrong ? "1.5px solid #f87171"
          : isPicked ? `1.5px solid hsla(${hue},85%,65%,0.95)`
          : "1px solid rgba(212,175,55,0.25)",
        animation: showRight ? "glow-correct 1.2s ease-in-out" : "none",
        borderRadius: 10, padding: 16,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        color: "#e8d5a8", transition: "all 0.2s",
      }}
    >
      <span style={{
        fontFamily: '"Cinzel", serif', fontWeight: 700,
        fontSize: "clamp(40px, 6vw, 64px)", marginBottom: 6,
        color: showRight ? "#10d96a"
          : showWrong ? "#f87171"
          : `hsl(${hue},${isPicked ? 85 : 60}%,${isPicked ? 80 : 65}%)`,
      }}>{sym}</span>
      <span style={{ fontSize: 16, color: "rgba(232,213,168,0.7)" }}>
        {el?.real ?? sym}
      </span>
    </button>
  );
}

interface ResultPanelProps {
  isCorrect: boolean;
  explain: string;
  streak: number;
  isLast: boolean;
  onNext: () => void;
}

function ResultPanel({ isCorrect, explain, streak, isLast, onNext }: ResultPanelProps) {
  return (
    <div style={{ animation: "fade-up 0.4s ease-out", flexShrink: 0 }}>
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 12,
        padding: 14, borderRadius: 10, marginBottom: 12,
        background: isCorrect
          ? "linear-gradient(160deg, rgba(16,217,106,0.12), rgba(0,0,0,0.5))"
          : "linear-gradient(160deg, rgba(248,113,113,0.12), rgba(0,0,0,0.5))",
        border: `1px solid ${isCorrect ? "rgba(16,217,106,0.4)" : "rgba(248,113,113,0.4)"}`,
      }}>
        <Wizard size={56} intensity={0.5} />
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase",
            marginBottom: 4, color: isCorrect ? "#10d96a" : "#f87171",
          }}>
            {isCorrect ? "✦ Correto!" : "✗ Errou — perdeu uma vida"}
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.4, margin: 0 }}>
            {explain}
          </p>
          {isCorrect && streak > 1 && (
            <p style={{
              fontSize: 12, fontStyle: "italic",
              color: "rgba(232,213,168,0.55)", margin: "4px 0 0",
            }}>
              🔥 Sequência de {streak}!
            </p>
          )}
        </div>
      </div>
      <GoldButton onClick={onNext} style={{ width: "100%", padding: 14, fontSize: 14 }}>
        {isLast ? "FINALIZAR" : "PRÓXIMA"}
      </GoldButton>
    </div>
  );
}