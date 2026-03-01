"use client";

import { useMemo, useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "~/lib/db";

export function useStudyTools(verseId?: string) {
  const bookmarks = useLiveQuery(() => db.bookmarks.toArray());
  const highlights = useLiveQuery(() => db.highlights.toArray());
  const notes = useLiveQuery(() => db.notes.toArray());

  const isBookmarked = useMemo(() => 
    verseId ? bookmarks?.some(b => b.verseId === verseId) : false,
    [bookmarks, verseId]
  );

  const highlight = useMemo(() => 
    verseId ? highlights?.find(h => h.verseId === verseId) : null,
    [highlights, verseId]
  );

  const note = useMemo(() => 
    verseId ? notes?.find(n => n.verseId === verseId) : null,
    [notes, verseId]
  );

  const toggleBookmark = useCallback(async (vId: string) => {
    const existing = await db.bookmarks.where("verseId").equals(vId).first();
    if (existing) {
      await db.bookmarks.delete(existing.id!);
    } else {
      await db.bookmarks.add({ verseId: vId, createdAt: Date.now() });
    }
  }, []);

  const setHighlight = useCallback(async (vId: string, color: string) => {
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
  }, []);

  const saveNote = useCallback(async (vId: string, content: string) => {
    const existing = await db.notes.where("verseId").equals(vId).first();
    if (existing) {
      if (!content.trim()) {
        await db.notes.delete(existing.id!);
      } else {
        await db.notes.update(existing.id!, { content, updatedAt: Date.now() });
      }
    } else if (content.trim()) {
      await db.notes.add({ 
        verseId: vId, 
        content, 
        createdAt: Date.now(), 
        updatedAt: Date.now() 
      });
    }
  }, []);

  return {
    bookmarks,
    highlights,
    notes,
    isBookmarked,
    highlight,
    note,
    toggleBookmark,
    setHighlight,
    saveNote
  };
}
