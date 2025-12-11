"use client";

import Link from "next/link";

interface GoalsProgressProps {
  totalReviewed: number;
  goal: number;
  cycleStart: string;
  cycleEnd: string;
  isHighlighted?: boolean;
}

export default function GoalsProgress({
  totalReviewed = 12,
  goal = 20,
  cycleStart = "2/13/2023",
  cycleEnd = "2/27/2023",
  isHighlighted = false,
}: GoalsProgressProps) {
  const progressPercent = Math.min((totalReviewed / goal) * 100, 100);

  return (
    <div className="bg-[#242229] rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[24px] font-medium text-[#f2efed]">
          Goals & Progress
        </h2>
        <Link
          href="/review"
          className={`h-10 px-4 bg-[#f2efed] text-[#141217] font-semibold text-[14px] rounded hover:bg-[#e0dfdd] transition-all flex items-center justify-center ${
            isHighlighted 
              ? "animate-highlight-pulse !bg-[#ffd563] ring-4 ring-[#ffd563]/60 ring-offset-2 ring-offset-[#242229]" 
              : ""
          }`}
        >
          Review now
        </Link>
      </div>

      {/* Stats */}
      <div className="flex justify-between mb-4">
        <div className="flex flex-col gap-0">
          <span className="text-[14px] text-[#f2efed]">
            Total reviewed: {totalReviewed}
          </span>
          <span className="text-[14px] text-[#f2efed]">Goal: {goal}</span>
        </div>
        <span className="text-[14px] text-[#f2efed]">
          Current review cycle: {cycleStart} - {cycleEnd}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-4 bg-[rgba(242,239,237,0.1)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#6bc1ff] rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

