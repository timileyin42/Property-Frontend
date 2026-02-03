import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/chart.js";
import {AuthProvider} from "./context/AuthContext"


// 
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/*<ProductsProvider products={Products}>*/}
    <AuthProvider>
      {/* working */}
      <App />
    </AuthProvider>

    {/*</ProductsProvider>*/}
  </React.StrictMode>
);
