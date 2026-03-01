"use client";

import React from "react";
import { Bookmark, Highlighter, MessageSquare, BookOpen, Share2, Volume2, X } from "lucide-react";
import { useStudyTools } from "~/hooks/useStudyTools";

interface VerseOverlayProps {
  verseId: string;
  reference: string;
  text: string;
  isOpen: boolean;
  onClose: () => void;
  onAudioRequest: (text: string, reference: string) => void;
}

export function VerseOverlay({ verseId, reference, text, isOpen, onClose, onAudioRequest }: VerseOverlayProps) {
  const { isBookmarked, toggleBookmark, setHighlight, highlight } = useStudyTools(verseId);

  if (!isOpen) return null;

  const COLORS = [
    { name: "Gold", hex: "#fbbf24" },
    { name: "Violet", hex: "#7c3aed" },
    { name: "Green", hex: "#10b981" },
    { name: "Red", hex: "#ef4444" },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex items-end justify-center p-4 animate-in slide-in-from-bottom duration-200">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 px-4 py-3 bg-gray-50 dark:bg-white/5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {reference}
          </span>
          <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-3">
          <div className="grid grid-cols-5 gap-1 mb-3">
            <ActionButton 
              icon={<Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />} 
              label={isBookmarked ? "Saved" : "Save"} 
              active={isBookmarked}
              onClick={() => toggleBookmark(verseId)}
            />
            <ActionButton 
              icon={<Volume2 size={18} />} 
              label="Listen" 
              onClick={() => onAudioRequest(text, reference)}
            />
            <ActionButton icon={<MessageSquare size={18} />} label="Note" />
            <ActionButton icon={<BookOpen size={18} />} label="Catechism" />
            <ActionButton icon={<Share2 size={18} />} label="Share" />
          </div>

          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-white/5 rounded-xl">
            <Highlighter size={14} className="text-gray-400 ml-1" />
            <div className="flex-1 flex justify-around">
              {COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setHighlight(verseId, c.hex)}
                  className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 active:scale-95 ${highlight?.color === c.hex ? "border-gray-900 dark:border-white" : "border-transparent"}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick, active }: { icon: React.ReactNode; label: string; onClick?: () => void; active?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 rounded-xl py-3 transition-colors ${active ? "bg-gray-100 dark:bg-white/10 text-blue-600 dark:text-blue-400" : "hover:bg-gray-50 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400"}`}
    >
      {icon}
      <span className="text-[9px] font-bold uppercase tracking-wide">{label}</span>
    </button>
  );
}
