
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Loader2, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface EmotionData {
  emotion: string;
  confidence: number;
  description: string;
  color: string;
}

interface AttentionReport {
  startTime: Date;
  endTime: Date;
  averageAttention: number;
  emotionBreakdown: Record<string, number>;
  attentiveMinutes: number;
  distractedMinutes: number;
}

export const FacialEmotionAnalyzer = ({ 
  isSessionActive = false,
  onReportGenerated = (report: AttentionReport) => {} 
}: { 
  isSessionActive?: boolean;
  onReportGenerated?: (report: AttentionReport) => void;
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emotion, setEmotion] = useState<EmotionData | null>(null);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
  const [attentionScore, setAttentionScore] = useState(0);
  const { toast } = useToast();

  const emotionDescriptions: Record<string, EmotionData> = {
    attentive: {
      emotion: "Attentive",
      confidence: 0,
      description: "You appear to be focused and engaged with the content.",
      color: "bg-green-500"
    },
    distracted: {
      emotion: "Distracted",
      confidence: 0,
      description: "You seem to be losing focus. Try to concentrate more.",
      color: "bg-yellow-500"
    },
    tired: {
      emotion: "Tired",
      confidence: 0,
      description: "You're showing signs of fatigue. Consider taking a short break.",
      color: "bg-red-500"
    },
    neutral: {
      emotion: "Neutral",
      confidence: 0,
      description: "Your expression appears calm and balanced.",
      color: "bg-gray-500"
    }
  };

  useEffect(() => {
    if (isSessionActive && !isActive) {
      startAnalysis();
      setSessionStart(new Date());
    } else if (!isSessionActive && isActive) {
      stopAnalysis();
      generateReport();
    }
  }, [isSessionActive]);

  const generateReport = () => {
    if (!sessionStart) return;

    const endTime = new Date();
    const totalMinutes = (endTime.getTime() - sessionStart.getTime()) / 60000;
    
    const emotionCounts = emotionHistory.reduce((acc, emotion) => {
      acc[emotion.emotion] = (acc[emotion.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const attentiveCount = emotionCounts["Attentive"] || 0;
    const averageAttention = (attentiveCount / emotionHistory.length) * 100;
    
    const report: AttentionReport = {
      startTime: sessionStart,
      endTime,
      averageAttention,
      emotionBreakdown: emotionCounts,
      attentiveMinutes: (attentiveCount / emotionHistory.length) * totalMinutes,
      distractedMinutes: totalMinutes - ((attentiveCount / emotionHistory.length) * totalMinutes)
    };

    onReportGenerated(report);
    setEmotionHistory([]);
    setSessionStart(null);
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

  const calculateAttention = (landmarks: any[]) => {
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

  const runFacialAnalysis = async (model: faceLandmarksDetection.FaceLandmarksDetector) => {
    const detectFace = async () => {
      if (webcamRef.current && webcamRef.current.video && isActive) {
        const video = webcamRef.current.video;
        const predictions = await model.estimateFaces(video);

        if (predictions.length > 0) {
          const landmarks = predictions[0].keypoints;
          const attention = calculateAttention(landmarks);
          setAttentionScore(attention);

          let detectedEmotion = "neutral";
          let confidence = 0.7;

          if (attention > 0.8) {
            detectedEmotion = "attentive";
            confidence = 0.9;
          } else if (attention < 0.4) {
            detectedEmotion = "distracted";
            confidence = 0.8;
          }

          const currentEmotion = {
            ...emotionDescriptions[detectedEmotion],
            confidence
          };

          setEmotion(currentEmotion);
          setEmotionHistory(prev => [...prev, currentEmotion]);
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
          <div>
            <h2 className="text-2xl font-bold">Attention Tracking</h2>
            {sessionStart && (
              <p className="text-sm text-gray-500">
                Session started at: {sessionStart.toLocaleTimeString()}
              </p>
            )}
          </div>
          {!isSessionActive && (
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
          )}
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
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Attention Level</span>
                <span>{Math.round(attentionScore * 100)}%</span>
              </div>
              <Progress value={attentionScore * 100} className="h-2" />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
