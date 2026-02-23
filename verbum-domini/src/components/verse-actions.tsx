"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Bookmark, MessageSquare, Trash2, Check, ExternalLink, Library } from "lucide-react";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "sonner";

interface VerseActionsProps {
  verse: any;
  onUpdate: () => void;
}

export function VerseActions({ verse, onUpdate }: VerseActionsProps) {
  const [note, setNote] = useState(verse.notes?.[0]?.content ?? "");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const toggleBookmark = api.bible.toggleBookmark.useMutation({
    onSuccess: () => {
      onUpdate();
      toast.success(verse.bookmarks?.length ? "Removed from library" : "Saved to library");
    }
  });

  const setHighlight = api.bible.setHighlight.useMutation({
    onSuccess: () => {
      onUpdate();
    }
  });

  const upsertNote = api.bible.upsertNote.useMutation({
    onSuccess: () => {
      onUpdate();
      toast.success("Reflection saved");
    }
  });

  const liturgicalColors = [
    { name: "Ordinary", color: "#059669" },
    { name: "Lent", color: "#7c3aed" },
    { name: "Easter", color: "#fbbf24" },
    { name: "Advent", color: "#4f46e5" },
    { name: "Martyr", color: "#dc2626" },
  ];

  const currentHighlight = verse.highlights?.[0]?.color;
  const isBookmarked = verse.bookmarks?.length > 0;

  // Mock Catechism links for Phase 1
  const getCatechismLink = (book: string, chapter: number, verse: number) => {
    // In a real app, this would be a lookup table in the DB
    return `https://www.vatican.va/archive/ENG0015/_INDEX.HTM`;
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <button className="absolute -left-10 top-1 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100">
          <Check size={14} className={isBookmarked ? "text-indigo-600" : "text-slate-300"} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-3xl shadow-2xl border-indigo-50 overflow-hidden" side="right" align="start">
        <div className="bg-indigo-950 p-4 text-white">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">Verse {verse.number}</span>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-8 w-8 rounded-full hover:bg-indigo-900 ${isBookmarked ? "text-amber-400" : "text-indigo-400"}`}
                onClick={() => toggleBookmark.mutate({ verseId: verse.id })}
              >
                <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 bg-white">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Liturgical Highlight</span>
            <div className="flex gap-2">
              {liturgicalColors.map((lc) => (
                <button
                  key={lc.name}
                  className={`w-8 h-8 rounded-full transition-all hover:scale-110 flex items-center justify-center border-2 ${currentHighlight === lc.color ? 'border-indigo-200' : 'border-transparent'}`}
                  style={{ backgroundColor: lc.color }}
                  onClick={() => setHighlight.mutate({ verseId: verse.id, color: lc.color })}
                >
                  {currentHighlight === lc.color && <Check size={12} className="text-white" />}
                </button>
              ))}
              <button
                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:text-slate-500 transition-colors"
                onClick={() => setHighlight.mutate({ verseId: verse.id, color: null })}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <MessageSquare size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Lectio Reflection</span>
              </div>
            </div>
            <Textarea 
              placeholder="What is the Holy Spirit saying to you?"
              className="min-h-[80px] text-sm rounded-2xl border-slate-100 focus-visible:ring-indigo-500 bg-slate-50/50 italic"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-[10px] uppercase tracking-widest h-10"
              onClick={() => {
                upsertNote.mutate({ verseId: verse.id, content: note });
                setIsPopoverOpen(false);
              }}
            >
              Preserve Reflection
            </Button>
          </div>

          <div className="pt-2 border-t flex flex-col gap-2">
            <Button variant="ghost" className="justify-start gap-3 h-10 rounded-xl px-2 text-slate-500 hover:text-indigo-600" asChild>
              <a href={getCatechismLink(verse.bookName, verse.chapterNumber, verse.number)} target="_blank" rel="noreferrer">
                <Library size={14} className="text-indigo-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-left flex-1">Catechism Cross-Link</span>
                <ExternalLink size={12} className="opacity-30" />
              </a>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
