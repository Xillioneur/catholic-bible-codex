"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "~/lib/db";
import { api } from "~/trpc/react";

export function useStudyTools(verseId?: string) {
  const bookmarks = useLiveQuery(() => db.bookmarks.toArray());
  const highlights = useLiveQuery(() => db.highlights.toArray());

  const isBookmarked = useMemo(() => 
    verseId ? bookmarks?.some(b => b.verseId === verseId) : false,
    [bookmarks, verseId]
  );

  const highlight = useMemo(() => 
    verseId ? highlights?.find(h => h.verseId === verseId) : null,
    [highlights, verseId]
  );

  const toggleBookmark = async (vId: string) => {
    const existing = await db.bookmarks.where("verseId").equals(vId).first();
    if (existing) {
      await db.bookmarks.delete(existing.id!);
    } else {
      await db.bookmarks.add({ verseId: vId, createdAt: Date.now() });
    }
  };

  const setHighlight = async (vId: string, color: string) => {
    const existing = await db.highlights.where("verseId").equals(vId).first();
    if (existing) {
      if (existing.color === color) {
        await db.highlights.delete(existing.id!);
      } else {
        await db.highlights.update(existing.id!, { color });
      }
    } else {
      await db.highlights.add({ verseId: vId, color, createdAt: Date.now() });
    }
  };

  return {
    bookmarks,
    highlights,
    isBookmarked,
    highlight,
    toggleBookmark,
    setHighlight
  };
}

import { useMemo } from "react";
