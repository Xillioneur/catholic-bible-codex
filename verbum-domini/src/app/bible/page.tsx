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
      <div className="p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">
        <h2 className="text-xl font-bold">Error loading books</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  const oldTestament = books?.filter((b: any) => String(b.testament) === "OLD") ?? [];
  const newTestament = books?.filter((b: any) => String(b.testament) === "NEW") ?? [];

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-indigo-900">Holy Bible</h1>
        <p className="text-slate-600">Explore the full 73-book Catholic canon. ({books?.length ?? 0} books)</p>
      </header>

      {(!books || books.length === 0) ? (
        <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed">
          <p className="text-slate-500 italic">No books found in the database.</p>
          <p className="text-sm text-slate-400 mt-2">
            (Did you run npx prisma db seed?)
          </p>
        </div>
      ) : (
        <>
          {oldTestament.length === 0 && newTestament.length === 0 && (
            <div className="p-4 bg-amber-50 text-amber-800 rounded-lg mb-4">
              Warning: Books loaded ({books.length}) but none matched "OLD" or "NEW" testament filters.
              Raw testament value of first book: "{books[0]?.testament}"
            </div>
          )}
          <Tabs defaultValue="old" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="old">Old Testament ({oldTestament.length})</TabsTrigger>
              <TabsTrigger value="new">New Testament ({newTestament.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="old">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {oldTestament.map((book: any) => (
                  <Link key={book.id} href={`/bible/${book.abbreviation_case_insensitive}/1`}>
                    <Card className="hover:bg-indigo-50 transition-colors cursor-pointer border-indigo-100">
                      <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center">
                        <span className="text-sm font-semibold text-indigo-700">{book.abbreviation}</span>
                        <span className="text-sm font-medium">{book.name}</span>
                        {book.isDeuterocanonical && (
                          <span className="text-[10px] uppercase tracking-wider text-amber-600 font-bold mt-1">
                            Deuterocanon
                          </span>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="new">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {newTestament.map((book: any) => (
                  <Link key={book.id} href={`/bible/${book.abbreviation_case_insensitive}/1`}>
                    <Card className="hover:bg-indigo-50 transition-colors cursor-pointer border-indigo-100">
                      <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center">
                        <span className="text-sm font-semibold text-indigo-700">{book.abbreviation}</span>
                        <span className="text-sm font-medium">{book.name}</span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
