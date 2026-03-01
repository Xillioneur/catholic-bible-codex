"use client";

import React from "react";
import { X, Calendar, BookOpen, Volume2 } from "lucide-react";
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-all">
      <div className="w-full max-w-md bg-white dark:bg-navy-950 rounded-xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
          <div className="flex items-center gap-2">
            <Calendar size={14} className={seasonColor} />
            <span className="text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-200">Daily Sanctuary</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleListenAll}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              title="Listen to Readings"
            >
              <Volume2 size={14} />
            </button>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-0 max-h-[60vh] overflow-y-auto scrollbar-hide">
          {dailyReadings.isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className={`h-5 w-5 animate-spin rounded-full border-2 border-t-transparent ${seasonColor.replace('text-', 'border-')}`} />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Loading Readings...</p>
            </div>
          ) : dailyReadings.data ? (
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {dailyReadings.data.readings.map((reading) => (
                <div key={reading.id} className="p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${seasonColor}`}>
                      {reading.type}
                    </span>
                    <span className="text-xs font-medium text-gray-400 italic">
                      {reading.reference}
                    </span>
                  </div>
                  <p className="text-base leading-relaxed serif text-gray-800 dark:text-gray-300">
                    {reading.text}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <BookOpen size={32} className="mx-auto text-gray-200 dark:text-white/10 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Readings are being prepared. Please check back shortly.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
          <button 
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-navy-950 text-xs font-bold uppercase tracking-wide hover:opacity-90 transition-opacity shadow-sm"
          >
            Reflect & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
