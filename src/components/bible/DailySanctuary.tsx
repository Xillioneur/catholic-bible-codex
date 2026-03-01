"use client";

import React from "react";
import { X, Calendar, BookOpen, Headphones } from "lucide-react";
import { api } from "~/trpc/react";
import { getSeasonColor, type LiturgicalSeason } from "~/lib/liturgy";

interface DailySanctuaryProps {
  isOpen: boolean;
  onClose: () => void;
  season: LiturgicalSeason;
  onAudioRequest: (text: string, reference: string) => void;
}

export function DailySanctuary({ isOpen, onClose, season, onAudioRequest }: DailySanctuaryProps) {
  const dailyReadings = api.bible.getDailyReadings.useQuery({ date: new Date() }, { enabled: isOpen });
  const seasonColor = getSeasonColor(season);

  if (!isOpen) return null;

  const handleListenAll = () => {
    if (dailyReadings.data) {
      const fullText = dailyReadings.data.readings
        .map(r => `${r.type}. ${r.text}`)
        .join(". ");
      onAudioRequest(fullText, "Daily Readings");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-all duration-500">
      <div className="w-full max-w-md bg-app-bg rounded-xl shadow-2xl border border-app-border overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-app-border bg-app-surface">
          <div className="flex items-center gap-2">
            <Calendar size={14} className={seasonColor} />
            <span className="text-xs font-bold uppercase tracking-wide text-app-fg">Daily Sanctuary</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleListenAll}
              className="p-1.5 rounded-md text-app-fg-muted hover:text-app-fg hover:bg-app-surface transition-colors"
              title="Read Aloud"
            >
              <Headphones size={14} />
            </button>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-md text-app-fg-muted hover:text-app-fg hover:bg-app-surface transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-0 max-h-[60vh] overflow-y-auto scrollbar-hide">
          {dailyReadings.isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className={`h-5 w-5 animate-spin rounded-full border-2 border-t-transparent ${seasonColor.replace('text-', 'border-')}`} />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-app-fg-muted">Loading Readings...</p>
            </div>
          ) : dailyReadings.data ? (
            <div className="divide-y divide-app-border">
              {dailyReadings.data.readings.map((reading) => (
                <div key={reading.id} className="p-6 hover:bg-app-surface transition-colors">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${seasonColor}`}>
                      {reading.type}
                    </span>
                    <span className="text-xs font-medium text-app-fg-muted italic">
                      {reading.reference}
                    </span>
                  </div>
                  <p className="text-base leading-relaxed serif text-app-fg opacity-90">
                    {reading.text}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <BookOpen size={32} className="mx-auto text-app-border mb-3" />
              <p className="text-sm text-app-fg-muted">
                Readings are being prepared. Please check back shortly.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-app-border bg-app-surface">
          <button 
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-app-fg text-app-bg text-xs font-bold uppercase tracking-wide hover:opacity-90 transition-opacity shadow-sm"
          >
            Reflect & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
