"use client";

import { useState, useEffect, useRef } from "react";

interface VideoThumbnailProps {
  videoSrc: string;
  timestamp: number; // in seconds
  width?: number;
  height?: number;
  className?: string;
}

export default function VideoThumbnail({ 
  videoSrc, 
  timestamp, 
  width = 72, 
  height = 48,
  className = ""
}: VideoThumbnailProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const attemptRef = useRef(0);

  useEffect(() => {
    let isMounted = true;
    attemptRef.current = 0;
    setIsLoading(true);
    setError(false);
    setThumbnailUrl(null);

    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    videoRef.current = video;

    const captureFrame = () => {
      if (!isMounted) return;
      
      try {
        const canvas = document.createElement("canvas");
        canvas.width = width * 2;
        canvas.height = height * 2;
        
        const ctx = canvas.getContext("2d");
        if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          
          // Check if the image is not just black
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          let hasContent = false;
          for (let i = 0; i < data.length; i += 400) {
            if (data[i] > 10 || data[i + 1] > 10 || data[i + 2] > 10) {
              hasContent = true;
              break;
            }
          }
          
          if (hasContent) {
            setThumbnailUrl(dataUrl);
            setIsLoading(false);
          } else if (attemptRef.current < 3) {
            // Retry with slightly different time
            attemptRef.current++;
            video.currentTime = Math.max(0.5, timestamp + attemptRef.current * 0.5);
          } else {
            setIsLoading(false);
            setError(true);
          }
        } else {
          setIsLoading(false);
          setError(true);
        }
      } catch (e) {
        setIsLoading(false);
        setError(true);
      }
    };

    const handleLoadedData = () => {
      if (!isMounted) return;
      // Ensure timestamp is within video duration
      const seekTime = Math.min(Math.max(0.1, timestamp), video.duration - 0.5);
      video.currentTime = seekTime;
    };

    const handleSeeked = () => {
      if (!isMounted) return;
      // Small delay to ensure frame is rendered
      setTimeout(captureFrame, 100);
    };

    const handleError = () => {
      if (!isMounted) return;
      setIsLoading(false);
      setError(true);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("error", handleError);

    // Set source and load
    video.src = videoSrc;
    video.load();

    return () => {
      isMounted = false;
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("error", handleError);
      video.src = "";
      video.load();
    };
  }, [videoSrc, timestamp, width, height]);

  if (isLoading) {
    return (
      <div 
        className={`bg-[#2a2830] flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="w-5 h-5 border-2 border-[rgba(242,239,237,0.2)] border-t-[#ffd563] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !thumbnailUrl) {
    return (
      <div 
        className={`bg-[#2a2830] flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <svg className="w-8 h-8 text-[rgba(242,239,237,0.2)]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 4L20 8H17L15 4H13L15 8H12L10 4H8L10 8H7L5 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V4H18ZM11 15L8 10.5L6 13.5H18L14 8L11 15Z" />
        </svg>
      </div>
    );
  }

  return (
    <img 
      src={thumbnailUrl} 
      alt={`Frame at ${timestamp}s`}
      className={`object-cover ${className}`}
      style={{ width, height }}
    />
  );
}

