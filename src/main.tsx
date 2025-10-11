import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import { DarkModeProvider } from "./context/DarkModeContext.tsx";


createRoot(document.getElementById("root")!).render(
  <Provider store={store}>

      <DarkModeProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </DarkModeProvider>

  </Provider>,
);
