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

// Re-using the same mock data for search consistency in prototype
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
  
  const books = api.bible.getBooks.useQuery(undefined, { enabled: isOpen });
  const workerRef = useRef<Worker | null>(null);

  // Initialize Worker
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

  // Perform Search
  useEffect(() => {
    if (query.length > 1) {
      setIsSearching(true);
      // Pass the mock data to the worker for the prototype search
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
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/30 backdrop-blur-sm p-4 pt-16 transition-all">
      <div className="w-full max-w-lg bg-white dark:bg-navy-950 rounded-lg shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden animate-in fade-in zoom-in duration-100 ring-1 ring-black/5">
        <div className="flex items-center border-b border-gray-100 dark:border-white/5 p-3 gap-3 bg-gray-50/50 dark:bg-white/5">
          <Search className="text-gray-400" size={18} />
          <input
            autoFocus
            className="flex-1 bg-transparent text-base text-gray-900 dark:text-white outline-none placeholder:text-gray-400 font-medium"
            placeholder="Search verses or 'John 3:16'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isSearching && (
            <div className="h-4 w-4 border-2 border-sacred-gold border-t-transparent rounded-full animate-spin" />
          )}
          <div className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-white/10 text-[10px] font-bold text-gray-400 bg-white dark:bg-black/20">
            ESC
          </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto scrollbar-hide bg-white dark:bg-navy-950">
          {query.length > 0 ? (
            <div className="py-2">
              <h3 className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50/50 dark:bg-white/5">
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
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-sacred-gold"
                  >
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-xs font-bold text-sacred-gold">
                        {verse.reference}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 font-serif">
                      {verse.text}
                    </p>
                  </button>
                ))
              ) : !isSearching && (
                <div className="p-8 text-center text-gray-400 text-sm">
                  No matches found for "{query}"
                </div>
              )}
            </div>
          ) : (
            <div className="p-2">
              <h3 className="px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Books of the Bible
              </h3>
              <div className="grid grid-cols-2 gap-1">
                {BOOKS.map((book, idx) => (
                  <button
                    key={book}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-left text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors"
                    onClick={() => {
                      onJump(idx * 500);
                      onClose();
                    }}
                  >
                    <Book size={14} className="text-gray-400" />
                    <span className="font-medium">{book}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 dark:bg-white/5 px-4 py-2 border-t border-gray-100 dark:border-white/5 flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
          <span>Worker Core Active</span>
          <span>Verbum Domini</span>
        </div>
      </div>
    </div>
  );
}
