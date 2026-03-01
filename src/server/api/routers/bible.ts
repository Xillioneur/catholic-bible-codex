import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const bibleRouter = createTRPCRouter({
  getBooks: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.book.findMany({
      orderBy: { order: "asc" },
    });
  }),

  getVerses: publicProcedure
    .input(z.object({
      skip: z.number().default(0),
      take: z.number().default(50),
      translationCode: z.string().default("WEBBE"),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.verse.findMany({
        where: {
          translation: {
            code: input.translationCode,
          },
        },
        orderBy: {
          globalOrder: "asc",
        },
        skip: input.skip,
        take: input.take,
        include: {
          chapter: {
            include: {
              book: true,
            },
          },
        },
      });
    }),

  search: publicProcedure
    .input(z.object({ 
      query: z.string(),
      translationCode: z.string().default("WEBBE") 
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.verse.findMany({
        where: {
          translation: { code: input.translationCode },
          text: { contains: input.query, mode: 'insensitive' }
        },
        take: 20,
        include: {
          chapter: { include: { book: true } }
        }
      });
    }),

  getDailyReadings: publicProcedure
    .input(z.object({ date: z.date().optional() }))
    .query(async ({ ctx, input }) => {
      const date = input.date ?? new Date();
      return ctx.db.dailyReading.findUnique({
        where: { date },
        include: { readings: true },
      });
    }),
});
