import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Toast from "@/shared/components/feedback/ToastContainer";
import SidebarProvider from "@/shared/context/SidebarContext";
import MainLayout from "@/shared/layouts/MainLayout";

const LoadingFallback = () => (
  <div className="flex h-64 items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-secondary" />
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <MainLayout>
          <Suspense fallback={<LoadingFallback />}>
            <AppRoutes />
          </Suspense>
        </MainLayout>
        <Toast />
      </SidebarProvider>
    </BrowserRouter>
  );
};

export default App;
