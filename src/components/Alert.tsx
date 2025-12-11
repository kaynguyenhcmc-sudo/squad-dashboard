"use client";

import { InfoIcon, CloseIcon } from "./icons";

interface AlertProps {
  title: string;
  description: string;
  onClose?: () => void;
}

export default function Alert({ title, description, onClose }: AlertProps) {
  return (
    <div className="flex items-start gap-4 p-4 bg-[#1c1a21] border border-[rgba(242,239,237,0.25)] rounded-lg">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#165a8a] flex items-center justify-center">
        <InfoIcon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-[16px] font-semibold text-[#f2efed] mb-1">{title}</h3>
        <p className="text-[14px] text-[rgba(242,239,237,0.7)] leading-relaxed">
          {description}
        </p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 w-6 h-6 text-[rgba(242,239,237,0.5)] hover:text-[#f2efed] transition-colors"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

