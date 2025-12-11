"use client";

export default function ButtonGroup() {
  return (
    <div className="flex w-full">
      <button className="flex-1 h-10 bg-[#242229] text-[#f2efed] font-semibold text-[14px] rounded-l border border-[rgba(242,239,237,0.25)] hover:bg-[#2a282f] transition-colors">
        Random Video Review
      </button>
      <button className="flex-1 h-10 bg-transparent text-[#fec62e] font-semibold text-[14px] rounded-r border border-[#fec62e] hover:bg-[rgba(254,198,46,0.1)] transition-colors">
        Video - Additional Video Review
      </button>
    </div>
  );
}

