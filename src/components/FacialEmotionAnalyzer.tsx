
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmotionData, emotionDescriptions, calculateAttention, detectEmotion } from "@/utils/emotionUtils";
import { AttentionIndicator } from "./practice/AttentionIndicator";

interface AttentionReport {
  startTime: Date;
  endTime: Date;
  averageAttention: number;
  emotionBreakdown: Record<string, number>;
  attentiveMinutes: number;
  distractedMinutes: number;
}

interface FacialEmotionAnalyzerProps {
  isSessionActive?: boolean;
  onReportGenerated?: (report: AttentionReport) => void;
}

export const FacialEmotionAnalyzer = ({ 
  isSessionActive = false,
  onReportGenerated = () => {} 
}: FacialEmotionAnalyzerProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emotion, setEmotion] = useState<EmotionData | null>(null);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
  const [attentionScore, setAttentionScore] = useState(0);
  const { toast } = useToast();

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

  const runFacialAnalysis = async (model: faceLandmarksDetection.FaceLandmarksDetector) => {
    const detectFace = async () => {
      if (webcamRef.current && webcamRef.current.video && isActive) {
        const video = webcamRef.current.video;
        const predictions = await model.estimateFaces(video);

        if (predictions.length > 0) {
          const landmarks = predictions[0].keypoints;
          const attention = calculateAttention(landmarks);
          setAttentionScore(attention);

          const { emotion: detectedEmotion, confidence } = detectEmotion(attention);
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
          <AttentionIndicator emotion={emotion} attentionScore={attentionScore} />
        )}
      </div>
    </Card>
  );
};
