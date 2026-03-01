"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Book } from "lucide-react";
import { api } from "~/trpc/react";

interface JumpToProps {
  isOpen: boolean;
  onClose: () => void;
  onJump: (globalOrder: number) => void;
}

export function JumpTo({ isOpen, onClose, onJump }: JumpToProps) {
  const [query, setQuery] = useState("");
  const books = api.bible.getBooks.useQuery(undefined, { enabled: isOpen });
  const searchResults = api.bible.search.useQuery({ query }, { enabled: query.length > 2 });

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
            placeholder="Search verses (e.g. John 3:16) or books..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-white/10 text-[10px] font-bold text-gray-400 bg-white dark:bg-black/20">
            ESC
          </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto scrollbar-hide bg-white dark:bg-navy-950">
          {query.length > 0 ? (
            <div className="py-2">
              <h3 className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50/50 dark:bg-white/5">
                Search Results
              </h3>
              {searchResults.data?.map((verse) => (
                <button
                  key={verse.id}
                  onClick={() => {
                    onJump(verse.globalOrder);
                    onClose();
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-blue-500"
                >
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {verse.chapter.book.name} {verse.chapter.number}:{verse.number}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 font-serif">
                    {verse.text}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-2">
              <h3 className="px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Books of the Bible
              </h3>
              <div className="grid grid-cols-2 gap-1">
                {books.data?.map((book) => (
                  <button
                    key={book.id}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-left text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors"
                    onClick={() => onClose()}
                  >
                    <Book size={14} className="text-gray-400" />
                    <span className="font-medium">{book.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 dark:bg-white/5 px-4 py-2 border-t border-gray-100 dark:border-white/5 flex justify-between items-center text-[10px] text-gray-400">
          <span>
            Type <kbd className="font-sans bg-white dark:bg-white/10 px-1 rounded border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-300">?</kbd> for help
          </span>
          <span>Verbum Domini Search</span>
        </div>
      </div>
    </div>
  );
}
