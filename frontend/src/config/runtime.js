export const isDemoMode = import.meta.env.VITE_APP_MODE === "demo" || (import.meta.env.DEV && import.meta.env.VITE_APP_MODE !== "production");
export const isProductionMode = !isDemoMode;
