import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
 
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": `${import.meta.dirname}/src`,
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("chart.js") || id.includes("react-chartjs-2")) return "charts";
          if (id.includes("react-icons") || id.includes("lucide-react")) return "icons";
          if (id.includes("react") || id.includes("redux")) return "react";
          return undefined;
        },
      },
    },
  },
})
