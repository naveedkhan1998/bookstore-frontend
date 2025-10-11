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
    <div className="flex flex-col h-screen w-full bg-main-primary text-main-text transition-colors duration-300 dark:bg-dark-primary dark:text-dark-text overflow-hidden">
      <PageHeader />

      <div className="flex flex-1 w-full overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto  px-4 lg:px-6">
          <div className="min-h-full m-auto py-6">
            <div className="px-6 py-8 sm:px-8 lg:px-10">{children}</div>
          </div>
        </main>
      </div>

      <footer className="flex-shrink-0 border-t border-gray-200 bg-white py-6 transition-colors duration-300 dark:border-gray-800 dark:bg-dark-secondary">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 lg:px-6">
          <Footer />
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
