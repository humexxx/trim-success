import react from "@vitejs/plugin-react";
import * as path from "path";
import { defineConfig } from "vite";

/**
 * Vite build config.
 *
 * Conservative `manualChunks` strategy: only split LEAF packages that
 * don't depend on React. Aggressive splitting of React + its
 * ecosystem (radix, recharts, framer-motion) into separate chunks
 * broke production with
 *   `Cannot read properties of undefined (reading 'createContext')`
 * because some transitive React consumers (react-is, internals of
 * recharts/radix) ran their top-level `React.createContext()` calls
 * before the `react-vendor` chunk had finished evaluating. ESM import
 * order on hashed chunks is harder to control than it looks.
 *
 * Safe split:
 *   - firebase: ~500KB SDK, no React peer dep
 *   - pdfmake : heavy PDF lib, no React peer dep
 *
 * Everything else (React, react-dom, react-router, @radix-ui/*,
 * recharts, framer-motion, lucide, …) stays in the main app chunk so
 * the natural module-eval order is preserved. We still get most of
 * the caching benefit (firebase + pdfmake won't change with app
 * commits) without the load-order foot-gun.
 *
 * Per-route lazy split in src/lib/routes.tsx still applies, so each
 * page only loads its own JSX on first visit.
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
          if (id.includes("/firebase/") || id.includes("@firebase/")) {
            return "firebase";
          }
          if (id.includes("pdfmake")) return "pdfmake";
          // Everything else (including React) → default (main) chunk.
          // Tried splitting recharts/radix/motion separately and hit
          // the createContext-on-undefined crash; not worth it.
        },
      },
    },
    // Main chunk lands around ~900KB raw with this conservative split,
    // which is fine for a logged-in dashboard app. Raise the warning
    // ceiling so green builds aren't noisy.
    chunkSizeWarningLimit: 1000,
  },
});
