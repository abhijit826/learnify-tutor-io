
import { Camera } from "lucide-react";
import Webcam from "react-webcam";
import { RefObject } from "react";

interface WebcamViewProps {
  isActive: boolean;
  webcamRef: RefObject<Webcam>;
}

export const WebcamView = ({ isActive, webcamRef }: WebcamViewProps) => {
  return (
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
  );
};
