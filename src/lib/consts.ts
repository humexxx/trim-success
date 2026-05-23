import packageJson from "../../package.json";

// Brand identity. Single source of truth — the Logo component, page
// titles, and OG metadata all read from these constants.
export const APP_NAME = "ScorChain";
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
  SIGN_IN: "/sign-in",
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
};
