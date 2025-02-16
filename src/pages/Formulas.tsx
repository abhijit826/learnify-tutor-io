
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookmarkPlus, Copy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Formula {
  name: string;
  formula: string;
  explanation: string;
  example: string;
}

interface FormulaCategory {
  category: string;
  formulas: Formula[];
}

const Formulas = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedFormulas, setBookmarkedFormulas] = useState<string[]>([]);
  const { toast } = useToast();

  const trigFormulas: FormulaCategory[] = [
    {
      category: "Basic Ratios",
      formulas: [
        {
          name: "Sine",
          formula: "sin θ = opposite / hypotenuse",
          explanation: "The sine of an angle is the ratio of the length of the opposite side to the length of the hypotenuse.",
          example: "In a right triangle with angle θ = 30°, if hypotenuse = 10, then opposite = 5 (sin 30° = 0.5)"
        },
        {
          name: "Cosine",
          formula: "cos θ = adjacent / hypotenuse",
          explanation: "The cosine of an angle is the ratio of the length of the adjacent side to the length of the hypotenuse.",
          example: "In a right triangle with angle θ = 60°, if hypotenuse = 2, then adjacent = 1 (cos 60° = 0.5)"
        },
        {
          name: "Tangent",
          formula: "tan θ = opposite / adjacent",
          explanation: "The tangent of an angle is the ratio of the length of the opposite side to the length of the adjacent side.",
          example: "In a right triangle with angle θ = 45°, if adjacent = 1, then opposite = 1 (tan 45° = 1)"
        }
      ]
    },
    {
      category: "Reciprocal Functions",
      formulas: [
        {
          name: "Cosecant",
          formula: "csc θ = 1 / sin θ",
          explanation: "The cosecant is the reciprocal of sine.",
          example: "If sin θ = 0.5, then csc θ = 2"
        },
        {
          name: "Secant",
          formula: "sec θ = 1 / cos θ",
          explanation: "The secant is the reciprocal of cosine.",
          example: "If cos θ = 0.5, then sec θ = 2"
        },
        {
          name: "Cotangent",
          formula: "cot θ = 1 / tan θ",
          explanation: "The cotangent is the reciprocal of tangent.",
          example: "If tan θ = 1, then cot θ = 1"
        }
      ]
    },
    {
      category: "Pythagorean Identities",
      formulas: [
        {
          name: "Main Identity",
          formula: "sin²θ + cos²θ = 1",
          explanation: "The sum of the squares of sine and cosine of any angle equals 1.",
          example: "For θ = 30°: sin²(30°) + cos²(30°) = 0.25 + 0.75 = 1"
        },
        {
          name: "Tangent Identity",
          formula: "1 + tan²θ = sec²θ",
          explanation: "The sum of 1 and the square of tangent equals the square of secant.",
          example: "For θ = 45°: 1 + tan²(45°) = 1 + 1 = 2 = sec²(45°)"
        },
        {
          name: "Cotangent Identity",
          formula: "1 + cot²θ = csc²θ",
          explanation: "The sum of 1 and the square of cotangent equals the square of cosecant.",
          example: "For θ = 60°: 1 + cot²(60°) = 1 + (1/√3)² = 4/3 = csc²(60°)"
        }
      ]
    }
  ];

  const handleBookmark = (formulaName: string) => {
    setBookmarkedFormulas(prev => {
      const newBookmarks = prev.includes(formulaName)
        ? prev.filter(name => name !== formulaName)
        : [...prev, formulaName];
      
      toast({
        title: prev.includes(formulaName) ? "Formula Removed" : "Formula Saved",
        description: prev.includes(formulaName)
          ? "Formula removed from your bookmarks"
          : "Formula saved to your bookmarks",
        className: prev.includes(formulaName)
          ? "bg-yellow-50 text-yellow-900"
          : "bg-green-50 text-green-900",
      });
      
      return newBookmarks;
    });
  };

  const copyFormula = (formula: string) => {
    navigator.clipboard.writeText(formula);
    toast({
      title: "Copied!",
      description: "Formula copied to clipboard",
      className: "bg-blue-50 text-blue-900",
    });
  };

  const filteredCategories = trigFormulas.map(category => ({
    ...category,
    formulas: category.formulas.filter(formula =>
      !searchQuery ||
      formula.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formula.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formula.explanation.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-4 py-2 rounded-full mb-4">
            Mathematical Formulas
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Trigonometric Formulas
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Essential formulas and identities for trigonometry
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search formulas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 py-6"
            />
          </div>
        </div>

        <Tabs defaultValue="basic" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 gap-4">
            <TabsTrigger value="basic">Basic Ratios</TabsTrigger>
            <TabsTrigger value="reciprocal">Reciprocal Functions</TabsTrigger>
            <TabsTrigger value="pythagorean">Pythagorean Identities</TabsTrigger>
          </TabsList>

          {filteredCategories.map((section, index) => (
            <TabsContent key={index} value={section.category.toLowerCase().split(' ')[0]} className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {section.formulas.map((formula, fIndex) => (
                  <Card key={fIndex} className="glass-card p-6 hover-transform">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold">{formula.name}</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyFormula(formula.formula)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBookmark(formula.name)}
                          className={bookmarkedFormulas.includes(formula.name) ? "text-yellow-500" : ""}
                        >
                          <BookmarkPlus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-gray-700 font-medium">{formula.formula}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Explanation:</h4>
                        <p className="text-gray-600 text-sm">{formula.explanation}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Example:</h4>
                        <p className="text-gray-600 text-sm">{formula.example}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Formulas;
