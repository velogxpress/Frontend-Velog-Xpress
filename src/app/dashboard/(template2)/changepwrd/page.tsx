import { Metadata } from "next";
import ChangePage from "@/private/components/auth/Changepwrd";
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

export default function Changepwrd() {
  return (
    <AuthLayout>
      <ChangePage />
    </AuthLayout>
  );
}
