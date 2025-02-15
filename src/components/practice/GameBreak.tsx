
import { Card } from "@/components/ui/card";
import { Gamepad2 } from "lucide-react";
import { MathGame } from "@/types/practice";

interface GameBreakProps {
  games: MathGame[];
  onGameComplete: () => void;
}

export const GameBreak = ({ games, onGameComplete }: GameBreakProps) => {
  return (
    <Card className="glass-card p-6 mb-8 text-center">
      <div className="flex items-center justify-center mb-4">
        <Gamepad2 className="w-8 h-8 text-purple-500 mr-2" />
        <h2 className="text-2xl font-bold">Break Time: Mini Game!</h2>
      </div>
      <p className="text-lg mb-4">Time for a quick brain teaser!</p>
      <div className="grid gap-4 md:grid-cols-2">
        {games.map((game) => (
          <Card 
            key={game.id} 
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors" 
            onClick={onGameComplete}
          >
            <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
            <p className="text-gray-600">{game.description}</p>
          </Card>
        ))}
      </div>
    </Card>
  );
};
