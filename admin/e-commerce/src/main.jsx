import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ReactDOM } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);