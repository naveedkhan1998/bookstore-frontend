import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const access_token: string | null | undefined =
    useAppSelector(getCurrentToken);

  if (!access_token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
