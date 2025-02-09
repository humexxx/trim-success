import packageJson from "../../package.json";

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
    ADMIN: {
      IMPERSONATE: "/inventory/admin/impersonate",
    },
  },
};
