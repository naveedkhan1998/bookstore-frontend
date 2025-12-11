import { Route, Routes } from "react-router-dom";
import { useAppSelector } from "@/app/store/hooks";
import ProtectedRoute from "@/shared/components/navigation/ProtectedRoute";
import { getCurrentToken } from "@/features/auth/authSlice";
import {
  publicBookRoute,
  publicBooklistsRoute,
  publicRoutes,
  protectedRoutes,
} from "./routeConfig";

export const AppRoutes = () => {
  const accessToken = useAppSelector(getCurrentToken);
  const AuthenticatedBooklistsPage = publicBooklistsRoute.authenticated;
  const PublicBooklistsPage = publicBooklistsRoute.unauthenticated;
  const PublicBookPage = publicBookRoute.component;

  return (
    <Routes>
      {publicRoutes.map(({ path, component: Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}

      {protectedRoutes.map(({ path, component: Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute>
              <Component />
            </ProtectedRoute>
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
