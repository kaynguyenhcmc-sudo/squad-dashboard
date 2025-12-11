"use client";

import { useRef, useCallback, useState } from "react";
import VideoReviewHeader from "@/components/review/VideoReviewHeader";
import VideoPlayer, { VideoPlayerRef, MarkerClickData } from "@/components/review/VideoPlayer";
import SupportPane, { SupportPaneRef } from "@/components/review/SupportPane";

export default function VideoReviewPage() {
  const videoPlayerRef = useRef<VideoPlayerRef>(null);
  const supportPaneRef = useRef<SupportPaneRef>(null);
  const [highlightedSentiment, setHighlightedSentiment] = useState<string | null>(null);
  const [highlightedKeyword, setHighlightedKeyword] = useState<string | null>(null);
  const [highlightedMarkerId, setHighlightedMarkerId] = useState<number | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);

  const handleSeekToTime = useCallback((seconds: number, autoPlay: boolean = true) => {
    videoPlayerRef.current?.seekTo(seconds, autoPlay);
  }, []);

  const handleSeekAndToggle = useCallback((seconds: number) => {
    videoPlayerRef.current?.seekAndToggle(seconds);
  }, []);

  const handlePauseVideo = useCallback(() => {
    videoPlayerRef.current?.pause();
  }, []);

  const handleMarkerClick = useCallback((data: MarkerClickData) => {
    // Navigate to Flagged moments tab and select the item
    supportPaneRef.current?.selectMarker(data);
  }, []);

  const handleSentimentHighlight = useCallback((sentiment: string | null) => {
    setHighlightedSentiment(sentiment);
    // Clear keyword highlight when sentiment is selected
    if (sentiment) setHighlightedKeyword(null);
  }, []);

  const handleKeywordHighlight = useCallback((keyword: string | null) => {
    setHighlightedKeyword(keyword);
    // Clear sentiment highlight when keyword is selected
    if (keyword) setHighlightedSentiment(null);
  }, []);

  const handleMarkerIdHighlight = useCallback((markerId: number | null) => {
    setHighlightedMarkerId(markerId);
    // Clear sentiment/keyword highlights when specific marker is highlighted
    if (markerId !== null) {
      setHighlightedSentiment(null);
      setHighlightedKeyword(null);
    }
  }, []);

  const handlePlayStateChange = useCallback((playing: boolean, currentTime: number) => {
    setIsVideoPlaying(playing);
    setCurrentVideoTime(currentTime);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#141217]">
      {/* Header */}
      <VideoReviewHeader />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden p-6 gap-6">
        {/* Video Player Section */}
        <div className="flex-1">
          <VideoPlayer 
            ref={videoPlayerRef} 
            onMarkerClick={handleMarkerClick}
            highlightedSentiment={highlightedSentiment}
            highlightedKeyword={highlightedKeyword}
            highlightedMarkerId={highlightedMarkerId}
            onPlayStateChange={handlePlayStateChange}
          />
        </div>

        {/* Support Pane */}
        <SupportPane 
          ref={supportPaneRef} 
          onSeekToTime={handleSeekToTime}
          onSeekAndToggle={handleSeekAndToggle}
          onPauseVideo={handlePauseVideo}
          onSentimentHighlight={handleSentimentHighlight}
          onKeywordHighlight={handleKeywordHighlight}
          onMarkerIdHighlight={handleMarkerIdHighlight}
          isVideoPlaying={isVideoPlaying}
          currentVideoTime={currentVideoTime}
        />
      </div>
    </div>
  );
}

