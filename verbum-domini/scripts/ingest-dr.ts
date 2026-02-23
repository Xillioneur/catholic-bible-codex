import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();
const DR_JSON_URL = "https://raw.githubusercontent.com/xxruyle/Bible-DouayRheims/master/Douay-Rheims/EntireBible-DR.json";

// Mapping from JSON keys to our database names
const BOOK_MAPPING: Record<string, string> = {
  "Josue": "Joshua",
  "1 Kings": "1 Samuel",
  "2 Kings": "2 Samuel",
  "3 Kings": "1 Kings",
  "4 Kings": "2 Kings",
  "1 Paralipomenon": "1 Chronicles",
  "2 Paralipomenon": "2 Chronicles",
  "1 Esdras": "Ezra",
  "2 Esdras": "Nehemiah",
  "Tobias": "Tobit",
  "Canticles": "Song of Songs",
  "Ecclesiasticus": "Sirach",
  "Isaias": "Isaiah",
  "Jeremias": "Jeremiah",
  "Ezechiel": "Ezekiel",
  "Osee": "Hosea",
  "Abdias": "Obadiah",
  "Jonas": "Jonah",
  "Micheas": "Micah",
  "Nahum": "Nahum",
  "Habacuc": "Habakkuk",
  "Sophonias": "Zephaniah",
  "Aggeus": "Haggai",
  "Zacharias": "Zechariah",
  "Malachias": "Malachi",
  "1 Machabees": "1 Maccabees",
  "2 Machabees": "2 Maccabees",
  "Acts": "Acts of the Apostles",
  "Apocalypse": "Revelation"
};

async function main() {
  console.log("Fetching Douay-Rheims JSON...");
  const response = await fetch(DR_JSON_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch JSON: ${response.statusText}`);
  }
  const data = await response.json() as Record<string, Record<string, Record<string, string>>>;

  const translation = await prisma.translation.findUnique({
    where: { abbreviation: "DR" }
  });

  if (!translation) {
    throw new Error("DR translation not found in DB. Run seed first.");
  }

  console.log("Ingesting verses into Catholic Bible Codex...");

  for (const [jsonBookName, chapters] of Object.entries(data)) {
    const dbBookName = BOOK_MAPPING[jsonBookName] || jsonBookName;
    const book = await prisma.book.findUnique({
      where: { name: dbBookName }
    });

    if (!book) {
      console.warn(`Book not found in DB: ${dbBookName} (from ${jsonBookName})`);
      continue;
    }

    process.stdout.write(`Processing ${book.name}... `);

    for (const [chapterNum, verses] of Object.entries(chapters)) {
      const chapter = await prisma.chapter.upsert({
        where: {
          bookId_number: {
            bookId: book.id,
            number: parseInt(chapterNum)
          }
        },
        update: {},
        create: {
          bookId: book.id,
          number: parseInt(chapterNum)
        }
      });

      const verseData = Object.entries(verses).map(([verseNum, text]) => ({
        number: parseInt(verseNum),
        text: text,
        chapterId: chapter.id,
        translationId: translation.id,
        bookName: book.name,
        chapterNumber: chapter.number
      }));

      // Use createMany for performance
      await prisma.verse.createMany({
        data: verseData,
        skipDuplicates: true
      });
    }
    console.log("Done.");
  }

  console.log("Ingestion complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
