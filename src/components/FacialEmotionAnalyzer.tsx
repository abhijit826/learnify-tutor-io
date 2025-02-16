
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmotionData {
  emotion: string;
  confidence: number;
  description: string;
  color: string;
}

export const FacialEmotionAnalyzer = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emotion, setEmotion] = useState<EmotionData | null>(null);
  const { toast } = useToast();

  const emotionDescriptions: Record<string, EmotionData> = {
    happy: {
      emotion: "Happy",
      confidence: 0,
      description: "You appear to be in a positive mood, showing signs of joy and contentment.",
      color: "bg-green-500"
    },
    sad: {
      emotion: "Sad",
      confidence: 0,
      description: "Your expression suggests feelings of sadness or disappointment.",
      color: "bg-blue-500"
    },
    angry: {
      emotion: "Angry",
      confidence: 0,
      description: "Your facial features indicate frustration or anger.",
      color: "bg-red-500"
    },
    surprised: {
      emotion: "Surprised",
      confidence: 0,
      description: "Your expression shows astonishment or unexpected reaction.",
      color: "bg-purple-500"
    },
    neutral: {
      emotion: "Neutral",
      confidence: 0,
      description: "Your expression appears calm and balanced.",
      color: "bg-gray-500"
    }
  };

  const startAnalysis = async () => {
    setIsLoading(true);
    try {
      await tf.ready();
      const model = await faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
      );
      setIsActive(true);
      runFacialAnalysis(model);
    } catch (error) {
      console.error('Error loading facial analysis:', error);
      toast({
        title: "Error",
        description: "Failed to start facial analysis. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const runFacialAnalysis = async (model: faceLandmarksDetection.FaceLandmarksDetector) => {
    const detectFace = async () => {
      if (webcamRef.current && webcamRef.current.video && isActive) {
        const video = webcamRef.current.video;
        const predictions = await model.estimateFaces(video);

        if (predictions.length > 0) {
          const landmarks = predictions[0].keypoints;
          
          const mouthTop = landmarks.find(point => point.name === "lips_upper_center");
          const mouthBottom = landmarks.find(point => point.name === "lips_lower_center");
          const leftEyebrow = landmarks.find(point => point.name === "left_eyebrow_outer");
          const rightEyebrow = landmarks.find(point => point.name === "right_eyebrow_outer");

          let detectedEmotion = "neutral";
          let confidence = 0.7;

          if (mouthTop && mouthBottom) {
            const mouthHeight = Math.abs(mouthTop.y - mouthBottom.y);
            if (mouthHeight > 10) {
              detectedEmotion = "happy";
              confidence = 0.85;
            }
          }

          if (leftEyebrow && rightEyebrow) {
            const eyebrowHeight = (leftEyebrow.y + rightEyebrow.y) / 2;
            if (eyebrowHeight < 50) {
              detectedEmotion = "sad";
              confidence = 0.75;
            }
          }

          setEmotion({
            ...emotionDescriptions[detectedEmotion],
            confidence
          });
        }

        if (isActive) {
          requestAnimationFrame(() => detectFace());
        }
      }
    };

    detectFace();
  };

  const stopAnalysis = () => {
    setIsActive(false);
    setEmotion(null);
  };

  return (
    <Card className="p-6 max-w-xl mx-auto mt-8 bg-white/90 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Facial Expression Analysis</h2>
          <Button
            onClick={isActive ? stopAnalysis : startAnalysis}
            disabled={isLoading}
            variant={isActive ? "destructive" : "default"}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : isActive ? (
              <>
                <CameraOff className="w-4 h-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Start
              </>
            )}
          </Button>
        </div>

        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          {isActive && (
            <Webcam
              ref={webcamRef}
              mirrored
              className="w-full h-full object-cover"
            />
          )}
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <Camera className="w-12 h-12" />
            </div>
          )}
        </div>

        {emotion && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${emotion.color}`} />
              <span className="text-lg font-semibold">{emotion.emotion}</span>
              <span className="text-sm text-gray-500">
                ({Math.round(emotion.confidence * 100)}% confidence)
              </span>
            </div>
            <p className="text-gray-600">{emotion.description}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
