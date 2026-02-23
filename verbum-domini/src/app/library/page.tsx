"use client";

import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Skeleton } from "~/components/ui/skeleton";
import Link from "next/link";
import { Bookmark, MessageSquare, Highlighter, ChevronRight } from "lucide-react";

export default function LibraryPage() {
  const { data: library, isLoading, error } = api.bible.getUserLibrary.useQuery();

  if (isLoading) {
    return (
      <div className="p-12 max-w-5xl mx-auto space-y-8">
        <Skeleton className="h-12 w-64 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-indigo-950">Library requires sign in</h2>
        <p className="text-slate-500">Sign in with Google to save your bookmarks, notes, and highlights.</p>
      </div>
    );
  }

  return (
    <div className="p-12 max-w-5xl mx-auto space-y-12">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold text-indigo-950 tracking-tighter">My Personal Codex</h1>
        <p className="text-slate-400 font-medium">Your spiritual journey preserved in the Word.</p>
      </header>

      <Tabs defaultValue="bookmarks" className="w-full">
        <TabsList className="mb-8 bg-slate-50 p-1 rounded-xl">
          <TabsTrigger value="bookmarks" className="rounded-lg px-8 flex gap-2">
            <Bookmark size={14} />
            Bookmarks ({library.bookmarks.length})
          </TabsTrigger>
          <TabsTrigger value="notes" className="rounded-lg px-8 flex gap-2">
            <MessageSquare size={14} />
            Notes ({library.notes.length})
          </TabsTrigger>
          <TabsTrigger value="highlights" className="rounded-lg px-8 flex gap-2">
            <Highlighter size={14} />
            Highlights ({library.highlights.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookmarks">
          <div className="grid grid-cols-1 gap-4">
            {library.bookmarks.length === 0 ? (
              <EmptyLibrary type="bookmarks" />
            ) : (
              library.bookmarks.map((b) => (
                <LibraryItem key={b.id} item={b} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <div className="grid grid-cols-1 gap-4">
            {library.notes.length === 0 ? (
              <EmptyLibrary type="notes" />
            ) : (
              library.notes.map((n) => (
                <LibraryItem key={n.id} item={n} showContent />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="highlights">
          <div className="grid grid-cols-1 gap-4">
            {library.highlights.length === 0 ? (
              <EmptyLibrary type="highlights" />
            ) : (
              library.highlights.map((h) => (
                <LibraryItem key={h.id} item={h} isHighlight />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LibraryItem({ item, showContent, isHighlight }: { item: any, showContent?: boolean, isHighlight?: boolean }) {
  const verse = item.verse;
  const book = verse.chapter.book;

  return (
    <Link href={`/bible/${book.abbreviation_case_insensitive}/${verse.chapter.number}`}>
      <Card className="hover:border-indigo-200 transition-all cursor-pointer group">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
                  {book.name} {verse.chapter.number}:{verse.number}
                </span>
                {isHighlight && (
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                )}
              </div>
              <p className="text-sm text-slate-600 line-clamp-2 italic font-serif">
                "{verse.text}"
              </p>
              {showContent && item.content && (
                <div className="mt-4 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-sm text-indigo-900 font-sans">
                  {item.content}
                </div>
              )}
            </div>
            <ChevronRight className="text-slate-200 group-hover:text-indigo-400 transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function EmptyLibrary({ type }: { type: string }) {
  return (
    <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
      <p className="text-slate-400 font-medium italic">Your {type} will appear here.</p>
      <p className="text-xs text-slate-300 mt-2 px-8">
        Interact with any verse in the Bible reader to save it to your library.
      </p>
    </div>
  );
}
