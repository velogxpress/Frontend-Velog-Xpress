import { Metadata } from "next";
import Verify from "@/private/components/auth/Verify";
import AuthLayout from "@/private/components/layouts/AuthLayout";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Inscrivez-vous à Velog Xpress",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function VerifyOtp() {
  return (
    <AuthLayout>
      <Verify />
    </AuthLayout>
  );
}
