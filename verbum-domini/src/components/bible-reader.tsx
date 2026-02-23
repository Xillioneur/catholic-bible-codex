"use client";

import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { ChevronLeft, ChevronRight, Menu, Columns, LayoutList, MessageCircle, Settings2, Sliders, Hash, Bookmark, Play, Pause, Square } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { VerseActions } from "./verse-actions";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Slider } from "~/components/ui/slider";
import { useSession } from "next-auth/react";
import { ScrollArea } from "./ui/scroll-area";
import { useLastRead } from "~/hooks/use-last-read";
import { toast } from "sonner";

interface BibleReaderProps {
  bookAbbr: string;
  chapterNum: number;
}

export function BibleReader({ bookAbbr, chapterNum }: BibleReaderProps) {
  const { data: session } = useSession();
  const [translation, setTranslation] = useState("DR");
  const [isParallel, setIsParallel] = useState(false);
  const [parallelTranslation, setParallelTranslation] = useState("NABRE");
  const [isChapterPickerOpen, setIsChapterPickerOpen] = useState(false);
  
  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const { lastRead, saveProgress } = useLastRead();
  
  // Premium Preferences
  const { data: prefs } = api.bible.getUserPreferences.useQuery(undefined, {
    enabled: !!session?.user,
  });
  const updatePref = api.bible.updateUserPreferences.useMutation();

  const [readingSpeed, setReadingSpeed] = useState(1.0);
  const [fontSize, setFontSize] = useState(18);

  useEffect(() => {
    if (prefs) {
      setReadingSpeed(prefs.readingSpeed);
      setFontSize(prefs.fontSize);
    }
  }, [prefs]);

  const { data: bookData } = api.bible.getBookByAbbreviation.useQuery({
    abbreviation: bookAbbr,
  });
  const book = bookData as any;

  const { data: verses, isLoading, refetch } = api.bible.getChapterVerses.useQuery({
    bookAbbreviation: bookAbbr,
    chapterNumber: chapterNum,
    translationAbbreviation: translation,
  });

  const { data: parallelVerses, isLoading: isParallelLoading } = api.bible.getChapterVerses.useQuery(
    {
      bookAbbreviation: bookAbbr,
      chapterNumber: chapterNum,
      translationAbbreviation: parallelTranslation,
    },
    { enabled: isParallel }
  );

  const { data: translations } = api.bible.getTranslations.useQuery();

  // Audio Logic
  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentVerseIndex(null);
  };

  const playAudio = () => {
    if (!verses || verses.length === 0) return;
    
    stopAudio();
    setIsPlaying(true);
    
    let index = 0;
    
    const speakNext = () => {
      if (!verses[index]) {
        stopAudio();
        return;
      }

      setCurrentVerseIndex(index);
      const utterance = new SpeechSynthesisUtterance(verses[index].text);
      utterance.rate = readingSpeed;
      utterance.pitch = 0.9; // Slightly lower for reverent tone
      
      utterance.onend = () => {
        index++;
        if (isPlaying) speakNext();
      };

      utterance.onerror = () => stopAudio();
      
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => stopAudio();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-8 space-y-4">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  const prevChapter = chapterNum > 1 ? chapterNum - 1 : null;
  const nextChapter = book && chapterNum < (book._count?.chapters ?? 0) ? chapterNum + 1 : null;

  const isCurrentProgress = lastRead?.book === bookAbbr && parseInt(lastRead?.chapter) === chapterNum;

  return (
    <div className="relative min-h-screen bg-white">
      {/* Floating Header */}
      <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu size={20} />
            </Button>
          </SidebarTrigger>
          <div className="h-4 w-px bg-slate-200" />
          <h1 className="text-sm font-bold text-indigo-950 uppercase tracking-widest">
            {book?.name ?? bookAbbr} <span className="text-indigo-400 ml-1">{chapterNum}</span>
          </h1>
          <div className="h-4 w-px bg-slate-200" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:inline">Catholic Bible Codex</span>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={`ml-2 h-7 px-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${isCurrentProgress ? "bg-amber-100 text-amber-700 pointer-events-none" : "text-slate-400 hover:bg-amber-50 hover:text-amber-600"}`}
            onClick={() => saveProgress(bookAbbr, String(chapterNum))}
          >
            <Bookmark size={12} className={`mr-1 ${isCurrentProgress ? "fill-current" : ""}`} />
            {isCurrentProgress ? "Progress Saved" : "Save Progress"}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Control */}
          <Button 
            variant="ghost" 
            size="icon" 
            className={`rounded-full ${isPlaying ? "text-indigo-600 bg-indigo-50 animate-pulse" : "text-slate-400"}`}
            onClick={isPlaying ? stopAudio : playAudio}
            title={isPlaying ? "Stop Audio" : "Listen to Word"}
          >
            {isPlaying ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </Button>

          {/* Reader Settings */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-slate-400 border-none shadow-none hover:bg-slate-50">
                <Settings2 size={18} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-6 rounded-3xl shadow-2xl border-indigo-50" align="end">
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Sliders size={14} className="text-indigo-600" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-950">Reader Settings</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">Font Size</span>
                    <span className="text-xs font-bold text-indigo-600">{fontSize}px</span>
                  </div>
                  <Slider 
                    value={[fontSize]} 
                    min={14} max={32} step={1}
                    onValueChange={(v) => {
                      const val = v[0] ?? 18;
                      setFontSize(val);
                      if (session?.user) updatePref.mutate({ fontSize: val });
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">Audio Speed</span>
                    <span className="text-xs font-bold text-indigo-600">{readingSpeed}x</span>
                  </div>
                  <Slider 
                    value={[readingSpeed]} 
                    min={0.5} max={2.0} step={0.1}
                    onValueChange={(v) => {
                      const val = v[0] ?? 1.0;
                      setReadingSpeed(val);
                      if (session?.user) updatePref.mutate({ readingSpeed: val });
                    }}
                  />
                </div>

                {!session?.user && (
                  <div className="pt-4 border-t">
                    <p className="text-[10px] text-slate-400 italic text-center">
                      Sign in to sync these settings across devices.
                    </p>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Button 
            variant="ghost" 
            size="icon" 
            className={`rounded-full border-none shadow-none hover:bg-slate-50 ${isParallel ? "text-indigo-600 bg-indigo-50" : "text-slate-400"}`}
            onClick={() => setIsParallel(!isParallel)}
            title="Toggle Parallel View"
          >
            {isParallel ? <LayoutList size={18} /> : <Columns size={18} />}
          </Button>

          <Select value={translation} onValueChange={setTranslation}>
            <SelectTrigger className="w-[100px] h-8 text-[10px] font-bold uppercase tracking-wider bg-slate-50 border-none rounded-full px-4 shadow-none">
              <SelectValue placeholder="DR" />
            </SelectTrigger>
            <SelectContent>
              {translations?.map((t) => (
                <SelectItem key={t.id} value={t.abbreviation} className="text-xs">
                  {t.abbreviation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isParallel && (
            <Select value={parallelTranslation} onValueChange={setParallelTranslation}>
              <SelectTrigger className="w-[100px] h-8 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border-none rounded-full px-4 shadow-none">
                <SelectValue placeholder="NABRE" />
              </SelectTrigger>
              <SelectContent>
                {translations?.map((t) => (
                  <SelectItem key={t.id} value={t.abbreviation} className="text-xs">
                    {t.abbreviation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </header>

      <div className={`mx-auto p-8 pb-32 transition-all duration-500 ${isParallel ? "max-w-7xl" : "max-w-3xl"}`}>
        <div className={`grid gap-12 ${isParallel ? "grid-cols-2" : "grid-cols-1"}`}>
          {/* Primary Translation */}
          <article className="bible-text space-y-8 min-h-[50vh]">
            {verses && verses.length > 0 ? (
              verses.map((v, idx) => (
                <div key={v.id} className={`relative group flex gap-6 rounded-2xl transition-all duration-500 ${currentVerseIndex === idx ? 'bg-indigo-50/50 shadow-inner scale-[1.02] p-4 -mx-4' : ''}`}>
                  <VerseActions verse={v} onUpdate={() => refetch()} />
                  <span className={`text-xs font-bold select-none pt-2 w-4 text-right shrink-0 transition-colors ${currentVerseIndex === idx ? 'text-indigo-600' : 'text-indigo-200'}`}>
                    {v.number}
                  </span>
                  <div className="flex-1 space-y-3">
                    <p 
                      className={`transition-all duration-500 leading-[1.8] selection:bg-indigo-100 selection:text-indigo-900 rounded-sm px-1 ${currentVerseIndex === idx ? 'text-indigo-950 font-medium' : 'text-indigo-900/90 hover:text-indigo-950'}`}
                      style={{ 
                        fontSize: `${fontSize}px`,
                        backgroundColor: v.highlights?.[0]?.color ? `${v.highlights[0].color}20` : 'transparent',
                        borderLeft: v.highlights?.[0]?.color ? `3px solid ${v.highlights[0].color}` : 'none',
                        paddingLeft: v.highlights?.[0]?.color ? '8px' : '4px'
                      }}
                    >
                      {v.text}
                    </p>
                    {v.notes?.[0] && (
                      <div className="flex items-start gap-2 p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-xs text-amber-900 italic font-sans">
                        <MessageCircle size={12} className="mt-0.5 shrink-0 text-amber-400" />
                        <p>{v.notes[0].content}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <NoContent translation={translation} />
            )}
          </article>

          {/* Parallel Translation */}
          {isParallel && (
            <article className="bible-text space-y-8 min-h-[50vh] border-l pl-12 border-slate-100">
              <div className="mb-8 text-[10px] font-bold uppercase tracking-widest text-indigo-400/50">
                Parallel: {parallelTranslation}
              </div>
              {isParallelLoading ? (
                Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)
              ) : parallelVerses && parallelVerses.length > 0 ? (
                parallelVerses.map((v, idx) => (
                  <div key={v.id} className={`relative group flex gap-6 transition-all duration-500 ${currentVerseIndex === idx ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
                    <span className="text-xs font-bold text-slate-200 select-none pt-2 w-4 text-right shrink-0">
                      {v.number}
                    </span>
                    <div className="flex-1">
                      <p className={`leading-[1.8] transition-all ${currentVerseIndex === idx ? 'text-indigo-950 font-medium' : 'text-slate-600'}`} style={{ fontSize: `${fontSize}px` }}>
                        {v.text}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <NoContent translation={parallelTranslation} />
              )}
            </article>
          )}
        </div>

        {/* Floating Navigation Bar */}
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-indigo-950/90 backdrop-blur-xl border border-indigo-800 shadow-2xl rounded-full p-1.5 flex items-center gap-1 z-50 transition-all hover:bg-indigo-950">
          {prevChapter ? (
            <Button variant="ghost" className="rounded-full h-10 w-10 p-0 text-indigo-300 hover:text-white hover:bg-indigo-800" asChild>
              <Link href={`/bible/${bookAbbr}/${prevChapter}`}>
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <div className="w-10" />
          )}
          
          <Popover open={isChapterPickerOpen} onOpenChange={setIsChapterPickerOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="px-6 text-[10px] h-10 font-bold text-indigo-200 uppercase tracking-[0.2em] min-w-[140px] text-center border-x border-indigo-800/50 rounded-none hover:bg-indigo-900 hover:text-white transition-colors group"
              >
                {book?.abbreviation} {chapterNum}
                <ChevronRight size={12} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity rotate-90" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 rounded-[2rem] shadow-2xl border-indigo-900 bg-indigo-950 overflow-hidden" side="top" sideOffset={20}>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-indigo-900 pb-4">
                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-indigo-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Go to Chapter</span>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-500 uppercase">{book?.name}</span>
                </div>
                
                <ScrollArea className="h-[300px] pr-4">
                  <div className="grid grid-cols-5 gap-2">
                    {book && Array.from({ length: book._count?.chapters ?? 0 }).map((_, i) => {
                      const ch = i + 1;
                      const isActive = ch === chapterNum;
                      return (
                        <Button
                          key={ch}
                          variant="ghost"
                          className={`h-10 w-10 rounded-xl font-bold text-xs ${isActive ? "bg-indigo-600 text-white" : "text-indigo-300 hover:bg-indigo-900 hover:text-white"}`}
                          asChild
                          onClick={() => setIsChapterPickerOpen(false)}
                        >
                          <Link href={`/bible/${bookAbbr}/${ch}`}>
                            {ch}
                          </Link>
                        </Button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </PopoverContent>
          </Popover>

          {nextChapter ? (
            <Button variant="ghost" className="rounded-full h-10 w-10 p-0 text-indigo-300 hover:text-white hover:bg-indigo-800" asChild>
              <Link href={`/bible/${bookAbbr}/${nextChapter}`}>
                <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <div className="w-10" />
          )}
        </nav>

        <footer className="mt-32 pt-12 border-t flex flex-col items-center gap-4 text-center">
          <p className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em]">
            "Ignorance of Scripture is ignorance of Christ."
          </p>
          <div className="h-8 w-[1px] bg-slate-100" />
          <p className="text-slate-200 text-xs italic font-serif">
            St. Jerome, Priest and Doctor of the Church
          </p>
        </footer>
      </div>
    </div>
  );
}

function NoContent({ translation }: { translation: string }) {
  return (
    <div className="text-center py-32 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
      <p className="text-slate-400 font-medium italic">
        The {translation} text is still being prepared.
      </p>
      <p className="text-xs text-slate-300 mt-2 px-8">
        We are prioritizing public domain texts. Switch to <strong>DR</strong> for the full 73-book canon.
      </p>
    </div>
  );
}
