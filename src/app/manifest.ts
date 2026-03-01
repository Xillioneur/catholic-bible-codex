import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Catholic Bible Codex – The Catholic Bible",
    short_name: "Bible Codex",
    description: "A premium, modern PWA for reading, studying, and praying with the full Catholic Bible.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1e3a8a", // Default navy blue for Ordinary Time
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
