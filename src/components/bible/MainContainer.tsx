"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, ListFilter, Columns, Flame, Cross, Volume2, Square, ChevronLeft, EyeOff, Menu, ChevronRight } from "lucide-react";
import { BibleView, type BibleViewHandle } from "./BibleView";
import { PageView } from "./PageView";
import { JumpTo } from "./JumpTo";
import { DailySanctuary } from "./DailySanctuary";
import { AudioPanel } from "./AudioPanel";
import { getSeasonColor, type LiturgicalSeason } from "~/lib/liturgy";
import { useBibleAudio } from "~/hooks/useBibleAudio";
import { useScrollDirection } from "~/hooks/useScrollDirection";

interface MainContainerProps {
  season: LiturgicalSeason;
}

type ReadingMode = "SCROLL" | "PAGE";

const BOOKS = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"];
const MOCK_TOTAL_VERSES = 35000;

export function MainContainer({ season }: MainContainerProps) {
  const [isJumpToOpen, setIsJumpToOpen] = useState(false);
  const [isSanctuaryOpen, setIsSanctuaryOpen] = useState(false);
  const [readingMode, setReadingMode] = useState<ReadingMode>("SCROLL");
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  
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

      {/* Ultra-Compact Side Rail */}
      <nav 
        className={`fixed left-3 top-1/2 -translate-y-1/2 z-50 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col items-center gap-1.5 p-1 bg-white/90 dark:bg-navy-900/90 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 rounded-2xl shadow-2xl ring-1 ring-black/5 ${isScrollingUp && !isHidden ? "translate-x-0 opacity-100 scale-100" : "-translate-x-20 opacity-0 scale-95 pointer-events-none"}`}
      >
        <div className="flex items-center justify-center w-9 h-9 border-b border-gray-100 dark:border-white/5 mb-0.5">
          <Cross size={16} className={`${seasonColor}`} strokeWidth={2.5} />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <RailButton 
            active={isAutoplay} 
            onClick={handleGlobalListen}
            icon={isAutoplay ? <Square size={16} fill="currentColor" /> : <Volume2 size={16} />}
            colorClass={isAutoplay ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" : ""}
            title="Listen All"
          />
          <RailButton 
            onClick={() => setIsSanctuaryOpen(true)}
            icon={<Flame size={16} fill="currentColor" />}
            colorClass={seasonColor}
            title="Daily Sanctuary"
          />
          <div className="h-px w-6 bg-gray-100 dark:border-white/5 my-0.5 mx-auto" />
          <RailButton 
            onClick={() => setReadingMode(prev => prev === "SCROLL" ? "PAGE" : "SCROLL")}
            icon={readingMode === "SCROLL" ? <Columns size={16} /> : <ListFilter size={16} />}
            title={readingMode === "SCROLL" ? "Page View" : "Scroll View"}
          />
          <RailButton 
            onClick={() => setIsJumpToOpen(true)}
            icon={<Search size={16} />}
            primary
            title="Search & Jump"
          />
        </div>

        {/* Minimized Hide Button */}
        <button 
          onClick={() => setIsHidden(true)}
          className="mt-2 p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all active:scale-90"
          title="Hide Menu"
        >
          <EyeOff size={14} />
        </button>
      </nav>

      <main className="flex-1 relative w-full max-w-3xl mx-auto bg-white dark:bg-navy-950 overflow-hidden">
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

function RailButton({ icon, onClick, active, colorClass, primary, title }: { icon: React.ReactNode; onClick: () => void; active?: boolean; colorClass?: string; primary?: boolean; title: string }) {
  return (
    <button 
      onClick={onClick}
      title={title}
      className={`group flex items-center justify-center w-9 h-9 rounded-lg transition-all active:scale-90 ${primary ? "bg-gray-900 dark:bg-white text-white dark:text-navy-950 shadow-md hover:shadow-lg" : colorClass || "text-gray-400 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"}`}
    >
      {icon}
    </button>
  );
}
