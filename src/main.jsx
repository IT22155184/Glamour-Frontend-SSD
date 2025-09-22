import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { SnackbarProvider } from "notistack";
import { initializeAuth } from './utils/auth';

// Ensure axios interceptors are set before any component mounts
initializeAuth();

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SnackbarProvider
    className=''
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <App />
    </SnackbarProvider>
  </BrowserRouter>,
)
