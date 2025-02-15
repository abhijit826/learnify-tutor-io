
import { Question } from "@/types/practice";

export const generateQuestion = (): Question => {
  const difficulties = ["Easy", "Medium", "Hard"] as const;
  
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  
  const questions = [
    {
      topic: "Algebra",
      difficulty: difficulties[Math.floor(Math.random() * 3)],
      question: `Solve for x: ${num1}x + ${num2} = ${num1 * 5 + num2}`,
      options: [`x = ${5 - 1}`, `x = ${5}`, `x = ${5 + 1}`, `x = ${5 + 2}`],
      correctAnswer: "x = 5",
      explanation: `Let's solve this step by step:\n1. Subtract ${num2} from both sides: ${num1}x = ${num1 * 5}\n2. Divide both sides by ${num1}: x = 5`
    },
    {
      topic: "Geometry",
      difficulty: difficulties[Math.floor(Math.random() * 3)],
      question: `What is the area of a rectangle with width ${num1} and length ${num2}?`,
      options: [`${num1 * num2 - 1}`, `${num1 * num2}`, `${num1 * num2 + 1}`, `${num1 * num2 + 2}`],
      correctAnswer: `${num1 * num2}`,
      explanation: `For a rectangle:\n1. Area = length × width\n2. Area = ${num1} × ${num2} = ${num1 * num2}`
    },
    {
      topic: "Arithmetic",
      difficulty: difficulties[Math.floor(Math.random() * 3)],
      question: `What is ${num1} × ${num2}?`,
      options: [`${num1 * num2 - 1}`, `${num1 * num2}`, `${num1 * num2 + 1}`, `${num1 * num2 + 2}`],
      correctAnswer: `${num1 * num2}`,
      explanation: `Let's multiply step by step:\n${num1} × ${num2} = ${num1 * num2}`
    }
  ];

  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  return {
    id: Date.now(),
    ...randomQuestion
  };
};
