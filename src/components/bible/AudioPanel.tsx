"use client";

import React, { useState, useEffect } from "react";
import { Square, X, Activity } from "lucide-react";

interface AudioPanelProps {
  isPlaying: boolean;
  rate: number;
  reference: string;
  onStop: () => void;
  onRateChange: (rate: number) => void;
  onClose: () => void;
}

export function AudioPanel({ isPlaying, rate, reference, onStop, onRateChange, onClose }: AudioPanelProps) {
  const [localRate, setLocalRate] = useState(rate);

  useEffect(() => {
    setLocalRate(rate);
  }, [rate]);

  // Keep panel visible if it has a reference, even if stopped
  if (!reference) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[70] animate-in slide-in-from-right-4 fade-in duration-500">
      <div className="flex flex-col gap-0 min-w-[300px] max-w-[90vw] bg-app-bg/95 dark:bg-navy-900/95 backdrop-blur-2xl border border-app-border rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-500 ring-1 ring-black/5">
        
        <div className="flex items-center gap-3 p-2 pr-4">
          {/* Stop Button - Stays in the panel */}
          <button 
            onClick={onStop}
            className={`flex-none h-10 w-10 flex items-center justify-center rounded-full transition-all shadow-sm group ${isPlaying ? 'bg-app-fg text-app-bg hover:scale-105' : 'bg-app-surface text-app-fg-muted opacity-50'}`}
            disabled={!isPlaying}
          >
            <Square size={14} fill="currentColor" />
          </button>

          <div className="flex-1 flex flex-col min-w-0 py-1">
            <div className="flex items-center gap-2">
              {isPlaying && <Activity size={10} className="text-sacred-gold animate-pulse shrink-0" />}
              <span className="text-[11px] font-bold text-app-fg truncate tracking-tight">
                {reference}
              </span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-sacred-gold">
              {localRate.toFixed(2)}x Speed
            </span>
          </div>

          {/* Close Button - Dismisses panel */}
          <button 
            onClick={onClose} 
            className="flex-none p-2 text-app-fg-muted hover:text-app-fg transition-colors"
            title="Dismiss Panel"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="px-6 pb-4 pt-1">
          <div className="relative flex flex-col group">
            <input
              type="range"
              min="0.25"
              max="2.0" // Capped at 2.0 for browser stability
              step="0.05"
              value={localRate}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setLocalRate(val);
                onRateChange(val);
              }}
              className="w-full h-1 bg-app-border rounded-full appearance-none cursor-pointer accent-sacred-gold focus:outline-none"
            />
            <div className="flex justify-between mt-2 px-0.5">
              {[0.5, 1.0, 1.5, 2.0].map((tick) => (
                <button 
                  key={tick}
                  onClick={() => onRateChange(tick)}
                  className={`text-[8px] font-black tracking-tighter transition-colors ${Math.abs(localRate - tick) < 0.1 ? 'text-sacred-gold' : 'text-app-fg-muted/40 hover:text-app-fg-muted'}`}
                >
                  {tick.toFixed(1)}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
