
import { Progress } from "@/components/ui/progress";

interface EmotionData {
  emotion: string;
  confidence: number;
  description: string;
  color: string;
}

interface AttentionIndicatorProps {
  emotion: EmotionData;
  attentionScore: number;
}

export const AttentionIndicator = ({ emotion, attentionScore }: AttentionIndicatorProps) => {
  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${emotion.color}`} />
        <span className="text-lg font-semibold">{emotion.emotion}</span>
        <span className="text-sm text-gray-500">
          ({Math.round(emotion.confidence * 100)}% confidence)
        </span>
      </div>
      <p className="text-gray-600">{emotion.description}</p>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Attention Level</span>
          <span>{Math.round(attentionScore * 100)}%</span>
        </div>
        <Progress value={attentionScore * 100} className="h-2" />
      </div>
    </div>
  );
};
