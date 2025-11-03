import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const registerServiceWorker = () => {
  // Using an absolute path from the origin ensures the SW is registered correctly,
  // avoiding cross-origin issues. This, combined with correct timing,
  // resolves the "invalid state" error.
  const swUrl = `${window.location.origin}/service-worker.js`;
  navigator.serviceWorker.register(swUrl)
    .then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    })
    .catch(error => {
      console.log('ServiceWorker registration failed: ', error);
    });
};

if ('serviceWorker' in navigator) {
  // The 'load' event might have already fired if the script is loaded asynchronously.
  // We check the document.readyState to handle this case and ensure registration
  // happens only when the page is fully ready.
  if (document.readyState === 'complete') {
    registerServiceWorker();
  } else {
    window.addEventListener('load', registerServiceWorker);
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
