import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/app/store/hooks";
import { getCurrentToken } from "@/features/auth/authSlice";

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
