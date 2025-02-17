
export interface EmotionData {
  emotion: string;
  confidence: number;
  description: string;
  color: string;
}

export const emotionDescriptions: Record<string, Omit<EmotionData, 'confidence'>> = {
  attentive: {
    emotion: "Attentive",
    description: "You appear to be focused and engaged with the content.",
    color: "bg-green-500"
  },
  distracted: {
    emotion: "Distracted",
    description: "You seem to be losing focus. Try to concentrate more.",
    color: "bg-yellow-500"
  },
  tired: {
    emotion: "Tired",
    description: "You're showing signs of fatigue. Consider taking a short break.",
    color: "bg-red-500"
  },
  neutral: {
    emotion: "Neutral",
    description: "Your expression appears calm and balanced.",
    color: "bg-gray-500"
  }
};

export const calculateAttention = (landmarks: any[]): number => {
  const eyesClosed = landmarks.some(point => 
    point.name?.includes('eye') && point.y < 0.3
  );
  const headTilted = landmarks.some(point =>
    point.name?.includes('nose') && Math.abs(point.x - 0.5) > 0.2
  );
  
  let attention = 1.0;
  if (eyesClosed) attention -= 0.3;
  if (headTilted) attention -= 0.3;
  
  return Math.max(0, attention);
};

export const detectEmotion = (attention: number): { emotion: string; confidence: number } => {
  if (attention > 0.8) {
    return { emotion: 'attentive', confidence: 0.9 };
  } else if (attention < 0.4) {
    return { emotion: 'distracted', confidence: 0.8 };
  }
  return { emotion: 'neutral', confidence: 0.7 };
};
