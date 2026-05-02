import { useCallback, useState } from "react";
import { GlobalStyles } from "./styles/global-styles";

import { HomeScreen } from "./features/home/home-screen";
import { PlayScreen } from "./features/play/play-screen";
import { QuizScreen } from "./features/quiz/quiz-screen";

import {
  STARTING_LIVES,
  type GameMode,
  type Screen,
  type PlayableMode,
} from "./domain/game/game-mode";
import { PeriodicGameScreen } from "./features/periodic-game/periodic-game-screen";
import { GameOverScreen } from "./features/game-over/came-over-screen";
import { LeaderboardScreen } from "./features/leaderboard/leader-board-screen";
import { AppShell } from "./components/layout/app-shell";

interface GameOverState {
  mode: GameMode;
  score: number;
  discoveredCount?: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [gameOverState, setGameOverState] = useState<GameOverState | null>(null);

  const goHome = useCallback(() => {
    setScore(0);
    setLives(STARTING_LIVES);
    setGameOverState(null);
    setCurrentScreen("home");
  }, []);

  const startMode = useCallback((mode: GameMode) => {
    setScore(0);
    setLives(STARTING_LIVES);
    setGameOverState(null);
    setCurrentScreen(mode);
  }, []);



  const handleScoreGained = useCallback((delta: number) => {
    setScore(s => s + delta);
  }, []);

  const handleLifeLost = useCallback(() => {
    setLives(l => Math.max(0, l - 1));
  }, []);

  const handleGameOver = useCallback((mode: GameMode, finalScore?: number) => {
    setGameOverState({ mode, score: finalScore ?? score });
  }, [score]);



  return (
    <AppShell>
      <GlobalStyles />
      {gameOverState
        ? <GameOverScreen
          score={gameOverState.score}
          mode={gameOverState.mode}
          discoveredCount={gameOverState.discoveredCount}
          onBack={goHome}
        />
        : renderScreen()}
    </AppShell>
  );

  function renderScreen() {
    switch (currentScreen) {
      case "home":
        return <HomeScreen onPick={startMode} />;

      case "livre":
      case "easy":
      case "medium":
      case "hard":
        return (
          <PlayScreen
            mode={currentScreen as PlayableMode}
            score={score}
            lives={lives}
            onScoreGained={handleScoreGained}
            onLifeLost={handleLifeLost}
            onBack={goHome}
            onGameOver={() => handleGameOver(currentScreen)}
          />
        );

      case "quiz":
        return (
          <QuizScreen
            score={score}
            lives={lives}
            onScoreGained={handleScoreGained}
            onLifeLost={handleLifeLost}
            onBack={goHome}
            onComplete={() => handleGameOver("quiz")}
            onGameOver={() => handleGameOver("quiz")}
          />
        );

      case "table":
        return (
          <PeriodicGameScreen
            onBack={goHome}
            onFinished={({ score: finalScore, discoveredCount }) => {
              setGameOverState({
                mode: "table",
                score: finalScore,
                discoveredCount,
              });
            }}
          />
        );

      case "ranking":
        return <LeaderboardScreen onBack={goHome} />;

      default: {

        const _exhaustive: never = currentScreen;
        return _exhaustive;
      }
    }
  }
}