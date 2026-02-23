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
import { ChevronLeft, ChevronRight, Menu, Columns, LayoutList, MessageCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { VerseActions } from "./verse-actions";

interface BibleReaderProps {
  bookAbbr: string;
  chapterNum: number;
}

export function BibleReader({ bookAbbr, chapterNum }: BibleReaderProps) {
  const [translation, setTranslation] = useState("DR");
  const [isParallel, setIsParallel] = useState(false);
  const [parallelTranslation, setParallelTranslation] = useState("NABRE");

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

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-8 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  const prevChapter = chapterNum > 1 ? chapterNum - 1 : null;
  const nextChapter = book && chapterNum < (book._count?.chapters ?? 0) ? chapterNum + 1 : null;

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
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`rounded-full ${isParallel ? "text-indigo-600 bg-indigo-50" : "text-slate-400"}`}
            onClick={() => setIsParallel(!isParallel)}
            title="Toggle Parallel View"
          >
            {isParallel ? <LayoutList size={18} /> : <Columns size={18} />}
          </Button>

          <Select value={translation} onValueChange={setTranslation}>
            <SelectTrigger className="w-[100px] h-8 text-[10px] font-bold uppercase tracking-wider bg-slate-50 border-none rounded-full px-4">
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
              <SelectTrigger className="w-[100px] h-8 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border-none rounded-full px-4">
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
              verses.map((v) => (
                <div key={v.id} className="relative group flex gap-6">
                  <VerseActions verse={v} onUpdate={() => refetch()} />
                  <span className="text-xs font-bold text-indigo-200 select-none pt-2 w-4 text-right shrink-0">
                    {v.number}
                  </span>
                  <div className="flex-1 space-y-3">
                    <p 
                      className="hover:text-indigo-950 transition-colors leading-[1.8] text-indigo-900/90 selection:bg-indigo-100 selection:text-indigo-900 rounded-sm px-1"
                      style={{ 
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
                parallelVerses.map((v) => (
                  <div key={v.id} className="relative group flex gap-6 opacity-60 hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-slate-200 select-none pt-2 w-4 text-right shrink-0">
                      {v.number}
                    </span>
                    <div className="flex-1">
                      <p className="leading-[1.8] text-slate-600">
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
          
          <div className="px-6 text-[10px] font-bold text-indigo-200 uppercase tracking-[0.2em] min-w-[140px] text-center border-x border-indigo-800/50">
            {book?.abbreviation} {chapterNum}
          </div>

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
