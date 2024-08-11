import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import reportWebVitals from './reportWebVitals';
import App from './App'
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    
    <ErrorBoundary>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </ErrorBoundary>
  
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


//<React.StrictMode>
//    <App />
//  </React.StrictMode>