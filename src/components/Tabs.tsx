"use client";

interface TabProps {
  label: string;
  isSelected?: boolean;
}

function Tab({ label, isSelected = false }: TabProps) {
  return (
    <button
      className={`flex items-center gap-2 h-10 px-4 text-[14px] tracking-[-0.14px] transition-colors ${
        isSelected
          ? "font-bold text-[#6bc1ff] border-b-2 border-[#6bc1ff]"
          : "font-medium text-[#f2efed] border-b border-transparent hover:text-[#6bc1ff]"
      }`}
    >
      {label}
    </button>
  );
}

export default function Tabs() {
  return (
    <div className="border-b border-[rgba(242,239,237,0.25)]">
      <div className="flex items-center pl-2">
        <Tab label="Device Metrics" />
        <Tab label="Review Dashboard" isSelected />
      </div>
    </div>
  );
}

