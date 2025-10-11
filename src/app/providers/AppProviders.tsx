import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { DarkModeProvider } from "@/shared/context/DarkModeContext";

export const AppProviders = ({ children }: PropsWithChildren) => (
  <Provider store={store}>
    <DarkModeProvider>{children}</DarkModeProvider>
  </Provider>
);

export default AppProviders;
