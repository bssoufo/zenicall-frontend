// config.ts
interface AppConfig {
  API_BASE_URL: string;
  RECEPTION_EMAIL_DOMAIN: string;
  MAX_UPLOAD_FILES: number;
  ALLOWED_FILE_TYPES: string;
}

// Initial defaults (will be overwritten)
export const AppEnv: AppConfig = {
  API_BASE_URL: "http://localhost:8000",
  RECEPTION_EMAIL_DOMAIN: "",
  MAX_UPLOAD_FILES: 10,
  ALLOWED_FILE_TYPES: ""
};

