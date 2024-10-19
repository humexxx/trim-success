import packageJson from "../package.json";

export const VERSION = import.meta.env.VITE_APP_VERSION || packageJson.version;

export const LOCAL_STORAGE_KEYS = {
  CUSTOM_USER: "customUser",
};
