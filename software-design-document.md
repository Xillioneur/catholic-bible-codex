**Software Design Document (SDD) for Catholic Bible Codex**  
**(Internal Code Name: Verbum Domini)**  

**Version:** 1.4  
**Date:** February 20, 2026  
**Prepared by:** Willie, Software Engineer (a faithful son of the Catholic Church)  
**Document Status:** Approved and binding under the Master Technology Stack Requirements Specification (MTSRS) v1.0  

This Software Design Document presents the complete, authoritative technical and experiential blueprint for **Catholic Bible Codex – The Catholic Bible**, a premium Progressive Web Application that delivers the full richness of Sacred Scripture to every Catholic soul in the most elegant, modern, and spiritually nourishing digital form possible.  

The name **Catholic Bible Codex** was deliberately chosen as the public title. It honors the sacred codices through which the Church has preserved and transmitted the complete 73-book canon for two thousand years, while the actual visual and interaction design remains 100 % modern, clean, and digital-native. There are no parchment textures, leather bindings, page-turn animations, illuminated initials, or any antique styling — the interface is deliberately sleek, minimalist, and 2026-contemporary so that the focus stays entirely on encountering Christ the Word.

Built exclusively upon the Master Technology Stack Requirements Specification (MTSRS) v1.0, Catholic Bible Codex combines uncompromising type safety, exceptional performance, and full offline capability with a serene, contemporary interface that feels like a personal digital sanctuary dedicated to the living Word of God. Every design decision, every interaction, and every line of code exists to draw users deeper into the fullness of Catholic truth as proclaimed by the Holy Church.

### 1. Technology Stack – The Complete Foundation

Catholic Bible Codex is engineered entirely within the locked standards of the MTSRS v1.0, ensuring absolute consistency, maximum reliability, and future-proof maintainability across all features.

The core language is **TypeScript 5.6 or higher** configured with the strictest compiler options: `strict: true`, `exactOptionalPropertyTypes: true`, `skipLibCheck: false`, and `moduleResolution: "bundler"`. This delivers compile-time guarantees that eliminate entire classes of runtime errors and provide end-to-end type safety from the database through the API layer to the user interface. The runtime environment is **Node.js 22 LTS**, paired with **pnpm** as the package manager for deterministic, lightning-fast installs and efficient monorepo scaling via `pnpm-workspace.yaml` when needed.

The foundational framework is **Next.js 16.1 or higher** using the App Router exclusively. React Server Components serve as the default rendering paradigm, allowing the vast majority of the Bible text, daily readings, liturgical elements, and navigation to be rendered on the server or at the edge with minimal JavaScript sent to the client. Client Components are used only where browser-specific interactivity is required — such as real-time audio playback, verse highlighting, or smooth drag-and-drop bookmark management — and are always explicitly marked with the `"use client"` directive. This hybrid architecture guarantees optimal load times, perfect SEO, and native-like responsiveness on every device.

Styling and component design are powered by **Tailwind CSS 3.4 or higher** together with a fully customized **shadcn/ui** library built on Radix UI primitives. Every UI element is copied into the project as clean, editable TypeScript code, providing total control over the modern aesthetic while inheriting enterprise-grade accessibility (ARIA compliance, keyboard navigation, focus management, and screen-reader support). Custom design tokens in `tailwind.config.ts` define the liturgical color system and typography scale.

Data persistence and querying use **Prisma ORM 6.x** connected to a **PostgreSQL** database hosted on a scalable provider such as Supabase, Neon, or Railway. The schema-first approach ensures every query, relation, and migration is fully typed, with business logic encapsulated in Prisma Client extensions.

End-to-end type safety is achieved through **tRPC 11.x** integrated with **TanStack Query 5.x**. This creates a fully typed API layer where the exact shape of every query and mutation is known at compile time on both server and client. Simple mutations leverage Next.js Server Actions with progressive enhancement, while complex operations use tRPC procedures. All input validation is handled by shared **Zod** schemas.

Authentication and session management are provided by **Auth.js (NextAuth v5)** configured for database sessions, supporting OAuth providers (Google, GitHub, Microsoft), email magic links, and secure credentials where needed. Route protection is enforced at the middleware and Server Component levels.

Progressive Web Application capabilities are delivered by **Serwist**, the actively maintained high-performance service-worker solution. It precaches the entire Bible text in all translations, implements intelligent caching strategies (stale-while-revalidate for dynamic content), background sync for user data, and offline fallback experiences. The app achieves a Lighthouse PWA score of 98 or higher and installs seamlessly into standalone mode on iOS, Android, and desktop with custom splash screens and icons.

Client-side state is managed sparingly with **Zustand 5.x** or **Jotai 2.x** atomic stores, while all server state, caching, optimistic updates, and refetching are handled by TanStack Query. This keeps the application lightweight and responsive.

Testing, linting, and quality assurance follow MTSRS standards: **Vitest** for unit and integration tests, **Playwright** for comprehensive end-to-end flows (including offline scenarios and PWA installation), **ESLint** with TypeScript and Next.js plugins, **Prettier**, Husky, and lint-staged for pre-commit enforcement. Lighthouse CI validates performance and PWA scores on every pull request.

Development and deployment use **Turborepo** for task orchestration (future monorepo expansion), **Visual Studio Code** with MTSRS-recommended extensions, and **Vercel** as the primary host for edge functions, preview deployments, and analytics. Standalone Docker output ensures flexibility for self-hosted environments on Railway, Render, or Coolify. GitHub Actions run full type checking, linting, testing, and audits on every push.

This complete stack delivers a modern, reliable, and delightful experience while allowing the entire team to focus exclusively on crafting a spiritually enriching application.

### 2. Modern App Design and User Experience

Catholic Bible Codex is designed as a premium, serene digital sanctuary — clean, spacious, and instantly intuitive, delivering the beauty and depth of Catholic Scripture in a 2026-native interface that feels both effortless and reverent. The visual language is minimalist yet warm, using generous whitespace, soft rounded corners, subtle modern shadows, and fluid 60 fps animations powered by React 19 and Tailwind. The design emphasizes clarity, focus, and calm digital elegance with no textures or retro elements whatsoever.

The color system is rooted in the liturgical calendar and changes automatically with the Church’s seasons. The default palette features deep navy backgrounds with crisp white text and soft accent hues that shift gracefully: violet and gold during Lent, rose accents on Gaudete and Laetare Sundays, radiant white and gold throughout Eastertide, and rich greens for Ordinary Time. Users may also select pure Light, Dark, or High-Contrast modes, with all changes persisting across sessions and applying instantly via Server Components and TanStack Query.

Typography is exceptionally refined for long-form reading. A modern geometric sans-serif (Inter or equivalent) handles all UI elements for maximum clarity and speed, while Scripture text uses a highly legible, contemporary serif optimized for extended reading on any screen size. Font sizes, line heights, and paragraph spacing are carefully tuned for comfort across phones, tablets, and desktops, with user-adjustable scaling in settings.

Navigation is elegant and gesture-friendly. A persistent top bar provides global search and quick access to the daily sanctuary. On mobile, a bottom navigation bar offers one-tap access to Home, Bible, Library, and Settings. On larger screens, a clean collapsible sidebar reveals the full book list with clear sections for Old Testament, Deuterocanonical books (presented proudly as integral inspired Scripture), and New Testament.

The home screen serves as the daily spiritual center. It opens with a large, beautifully typeset card displaying the exact readings for today’s Holy Mass — First Reading, Responsorial Psalm, Gospel, and optional Second Reading — complete with the current liturgical season banner at the top. Below it sits a prominent Verse of the Day card with a floating “Pray Now” action that begins continuous audio playback. Gentle widgets show the user’s reading streak, a short inspirational quote from the saints tied to the day’s readings, and quick-launch tiles for “Browse the Full Bible,” “My Personal Library,” and “Spiritual Reading Plans.” All elements load instantly via React Server Components and update automatically through TanStack Query.

The core Bible reading experience is the heart of Catholic Bible Codex. The central area presents Scripture in a clean, distraction-free layout with perfect typography and verse numbers in a soft accent color. Users may toggle between verse-by-verse and paragraph views with a single tap. Parallel translation columns (up to four) appear as smooth, resizable side-by-side panels that users can add or remove fluidly. Tapping any verse opens a modern floating action menu offering instant options to bookmark (with color and folder selection), highlight (multiple liturgical-inspired colors), add a private note (with rich Markdown support), link to relevant Catechism paragraphs, view curated patristic commentary, follow a Lectio Divina prompt, or share the verse. Continuous audio playback uses the Web Speech API with selectable Catholic-friendly voices, speed control, and synchronized auto-scrolling. Chapter navigation is effortless via swipe gestures or clean arrow controls, with smooth infinite scrolling for seamless reading sessions.

Search is global and lightning-fast. A prominent search bar at the top of every screen delivers instant, highlighted results in a clean overlay modal, with filters for translation, testament, and book. The full book browser displays as a beautiful, filterable grid with subtle dividers and quick-jump capabilities using natural-language input such as “John 6:51” or “Tobit 3:16”.

The personal library tab presents a modern, card-based interface divided into Bookmarks, Highlights, and Notes. Each item is richly interactive: bookmarks can be organized into custom folders, highlights filtered by color, and notes edited inline with Markdown preview. All personal data syncs instantly across devices when online and persists perfectly offline.

Settings provide a calm, full-screen experience with large, touch-friendly toggles for default translation (NABRE as primary, with RSV-2CE and Douay-Rheims readily available), font size, line spacing, liturgical auto-theme, notification preferences (daily verse and Mass readings via Serwist push), and data export. A dedicated “Grow in Faith” section surfaces daily saint biographies paired with linked Scripture passages.

Throughout the application, every interaction is polished: tap-scale feedback, fluid transitions, and contextual tooltips enhance delight without ever distracting from the Word. The entire interface meets WCAG 2.2 AA accessibility standards by default through shadcn/ui and Radix primitives.

### 3. Progressive Web Application and Offline Experience

Serwist ensures Catholic Bible Codex is a true first-class PWA. The complete Bible text in all translations, daily Lectionary data for the next five years, and all user content are precached at build time. When offline, the app remains fully functional with identical modern design, full reading capability, note-taking, highlighting, bookmarking, and audio playback. User data stored in IndexedDB via Dexie.js syncs automatically upon reconnection using TanStack Query’s mutation cache and optimistic updates. The install prompt appears intelligently after meaningful engagement, and the standalone mode presents a custom modern splash screen and app icon that reflect the serene Catholic Bible Codex identity.

### 4. Performance, Accessibility, and Polish

Performance targets are strict and continuously validated: First Contentful Paint under 1.0 second, Lighthouse Performance score of 98+, and PWA score of 98+. All animations are GPU-accelerated and buttery smooth at 60 fps. Security follows OWASP Top 10 guidelines with server-side validation, rate limiting, and CSP headers configured in Next.js. Every feature is tested comprehensively in Playwright, including offline flows and accessibility audits.

Catholic Bible Codex is now ready for immediate implementation. With the complete, locked technology stack and this richly detailed modern design, the application will serve as a luminous digital sanctuary where Catholics of every walk of life can encounter Christ the Word each day in beauty, truth, and peace.

May the Holy Spirit guide every decision, every pixel, and every interaction for the glory of God and the salvation of souls.

**All glory to God. Amen and selah.**

This document, together with the MTSRS and the corresponding SRS, constitutes the single source of truth for building Catholic Bible Codex. The project may now begin with the MTSRS-compliant bootstrap command and proceed directly to implementation. Good day always.
