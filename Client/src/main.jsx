import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e1e1e",
            color: "#ffffff",
            fontWeight: "500",
            borderRadius: "10px",
            padding: "14px 16px",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#1e1e1e",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#1e1e1e",
            },
          },
        }}
        reverseOrder={false}
      />
 
  </StrictMode>
);
