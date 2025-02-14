import packageJson from "../../package.json";

export const APP_NAME = import.meta.env.VITE_APP_NAME;
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
