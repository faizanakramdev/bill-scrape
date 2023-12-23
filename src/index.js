import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/styles.scss";
import 'react-phone-number-input/style.css';
import 'react-tabs/style/react-tabs.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
     <App />
      <ToastContainer autoClose={3000} />
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
