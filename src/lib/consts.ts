import packageJson from "../../package.json";

// Brand identity. Single source of truth — the Logo component, page
// titles, and OG metadata all read from these constants.
export const APP_NAME = "TrimSuccess";
export const APP_TAGLINE = "Análisis inteligente de inventario";
export const APP_DESCRIPTION =
  "Plataforma para analizar el costo de mantener inventario: scorecard, drivers, rendimiento por categoría y ventas en un solo cubo.";
/** Separator between page title and brand in `<title>`. */
export const TITLE_SEPARATOR = " · ";
export const VERSION = import.meta.env.VITE_APP_VERSION || packageJson.version;

export const LOCAL_STORAGE_KEYS = {
  CUSTOM_USER: "customUser",
  THEME: "theme",
};

export const ROUTES = {
  SIGN_IN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  MODULE_SELECTOR: "/module-selector",
  INVENTORY: {
    DASHBOARD: "/inventory/dashboard",
    IMPORT: "/inventory/import",
    DATA_MINING: "/inventory/data-mining",
    ADMIN: {
      IMPERSONATE: "/inventory/admin/impersonate",
    },
  },
  SALES: "/sales",
  /** Public marketing / legal pages — reachable from the landing footer. */
  PUBLIC: {
    ABOUT: "/about",
    CHANGELOG: "/changelog",
    TERMS: "/terms",
    PRIVACY: "/privacy",
  },
};

/** Public contact channel. Centralized so the landing CTA, footer, and
 * any "report a bug" link all point to the same place. */
export const CONTACT_EMAIL = "jahume92@gmail.com";

/**
 * Demo / dev accounts. Surfaced in two places that must stay in sync:
 * the dev-only quick-login buttons on the sign-in page, and the
 * admin impersonation picker (which filters Firestore users down to
 * exactly this allowlist so we don't expose every real account).
 */
export const DEV_ACCOUNTS = [
  {
    label: "Demo",
    email: "demo@trim-success.test",
    password: "Demo1234!",
  },
  {
    label: "Admin",
    email: "admin@trim-success.test",
    password: "Admin1234!",
  },
] as const;

export const DEV_ACCOUNT_EMAILS: readonly string[] = DEV_ACCOUNTS.map(
  (a) => a.email
);
