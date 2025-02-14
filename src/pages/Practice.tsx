
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calculator, CheckCircle, HelpCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: string[];
  correctAnswer: string;
}

const Practice = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const { toast } = useToast();

  const sampleQuestions: Question[] = [
    {
      id: 1,
      topic: "Algebra",
      difficulty: "Medium",
      question: "Solve for x: 2x + 5 = 13",
      options: ["x = 3", "x = 4", "x = 5", "x = 6"],
      correctAnswer: "x = 4"
    },
    {
      id: 2,
      topic: "Geometry",
      difficulty: "Easy",
      question: "What is the area of a square with side length 5?",
      options: ["20", "25", "30", "35"],
      correctAnswer: "25"
    }
  ];

  const handleAnswerSubmit = (selectedOption: string, correctAnswer: string) => {
    setSelectedAnswer(selectedOption);
    if (selectedOption === correctAnswer) {
      toast({
        title: "Correct!",
        description: "Well done! Let's try another question.",
        className: "bg-green-50 text-green-900",
      });
    } else {
      toast({
        title: "Not quite right",
        description: "Need help? Try our AI Tutor for a detailed explanation.",
        action: (
          <Link to="/ai-tutor">
            <Button variant="outline" size="sm">
              Get Help
            </Button>
          </Link>
        ),
      });
    }
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
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Practice makes perfect! Try these questions and get instant feedback.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {sampleQuestions.map((q) => (
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
                    onClick={() => handleAnswerSubmit(option, q.correctAnswer)}
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
                <div className="mt-4 flex justify-end">
                  <Link to="/ai-tutor">
                    <Button variant="outline" size="sm" className="hover-transform">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Get Help
                    </Button>
                  </Link>
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
