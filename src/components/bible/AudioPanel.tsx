"use client";

import React from "react";
import { Square, Play, FastForward, Rewind, X } from "lucide-react";

interface AudioPanelProps {
  isPlaying: boolean;
  rate: number;
  reference: string;
  onStop: () => void;
  onRateChange: (rate: number) => void;
  onClose: () => void;
}

export function AudioPanel({ isPlaying, rate, reference, onStop, onRateChange, onClose }: AudioPanelProps) {
  if (!isPlaying && !reference) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right duration-300">
      <div className="flex flex-col gap-3 w-64 p-4 bg-white dark:bg-navy-950 rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-liturgical-gold animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
              Audio Sanctuary
            </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md text-gray-400 transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
            {reference || "Meditating on the Word..."}
          </span>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <button 
                onClick={onStop}
                className="p-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-navy-950 hover:opacity-90 transition-opacity"
              >
                <Square size={16} fill="currentColor" />
              </button>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <span className="text-[9px] font-bold uppercase tracking-tighter text-gray-400">Speed</span>
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 p-1 rounded-lg border border-gray-100 dark:border-white/5">
                {[0.75, 1.0, 1.25, 1.5].map((r) => (
                  <button
                    key={r}
                    onClick={() => onRateChange(r)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${rate === r ? "bg-white dark:bg-white/10 text-liturgical-gold shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    {r}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
