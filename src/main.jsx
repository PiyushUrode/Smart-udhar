import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./App.jsx";
import { AuthProvider } from "./user/context/AuthContext.jsx";
import { store } from "./reactStore/store.js";   // ✅ store import
import { Provider } from "react-redux";          // ✅ redux Provider import

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";

import './index.css';
import './user/Styles/login.css';
import './user/common/i18n'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>     {/* ✅ Redux wrap */}
      <AuthProvider>             {/* ✅ Auth wrap */}
        <ToastContainer />
        <App />
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);
