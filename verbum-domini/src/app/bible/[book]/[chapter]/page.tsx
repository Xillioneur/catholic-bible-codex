"use client";

import { use } from "react";
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
import { ChevronLeft, ChevronRight, HandHelping } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ReaderPage({
  params: paramsPromise,
}: {
  params: Promise<{ book: string; chapter: string }>;
}) {
  const params = use(paramsPromise);
  const [translation, setTranslation] = useState("DR");

  const chapterNum = parseInt(params.chapter);

  const { data: bookData } = api.bible.getBookByAbbreviation.useQuery({
    abbreviation: params.book,
  });
  const book = bookData as any;

  const { data: verses, isLoading } = api.bible.getChapterVerses.useQuery({
    bookAbbreviation: params.book,
    chapterNumber: chapterNum,
    translationAbbreviation: translation,
  });

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
  const nextChapter = book && chapterNum < book._count.chapters ? chapterNum + 1 : null;

  return (
    <div className="max-w-3xl mx-auto p-8 pb-32">
      <header className="mb-12 flex items-end justify-between border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold text-indigo-900 capitalize">
            {book?.name ?? params.book} {params.chapter}
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Catholic Bible Codex</p>
        </div>

        <Select value={translation} onValueChange={setTranslation}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Translation" />
          </SelectTrigger>
          <SelectContent>
            {translations?.map((t) => (
              <SelectItem key={t.id} value={t.abbreviation}>
                {t.abbreviation}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </header>

      <article className="bible-text space-y-8 min-h-[50vh]">
        {verses && verses.length > 0 ? (
          verses.map((v) => (
            <div key={v.id} className="relative group flex gap-4">
              <span className="text-sm font-bold text-indigo-300 select-none pt-1.5 w-6 text-right shrink-0">
                {v.number}
              </span>
              <div className="flex-1 space-y-2">
                <p className="hover:text-indigo-900 transition-colors leading-relaxed">
                  {v.text}
                </p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] uppercase font-bold text-slate-400 hover:text-indigo-600">
                    <HandHelping className="mr-1 h-3 w-3" />
                    Pray
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] uppercase font-bold text-slate-400 hover:text-indigo-600">
                    Note
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-100">
            <p className="text-slate-500 font-medium">
              The {translation} translation is not yet available for this chapter.
            </p>
            <p className="text-sm text-slate-400 mt-2">
              Switch to <strong>DR</strong> (Douay-Rheims) to read the full text.
            </p>
          </div>
        )}
      </article>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border shadow-2xl rounded-full p-1 flex items-center gap-1 z-50">
        {prevChapter ? (
          <Button variant="ghost" className="rounded-full h-12 w-12 p-0" asChild>
            <Link href={`/bible/${params.book}/${prevChapter}`}>
              <ChevronLeft className="h-6 w-6" />
            </Link>
          </Button>
        ) : (
          <div className="w-12" />
        )}
        
        <div className="px-6 border-x font-bold text-indigo-900 min-w-[120px] text-center">
          {book?.abbreviation} {params.chapter}
        </div>

        {nextChapter ? (
          <Button variant="ghost" className="rounded-full h-12 w-12 p-0" asChild>
            <Link href={`/bible/${params.book}/${nextChapter}`}>
              <ChevronRight className="h-6 w-6" />
            </Link>
          </Button>
        ) : (
          <div className="w-12" />
        )}
      </nav>

      <footer className="mt-20 pt-12 border-t text-center text-slate-300 text-sm italic">
        "Ignorance of Scripture is ignorance of Christ." — St. Jerome
      </footer>
    </div>
  );
}
