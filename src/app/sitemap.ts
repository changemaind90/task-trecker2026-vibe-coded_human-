import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://task-trecker2026-vibe-human.vercel.app";
  const now = new Date();

  return [
    { url: baseUrl, lastModified: now, priority: 1 },
    { url: `${baseUrl}/login`, lastModified: now, priority: 0.5 },
    { url: `${baseUrl}/register`, lastModified: now, priority: 0.5 },
  ];
}
