import { Metadata } from "next";
import ChangePage from "@/private/components/auth/ResetPassword";
import AuthLayout from "@/private/components/layouts/AuthLayout";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Inscrivez-vous à Velog Xpress",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function ResetPassword() {
  return (
    <AuthLayout>
      <Suspense fallback={null}>
        <ChangePage />
      </Suspense>
    </AuthLayout>
  );
}
