// src/components/UI/Camera/CameraCapture.tsx
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface CameraCaptureProps {
  onCapture: (file: File | null) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [videoError, setVideoError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play();
        videoRef.current.addEventListener("loadedmetadata", () => {
          console.log(
            "Video metadata loaded:",
            videoRef.current?.videoWidth,
            videoRef.current?.videoHeight
          );
        });
        videoRef.current.addEventListener("error", (error) => {
          console.error("Video error", error);
          setVideoError(t("documents.cameraError") || "Camera error occurred");
        });
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setVideoError(t("documents.cameraError") || "Camera error occurred");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (isCameraActive) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isCameraActive, facingMode]);

  const handleCancel = () => {
    stopCamera();
    setIsCameraActive(false);
    onCapture(null);
  };

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured-image.jpg", {
              type: "image/jpeg",
            });
            onCapture(file);
            stopCamera();
            setIsCameraActive(false);
          } else {
            console.error("Error creating blob from canvas");
          }
        }, "image/jpeg");
      }
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="camera-capture-container">
      {!isCameraActive ? (
        <button
          className="iz_capture-btn iz_btn iz_light-btn"
          type="button"
          onClick={() => setIsCameraActive(true)}>
          {t("documents.activateCamera") || "Activate Camera"}
        </button>
      ) : (
        <>
          {videoError && <p className="camera-error">{videoError}</p>}
          <video
            ref={videoRef}
            className="camera-video"
            autoPlay
            playsInline
            style={{ width: "100%", height: "auto", background: "#000" }}
          />
          <div className="camera-controls">
            <button
              className="iz_capture-btn iz_btn iz_light-btn"
              type="button"
              onClick={takePicture}>
              {t("documents.takePhoto") || "Take Photo"}
            </button>
            <button
              className="iz_capture-btn iz_btn iz_light-btn"
              type="button"
              onClick={handleCancel}>
              {t("documents.cancel") || "Cancel"}
            </button>
            <button
              className="iz_capture-btn iz_btn iz_light-btn"
              type="button"
              onClick={toggleFacingMode}>
              {t("documents.rotateCamera") || "Switch Camera"}
            </button>
          </div>
        </>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CameraCapture;
