"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export function useLastRead() {
  const params = useParams();
  const { data: session } = useSession();
  const [lastRead, setLastRead] = useState<{ book: string; chapter: string } | null>(null);

  const updatePref = api.bible.updateUserPreferences.useMutation();
  const { data: serverPref } = api.bible.getUserPreferences.useQuery(undefined, {
    enabled: !!session?.user,
  });

  // Load the manually saved state
  useEffect(() => {
    if (session?.user && serverPref?.lastBook) {
      setLastRead({
        book: serverPref.lastBook,
        chapter: String(serverPref.lastChapter),
      });
    } else {
      const saved = localStorage.getItem("vd_manual_progress");
      if (saved) {
        setLastRead(JSON.parse(saved));
      }
    }
  }, [session, serverPref]);

  const saveProgress = useCallback((book: string, chapter: string) => {
    const state = { book, chapter };
    
    // 1. Save to local storage
    localStorage.setItem("vd_manual_progress", JSON.stringify(state));
    localStorage.setItem("vd_last_read", JSON.stringify(state)); // For the entry redirect
    setLastRead(state);

    // 2. Save to cloud if logged in
    if (session?.user) {
      updatePref.mutate({
        lastBook: book,
        lastChapter: parseInt(chapter),
      });
    }
    
    toast.success(`Progress saved: ${book.toUpperCase()} ${chapter}`);
  }, [session, updatePref]);

  return { lastRead, saveProgress };
}
