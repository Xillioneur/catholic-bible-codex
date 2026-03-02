import { PrismaClient, Testament } from "@prisma/client";

const prisma = new PrismaClient();

const CATHOLIC_BOOKS = [
  // Old Testament
  { name: "Genesis", order: 1, testament: Testament.OLD },
  { name: "Exodus", order: 2, testament: Testament.OLD },
  { name: "Leviticus", order: 3, testament: Testament.OLD },
  { name: "Numbers", order: 4, testament: Testament.OLD },
  { name: "Deuteronomy", order: 5, testament: Testament.OLD },
  { name: "Joshua", order: 6, testament: Testament.OLD },
  { name: "Judges", order: 7, testament: Testament.OLD },
  { name: "Ruth", order: 8, testament: Testament.OLD },
  { name: "1 Samuel", order: 9, testament: Testament.OLD },
  { name: "2 Samuel", order: 10, testament: Testament.OLD },
  { name: "1 Kings", order: 11, testament: Testament.OLD },
  { name: "2 Kings", order: 12, testament: Testament.OLD },
  { name: "1 Chronicles", order: 13, testament: Testament.OLD },
  { name: "2 Chronicles", order: 14, testament: Testament.OLD },
  { name: "Ezra", order: 15, testament: Testament.OLD },
  { name: "Nehemiah", order: 16, testament: Testament.OLD },
  { name: "Tobit", order: 17, testament: Testament.OLD, isDeuterocanon: true },
  { name: "Judith", order: 18, testament: Testament.OLD, isDeuterocanon: true },
  { name: "Esther", order: 19, testament: Testament.OLD },
  { name: "1 Maccabees", order: 20, testament: Testament.OLD, isDeuterocanon: true },
  { name: "2 Maccabees", order: 21, testament: Testament.OLD, isDeuterocanon: true },
  { name: "Job", order: 22, testament: Testament.OLD },
  { name: "Psalms", order: 23, testament: Testament.OLD },
  { name: "Proverbs", order: 24, testament: Testament.OLD },
  { name: "Ecclesiastes", order: 25, testament: Testament.OLD },
  { name: "Song of Songs", order: 26, testament: Testament.OLD },
  { name: "Wisdom", order: 27, testament: Testament.OLD, isDeuterocanon: true },
  { name: "Sirach", order: 28, testament: Testament.OLD, isDeuterocanon: true },
  { name: "Isaiah", order: 29, testament: Testament.OLD },
  { name: "Jeremiah", order: 30, testament: Testament.OLD },
  { name: "Lamentations", order: 31, testament: Testament.OLD },
  { name: "Baruch", order: 32, testament: Testament.OLD, isDeuterocanon: true },
  { name: "Ezekiel", order: 33, testament: Testament.OLD },
  { name: "Daniel", order: 34, testament: Testament.OLD },
  { name: "Hosea", order: 35, testament: Testament.OLD },
  { name: "Joel", order: 36, testament: Testament.OLD },
  { name: "Amos", order: 37, testament: Testament.OLD },
  { name: "Obadiah", order: 38, testament: Testament.OLD },
  { name: "Jonah", order: 39, testament: Testament.OLD },
  { name: "Micah", order: 40, testament: Testament.OLD },
  { name: "Nahum", order: 41, testament: Testament.OLD },
  { name: "Habakkuk", order: 42, testament: Testament.OLD },
  { name: "Zephaniah", order: 43, testament: Testament.OLD },
  { name: "Haggai", order: 44, testament: Testament.OLD },
  { name: "Zechariah", order: 45, testament: Testament.OLD },
  { name: "Malachi", order: 46, testament: Testament.OLD },
  // New Testament
  { name: "Matthew", order: 47, testament: Testament.NEW },
  { name: "Mark", order: 48, testament: Testament.NEW },
  { name: "Luke", order: 49, testament: Testament.NEW },
  { name: "John", order: 50, testament: Testament.NEW },
  { name: "Acts", order: 51, testament: Testament.NEW },
  { name: "Romans", order: 52, testament: Testament.NEW },
  { name: "1 Corinthians", order: 53, testament: Testament.NEW },
  { name: "2 Corinthians", order: 54, testament: Testament.NEW },
  { name: "Galatians", order: 55, testament: Testament.NEW },
  { name: "Ephesians", order: 56, testament: Testament.NEW },
  { name: "Philippians", order: 57, testament: Testament.NEW },
  { name: "Colossians", order: 58, testament: Testament.NEW },
  { name: "1 Thessalonians", order: 59, testament: Testament.NEW },
  { name: "2 Thessalonians", order: 60, testament: Testament.NEW },
  { name: "1 Timothy", order: 61, testament: Testament.NEW },
  { name: "2 Timothy", order: 62, testament: Testament.NEW },
  { name: "Titus", order: 63, testament: Testament.NEW },
  { name: "Philemon", order: 64, testament: Testament.NEW },
  { name: "Hebrews", order: 65, testament: Testament.NEW },
  { name: "James", order: 66, testament: Testament.NEW },
  { name: "1 Peter", order: 67, testament: Testament.NEW },
  { name: "2 Peter", order: 68, testament: Testament.NEW },
  { name: "1 John", order: 69, testament: Testament.NEW },
  { name: "2 John", order: 70, testament: Testament.NEW },
  { name: "3 John", order: 71, testament: Testament.NEW },
  { name: "Jude", order: 72, testament: Testament.NEW },
  { name: "Revelation", order: 73, testament: Testament.NEW },
];

async function main() {
  console.log("Seeding Catholic Bible Infrastructure...");

  // 1. Seed Free Translations
  const translations = [
    { code: "WEBBE", name: "World English Bible (Catholic Edition)", language: "English", description: "A modern, public domain English translation." },
    { code: "DR", name: "Douay-Rheims (Challoner)", language: "English", description: "The classic traditional English translation of the Vulgate." },
    { code: "VUL", name: "Clementine Vulgate", language: "Latin", description: "The historic Latin text of the Church." },
  ];

  for (const t of translations) {
    await prisma.translation.upsert({
      where: { code: t.code },
      update: {},
      create: t,
    });
  }

  // 2. Seed 73-Book Canon
  for (const bookData of CATHOLIC_BOOKS) {
    await prisma.book.upsert({
      where: { name: bookData.name },
      update: { order: bookData.order, testament: bookData.testament, isDeuterocanon: bookData.isDeuterocanon || false },
      create: {
        name: bookData.name,
        order: bookData.order,
        testament: bookData.testament,
        isDeuterocanon: bookData.isDeuterocanon || false,
      },
    });
  }

  // 3. Setup Initial Daily Reading (Mock for current day)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  await prisma.dailyReading.upsert({
    where: { date: today },
    update: {},
    create: {
      date: today,
      season: "ORDINARY_TIME",
      readings: {
        create: [
          { type: "First Reading", reference: "Genesis 1:1-5", text: "In the beginning, when God created the heavens and the earth, the earth was a formless wasteland..." },
          { type: "Psalm", reference: "Psalm 104", text: "Lord, send out your Spirit, and renew the face of the earth." },
          { type: "Gospel", reference: "John 1:1-5", text: "In the beginning was the Word, and the Word was with God, and the Word was God..." },
        ]
      }
    }
  });

  console.log("Seeding complete. The Digital Sanctuary is ready for text ingestion.");
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
