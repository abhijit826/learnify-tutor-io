
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Loader2 } from "lucide-react";
import { EmotionData } from "@/utils/emotionUtils";
import { AttentionIndicator } from "./practice/AttentionIndicator";
import { WebcamView } from "./webcam/WebcamView";
import { useFaceDetection } from "@/hooks/useFaceDetection";

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
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  
  const {
    webcamRef,
    isActive,
    isLoading,
    emotion,
    attentionScore,
    emotionHistory,
    startAnalysis,
    stopAnalysis,
  } = useFaceDetection();

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
    setSessionStart(null);
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

        <WebcamView isActive={isActive} webcamRef={webcamRef} />

        {emotion && (
          <AttentionIndicator emotion={emotion} attentionScore={attentionScore} />
        )}
      </div>
    </Card>
  );
};
