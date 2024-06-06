import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AptabaseProvider } from "@aptabase/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AptabaseProvider
      appKey="A-SH-1037152567"
      options={{ host: "https://log.rithask.win" }}>
      <App />
    </AptabaseProvider>
  </React.StrictMode>
);
