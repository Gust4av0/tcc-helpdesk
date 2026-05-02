import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";

import { ToastProvider } from "./components/Toast/ToastContext";
import { ToastContainer } from "./components/Toast/ToastContainer";

createRoot(document.getElementById("root")!).render(
  <ToastProvider>
    <App />
    <ToastContainer />
  </ToastProvider>
);