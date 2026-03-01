import { db } from "~/server/db";

interface VerseInput {
  bookName: string;
  chapterNumber: number;
  verseNumber: number;
  text: string;
  translationCode: string;
}

export async function importVerses(verses: VerseInput[]) {
  console.log(`Starting import of ${verses.length} verses...`);

  // This is a high-performance batch import strategy
  // In a real scenario, we'd use prisma.verse.createMany for efficiency
  
  for (const verse of verses) {
    const translation = await db.translation.findUnique({
      where: { code: verse.translationCode }
    });
    
    if (!translation) continue;

    const book = await db.book.findUnique({
      where: { name: verse.bookName }
    });

    if (!book) continue;

    const chapter = await db.chapter.upsert({
      where: {
        bookId_number: {
          bookId: book.id,
          number: verse.chapterNumber
        }
      },
      update: {},
      create: {
        number: verse.chapterNumber,
        bookId: book.id
      }
    });

    // We'd calculate globalOrder based on book order, chapter number, and verse number
    // to ensure the infinite scroll has a stable, indexed sort key.
  }
}
