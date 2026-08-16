import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "mask-icon.svg"
      ],

      manifest: {
        name: "Adiflex ERP",
        short_name: "Adiflex",

        description: "Production Management ERP",

        theme_color: "#1976d2",

        background_color: "#ffffff",

        display: "standalone",

        orientation: "portrait",

        start_url: "/",

        icons: [
          {
            src: "/pwa.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/pwa-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
});