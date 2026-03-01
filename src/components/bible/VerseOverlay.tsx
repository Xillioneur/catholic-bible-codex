"use client";

import React, { useState } from "react";
import { Bookmark, Highlighter, MessageSquare, BookOpen, Share2, Volume2, X, Check, ArrowUpRight } from "lucide-react";
import { useStudyTools } from "~/hooks/useStudyTools";

interface VerseOverlayProps {
  verseId: string;
  reference: string;
  text: string;
  isOpen: boolean;
  onClose: () => void;
  onAudioRequest: (text: string, reference: string) => void;
}

type OverlayView = "ACTIONS" | "NOTE" | "CATECHISM";

export function VerseOverlay({ verseId, reference, text, isOpen, onClose, onAudioRequest }: VerseOverlayProps) {
  const [view, setView] = useState<OverlayView>("ACTIONS");
  const { isBookmarked, toggleBookmark, setHighlight, highlight, note, saveNote } = useStudyTools(verseId);
  const [noteContent, setNoteContent] = useState(note?.content ?? "");

  if (!isOpen) return null;

  const COLORS = [
    { name: "Gold", hex: "#fbbf24" },
    { name: "Violet", hex: "#7c3aed" },
    { name: "Green", hex: "#10b981" },
    { name: "Red", hex: "#ef4444" },
  ];

  const handleSaveNote = () => {
    saveNote(verseId, noteContent);
    setView("ACTIONS");
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex items-end justify-center p-4 animate-in slide-in-from-bottom duration-300">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white/95 dark:bg-navy-900/95 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 px-4 py-3 bg-gray-50/50 dark:bg-white/5">
          <div className="flex items-center gap-2">
            {view !== "ACTIONS" && (
              <button onClick={() => setView("ACTIONS")} className="p-1 -ml-1 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <ChevronLeft size={14} />
              </button>
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {view === "NOTE" ? "Spiritual Note" : view === "CATECHISM" ? "Church Teaching" : reference}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-3">
          {view === "ACTIONS" && (
            <>
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
                <ActionButton 
                  icon={<MessageSquare size={18} fill={note ? "currentColor" : "none"} />} 
                  label="Note" 
                  active={!!note}
                  onClick={() => {
                    setNoteContent(note?.content ?? "");
                    setView("NOTE");
                  }}
                />
                <ActionButton 
                  icon={<BookOpen size={18} />} 
                  label="Learn" 
                  onClick={() => setView("CATECHISM")}
                />
                <ActionButton icon={<Share2 size={18} />} label="Share" />
              </div>

              <div className="flex items-center gap-2 p-2 bg-gray-100/50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                <Highlighter size={14} className="text-gray-400 ml-1" />
                <div className="flex-1 flex justify-around">
                  {COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setHighlight(verseId, c.hex)}
                      className={`h-6 w-6 rounded-full border-2 transition-all hover:scale-110 active:scale-95 ${highlight?.color === c.hex ? "border-gray-900 dark:border-white ring-2 ring-gray-200 dark:ring-white/10" : "border-transparent opacity-70"}`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {view === "NOTE" && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <textarea
                autoFocus
                className="w-full h-32 p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-sm text-gray-800 dark:text-gray-200 outline-none border border-gray-100 dark:border-white/5 focus:border-sacred-gold dark:focus:border-sacred-gold transition-colors resize-none placeholder:text-gray-400"
                placeholder="Write your reflection on this Word..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
              <button 
                onClick={handleSaveNote}
                className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-navy-950 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Check size={14} />
                Confirm Note
              </button>
            </div>
          )}

          {view === "CATECHISM" && (
            <div className="space-y-3 animate-in fade-in duration-200 min-h-[160px]">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-xl">
                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase mb-1 tracking-tight">CCC Related Paragraph</p>
                <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed serif">
                  This verse is referenced in Catechism paragraph 121. "The Old Testament is an indispensable part of Sacred Scripture..."
                </p>
              </div>
              <button className="w-full py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                <ArrowUpRight size={14} />
                Open Full Catechism
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { ChevronLeft } from "lucide-react";

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
