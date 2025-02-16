
import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Book, Calculator, ChevronRight, Lightbulb, History, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TutorResponse {
  explanation: string;
  examples: string[];
  practice: string;
}

interface HistoryItem {
  question: string;
  response: TutorResponse;
  timestamp: Date;
  starred: boolean;
}

const AITutor = () => {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<TutorResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState("ask");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulated AI response
    setTimeout(() => {
      const mockResponse: TutorResponse = {
        explanation: "To solve this type of problem, follow these steps:\n1. Identify the key variables\n2. Apply the relevant formula\n3. Solve step by step",
        examples: [
          "Example 1: x + 5 = 10 → x = 5",
          "Example 2: 2x + 3 = 15 → 2x = 12 → x = 6"
        ],
        practice: "Try solving: 3x + 7 = 22"
      };
      
      setResponse(mockResponse);
      setHistory(prev => [
        { question, response: mockResponse, timestamp: new Date(), starred: false },
        ...prev
      ]);
      
      setIsLoading(false);
      toast({
        title: "Solution Ready!",
        description: "Here's your personalized explanation.",
        className: "bg-blue-50 text-blue-900",
      });
    }, 1500);
  };

  const toggleStarred = (index: number) => {
    setHistory(prev => prev.map((item, i) => 
      i === index ? { ...item, starred: !item.starred } : item
    ));
    
    toast({
      title: history[index].starred ? "Removed from Favorites" : "Added to Favorites",
      description: history[index].starred 
        ? "Question removed from your favorites"
        : "Question saved to your favorites",
      className: history[index].starred 
        ? "bg-yellow-50 text-yellow-900"
        : "bg-green-50 text-green-900",
    });
  };

  const popularTopics = [
    {
      title: "Algebra Basics",
      description: "Learn fundamental algebraic concepts",
      icon: <Calculator className="w-6 h-6" />,
      questions: ["How to solve quadratic equations?", "What is factoring?", "How to solve linear equations?"]
    },
    {
      title: "Geometry Formulas",
      description: "Master geometric calculations",
      icon: <Brain className="w-6 h-6" />,
      questions: ["How to find circle area?", "What is the Pythagorean theorem?", "How to calculate triangle area?"]
    },
    {
      title: "Calculus Help",
      description: "Understanding derivatives and integrals",
      icon: <Book className="w-6 h-6" />,
      questions: ["What is a derivative?", "How to find limits?", "What are integrals used for?"]
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="ask">Ask</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="ask">
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
                    <p className="text-gray-700 whitespace-pre-line">{response.explanation}</p>
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
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center mb-4">
                      {topic.icon}
                      <h3 className="text-lg font-semibold ml-3">{topic.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{topic.description}</p>
                    <div className="space-y-2">
                      {topic.questions.map((q, i) => (
                        <Button
                          key={i}
                          variant="ghost"
                          className="w-full justify-start text-left"
                          onClick={() => {
                            setQuestion(q);
                            setActiveTab("ask");
                          }}
                        >
                          <ChevronRight className="w-4 h-4 mr-2" />
                          {q}
                        </Button>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="max-w-3xl mx-auto space-y-4">
              {history.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{item.question}</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStarred(index)}
                      >
                        <Star className={`w-4 h-4 ${item.starred ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                      </Button>
                      <span className="text-sm text-gray-500">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600">{item.response.explanation}</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <div className="max-w-3xl mx-auto space-y-4">
              {history.filter(item => item.starred).map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{item.question}</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStarred(index)}
                      >
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      </Button>
                      <span className="text-sm text-gray-500">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600">{item.response.explanation}</p>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AITutor;
