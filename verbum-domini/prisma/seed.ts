import { PrismaClient, Testament, BookGroup } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Catholic Bible Canon (73 books)...");

  const translations = [
    {
      name: "New American Bible, Revised Edition",
      abbreviation: "NABRE",
      language: "English",
      copyright: "Copyright © 2010, 1991, 1986, 1970 Confraternity of Christian Doctrine, Inc.",
    },
    {
      name: "Douay-Rheims Bible",
      abbreviation: "DR",
      language: "English",
      isPublicDomain: true,
    },
    {
      name: "Revised Standard Version, Second Catholic Edition",
      abbreviation: "RSV-2CE",
      language: "English",
      copyright: "Copyright © 2006 Ignatius Press",
    }
  ];

  const translationRecords: Record<string, any> = {};
  for (const t of translations) {
    translationRecords[t.abbreviation] = await prisma.translation.upsert({
      where: { abbreviation: t.abbreviation },
      update: {},
      create: t,
    });
  }

  const books = [
    // Pentateuch
    { name: "Genesis", abbreviation: "Gn", order: 1, testament: Testament.OLD, group: BookGroup.PENTATEUCH },
    { name: "Exodus", abbreviation: "Ex", order: 2, testament: Testament.OLD, group: BookGroup.PENTATEUCH },
    { name: "Leviticus", abbreviation: "Lv", order: 3, testament: Testament.OLD, group: BookGroup.PENTATEUCH },
    { name: "Numbers", abbreviation: "Nm", order: 4, testament: Testament.OLD, group: BookGroup.PENTATEUCH },
    { name: "Deuteronomy", abbreviation: "Dt", order: 5, testament: Testament.OLD, group: BookGroup.PENTATEUCH },

    // Historical Books
    { name: "Joshua", abbreviation: "Jos", order: 6, testament: Testament.OLD, group: BookGroup.HISTORICAL },
    { name: "Judges", abbreviation: "Jgs", order: 7, testament: Testament.OLD, group: BookGroup.HISTORICAL },
    { name: "Ruth", abbreviation: "Ru", order: 8, testament: Testament.OLD, group: BookGroup.HISTORICAL },
    { name: "1 Samuel", abbreviation: "1 Sm", order: 9, testament: Testament.OLD, group: BookGroup.HISTORICAL },
    { name: "2 Samuel", abbreviation: "2 Sm", order: 10, testament: Testament.OLD, group: BookGroup.HISTORICAL },
    { name: "1 Kings", abbreviation: "1 Kgs", order: 11, testament: Testament.OLD, group: BookGroup.HISTORICAL },
    { name: "2 Kings", abbreviation: "2 Kgs", order: 12, testament: Testament.OLD, group: BookGroup.HISTORICAL },
    { name: "1 Chronicles", abbreviation: "1 Chr", order: 13, testament: Testament.OLD, group: BookGroup.HISTORICAL },
    { name: "2 Chronicles", abbreviation: "2 Chr", order: 14, testament: Testament.OLD, group: BookGroup.HISTORICAL },
    { name: "Ezra", abbreviation: "Ezr", order: 15, testament: Testament.OLD, group: BookGroup.HISTORICAL },
    { name: "Nehemiah", abbreviation: "Neh", order: 16, testament: Testament.OLD, group: BookGroup.HISTORICAL },
    { name: "Tobit", abbreviation: "Tb", order: 17, testament: Testament.OLD, group: BookGroup.HISTORICAL, isDeuterocanonical: true },
    { name: "Judith", abbreviation: "Jdt", order: 18, testament: Testament.OLD, group: BookGroup.HISTORICAL, isDeuterocanonical: true },
    { name: "Esther", abbreviation: "Est", order: 19, testament: Testament.OLD, group: BookGroup.HISTORICAL }, 
    { name: "1 Maccabees", abbreviation: "1 Mc", order: 20, testament: Testament.OLD, group: BookGroup.HISTORICAL, isDeuterocanonical: true },
    { name: "2 Maccabees", abbreviation: "2 Mc", order: 21, testament: Testament.OLD, group: BookGroup.HISTORICAL, isDeuterocanonical: true },

    // Wisdom Books
    { name: "Job", abbreviation: "Jb", order: 22, testament: Testament.OLD, group: BookGroup.WISDOM },
    { name: "Psalms", abbreviation: "Ps", order: 23, testament: Testament.OLD, group: BookGroup.WISDOM },
    { name: "Proverbs", abbreviation: "Prv", order: 24, testament: Testament.OLD, group: BookGroup.WISDOM },
    { name: "Ecclesiastes", abbreviation: "Eccl", order: 25, testament: Testament.OLD, group: BookGroup.WISDOM },
    { name: "Song of Songs", abbreviation: "Sg", order: 26, testament: Testament.OLD, group: BookGroup.WISDOM },
    { name: "Wisdom", abbreviation: "Wis", order: 27, testament: Testament.OLD, group: BookGroup.WISDOM, isDeuterocanonical: true },
    { name: "Sirach", abbreviation: "Sir", order: 28, testament: Testament.OLD, group: BookGroup.WISDOM, isDeuterocanonical: true },

    // Prophets
    { name: "Isaiah", abbreviation: "Is", order: 29, testament: Testament.OLD, group: BookGroup.PROPHETS },
    { name: "Jeremiah", abbreviation: "Jer", order: 30, testament: Testament.OLD, group: BookGroup.PROPHETS },
    { name: "Lamentations", abbreviation: "Lam", order: 31, testament: Testament.OLD, group: BookGroup.PROPHETS },
    { name: "Baruch", abbreviation: "Bar", order: 32, testament: Testament.OLD, group: BookGroup.PROPHETS, isDeuterocanonical: true },
    { name: "Ezekiel", abbreviation: "Ez", order: 33, testament: Testament.OLD, group: BookGroup.PROPHETS },
    { name: "Daniel", abbreviation: "Dn", order: 34, testament: Testament.OLD, group: BookGroup.PROPHETS }, 
    { name: "Hosea", abbreviation: "Hos", order: 35, testament: Testament.OLD, group: BookGroup.PROPHETS },
    { name: "Joel", abbreviation: "Jl", order: 36, testament: Testament.OLD, group: BookGroup.PROPHETS },
    { name: "Amos", abbreviation: "Am", order: 37, testament: Testament.OLD, group: BookGroup.PROPHETS },
    { name: "Obadiah", abbreviation: "Ob", order: 38, testament: Testament.OLD, group: BookGroup.PROPHETS },
    { name: "Jonah", abbreviation: "Jon", order: 39, testament: Testament.OLD, group: BookGroup.PROPHETS },
    { name: "Micah", abbreviation: "Mi", order: 40, testament: Testament.OLD, group: BookGroup.PROPHETS },
    { name: "Nahum", abbreviation: "Na", order: 41, testament: Testament.OLD, group: BookGroup.PROPHETS },
    { name: "Habakkuk", abbreviation: "Hb", order: 42, testament: Testament.OLD, group: BookGroup.PROPHETS },
    { name: "Zephaniah", abbreviation: "Zep", order: 43, testament: Testament.OLD, group: BookGroup.PROPHETS },
    { name: "Haggai", abbreviation: "Hg", order: 44, testament: Testament.OLD, group: BookGroup.PROPHETS },
    { name: "Zechariah", abbreviation: "Zec", order: 45, testament: Testament.OLD, group: BookGroup.PROPHETS },
    { name: "Malachi", abbreviation: "Mal", order: 46, testament: Testament.OLD, group: BookGroup.PROPHETS },

    // Gospels
    { name: "Matthew", abbreviation: "Mt", order: 47, testament: Testament.NEW, group: BookGroup.GOSPELS },
    { name: "Mark", abbreviation: "Mk", order: 48, testament: Testament.NEW, group: BookGroup.GOSPELS },
    { name: "Luke", abbreviation: "Lk", order: 49, testament: Testament.NEW, group: BookGroup.GOSPELS },
    { name: "John", abbreviation: "Jn", order: 50, testament: Testament.NEW, group: BookGroup.GOSPELS },

    // Acts
    { name: "Acts of the Apostles", abbreviation: "Acts", order: 51, testament: Testament.NEW, group: BookGroup.ACTS },

    // Epistles
    { name: "Romans", abbreviation: "Rom", order: 52, testament: Testament.NEW, group: BookGroup.EPISTLES },
    { name: "1 Corinthians", abbreviation: "1 Cor", order: 53, testament: Testament.NEW, group: BookGroup.EPISTLES },
    { name: "2 Corinthians", abbreviation: "2 Cor", order: 54, testament: Testament.NEW, group: BookGroup.EPISTLES },
    { name: "Galatians", abbreviation: "Gal", order: 55, testament: Testament.NEW, group: BookGroup.EPISTLES },
    { name: "Ephesians", abbreviation: "Eph", order: 56, testament: Testament.NEW, group: BookGroup.EPISTLES },
    { name: "Philippians", abbreviation: "Phil", order: 57, testament: Testament.NEW, group: BookGroup.EPISTLES },
    { name: "Colossians", abbreviation: "Col", order: 58, testament: Testament.NEW, group: BookGroup.EPISTLES },
    { name: "1 Thessalonians", abbreviation: "1 Thes", order: 59, testament: Testament.NEW, group: BookGroup.EPISTLES },
    { name: "2 Thessalonians", abbreviation: "2 Thes", order: 60, testament: Testament.NEW, group: BookGroup.EPISTLES },
    { name: "1 Timothy", abbreviation: "1 Tm", order: 61, testament: Testament.NEW, group: BookGroup.EPISTLES },
    { name: "2 Timothy", abbreviation: "2 Tm", order: 62, testament: Testament.NEW, group: BookGroup.EPISTLES },
    { name: "Titus", abbreviation: "Ti", order: 63, testament: Testament.NEW, group: BookGroup.EPISTLES },
    { name: "Philemon", abbreviation: "Phlm", order: 64, testament: Testament.NEW, group: BookGroup.EPISTLES },
    { name: "Hebrews", abbreviation: "Heb", order: 65, testament: Testament.NEW, group: BookGroup.EPISTLES },
    { name: "James", abbreviation: "Jas", order: 66, testament: Testament.NEW, group: BookGroup.EPISTLES },
    { name: "1 Peter", abbreviation: "1 Pt", order: 67, testament: Testament.NEW, group: BookGroup.EPISTLES },
    { name: "2 Peter", abbreviation: "2 Pt", order: 68, testament: Testament.NEW, group: BookGroup.EPISTLES },
    { name: "1 John", abbreviation: "1 Jn", order: 69, testament: Testament.NEW, group: BookGroup.EPISTLES },
    { name: "2 John", abbreviation: "2 Jn", order: 70, testament: Testament.NEW, group: BookGroup.EPISTLES },
    { name: "3 John", abbreviation: "3 Jn", order: 71, testament: Testament.NEW, group: BookGroup.EPISTLES },
    { name: "Jude", abbreviation: "Jude", order: 72, testament: Testament.NEW, group: BookGroup.EPISTLES },

    // Revelation
    { name: "Revelation", abbreviation: "Rv", order: 73, testament: Testament.NEW, group: BookGroup.REVELATION },
  ];

  const bookRecords: Record<string, any> = {};
  for (const book of books) {
    bookRecords[book.abbreviation] = await prisma.book.upsert({
      where: { abbreviation: book.abbreviation },
      update: { 
        order: book.order, 
        isDeuterocanonical: book.isDeuterocanonical ?? false,
        abbreviation_case_insensitive: book.abbreviation.toLowerCase().replace(" ", "-")
      },
      create: {
        ...book,
        abbreviation_case_insensitive: book.abbreviation.toLowerCase().replace(" ", "-")
      },
    });
  }

  // Seed some sample verses (John 1 and Tobit 1)
  const sampleData = [
    {
      bookAbbr: "Jn",
      chapterNum: 1,
      verses: [
        { num: 1, text: "In the beginning was the Word, and the Word was with God, and the Word was God.", translation: "NABRE" },
        { num: 2, text: "He was in the beginning with God.", translation: "NABRE" },
        { num: 3, text: "All things came to be through him, and without him nothing came to be.", translation: "NABRE" },
        { num: 1, text: "In the beginning was the Word, and the Word was with God, and the Word was God.", translation: "DR" },
        { num: 2, text: "The same was in the beginning with God.", translation: "DR" },
      ]
    },
    {
      bookAbbr: "Tb",
      chapterNum: 1,
      verses: [
        { num: 1, text: "This book tells the story of Tobit, son of Tobiel, son of Hananiel, son of Aduel, son of Gabael, son of Raphael, son of Raguel, of the family of Asiel, of the tribe of Naphtali.", translation: "NABRE" },
        { num: 1, text: "Tobias of the tribe and city of Nephtali, (which is in the upper parts of Galilee above Naasson, beyond the way that leadeth to the west, having on the right hand the city of Sephet,)", translation: "DR" },
      ]
    }
  ];

  for (const data of sampleData) {
    const book = bookRecords[data.bookAbbr];
    const chapter = await prisma.chapter.upsert({
      where: {
        bookId_number: {
          bookId: book.id,
          number: data.chapterNum
        }
      },
      update: {},
      create: {
        bookId: book.id,
        number: data.chapterNum
      }
    });

    for (const v of data.verses) {
      const translation = translationRecords[v.translation];
      await prisma.verse.upsert({
        where: {
          translationId_chapterId_number: {
            translationId: translation.id,
            chapterId: chapter.id,
            number: v.num
          }
        },
        update: { text: v.text },
        create: {
          number: v.num,
          text: v.text,
          chapterId: chapter.id,
          translationId: translation.id,
          bookName: book.name,
          chapterNumber: chapter.number
        }
      });
    }
  }

  console.log("Seeding complete. 73 books, 3 translations, and sample verses created.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
