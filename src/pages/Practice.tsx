
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calculator, CheckCircle, HelpCircle, Brain, Gamepad2, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface MathGame {
  id: number;
  type: "speed" | "memory";
  title: string;
  description: string;
}

const Practice = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showExplanation, setShowExplanation] = useState<number | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showGame, setShowGame] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  const generateQuestion = (): Question => {
    const topics = ["Algebra", "Geometry", "Arithmetic"];
    const difficulties = ["Easy", "Medium", "Hard"] as const;
    
    // Generate random numbers for the question
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    
    const questions = [
      {
        topic: "Algebra",
        difficulty: difficulties[Math.floor(Math.random() * 3)],
        question: `Solve for x: ${num1}x + ${num2} = ${num1 * 5 + num2}`,
        options: [`x = ${5 - 1}`, `x = ${5}`, `x = ${5 + 1}`, `x = ${5 + 2}`],
        correctAnswer: "x = 5",
        explanation: `Let's solve this step by step:\n1. Subtract ${num2} from both sides: ${num1}x = ${num1 * 5}\n2. Divide both sides by ${num1}: x = 5`
      },
      {
        topic: "Geometry",
        difficulty: difficulties[Math.floor(Math.random() * 3)],
        question: `What is the area of a rectangle with width ${num1} and length ${num2}?`,
        options: [`${num1 * num2 - 1}`, `${num1 * num2}`, `${num1 * num2 + 1}`, `${num1 * num2 + 2}`],
        correctAnswer: `${num1 * num2}`,
        explanation: `For a rectangle:\n1. Area = length × width\n2. Area = ${num1} × ${num2} = ${num1 * num2}`
      },
      {
        topic: "Arithmetic",
        difficulty: difficulties[Math.floor(Math.random() * 3)],
        question: `What is ${num1} × ${num2}?`,
        options: [`${num1 * num2 - 1}`, `${num1 * num2}`, `${num1 * num2 + 1}`, `${num1 * num2 + 2}`],
        correctAnswer: `${num1 * num2}`,
        explanation: `Let's multiply step by step:\n${num1} × ${num2} = ${num1 * num2}`
      }
    ];

    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    return {
      id: Date.now(),
      ...randomQuestion
    };
  };

  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([
    generateQuestion(),
    generateQuestion()
  ]);

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
      
      // Show game after every 3 correct answers
      if ((score + 1) % 3 === 0) {
        setShowGame(true);
        toast({
          title: "🎮 Game Break!",
          description: "You've earned a fun break! Choose a mini-game to play.",
          className: "bg-purple-50 text-purple-900",
        });
      } else {
        // Generate a new question
        setCurrentQuestions([...currentQuestions, generateQuestion()]);
      }
    } else {
      toast({
        title: "Not quite right",
        description: "Click 'Show Explanation' to see a detailed solution.",
        className: "bg-yellow-50 text-yellow-900",
      });
    }
  };

  const toggleExplanation = (questionId: number) => {
    setShowExplanation(showExplanation === questionId ? null : questionId);
  };

  const handleGameComplete = () => {
    setShowGame(false);
    setCurrentQuestions([...currentQuestions, generateQuestion()]);
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
          <Card className="glass-card p-6 mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Gamepad2 className="w-8 h-8 text-purple-500 mr-2" />
              <h2 className="text-2xl font-bold">Break Time: Mini Game!</h2>
            </div>
            <p className="text-lg mb-4">Time for a quick brain teaser!</p>
            <div className="grid gap-4 md:grid-cols-2">
              {games.map((game) => (
                <Card key={game.id} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors" onClick={handleGameComplete}>
                  <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
                  <p className="text-gray-600">{game.description}</p>
                </Card>
              ))}
            </div>
          </Card>
        ) : null}

        <div className="grid gap-8 md:grid-cols-2">
          {currentQuestions.map((q) => (
            <Card key={q.id} className="glass-card p-6">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-gray-600">{q.topic}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  q.difficulty === "Easy" ? "bg-green-100 text-green-800" :
                  q.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {q.difficulty}
                </span>
              </div>
              
              <p className="text-lg font-medium mb-4">{q.question}</p>
              
              <div className="space-y-3">
                {q.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`w-full justify-start ${
                      selectedAnswer === option && option === q.correctAnswer
                        ? "bg-green-50 text-green-900 border-green-200"
                        : selectedAnswer === option
                        ? "bg-red-50 text-red-900 border-red-200"
                        : ""
                    }`}
                    onClick={() => handleAnswerSubmit(option, q.correctAnswer, q.id)}
                  >
                    {selectedAnswer === option && (
                      <span className="mr-2">
                        {option === q.correctAnswer ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <HelpCircle className="w-4 h-4 text-red-600" />
                        )}
                      </span>
                    )}
                    {option}
                  </Button>
                ))}
              </div>
              
              {selectedAnswer && selectedAnswer !== q.correctAnswer && (
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full hover-transform"
                    onClick={() => toggleExplanation(q.id)}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    {showExplanation === q.id ? "Hide Explanation" : "Show Explanation"}
                  </Button>
                  
                  {showExplanation === q.id && (
                    <Card className="mt-4 p-4 bg-blue-50 border-blue-200">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Brain className="w-4 h-4 mr-2 text-blue-600" />
                        AI Explanation
                      </h4>
                      <p className="text-gray-700 whitespace-pre-line">
                        {q.explanation}
                      </p>
                    </Card>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Practice;
