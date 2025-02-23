import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SidebarProvider from "../context/SidebarContext";
import PageHeader from "../layouts/PageHeader";
import Sidebar from "../components/Sidebar";
import Footer from "../layouts/Footer";
import ItemPage from "./ItemPage";
import BooksList from "../components/BooksList";
import CartPage from "./CartPage";
import OrderHistoryPage from "./OrderHistoryPage";
import UserSettings from "./UserSettingPage";
import UserProfile from "./UserProfilePage";
import BookPage from "./BookPage";
import LoginReg from "../components/LoginReg";
import BooklistPageAuth from "./BooklistPageAuth";
import { useAppSelector } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import AboutPage from "./AboutPage";
import UserBooklistPage from "./UserBooklistPage";
import PublicBooklistsPage from "./PublicBooklistsPage";
import PublicBookPage from "./PublicBookPage";
import AuthentiatedBooklistPage from "./AuthenticatedBooklistPage";
import CheckoutPage from "./CheckoutPage";
import OrderItemsPage from "./OrderItemsPage";
import AdminPage from "./AdminPage";
import AdminUserPage from "./AdminUserPage";

const MainPage = () => {
  const access_token = useAppSelector(getCurrentToken);

  return (
    <Router>
      <SidebarProvider>
        <div className="flex flex-col h-screen bg-main-primary dark:bg-dark-primary text-main-text dark:text-dark-text">
          <PageHeader />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              <div className="min-h-full px-8 pb-20">
                <Routes>
                  <Route path="/" element={<BooksList />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/account" element={<UserProfile />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/order-history" element={<OrderHistoryPage />} />
                  <Route path="/order-items" element={<OrderItemsPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/admin-user-page" element={<AdminUserPage />} />
                  <Route path="/public-booklists" element={access_token ? <AuthentiatedBooklistPage /> : <PublicBooklistsPage />} />
                  <Route path="/public-booklist" element={<PublicBookPage />} />
                  <Route path="/booklists" element={<BooklistPageAuth />} />
                  <Route path="/user-booklist/:id" element={<UserBooklistPage />} />
                  <Route path="/book/:id" element={<BookPage />} />
                  <Route path="/item/:id" element={<ItemPage />} />
                  <Route path="/setting" element={<UserSettings />} />
                  <Route path="/login" element={<LoginReg />} />
                </Routes>
              </div>
            </main>
          </div>
          <footer className="fixed bottom-0 w-full">
            <div className="bg-main-secondary dark:bg-dark-secondary bg-opacity-90">
              <Footer />
            </div>
          </footer>
        </div>
      </SidebarProvider>
    </Router>
  );
};

export default MainPage;
