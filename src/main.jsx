import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from "./context/AuthContext.jsx";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";



import './index.css';

import './Styles/login.css';


import './common/i18n'; 


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <AuthProvider> 
<ToastContainer />
      <App />
      </AuthProvider>
  </React.StrictMode>
);
