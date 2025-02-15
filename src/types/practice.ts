
export interface Question {
  id: number;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface MathGame {
  id: number;
  type: "speed" | "memory";
  title: string;
  description: string;
}
