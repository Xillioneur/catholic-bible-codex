"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export function useLastRead() {
  const params = useParams();
  const [lastRead, setLastRead] = useState<{ book: string; chapter: string } | null>(null);

  useEffect(() => {
    // If we are currently on a bible page, save it as last read
    if (params.book && params.chapter) {
      const state = { book: params.book as string, chapter: params.chapter as string };
      localStorage.setItem("vd_last_read", JSON.stringify(state));
      setLastRead(state);
    } else {
      // Otherwise, load the last read state
      const saved = localStorage.getItem("vd_last_read");
      if (saved) {
        setLastRead(JSON.parse(saved));
      }
    }
  }, [params.book, params.chapter]);

  return lastRead;
}
