"use client";

import { CalendarIcon } from "./icons";

export default function PageTitleRow() {
  return (
    <div className="flex items-center justify-between px-6 py-0">
      {/* Left: Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[39px] leading-[43px] font-normal text-[#f2efed]">
          Squad 5
        </h1>
        <div className="flex gap-1 text-[13px] leading-[18px]">
          <span className="text-[rgba(242,239,237,0.7)]">Supervisors:</span>
          <a href="#" className="text-[#6bc1ff] hover:underline">
            Nelson, Gertrude (8781)
          </a>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-end gap-4">
        {/* Export Button */}
        <button className="flex items-center justify-center h-10 px-4 mb-[22px] border border-[rgba(242,239,237,0.6)] rounded text-[16px] font-semibold text-[#f2efed] bg-transparent hover:bg-[rgba(255,255,255,0.05)] transition-colors">
          EXPORT
        </button>

        {/* Date Range Picker */}
        <div className="flex flex-col gap-1 w-[224px]">
          <label className="text-[13px] font-semibold text-[#f2efed] uppercase tracking-[0.5px]">
            Date Range
          </label>
          <div className="flex items-center h-10 bg-[#1c1a21] border border-[rgba(242,239,237,0.6)] rounded">
            <div className="flex items-center gap-2 flex-1 px-2">
              <span className="text-[16px] text-[#f2efed] truncate">1/1/2025</span>
              <CalendarIcon className="w-4 h-4 text-[#f2efed] flex-shrink-0" />
            </div>
            <div className="w-px h-[38px] bg-[rgba(242,239,237,0.3)] rotate-90 mx-0" />
            <div className="flex items-center gap-2 flex-1 px-2">
              <span className="text-[16px] text-[#f2efed] truncate">27/2/2025</span>
              <CalendarIcon className="w-4 h-4 text-[#f2efed] flex-shrink-0" />
            </div>
          </div>
          <span className="text-[13px] text-[rgba(242,239,237,0.7)]">
            Year to date
          </span>
        </div>
      </div>
    </div>
  );
}

