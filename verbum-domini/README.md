# Catholic Bible Codex

**Catholic Bible Codex** is a premium, modern Progressive Web Application (PWA) designed for reading, studying, and praying with the full Catholic Bible (73-book canon).

## Features

-   **Full Catholic Canon:** Complete 73-book Bible, including the Deuterocanonical books.
-   **Public Domain Excellence:** Primarily powered by the Douay-Rheims (Challoner Revision) translation.
-   **Liturgical Sync:** Automatically themes itself based on the current Catholic Church season (Lent, Easter, Advent, etc.).
-   **Study Tools:** Advanced verse action menu for bookmarks, liturgical highlighting, and personal spiritual reflections.
-   **Catechism Integration:** Direct cross-links to the Catechism of the Catholic Church.
-   **Offline First:** Full PWA capabilities with instant loading and offline reading support.
-   **Zero-Click Resume:** Automatically returns you to your last saved prayer spot the moment you open the app.
-   **Premium Typography:** Optimized for deep focus and prayerful reading with modern serif fonts.

## Tech Stack

-   **Framework:** Next.js 16.1 (App Router)
-   **Language:** TypeScript 5.8 (Strict Mode)
-   **Database:** Prisma 6 + PostgreSQL (Neon)
-   **API:** tRPC 11 + TanStack Query 5
-   **Authentication:** Auth.js (NextAuth v5) with Google OAuth
-   **Styling:** Tailwind CSS 4 + shadcn/ui
-   **PWA:** Serwist (Service Workers)
-   **Liturgy:** Romcal

## Getting Started

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```

2.  **Configure environment:**
    Copy `.env.example` to `.env` and fill in your database and Google OAuth credentials.

3.  **Sync Database:**
    ```bash
    npx prisma db push
    npx prisma db seed
    npx tsx scripts/ingest-dr.ts
    ```

4.  **Run Development Server:**
    ```bash
    pnpm dev
    ```

## License

This project is intended for personal and community spiritual growth. The Douay-Rheims text is in the public domain.

**All glory to God. Amen and selah.**
