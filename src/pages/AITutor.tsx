
import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Brain, Book, Calculator, ChevronRight, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TutorResponse {
  explanation: string;
  examples: string[];
  practice: string;
}

const AITutor = () => {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<TutorResponse | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulated AI response - replace with actual AI integration
    setTimeout(() => {
      const mockResponse: TutorResponse = {
        explanation: "Here's how to solve this type of problem...",
        examples: ["Example 1: x + 5 = 10", "Example 2: 2x + 3 = 15"],
        practice: "Try solving: 3x + 7 = 22"
      };
      setResponse(mockResponse);
      setIsLoading(false);
      toast({
        title: "Solution Ready!",
        description: "Here's your personalized explanation.",
        className: "bg-blue-50 text-blue-900",
      });
    }, 1500);
  };

  const popularTopics = [
    {
      title: "Algebra Basics",
      description: "Learn fundamental algebraic concepts",
      icon: <Calculator className="w-6 h-6" />
    },
    {
      title: "Geometry Formulas",
      description: "Master geometric calculations",
      icon: <Brain className="w-6 h-6" />
    },
    {
      title: "Calculus Help",
      description: "Understanding derivatives and integrals",
      icon: <Book className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-4 py-2 rounded-full mb-4">
            AI Tutor
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Personal Math Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ask any math question and receive clear, step-by-step explanations
          </p>
        </div>

        <Card className="glass-card max-w-3xl mx-auto p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Your Math Question
              </label>
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="E.g., How do I solve quadratic equations?"
                className="w-full p-4"
              />
            </div>
            
            <Button
              type="submit"
              disabled={!question || isLoading}
              className="w-full py-6 hover-transform"
            >
              {isLoading ? (
                <Brain className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Get Help"
              )}
            </Button>
          </form>

          {response && (
            <div className="mt-8 space-y-6 animate-fade-in">
              <Card className="p-6 bg-blue-50">
                <h3 className="text-lg font-semibold flex items-center mb-4">
                  <Lightbulb className="w-5 h-5 mr-2 text-blue-600" />
                  Explanation
                </h3>
                <p className="text-gray-700">{response.explanation}</p>
              </Card>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Examples</h3>
                {response.examples.map((example, index) => (
                  <Card key={index} className="p-4 bg-gray-50">
                    <p className="text-gray-700">{example}</p>
                  </Card>
                ))}
              </div>

              <Card className="p-6 bg-green-50">
                <h3 className="text-lg font-semibold flex items-center mb-4">
                  <Brain className="w-5 h-5 mr-2 text-green-600" />
                  Practice Problem
                </h3>
                <p className="text-gray-700">{response.practice}</p>
              </Card>
            </div>
          )}
        </Card>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Popular Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularTopics.map((topic, index) => (
              <Card
                key={index}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setQuestion(topic.title)}
              >
                <div className="flex items-center mb-4">
                  {topic.icon}
                  <h3 className="text-lg font-semibold ml-3">{topic.title}</h3>
                </div>
                <p className="text-gray-600">{topic.description}</p>
                <ChevronRight className="w-5 h-5 text-gray-400 mt-4 ml-auto" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
