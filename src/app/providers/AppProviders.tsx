import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "@/app/store";
import { DarkModeProvider } from "@/shared/context/DarkModeContext";
import SidebarProvider from "@/shared/context/SidebarContext";

export const AppProviders = ({ children }: PropsWithChildren) => (
  <Provider store={store}>
    <DarkModeProvider>
      <SidebarProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </SidebarProvider>
    </DarkModeProvider>
  </Provider>
);

export default AppProviders;
