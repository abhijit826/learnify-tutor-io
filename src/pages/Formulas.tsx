
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Formulas = () => {
  const trigFormulas = [
    {
      category: "Basic Ratios",
      formulas: [
        { name: "Sine", formula: "sin θ = opposite / hypotenuse" },
        { name: "Cosine", formula: "cos θ = adjacent / hypotenuse" },
        { name: "Tangent", formula: "tan θ = opposite / adjacent" },
      ]
    },
    {
      category: "Reciprocal Functions",
      formulas: [
        { name: "Cosecant", formula: "csc θ = 1 / sin θ" },
        { name: "Secant", formula: "sec θ = 1 / cos θ" },
        { name: "Cotangent", formula: "cot θ = 1 / tan θ" },
      ]
    },
    {
      category: "Pythagorean Identities",
      formulas: [
        { name: "Main Identity", formula: "sin²θ + cos²θ = 1" },
        { name: "Tangent Identity", formula: "1 + tan²θ = sec²θ" },
        { name: "Cotangent Identity", formula: "1 + cot²θ = csc²θ" },
      ]
    }
  ];

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

        <Tabs defaultValue="basic" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 gap-4">
            <TabsTrigger value="basic">Basic Ratios</TabsTrigger>
            <TabsTrigger value="reciprocal">Reciprocal Functions</TabsTrigger>
            <TabsTrigger value="pythagorean">Pythagorean Identities</TabsTrigger>
          </TabsList>

          {trigFormulas.map((section, index) => (
            <TabsContent key={index} value={section.category.toLowerCase().split(' ')[0]} className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {section.formulas.map((formula, fIndex) => (
                  <Card key={fIndex} className="glass-card p-6 hover-transform">
                    <h3 className="text-lg font-semibold mb-3">{formula.name}</h3>
                    <p className="text-gray-700 font-medium">{formula.formula}</p>
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
