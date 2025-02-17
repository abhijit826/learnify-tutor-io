
import { useState, useRef, useEffect } from "react";
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { useToast } from "@/hooks/use-toast";
import { EmotionData, emotionDescriptions, calculateAttention, detectEmotion } from "@/utils/emotionUtils";
import Webcam from "react-webcam";

export interface FaceDetectionState {
  isActive: boolean;
  isLoading: boolean;
  emotion: EmotionData | null;
  attentionScore: number;
  emotionHistory: EmotionData[];
}

export const useFaceDetection = (onEmotionDetected?: (emotion: EmotionData) => void) => {
  const webcamRef = useRef<Webcam>(null);
  const [state, setState] = useState<FaceDetectionState>({
    isActive: false,
    isLoading: false,
    emotion: null,
    attentionScore: 0,
    emotionHistory: [],
  });
  const { toast } = useToast();

  const startAnalysis = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await tf.ready();
      const model = await faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
      );
      setState(prev => ({ ...prev, isActive: true }));
      runFacialAnalysis(model);
    } catch (error) {
      console.error('Error loading facial analysis:', error);
      toast({
        title: "Error",
        description: "Failed to start facial analysis. Please try again.",
        variant: "destructive",
      });
    }
    setState(prev => ({ ...prev, isLoading: false }));
  };

  const runFacialAnalysis = async (model: faceLandmarksDetection.FaceLandmarksDetector) => {
    const detectFace = async () => {
      if (webcamRef.current?.video && state.isActive) {
        const video = webcamRef.current.video;
        const predictions = await model.estimateFaces(video);

        if (predictions.length > 0) {
          const landmarks = predictions[0].keypoints;
          const attention = calculateAttention(landmarks);
          const { emotion: detectedEmotion, confidence } = detectEmotion(attention);
          
          const currentEmotion = {
            ...emotionDescriptions[detectedEmotion],
            confidence
          };

          setState(prev => ({
            ...prev,
            emotion: currentEmotion,
            attentionScore: attention,
            emotionHistory: [...prev.emotionHistory, currentEmotion]
          }));

          onEmotionDetected?.(currentEmotion);
        }

        if (state.isActive) {
          requestAnimationFrame(() => detectFace());
        }
      }
    };

    detectFace();
  };

  const stopAnalysis = () => {
    setState(prev => ({
      ...prev,
      isActive: false,
      emotion: null
    }));
  };

  return {
    webcamRef,
    ...state,
    startAnalysis,
    stopAnalysis,
  };
};
