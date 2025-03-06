import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { validateEnvironment } from './utils/envValidator'

// Validate environment variables
const envValid = validateEnvironment();
if (!envValid) {
  console.error('Environment validation failed. Check your .env file.');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
