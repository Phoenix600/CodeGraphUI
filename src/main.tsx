import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global ResizeObserver error suppression
const suppressResizeObserverError = () => {
  const handleError = (e: ErrorEvent) => {
    if (e.message && (
      e.message.includes('ResizeObserver loop') || 
      e.message.includes('ResizeObserver loop limit exceeded') ||
      e.message.includes('ResizeObserver loop completed with undelivered notifications')
    )) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  };
  const handleRejection = (e: PromiseRejectionEvent) => {
    if (e.reason && e.reason.message && (
      e.reason.message.includes('ResizeObserver loop') ||
      e.reason.message.includes('ResizeObserver loop limit exceeded') ||
      e.reason.message.includes('ResizeObserver loop completed with undelivered notifications')
    )) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  };
  
  // Also handle window.onerror for string-based errors
  const originalOnError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    if (typeof message === 'string' && (
      message.includes('ResizeObserver loop') ||
      message.includes('ResizeObserver loop limit exceeded') ||
      message.includes('ResizeObserver loop completed with undelivered notifications')
    )) {
      return true; // Suppress the error
    }
    if (originalOnError) {
      return originalOnError(message, source, lineno, colno, error);
    }
    return false;
  };

  window.addEventListener('error', handleError, true);
  window.addEventListener('unhandledrejection', handleRejection, true);
};

suppressResizeObserverError();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
