import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";

export const bibleRouter = createTRPCRouter({
  getBooks: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.book.findMany({
      orderBy: { order: "asc" },
    });
  }),

  getBookByAbbreviation: publicProcedure
    .input(z.object({ abbreviation: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.book.findUnique({
        where: { abbreviation_case_insensitive: input.abbreviation.toLowerCase() },
        include: {
          _count: {
            select: { chapters: true }
          }
        }
      });
    }),

  getChapterVerses: publicProcedure
    .input(z.object({ 
      bookAbbreviation: z.string(), 
      chapterNumber: z.number(), 
      translationAbbreviation: z.string() 
    }))
    .query(async ({ ctx, input }) => {
      const translation = await ctx.db.translation.findUnique({
        where: { abbreviation: input.translationAbbreviation }
      });
      
      const book = await ctx.db.book.findUnique({
        where: { abbreviation_case_insensitive: input.bookAbbreviation.toLowerCase() }
      });

      if (!translation || !book) return null;

      const chapter = await ctx.db.chapter.findUnique({
        where: {
          bookId_number: {
            bookId: book.id,
            number: input.chapterNumber
          }
        }
      });

      if (!chapter) return null;

      const verses = await ctx.db.verse.findMany({
        where: {
          chapterId: chapter.id,
          translationId: translation.id,
        },
        orderBy: { number: "asc" },
        include: {
          bookmarks: ctx.session?.user ? { where: { userId: ctx.session.user.id } } : false,
          highlights: ctx.session?.user ? { where: { userId: ctx.session.user.id } } : false,
          notes: ctx.session?.user ? { where: { userId: ctx.session.user.id } } : false,
        }
      });

      return verses;
    }),

  getTranslations: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.translation.findMany();
  }),

  getUserLibrary: protectedProcedure.query(async ({ ctx }) => {
    const bookmarks = await ctx.db.bookmark.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        verse: {
          include: {
            chapter: { include: { book: true } }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const notes = await ctx.db.note.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        verse: {
          include: {
            chapter: { include: { book: true } }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const highlights = await ctx.db.highlight.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        verse: {
          include: {
            chapter: { include: { book: true } }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return { bookmarks, notes, highlights };
  }),

  // User Actions
  toggleBookmark: protectedProcedure
    .input(z.object({ verseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.bookmark.findUnique({
        where: {
          userId_verseId: {
            userId: ctx.session.user.id,
            verseId: input.verseId,
          },
        },
      });

      if (existing) {
        await ctx.db.bookmark.delete({ where: { id: existing.id } });
        return { bookmarked: false };
      }

      await ctx.db.bookmark.create({
        data: {
          verseId: input.verseId,
          userId: ctx.session.user.id,
        },
      });
      return { bookmarked: true };
    }),

  setHighlight: protectedProcedure
    .input(z.object({ verseId: z.string(), color: z.string().nullable() }))
    .mutation(async ({ ctx, input }) => {
      if (!input.color) {
        await ctx.db.highlight.deleteMany({
          where: { userId: ctx.session.user.id, verseId: input.verseId }
        });
        return { highlighted: false };
      }

      await ctx.db.highlight.upsert({
        where: {
          userId_verseId: {
            userId: ctx.session.user.id,
            verseId: input.verseId,
          },
        },
        update: { color: input.color },
        create: {
          userId: ctx.session.user.id,
          verseId: input.verseId,
          color: input.color,
        },
      });
      return { highlighted: true, color: input.color };
    }),

  upsertNote: protectedProcedure
    .input(z.object({ verseId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.note.findFirst({
        where: { userId: ctx.session.user.id, verseId: input.verseId }
      });

      if (existing) {
        return ctx.db.note.update({
          where: { id: existing.id },
          data: { content: input.content }
        });
      }

      return ctx.db.note.create({
        data: {
          content: input.content,
          verseId: input.verseId,
          userId: ctx.session.user.id,
        },
      });
    }),
});
