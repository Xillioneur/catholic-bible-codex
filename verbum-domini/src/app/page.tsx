import Link from "next/link";
import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { getLiturgicalDay, getDailyReadings } from "~/lib/liturgy";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { BookOpen, Calendar as CalendarIcon } from "lucide-react";

export default async function Home() {
  const session = await auth();
  const today = new Date();
  const liturgicalDay = await getLiturgicalDay(today);
  const readings = getDailyReadings(today);

  const colorClasses: Record<string, string> = {
    ordinary: "border-liturgical-ordinary text-liturgical-ordinary",
    lent: "border-liturgical-lent text-liturgical-lent",
    easter: "border-liturgical-easter text-liturgical-easter",
    advent: "border-liturgical-advent text-liturgical-advent",
    martyr: "border-liturgical-martyr text-liturgical-martyr",
  };

  const bgClasses: Record<string, string> = {
    ordinary: "bg-liturgical-ordinary/10",
    lent: "bg-liturgical-lent/10",
    easter: "bg-liturgical-easter/10",
    advent: "bg-liturgical-advent/10",
    martyr: "bg-liturgical-martyr/10",
  };

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center bg-slate-50 text-slate-900 pb-20">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <header className="text-center">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              Verbum <span className="text-indigo-700">Domini</span>
            </h1>
            <p className="text-lg text-slate-500 mt-2 font-medium">Catholic Bible Codex</p>
          </header>

          {/* Daily Sanctuary Card */}
          <Card className={`w-full max-w-2xl border-t-8 ${colorClasses[liturgicalDay.color]} shadow-lg overflow-hidden`}>
            <CardHeader className={`${bgClasses[liturgicalDay.color]} pb-8`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-70">
                    <CalendarIcon size={14} />
                    {liturgicalDay.season}
                  </div>
                  <CardTitle className="text-2xl mt-1">{liturgicalDay.name}</CardTitle>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${colorClasses[liturgicalDay.color]}`}>
                  {liturgicalDay.rank}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase">First Reading</span>
                  <p className="font-semibold text-indigo-900">{readings.firstReading.reference}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase">Psalm</span>
                  <p className="font-semibold text-indigo-900">{readings.psalm.reference}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase">Gospel</span>
                  <p className="font-semibold text-indigo-900">{readings.gospel.reference}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border italic text-slate-600 font-serif">
                "{readings.gospel.text}"
              </div>

              <div className="flex gap-4 pt-2">
                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" asChild>
                  <Link href="/bible/mt/25">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Read Gospel
                  </Link>
                </Button>
                <Button variant="outline" className="flex-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                  Pray Now
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 w-full max-w-2xl">
            <Link
              className="flex flex-col gap-4 rounded-xl bg-white p-6 border shadow-sm hover:shadow-md transition-all group"
              href="/bible"
            >
              <h3 className="text-2xl font-bold text-indigo-900 group-hover:text-indigo-600">Full Bible →</h3>
              <div className="text-lg text-slate-600">
                The 73-book Catholic canon with cross-references.
              </div>
            </Link>
            <Link
              className="flex flex-col gap-4 rounded-xl bg-white p-6 border shadow-sm hover:shadow-md transition-all group"
              href="/library"
            >
              <h3 className="text-2xl font-bold text-indigo-900 group-hover:text-indigo-600">My Library →</h3>
              <div className="text-lg text-slate-600">
                Your bookmarks, notes, and prayer journal.
              </div>
            </Link>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-slate-600">
                {session && <span>Lumen Christi, {session.user?.name}</span>}
              </p>
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className="rounded-full bg-slate-200 px-10 py-3 font-semibold text-slate-900 no-underline transition hover:bg-slate-300"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
