import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://task-trecker2026-vibe-human-25j7jzn8y-changemaind90.vercel.app/", lastModified: new Date(), priority: 1 },
    { url: "https://task-trecker2026-vibe-human-25j7jzn8y-changemaind90.vercel.app//login", lastModified: new Date(), priority: 0.5 },
    { url: "https://task-trecker2026-vibe-human-25j7jzn8y-changemaind90.vercel.app//register", lastModified: new Date(), priority: 0.5 },
  ];
}