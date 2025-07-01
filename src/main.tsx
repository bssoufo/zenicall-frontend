import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import "./index.css";

import "./core/translation/i18n.ts";
import "./fontawesome.ts";


import { AppEnv } from "./config/AppEnv.ts";



// 1. Initialize configuration before React
let configLoaded = false;

(async () => {
  try {
    const response = await fetch(`/config.json?v=${Date.now()}`);
    if (!response.ok) throw new Error('Config load failed');
    const config = await response.json();
    
    // Normalize URL
    if (config.API_BASE_URL.endsWith('/')) {
      config.API_BASE_URL = config.API_BASE_URL.slice(0, -1);
    }
    
    Object.assign(AppEnv, config);
  } catch (error) {
    console.warn('Using fallback configuration:', error);
  } finally {
    configLoaded = true;
    startApp();
  }
})();

async function  startApp() {
  import("./index.css");
  import("./core/translation/i18n.ts");
  import("./fontawesome.ts");
  
  const { AuthProvider } = await import("./modules/auth/contexts/AuthProvider.tsx");
  const { ClinicProvider } = await import("./modules/clinics/contexts/ClinicProvider.tsx");
  const { GlobalModalProvider } = await import("./@zenidata/components/GlobalModal/GlobalModal.tsx");
  const AppRoutes = await import("./routes/AppRoutes.tsx").then((module) => module.default);

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <AuthProvider>
        <ClinicProvider>
          <GlobalModalProvider>
            <AppRoutes />
            <Toaster />
          </GlobalModalProvider>
        </ClinicProvider>
      </AuthProvider>
    </StrictMode>
  );
}

// 3. Show loading state while waiting for config
if (!configLoaded) {
  document.getElementById('root')!.innerHTML = `
    <div style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-family: sans-serif;
    ">
      <div class="loading-spinner"></div>
      <p>Loading configuration...</p>
    </div>
  `;
}