"use client";

import { useState, useEffect } from "react";

// Sentiment definitions data
const SENTIMENT_DATA: Record<string, { definition: string; spokenBy: "Officer" | "Subject" }> = {
  "Respectful/Professional": {
    definition: "Must be accompanied by heightened or adversarial language from another party / Any situation where an officer would be pushed to remain 'unprofessional'. Follows procedure in a consistent, courteous, and neutral way regardless of the circumstances. Keep things 'fair' in respect to duty. This is different from Compassionate as that appeals to emotional care and going above and beyond professionalism.",
    spokenBy: "Officer",
  },
  "Compassionate": {
    definition: "Emotional acknowledgement, humanizing, and being personable. Exhibits guardian behavior. Goes beyond expectations to acknowledge the other person's emotions, stress, or humanity in a way that feels genuinely personal and affirming.",
    spokenBy: "Officer",
  },
  "Grateful": {
    definition: "Expressing gratitude, appreciation, thankfulness.",
    spokenBy: "Subject",
  },
  "Heightened": {
    definition: "High-intensity emotional or physiological state, such as anger, fear, panic, anxious.",
    spokenBy: "Subject",
  },
  "Escalatory": {
    definition: "Uses hostile, provoking, and/or untimely language that has the potential to increase likelihood of force, emotional and situational risk, or escalate into a more dangerous situation. Examples: insults, mocking, disparaging character, derogatory language toward intelligence or capability. Does not include procedural or professional statements.",
    spokenBy: "Officer",
  },
  "Dismissive": {
    definition: "Disregards or belittles a subject's concerns and/or questions. Condescending or minimizing by implying incompetence or ignorance. Impatience (frustration at repetition, cutting people off).",
    spokenBy: "Officer",
  },
};

interface SentimentDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAddResponse: () => void;
  sentiment: string;
  timestamp: string;
  transcript?: string;
}

export default function SentimentDetailsPopup({
  isOpen,
  onClose,
  onAddResponse,
  sentiment,
  timestamp,
  transcript,
}: SentimentDetailsPopupProps) {
  const [feedbackGiven, setFeedbackGiven] = useState<"correct" | "incorrect" | null>(null);

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

  if (!isOpen) return null;

  const sentimentData = SENTIMENT_DATA[sentiment] || {
    definition: "No definition available for this sentiment.",
    spokenBy: "Officer" as const,
  };

  const handleFeedback = (isCorrect: boolean) => {
    setFeedbackGiven(isCorrect ? "correct" : "incorrect");
    // Here you could send feedback to an API
  };

  const handleDismiss = () => {
    setFeedbackGiven(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Popup - positioned to align with Flagged moments frame */}
      <div className="relative bg-[#1f1d23] w-[448px] max-h-[85vh] my-auto overflow-hidden shadow-2xl border border-[rgba(242,239,237,0.12)] rounded-lg mr-[56px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(242,239,237,0.12)]">
          <h2 className="text-[18px] font-semibold text-[#f2efed]">
            Sentiment analysis details
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
        <div className="px-6 py-5 flex-1 overflow-y-auto space-y-5 scrollbar-hide">
          {/* Spoken by */}
          <div className="flex">
            <span className="text-[14px] font-semibold text-[rgba(242,239,237,0.75)] w-[120px] flex-shrink-0">
              Spoken by:
            </span>
            <span className="text-[14px] text-[#f2efed]">
              {sentimentData.spokenBy}
            </span>
          </div>

          {/* Category */}
          <div className="flex">
            <span className="text-[14px] font-semibold text-[rgba(242,239,237,0.75)] w-[120px] flex-shrink-0">
              Category:
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(193,170,242,0.15)] rounded text-[14px] text-[#c1aaf2]">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" />
              </svg>
              {sentiment}
            </span>
          </div>

          {/* Attribute / Definition */}
          <div className="flex">
            <span className="text-[14px] font-semibold text-[rgba(242,239,237,0.75)] w-[120px] flex-shrink-0">
              Attribute:
            </span>
            <p className="text-[14px] text-[rgba(242,239,237,0.85)] leading-relaxed">
              {sentimentData.definition}
            </p>
          </div>

          {/* Transcript preview if available */}
          {transcript && (
            <div className="flex">
              <span className="text-[14px] font-semibold text-[rgba(242,239,237,0.75)] w-[120px] flex-shrink-0">
                Transcript:
              </span>
              <p className="text-[14px] text-[rgba(242,239,237,0.7)] italic leading-relaxed">
                "{transcript}"
              </p>
            </div>
          )}

          {/* Feedback section */}
          <div className="mt-4 p-4 bg-[rgba(242,239,237,0.04)] border border-[rgba(242,239,237,0.1)] rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[rgba(242,239,237,0.85)]">
                Was the sentiment detection correct?
              </span>
              <div className="flex items-center gap-2">
                {feedbackGiven === null ? (
                  <>
                    <button
                      onClick={() => handleFeedback(true)}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-[rgba(34,197,94,0.2)] text-[#22c55e] transition-colors"
                      title="Yes, correct"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleFeedback(false)}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-[rgba(239,68,68,0.2)] text-[#ef4444] transition-colors"
                      title="No, incorrect"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <span className={`text-[13px] ${feedbackGiven === "correct" ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                    {feedbackGiven === "correct" ? "✓ Marked as correct" : "✗ Marked as incorrect"}
                  </span>
                )}
                <button
                  onClick={handleDismiss}
                  className="px-3 py-1.5 text-[13px] text-[rgba(242,239,237,0.7)] hover:text-[#f2efed] hover:bg-[rgba(255,255,255,0.05)] rounded transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[rgba(242,239,237,0.12)]">
          <button
            onClick={onClose}
            className="h-10 px-5 text-[14px] font-medium text-[#f2efed] bg-[rgba(242,239,237,0.08)] border border-[rgba(242,239,237,0.2)] rounded hover:bg-[rgba(242,239,237,0.12)] transition-colors"
          >
            Close
          </button>
          <button
            onClick={onAddResponse}
            className="h-10 px-5 text-[14px] font-medium text-[#1f1d23] bg-[#f2f2f2] rounded hover:bg-white transition-colors"
          >
            Add response
          </button>
        </div>
      </div>
    </div>
  );
}

