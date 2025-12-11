"use client";

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { loadVideoData, getMarkers, getSentimentMarkers, getVideoDuration, type TranscriptEntry } from "@/data/videoData";

// Export ref type for parent components
export interface VideoPlayerRef {
  seekTo: (seconds: number, autoPlay?: boolean) => void;
  seekAndToggle: (seconds: number) => void;
  pause: () => void;
  getIsPlaying: () => boolean;
}

// Marker click data
export interface MarkerClickData {
  id: string;
  timestamp: string;
  seconds: number;
  type: "sentiment" | "keyword" | "marker";
  label: string;
  description: string;
}

interface VideoPlayerProps {
  onMarkerClick?: (data: MarkerClickData) => void;
  highlightedSentiment?: string | null;
  highlightedKeyword?: string | null;
  highlightedMarkerId?: number | null; // Highlight specific marker by ID
  onPlayStateChange?: (isPlaying: boolean, currentTime: number) => void;
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5V19L19 12L8 5Z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19H10V5H6V19ZM14 5V19H18V5H14Z" />
    </svg>
  );
}

function SkipBackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6H8V18H6V6ZM9.5 12L18 18V6L9.5 12Z" />
    </svg>
  );
}

function SkipForwardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 6H16V18H18V6ZM14.5 12L6 6V18L14.5 12Z" />
    </svg>
  );
}

function FlagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.4 6L14 4H5V21H7V14H12.6L13 16H20V6H14.4Z" />
    </svg>
  );
}

function ZoomIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14ZM12 10H10V12H9V10H7V9H9V7H10V9H12V10Z" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.02 5.25 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z" />
    </svg>
  );
}

function VolumeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9V15H7L12 20V4L7 9H3ZM16.5 12C16.5 10.23 15.48 8.71 14 7.97V16.02C15.48 15.29 16.5 13.77 16.5 12ZM14 3.23V5.29C16.89 6.15 19 8.83 19 12C19 15.17 16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12C21 7.72 18.01 4.14 14 3.23Z" />
    </svg>
  );
}

function FullscreenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 14H5V19H10V17H7V14ZM5 10H7V7H10V5H5V10ZM17 17H14V19H19V14H17V17ZM14 5V7H17V10H19V5H14Z" />
    </svg>
  );
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(function VideoPlayer({ onMarkerClick, highlightedSentiment, highlightedKeyword, highlightedMarkerId, onPlayStateChange }, ref) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [videoData, setVideoData] = useState<TranscriptEntry[]>([]);
  
  // Zoom state
  const [zoomLevel, setZoomLevel] = useState(3); // 3 = default view
  const ZOOM_LEVELS = [2.2, 2.5, 3, 3.2, 3.5]; // Predefined zoom levels
  const MIN_ZOOM_LEVEL = ZOOM_LEVELS[0];
  const MAX_ZOOM_LEVEL = ZOOM_LEVELS[ZOOM_LEVELS.length - 1];
  const [scrollOffset, setScrollOffset] = useState(0); // For manual scrolling when zoomed
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Ref to store pending scroll target (used when seeking from outside)
  const pendingScrollRef = useRef<number | null>(null);

  // Expose seekTo function to parent
  useImperativeHandle(ref, () => ({
    seekTo: (seconds: number, autoPlay: boolean = true) => {
      if (videoRef.current) {
        videoRef.current.currentTime = seconds;
        setCurrentTime(seconds);
        // Mark for auto-scroll (will be handled by effect after duration is known)
        pendingScrollRef.current = seconds;
        // Auto play when seeking (only if autoPlay is true)
        if (autoPlay && !isPlaying) {
          videoRef.current.play();
          setIsPlaying(true);
        }
      }
    },
    // Seek to position and toggle play/pause
    seekAndToggle: (seconds: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = seconds;
        setCurrentTime(seconds);
        // Mark for auto-scroll
        pendingScrollRef.current = seconds;
        // Toggle play/pause
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          videoRef.current.play();
          setIsPlaying(true);
        }
      }
    },
    // Pause the video
    pause: () => {
      if (videoRef.current && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    },
    // Get current playing state
    getIsPlaying: () => isPlaying
  }), [isPlaying]);

  // Notify parent when play state changes
  useEffect(() => {
    onPlayStateChange?.(isPlaying, currentTime);
  }, [isPlaying, currentTime, onPlayStateChange]);

  // Load CSV data on mount
  useEffect(() => {
    const loadData = async () => {
      const data = await loadVideoData();
      setVideoData(data);
    };
    loadData();
  }, []);

  // Get markers from loaded data
  const markers = getMarkers(videoData);
  const sentimentMarkers = getSentimentMarkers(videoData);
  const csvVideoDuration = getVideoDuration(videoData);
  
  // Handle pending scroll (when seeking from outside via ref)
  useEffect(() => {
    if (pendingScrollRef.current !== null && csvVideoDuration > 0) {
      const targetSeconds = pendingScrollRef.current;
      const visDuration = csvVideoDuration / zoomLevel;
      
      // Only scroll if we can't see the full video
      if (visDuration < csvVideoDuration) {
        // Center the target time in the visible window
        const newOffset = Math.max(0, Math.min(
          csvVideoDuration - visDuration,
          targetSeconds - visDuration / 2
        ));
        setScrollOffset(newOffset);
      }
      // Clear pending scroll
      pendingScrollRef.current = null;
    }
  }, [currentTime, csvVideoDuration, zoomLevel]);

  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Handle video loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration) {
      setDuration(videoRef.current.duration);
    }
  };

  // Handle duration change (backup for loadedmetadata)
  const handleDurationChange = () => {
    if (videoRef.current && videoRef.current.duration && !isNaN(videoRef.current.duration)) {
      setDuration(videoRef.current.duration);
    }
  };

  // Handle can play - another backup
  const handleCanPlay = () => {
    if (videoRef.current && videoRef.current.duration && !isNaN(videoRef.current.duration) && duration === 0) {
      setDuration(videoRef.current.duration);
    }
  };

  // Handle progress bar click (zoom-aware)
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickPercent = (e.clientX - rect.left) / rect.width;
      // Convert click position to actual time based on visible window
      const clickedTime = visibleWindow.start + (clickPercent * visibleDuration);
      videoRef.current.currentTime = Math.max(0, Math.min(clickedTime, effectiveDuration));
      setCurrentTime(Math.max(0, Math.min(clickedTime, effectiveDuration)));
    }
  };

  // Skip forward/backward
  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  // Change playback speed
  const cyclePlaybackRate = () => {
    const rates = [0.5, 1, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    const newRate = rates[nextIndex];
    setPlaybackRate(newRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = newRate;
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  // Use CSV duration as source of truth (browser may read incorrect duration from video metadata)
  const effectiveDuration = csvVideoDuration;
  
  // Zoom calculations - max 5x zoom
  const visibleDuration = effectiveDuration / zoomLevel;
  
  // Calculate visible window based on scroll offset or playhead
  const getVisibleWindow = () => {
    // If visible duration covers the entire video, show all
    if (visibleDuration >= effectiveDuration) {
      return { start: 0, end: effectiveDuration };
    }
    
    // Use scroll offset if set, otherwise center on playhead
    let start: number;
    if (scrollOffset > 0 || !isPlaying) {
      // Manual scroll mode - use scroll offset
      start = scrollOffset;
    } else {
      // Auto-follow mode when playing - center on playhead
      start = currentTime - visibleDuration / 2;
    }
    
    let end = start + visibleDuration;
    
    // Clamp to bounds
    if (start < 0) {
      start = 0;
      end = visibleDuration;
    }
    if (end > effectiveDuration) {
      end = effectiveDuration;
      start = Math.max(0, effectiveDuration - visibleDuration);
    }
    
    return { start, end };
  };
  
  const visibleWindow = getVisibleWindow();
  
  // Update scroll offset when playing to follow playhead
  useEffect(() => {
    if (isPlaying && visibleDuration < effectiveDuration) {
      // Auto-scroll to keep playhead visible
      const playheadPos = (currentTime - visibleWindow.start) / visibleDuration;
      if (playheadPos < 0.2 || playheadPos > 0.8) {
        // Playhead is near edge, recenter
        setScrollOffset(Math.max(0, currentTime - visibleDuration / 2));
      }
    }
  }, [currentTime, isPlaying, visibleDuration, effectiveDuration, visibleWindow.start]);
  
  // Handle horizontal scroll on timeline (supports both horizontal and vertical wheel for horizontal panning)
  const handleTimelineScroll = (e: React.WheelEvent) => {
    if (visibleDuration < effectiveDuration) {
      // Use deltaY for horizontal scrolling (more common with mouse wheel)
      // Use deltaX for trackpad horizontal gestures
      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      if (delta !== 0) {
        e.preventDefault();
        const scrollAmount = (delta / 100) * visibleDuration * 0.15;
        setScrollOffset(prev => {
          const newOffset = prev + scrollAmount;
          return Math.max(0, Math.min(effectiveDuration - visibleDuration, newOffset));
        });
      }
    }
  };
  
  // Calculate position within visible window
  const getPositionInWindow = (seconds: number) => {
    return ((seconds - visibleWindow.start) / visibleDuration) * 100;
  };
  
  // Check if a time is within visible window
  const isInVisibleWindow = (seconds: number) => {
    return seconds >= visibleWindow.start && seconds <= visibleWindow.end;
  };
  
  // Calculate progress percentage (within visible window)
  const progress = getPositionInWindow(currentTime);

  // Helper to find current zoom index (handles floating point comparison)
  const getZoomIndex = (level: number) => {
    const idx = ZOOM_LEVELS.findIndex(z => Math.abs(z - level) < 0.01);
    return idx >= 0 ? idx : 0;
  };

  // Zoom controls - use predefined zoom levels
  const handleZoomIn = () => {
    setZoomLevel(prev => {
      const currentIndex = getZoomIndex(prev);
      if (currentIndex < ZOOM_LEVELS.length - 1) {
        return ZOOM_LEVELS[currentIndex + 1];
      }
      return prev;
    });
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const currentIndex = getZoomIndex(prev);
      if (currentIndex > 0) {
        const newLevel = ZOOM_LEVELS[currentIndex - 1];
        if (newLevel === 1) setScrollOffset(0);
        return newLevel;
      }
      return prev;
    });
  };

  // Generate time labels based on visible window
  // Default: 30-second intervals, adapts when zoomed
  const generateTimeLabels = () => {
    if (videoData.length === 0) return [];
    if (effectiveDuration <= 0) return [];
    
    // Calculate optimal interval based on visible duration
    // At default zoom (full view ~210s), show 30s intervals
    // When zoomed in more, can show finer intervals
    let interval = 30; // Default 30 seconds
    
    if (visibleDuration <= 60) {
      interval = 10; // Show every 10 seconds when very zoomed in
    } else if (visibleDuration <= 120) {
      interval = 15; // Show every 15 seconds
    } else if (visibleDuration <= 240) {
      interval = 30; // Show every 30 seconds (standard)
    } else {
      interval = 60; // Show every minute for long videos
    }
    
    const labels: { time: number; label: string; position: number }[] = [];
    
    // Start from the first interval mark at or after visibleWindow.start
    const firstLabel = Math.max(interval, Math.ceil(visibleWindow.start / interval) * interval);
    
    for (let time = firstLabel; time <= visibleWindow.end; time += interval) {
      const position = getPositionInWindow(time);
      if (position >= 0 && position <= 100) {
        labels.push({
          time,
          label: formatTime(time),
          position
        });
      }
    }
    
    return labels;
  };
  
  // Generate tick marks for the timeline
  const generateTickMarks = () => {
    if (effectiveDuration <= 0) return [];
    
    // Calculate tick interval based on visible duration
    let tickInterval = 10; // Default every 10 seconds
    let majorInterval = 30; // Major ticks every 30 seconds
    
    if (visibleDuration <= 60) {
      tickInterval = 5;
      majorInterval = 10;
    } else if (visibleDuration <= 120) {
      tickInterval = 5;
      majorInterval = 15;
    } else if (visibleDuration <= 240) {
      tickInterval = 10;
      majorInterval = 30;
    } else {
      tickInterval = 15;
      majorInterval = 60;
    }
    
    const ticks: { time: number; position: number; isMajor: boolean }[] = [];
    const firstTick = Math.ceil(visibleWindow.start / tickInterval) * tickInterval;
    
    for (let time = firstTick; time <= visibleWindow.end; time += tickInterval) {
      const position = getPositionInWindow(time);
      if (position >= 0 && position <= 100) {
        ticks.push({
          time,
          position,
          isMajor: time % majorInterval === 0
        });
      }
    }
    
    return ticks;
  };

  return (
    <div ref={containerRef} className="flex flex-col h-full bg-[#1c1a21] rounded-lg overflow-hidden">
      {/* Video Area */}
      <div className="relative flex-1 bg-black cursor-pointer" onClick={togglePlay}>
        {/* Actual Video Element */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-contain"
          src="/videos/Demo_clipAX.mp4"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onDurationChange={handleDurationChange}
          onCanPlay={handleCanPlay}
          onEnded={() => setIsPlaying(false)}
          playsInline
          preload="metadata"
        />

        {/* Play overlay when paused */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <PlayIcon className="w-10 h-10 text-white ml-1" />
            </div>
          </div>
        )}

      </div>

      {/* Controls */}
      <div className="bg-[#1c1a21] px-4 py-3 border-t border-[rgba(242,239,237,0.08)]">
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => skip(-10)}
              className="w-10 h-10 flex items-center justify-center rounded hover:bg-[rgba(255,255,255,0.08)]"
            >
              <SkipBackIcon className="w-5 h-5 text-[#f2efed]" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-10 h-10 flex items-center justify-center rounded hover:bg-[rgba(255,255,255,0.08)]"
            >
              {isPlaying ? (
                <PauseIcon className="w-5 h-5 text-[#f2efed]" />
              ) : (
                <PlayIcon className="w-5 h-5 text-[#f2efed]" />
              )}
            </button>
            <button 
              onClick={() => skip(10)}
              className="w-10 h-10 flex items-center justify-center rounded hover:bg-[rgba(255,255,255,0.08)]"
            >
              <SkipForwardIcon className="w-5 h-5 text-[#f2efed]" />
            </button>

            {/* Timestamp */}
            <div className="flex items-center gap-2 ml-4 text-[13px]">
              <span className="text-[#f2efed]">{formatTime(currentTime)}</span>
              <span className="text-[rgba(242,239,237,0.5)]">/</span>
              <span className="text-[rgba(242,239,237,0.6)]">{formatTime(csvVideoDuration)}</span>
            </div>

            {/* Speed */}
            <button 
              onClick={cyclePlaybackRate}
              className="ml-4 px-4 h-10 flex items-center gap-2 text-[rgba(242,239,237,0.7)] hover:text-[#f2efed]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.38 8.57L19.29 12.25C19.19 12.61 18.86 12.86 18.5 12.86H16V21H6V12.86H3.5C3.14 12.86 2.81 12.61 2.71 12.25L1.62 8.57C1.54 8.28 1.62 7.97 1.83 7.76L3.15 6.44C3.54 6.05 4.21 6.05 4.59 6.44L6.35 8.2C6.54 8.39 6.62 8.65 6.58 8.91L6.29 11H9V3H15V11H17.71L17.42 8.91C17.38 8.65 17.46 8.39 17.65 8.2L19.41 6.44C19.79 6.05 20.46 6.05 20.85 6.44L22.17 7.76C22.38 7.97 22.46 8.28 22.38 8.57H20.38Z" />
              </svg>
              <span className="text-[16px] font-semibold underline decoration-dotted">{playbackRate}x</span>
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded hover:bg-[rgba(255,255,255,0.08)]">
              <FlagIcon className="w-6 h-6 text-[#f2efed]" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded hover:bg-[rgba(255,255,255,0.08)]">
              <ZoomIcon className="w-6 h-6 text-[#f2efed]" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded hover:bg-[rgba(255,255,255,0.08)]">
              <SettingsIcon className="w-6 h-6 text-[#f2efed]" />
            </button>
            <button 
              onClick={toggleMute}
              className="w-9 h-9 flex items-center justify-center rounded hover:bg-[rgba(255,255,255,0.08)]"
            >
              {isMuted ? (
                <svg className="w-6 h-6 text-[#f2efed]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.5 12C16.5 10.23 15.48 8.71 14 7.97V10.18L16.45 12.63C16.48 12.43 16.5 12.22 16.5 12ZM19 12C19 12.94 18.8 13.82 18.46 14.64L19.97 16.15C20.63 14.91 21 13.5 21 12C21 7.72 18.01 4.14 14 3.23V5.29C16.89 6.15 19 8.83 19 12ZM4.27 3L3 4.27L7.73 9H3V15H7L12 20V13.27L16.25 17.52C15.58 18.04 14.83 18.45 14 18.7V20.76C15.38 20.45 16.63 19.81 17.69 18.95L19.73 21L21 19.73L12 10.73L4.27 3ZM12 4L9.91 6.09L12 8.18V4Z" />
                </svg>
              ) : (
                <VolumeIcon className="w-6 h-6 text-[#f2efed]" />
              )}
            </button>
            <button 
              onClick={toggleFullscreen}
              className="w-9 h-9 flex items-center justify-center rounded hover:bg-[rgba(255,255,255,0.08)]"
            >
              <FullscreenIcon className="w-6 h-6 text-[#f2efed]" />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div 
        className="bg-[#141217] px-4 py-4"
        ref={timelineRef}
        onWheel={handleTimelineScroll}
      >
        {/* Progress Bar with Playhead */}
        <div 
          className="relative h-[170px] cursor-pointer"
          onClick={handleProgressClick}
        >
          {/* Thin progress track at top */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[rgba(255,255,255,0.15)] rounded-full" />
          <div 
            className="absolute top-0 left-0 h-[3px] bg-[#6bc1ff] rounded-full"
            style={{ 
              width: `${Math.max(0, Math.min(100, progress))}%`,
              transition: 'width 0.08s ease-out'
            }}
          />
          
          {/* Playhead - thin vertical line with circle, tapered at bottom */}
          {progress >= 0 && progress <= 100 && (
            <div 
              className="absolute top-0 pointer-events-none"
              style={{ 
                left: `${progress}%`, 
                transform: 'translateX(-50%)', 
                zIndex: 15, 
                height: '180px',
                transition: 'left 0.08s ease-out'
              }}
            >
              {/* Circle handle at top */}
              <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-[10px] h-[10px] bg-white rounded-full border-[1.5px] border-[#6bc1ff] shadow-sm" />
              {/* Tapered line */}
              <div 
                className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[1.5px]"
                style={{
                  height: 'calc(100% - 5px)',
                  background: 'linear-gradient(to bottom, #6bc1ff 0%, rgba(107, 193, 255, 0.5) 70%, rgba(107, 193, 255, 0.15) 100%)'
                }}
              />
            </div>
          )}

          {/* Tick Marks */}
          <div className="absolute top-[8px] left-0 right-0 h-[12px]">
            {generateTickMarks().map((tick) => (
              <div
                key={`tick-${tick.time}`}
                className="absolute timeline-tick bg-[rgba(242,239,237,0.3)]"
                style={{
                  left: `${tick.position}%`,
                  transform: 'translateX(-50%)',
                  width: '1px',
                  height: tick.isMajor ? '10px' : '6px',
                  top: tick.isMajor ? '0' : '2px'
                }}
              />
            ))}
          </div>

          {/* Time Labels */}
          <div className="absolute top-[22px] left-0 right-0">
            {generateTimeLabels().map((item, i) => (
              <span 
                key={`label-${item.time}`} 
                className="absolute text-[12px] text-[rgba(242,239,237,0.5)] timeline-label"
                style={{ 
                  left: `${item.position}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                {item.label}
              </span>
            ))}
          </div>

          {/* Sentiment & Keywords Track */}
          <div className="absolute top-[48px] left-0 right-0">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-[rgba(242,239,237,0.5)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2ZM12 11.99H18C17.47 16.11 15.09 19.61 12 20.93V12H6V6.3L12 3.91V11.99Z" />
              </svg>
              <span className="text-[12px] text-[rgba(242,239,237,0.5)]">Sentiment & Keywords</span>
            </div>
            
            {/* Markers row */}
            <div className="relative h-[24px] flex items-start">
              {sentimentMarkers.map((marker, i) => {
                // Only show markers within visible window
                if (!isInVisibleWindow(marker.seconds)) return null;
                
                const pos = getPositionInWindow(marker.seconds);
                // Determine marker type based on priority fields from CSV
                const isSentimentPriority = marker.sentimentPriority;
                const isKeywordPriority = marker.keywordPriority;
                const markerType = isKeywordPriority ? "keyword" : "sentiment";
                const markerLabel = isKeywordPriority ? "Keyword" : "Sentiment";
                const markerDesc = isKeywordPriority ? marker.keywords.join(", ") : (marker.sentiment || "");
                
                // Check if highlighted - prioritize specific marker ID
                const isHighlightedById = highlightedMarkerId !== null && highlightedMarkerId !== undefined && marker.id === highlightedMarkerId;
                const isHighlightedBySentiment = !highlightedMarkerId && highlightedSentiment && marker.sentiment === highlightedSentiment;
                const isHighlightedByKeyword = !highlightedMarkerId && highlightedKeyword && marker.keywords && marker.keywords.some(kw => kw.toLowerCase() === highlightedKeyword.toLowerCase());
                const isHighlighted = isHighlightedById || isHighlightedBySentiment || isHighlightedByKeyword;
                
                // Dim others when something is highlighted
                const hasAnyHighlight = highlightedMarkerId !== null || highlightedSentiment || highlightedKeyword;
                const isOtherHighlighted = hasAnyHighlight && !isHighlighted;
                
                return (
                  <div
                    key={marker.id}
                    className={`absolute cursor-pointer ${
                      isHighlighted ? "marker-highlight" : isOtherHighlighted ? "opacity-30" : "hover:scale-110"
                    }`}
                    style={{ 
                      left: `${pos}%`,
                      transform: isHighlighted ? undefined : 'translateX(-50%)',
                      transition: 'left 0.08s ease-out, opacity 0.15s ease-out, transform 0.2s ease-out',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (videoRef.current) {
                        videoRef.current.currentTime = marker.seconds;
                        setCurrentTime(marker.seconds);
                      }
                      onMarkerClick?.({
                        id: String(marker.id),
                        timestamp: marker.timestamp,
                        seconds: marker.seconds,
                        type: markerType,
                        label: markerLabel,
                        description: markerDesc,
                      });
                    }}
                    title={`${marker.timestamp} - ${marker.sentiment}${marker.keywords.length > 0 ? `: ${marker.keywords.join(", ")}` : ""}`}
                  >
                    {/* Pentagon/Shield marker shape */}
                    <svg 
                      width="20" 
                      height="24" 
                      viewBox="0 0 20 24" 
                      className={`transition-all duration-200 ${isHighlighted ? "text-[#fec62e]" : "text-[#9ca3af]"}`}
                    >
                      <path d="M10 0L20 4V14L10 24L0 14V4L10 0Z" fill="currentColor"/>
                      {isSentimentPriority ? (
                        /* Person icon for Sentiment */
                        <g transform="translate(5, 5)">
                          <circle cx="5" cy="3" r="2" fill="#141217"/>
                          <path d="M5 6C3 6 1 7 1 9H9C9 7 7 6 5 6Z" fill="#141217"/>
                        </g>
                      ) : (
                        /* "A" icon for Keyword */
                        <text x="10" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#141217">A</text>
                      )}
                    </svg>
                  </div>
                );
              })}
            </div>
            
            {/* Continuous thin line under markers */}
            <div className="relative h-[2px] mt-2 bg-[rgba(255,255,255,0.12)] rounded-full" />
          </div>

          {/* Auto-generated Markers Track */}
          <div className="absolute top-[115px] left-0 right-0">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-[rgba(242,239,237,0.5)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 18C10.9 18 10 17.1 10 16H14C14 17.1 13.1 18 12 18ZM17 14H7V12H17V14Z" />
              </svg>
              <span className="text-[12px] text-[rgba(242,239,237,0.5)]">Auto-generated Markers</span>
            </div>
            
            <div className="relative h-[24px] flex items-start">
              {markers.map((marker, i) => {
                // Only show markers within visible window
                if (!isInVisibleWindow(marker.seconds)) return null;
                
                const pos = getPositionInWindow(marker.seconds);
                
                // Check if this marker is highlighted by ID
                const isHighlighted = highlightedMarkerId !== null && highlightedMarkerId !== undefined && marker.id === highlightedMarkerId;
                const hasAnyHighlight = highlightedMarkerId !== null || highlightedSentiment || highlightedKeyword;
                const isOtherHighlighted = hasAnyHighlight && !isHighlighted;
                
                return (
                  <div
                    key={marker.id}
                    className={`absolute cursor-pointer ${
                      isHighlighted ? "marker-highlight" : isOtherHighlighted ? "opacity-30" : "hover:scale-110"
                    }`}
                    style={{ 
                      left: `${pos}%`, 
                      transform: isHighlighted ? undefined : 'translateX(-50%)',
                      transition: 'left 0.08s ease-out, opacity 0.15s ease-out, transform 0.2s ease-out',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (videoRef.current) {
                        videoRef.current.currentTime = marker.seconds;
                        setCurrentTime(marker.seconds);
                      }
                      onMarkerClick?.({
                        id: String(marker.id),
                        timestamp: marker.timestamp,
                        seconds: marker.seconds,
                        type: "marker",
                        label: "Marker",
                        description: marker.marker || "",
                      });
                    }}
                    title={`${marker.timestamp} - ${marker.marker}`}
                  >
                    <svg 
                      width="20" 
                      height="24" 
                      viewBox="0 0 20 24" 
                      className={`transition-all duration-200 ${isHighlighted ? "text-[#fec62e]" : "text-[#9ca3af]"}`}
                    >
                      <path d="M10 0L20 4V14L10 24L0 14V4L10 0Z" fill="currentColor"/>
                      {marker.type === "taser" ? (
                        <path d="M10 5L8 10H9.5L8 15L13 9H11L13 5H10Z" fill="#141217"/>
                      ) : marker.type === "sidearm" ? (
                        <text x="10" y="14" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#141217">🔫</text>
                      ) : (
                        <text x="10" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#141217">M</text>
                      )}
                    </svg>
                  </div>
                );
              })}
            </div>
            
            {/* Continuous thin line under auto-generated markers */}
            <div className="relative h-[2px] mt-2 bg-[rgba(255,255,255,0.12)] rounded-full" />
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center justify-end gap-2 mt-2">
          <button 
            onClick={handleZoomOut}
            disabled={zoomLevel <= MIN_ZOOM_LEVEL}
            className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
              zoomLevel <= MIN_ZOOM_LEVEL 
                ? "bg-[rgba(255,255,255,0.05)] text-[rgba(242,239,237,0.3)] cursor-not-allowed" 
                : "bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] text-[rgba(242,239,237,0.6)]"
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13H5V11H19V13Z" />
            </svg>
          </button>
          <div className="w-[100px] h-[4px] bg-[rgba(255,255,255,0.15)] rounded-full relative">
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-[12px] h-[12px] bg-white rounded-full shadow transition-[left] duration-300 ease-out"
              style={{ 
                left: `${(getZoomIndex(zoomLevel) / (ZOOM_LEVELS.length - 1)) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          </div>
          <button 
            onClick={handleZoomIn}
            disabled={zoomLevel >= MAX_ZOOM_LEVEL}
            className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
              zoomLevel >= MAX_ZOOM_LEVEL 
                ? "bg-[rgba(255,255,255,0.05)] text-[rgba(242,239,237,0.3)] cursor-not-allowed" 
                : "bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] text-[rgba(242,239,237,0.6)]"
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});

export default VideoPlayer;

