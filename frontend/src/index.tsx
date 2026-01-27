import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const rootElem = document.getElementById("root");
if (!rootElem) {
  throw Error("Could not find root element in document");
}
const root = ReactDOM.createRoot(rootElem);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
