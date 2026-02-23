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

  getBookChapters: publicProcedure
    .input(z.object({ bookId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.chapter.findMany({
        where: { bookId: input.bookId },
        orderBy: { number: "asc" },
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

      return ctx.db.verse.findMany({
        where: {
          chapterId: chapter.id,
          translationId: translation.id,
        },
        orderBy: { number: "asc" },
      });
    }),

  getVerse: publicProcedure
    .input(
      z.object({
        bookName: z.string(),
        chapterNumber: z.number(),
        verseNumber: z.number(),
        translationId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.verse.findFirst({
        where: {
          bookName: input.bookName,
          chapterNumber: input.chapterNumber,
          number: input.verseNumber,
          translationId: input.translationId,
        },
      });
    }),

  getTranslations: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.translation.findMany();
  }),

  // Protected procedures for user interaction
  addNote: protectedProcedure
    .input(z.object({ verseId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.note.create({
        data: {
          content: input.content,
          verseId: input.verseId,
          userId: ctx.session.user.id,
        },
      });
    }),

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
        await ctx.db.bookmark.delete({
          where: { id: existing.id },
        });
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
});
