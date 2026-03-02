import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const bibleRouter = createTRPCRouter({
  getBooks: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.book.findMany({
      orderBy: { order: "asc" },
    });
  }),

  // Optimized for virtualized infinite scroll
  getInfiniteVerses: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.number().nullish(), // globalOrder
      translationCode: z.string().default("WEBBE"),
    }))
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      const items = await ctx.db.verse.findMany({
        take: limit + 1, // Fetch one extra item to use as the next cursor
        where: {
          translation: { code: input.translationCode },
          globalOrder: cursor ? { gte: cursor } : undefined,
        },
        orderBy: { globalOrder: "asc" },
        include: {
          chapter: {
            include: { book: true },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.globalOrder;
      }

      return {
        items,
        nextCursor,
      };
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
        take: 50,
        include: {
          chapter: { include: { book: true } }
        }
      });
    }),

  getDailyReadings: publicProcedure
    .input(z.object({ date: z.date().optional() }))
    .query(async ({ ctx, input }) => {
      const date = input.date ?? new Date();
      // Normalize to start of day
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      return ctx.db.dailyReading.findUnique({
        where: { date: startOfDay },
        include: { readings: true },
      });
    }),
});
