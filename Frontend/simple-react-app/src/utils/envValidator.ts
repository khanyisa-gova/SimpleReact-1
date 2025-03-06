// Add type definitions for Vite's environment variables
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export const validateEnvironment = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (!apiUrl) {
    console.error('VITE_API_URL is not defined in environment variables');
    return false;
  }
  
  console.log('Environment validation passed:', { apiUrl });
  return true;
};
