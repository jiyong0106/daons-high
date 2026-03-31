import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    // 2. PWA 설정 추가
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"], // 캐싱할 파일 대상
        skipWaiting: true, // 새로운 SW가 나타나면 즉시 활성화
        clientsClaim: true, // 새로운 SW가 활성화되자마자 즉시 페이지 제어권을 가짐
      },
      includeAssets: ["favicon.ico", "image/iphone.png", "image/metaimage.png"],
      manifest: {
        name: "다온스하이 | daon's high",
        short_name: "다온스하이",
        description: "귀여운 냥 퍼즐을 맞춰 부적을 획득하세요!",
        theme_color: "#fff8f0",
        background_color: "#fff8f0",
        display: "standalone",
        icons: [
          {
            src: "image/android.png", // public/image/android.png를 가리킴
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "image/splash.png", // public/image/splash.png를 가리킴
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "image/splash.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable", // 안드로이드용 마스커블 설정
          },
        ],
      },
    }),
  ],
});
