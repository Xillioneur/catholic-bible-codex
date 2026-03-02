"use client";

import React, { useRef, useImperativeHandle, forwardRef, useState, useMemo, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { VerseOverlay } from "./VerseOverlay";
import { useStudyTools } from "~/hooks/useStudyTools";
import { Play } from "lucide-react";
import { api } from "~/trpc/react";

export interface BibleViewHandle {
  scrollToIndex: (index: number) => void;
}

interface BibleViewProps {
  onAudioRequest: (text: string, reference: string, index?: number, startAutoplay?: boolean) => void;
  activeVerseIndex?: number | null;
  translationCode?: string;
  fontSize?: number;
}

export const BibleView = forwardRef<BibleViewHandle, BibleViewProps>(({ onAudioRequest, activeVerseIndex, translationCode = "WEBBE", fontSize = 18 }, ref) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [selectedVerse, setSelectedVerse] = useState<any | null>(null);
  const { highlights } = useStudyTools();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.bible.getInfiniteVerses.useInfiniteQuery(
    { limit: 50, translationCode },
    { 
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: Infinity,
    }
  );

  const allVerses = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  const getScrollElement = () => parentRef.current?.parentElement || null;

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allVerses.length + 1 : allVerses.length,
    getScrollElement,
    estimateSize: () => fontSize * 3, // Adapt estimate to font size
    overscan: 40,
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();
    if (!lastItem) return;
    if (lastItem.index >= allVerses.length - 10 && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, allVerses.length, rowVirtualizer.getVirtualItems(), fetchNextPage]);

  useImperativeHandle(ref, () => ({
    scrollToIndex: (index: number) => {
      rowVirtualizer.scrollToIndex(index, { align: "start" });
    },
  }));

  if (!data && allVerses.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 animate-pulse">
        <div className="text-sacred-gold text-[10px] font-black uppercase tracking-[0.3em]">Preparing the Word...</div>
      </div>
    );
  }

  return (
    <div ref={parentRef} className="w-full max-w-5xl mx-auto px-4 md:px-12 bg-app-bg text-app-fg" style={{ fontSize: `${fontSize}px` }}>
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: "100%", position: "relative" }}>
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const isLoader = virtualItem.index >= allVerses.length;
          const verse = allVerses[virtualItem.index];

          if (isLoader) {
            return (
              <div key="loader" ref={rowVirtualizer.measureElement} data-index={virtualItem.index} style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${virtualItem.start}px)` }} className="py-10 text-center opacity-20">
                <div className="h-4 w-3/4 bg-app-surface mx-auto rounded animate-pulse" />
              </div>
            );
          }

          const isNewChapter = verse.number === 1;
          const isNewBook = isNewChapter && verse.chapter.number === 1;
          const highlight = highlights?.find(h => h.verseId === verse.id);
          const isActive = activeVerseIndex === verse.globalOrder;

          return (
            <div key={verse.id} data-index={virtualItem.index} ref={rowVirtualizer.measureElement} style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${virtualItem.start}px)` }} className="py-1">
              {isNewBook && (
                <div className="pt-12 pb-6 border-b border-app-border mb-6">
                  <h1 className="text-3xl font-bold serif tracking-tight">{verse.chapter.book.name}</h1>
                </div>
              )}
              {isNewChapter && !isNewBook && (
                <div className="pt-8 pb-4">
                  <h2 className="text-xl font-semibold text-fg-secondary serif">Chapter {verse.chapter.number}</h2>
                </div>
              )}
              
              <div className={`flex items-baseline gap-3 group cursor-pointer -mx-2 px-2 py-1 rounded-md transition-all duration-500 ${isActive ? "bg-sacred-gold/10 ring-1 ring-sacred-gold/20" : ""}`} style={{ backgroundColor: highlight ? `${highlight.color}20` : undefined }}>
                <button onClick={(e) => { e.stopPropagation(); onAudioRequest(verse.text, `${verse.chapter.book.name} ${verse.chapter.number}:${verse.number}`, verse.globalOrder, true); }} className="text-[10px] font-bold w-6 shrink-0 text-right select-none font-sans transition-colors relative mt-1.5">
                  <span className={isActive ? "opacity-0" : "group-hover:opacity-0 transition-opacity text-fg-secondary"}>{verse.number}</span>
                  <Play size={10} className={`absolute inset-0 m-auto transition-opacity ${isActive ? "opacity-100 text-sacred-gold animate-pulse" : "opacity-0 group-hover:opacity-100 text-sacred-gold"}`} fill="currentColor" />
                </button>
                <p onClick={() => setSelectedVerse(verse)} className="leading-relaxed serif flex-1 transition-all opacity-90 hover:opacity-100" style={{ fontWeight: isActive || highlight ? 600 : 400 }}>
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
          reference={`${selectedVerse.chapter.book.name} ${selectedVerse.chapter.number}:${selectedVerse.number}`}
          text={selectedVerse.text}
          isOpen={!!selectedVerse}
          onClose={() => setSelectedVerse(null)}
          onAudioRequest={(t, r) => onAudioRequest(t, r, selectedVerse.globalOrder, false)}
        />
      )}
    </div>
  );
});

BibleView.displayName = "BibleView";
