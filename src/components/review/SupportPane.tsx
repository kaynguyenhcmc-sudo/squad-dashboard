"use client";

import { useState, useEffect, forwardRef, useImperativeHandle, useRef, useMemo, useCallback } from "react";
import { UserIcon, CloseIcon, ChevronRightIcon } from "../icons";
import { 
  loadVideoData,
  getKeywordCounts, 
  getSentimentSummary, 
  getFlaggedMoments,
  type TranscriptEntry 
} from "@/data/videoData";
import AddResponsePopup, { type ResponseData } from "./AddResponsePopup";
import SendEmailPopup, { type EmailData } from "./SendEmailPopup";
import VideoThumbnail from "./VideoThumbnail";
import SentimentDetailsPopup from "./SentimentDetailsPopup";

// Custom tooltip component with 0.5s delay
function DisabledTooltip({ children, message, show, position = "top" }: { children: React.ReactNode; message: string; show: boolean; position?: "top" | "bottom-right" }) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (show) {
      timeoutRef.current = setTimeout(() => setIsVisible(true), 500);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {isVisible && position === "top" && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#2a2830] text-[#f2efed] text-[12px] rounded-lg border border-[rgba(242,239,237,0.2)] shadow-lg whitespace-nowrap z-50">
          {message}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2a2830]" />
        </div>
      )}
      {isVisible && position === "bottom-right" && (
        <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-[#2a2830] text-[#f2efed] text-[12px] rounded-lg border border-[rgba(242,239,237,0.2)] shadow-lg whitespace-nowrap z-50">
          {message}
          <div className="absolute bottom-full right-2 border-4 border-transparent border-b-[#2a2830]" />
        </div>
      )}
    </div>
  );
}

// Export ref type for parent components
export interface SupportPaneRef {
  selectMarker: (data: {
    id: string;
    timestamp: string;
    seconds: number;
    type: "sentiment" | "keyword" | "marker";
    label: string;
    description: string;
  }) => void;
}

function OverviewIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" />
    </svg>
  );
}

function MapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.5 3L20.34 3.03L15 5.1L9 3L3.36 4.9C3.15 4.97 3 5.15 3 5.38V20.5C3 20.78 3.22 21 3.5 21L3.66 20.97L9 18.9L15 21L20.64 19.1C20.85 19.03 21 18.85 21 18.62V3.5C21 3.22 20.78 3 20.5 3ZM15 19L9 16.89V5L15 7.11V19Z" />
    </svg>
  );
}

function TranscriptIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16ZM7 9H9V11H7V9ZM11 9H13V11H11V9ZM15 9H17V11H15V9Z" />
    </svg>
  );
}

function PeopleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" />
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

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
    </svg>
  );
}

function RecordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" />
    </svg>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" />
    </svg>
  );
}

interface SentimentBarProps {
  label: string;
  percentage: number;
  isActive?: boolean;
  onClick?: () => void;
}

function SentimentBar({ label, percentage, isActive, onClick }: SentimentBarProps) {
  return (
    <div 
      className={`flex items-center gap-2 px-6 py-2 cursor-pointer transition-all ${
        isActive 
          ? "bg-[rgba(254,198,46,0.15)] border-l-2 border-[#fec62e]" 
          : "hover:bg-[rgba(255,255,255,0.02)]"
      }`}
      onClick={onClick}
    >
      <span className={`text-[13px] w-[180px] ${isActive ? "text-[#fec62e] font-medium" : "text-[rgba(242,239,237,0.75)]"}`}>
        {label}
      </span>
      <div className="flex-1 flex items-center gap-2">
        <div className={`flex-1 h-[10px] bg-[#545256] border rounded-full overflow-hidden ${isActive ? "border-[#fec62e]" : "border-[#38363b]"}`}>
          <div
            className={`h-full rounded-l-full transition-all ${isActive ? "bg-[#fec62e]" : "bg-[#fec62e]"}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={`text-[13px] w-10 text-right ${isActive ? "text-[#fec62e] font-medium" : "text-[#f2ece9]"}`}>
          {percentage}%
        </span>
      </div>
    </div>
  );
}

interface MarkerCardProps {
  time: string;
  seconds: number;
  description: string;
  onClick?: () => void;
  isThisFramePlaying?: boolean;
}

function MarkerCard({ time, seconds, description, onClick, isThisFramePlaying }: MarkerCardProps) {
  return (
    <div 
      className="flex-shrink-0 w-[120px] cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative w-[120px] h-[80px] rounded-lg border border-[rgba(242,239,237,0.12)] overflow-hidden bg-[#2a2830] mb-2 group-hover:border-[#ffd563] transition-colors">
        <VideoThumbnail 
          videoSrc="/videos/Demo_clipAX.mp4"
          timestamp={seconds}
          width={120}
          height={80}
        />
        {/* Play/Pause icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
            {isThisFramePlaying ? (
              <svg className="w-5 h-5 text-[#141217]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19H10V5H6V19ZM14 5V19H18V5H14Z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-[#141217] ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5V19L19 12L8 5Z" />
              </svg>
            )}
          </div>
        </div>
      </div>
      <span className="inline-block px-2 py-1 text-[13px] text-[#f2efed] bg-[#1f1d23] border border-[rgba(242,239,237,0.25)] rounded-full mb-2 group-hover:border-[#ffd563] group-hover:text-[#ffd563] transition-colors">
        {time}
      </span>
      <p className="text-[13px] text-[rgba(242,239,237,0.75)] leading-tight line-clamp-2 group-hover:text-[#f2efed] transition-colors">
        {description}
      </p>
    </div>
  );
}

// Flagged moment item component
interface FlaggedMomentItemProps {
  time: string;
  seconds: number;
  type: "keyword" | "sentiment" | "marker";
  label: string;
  description?: string;
  transcript?: string;
  role?: "Officer" | "Subject";
  isSelected?: boolean;
  hasResponse?: boolean;
  isSubmitted?: boolean;
  onSelect?: () => void;
  onAddResponse?: () => void;
  onEditResponse?: () => void;
  onRemoveResponse?: () => void;
  onSeekToTime?: (autoPlay?: boolean) => void;
  onThumbnailClick?: () => void;
  onShowSentimentDetails?: () => void;
  onChevronClick?: () => void;
  isVideoPlaying?: boolean;
  isThisFramePlaying?: boolean;
}

function FlaggedMomentItem({ 
  time, 
  seconds,
  type, 
  label, 
  description, 
  transcript, 
  role,
  isSelected,
  hasResponse,
  isSubmitted,
  onSelect,
  onAddResponse,
  onEditResponse,
  onRemoveResponse,
  onSeekToTime,
  onThumbnailClick,
  onShowSentimentDetails,
  onChevronClick,
  isVideoPlaying,
  isThisFramePlaying,
}: FlaggedMomentItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getIcon = () => {
    switch (type) {
      case "keyword":
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#a855f7">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" />
          </svg>
        );
      case "sentiment":
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#f59e0b">
            <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" />
          </svg>
        );
      case "marker":
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#fec62e">
            <path d="M7 2V13H10V22L17 10H13L17 2H7Z" />
          </svg>
        );
    }
  };

  return (
    <div 
      onClick={onSelect}
      className={`border rounded-lg p-3 cursor-pointer transition-all ${
        isSelected 
          ? "border-[#ffd563] bg-[rgba(255,213,99,0.08)]" 
          : "border-[rgba(242,239,237,0.12)] hover:bg-[rgba(255,255,255,0.02)]"
      }`}
    >
      {/* Header with time */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="text-[13px] text-[#f2efed] font-medium">{time}</span>
          {hasResponse && (
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#22c55e]/20 text-[#22c55e]">
              ✓ Response added
            </span>
          )}
        </div>
        {/* 3-dot menu - only show when has response */}
        {hasResponse && (
          <div className="relative">
            <DisabledTooltip message="Review has been submitted. Cannot edit responses." show={!!isSubmitted} position="bottom-right">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isSubmitted) {
                    setIsMenuOpen(!isMenuOpen);
                  }
                }}
                disabled={isSubmitted}
                className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                  isSubmitted
                    ? "text-[rgba(242,239,237,0.2)] cursor-not-allowed"
                    : isMenuOpen 
                      ? "text-[#ffd563] bg-[rgba(255,213,99,0.1)]" 
                      : "text-[rgba(242,239,237,0.5)] hover:text-[#f2efed]"
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" />
                </svg>
              </button>
            </DisabledTooltip>
            
            {/* Dropdown Menu */}
            {isMenuOpen && !isSubmitted && (
              <>
                {/* Backdrop to close menu */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                  }} 
                />
                {/* Menu */}
                <div className="absolute right-0 top-full mt-1 z-50 w-36 bg-[#1f1d23] border border-[rgba(242,239,237,0.12)] rounded-lg shadow-lg py-1 overflow-hidden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      onEditResponse?.();
                    }}
                    className="w-full px-3 py-2 text-left text-[13px] text-[#f2efed] hover:bg-[rgba(255,255,255,0.08)] flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      onRemoveResponse?.();
                    }}
                    className="w-full px-3 py-2 text-left text-[13px] text-[#ef4444] hover:bg-[rgba(239,68,68,0.1)] flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" />
                    </svg>
                    Remove
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content with Thumbnail */}
      <div className="flex gap-3">
        {/* Video Thumbnail - clickable to play/pause and select */}
        <div 
          className="group/thumb relative flex-shrink-0 rounded overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#ffd563] transition-all"
          onClick={(e) => {
            e.stopPropagation();
            // Select frame if not already selected
            if (!isSelected) {
              onSelect?.();
            }
            // Toggle play/pause only if this is the frame currently playing
            // Otherwise just seek without playing
            onThumbnailClick?.();
          }}
          title={isThisFramePlaying ? "Click to pause" : "Click to play from this moment"}
        >
          <VideoThumbnail 
            videoSrc="/videos/Demo_clipAX.mp4"
            timestamp={seconds}
            width={96}
            height={64}
            className="rounded"
          />
          {/* Play/Pause icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
              {isThisFramePlaying ? (
                <svg className="w-4 h-4 text-[#141217]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19H10V5H6V19ZM14 5V19H18V5H14Z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-[#141217] ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5V19L19 12L8 5Z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Label and Description */}
          <div className="mb-1 flex items-center gap-1.5">
            <span className="text-[12px] text-[#f2efed]">{label}:</span>
            {/* Sentiment - clickable with star icon */}
            {type === "sentiment" ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Select frame if not already selected
                  if (!isSelected) {
                    onSelect?.();
                  }
                  onShowSentimentDetails?.();
                }}
                className="flex items-center gap-1.5 text-[#f2efed] hover:text-[#ffd563] transition-colors group/sentiment"
                title="View sentiment details"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" />
                </svg>
                <span className="text-[13px] underline decoration-dotted underline-offset-2">{description}</span>
              </button>
            ) : (
              <span className="text-[13px] text-[#f2efed]">{description}</span>
            )}
          </div>

          {/* Role badge */}
          {role && (
            <span className="inline-block text-[11px] px-1.5 py-0.5 rounded mb-1 bg-[rgba(242,239,237,0.08)] text-[#f2efed]">
              {role}
            </span>
          )}

          {/* Transcript preview */}
          {transcript && (
            <p className="text-[12px] text-[rgba(242,239,237,0.6)] line-clamp-2 italic">
              &ldquo;{transcript}&rdquo;
            </p>
          )}
        </div>

        {/* Chevron - clickable for keyword/sentiment to go to transcript */}
        {onChevronClick ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChevronClick();
            }}
            className="flex-shrink-0 self-center p-1.5 -mr-1 rounded hover:bg-[rgba(255,255,255,0.1)] transition-colors group/chevron"
            title="View in Transcript"
          >
            <ChevronRightIcon className="w-5 h-5 text-[rgba(242,239,237,0.5)] group-hover/chevron:text-[#ffd563] transition-colors" />
          </button>
        ) : (
          <ChevronRightIcon className="w-5 h-5 text-[rgba(242,239,237,0.4)] flex-shrink-0 self-center" />
        )}
      </div>

      {/* Add Response button - only show when selected and no response yet */}
      {isSelected && !hasResponse && (
        <DisabledTooltip message="Review has been submitted. Cannot add new responses." show={!!isSubmitted}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isSubmitted) {
                onAddResponse?.();
              }
            }}
            disabled={isSubmitted}
            className={`mt-3 flex items-center gap-1.5 text-[13px] px-3 py-1.5 rounded transition-colors ${
              isSubmitted 
                ? "text-[rgba(242,239,237,0.3)] bg-[rgba(242,239,237,0.05)] border border-[rgba(242,239,237,0.1)] cursor-not-allowed" 
                : "text-[#f2efed] bg-[rgba(242,239,237,0.1)] border border-[rgba(242,239,237,0.2)] hover:bg-[rgba(242,239,237,0.15)]"
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            Add response
          </button>
        </DisabledTooltip>
      )}
    </div>
  );
}

// Transcript entry component
interface TranscriptEntryComponentProps {
  time: string;
  seconds: number;
  text: string;
  role?: "Officer" | "Subject";
  sentiment?: string;
  isPriority?: boolean;
  keywords?: string[];
  isSelected?: boolean;
  hasResponse?: boolean;
  isSubmitted?: boolean;
  searchQuery?: string;
  onSelect?: () => void;
  onAddResponse?: () => void;
  onEditResponse?: () => void;
  onRemoveResponse?: () => void;
  onShowSentimentDetails?: () => void;
}

// Helper function to highlight search matches in text
function highlightSearchMatches(text: string, query: string) {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) => 
    regex.test(part) ? (
      <mark key={i} className="bg-[#fec62e] text-[#141217] px-0.5 rounded">{part}</mark>
    ) : part
  );
}

function TranscriptEntryComponent({ 
  time, 
  seconds,
  text, 
  role, 
  sentiment, 
  isPriority, 
  keywords,
  isSelected,
  hasResponse,
  isSubmitted,
  searchQuery,
  onSelect,
  onAddResponse,
  onEditResponse,
  onRemoveResponse,
  onShowSentimentDetails,
}: TranscriptEntryComponentProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // All transcript entries can add response (except those already have one)
  const canAddResponse = !hasResponse;

  return (
    <div 
      onClick={canAddResponse ? onSelect : undefined}
      className={`px-4 py-3 border-l-2 transition-all ${
        isSelected 
          ? 'border-[#ffd563] bg-[rgba(255,213,99,0.12)] cursor-pointer' 
          : 'border-transparent cursor-pointer hover:bg-[rgba(255,255,255,0.04)]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[12px] font-medium px-2 py-0.5 rounded bg-[rgba(242,239,237,0.08)] text-[#f2efed]">
            {role}
          </span>
          <span className="text-[13px] text-[rgba(242,239,237,0.5)]">{time}</span>
          {sentiment && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Select frame if not already selected
                if (!isSelected) {
                  onSelect?.();
                }
                onShowSentimentDetails?.();
              }}
              className="flex items-center gap-1.5 text-[12px] text-[#f2efed] hover:text-[#ffd563] transition-colors"
              title="View sentiment details"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" />
              </svg>
              <span className="underline decoration-dotted underline-offset-2">{sentiment}</span>
            </button>
          )}
          {hasResponse && (
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#8DD56A]/20 text-[#8DD56A] flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
              </svg>
              Response added
            </span>
          )}
        </div>
        {/* 3-dot menu - only show when has response */}
        {hasResponse && (
          <div className="relative">
            <DisabledTooltip message="Review has been submitted. Cannot edit responses." show={!!isSubmitted} position="bottom-right">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isSubmitted) {
                    setIsMenuOpen(!isMenuOpen);
                  }
                }}
                disabled={isSubmitted}
                className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                  isSubmitted
                    ? "text-[rgba(242,239,237,0.2)] cursor-not-allowed"
                    : isMenuOpen 
                      ? "text-[#ffd563] bg-[rgba(255,213,99,0.1)]" 
                      : "text-[rgba(242,239,237,0.3)] hover:text-[#f2efed]"
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 10C4.9 10 4 10.9 4 12C4 13.1 4.9 14 6 14C7.1 14 8 13.1 8 12C8 10.9 7.1 10 6 10ZM18 10C16.9 10 16 10.9 16 12C16 13.1 16.9 14 18 14C19.1 14 20 13.1 20 12C20 10.9 19.1 10 18 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" />
                </svg>
              </button>
            </DisabledTooltip>
            
            {/* Dropdown Menu */}
            {isMenuOpen && !isSubmitted && (
              <>
                {/* Backdrop to close menu */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                  }} 
                />
                {/* Menu */}
                <div className="absolute right-0 top-full mt-1 z-50 w-36 bg-[#1f1d23] border border-[rgba(242,239,237,0.12)] rounded-lg shadow-lg py-1 overflow-hidden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      onEditResponse?.();
                    }}
                    className="w-full px-3 py-2 text-left text-[13px] text-[#f2efed] hover:bg-[rgba(255,255,255,0.08)] flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      onRemoveResponse?.();
                    }}
                    className="w-full px-3 py-2 text-left text-[13px] text-[#ef4444] hover:bg-[rgba(239,68,68,0.1)] flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" />
                    </svg>
                    Remove
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {/* Text */}
      <p className="text-[15px] text-[#f2efed] leading-relaxed">
        {searchQuery ? highlightSearchMatches(text, searchQuery) : text}
      </p>
      {/* Add response button - only show when selected and no response */}
      {isSelected && canAddResponse && (
        <DisabledTooltip message="Review has been submitted. Cannot add new responses." show={!!isSubmitted}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isSubmitted) {
                onAddResponse?.();
              }
            }}
            disabled={isSubmitted}
            className={`mt-3 flex items-center gap-1.5 text-[13px] px-3 py-1.5 rounded transition-colors ${
              isSubmitted 
                ? "text-[rgba(242,239,237,0.3)] bg-[rgba(242,239,237,0.05)] border border-[rgba(242,239,237,0.1)] cursor-not-allowed" 
                : "text-[#f2efed] bg-[rgba(242,239,237,0.1)] border border-[rgba(242,239,237,0.2)] hover:bg-[rgba(242,239,237,0.15)]"
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            Add response
          </button>
        </DisabledTooltip>
      )}
    </div>
  );
}

// Keyword tag component
function KeywordTag({ label, count, isActive, onClick }: { label: string; count: number; isActive?: boolean; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-3 py-1.5 text-[13px] rounded-full whitespace-nowrap transition-all ${
        isActive 
          ? "text-[#141217] bg-[#fec62e] border border-[#fec62e] ring-2 ring-[#fec62e]/50" 
          : "text-[#f2efed] bg-[rgba(242,239,237,0.08)] border border-[rgba(242,239,237,0.2)] hover:bg-[rgba(242,239,237,0.12)]"
      }`}
    >
      {label} ({count})
    </button>
  );
}


// Review Response flagged moment card
interface ReviewMomentCardProps {
  time: string;
  type: "keyword" | "sentiment";
  label: string;
  description: string;
  imageUrl: string;
  responseTag: string;
  note?: string;
  author?: string;
}

function ReviewMomentCard({ time, type, label, description, imageUrl, responseTag, note, author }: ReviewMomentCardProps) {
  return (
    <div className="border border-[rgba(242,239,237,0.12)] rounded-lg overflow-hidden">
      {/* Header with time */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[rgba(242,239,237,0.04)]">
        {type === "keyword" ? (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#a855f7">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#f59e0b">
            <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" />
          </svg>
        )}
        <span className="text-[13px] text-[#f2efed] font-medium">{time}</span>
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex gap-3 mb-3">
          {/* Thumbnail */}
          <div className="w-[72px] h-[48px] rounded overflow-hidden flex-shrink-0 bg-[#2a2830]">
            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-[rgba(242,239,237,0.7)]">{label}:</p>
            <p className="text-[14px] text-[#f2efed] font-medium">{description}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[12px] text-[rgba(242,239,237,0.5)]">Review response:</span>
              <span className="px-2 py-0.5 text-[11px] text-[#f2efed] bg-[rgba(242,239,237,0.1)] border border-[rgba(242,239,237,0.2)] rounded">
                {responseTag}
              </span>
            </div>
          </div>

          {/* Chevron */}
          <button className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-[rgba(242,239,237,0.5)]">
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Note */}
        {note && (
          <div className="bg-[rgba(254,198,46,0.15)] border-l-2 border-[#fec62e] rounded-r px-3 py-2">
            <p className="text-[13px] text-[#f2efed] leading-relaxed">{note}</p>
            {author && (
              <div className="flex items-center gap-1 mt-2 text-[12px] text-[rgba(242,239,237,0.5)]">
                <UserIcon className="w-3 h-3" />
                {author}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Mock data for review response
const reviewMomentsData: ReviewMomentCardProps[] = [
  {
    time: "01:33",
    type: "keyword",
    label: "Keyword",
    description: '"Hands"',
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=144&h=96&fit=crop",
    responseTag: "Policy violation",
    note: "Quick note—standing by the driver's window puts you too close. Try to use the B-pillar for better cover and reaction time. Let me know if you want to walk through it.",
    author: "Tanioka, Sidney (stanioka)"
  },
  {
    time: "03:28",
    type: "sentiment",
    label: "Sentiment",
    description: "Escalatory",
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=144&h=96&fit=crop",
    responseTag: "Professionalism",
  },
];

interface SupportPaneProps {
  onSeekToTime?: (seconds: number, autoPlay?: boolean) => void;
  onSeekAndToggle?: (seconds: number) => void;
  onPauseVideo?: () => void;
  onSentimentHighlight?: (sentiment: string | null) => void;
  onKeywordHighlight?: (keyword: string | null) => void;
  onMarkerIdHighlight?: (markerId: number | null) => void;
  isVideoPlaying?: boolean;
  currentVideoTime?: number;
}

const SupportPane = forwardRef<SupportPaneRef, SupportPaneProps>(function SupportPane({ onSeekToTime, onSeekAndToggle, onPauseVideo, onSentimentHighlight, onKeywordHighlight, onMarkerIdHighlight, isVideoPlaying, currentVideoTime }, ref) {
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "transcript" | "response">("overview");
  const [transcriptData, setTranscriptData] = useState<TranscriptEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Selection and response states
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingResponse, setEditingResponse] = useState<ResponseData | null>(null);
  
  // Overall review state
  const [overallReviewResults, setOverallReviewResults] = useState<string[]>([]);
  const [overallFeedback, setOverallFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedDate, setSubmittedDate] = useState<Date | null>(null);
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false);
  const [highlightedSentiment, setHighlightedSentiment] = useState<string | null>(null);
  const [highlightedKeyword, setHighlightedKeyword] = useState<string | null>(null);
  const [isSentimentDetailsOpen, setIsSentimentDetailsOpen] = useState(false);
  const [isKeywordsExpanded, setIsKeywordsExpanded] = useState(false);
  
  // Flagged moments filter state
  const [flaggedMomentsFilter, setFlaggedMomentsFilter] = useState<{
    sentiment: boolean;
    keyword: boolean;
    marker: boolean;
  }>({ sentiment: true, keyword: true, marker: true });
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [sentimentDetailsData, setSentimentDetailsData] = useState<{
    sentiment: string;
    timestamp: string;
    transcript: string;
  } | null>(null);
  
  // Tab dropdown state
  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);
  
  // Refs for auto-scroll
  const flaggedMomentsListRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  
  // Flag to skip auto-selection when navigating via chevron
  const skipAutoSelectRef = useRef(false);

  // Expose selectMarker function to parent via ref
  useImperativeHandle(ref, () => ({
    selectMarker: (data) => {
      // Switch to Flagged moments tab (details)
      setActiveTab("details");
      
      // Generate the item ID that matches how FlaggedMomentItem generates its ID
      const itemId = `flagged-${data.id}-${data.timestamp}`;
      setSelectedItemId(itemId);
      
      // Set popup data for potential response adding
      setPopupData({
        timestamp: data.timestamp,
        seconds: data.seconds,
        type: data.type,
        label: data.label,
        description: data.description,
        transcript: "",
        role: "Officer" as const,
      });
      
      // Auto-scroll to the selected item after a short delay (to allow tab switch)
      setTimeout(() => {
        const itemElement = itemRefs.current.get(itemId);
        if (itemElement) {
          itemElement.scrollIntoView({ 
            behavior: "smooth", 
            block: "center" 
          });
        }
      }, 100);
    }
  }), []);
  const [emailSentData, setEmailSentData] = useState<EmailData | null>(null);

  const [popupData, setPopupData] = useState<{
    timestamp: string;
    seconds: number;
    type: "keyword" | "sentiment" | "marker";
    label: string;
    description: string;
    transcript: string;
    role: "Officer" | "Subject";
  } | null>(null);

  // Load CSV data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await loadVideoData();
      setTranscriptData(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Computed values from loaded data
  const keywordTags = getKeywordCounts(transcriptData);
  const sentimentSummary = getSentimentSummary(transcriptData);
  const allFlaggedMoments = getFlaggedMoments(transcriptData);
  
  // Filter flagged moments based on selected filters
  const flaggedMoments = useMemo(() => {
    return allFlaggedMoments.filter(item => {
      // Determine the type of this item based on priority flags
      // An item can have multiple flags, so we check in order of priority
      
      // Check if item has marker (auto-generated markers)
      if (item.marker) {
        return flaggedMomentsFilter.marker;
      }
      
      // Check if item has keyword priority (Keyword_priority = 1)
      if (item.keywordPriority) {
        return flaggedMomentsFilter.keyword;
      }
      
      // Check if item has sentiment priority (Sentiment_priority = 1)
      if (item.sentimentPriority) {
        return flaggedMomentsFilter.sentiment;
      }
      
      // Default: shouldn't reach here if getFlaggedMoments works correctly
      return true;
    });
  }, [allFlaggedMoments, flaggedMomentsFilter]);

  // Search results - find all transcript entries that match the search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return transcriptData.filter(entry => 
      entry.transcript.toLowerCase().includes(query) ||
      entry.keywords.some(kw => kw.toLowerCase().includes(query))
    );
  }, [searchQuery, transcriptData]);

  // Refs for search result scrolling
  const transcriptItemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Navigate to search result
  const navigateToSearchResult = useCallback((index: number) => {
    if (searchResults.length === 0) return;
    const clampedIndex = Math.max(0, Math.min(index, searchResults.length - 1));
    setCurrentSearchIndex(clampedIndex);
    
    const resultEntry = searchResults[clampedIndex];
    if (resultEntry) {
      // Scroll to the item
      const itemRef = transcriptItemRefs.current.get(resultEntry.id);
      if (itemRef) {
        itemRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      // Seek to that timestamp (without auto-playing)
      onSeekToTime?.(resultEntry.seconds, false);
    }
  }, [searchResults, onSeekToTime]);

  // Reset search index when query changes, and clear keyword highlight if no longer matches
  useEffect(() => {
    setCurrentSearchIndex(0);
    // If search query no longer matches the highlighted keyword, clear it
    if (highlightedKeyword && searchQuery.toLowerCase() !== highlightedKeyword.toLowerCase()) {
      setHighlightedKeyword(null);
      onKeywordHighlight?.(null);
    }
  }, [searchQuery, highlightedKeyword, onKeywordHighlight]);

  // Auto-focus to first result when search results change
  useEffect(() => {
    if (searchResults.length > 0 && searchQuery.trim()) {
      const firstResult = searchResults[0];
      if (firstResult) {
        // Small delay to ensure refs are set
        setTimeout(() => {
          const itemRef = transcriptItemRefs.current.get(firstResult.id);
          if (itemRef) {
            itemRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          // Seek video to first result (without auto-play)
          onSeekToTime?.(firstResult.seconds, false);
        }, 100);
      }
    }
  }, [searchResults, searchQuery, onSeekToTime]);

  // Auto-select based on tab change
  useEffect(() => {
    // Small delay to ensure data is loaded
    if (isLoading) return;
    
    setTimeout(() => {
      if (activeTab === "overview") {
        // Auto-select sentiment with highest percentage
        if (sentimentSummary.items.length > 0) {
          const highestSentiment = sentimentSummary.items[0]; // Already sorted by percentage desc
          setHighlightedSentiment(highestSentiment.originalLabel);
          onSentimentHighlight?.(highestSentiment.originalLabel);
          // Clear keyword and marker ID highlight
          setHighlightedKeyword(null);
          onKeywordHighlight?.(null);
          onMarkerIdHighlight?.(null); // Clear specific marker highlight so sentiment highlight works
          setSearchQuery("");
        }
      } else if (activeTab === "details") {
        // Auto-select first flagged moment (always select first, don't carry over from Overview)
        if (flaggedMoments.length > 0) {
          const targetMoment = flaggedMoments[0];
          
          const itemId = `flagged-${targetMoment.id}-${targetMoment.timestamp}`;
          
          let itemType: "marker" | "keyword" | "sentiment" = "sentiment";
          let itemLabel = "Sentiment";
          let itemDesc = targetMoment.sentiment;
          
          if (targetMoment.marker) {
            itemType = "marker";
            itemLabel = "Marker";
            itemDesc = targetMoment.marker;
          } else if (targetMoment.keywordPriority) {
            itemType = "keyword";
            itemLabel = "Keyword";
            itemDesc = targetMoment.keywords.length > 0 ? targetMoment.keywords.join(", ") : targetMoment.sentiment;
          }
          
          setSelectedItemId(itemId);
          setPopupData({
            timestamp: targetMoment.timestamp,
            seconds: targetMoment.seconds,
            type: itemType,
            label: itemLabel,
            description: itemDesc,
            transcript: targetMoment.transcript,
            role: targetMoment.role,
          });
          
          // Highlight specific marker by ID (works for all types: sentiment, keyword, marker)
          onMarkerIdHighlight?.(targetMoment.id);
          // Clear sentiment-based highlights
          setHighlightedSentiment(null);
          setHighlightedKeyword(null);
          onSentimentHighlight?.(null);
          onKeywordHighlight?.(null);
          
          // Seek to moment (without auto-play)
          onSeekToTime?.(targetMoment.seconds, false);
          
          // Scroll to the item after a small delay
          setTimeout(() => {
            const itemElement = itemRefs.current.get(itemId);
            if (itemElement) {
              itemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
        }
      } else if (activeTab === "transcript") {
        // Skip auto-selection if navigating from chevron click
        if (skipAutoSelectRef.current) {
          return;
        }
        
        // Clear previous selection first
        setSelectedItemId(null);
        setPopupData(null);
        setSearchQuery("");
        setHighlightedKeyword(null);
        onKeywordHighlight?.(null);
        setHighlightedSentiment(null);
        onSentimentHighlight?.(null);
        
        // Auto-select first transcript entry after a brief delay
        setTimeout(() => {
          // Double check skip flag
          if (skipAutoSelectRef.current) return;
          
          if (transcriptData.length > 0) {
            const firstEntry = transcriptData[0];
            const itemId = `transcript-${firstEntry.id}-${firstEntry.timestamp}`;
            
            let itemType: "marker" | "keyword" | "sentiment" = "sentiment";
            let itemLabel = "Transcript";
            let itemDesc = firstEntry.sentiment || "General";
            
            if (firstEntry.marker) {
              itemType = "marker";
              itemLabel = "Marker";
              itemDesc = firstEntry.marker;
            } else if (firstEntry.keywordPriority) {
              itemType = "keyword";
              itemLabel = "Keyword";
              itemDesc = firstEntry.keywords.length > 0 ? firstEntry.keywords.join(", ") : firstEntry.sentiment;
            } else if (firstEntry.sentimentPriority) {
              itemType = "sentiment";
              itemLabel = "Sentiment";
              itemDesc = firstEntry.sentiment;
            }
            
            setSelectedItemId(itemId);
            setPopupData({
              timestamp: firstEntry.timestamp,
              seconds: firstEntry.seconds,
              type: itemType,
              label: itemLabel,
              description: itemDesc,
              transcript: firstEntry.transcript,
              role: firstEntry.role,
            });
            
            // Highlight specific marker by ID
            if (itemType === "sentiment" || itemType === "keyword") {
              onMarkerIdHighlight?.(firstEntry.id);
            } else {
              onMarkerIdHighlight?.(null);
            }
            
            // Seek to first entry (without auto-play)
            onSeekToTime?.(firstEntry.seconds, false);
          }
        }, 50);
      }
      // "response" tab - no auto-selection needed
    }, 150);
  }, [activeTab, isLoading]); // Only trigger on tab change and loading state

  // Auto-select transcript entry when video plays to that timestamp
  useEffect(() => {
    if (activeTab !== "transcript" || !isVideoPlaying || transcriptData.length === 0) return;
    
    // Find the transcript entry that matches current video time
    // We look for the entry whose timestamp is closest to (but not after) current time
    let matchedEntry: TranscriptEntry | null = null;
    for (let i = transcriptData.length - 1; i >= 0; i--) {
      if (transcriptData[i].seconds <= (currentVideoTime || 0)) {
        matchedEntry = transcriptData[i];
        break;
      }
    }
    
    if (matchedEntry) {
      const itemId = `transcript-${matchedEntry.id}-${matchedEntry.timestamp}`;
      
      // Only update if different from current selection
      if (selectedItemId !== itemId) {
        let itemType: "marker" | "keyword" | "sentiment" = "sentiment";
        let itemLabel = "Transcript";
        let itemDesc = matchedEntry.sentiment || "General";
        
        if (matchedEntry.marker) {
          itemType = "marker";
          itemLabel = "Marker";
          itemDesc = matchedEntry.marker;
        } else if (matchedEntry.keywordPriority) {
          itemType = "keyword";
          itemLabel = "Keyword";
          itemDesc = matchedEntry.keywords.length > 0 ? matchedEntry.keywords.join(", ") : matchedEntry.sentiment;
        } else if (matchedEntry.sentimentPriority) {
          itemType = "sentiment";
          itemLabel = "Sentiment";
          itemDesc = matchedEntry.sentiment;
        }
        
        setSelectedItemId(itemId);
        setPopupData({
          timestamp: matchedEntry.timestamp,
          seconds: matchedEntry.seconds,
          type: itemType,
          label: itemLabel,
          description: itemDesc,
          transcript: matchedEntry.transcript,
          role: matchedEntry.role,
        });
        
        // Highlight specific marker by ID
        if (itemType === "sentiment" || itemType === "keyword") {
          onMarkerIdHighlight?.(matchedEntry.id);
        } else {
          onMarkerIdHighlight?.(null);
        }
        
        // Scroll to the entry
        const itemRef = transcriptItemRefs.current.get(matchedEntry.id);
        if (itemRef) {
          itemRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [activeTab, isVideoPlaying, currentVideoTime, transcriptData]);

  // Handle item selection
  const handleSelectItem = (itemId: string, data: typeof popupData, entryId?: number) => {
    if (selectedItemId === itemId) {
      setSelectedItemId(null);
      setPopupData(null);
      // Clear highlights when deselecting
      setHighlightedSentiment(null);
      setHighlightedKeyword(null);
      onSentimentHighlight?.(null);
      onKeywordHighlight?.(null);
      onMarkerIdHighlight?.(null);
    } else {
      setSelectedItemId(itemId);
      setPopupData(data);
      // Seek to the timestamp (without auto-play)
      if (data?.seconds !== undefined) {
        onSeekToTime?.(data.seconds, false);
      }
      
      // Highlight specific marker on timeline by ID
      if (entryId !== undefined) {
        // Use marker ID for specific highlighting (works for all types: sentiment, keyword, marker)
        onMarkerIdHighlight?.(entryId);
        // Clear sentiment/keyword-based highlights
        setHighlightedSentiment(null);
        setHighlightedKeyword(null);
        onSentimentHighlight?.(null);
        onKeywordHighlight?.(null);
      } else {
        // Clear all highlights if no entry ID
        setHighlightedSentiment(null);
        setHighlightedKeyword(null);
        onSentimentHighlight?.(null);
        onKeywordHighlight?.(null);
        onMarkerIdHighlight?.(null);
      }
    }
  };

  // Open Add Response popup
  const handleAddResponse = () => {
    if (popupData) {
      setEditingResponse(null);
      setIsPopupOpen(true);
    }
  };

  // Edit existing response - can take timestamp string or ResponseData object
  const handleEditResponse = (timestampOrResponse: string | ResponseData) => {
    let existingResponse: ResponseData | undefined;
    
    if (typeof timestampOrResponse === 'string') {
      existingResponse = responses.find(r => r.timestamp === timestampOrResponse);
    } else {
      existingResponse = timestampOrResponse;
    }
    
    if (existingResponse) {
      setEditingResponse(existingResponse);
      // Set popupData from the existing response
      setPopupData({
        timestamp: existingResponse.timestamp,
        seconds: existingResponse.seconds,
        type: existingResponse.type,
        label: existingResponse.label,
        description: existingResponse.description,
        transcript: existingResponse.transcript,
        role: existingResponse.role,
      });
      setIsPopupOpen(true);
    }
  };

  // Remove response - can take timestamp or response id
  const handleRemoveResponse = (timestampOrId: string) => {
    setResponses(prev => prev.filter(r => r.timestamp !== timestampOrId && r.id !== timestampOrId));
  };

  // Handle submit response
  const handleSubmitResponse = (data: ResponseData) => {
    if (editingResponse) {
      // Update existing response
      setResponses(prev => prev.map(r => r.id === data.id ? data : r));
    } else {
      // Add new response
      setResponses(prev => [...prev, data]);
    }
    setSelectedItemId(null);
    setPopupData(null);
  };

  // Check if item has response
  const hasResponse = (timestamp: string) => {
    return responses.some(r => r.timestamp === timestamp);
  };

  return (
    <div className="relative w-[504px] flex bg-[#1f1d23] rounded-lg overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(242,239,237,0.12)]">
          <div className="relative">
            <button 
              onClick={() => setIsTabDropdownOpen(!isTabDropdownOpen)}
              className="flex items-center gap-3 text-[20px] font-semibold text-[rgba(242,242,242,0.85)] underline decoration-dotted hover:text-[#ffd563] transition-colors"
            >
              {activeTab === "overview" && "Overview"}
              {activeTab === "details" && "Flagged moments"}
              {activeTab === "transcript" && "Transcript"}
              {activeTab === "response" && "Review"}
              <svg className={`w-6 h-6 transition-transform ${isTabDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10L12 15L17 10H7Z" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {isTabDropdownOpen && (
              <>
                {/* Backdrop to close dropdown when clicking outside */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsTabDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-[200px] bg-[#2a2830] border border-[rgba(242,239,237,0.15)] rounded-lg shadow-lg z-50 overflow-hidden">
                  <button
                    onClick={() => { setActiveTab("overview"); setIsTabDropdownOpen(false); }}
                    className={`w-full px-4 py-3 text-left text-[14px] hover:bg-[rgba(255,255,255,0.08)] transition-colors flex items-center gap-3 ${activeTab === "overview" ? "text-[#ffd563] bg-[rgba(255,213,99,0.1)]" : "text-[#f2efed]"}`}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7V10H17V12ZM13 16H7V14H13V16Z" />
                    </svg>
                    Overview
                  </button>
                  <button
                    onClick={() => { setActiveTab("details"); setIsTabDropdownOpen(false); }}
                    className={`w-full px-4 py-3 text-left text-[14px] hover:bg-[rgba(255,255,255,0.08)] transition-colors flex items-center gap-3 ${activeTab === "details" ? "text-[#ffd563] bg-[rgba(255,213,99,0.1)]" : "text-[#f2efed]"}`}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14.4 6L14 4H5V21H7V14H12.6L13 16H20V6H14.4Z" />
                    </svg>
                    Flagged moments
                  </button>
                  <button
                    onClick={() => { setActiveTab("transcript"); setIsTabDropdownOpen(false); }}
                    className={`w-full px-4 py-3 text-left text-[14px] hover:bg-[rgba(255,255,255,0.08)] transition-colors flex items-center gap-3 ${activeTab === "transcript" ? "text-[#ffd563] bg-[rgba(255,213,99,0.1)]" : "text-[#f2efed]"}`}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" />
                    </svg>
                    Transcript
                  </button>
                  <button
                    onClick={() => { setActiveTab("response"); setIsTabDropdownOpen(false); }}
                    className={`w-full px-4 py-3 text-left text-[14px] hover:bg-[rgba(255,255,255,0.08)] transition-colors flex items-center gap-3 ${activeTab === "response" ? "text-[#ffd563] bg-[rgba(255,213,99,0.1)]" : "text-[#f2efed]"}`}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                    </svg>
                    Review
                  </button>
                </div>
              </>
            )}
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded hover:bg-[rgba(255,255,255,0.05)]">
            <CloseIcon className="w-5 h-5 text-[#f2efed]" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Overview Tab Content */}
          {activeTab === "overview" && (
            <div className="flex flex-col">
              {/* Basic Metadata */}
              <div className="px-6 py-4">
                <p className="text-[16px] font-medium text-[#f2efed] mb-2">
                  Reviewing video recorded by
                </p>
                <div className="flex items-center gap-1 mb-2">
                  <UserIcon className="w-4 h-4 text-[#f2efed]" />
                  <span className="text-[20px] font-medium text-[#f2efed]">
                    Ofc. Scott, Kurt (5294)
                  </span>
                </div>
                <p className="text-[13px] text-[rgba(242,239,237,0.75)] mb-2">
                  ID: 2025-12345
                </p>
                <p className="text-[16px] font-medium text-[#f2efed] mb-3">
                  Axon Body Cam 3 2023-05-31
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 text-[13px] text-[#f2efed] bg-[rgba(242,239,237,0.12)] border border-[rgba(242,239,237,0.25)] rounded-full">
                    Traffic stop
                  </span>
                  <span className="px-3 py-1 text-[13px] text-[#f2efed] bg-[rgba(242,239,237,0.12)] border border-[rgba(242,239,237,0.25)] rounded-full">
                    DUI
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="pb-2">
                {/* Recorded on */}
                <div className="flex items-start gap-4 px-6 py-2">
                  <RecordIcon className="w-4 h-4 text-[#f2efed] mt-0.5" />
                  <div>
                    <p className="text-[13px] font-semibold text-[rgba(242,239,237,0.75)]">
                      Recorded on (UTC-07:00)
                    </p>
                    <p className="text-[16px] text-[#f2efed]">Dec 31, 2025 12:30 PM</p>
                  </div>
                </div>

                {/* Location - with map background */}
                <div className="relative h-[120px] overflow-hidden">
                  {/* Map Background */}
                  <div className="absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="/map-preview.png" 
                      alt="Location map" 
                      className="absolute right-[-20px] top-0 h-full w-[300px] object-cover"
                      style={{
                        maskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)'
                      }}
                    />
                    
                    {/* Location marker with rings */}
                    <div className="absolute top-1/2 right-[70px] -translate-y-1/2 flex items-center justify-center">
                      {/* Outer ring - olive/brown */}
                      <div className="absolute w-[70px] h-[70px] rounded-full bg-[#5c5040] opacity-70" />
                      {/* Middle ring */}
                      <div className="absolute w-[50px] h-[50px] rounded-full bg-[#6b5d45] opacity-80" />
                      {/* Center dot - yellow/orange with white border */}
                      <div className="relative w-5 h-5 rounded-full bg-[#f9a825] border-[3px] border-white" />
                    </div>
                  </div>
                  
                  {/* Text Content - overlays on map */}
                  <div className="relative z-10 flex items-start gap-3 px-6 py-4 h-full">
                    <LocationIcon className="w-5 h-5 text-[rgba(242,239,237,0.4)] flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[rgba(242,239,237,0.6)] mb-1">
                        Location
                      </p>
                      <p className="text-[18px] font-medium text-[#f2efed] mb-1">
                        37-15 13th St, Astoria, NY...
                      </p>
                      <p className="text-[14px] text-[rgba(242,239,237,0.5)]">
                        40.757742, -73.938893
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flagged Moments Summary */}
              <div className="border-t border-[rgba(242,239,237,0.05)]">
                <div className="flex items-center justify-between px-6 py-4">
                  <span className="text-[16px] font-medium text-[#f2efed]">
                    Flagged moments ({flaggedMoments.length})
                  </span>
                  <button 
                    onClick={() => setActiveTab("details")}
                    className="text-[13px] font-semibold text-[rgba(242,242,242,0.85)] underline decoration-dotted hover:text-[#ffd563]"
                  >
                    Details
                  </button>
                </div>

                {/* Sentiment Summary */}
                <div className="px-6 py-2 flex items-center gap-1">
                  <SparkleIcon className="w-4 h-4 text-[#f2ece9]" />
                  <span className="text-[13px] font-semibold text-[rgba(242,239,237,0.75)]">
                    Sentiment auto summary
                  </span>
                  <span className="ml-auto px-2 py-1 text-[13px] text-[#c1aaf2] bg-[rgba(242,242,242,0.12)] rounded">
                    Overall: {sentimentSummary.overall}
                  </span>
                </div>

                {/* Sentiment Bars - Dynamic from data */}
                {sentimentSummary.items.map((item) => (
                  <SentimentBar 
                    key={item.label}
                    label={item.label} 
                    percentage={item.percentage}
                    isActive={highlightedSentiment === item.originalLabel}
                    onClick={() => {
                      const newSentiment = highlightedSentiment === item.originalLabel ? null : item.originalLabel;
                      setHighlightedSentiment(newSentiment);
                      onSentimentHighlight?.(newSentiment);
                      // Clear keyword and marker ID highlight when selecting sentiment
                      if (newSentiment) {
                        setHighlightedKeyword(null);
                        onKeywordHighlight?.(null);
                        onMarkerIdHighlight?.(null); // Clear specific marker highlight
                      }
                    }}
                  />
                ))}

                {/* Auto Generated Markers */}
                <div className="px-6 py-2 mt-2">
                  <p className="text-[11px] font-bold text-[rgba(242,239,237,0.75)] uppercase tracking-[1px]">
                    Auto generated markers
                  </p>
                </div>

                {/* Marker Cards Carousel */}
                <div className="px-6 py-4 overflow-x-auto">
                  <div className="flex gap-4">
                    <MarkerCard
                      time="0:12"
                      seconds={12}
                      description="TASER CEW: Safety Off (armed)"
                      onClick={() => {
                        const isThisFrame = isVideoPlaying && currentVideoTime !== undefined && 
                          Math.abs(currentVideoTime - 12) < 2;
                        if (isThisFrame) {
                          onSeekAndToggle?.(12);
                        } else if (isVideoPlaying) {
                          onPauseVideo?.();
                          onSeekToTime?.(12, false);
                        } else {
                          onSeekAndToggle?.(12);
                        }
                      }}
                      isThisFramePlaying={isVideoPlaying && currentVideoTime !== undefined && 
                        Math.abs(currentVideoTime - 12) < 2}
                    />
                    <MarkerCard
                      time="0:17"
                      seconds={17}
                      description="TASER CEW: Arc (arc button press)"
                      onClick={() => {
                        const isThisFrame = isVideoPlaying && currentVideoTime !== undefined && 
                          Math.abs(currentVideoTime - 17) < 2;
                        if (isThisFrame) {
                          onSeekAndToggle?.(17);
                        } else if (isVideoPlaying) {
                          onPauseVideo?.();
                          onSeekToTime?.(17, false);
                        } else {
                          onSeekAndToggle?.(17);
                        }
                      }}
                      isThisFramePlaying={isVideoPlaying && currentVideoTime !== undefined && 
                        Math.abs(currentVideoTime - 17) < 2}
                    />
                    <MarkerCard
                      time="2:33"
                      seconds={153}
                      description="Signal Sidearm: Potential firearm draw"
                      onClick={() => {
                        const isThisFrame = isVideoPlaying && currentVideoTime !== undefined && 
                          Math.abs(currentVideoTime - 153) < 2;
                        if (isThisFrame) {
                          onSeekAndToggle?.(153);
                        } else if (isVideoPlaying) {
                          onPauseVideo?.();
                          onSeekToTime?.(153, false);
                        } else {
                          onSeekAndToggle?.(153);
                        }
                      }}
                      isThisFramePlaying={isVideoPlaying && currentVideoTime !== undefined && 
                        Math.abs(currentVideoTime - 153) < 2}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Details (Flagged Moments) Tab Content */}
          {activeTab === "details" && (
            <div className="flex flex-col h-full">
              {/* Item count and filter */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-[rgba(242,239,237,0.08)]">
                <span className="text-[14px] text-[rgba(242,239,237,0.75)]">{flaggedMoments.length} items</span>
                <div className="relative">
                  {/* Filter button with count */}
                  <button 
                    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                    className={`flex items-center gap-1.5 px-3 h-8 rounded-lg border transition-colors ${
                      isFilterDropdownOpen 
                        ? "text-[#f2efed] bg-[rgba(255,255,255,0.1)] border-[rgba(242,239,237,0.3)]" 
                        : "text-[rgba(242,239,237,0.75)] border-[rgba(242,239,237,0.2)] hover:border-[rgba(242,239,237,0.3)] hover:text-[#f2efed]"
                    }`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 18H9V16H3V18ZM3 6V8H21V6H3ZM3 13H15V11H3V13Z" />
                    </svg>
                    <span className="text-[13px]">
                      {(() => {
                        const count = [flaggedMomentsFilter.sentiment, flaggedMomentsFilter.keyword, flaggedMomentsFilter.marker].filter(Boolean).length;
                        const isAll = count === 3;
                        return isAll ? "Filters" : `Filters (${count})`;
                      })()}
                    </span>
                  </button>
                  
                  {/* Filter Dropdown */}
                  {isFilterDropdownOpen && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsFilterDropdownOpen(false)} 
                      />
                      {/* Dropdown Menu */}
                      <div className="absolute right-0 top-full mt-1 z-50 w-48 bg-[#1f1d23] border border-[rgba(242,239,237,0.12)] rounded-lg shadow-lg py-2">
                        <div className="flex items-center justify-between px-3 py-1.5">
                          <span className="text-[11px] text-[rgba(242,239,237,0.5)] uppercase tracking-wider">
                            Filter by type
                          </span>
                          <button
                            onClick={() => setFlaggedMomentsFilter({ sentiment: true, keyword: true, marker: true })}
                            className="text-[12px] text-[#f2efed] hover:text-white px-2 py-0.5 rounded hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                          >
                            Reset
                          </button>
                        </div>
                        
                        {/* All checkbox */}
                        <label className="flex items-center gap-3 px-3 py-2 hover:bg-[rgba(242,239,237,0.05)] cursor-pointer">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                            flaggedMomentsFilter.sentiment && flaggedMomentsFilter.keyword && flaggedMomentsFilter.marker
                              ? "bg-white border-white" 
                              : "border-[rgba(242,239,237,0.3)]"
                          }`}>
                            {flaggedMomentsFilter.sentiment && flaggedMomentsFilter.keyword && flaggedMomentsFilter.marker && (
                              <svg className="w-3 h-3 text-[#141217]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
                              </svg>
                            )}
                          </div>
                          <span className="text-[14px] text-[#f2efed]">All</span>
                          <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={flaggedMomentsFilter.sentiment && flaggedMomentsFilter.keyword && flaggedMomentsFilter.marker}
                            onChange={(e) => {
                              const allChecked = e.target.checked;
                              setFlaggedMomentsFilter({ sentiment: allChecked, keyword: allChecked, marker: allChecked });
                            }}
                          />
                        </label>
                        
                        <div className="h-px bg-[rgba(242,239,237,0.08)] mx-3 my-1" />
                        
                        {/* Sentiment checkbox */}
                        <label className="flex items-center gap-3 px-3 py-2 hover:bg-[rgba(242,239,237,0.05)] cursor-pointer">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                            flaggedMomentsFilter.sentiment 
                              ? "bg-white border-white" 
                              : "border-[rgba(242,239,237,0.3)]"
                          }`}>
                            {flaggedMomentsFilter.sentiment && (
                              <svg className="w-3 h-3 text-[#141217]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
                              </svg>
                            )}
                          </div>
                          <span className="text-[14px] text-[#f2efed]">Sentiment</span>
                          <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={flaggedMomentsFilter.sentiment}
                            onChange={(e) => setFlaggedMomentsFilter(prev => ({...prev, sentiment: e.target.checked}))}
                          />
                        </label>
                        
                        {/* Keyword checkbox */}
                        <label className="flex items-center gap-3 px-3 py-2 hover:bg-[rgba(242,239,237,0.05)] cursor-pointer">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                            flaggedMomentsFilter.keyword 
                              ? "bg-white border-white" 
                              : "border-[rgba(242,239,237,0.3)]"
                          }`}>
                            {flaggedMomentsFilter.keyword && (
                              <svg className="w-3 h-3 text-[#141217]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
                              </svg>
                            )}
                          </div>
                          <span className="text-[14px] text-[#f2efed]">Keyword</span>
                          <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={flaggedMomentsFilter.keyword}
                            onChange={(e) => setFlaggedMomentsFilter(prev => ({...prev, keyword: e.target.checked}))}
                          />
                        </label>
                        
                        {/* Marker checkbox */}
                        <label className="flex items-center gap-3 px-3 py-2 hover:bg-[rgba(242,239,237,0.05)] cursor-pointer">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                            flaggedMomentsFilter.marker 
                              ? "bg-white border-white" 
                              : "border-[rgba(242,239,237,0.3)]"
                          }`}>
                            {flaggedMomentsFilter.marker && (
                              <svg className="w-3 h-3 text-[#141217]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
                              </svg>
                            )}
                          </div>
                          <span className="text-[14px] text-[#f2efed]">Marker</span>
                          <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={flaggedMomentsFilter.marker}
                            onChange={(e) => setFlaggedMomentsFilter(prev => ({...prev, marker: e.target.checked}))}
                          />
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Flagged moments list */}
              <div ref={flaggedMomentsListRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {flaggedMoments.map((item, index) => {
                  const itemId = `flagged-${String(item.id)}-${item.timestamp}`;
                  
                  // Determine type based on what triggered the flag
                  // Priority: Marker > Keyword (if keywordPriority) > Sentiment (if sentimentPriority)
                  let itemType: "marker" | "keyword" | "sentiment" = "sentiment";
                  let itemLabel = "Sentiment";
                  let itemDesc = item.sentiment;
                  
                  if (item.marker) {
                    itemType = "marker";
                    itemLabel = "Marker";
                    itemDesc = item.marker;
                  } else if (item.keywordPriority) {
                    itemType = "keyword";
                    itemLabel = "Keyword";
                    itemDesc = item.keywords.length > 0 ? item.keywords.join(", ") : item.sentiment;
                  } else if (item.sentimentPriority) {
                    itemType = "sentiment";
                    itemLabel = "Sentiment";
                    itemDesc = item.sentiment;
                  }
                  
                  return (
                    <div 
                      key={item.id || index}
                      ref={(el) => {
                        if (el) {
                          itemRefs.current.set(itemId, el);
                        } else {
                          itemRefs.current.delete(itemId);
                        }
                      }}
                    >
                      <FlaggedMomentItem 
                        time={item.timestamp}
                        seconds={item.seconds}
                        type={itemType}
                        label={itemLabel}
                        description={itemDesc}
                        transcript={item.transcript}
                        role={item.role}
                        isSelected={selectedItemId === itemId}
                        hasResponse={hasResponse(item.timestamp)}
                        onSelect={() => handleSelectItem(itemId, {
                          timestamp: item.timestamp,
                          seconds: item.seconds,
                          type: itemType,
                          label: itemLabel,
                          description: itemDesc,
                          transcript: item.transcript,
                          role: item.role,
                        }, item.id)}
                        onAddResponse={handleAddResponse}
                        onEditResponse={() => handleEditResponse(item.timestamp)}
                        onRemoveResponse={() => handleRemoveResponse(item.timestamp)}
                        onSeekToTime={(autoPlay) => onSeekToTime?.(item.seconds, autoPlay)}
                        onThumbnailClick={() => {
                          // Check if this frame is currently playing
                          const isThisFrame = isVideoPlaying && currentVideoTime !== undefined && 
                            Math.abs(currentVideoTime - item.seconds) < 2;
                          
                          if (isThisFrame) {
                            // This frame is playing, toggle (pause)
                            onSeekAndToggle?.(item.seconds);
                          } else if (isVideoPlaying) {
                            // Another frame is playing, pause then seek
                            onPauseVideo?.();
                            onSeekToTime?.(item.seconds, false);
                          } else {
                            // Video is not playing, seek and play
                            onSeekAndToggle?.(item.seconds);
                          }
                        }}
                        isVideoPlaying={isVideoPlaying}
                        isThisFramePlaying={isVideoPlaying && currentVideoTime !== undefined && 
                          Math.abs(currentVideoTime - item.seconds) < 2}
                        isSubmitted={isSubmitted}
                        onShowSentimentDetails={itemType === "sentiment" ? () => {
                          setSentimentDetailsData({
                            sentiment: itemDesc || "",
                            timestamp: item.timestamp,
                            transcript: item.transcript,
                          });
                          setIsSentimentDetailsOpen(true);
                        } : undefined}
                        onChevronClick={(itemType === "keyword" || itemType === "sentiment" || (itemType === "marker" && item.transcript)) ? () => {
                          // Set flag to skip auto-selection on tab change
                          skipAutoSelectRef.current = true;
                          
                          // Clear highlights and search first
                          setHighlightedKeyword(null);
                          onKeywordHighlight?.(null);
                          setHighlightedSentiment(null);
                          onSentimentHighlight?.(null);
                          setSearchQuery("");
                          
                          // Navigate to transcript tab
                          setActiveTab("transcript");
                          
                          const transcriptItemId = `transcript-${item.id}-${item.timestamp}`;
                          
                          // Wait for tab to render, then set selection and scroll
                          requestAnimationFrame(() => {
                            setTimeout(() => {
                              setSelectedItemId(transcriptItemId);
                              setPopupData({
                                timestamp: item.timestamp,
                                seconds: item.seconds,
                                type: itemType,
                                label: itemLabel,
                                description: itemDesc,
                                transcript: item.transcript,
                                role: item.role,
                              });
                              
                              // Find and scroll to the transcript entry
                              setTimeout(() => {
                                // Try ref first, then fallback to querySelector
                                let itemRef = transcriptItemRefs.current.get(item.id);
                                if (!itemRef) {
                                  itemRef = document.querySelector(`[data-entry-id="${item.id}"]`) as HTMLDivElement;
                                }
                                
                                if (itemRef) {
                                  itemRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  // Add highlight animation
                                  itemRef.classList.add('animate-highlight-pulse');
                                  setTimeout(() => {
                                    itemRef?.classList.remove('animate-highlight-pulse');
                                    skipAutoSelectRef.current = false;
                                  }, 2000);
                                } else {
                                  console.log('Could not find transcript entry:', item.id);
                                  skipAutoSelectRef.current = false;
                                }
                              }, 150);
                            }, 50);
                          });
                        } : undefined}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Transcript Tab Content */}
          {activeTab === "transcript" && (
            <div className="flex flex-col h-full">
              {/* Search bar */}
              <div className="px-4 py-3 border-b border-[rgba(242,239,237,0.08)]">
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 bg-[rgba(242,239,237,0.06)] border border-[rgba(242,239,237,0.15)] rounded-lg px-3 py-2">
                    <svg className="w-4 h-4 text-[rgba(242,239,237,0.4)]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" />
                    </svg>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Click to search..."
                      className="flex-1 bg-transparent text-[14px] text-[#f2efed] placeholder-[rgba(242,239,237,0.4)] outline-none"
                    />
                    {/* Results count and navigation */}
                    {searchQuery && (
                      <>
                        <span className="text-[13px] text-[rgba(242,239,237,0.5)] whitespace-nowrap">
                          {searchResults.length > 0 ? `${currentSearchIndex + 1}/${searchResults.length}` : '0 results'}
                        </span>
                        <div className="flex items-center gap-0.5 ml-1">
                          <button
                            onClick={() => navigateToSearchResult(currentSearchIndex - 1)}
                            disabled={searchResults.length === 0}
                            className="w-6 h-6 flex items-center justify-center text-[rgba(242,239,237,0.5)] hover:text-[#f2efed] disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M7.41 15.41L12 10.83L16.59 15.41L18 14L12 8L6 14L7.41 15.41Z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => navigateToSearchResult(currentSearchIndex + 1)}
                            disabled={searchResults.length === 0}
                            className="w-6 h-6 flex items-center justify-center text-[rgba(242,239,237,0.5)] hover:text-[#f2efed] disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z" />
                            </svg>
                          </button>
                        </div>
                        <button
                          onClick={() => setSearchQuery("")}
                          className="w-5 h-5 flex items-center justify-center text-[rgba(242,239,237,0.4)] hover:text-[#f2efed]"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Keyword tags */}
              <div className="px-4 py-3 border-b border-[rgba(242,239,237,0.08)]">
                <div className={`flex flex-wrap gap-2 ${isKeywordsExpanded ? "max-h-[180px] overflow-y-auto scrollbar-hide" : ""}`}>
                  {(isKeywordsExpanded ? keywordTags : keywordTags.slice(0, 7)).map((tag, index) => (
                    <KeywordTag 
                      key={index} 
                      label={tag.label} 
                      count={tag.count}
                      isActive={highlightedKeyword === tag.label || searchQuery.toLowerCase() === tag.label.toLowerCase()}
                      onClick={() => {
                        const newKeyword = highlightedKeyword === tag.label ? null : tag.label;
                        setHighlightedKeyword(newKeyword);
                        onKeywordHighlight?.(newKeyword);
                        // Clear sentiment and marker ID highlight when selecting keyword
                        if (newKeyword) {
                          setHighlightedSentiment(null);
                          onSentimentHighlight?.(null);
                          onMarkerIdHighlight?.(null); // Clear specific marker highlight
                        }
                        // Set search query to the keyword
                        setSearchQuery(newKeyword || "");
                        setCurrentSearchIndex(0);
                      }}
                    />
                  ))}
                  {!isKeywordsExpanded && keywordTags.length > 7 && (
                    <button 
                      onClick={() => setIsKeywordsExpanded(true)}
                      className="px-3 py-1.5 text-[13px] text-[rgba(242,239,237,0.5)] bg-[rgba(242,239,237,0.04)] border border-[rgba(242,239,237,0.1)] rounded-full hover:bg-[rgba(242,239,237,0.08)] hover:text-[#f2efed] transition-colors"
                    >
                      +{keywordTags.length - 7}
                    </button>
                  )}
                </div>
                {isKeywordsExpanded && keywordTags.length > 7 && (
                  <button 
                    onClick={() => setIsKeywordsExpanded(false)}
                    className="mt-2 px-3 py-1.5 text-[13px] text-[rgba(242,239,237,0.5)] bg-[rgba(242,239,237,0.04)] border border-[rgba(242,239,237,0.1)] rounded-full hover:bg-[rgba(242,239,237,0.08)] hover:text-[#f2efed] transition-colors"
                  >
                    Show less
                  </button>
                )}
              </div>

              {/* Transcript entries */}
              <div className="flex-1 overflow-y-auto divide-y divide-[rgba(242,239,237,0.06)]">
                {transcriptData.map((entry, index) => {
                  const itemId = `transcript-${entry.id}-${entry.timestamp}`;
                  const isPriority = entry.sentimentPriority || entry.keywordPriority || !!entry.marker;
                  
                  // Determine type based on what triggered the flag
                  // For non-priority entries, use "sentiment" as default type with the entry's sentiment
                  let itemType: "marker" | "keyword" | "sentiment" = "sentiment";
                  let itemLabel = "Transcript";
                  let itemDesc = entry.sentiment || "General";
                  
                  if (entry.marker) {
                    itemType = "marker";
                    itemLabel = "Marker";
                    itemDesc = entry.marker;
                  } else if (entry.keywordPriority) {
                    itemType = "keyword";
                    itemLabel = "Keyword";
                    itemDesc = entry.keywords.length > 0 ? entry.keywords.join(", ") : entry.sentiment;
                  } else if (entry.sentimentPriority) {
                    itemType = "sentiment";
                    itemLabel = "Sentiment";
                    itemDesc = entry.sentiment;
                  }

                  // Check if this entry matches search
                  const isSearchMatch = searchResults.some(r => r.id === entry.id);
                  const isCurrentSearchResult = searchResults[currentSearchIndex]?.id === entry.id;
                  
                  return (
                    <div
                      key={entry.id || index}
                      data-entry-id={entry.id}
                      ref={(el) => {
                        if (el) transcriptItemRefs.current.set(entry.id, el);
                      }}
                      className={`transition-all ${isCurrentSearchResult ? 'ring-2 ring-[#fec62e] ring-inset bg-[rgba(254,198,46,0.1)]' : isSearchMatch ? 'bg-[rgba(254,198,46,0.05)]' : ''}`}
                    >
                      <TranscriptEntryComponent 
                        time={entry.timestamp}
                        seconds={entry.seconds}
                        text={entry.transcript}
                        role={entry.role}
                        sentiment={entry.sentimentPriority ? entry.sentiment : undefined}
                        isPriority={isPriority}
                        keywords={entry.keywordPriority ? entry.keywords : []}
                        isSelected={selectedItemId === itemId}
                        hasResponse={hasResponse(entry.timestamp)}
                        searchQuery={searchQuery}
                        onSelect={() => handleSelectItem(itemId, {
                          timestamp: entry.timestamp,
                          seconds: entry.seconds,
                          type: itemType,
                          label: itemLabel,
                          description: itemDesc,
                          transcript: entry.transcript,
                          role: entry.role,
                        }, entry.id)}
                        onAddResponse={handleAddResponse}
                        onEditResponse={() => handleEditResponse(entry.timestamp)}
                        onRemoveResponse={() => handleRemoveResponse(entry.timestamp)}
                        isSubmitted={isSubmitted}
                        onShowSentimentDetails={entry.sentiment ? () => {
                          setSentimentDetailsData({
                            sentiment: entry.sentiment,
                            timestamp: entry.timestamp,
                            transcript: entry.transcript,
                          });
                          setIsSentimentDetailsOpen(true);
                        } : undefined}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Review Response Tab Content */}
          {activeTab === "response" && (
            <div className="flex flex-col h-full">
              {!isSubmitted ? (
                /* Form View - Before Submit */
                <>
                  {/* Review Results - Auto populated from responses */}
                  <div className="px-6 py-3 border-b border-[rgba(242,239,237,0.08)] flex-shrink-0">
                    <p className="text-[11px] font-bold text-[rgba(242,239,237,0.5)] uppercase tracking-[1px] mb-2">
                      Review Results <span className="text-[#ef4444]">*</span>
                    </p>
                    <div className="space-y-1 max-h-[290px] overflow-y-auto pr-2 scrollbar-hide">
                      {(() => {
                        // Get unique review results from all responses
                        const allResults = Array.from(new Set(responses.flatMap(r => r.reviewResults)));
                        const allOptions = [
                          "Great performance",
                          "Proactive",
                          "Late upload",
                          "Officer safety concern",
                          "Late camera activation",
                          "Early camera deactivation",
                          "Early TASER Deployed",
                          "Poor audio",
                          "Poor video",
                          "Incorrect category",
                          "Incorrect ID",
                          "Professionalism",
                          "Policy violation",
                        ];
                        return allOptions.map((option) => {
                          const isChecked = allResults.includes(option);
                          return (
                            <label 
                              key={option} 
                              className="flex items-center gap-2.5 cursor-pointer group py-0.5"
                              onClick={() => {
                                // Toggle in overallReviewResults for manual override
                                setOverallReviewResults(prev =>
                                  prev.includes(option)
                                    ? prev.filter(r => r !== option)
                                    : [...prev, option]
                                );
                              }}
                            >
                              <div
                                className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                                  isChecked || overallReviewResults.includes(option)
                                    ? "bg-white border-white"
                                    : "border-[rgba(242,239,237,0.3)] group-hover:border-[rgba(242,239,237,0.5)]"
                                }`}
                              >
                                {(isChecked || overallReviewResults.includes(option)) && (
                                  <svg className="w-3 h-3 text-[#141217]" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-[13px] text-[#f2efed] group-hover:text-white select-none">{option}</span>
                            </label>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="px-6 py-3 border-b border-[rgba(242,239,237,0.08)] flex-shrink-0">
                    <p className="text-[11px] font-bold text-[rgba(242,239,237,0.5)] uppercase tracking-[1px] mb-2">
                      Feedback (Optional)
                    </p>
                    <textarea
                      value={overallFeedback}
                      onChange={(e) => setOverallFeedback(e.target.value)}
                      placeholder="Add feedback for the officer"
                      className="w-full h-[60px] px-4 py-2 bg-[rgba(242,239,237,0.06)] border border-[rgba(242,239,237,0.15)] rounded-lg text-[14px] text-[#f2efed] placeholder-[rgba(242,239,237,0.4)] resize-none focus:outline-none focus:border-[rgba(242,239,237,0.3)]"
                    />
                  </div>

                  {/* Added Flagged moments */}
                  <div className="px-6 py-4 flex-1">
                    <p className="text-[16px] font-medium text-[#f2efed] mb-4">
                      Added Flagged moments ({responses.length})
                    </p>
                    
                    {responses.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-[13px] text-[rgba(242,239,237,0.4)]">
                          No flagged moments added yet
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {responses.map((response) => (
                          <div key={response.id} className="border border-[rgba(242,239,237,0.12)] rounded-lg p-3">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                {response.type === "keyword" && (
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#a855f7">
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" />
                                  </svg>
                                )}
                                {response.type === "sentiment" && (
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#f59e0b">
                                    <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" />
                                  </svg>
                                )}
                                {response.type === "marker" && (
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#fec62e">
                                    <path d="M7 2V13H10V22L17 10H13L17 2H7Z" />
                                  </svg>
                                )}
                                <span className="text-[13px] text-[#f2efed] font-medium">{response.timestamp}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleEditResponse(response)}
                                  className="px-2 py-1 text-[11px] text-[rgba(242,239,237,0.6)] hover:text-[#f2efed]"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleRemoveResponse(response.id)}
                                  className="px-2 py-1 text-[11px] text-[#ef4444]"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                            
                            {/* Content with Thumbnail */}
                            <div className="flex gap-3">
                              <div className="flex-shrink-0 rounded overflow-hidden">
                                <VideoThumbnail 
                                  videoSrc="/videos/Demo_clipAX.mp4"
                                  timestamp={response.seconds}
                                  width={72}
                                  height={48}
                                  className="rounded"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="mb-1">
                                  <span className="text-[12px] text-[rgba(242,239,237,0.5)]">{response.label}: </span>
                                  <span className="text-[13px] text-[#f2efed]">{response.description}</span>
                                </div>
                                {response.feedback && (
                                  <p className="text-[12px] text-[rgba(242,239,237,0.6)] italic truncate">
                                    &ldquo;{response.feedback}&rdquo;
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </>
              ) : (
                /* Responses View - After Submit */
                <>
                  {/* Video review results header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(242,239,237,0.08)]">
                    <span className="text-[16px] font-medium text-[#f2efed]">Video review results</span>
                    <div className="flex flex-col items-end">
                      {emailSentData ? (
                        <>
                          <span className="text-[13px] text-[#a78bfa] font-medium">Email sent</span>
                          <span className="text-[12px] text-[rgba(242,239,237,0.5)]">
                            {emailSentData.sentAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                          </span>
                        </>
                      ) : (
                        <button 
                          onClick={() => setIsEmailPopupOpen(true)}
                          className="h-9 px-4 bg-[#f2f2f2] text-[#141217] font-medium text-[14px] rounded hover:bg-white transition-colors"
                        >
                          Send Email
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Review info */}
                  <div className="px-6 py-4 space-y-4">
                    {/* Reviewing Supervisor */}
                    <div>
                      <p className="text-[11px] font-bold text-[rgba(242,239,237,0.5)] uppercase tracking-[1px] mb-2">
                        Reviewing Supervisor
                      </p>
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-[#f2efed]" />
                        <span className="text-[14px] text-[#f2efed]">Tanioka, Sidney (stanioka)</span>
                      </div>
                    </div>

                    {/* Date Completed */}
                    <div>
                      <p className="text-[11px] font-bold text-[rgba(242,239,237,0.5)] uppercase tracking-[1px] mb-2">
                        Date Completed
                      </p>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#f2efed]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z" />
                        </svg>
                        <span className="text-[14px] text-[#f2efed]">
                          {submittedDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {/* Selected results */}
                    <div>
                      <p className="text-[16px] font-medium text-[#f2efed] mb-3">Selected results</p>
                      <div className="flex flex-wrap gap-2">
                        {overallReviewResults.map((result, i) => (
                          <span key={i} className="px-3 py-1.5 text-[13px] text-[#f2efed] bg-[rgba(242,239,237,0.08)] border border-[rgba(242,239,237,0.2)] rounded-full">
                            {result}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Feedback */}
                    {overallFeedback && (
                      <div>
                        <p className="text-[16px] font-medium text-[#f2efed] mb-2">Feedback</p>
                        <p className="text-[14px] text-[rgba(242,239,237,0.75)] leading-relaxed">
                          {overallFeedback}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Added Flagged moments */}
                  <div className="px-6 py-4 border-t border-[rgba(242,239,237,0.08)]">
                    <p className="text-[16px] font-medium text-[#f2efed] mb-4">
                      Added Flagged moments ({responses.length})
                    </p>
                    
                    <div className="space-y-4">
                      {responses.map((response) => (
                        <div key={response.id} className="border border-[rgba(242,239,237,0.12)] rounded-lg overflow-hidden">
                          {/* Header with timestamp */}
                          <div className="flex items-center gap-2 px-4 py-2 bg-[rgba(242,239,237,0.04)]">
                            {response.type === "keyword" && (
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#a855f7">
                                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" />
                              </svg>
                            )}
                            {response.type === "sentiment" && (
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#f59e0b">
                                <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" />
                              </svg>
                            )}
                            {response.type === "marker" && (
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#fec62e">
                                <path d="M7 2V13H10V22L17 10H13L17 2H7Z" />
                              </svg>
                            )}
                            <span className="text-[13px] text-[#f2efed] font-medium">{response.timestamp}</span>
                          </div>

                          {/* Content with Thumbnail */}
                          <div className="p-4">
                            <div className="flex gap-3 mb-3">
                              {/* Video Thumbnail */}
                              <div className="flex-shrink-0 rounded overflow-hidden">
                                <VideoThumbnail 
                                  videoSrc="/videos/Demo_clipAX.mp4"
                                  timestamp={response.seconds}
                                  width={96}
                                  height={64}
                                  className="rounded"
                                />
                              </div>
                              
                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <div className="mb-1">
                                  <span className="text-[12px] text-[rgba(242,239,237,0.5)]">{response.label}: </span>
                                  <span className="text-[13px] text-[#f2efed]">{response.description}</span>
                                </div>
                                
                                <div>
                                  <span className="text-[12px] text-[rgba(242,239,237,0.5)]">Review response: </span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {response.reviewResults.map((result, i) => (
                                      <span key={i} className="px-2 py-0.5 text-[11px] text-[#f2efed] bg-[rgba(242,239,237,0.1)] border border-[rgba(242,239,237,0.2)] rounded">
                                        {result}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {response.feedback && (
                              <div className="bg-[rgba(254,198,46,0.15)] border-l-2 border-[#fec62e] rounded-r px-3 py-2">
                                <p className="text-[13px] text-[#f2efed] leading-relaxed">{response.feedback}</p>
                                <div className="flex items-center gap-1 mt-2 text-[12px] text-[rgba(242,239,237,0.5)]">
                                  <UserIcon className="w-3 h-3" />
                                  {response.author}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* AI disclaimer */}
                    {responses.length > 0 && (
                      <p className="text-[12px] text-[rgba(242,239,237,0.4)] mt-4 italic">
                        This sentiment was flagged by AI, but validated by the user that submitted this review.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer - Hide after submitted */}
        {!isSubmitted && (
          <div className="border-t border-[rgba(242,236,233,0.12)] px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-medium text-[#f2efed]">
                Responses {responses.length > 0 && <span className="text-[rgba(242,239,237,0.6)]">({responses.length})</span>}
              </span>
              {activeTab === "response" ? (
                /* Submit button when on Responses tab */
                (() => {
                  const allResults = Array.from(new Set(responses.flatMap(r => r.reviewResults)));
                  const hasResults = allResults.length > 0 || overallReviewResults.length > 0;
                  return (
                    <button
                      onClick={() => {
                        if (!hasResults) {
                          alert("Please add at least one response with review results");
                          return;
                        }
                        const finalResults = Array.from(new Set([...allResults, ...overallReviewResults]));
                        setOverallReviewResults(finalResults);
                        setIsSubmitted(true);
                        setSubmittedDate(new Date());
                      }}
                      disabled={!hasResults}
                      className={`h-10 px-4 font-semibold text-[16px] rounded transition-colors ${
                        hasResults
                          ? "bg-[#f2f2f2] text-[#36393d] hover:bg-[#e5e5e5]"
                          : "bg-[rgba(242,239,237,0.1)] text-[rgba(242,239,237,0.3)] cursor-not-allowed"
                      }`}
                    >
                      Submit
                    </button>
                  );
                })()
              ) : (
                /* Review button for other tabs */
                <button 
                  onClick={() => setActiveTab("response")}
                  className={`h-10 px-4 font-semibold text-[16px] rounded transition-colors ${
                    responses.length >= 1
                      ? "bg-[#ffd563] text-[#141217] hover:bg-[#fec62e]"
                      : "bg-[#f2f2f2] text-[#36393d] hover:bg-[#e5e5e5]"
                  }`}
                >
                  Review
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Side Navigation */}
      <div className="w-[56px] bg-[#1f1d23] border-l border-[rgba(242,239,237,0.12)] flex flex-col gap-2 p-2 pt-4">
        {/* Overview */}
        <button 
          onClick={() => setActiveTab("overview")}
          className={`w-10 h-10 flex items-center justify-center rounded transition-colors ${
            activeTab === "overview" 
              ? "bg-[rgba(255,213,99,0.2)] border border-[#ffd563]" 
              : "hover:bg-[rgba(255,255,255,0.05)]"
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill={activeTab === "overview" ? "#ffd563" : "#f2efed"}>
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" />
          </svg>
        </button>
        {/* Details (Flag icon) */}
        <button 
          onClick={() => setActiveTab("details")}
          className={`w-10 h-10 flex items-center justify-center rounded transition-colors ${
            activeTab === "details" 
              ? "bg-[rgba(255,213,99,0.2)] border border-[#ffd563]" 
              : "hover:bg-[rgba(255,255,255,0.05)]"
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill={activeTab === "details" ? "#ffd563" : "#f2efed"}>
            <path d="M14.4 6L14 4H5V21H7V14H12.6L13 16H20V6H14.4Z" />
          </svg>
        </button>
        {/* Transcript */}
        <button 
          onClick={() => setActiveTab("transcript")}
          className={`w-10 h-10 flex items-center justify-center rounded transition-colors ${
            activeTab === "transcript" 
              ? "bg-[rgba(255,213,99,0.2)] border border-[#ffd563]" 
              : "hover:bg-[rgba(255,255,255,0.05)]"
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill={activeTab === "transcript" ? "#ffd563" : "#f2efed"}>
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z"/>
            <path d="M7 9H17V11H7V9ZM7 12H14V14H7V12Z"/>
          </svg>
        </button>
        {/* Review Response (Star icon) */}
        <button 
          onClick={() => setActiveTab("response")}
          className={`w-10 h-10 flex items-center justify-center rounded transition-colors ${
            activeTab === "response" 
              ? "bg-[rgba(255,213,99,0.2)] border border-[#ffd563]" 
              : "hover:bg-[rgba(255,255,255,0.05)]"
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill={activeTab === "response" ? "#ffd563" : "#f2efed"}>
            <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
          </svg>
        </button>
      </div>

      {/* Add Response Popup */}
      {popupData && (
        <AddResponsePopup
          isOpen={isPopupOpen}
          onClose={() => {
            setIsPopupOpen(false);
            setEditingResponse(null);
          }}
          onSubmit={handleSubmitResponse}
          initialData={editingResponse || undefined}
          timestamp={popupData.timestamp}
          seconds={popupData.seconds}
          type={popupData.type}
          label={popupData.label}
          description={popupData.description}
          transcript={popupData.transcript}
          role={popupData.role}
          isEdit={!!editingResponse}
        />
      )}

      {/* Send Email Popup */}
      <SendEmailPopup
        isOpen={isEmailPopupOpen}
        onClose={() => setIsEmailPopupOpen(false)}
        onSend={(data) => setEmailSentData(data)}
        defaultRecipient={{ id: "5294", name: "Scott, Kurt (5294)" }}
      />

      {/* Sentiment Details Popup */}
      {sentimentDetailsData && (
        <SentimentDetailsPopup
          isOpen={isSentimentDetailsOpen}
          onClose={() => {
            setIsSentimentDetailsOpen(false);
            setSentimentDetailsData(null);
          }}
          onAddResponse={() => {
            setIsSentimentDetailsOpen(false);
            setSentimentDetailsData(null);
            handleAddResponse();
          }}
          sentiment={sentimentDetailsData.sentiment}
          timestamp={sentimentDetailsData.timestamp}
          transcript={sentimentDetailsData.transcript}
        />
      )}
    </div>
  );
});

export default SupportPane;

