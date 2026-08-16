import { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

import { useAuth } from "@/private/context/AuthContext";

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const { token, logout } = useAuth();

  if (!token) {
    window.location.href = "/dashboard/signin";
    return null;
  }

  const decoded: any = jwtDecode(token);

  if (decoded.exp && decoded.exp * 1000 < Date.now()) {
    logout();
    window.location.href = "/dashboard/signin";
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute; // <<======= OBLIGATWA
