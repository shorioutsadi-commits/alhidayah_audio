import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Global resilience handlers against unhandled audio/network promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.warn('Al Hidayah Unhandled rejection caught safely:', event.reason);
  event.preventDefault();
});

window.addEventListener('error', (event) => {
  console.warn('Al Hidayah Global error caught safely:', event.error || event.message);
});

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
