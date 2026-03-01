"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";

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
  return {
    id: `verse-${i}`,
    globalOrder: i,
    bookName: BOOKS[bookIndex]!,
    chapterNumber: Math.floor((i % 500) / 30) + 1,
    verseNumber: (i % 30) + 1,
    text: "The Word of God is living and active, sharper than any two-edged sword, piercing to the division of soul and of spirit.",
  };
});

interface PageViewProps {
  initialVerseIndex: number;
  onAudioRequest: (text: string, reference: string) => void;
}

export function PageView({ initialVerseIndex, onAudioRequest }: PageViewProps) {
  const [currentVerseIndex, setCurrentVerseIndex] = useState(initialVerseIndex);

  const currentVerse = mockVerses[currentVerseIndex]!;
  const chapterVerses = useMemo(() => {
    return mockVerses.filter(v => 
      v.bookName === currentVerse.bookName && 
      v.chapterNumber === currentVerse.chapterNumber
    );
  }, [currentVerse.bookName, currentVerse.chapterNumber]);

  const goToNextChapter = () => {
    const lastVerseOfChapter = chapterVerses[chapterVerses.length - 1]!;
    if (lastVerseOfChapter.globalOrder < mockVerses.length - 1) {
      setCurrentVerseIndex(lastVerseOfChapter.globalOrder + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      setCurrentVerseIndex(firstVerseOfPrevChapter?.globalOrder ?? 0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleListenChapter = () => {
    const fullText = chapterVerses.map(v => v.text).join(" ");
    onAudioRequest(fullText, `${currentVerse.bookName} ${currentVerse.chapterNumber}`);
  };

  return (
    <div className="min-h-full w-full bg-white dark:bg-navy-950 px-4 md:px-12 py-8 transition-colors duration-500">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 border-b border-gray-100 dark:border-white/5 pb-4 flex justify-between items-baseline">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white serif">
              {currentVerse.bookName}
            </h1>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">
              Chapter {currentVerse.chapterNumber}
            </h2>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleListenChapter}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-blue-500 transition-colors"
              title="Listen to Chapter"
            >
              <Volume2 size={20} />
            </button>
            <button 
              onClick={goToPrevChapter}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors"
              title="Previous Chapter"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={goToNextChapter}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 text-gray-900 dark:text-white transition-colors"
              title="Next Chapter"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {chapterVerses.map((verse) => (
            <div key={verse.id} className="relative pl-8 group hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg -ml-4 p-2 transition-colors cursor-pointer">
              <span className="absolute left-2 top-3 text-[10px] font-bold text-gray-400 select-none font-sans">
                {verse.verseNumber}
              </span>
              <p className="text-lg leading-relaxed serif text-gray-800 dark:text-gray-200">
                {verse.text}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex justify-between pt-8 border-t border-gray-100 dark:border-white/5">
          <button 
            onClick={goToPrevChapter}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <button 
            onClick={goToNextChapter}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-navy-950 hover:opacity-90 transition-opacity"
          >
            Next Chapter
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
