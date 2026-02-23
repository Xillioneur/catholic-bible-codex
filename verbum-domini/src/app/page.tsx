"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { getDailyReadings } from "~/lib/liturgy";
import { Card, CardContent } from "~/components/ui/card";
import { Calendar as CalendarIcon, ChevronRight, Loader2 } from "lucide-react";
import { useLastRead } from "~/hooks/use-last-read";
import { useEffect, useState } from "react";
import type { LiturgicalDay } from "~/lib/liturgy";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Skeleton } from "~/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function Home() {
  const lastRead = useLastRead();
  const router = useRouter();
  const today = new Date();
  const { data: books, isLoading: booksLoading } = api.bible.getBooks.useQuery();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const [liturgicalDay, setLiturgicalDay] = useState<LiturgicalDay>({
    date: today.toISOString(),
    name: "Loading sanctuary...",
    color: "ordinary",
    season: "Ordinary Time",
    rank: "Feria"
  });

  useEffect(() => {
    // 1. Load liturgical data
    import("~/lib/liturgy").then(m => m.getLiturgicalDay(today).then(setLiturgicalDay));

    // 2. Auto-resume logic
    const saved = localStorage.getItem("vd_last_read");
    if (saved) {
      const state = JSON.parse(saved);
      if (state.book && state.chapter) {
        setIsRedirecting(true);
        router.push(`/bible/${state.book}/${state.chapter}`);
      }
    }
  }, [router]);

  const readings = getDailyReadings(today);

  const colorClasses: Record<string, string> = {
    ordinary: "bg-liturgical-ordinary text-white",
    lent: "bg-liturgical-lent text-white",
    easter: "bg-liturgical-easter text-indigo-900",
    advent: "bg-liturgical-advent text-white",
    martyr: "bg-liturgical-martyr text-white",
  };

  const oldTestament = books?.filter((b: any) => String(b.testament) === "OLD") ?? [];
  const newTestament = books?.filter((b: any) => String(b.testament) === "NEW") ?? [];

  if (isRedirecting) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white space-y-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} strokeWidth={1} />
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-950 animate-pulse">
          Resuming the Word...
        </p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Minimal Liturgical Banner */}
      <div className={`w-full py-2 px-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] ${colorClasses[liturgicalDay.color] || colorClasses.ordinary} transition-colors duration-1000`}>
        <div className="flex items-center gap-2">
          <CalendarIcon size={10} />
          {liturgicalDay.name} — {liturgicalDay.season}
        </div>
        <div className="opacity-80">
          {readings.gospel.reference}
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Focus Header */}
        <header className="space-y-2">
          <h1 className="text-4xl font-bold text-indigo-950 tracking-tighter">
            Verbum Domini
          </h1>
          <p className="text-slate-400 font-medium">The Holy Catholic Bible Codex</p>
        </header>

        {/* Bible Browser - Integrated directly */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="text-xl font-bold text-indigo-950">Canonical Library</h3>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              73 Inspired Books
            </div>
          </div>

          {booksLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <Tabs defaultValue="old" className="w-full">
              <TabsList className="mb-8 bg-slate-50 p-1 rounded-xl">
                <TabsTrigger value="old" className="rounded-lg px-8">Old Testament</TabsTrigger>
                <TabsTrigger value="new" className="rounded-lg px-8">New Testament</TabsTrigger>
              </TabsList>
              
              <TabsContent value="old" className="focus-visible:outline-none">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {oldTestament.map((book: any) => (
                    <Link key={book.id} href={`/bible/${book.abbreviation_case_insensitive}/1`}>
                      <Card className="group hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer border-slate-100 rounded-2xl">
                        <CardContent className="p-4 flex flex-col items-center justify-center h-24 text-center">
                          <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest">{book.abbreviation}</span>
                          <span className="text-sm font-bold text-indigo-950 mt-1">{book.name}</span>
                          {book.isDeuterocanonical && (
                            <div className="w-1 h-1 rounded-full bg-amber-400 mt-2" />
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="new" className="focus-visible:outline-none">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {newTestament.map((book: any) => (
                    <Link key={book.id} href={`/bible/${book.abbreviation_case_insensitive}/1`}>
                      <Card className="group hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer border-slate-100 rounded-2xl">
                        <CardContent className="p-4 flex flex-col items-center justify-center h-24 text-center">
                          <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest">{book.abbreviation}</span>
                          <span className="text-sm font-bold text-indigo-950 mt-1">{book.name}</span>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </section>

        {/* Minimal Footer */}
        <footer className="pt-12 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          <div>Verbum Domini Codex</div>
          <div className="italic font-serif normal-case tracking-normal text-sm">"In the beginning was the Word."</div>
          <div>AD MMXXVI</div>
        </footer>
      </div>
    </main>
  );
}
