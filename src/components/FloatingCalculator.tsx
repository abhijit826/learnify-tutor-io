
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calculator, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const FloatingCalculator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const handleNumber = (num: string) => {
    if (display === "0" || shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperation = (op: string) => {
    setPreviousValue(display);
    setOperation(op);
    setShouldResetDisplay(true);
  };

  const handleEqual = () => {
    if (!previousValue || !operation) return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(display);
    let result = 0;

    switch (operation) {
      case "+":
        result = prev + current;
        break;
      case "-":
        result = prev - current;
        break;
      case "×":
        result = prev * current;
        break;
      case "÷":
        result = prev / current;
        break;
    }

    setDisplay(result.toString());
    setPreviousValue(null);
    setOperation(null);
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
  };

  const handleDecimal = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-12 h-12 bg-purple-600 hover:bg-purple-700 shadow-lg"
        >
          <Calculator className="w-6 h-6" />
        </Button>
      ) : (
        <Card className="p-4 bg-white/90 backdrop-blur-sm shadow-xl rounded-lg w-72 animate-in zoom-in-90 duration-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600">Calculator</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="bg-gray-100 p-3 rounded-lg mb-4 text-right">
            <div className="text-2xl font-medium text-gray-800">{display}</div>
            {previousValue && (
              <div className="text-sm text-gray-500">
                {previousValue} {operation}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              "7", "8", "9", "÷",
              "4", "5", "6", "×",
              "1", "2", "3", "-",
              "0", ".", "=", "+"
            ].map((btn) => (
              <Button
                key={btn}
                onClick={() => {
                  switch (btn) {
                    case "=":
                      handleEqual();
                      break;
                    case "+":
                    case "-":
                    case "×":
                    case "÷":
                      handleOperation(btn);
                      break;
                    case ".":
                      handleDecimal();
                      break;
                    default:
                      handleNumber(btn);
                  }
                }}
                className={cn(
                  "h-12 text-lg font-medium",
                  btn === "=" && "bg-purple-600 hover:bg-purple-700 text-white col-span-1",
                  (btn === "+" || btn === "-" || btn === "×" || btn === "÷") && 
                    "bg-gray-200 hover:bg-gray-300 text-gray-700"
                )}
                variant={
                  btn === "=" ? "default" :
                  (btn === "+" || btn === "-" || btn === "×" || btn === "÷") ? "outline" :
                  "ghost"
                }
              >
                {btn}
              </Button>
            ))}
            <Button
              onClick={handleClear}
              className="col-span-4 mt-2 bg-red-100 hover:bg-red-200 text-red-600"
              variant="ghost"
            >
              Clear
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
