import { ReactNode } from "react";
import PageHeader from "./PageHeader";
import Sidebar from "../components/Sidebar";
import Footer from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * MainLayout - Unified layout component wrapping common UI elements
 * 
 * This component provides consistent structure across all pages including:
 * - PageHeader (navigation, search, cart, profile)
 * - Sidebar (navigation menu)
 * - Main content area with rounded card styling
 * - Footer with credits
 */
const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-main-primary text-main-text transition-colors duration-300 dark:bg-dark-primary dark:text-dark-text">
      <PageHeader />

      <div className="mx-auto flex w-full flex-1 items-start gap-8 px-4 pb-16 pt-10 lg:px-12">
        <Sidebar />

        <main className="flex-1">
          <div className="min-h-[70vh] rounded-[28px] border border-gray-200 bg-main-secondary shadow-[0_35px_80px_-45px_rgba(47,41,36,0.45)] transition-colors duration-300 dark:border-gray-800 dark:bg-dark-secondary/90">
            <div className="px-6 py-8 sm:px-10 lg:px-12">
              {children}
            </div>
          </div>
        </main>
      </div>

      <footer className="border-t border-gray-200/60 bg-main-secondary/70 py-8 transition-colors duration-300 dark:border-gray-800/60 dark:bg-dark-secondary">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 lg:px-12">
          <Footer />
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
