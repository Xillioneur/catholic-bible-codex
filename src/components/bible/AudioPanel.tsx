"use client";

import React from "react";
import { Square, X } from "lucide-react";

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
      <div className="flex flex-col gap-3 w-64 p-4 bg-app-bg border border-app-border rounded-2xl shadow-2xl backdrop-blur-xl transition-colors duration-500">
        <div className="flex items-center justify-between border-b border-app-border pb-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-liturgical-gold animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-app-fg-muted">
              Audio Sanctuary
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-app-surface rounded-md text-app-fg-muted hover:text-app-fg transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-app-fg truncate">
            {reference || "Meditating on the Word..."}
          </span>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <button 
                onClick={onStop}
                className="p-2 rounded-full bg-app-fg text-app-bg hover:opacity-90 transition-all active:scale-95"
              >
                <Square size={16} fill="currentColor" />
              </button>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <span className="text-[9px] font-bold uppercase tracking-tighter text-app-fg-muted">Speed</span>
              <div className="flex items-center gap-2 bg-app-surface p-1 rounded-lg border border-app-border">
                {[0.75, 1.0, 1.25, 1.5].map((r) => (
                  <button
                    key={r}
                    onClick={() => onRateChange(r)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${rate === r ? "bg-app-bg text-sacred-gold shadow-sm ring-1 ring-black/5" : "text-app-fg-muted hover:text-app-fg"}`}
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
