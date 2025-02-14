
import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AITutor = () => {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulated API call - replace with actual AI integration
    setTimeout(() => {
      toast({
        title: "Solution Provided",
        description: "Here's a step-by-step explanation to help you understand.",
      });
      setIsLoading(false);
    }, 1500);
  };

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
        </Card>

        {/* Sample Questions Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-6">Popular Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Algebra", "Geometry", "Calculus"].map((topic) => (
              <Button
                key={topic}
                variant="outline"
                className="hover-transform"
                onClick={() => {
                  setQuestion(`Help me understand ${topic}`);
                }}
              >
                {topic}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
