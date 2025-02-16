
import { Card } from "@/components/ui/card";
import { Gamepad2, Timer, Brain } from "lucide-react";
import { MathGame } from "@/types/practice";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface GameBreakProps {
  games: MathGame[];
  onGameComplete: () => void;
}

export const GameBreak = ({ games, onGameComplete }: GameBreakProps) => {
  const [selectedGame, setSelectedGame] = useState<MathGame | null>(null);
  const [gameState, setGameState] = useState<{
    timeLeft?: number;
    numbers?: number[];
    currentNumber?: number;
    score: number;
    stage: 'selection' | 'playing' | 'memory' | 'recall';
  }>({
    score: 0,
    stage: 'selection'
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (selectedGame?.type === 'speed' && gameState.timeLeft && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft ? prev.timeLeft - 1 : 0
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [selectedGame, gameState.timeLeft]);

  const startSpeedGame = () => {
    setGameState({
      timeLeft: 30,
      score: 0,
      stage: 'playing',
      currentNumber: Math.floor(Math.random() * 100)
    });
  };

  const startMemoryGame = () => {
    const sequence = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
    setGameState({
      numbers: sequence,
      score: 0,
      stage: 'memory'
    });
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        stage: 'recall'
      }));
    }, 5000);
  };

  const handleGameSelection = (game: MathGame) => {
    setSelectedGame(game);
    if (game.type === 'speed') {
      startSpeedGame();
    } else {
      startMemoryGame();
    }
  };

  const handleSpeedAnswer = (answer: number) => {
    if (gameState.currentNumber && gameState.timeLeft && gameState.timeLeft > 0) {
      const isCorrect = answer === gameState.currentNumber * 2;
      setGameState(prev => ({
        ...prev,
        score: isCorrect ? prev.score + 1 : prev.score,
        currentNumber: Math.floor(Math.random() * 100)
      }));
    }
    if (gameState.score >= 5 || gameState.timeLeft === 0) {
      onGameComplete();
    }
  };

  const handleMemoryRecall = (numbers: string) => {
    const recalled = numbers.split(',').map(n => parseInt(n.trim()));
    const original = gameState.numbers;
    const isCorrect = original?.every((num, idx) => num === recalled[idx]);
    
    if (isCorrect) {
      setGameState(prev => ({
        ...prev,
        score: prev.score + 1
      }));
    }
    onGameComplete();
  };

  if (!selectedGame) {
    return (
      <Card className="glass-card p-6 mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Gamepad2 className="w-8 h-8 text-purple-500 mr-2" />
          <h2 className="text-2xl font-bold">Break Time: Mini Game!</h2>
        </div>
        <p className="text-lg mb-4">Time for a quick brain teaser!</p>
        <div className="grid gap-4 md:grid-cols-2">
          {games.map((game) => (
            <Card 
              key={game.id} 
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors" 
              onClick={() => handleGameSelection(game)}
            >
              <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
              <p className="text-gray-600">{game.description}</p>
            </Card>
          ))}
        </div>
      </Card>
    );
  }

  if (selectedGame.type === 'speed') {
    return (
      <Card className="glass-card p-6 mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Timer className="w-8 h-8 text-purple-500 mr-2" />
          <h2 className="text-2xl font-bold">Quick Math Challenge</h2>
        </div>
        <p className="text-lg mb-4">Time left: {gameState.timeLeft}s</p>
        <p className="text-2xl mb-4">What is {gameState.currentNumber} × 2?</p>
        <div className="grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => {
            const value = gameState.currentNumber ? gameState.currentNumber * 2 + (i - 1) : 0;
            return (
              <Button
                key={i}
                onClick={() => handleSpeedAnswer(value)}
                variant="outline"
                className="p-4 text-xl"
              >
                {value}
              </Button>
            );
          })}
        </div>
        <p className="mt-4">Score: {gameState.score}/5</p>
      </Card>
    );
  }

  if (selectedGame.type === 'memory') {
    return (
      <Card className="glass-card p-6 mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Brain className="w-8 h-8 text-purple-500 mr-2" />
          <h2 className="text-2xl font-bold">Number Memory</h2>
        </div>
        {gameState.stage === 'memory' && (
          <div>
            <p className="text-lg mb-4">Remember these numbers:</p>
            <div className="text-3xl font-bold mb-4 space-x-4">
              {gameState.numbers?.map((num, idx) => (
                <span key={idx}>{num}</span>
              ))}
            </div>
            <p className="text-sm text-gray-500">Memorize them quickly!</p>
          </div>
        )}
        {gameState.stage === 'recall' && (
          <div>
            <p className="text-lg mb-4">Enter the numbers you saw:</p>
            <input
              type="text"
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter numbers separated by commas"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleMemoryRecall((e.target as HTMLInputElement).value);
                }
              }}
            />
            <p className="text-sm text-gray-500">Press Enter when done</p>
          </div>
        )}
      </Card>
    );
  }

  return null;
};
