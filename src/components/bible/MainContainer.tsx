"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, ListFilter, Columns, Flame, Cross, Volume2, Square, ChevronLeft, EyeOff, Menu, ChevronRight, Settings } from "lucide-react";
import { BibleView, type BibleViewHandle } from "./BibleView";
import { PageView } from "./PageView";
import { JumpTo } from "./JumpTo";
import { DailySanctuary } from "./DailySanctuary";
import { AudioPanel } from "./AudioPanel";
import { getSeasonColor, type LiturgicalSeason } from "~/lib/liturgy";
import { useBibleAudio } from "~/hooks/useBibleAudio";
import { useScrollDirection } from "~/hooks/useScrollDirection";
import { ThemeSelector } from "~/components/ThemeSelector";

interface MainContainerProps {
  season: LiturgicalSeason;
}

type ReadingMode = "SCROLL" | "PAGE";

const BOOKS = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"];
const MOCK_TOTAL_VERSES = 35000;

export function MainContainer({ season }: MainContainerProps) {
  const [isJumpToOpen, setIsJumpToOpen] = useState(false);
  const [isSanctuaryOpen, setIsSanctuaryOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [readingMode, setReadingMode] = useState<ReadingMode>("SCROLL");
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  
  const bibleViewRef = useRef<BibleViewHandle>(null);
  const indexRef = useRef(currentVerseIndex);
  const autoplayRef = useRef(isAutoplay);
  
  const seasonColor = getSeasonColor(season);
  const audio = useBibleAudio();
  const isScrollingUp = useScrollDirection();

  useEffect(() => { indexRef.current = currentVerseIndex; }, [currentVerseIndex]);
  useEffect(() => { autoplayRef.current = isAutoplay; }, [isAutoplay]);

  const getVerseAt = useCallback((index: number) => {
    const bookIndex = Math.floor(index / 500) % BOOKS.length;
    const bookName = BOOKS[bookIndex]!;
    const chapterNumber = Math.floor((index % 500) / 30) + 1;
    const verseNumber = (index % 30) + 1;
    return {
      text: "The Word of God is living and active, sharper than any two-edged sword.",
      reference: `${bookName} ${chapterNumber}:${verseNumber}`
    };
  }, []);

  const playNextVerse = useCallback(() => {
    if (!autoplayRef.current) return;
    const nextIndex = indexRef.current + 1;
    if (nextIndex < MOCK_TOTAL_VERSES) {
      setCurrentVerseIndex(nextIndex);
      const verse = getVerseAt(nextIndex);
      audio.speak(verse.text, verse.reference, { onEnd: playNextVerse });
      if (readingMode === "SCROLL") bibleViewRef.current?.scrollToIndex(nextIndex);
    } else {
      setIsAutoplay(false);
    }
  }, [getVerseAt, audio, readingMode]);

  const handleAudioRequest = useCallback((text: string, reference: string, index?: number) => {
    if (index !== undefined) setCurrentVerseIndex(index);
    setIsAutoplay(false);
    audio.speak(text, reference);
  }, [audio]);

  const handleGlobalListen = () => {
    if (isAutoplay) {
      setIsAutoplay(false);
      audio.stop();
    } else {
      setIsAutoplay(true);
      const verse = getVerseAt(indexRef.current);
      audio.speak(verse.text, verse.reference, { onEnd: playNextVerse });
    }
  };

  const handleJump = (globalOrder: number) => {
    setCurrentVerseIndex(globalOrder);
    if (readingMode === "SCROLL") {
      bibleViewRef.current?.scrollToIndex(globalOrder);
    }
  };

  return (
    <div className="relative flex h-screen bg-white dark:bg-navy-950 transition-colors duration-500 overflow-hidden font-sans">
      
      {/* Stealth Reveal Trigger (Left Edge) */}
      <button 
        onClick={() => setIsHidden(false)}
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-[60] h-24 w-1 bg-gray-200/50 dark:bg-white/10 rounded-r-full transition-all duration-500 hover:w-3 hover:bg-sacred-gold group ${!isHidden ? "opacity-0 pointer-events-none -translate-x-full" : "opacity-100 translate-x-0"}`}
        title="Reveal Menu"
      />

      {/* Optimized Side Rail */}
      <nav 
        onMouseEnter={() => setIsMinimized(false)}
        onMouseLeave={() => setIsMinimized(true)}
        className={`fixed left-3 top-1/2 -translate-y-1/2 z-50 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col items-center gap-1.5 p-1 bg-white/90 dark:bg-navy-900/90 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 rounded-2xl shadow-2xl ring-1 ring-black/5 ${isScrollingUp && !isHidden ? "translate-x-0 opacity-100 scale-100" : "-translate-x-32 opacity-0 scale-95 pointer-events-none"} ${isMinimized ? "w-11" : "w-48"}`}
      >
        <div className={`flex items-center gap-3 w-full px-2 py-2 border-b border-gray-100 dark:border-white/5 mb-1 overflow-hidden transition-all ${isMinimized ? "justify-center" : "justify-start"}`}>
          <Cross size={16} className={`${seasonColor} shrink-0`} strokeWidth={2.5} />
          {!isMinimized && <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white truncate">Verbum Domini</span>}
        </div>

        <div className="flex flex-col gap-1 w-full overflow-hidden">
          <RailButton 
            active={isAutoplay} 
            onClick={handleGlobalListen}
            icon={isAutoplay ? <Square size={16} fill="currentColor" /> : <Volume2 size={16} />}
            label="Listen All"
            minimized={isMinimized}
            colorClass={isAutoplay ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" : ""}
          />
          <RailButton 
            onClick={() => setIsSanctuaryOpen(true)}
            icon={<Flame size={16} fill="currentColor" />}
            label="Daily Sanctuary"
            minimized={isMinimized}
            colorClass={seasonColor}
          />
          <div className="h-px w-full bg-gray-100 dark:border-white/5 my-1" />
          <RailButton 
            onClick={() => setReadingMode(prev => prev === "SCROLL" ? "PAGE" : "SCROLL")}
            icon={readingMode === "SCROLL" ? <Columns size={16} /> : <ListFilter size={16} />}
            label={readingMode === "SCROLL" ? "Page View" : "Scroll View"}
            minimized={isMinimized}
          />
          <RailButton 
            onClick={() => setIsJumpToOpen(true)}
            icon={<Search size={16} />}
            label="Search & Jump"
            minimized={isMinimized}
            primary
          />
          
          {!isMinimized && (
            <div className="mt-2 animate-in fade-in slide-in-from-left-2 duration-300">
              <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-2">Appearance</p>
              <ThemeSelector />
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-1 w-full border-t border-gray-100 dark:border-white/5 pt-2 overflow-hidden">
          {isMinimized && (
            <button 
              onClick={() => setIsMinimized(false)}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Settings size={16} />
            </button>
          )}
          <button 
            onClick={() => setIsHidden(true)}
            className={`flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all ${isMinimized ? "justify-center" : "justify-start"}`}
            title="Hide Menu"
          >
            <EyeOff size={16} />
            {!isMinimized && <span className="text-[10px] font-bold uppercase tracking-tight">Hide Interface</span>}
          </button>
        </div>
      </nav>

      <main className="flex-1 relative w-full max-w-5xl mx-auto bg-white dark:bg-navy-950 overflow-hidden">
        <div className="absolute inset-0 overflow-auto scrollbar-hide py-12 px-4 md:px-0">
          {readingMode === "SCROLL" ? (
            <BibleView ref={bibleViewRef} onAudioRequest={handleAudioRequest} />
          ) : (
            <PageView initialVerseIndex={currentVerseIndex} onAudioRequest={handleAudioRequest} />
          )}
        </div>
      </main>

      {/* Floating Context Indicator */}
      <div className={`fixed bottom-6 right-6 z-40 transition-all duration-700 ${isScrollingUp ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md rounded-full border border-gray-200 dark:border-white/10 shadow-lg shadow-black/5">
          <div className={`h-1 w-1 rounded-full ${seasonColor.replace('text-', 'bg-')}`} />
          <span className={`text-[7px] font-bold uppercase tracking-widest ${seasonColor}`}>
            {season.replace('_', ' ')}
          </span>
        </div>
      </div>

      <JumpTo isOpen={isJumpToOpen} onClose={() => setIsJumpToOpen(false)} onJump={handleJump} />
      <DailySanctuary isOpen={isSanctuaryOpen} onClose={() => setIsSanctuaryOpen(false)} season={season} onAudioRequest={handleAudioRequest} />

      {(audio.isPlaying || audio.currentReference) && (
        <AudioPanel 
          isPlaying={audio.isPlaying}
          rate={audio.rate}
          reference={audio.currentReference}
          onStop={() => { audio.stop(); setIsAutoplay(false); }}
          onRateChange={audio.setRate}
          onClose={() => { audio.stop(); setIsAutoplay(false); }}
        />
      )}
    </div>
  );
}

function RailButton({ icon, label, onClick, active, colorClass, primary, minimized }: { icon: React.ReactNode; label: string; onClick: () => void; active?: boolean; colorClass?: string; primary?: boolean; minimized: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`group flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-all active:scale-90 w-full ${primary ? "bg-gray-900 dark:bg-white text-white dark:text-navy-950 shadow-md hover:shadow-lg" : colorClass || "text-gray-400 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"} ${minimized ? "justify-center" : "justify-start"}`}
    >
      <div className="shrink-0">{icon}</div>
      {!minimized && <span className="text-[10px] font-bold uppercase tracking-tight whitespace-nowrap">{label}</span>}
    </button>
  );
}
