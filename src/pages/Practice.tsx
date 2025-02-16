
import { Navigation } from "@/components/Navigation";
import { Trophy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Question, MathGame } from "@/types/practice";
import { QuestionCard } from "@/components/practice/QuestionCard";
import { GameBreak } from "@/components/practice/GameBreak";
import { generateQuestion } from "@/utils/questionGenerator";

const Practice = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showExplanation, setShowExplanation] = useState<number | null>(null);
  const [showGame, setShowGame] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(generateQuestion());
  const { toast } = useToast();

  const games: MathGame[] = [
    {
      id: 1,
      type: "speed",
      title: "Quick Math Challenge",
      description: "Solve 3 simple math problems in 30 seconds!"
    },
    {
      id: 2,
      type: "memory",
      title: "Number Memory",
      description: "Remember and repeat the sequence of numbers"
    }
  ];

  const handleAnswerSubmit = (selectedOption: string, correctAnswer: string, questionId: number) => {
    setSelectedAnswer(selectedOption);
    if (selectedOption === correctAnswer) {
      setScore(score + 1);
      toast({
        title: "Correct!",
        description: "Well done! Let's try another question.",
        className: "bg-green-50 text-green-900",
      });
      setShowExplanation(null);
      
      if ((score + 1) % 3 === 0) {
        setShowGame(true);
        toast({
          title: "🎮 Game Break!",
          description: "You've earned a fun break! Choose a mini-game to play.",
          className: "bg-purple-50 text-purple-900",
        });
      } else {
        // Generate next question
        setCurrentQuestion(generateQuestion());
        setSelectedAnswer("");
      }
    } else {
      toast({
        title: "Not quite right",
        description: "Click 'Show Explanation' to see a detailed solution.",
        className: "bg-yellow-50 text-yellow-900",
      });
    }
  };

  const handleGameComplete = () => {
    setShowGame(false);
    setCurrentQuestion(generateQuestion());
    setSelectedAnswer("");
    toast({
      title: "Game Complete!",
      description: "Great job! Back to practice questions.",
      className: "bg-blue-50 text-blue-900",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-4 py-2 rounded-full mb-4">
            Practice Questions
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Test Your Knowledge
          </h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span className="text-xl font-semibold">Score: {score}</span>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Practice makes perfect! Try these questions and get instant feedback.
          </p>
        </div>

        {showGame ? (
          <GameBreak 
            games={games}
            onGameComplete={handleGameComplete}
          />
        ) : (
          <div className="max-w-2xl mx-auto">
            <QuestionCard
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              onAnswerSubmit={handleAnswerSubmit}
              showExplanation={showExplanation}
              onToggleExplanation={(id) => setShowExplanation(showExplanation === id ? null : id)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice;
