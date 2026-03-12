import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import { nodePolyfills } from "vite-plugin-node-polyfills";

import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    svgrPlugin(),
    ViteEjsPlugin(),
    nodePolyfills({
      protocolImports: true,
    }),
  ],
  server: {
    port: parseInt(process.env.FRONTEND_PORT || '5000'),
  },
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
      output: {
        manualChunks: {
          apexcharts: ["apexcharts"],
          chartjs: ["chart.js", "react-chartjs-2"],
          googlemaps: ["google-map-react"],
          vectormaps: [
            "jsvectormap",
            "src/vendor/us_aea_en.ts",
            "src/vendor/world.ts",
          ],
          fullcalendar: [
            "@fullcalendar/bootstrap",
            "@fullcalendar/daygrid",
            "@fullcalendar/react",
            "@fullcalendar/timegrid",
          ],
        },
      },
    },
  },
});
