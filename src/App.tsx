import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Toast from "./components/ToastContainer";
import PageHeader from "./layouts/PageHeader";
import Sidebar from "./components/Sidebar";
import Footer from "./layouts/Footer";
import { useAppSelector } from "./app/hooks";
import { getCurrentToken } from "./features/authSlice";
import SidebarProvider from "./context/SidebarContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load components for better performance
import { lazy, Suspense } from "react";
const BooksList = lazy(() => import("./components/BooksList"));
const CartPage = lazy(() => import("./pages/CartPage"));
const OrderHistoryPage = lazy(() => import("./pages/OrderHistoryPage"));
const UserSettings = lazy(() => import("./pages/UserSettingPage"));
const UserProfile = lazy(() => import("./pages/UserProfilePage"));
const BookPage = lazy(() => import("./pages/BookPage"));
const LoginReg = lazy(() => import("./components/LoginReg"));
const BooklistPageAuth = lazy(() => import("./pages/BooklistPageAuth"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const UserBooklistPage = lazy(() => import("./pages/UserBooklistPage"));
const PublicBooklistsPage = lazy(() => import("./pages/PublicBooklistsPage"));
const PublicBookPage = lazy(() => import("./pages/PublicBookPage"));
const AuthentiatedBooklistPage = lazy(
  () => import("./pages/AuthenticatedBooklistPage"),
);
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderItemsPage = lazy(() => import("./pages/OrderItemsPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const AdminUserPage = lazy(() => import("./pages/AdminUserPage"));
const ItemPage = lazy(() => import("./pages/ItemPage"));
const Login = lazy(() => import("./components/Login"));
const Registration = lazy(() => import("./components/Registration"));
// Route configurations
const routes = [
  { path: "/", element: <BooksList /> },
  { path: "/auth", element: <LoginReg /> },
  { path: "/login", element: <Login /> },
  { path: "/registration", element: <Registration /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/home", element: <BooksList />, protected: true },
  { path: "/cart", element: <CartPage />, protected: true },
  { path: "/account", element: <UserProfile />, protected: true },
  { path: "/order-history", element: <OrderHistoryPage />, protected: true },
  { path: "/order-items", element: <OrderItemsPage />, protected: true },
  { path: "/checkout", element: <CheckoutPage />, protected: true },
  { path: "/admin", element: <AdminPage />, protected: true },
  { path: "/admin-user-page", element: <AdminUserPage />, protected: true },
  { path: "/booklists", element: <BooklistPageAuth />, protected: true },
  {
    path: "/user-booklist/:id",
    element: <UserBooklistPage />,
    protected: true,
  },
  { path: "/book/:id", element: <BookPage />, protected: false },
  { path: "/item/:id", element: <ItemPage />, protected: true },
  { path: "/setting", element: <UserSettings />, protected: true },
];

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

function App() {
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
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {routes.map(({ path, element, protected: isProtected }) => (
                      <Route
                        key={path}
                        path={path}
                        element={
                          isProtected ? (
                            <ProtectedRoute>{element}</ProtectedRoute>
                          ) : (
                            element
                          )
                        }
                      />
                    ))}

                    {/* Special route that depends on auth state */}
                    <Route
                      path="/public-booklists"
                      element={
                        access_token ? (
                          <AuthentiatedBooklistPage />
                        ) : (
                          <PublicBooklistsPage />
                        )
                      }
                    />
                    <Route
                      path="/public-booklist"
                      element={<PublicBookPage />}
                    />
                  </Routes>
                </Suspense>
              </div>
            </main>
          </div>
          <footer className="fixed bottom-0 w-full">
            <div className="bg-main-secondary dark:bg-dark-secondary bg-opacity-90">
              <Footer />
            </div>
          </footer>
        </div>
        <Toast />
      </SidebarProvider>
    </Router>
  );
}

export default App;
