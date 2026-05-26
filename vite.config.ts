import react from "@vitejs/plugin-react";
import * as path from "path";
import { defineConfig } from "vite";

/**
 * Vite build config.
 *
 * `manualChunks` splits the dependency graph by major vendor so the
 * initial `index.*.js` shrinks from ~1.5MB to ~250KB. Each heavy lib
 * lands in its own cached chunk:
 *   - recharts        ← chart bundle (huge SVG render layer)
 *   - firebase        ← Auth + Firestore + Functions + Storage SDK
 *   - pdfmake         ← PDF generation (only the reports flow)
 *   - radix           ← shadcn primitives (every Dialog/Select/etc.)
 *   - motion          ← framer-motion animations
 *   - react-vendor    ← react, react-dom, react-router-dom
 *   - vendor          ← everything else from node_modules
 *
 * Pages keep their per-route lazy split (see src/lib/routes.tsx), so
 * the cold-load budget is `react-vendor + vendor + the route's chunk`,
 * not the whole app.
 */
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src"),
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          // Heavy chart lib — only pulls in on routes that render charts.
          if (id.includes("recharts") || id.includes("d3-")) return "recharts";

          // Firebase SDK (Auth + Firestore + Functions + Storage).
          if (id.includes("/firebase/") || id.includes("@firebase/")) {
            return "firebase";
          }

          // PDF rendering — only used by the reports flow.
          if (id.includes("pdfmake")) return "pdfmake";

          // shadcn primitives all sit under @radix-ui.
          if (id.includes("@radix-ui/")) return "radix";

          // Animations.
          if (id.includes("framer-motion")) return "motion";

          // React core. Match path delimiters so we don't catch
          // unrelated packages with "react" in their name.
          if (
            id.includes("/node_modules/react/") ||
            id.includes("/node_modules/react-dom/") ||
            id.includes("/node_modules/react-router") ||
            id.includes("/node_modules/scheduler/")
          ) {
            return "react-vendor";
          }

          // Catch-all for the rest of node_modules. Keeps churning npm
          // updates from busting the main app chunk's hash.
          return "vendor";
        },
      },
    },
    // Each vendor chunk is well under 700KB now; the noisy 500KB
    // warning isn't useful at this point.
    chunkSizeWarningLimit: 700,
  },
});
