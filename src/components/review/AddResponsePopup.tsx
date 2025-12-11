"use client";

import { useState, useEffect } from "react";
import VideoThumbnail from "./VideoThumbnail";

// Review result options
const reviewResultOptions = [
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

export interface ResponseData {
  id: string;
  timestamp: string;
  seconds: number;
  type: "keyword" | "sentiment" | "marker";
  label: string;
  description: string;
  transcript: string;
  role: "Officer" | "Subject";
  reviewResults: string[];
  feedback: string;
  author: string;
}

interface AddResponsePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ResponseData) => void;
  initialData?: Partial<ResponseData>;
  timestamp: string;
  seconds: number;
  type: "keyword" | "sentiment" | "marker";
  label: string;
  description: string;
  transcript: string;
  role: "Officer" | "Subject";
  isEdit?: boolean;
}

export default function AddResponsePopup({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  timestamp,
  seconds,
  type,
  label,
  description,
  transcript,
  role,
  isEdit = false,
}: AddResponsePopupProps) {
  const [selectedResults, setSelectedResults] = useState<string[]>(
    initialData?.reviewResults || []
  );
  const [feedback, setFeedback] = useState(initialData?.feedback || "");

  // Reset form when popup opens with new data
  useEffect(() => {
    if (isOpen) {
      setSelectedResults(initialData?.reviewResults || []);
      setFeedback(initialData?.feedback || "");
    }
  }, [isOpen, initialData]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const toggleResult = (result: string) => {
    setSelectedResults((prev) =>
      prev.includes(result)
        ? prev.filter((r) => r !== result)
        : [...prev, result]
    );
  };

  const handleSubmit = () => {
    if (selectedResults.length === 0) {
      alert("Please select at least one review result");
      return;
    }

    const responseData: ResponseData = {
      id: initialData?.id || `response-${Date.now()}`,
      timestamp,
      seconds,
      type,
      label,
      description,
      transcript,
      role,
      reviewResults: selectedResults,
      feedback,
      author: "Tanioka, Sidney (stanioka)",
    };

    onSubmit(responseData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#1f1d23] animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(242,239,237,0.12)]">
        <h2 className="text-[18px] font-semibold text-[#f2efed]">
          {isEdit ? "Edit response" : "Add response"}
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[rgba(255,255,255,0.05)] text-[rgba(242,239,237,0.6)] hover:text-[#f2efed]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="px-6 py-4 flex-1 flex flex-col min-h-0">
        {/* Timestamp info */}
        <div className="flex items-center gap-4 mb-4 p-3 bg-[rgba(242,239,237,0.04)] rounded-lg flex-shrink-0">
          <div className="w-[80px] h-[54px] rounded overflow-hidden flex-shrink-0">
            <VideoThumbnail 
              videoSrc="/videos/Demo_clipAX.mp4"
              timestamp={seconds}
              width={80}
              height={54}
            />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[rgba(242,239,237,0.5)] uppercase tracking-[1px]">
              Timestamp
            </p>
            <p className="text-[16px] font-medium text-[#f2efed]">{timestamp}</p>
            <p className="text-[13px] text-[rgba(242,239,237,0.6)]">
              {label}: {description}
            </p>
          </div>
        </div>

        {/* Review Results - scrollable */}
        <div className="mb-4 flex-1 min-h-0 flex flex-col">
          <p className="text-[11px] font-bold text-[rgba(242,239,237,0.5)] uppercase tracking-[1px] mb-2 flex-shrink-0">
            Review Results <span className="text-[#ef4444]">*</span>
          </p>
          <div className="flex-1 overflow-y-auto pr-2 space-y-1.5 max-h-[265px] scrollbar-hide">
            {reviewResultOptions.map((option) => (
              <label
                key={option}
                className="flex items-center gap-3 cursor-pointer group py-1"
                onClick={() => toggleResult(option)}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                    selectedResults.includes(option)
                      ? "bg-white border-white"
                      : "border-[rgba(242,239,237,0.3)] group-hover:border-[rgba(242,239,237,0.5)]"
                  }`}
                >
                  {selectedResults.includes(option) && (
                    <svg className="w-3 h-3 text-[#141217]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
                    </svg>
                  )}
                </div>
                <span className="text-[14px] text-[#f2efed] group-hover:text-white select-none">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Feedback - always visible */}
        <div className="flex-shrink-0">
          <p className="text-[11px] font-bold text-[rgba(242,239,237,0.5)] uppercase tracking-[1px] mb-2">
            Feedback (Optional)
          </p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Add feedback for the officer"
            className="w-full h-[80px] px-4 py-3 bg-[rgba(242,239,237,0.06)] border border-[rgba(242,239,237,0.15)] rounded-lg text-[14px] text-[#f2efed] placeholder-[rgba(242,239,237,0.4)] resize-none focus:outline-none focus:border-[rgba(242,239,237,0.3)]"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[rgba(242,239,237,0.12)]">
        <button
          onClick={onClose}
          className="h-10 px-5 text-[14px] font-medium text-[#f2efed] border border-[rgba(242,239,237,0.25)] rounded hover:bg-[rgba(255,255,255,0.05)] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={selectedResults.length === 0}
          className={`h-10 px-5 text-[14px] font-medium rounded transition-colors ${
            selectedResults.length > 0
              ? "bg-[#f2f2f2] text-[#1f1d23] hover:bg-white"
              : "bg-[rgba(242,239,237,0.1)] text-[rgba(242,239,237,0.3)] cursor-not-allowed"
          }`}
        >
          {isEdit ? "Save" : "Add"}
        </button>
      </div>
    </div>
  );
}

