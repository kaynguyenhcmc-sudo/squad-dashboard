"use client";

import Link from "next/link";
import { ChevronRightIcon, UserIcon, CloseIcon } from "../icons";

function SidebarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z" />
    </svg>
  );
}

function BackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" />
    </svg>
  );
}

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 10C4.9 10 4 10.9 4 12C4 13.1 4.9 14 6 14C7.1 14 8 13.1 8 12C8 10.9 7.1 10 6 10ZM18 10C16.9 10 16 10.9 16 12C16 13.1 16.9 14 18 14C19.1 14 20 13.1 20 12C20 10.9 19.1 10 18 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" />
    </svg>
  );
}

export default function VideoReviewHeader() {
  return (
    <header className="flex items-center justify-between h-[72px] px-6 bg-[#1f1d23] border-b border-[rgba(242,239,237,0.1)]">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle */}
        <button className="w-10 h-10 flex items-center justify-center border border-[rgba(242,239,237,0.25)] rounded hover:bg-[rgba(255,255,255,0.05)]">
          <SidebarIcon className="w-5 h-5 text-[#f2efed]" />
        </button>

        {/* Back Button */}
        <Link 
          href="/"
          className="w-10 h-10 flex items-center justify-center border border-[rgba(242,239,237,0.25)] rounded hover:bg-[rgba(255,255,255,0.05)]"
        >
          <BackIcon className="w-5 h-5 text-[#f2efed]" />
        </Link>

        {/* Officer Name */}
        <div className="flex items-center gap-2">
          <UserIcon className="w-6 h-6 text-[#f2efed]" />
          <h1 className="text-[25px] font-medium text-[#f2efed] tracking-[-0.25px]">
            Ofc. Scott, Kurt (5294)
          </h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Pagination */}
        <div className="flex items-center gap-2 mr-4">
          <button className="text-[rgba(242,239,237,0.7)] hover:text-[#f2efed] flex items-center gap-1">
            <svg className="w-4 h-4 rotate-180" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
            <span className="text-[16px] font-semibold underline decoration-dotted">Previous</span>
          </button>
          <span className="text-[13px] font-medium text-[#f2efed]">1 of 3</span>
          <button className="text-[rgba(242,239,237,0.7)] hover:text-[#f2efed] flex items-center gap-1">
            <span className="text-[16px] font-semibold underline decoration-dotted">Next</span>
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Skip Button */}
        <button className="h-10 px-4 border border-[rgba(242,239,237,0.25)] rounded text-[16px] font-semibold text-[rgba(242,239,237,0.8)] hover:bg-[rgba(255,255,255,0.05)]">
          Skip
        </button>

        {/* More Options */}
        <button className="w-10 h-10 flex items-center justify-center rounded hover:bg-[rgba(255,255,255,0.05)]">
          <MoreIcon className="w-5 h-5 text-[#f2efed]" />
        </button>
      </div>
    </header>
  );
}

