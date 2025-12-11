"use client";

import { useState, useEffect } from "react";
import { CloseIcon } from "../icons";

interface Recipient {
  id: string;
  name: string;
}

interface SendEmailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: EmailData) => void;
  defaultRecipient: Recipient;
}

export interface EmailData {
  recipient: Recipient;
  ccRecipients: Recipient[];
  message: string;
  sentAt: Date;
}

const AVAILABLE_CC_RECIPIENTS: Recipient[] = [
  { id: "8781", name: "Nelson, Gertrude (8781)" },
  { id: "stanioka", name: "Tanioka, Sidney (stanioka)" },
  { id: "7423", name: "Johnson, Mike (7423)" },
  { id: "5512", name: "Williams, Sarah (5512)" },
];

export default function SendEmailPopup({ isOpen, onClose, onSend, defaultRecipient }: SendEmailPopupProps) {
  const [recipient] = useState<Recipient>(defaultRecipient);
  const [ccRecipients, setCcRecipients] = useState<Recipient[]>([
    { id: "8781", name: "Nelson, Gertrude (8781)" },
    { id: "stanioka", name: "Tanioka, Sidney (stanioka)" },
  ]);
  const [message, setMessage] = useState("");
  const [showCcDropdown, setShowCcDropdown] = useState(false);

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

  const handleSend = () => {
    onSend({
      recipient,
      ccRecipients,
      message,
      sentAt: new Date(),
    });
    onClose();
  };

  const removeCcRecipient = (id: string) => {
    setCcRecipients(prev => prev.filter(r => r.id !== id));
  };

  const addCcRecipient = (newRecipient: Recipient) => {
    if (!ccRecipients.find(r => r.id === newRecipient.id)) {
      setCcRecipients(prev => [...prev, newRecipient]);
    }
    setShowCcDropdown(false);
  };

  const availableToAdd = AVAILABLE_CC_RECIPIENTS.filter(
    r => !ccRecipients.find(cc => cc.id === r.id)
  );

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#1f1d23] animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(242,239,237,0.12)]">
        <h2 className="text-[18px] font-semibold text-[#f2efed]">Send Feedback Email</h2>
        <button 
          onClick={onClose} 
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[rgba(255,255,255,0.05)] text-[rgba(242,239,237,0.6)] hover:text-[#f2efed]"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-6 py-4 flex-1 overflow-y-auto space-y-5 scrollbar-hide">
        <div>
          <label className="block text-[11px] font-bold text-[rgba(242,239,237,0.5)] uppercase tracking-[1px] mb-2">
            RECIPIENT <span className="text-[#ef4444]">*</span>
          </label>
          <div className="relative">
            <div className="w-full h-11 px-4 bg-[rgba(242,239,237,0.06)] border border-[rgba(242,239,237,0.15)] rounded-lg flex items-center justify-between text-[14px] text-[#f2efed]">
              <span>{recipient.name}</span>
              <svg className="w-4 h-4 text-[rgba(242,239,237,0.5)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10L12 15L17 10H7Z" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[rgba(242,239,237,0.5)] uppercase tracking-[1px] mb-2">
            CC RECIPIENT
          </label>
          <div className="relative">
            <div 
              className="min-h-[44px] px-3 py-2 bg-[rgba(242,239,237,0.06)] border border-[rgba(242,239,237,0.15)] rounded-lg flex flex-wrap gap-2 items-center cursor-pointer pr-10"
              onClick={() => setShowCcDropdown(!showCcDropdown)}
            >
              {ccRecipients.map((r) => (
                <span 
                  key={r.id} 
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[rgba(242,239,237,0.1)] rounded text-[13px] text-[#f2efed]"
                >
                  {r.name}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCcRecipient(r.id);
                    }}
                    className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[rgba(242,239,237,0.2)]"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
                    </svg>
                  </button>
                </span>
              ))}
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgba(242,239,237,0.5)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10L12 15L17 10H7Z" />
              </svg>
            </div>
            
            {showCcDropdown && availableToAdd.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#2a2830] border border-[rgba(242,239,237,0.15)] rounded-lg shadow-xl z-10 max-h-[150px] overflow-y-auto scrollbar-hide">
                {availableToAdd.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => addCcRecipient(r)}
                    className="w-full px-4 py-2.5 text-left text-[14px] text-[#f2efed] hover:bg-[rgba(242,239,237,0.05)]"
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[rgba(242,239,237,0.5)] uppercase tracking-[1px] mb-2">
            MESSAGE
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter text"
            className="w-full h-[100px] px-4 py-3 bg-[rgba(242,239,237,0.06)] border border-[rgba(242,239,237,0.15)] rounded-lg text-[14px] text-[#f2efed] placeholder-[rgba(242,239,237,0.4)] resize-none focus:outline-none focus:border-[rgba(242,239,237,0.3)]"
          />
          <p className="mt-2 text-[13px] text-[rgba(242,239,237,0.5)]">
            Video details and review results included in Email.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[rgba(242,239,237,0.12)]">
        <button
          onClick={onClose}
          className="h-10 px-5 text-[14px] font-medium text-[#f2efed] border border-[rgba(242,239,237,0.25)] rounded hover:bg-[rgba(255,255,255,0.05)] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSend}
          className="h-10 px-5 text-[14px] font-medium text-[#1f1d23] bg-[#f2f2f2] rounded hover:bg-white transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}

