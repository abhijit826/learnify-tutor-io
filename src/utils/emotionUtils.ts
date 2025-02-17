
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

// Calculate eye aspect ratio to detect blinks and attention
const calculateEyeAspectRatio = (eyePoints: any[]) => {
  if (!eyePoints || eyePoints.length < 6) return 1.0;
  
  // Vertical eye landmarks
  const v1 = Math.sqrt(Math.pow(eyePoints[1].x - eyePoints[5].x, 2) + Math.pow(eyePoints[1].y - eyePoints[5].y, 2));
  const v2 = Math.sqrt(Math.pow(eyePoints[2].x - eyePoints[4].x, 2) + Math.pow(eyePoints[2].y - eyePoints[4].y, 2));
  
  // Horizontal eye landmark
  const h = Math.sqrt(Math.pow(eyePoints[0].x - eyePoints[3].x, 2) + Math.pow(eyePoints[0].y - eyePoints[3].y, 2));
  
  // Eye aspect ratio
  return (v1 + v2) / (2.0 * h);
};

export const calculateAttention = (landmarks: any[]): number => {
  if (!landmarks || landmarks.length === 0) return 0.5;

  try {
    // Find eye landmarks
    const leftEyePoints = landmarks.filter(point => 
      point.name && point.name.toLowerCase().includes('left_eye')
    );
    const rightEyePoints = landmarks.filter(point => 
      point.name && point.name.toLowerCase().includes('right_eye')
    );

    // Calculate eye aspect ratios
    const leftEAR = calculateEyeAspectRatio(leftEyePoints);
    const rightEAR = calculateEyeAspectRatio(rightEyePoints);
    
    // Average EAR
    const avgEAR = (leftEAR + rightEAR) / 2.0;

    // Check head position using nose landmark
    const noseLandmark = landmarks.find(point => 
      point.name && point.name.toLowerCase().includes('nose')
    );
    
    const isFacingCamera = noseLandmark ? Math.abs(noseLandmark.z) < 0.1 : true;
    
    // Calculate attention score
    let attention = 1.0;
    
    // Reduce attention if eyes are closed (low EAR)
    if (avgEAR < 0.2) attention -= 0.3;
    
    // Reduce attention if head is turned away
    if (!isFacingCamera) attention -= 0.3;
    
    return Math.max(0, Math.min(1, attention));
  } catch (error) {
    console.error('Error calculating attention:', error);
    return 0.5; // Return neutral attention on error
  }
};

export const detectEmotion = (attention: number): { emotion: string; confidence: number } => {
  if (attention > 0.8) {
    return { emotion: 'attentive', confidence: attention };
  } else if (attention < 0.4) {
    return { emotion: 'distracted', confidence: 1 - attention };
  } else if (attention < 0.6) {
    return { emotion: 'tired', confidence: 0.7 };
  }
  return { emotion: 'neutral', confidence: 0.6 };
};
