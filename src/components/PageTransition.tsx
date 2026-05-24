import { ReactNode } from "react";

import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

/**
 * Subtle fade + 4px slide on route change. The animation `key`s on the
 * URL path so React Router's `<Outlet />` remount triggers the
 * enter transition. Honors prefers-reduced-motion: when reduced, motion
 * falls back to an instant swap via Framer Motion's built-in respect
 * for the media query.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
