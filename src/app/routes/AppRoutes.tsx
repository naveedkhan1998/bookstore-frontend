import { Route, Routes } from "react-router-dom";
import { useAppSelector } from "@/app/store/hooks";
import ProtectedRoute from "@/shared/components/navigation/ProtectedRoute";
import { getCurrentToken } from "@/features/auth/authSlice";
import {
  publicBookRoute,
  publicBooklistsRoute,
  routeConfig,
} from "./routeConfig";

export const AppRoutes = () => {
  const accessToken = useAppSelector(getCurrentToken);
  const AuthenticatedBooklistsPage = publicBooklistsRoute.authenticated;
  const PublicBooklistsPage = publicBooklistsRoute.unauthenticated;
  const PublicBookPage = publicBookRoute.component;

  return (
    <Routes>
      {routeConfig.map(({ path, component: Component, requiresAuth }) => (
        <Route
          key={path}
          path={path}
          element={
            requiresAuth ? (
              <ProtectedRoute>
                <Component />
              </ProtectedRoute>
            ) : (
              <Component />
            )
          }
        />
      ))}

      <Route
        path={publicBooklistsRoute.path}
        element={
          accessToken ? <AuthenticatedBooklistsPage /> : <PublicBooklistsPage />
        }
      />

      <Route path={publicBookRoute.path} element={<PublicBookPage />} />
    </Routes>
  );
};

export default AppRoutes;
