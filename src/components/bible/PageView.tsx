"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Headphones, Play } from "lucide-react";

interface Verse {
  id: string;
  globalOrder: number;
  bookName: string;
  chapterNumber: number;
  verseNumber: number;
  text: string;
}

const BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", 
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "Tobit", "Judith", "Esther", "1 Maccabees", "2 Maccabees"
];

const mockVerses: Verse[] = Array.from({ length: 35000 }).map((_, i) => {
  const bookIndex = Math.floor(i / 500) % BOOKS.length;
  const bookName = BOOKS[bookIndex]!;
  const chapterNumber = Math.floor((i % 500) / 30) + 1;
  const verseNumber = (i % 30) + 1;
  return {
    id: `verse-${i}`,
    globalOrder: i,
    bookName,
    chapterNumber,
    verseNumber,
    text: "The Word of God is living and active, sharper than any two-edged sword, piercing to the division of soul and of spirit.",
  };
});

interface PageViewProps {
  initialVerseIndex: number;
  onAudioRequest: (text: string, reference: string, index?: number, startAutoplay?: boolean) => void;
  activeVerseIndex?: number | null;
  translationCode?: string;
  fontSize?: number;
}

export function PageView({ initialVerseIndex, onAudioRequest, activeVerseIndex, fontSize = 18 }: PageViewProps) {
  const [currentVerseIndex, setCurrentVerseIndex] = useState(initialVerseIndex);

  const currentVerse = mockVerses[currentVerseIndex]!;
  const chapterVerses = useMemo(() => {
    return mockVerses.filter(v => 
      v.bookName === currentVerse.bookName && 
      v.chapterNumber === currentVerse.chapterNumber
    );
  }, [currentVerse.bookName, currentVerse.chapterNumber]);

  useEffect(() => {
    setCurrentVerseIndex(initialVerseIndex);
  }, [initialVerseIndex]);

  const goToNextChapter = () => {
    const lastVerseOfChapter = chapterVerses[chapterVerses.length - 1]!;
    if (lastVerseOfChapter.globalOrder < mockVerses.length - 1) {
      const nextIdx = lastVerseOfChapter.globalOrder + 1;
      setCurrentVerseIndex(nextIdx);
      document.querySelector('.overflow-auto')?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevChapter = () => {
    const firstVerseOfChapter = chapterVerses[0]!;
    if (firstVerseOfChapter.globalOrder > 0) {
      const prevVerse = mockVerses[firstVerseOfChapter.globalOrder - 1]!;
      const firstVerseOfPrevChapter = mockVerses.find(v => 
        v.bookName === prevVerse.bookName && 
        v.chapterNumber === prevVerse.chapterNumber
      );
      const nextIdx = firstVerseOfPrevChapter?.globalOrder ?? 0;
      setCurrentVerseIndex(nextIdx);
      document.querySelector('.overflow-auto')?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleListenChapter = () => {
    const firstVerse = chapterVerses[0]!;
    onAudioRequest(firstVerse.text, `${firstVerse.bookName} ${firstVerse.chapterNumber}:${firstVerse.verseNumber}`, firstVerse.globalOrder, true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-app-bg text-app-fg px-4 md:px-12 transition-colors duration-500" style={{ fontSize: `${fontSize}px` }}>
      <div className="mb-8 border-b border-app-border pb-4 flex justify-between items-baseline">
        <div>
          <h1 className="text-2xl font-bold serif">
            {currentVerse.bookName}
          </h1>
          <h2 className="text-sm font-semibold text-app-fg-muted uppercase tracking-wide mt-1">
            Chapter {currentVerse.chapterNumber}
          </h2>
        </div>
        
        <div className="flex gap-2">
          <button onClick={handleListenChapter} className="p-2 rounded-md hover:bg-app-surface text-app-fg-muted hover:text-blue-500 transition-colors" title="Read Chapter Aloud">
            <Headphones size={20} />
          </button>
          <button onClick={goToPrevChapter} className="p-2 rounded-md hover:bg-app-surface text-app-fg-muted hover:text-app-fg transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={goToNextChapter} className="p-2 rounded-md hover:bg-app-surface text-app-fg-muted hover:text-app-fg transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {chapterVerses.map((verse) => {
          const isActive = activeVerseIndex === verse.globalOrder;
          return (
            <div key={verse.id} className={`relative pl-8 group hover:bg-app-surface rounded-lg -ml-4 p-2 transition-all duration-500 ${isActive ? "bg-sacred-gold/10 ring-1 ring-sacred-gold/20" : ""}`}>
              <button 
                onClick={(e) => { e.stopPropagation(); onAudioRequest(verse.text, `${verse.bookName} ${verse.chapterNumber}:${verse.verseNumber}`, verse.globalOrder, true); }}
                className={`absolute left-2 top-3 text-[10px] font-bold select-none font-sans transition-colors w-6 text-right ${isActive ? "text-sacred-gold" : "text-app-fg-muted hover:text-sacred-gold"}`}
              >
                <span className={isActive ? "opacity-0" : "group-hover:opacity-0 transition-opacity"}>{verse.verseNumber}</span>
                <Play size={10} className={`absolute inset-0 m-auto transition-opacity ${isActive ? "opacity-100 text-sacred-gold animate-pulse" : "opacity-0 group-hover:opacity-100 text-sacred-gold"}`} fill="currentColor" />
              </button>
              <p className="leading-relaxed serif transition-all opacity-90 group-hover:opacity-100" style={{ fontWeight: isActive ? 600 : 400 }}>
                {verse.text}
              </p>
            </div>
          );
        })}
      </div>
      
      <div className="mt-16 flex justify-between pt-8 border-t border-app-border">
        <button onClick={goToPrevChapter} className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-app-fg-muted hover:bg-app-surface transition-colors">
          <ChevronLeft size={16} /> Previous
        </button>
        <button onClick={goToNextChapter} className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-app-fg text-app-bg hover:opacity-90 transition-opacity">
          Next Chapter <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
