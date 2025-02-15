
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, CheckCircle, HelpCircle } from "lucide-react";
import { Question } from "@/types/practice";

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string;
  onAnswerSubmit: (selectedOption: string, correctAnswer: string, questionId: number) => void;
  showExplanation: number | null;
  onToggleExplanation: (questionId: number) => void;
}

export const QuestionCard = ({
  question,
  selectedAnswer,
  onAnswerSubmit,
  showExplanation,
  onToggleExplanation
}: QuestionCardProps) => {
  return (
    <Card className="glass-card p-6">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-medium text-gray-600">{question.topic}</span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          question.difficulty === "Easy" ? "bg-green-100 text-green-800" :
          question.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" :
          "bg-red-100 text-red-800"
        }`}>
          {question.difficulty}
        </span>
      </div>
      
      <p className="text-lg font-medium mb-4">{question.question}</p>
      
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            className={`w-full justify-start ${
              selectedAnswer === option && option === question.correctAnswer
                ? "bg-green-50 text-green-900 border-green-200"
                : selectedAnswer === option
                ? "bg-red-50 text-red-900 border-red-200"
                : ""
            }`}
            onClick={() => onAnswerSubmit(option, question.correctAnswer, question.id)}
          >
            {selectedAnswer === option && (
              <span className="mr-2">
                {option === question.correctAnswer ? (
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
      
      {selectedAnswer && selectedAnswer !== question.correctAnswer && (
        <div className="mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full hover-transform"
            onClick={() => onToggleExplanation(question.id)}
          >
            <Brain className="w-4 h-4 mr-2" />
            {showExplanation === question.id ? "Hide Explanation" : "Show Explanation"}
          </Button>
          
          {showExplanation === question.id && (
            <Card className="mt-4 p-4 bg-blue-50 border-blue-200">
              <h4 className="font-semibold mb-2 flex items-center">
                <Brain className="w-4 h-4 mr-2 text-blue-600" />
                AI Explanation
              </h4>
              <p className="text-gray-700 whitespace-pre-line">
                {question.explanation}
              </p>
            </Card>
          )}
        </div>
      )}
    </Card>
  );
};
