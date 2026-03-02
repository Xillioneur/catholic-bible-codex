"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, ListFilter, Columns, Flame, Cross, Headphones, Square, EyeOff, Settings as SettingsIcon, Play, Type, ArrowLeft } from "lucide-react";
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

const BOOKS = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel"];
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
  
  // Settings State
  const [translation, setTranslation] = useState("WEBBE");
  const [fontSize, setFontSize] = useState(18); // default 18px
  
  const bibleViewRef = useRef<BibleViewHandle>(null);
  const indexRef = useRef(currentVerseIndex);
  const autoplayRef = useRef(isAutoplay);
  
  const seasonColor = getSeasonColor(season);
  const audio = useBibleAudio();
  const isScrollingUp = useScrollDirection();

  // Load persistence
  useEffect(() => {
    const savedIndex = localStorage.getItem("vd_verse_index");
    if (savedIndex) setCurrentVerseIndex(parseInt(savedIndex, 10));
    
    const savedTrans = localStorage.getItem("vd_translation");
    if (savedTrans) setTranslation(savedTrans);

    const savedSize = localStorage.getItem("vd_font_size");
    if (savedSize) setFontSize(parseInt(savedSize, 10));
  }, []);

  // Save persistence
  useEffect(() => { 
    indexRef.current = currentVerseIndex;
    localStorage.setItem("vd_verse_index", currentVerseIndex.toString());
  }, [currentVerseIndex]);

  useEffect(() => {
    localStorage.setItem("vd_translation", translation);
  }, [translation]);

  useEffect(() => {
    localStorage.setItem("vd_font_size", fontSize.toString());
  }, [fontSize]);

  useEffect(() => { autoplayRef.current = isAutoplay; }, [isAutoplay]);

  const getVerseAt = useCallback((index: number) => {
    // Note: In real app, this should fetch with the current translationCode
    const bookIndex = Math.floor(index / 500) % BOOKS.length;
    const bookName = BOOKS[bookIndex]!;
    const chapterNumber = Math.floor((index % 500) / 30) + 1;
    const verseNumber = (index % 30) + 1;
    return {
      text: "The Word of God is living and active, sharper than any two-edged sword.",
      reference: `${bookName} ${chapterNumber}:${verseNumber}`
    };
  }, []);

  const speakRef = useRef(audio.speak);
  useEffect(() => { speakRef.current = audio.speak; }, [audio.speak]);

  const playNextVerse = useCallback(() => {
    if (!autoplayRef.current) return;
    const nextIndex = indexRef.current + 1;
    if (nextIndex < MOCK_TOTAL_VERSES) {
      setCurrentVerseIndex(nextIndex);
      const verse = getVerseAt(nextIndex);
      speakRef.current(verse.text, verse.reference, { onEnd: playNextVerse });
      if (readingMode === "SCROLL") bibleViewRef.current?.scrollToIndex(nextIndex);
    } else {
      setIsAutoplay(false);
    }
  }, [getVerseAt, readingMode]);

  const handleAudioRequest = useCallback((text: string, reference: string, index?: number, startAutoplay?: boolean) => {
    if (index !== undefined) setCurrentVerseIndex(index);
    if (startAutoplay) {
      setIsAutoplay(true);
      speakRef.current(text, reference, { onEnd: playNextVerse });
    } else {
      setIsAutoplay(false);
      speakRef.current(text, reference);
    }
  }, [playNextVerse]);

  const handleJump = (globalOrder: number) => {
    setCurrentVerseIndex(globalOrder);
    if (readingMode === "SCROLL") {
      bibleViewRef.current?.scrollToIndex(globalOrder);
    }
  };

  return (
    <div className="relative flex h-screen bg-app-bg text-app-fg transition-colors duration-500 overflow-hidden font-sans">
      
      <button onClick={() => setIsHidden(false)} className={`fixed left-0 top-1/2 -translate-y-1/2 z-[60] h-24 w-1 bg-gray-200 dark:bg-white/10 rounded-r-full transition-all duration-500 hover:w-3 hover:bg-sacred-gold group ${!isHidden ? "opacity-0 pointer-events-none -translate-x-full" : "opacity-100 translate-x-0"}`} title="Reveal Menu" />

      {/* Optimized Side Rail */}
      <nav 
        onMouseEnter={() => setIsMinimized(false)}
        onMouseLeave={() => { setIsMinimized(true); setShowSettings(false); }}
        className={`fixed left-3 top-1/2 -translate-y-1/2 z-50 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col items-center gap-1.5 p-1 bg-app-bg dark:bg-navy-900 backdrop-blur-xl border border-app-border rounded-2xl shadow-2xl ring-1 ring-black/5 ${isScrollingUp && !isHidden ? "translate-x-0 opacity-100 scale-100" : "-translate-x-32 opacity-0 scale-95 pointer-events-none"} ${isMinimized ? "w-11" : "w-56"}`}
      >
        <div className={`flex items-center gap-3 w-full px-2 py-2 border-b border-app-border mb-1 overflow-hidden transition-all ${isMinimized ? "justify-center" : "justify-start"}`}>
          <Cross size={16} className={`${seasonColor} shrink-0`} strokeWidth={2.5} />
          {!isMinimized && <span className="text-[10px] font-black uppercase tracking-widest truncate">Verbum Domini</span>}
        </div>

        <div className="flex flex-col gap-1 w-full overflow-hidden">
          {!showSettings ? (
            <>
              <RailButton onClick={() => setIsJumpToOpen(true)} icon={<Search size={16} />} label="Search & Jump" minimized={isMinimized} primary />
              <RailButton onClick={() => setReadingMode(prev => prev === "SCROLL" ? "PAGE" : "SCROLL")} icon={readingMode === "SCROLL" ? <Columns size={16} /> : <ListFilter size={16} />} label={readingMode === "SCROLL" ? "Page View" : "Scroll View"} minimized={isMinimized} colorClass="text-app-fg" />
              
              <div className="h-px w-full bg-app-border my-1" />

              <RailButton onClick={() => setIsSanctuaryOpen(true)} icon={<Flame size={16} fill="currentColor" />} label="Today's Mass" minimized={isMinimized} colorClass={seasonColor} />
              <RailButton active={isAutoplay} onClick={() => handleAudioRequest(getVerseAt(currentVerseIndex).text, getVerseAt(currentVerseIndex).reference, currentVerseIndex, !isAutoplay)} icon={isAutoplay ? <Square size={16} fill="currentColor" /> : <Headphones size={16} />} label={isAutoplay ? "Stop Audio" : "Read Aloud"} minimized={isMinimized} colorClass={isAutoplay ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" : "text-app-fg"} />
              
              <div className="h-px w-full bg-app-border my-1" />

              {!isMinimized && (
                <div className="mt-1 animate-in fade-in slide-in-from-left-2 duration-300">
                  <RailButton onClick={() => setShowSettings(true)} icon={<Type size={16} />} label="Visuals & Text" minimized={false} />
                  <div className="mt-4">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-app-fg-muted mb-2 px-2">Appearance</p>
                    <ThemeSelector />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-2 animate-in slide-in-from-right-2 duration-300">
              <button onClick={() => setShowSettings(false)} className="flex items-center gap-2 text-app-fg-muted hover:text-app-fg mb-4 transition-colors">
                <ArrowLeft size={14} />
                <span className="text-[10px] font-bold uppercase">Back</span>
              </button>
              
              <div className="space-y-4">
                <section>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-app-fg-muted mb-2">Translation</p>
                  <div className="flex flex-col gap-1">
                    {["WEBBE", "DR", "VUL"].map(t => (
                      <button key={t} onClick={() => setTranslation(t)} className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all text-left ${translation === t ? "bg-sacred-gold/10 text-sacred-gold ring-1 ring-sacred-gold/20" : "hover:bg-app-surface text-app-fg-muted"}`}>
                        {t === "WEBBE" ? "World English" : t === "DR" ? "Douay-Rheims" : "Latin Vulgate"}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-app-fg-muted mb-2">Font Size</p>
                  <div className="flex items-center gap-3 bg-app-surface rounded-lg p-2 border border-app-border">
                    <button onClick={() => setFontSize(s => Math.max(12, s - 2))} className="text-app-fg-muted hover:text-app-fg">-</button>
                    <span className="flex-1 text-center text-[10px] font-bold">{fontSize}px</span>
                    <button onClick={() => setFontSize(s => Math.min(32, s + 2))} className="text-app-fg-muted hover:text-app-fg">+</button>
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-1 w-full border-t border-app-border pt-2 overflow-hidden">
          {isMinimized && (
            <button onClick={() => setIsMinimized(false)} className="flex items-center justify-center w-9 h-9 rounded-lg text-app-fg-muted hover:text-app-fg transition-colors">
              <SettingsIcon size={16} />
            </button>
          )}
          <button onClick={() => setIsHidden(true)} className={`flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-app-fg-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all ${isMinimized ? "justify-center" : "justify-start"}`} title="Hide Menu">
            <EyeOff size={16} />
            {!isMinimized && <span className="text-[10px] font-bold uppercase tracking-tight">Hide Interface</span>}
          </button>
        </div>
      </nav>

      <main className="flex-1 relative w-full bg-app-bg overflow-hidden">
        <div className="absolute inset-0 overflow-auto py-12">
          {readingMode === "SCROLL" ? (
            <BibleView 
              ref={bibleViewRef} 
              onAudioRequest={handleAudioRequest} 
              activeVerseIndex={audio.isPlaying ? currentVerseIndex : null}
              translationCode={translation}
              fontSize={fontSize}
            />
          ) : (
            <PageView 
              initialVerseIndex={currentVerseIndex} 
              onAudioRequest={handleAudioRequest} 
              activeVerseIndex={audio.isPlaying ? currentVerseIndex : null}
              translationCode={translation}
              fontSize={fontSize}
            />
          )}
        </div>
      </main>

      <div className={`fixed bottom-6 right-6 z-40 transition-all duration-700 ${isScrollingUp ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-app-bg dark:bg-navy-900 border border-app-border rounded-full shadow-lg">
          <div className={`h-1 w-1 rounded-full ${seasonColor.replace('text-', 'bg-')}`} />
          <span className={`text-[7px] font-bold uppercase tracking-widest ${seasonColor}`}>
            {season.replace('_', ' ')}
          </span>
        </div>
      </div>

      <JumpTo isOpen={isJumpToOpen} onClose={() => setIsJumpToOpen(false)} onJump={handleJump} translationCode={translation} />
      <DailySanctuary isOpen={isSanctuaryOpen} onClose={() => setIsSanctuaryOpen(false)} season={season} onAudioRequest={handleAudioRequest} />

      {(audio.isPlaying || audio.currentReference) && (
        <AudioPanel isPlaying={audio.isPlaying} rate={audio.rate} reference={audio.currentReference} onStop={() => { audio.stop(); setIsAutoplay(false); }} onRateChange={audio.setRate} onClose={() => { audio.reset(); setIsAutoplay(false); }} />
      )}
    </div>
  );
}

function RailButton({ icon, label, onClick, active, colorClass, primary, minimized }: { icon: React.ReactNode; label: string; onClick: () => void; active?: boolean; colorClass?: string; primary?: boolean; minimized: boolean }) {
  return (
    <button onClick={onClick} className={`group flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-all active:scale-90 w-full ${primary ? "bg-app-fg text-app-bg shadow-md hover:shadow-lg" : colorClass || "text-app-fg-muted hover:text-app-fg hover:bg-app-surface"} ${minimized ? "justify-center" : "justify-start"}`}>
      <div className="shrink-0">{icon}</div>
      {!minimized && <span className="text-[10px] font-bold uppercase tracking-tight whitespace-nowrap">{label}</span>}
    </button>
  );
}
