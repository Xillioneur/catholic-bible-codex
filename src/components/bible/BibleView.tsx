"use client";

import React, { useRef, useImperativeHandle, forwardRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { VerseOverlay } from "./VerseOverlay";
import { useStudyTools } from "~/hooks/useStudyTools";

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

export interface BibleViewHandle {
  scrollToIndex: (index: number) => void;
}

interface BibleViewProps {
  onAudioRequest: (text: string, reference: string) => void;
}

export const BibleView = forwardRef<BibleViewHandle, BibleViewProps>(({ onAudioRequest }, ref) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const { highlights } = useStudyTools();

  const getScrollElement = () => {
    return parentRef.current?.parentElement || null;
  };

  const rowVirtualizer = useVirtualizer({
    count: mockVerses.length,
    getScrollElement,
    estimateSize: () => 60,
    overscan: 15,
  });

  useImperativeHandle(ref, () => ({
    scrollToIndex: (index: number) => {
      rowVirtualizer.scrollToIndex(index, { align: "start" });
    },
  }));

  return (
    <div
      ref={parentRef}
      className="w-full max-w-5xl mx-auto px-4 md:px-12 bg-app-bg text-app-fg"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const verse = mockVerses[virtualItem.index]!;
          const isNewChapter = verse.verseNumber === 1;
          const isNewBook = isNewChapter && verse.chapterNumber === 1;
          const highlight = highlights?.find(h => h.verseId === verse.id);

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={rowVirtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
              }}
              className="py-1"
            >
              {isNewBook && (
                <div className="pt-12 pb-6 border-b border-app-border mb-6">
                  <h1 className="text-3xl font-bold serif tracking-tight">
                    {verse.bookName}
                  </h1>
                </div>
              )}
              {isNewChapter && !isNewBook && (
                <div className="pt-8 pb-4">
                  <h2 className="text-xl font-semibold text-fg-secondary serif">
                    Chapter {verse.chapterNumber}
                  </h2>
                </div>
              )}
              
              <div 
                onClick={() => setSelectedVerse(verse)}
                className="flex items-baseline gap-3 group cursor-pointer hover:bg-app-surface -mx-2 px-2 py-1 rounded-md transition-colors"
                style={{ backgroundColor: highlight ? `${highlight.color}20` : undefined }}
              >
                <span className="text-[10px] font-bold text-fg-secondary w-6 shrink-0 text-right select-none font-sans">
                  {verse.verseNumber}
                </span>
                <p className={`text-base md:text-lg leading-relaxed serif ${highlight ? "font-medium" : "text-app-fg opacity-90 group-hover:opacity-100"}`}>
                  {verse.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {selectedVerse && (
        <VerseOverlay 
          verseId={selectedVerse.id}
          reference={`${selectedVerse.bookName} ${selectedVerse.chapterNumber}:${selectedVerse.verseNumber}`}
          text={selectedVerse.text}
          isOpen={!!selectedVerse}
          onClose={() => setSelectedVerse(null)}
          onAudioRequest={onAudioRequest}
        />
      )}
    </div>
  );
});

BibleView.displayName = "BibleView";
