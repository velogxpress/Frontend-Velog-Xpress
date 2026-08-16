"use client";

import { useAuth } from "@/private/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";

export default function DashboardAuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isSigninPage = pathname === "/dashboard/signin";
  const isSignupPage = pathname === "/dashboard/signup";
  const isRecoveryPage = pathname === "/dashboard/recovery";
  const isVerifyOtpPage = pathname === "/dashboard/verifyotp";
  const isChangepwrdPage = pathname === "/dashboard/changepwrd";
  const isSuiviPage = pathname === "/dashboard/suivi";
  const isResetPasswordPage = pathname === "/dashboard/reset-password";

  useEffect(() => {
    document.body.classList.add("dashboard-scope");

    return () => {
      document.body.classList.remove("dashboard-scope");
    };
  }, []);

  useEffect(() => {
    if (
      !loading &&
      !user &&
      !isSigninPage &&
      !isSignupPage &&
      !isRecoveryPage &&
      !isVerifyOtpPage &&
      !isChangepwrdPage &&
      !isSuiviPage &&
      !isResetPasswordPage
    ) {
      router.replace("/dashboard/signin");
    }
  }, [
    user,
    loading,
    router,
    isSigninPage,
    isSignupPage,
    isRecoveryPage,
    isVerifyOtpPage,
    isChangepwrdPage,
    isSuiviPage,
    isResetPasswordPage,
  ]);

  if (loading) return null;

  if (
    !user &&
    !isSigninPage &&
    !isSignupPage &&
    !isRecoveryPage &&
    !isVerifyOtpPage &&
    !isChangepwrdPage &&
    !isSuiviPage &&
    !isResetPasswordPage
  ) {
    return null;
  }

  return <>{children}</>;
}
