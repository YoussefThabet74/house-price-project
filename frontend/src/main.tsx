import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

/**
 * Main Application Entry Point
 *
 * Mounts the root React application component into the HTML DOM element with id 'root'.
 * Wraps the application inside React.StrictMode for highlighting potential problems
 * and enforcing best practices during development.
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Render the core root App component */}
    <App />
  </React.StrictMode>,
);
