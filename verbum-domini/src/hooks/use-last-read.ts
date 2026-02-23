"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";

export function useLastRead() {
  const params = useParams();
  const { data: session } = useSession();
  const [lastRead, setLastRead] = useState<{ book: string; chapter: string } | null>(null);

  const updatePref = api.bible.updateUserPreferences.useMutation();
  const { data: serverPref } = api.bible.getUserPreferences.useQuery(undefined, {
    enabled: !!session?.user,
  });

  useEffect(() => {
    // 1. If we are on a Bible page, save it
    if (params.book && params.chapter) {
      const state = { book: params.book as string, chapter: params.chapter as string };
      
      // Always save to localStorage for instant local access
      localStorage.setItem("vd_last_read", JSON.stringify(state));
      setLastRead(state);

      // If logged in, sync to server
      if (session?.user) {
        updatePref.mutate({
          lastBook: state.book,
          lastChapter: parseInt(state.chapter),
        });
      }
    } else {
      // 2. Otherwise, try to load it
      // Prefer server state if available, fallback to local
      if (session?.user && serverPref?.lastBook) {
        setLastRead({
          book: serverPref.lastBook,
          chapter: String(serverPref.lastChapter),
        });
      } else {
        const saved = localStorage.getItem("vd_last_read");
        if (saved) {
          setLastRead(JSON.parse(saved));
        }
      }
    }
  }, [params.book, params.chapter, session, serverPref]);

  return lastRead;
}
