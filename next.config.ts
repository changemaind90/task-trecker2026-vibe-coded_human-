import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false, // убирает X-Powered-By: Next.js
  serverExternalPackages: ["@prisma/client", "@prisma/client-runtime-utils"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Защита от MIME-sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Защита от кликджекинга (iframe)
          { key: "X-Frame-Options", value: "DENY" },
          // Не отправлять referer на сторонние сайты
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Отключить доступ к камере/микрофону/геолокации
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Строгая политика по XSS
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;