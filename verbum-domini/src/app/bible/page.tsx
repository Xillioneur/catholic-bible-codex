"use client";

import { api } from "~/trpc/react";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Skeleton } from "~/components/ui/skeleton";
import Link from "next/link";

export default function BiblePage() {
  const { data: books, isLoading, error } = api.bible.getBooks.useQuery();

  if (isLoading) {
    return (
      <div className="p-12 max-w-5xl mx-auto space-y-8">
        <Skeleton className="h-12 w-64 rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-red-500">
        <h2 className="text-xl font-bold">Error loading library</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  const oldTestament = books?.filter((b: any) => String(b.testament) === "OLD") ?? [];
  const newTestament = books?.filter((b: any) => String(b.testament) === "NEW") ?? [];

  return (
    <div className="p-12 max-w-5xl mx-auto space-y-12">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold text-indigo-950 tracking-tighter">Canonical Library</h1>
        <p className="text-slate-400 font-medium">The complete 73-book Catholic Bible canon.</p>
      </header>

      <Tabs defaultValue="old" className="w-full">
        <TabsList className="mb-8 bg-slate-50 p-1 rounded-xl">
          <TabsTrigger value="old" className="rounded-lg px-12">Old Testament</TabsTrigger>
          <TabsTrigger value="new" className="rounded-lg px-12">New Testament</TabsTrigger>
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
    </div>
  );
}
