import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import Loader from './components/loaders/Loaders';

const rootElement = document.getElementById('root');

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <React.StrictMode>
      <BrowserRouter>
        {isLoading ? (
          <Loader />
        ) : (
          <App />
        )}
      </BrowserRouter>
    </React.StrictMode>
  );
};

createRoot(rootElement).render(<Index />);
