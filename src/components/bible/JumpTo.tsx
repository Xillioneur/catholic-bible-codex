"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Book } from "lucide-react";
import { api } from "~/trpc/react";
import type { WorkerResponse } from "~/workers/bible-processor";

interface JumpToProps {
  isOpen: boolean;
  onClose: () => void;
  onJump: (globalOrder: number) => void;
}

const BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", 
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "Tobit", "Judith", "Esther", "1 Maccabees", "2 Maccabees"
];

const mockVersesForSearch = Array.from({ length: 35000 }).map((_, i) => {
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
    reference: `${bookName} ${chapterNumber}:${verseNumber}`,
    text: "The Word of God is living and active, sharper than any two-edged sword, piercing to the division of soul and of spirit.",
  };
});

export function JumpTo({ isOpen, onClose, onJump }: JumpToProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL("../../workers/bible-processor.ts", import.meta.url));
    workerRef.current.onmessage = (e: MessageEvent<WorkerResponse>) => {
      if (e.data.type === "SEARCH_RESULTS") {
        setResults(e.data.payload.results);
        setIsSearching(false);
      }
    };
    return () => workerRef.current?.terminate();
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      setIsSearching(true);
      workerRef.current?.postMessage({ 
        type: "SEARCH", 
        payload: { query, verses: mockVersesForSearch } 
      });
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [query]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 backdrop-blur-sm p-4 pt-16 transition-all duration-500">
      <div className="w-full max-w-lg bg-app-bg border border-app-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center border-b border-app-border p-3 gap-3 bg-app-surface">
          <Search className="text-app-fg-muted" size={18} />
          <input
            autoFocus
            className="flex-1 bg-transparent text-base text-app-fg outline-none placeholder:text-app-fg-muted font-medium"
            placeholder="Search verses or 'John 3:16'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isSearching && (
            <div className="h-4 w-4 border-2 border-sacred-gold border-t-transparent rounded-full animate-spin" />
          )}
          <div className="px-1.5 py-0.5 rounded border border-app-border text-[10px] font-bold text-app-fg-muted bg-app-bg">
            ESC
          </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto scrollbar-hide">
          {query.length > 0 ? (
            <div className="py-2">
              <h3 className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-app-fg-muted bg-app-surface/50">
                Results
              </h3>
              {results.length > 0 ? (
                results.map((verse: any) => (
                  <button
                    key={verse.id}
                    onClick={() => {
                      onJump(verse.globalOrder);
                      onClose();
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-app-surface transition-colors border-l-2 border-transparent hover:border-sacred-gold"
                  >
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-xs font-bold text-sacred-gold">
                        {verse.reference}
                      </span>
                    </div>
                    <p className="text-sm text-app-fg-muted line-clamp-1 font-serif">
                      {verse.text}
                    </p>
                  </button>
                ))
              ) : !isSearching && (
                <div className="p-8 text-center text-app-fg-muted text-sm">
                  No matches found for "{query}"
                </div>
              )}
            </div>
          ) : (
            <div className="p-2">
              <h3 className="px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-app-fg-muted mb-1">
                Books of the Bible
              </h3>
              <div className="grid grid-cols-2 gap-1">
                {BOOKS.map((book, idx) => (
                  <button
                    key={book}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-left text-app-fg-muted hover:text-app-fg hover:bg-app-surface rounded-md transition-colors"
                    onClick={() => {
                      onJump(idx * 500);
                      onClose();
                    }}
                  >
                    <Book size={14} className="text-app-fg-muted" />
                    <span className="font-medium">{book}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-app-surface px-4 py-2 border-t border-app-border flex justify-between items-center text-[10px] text-app-fg-muted font-bold uppercase tracking-tighter">
          <span>Worker Core Active</span>
          <span>Verbum Domini</span>
        </div>
      </div>
    </div>
  );
}
