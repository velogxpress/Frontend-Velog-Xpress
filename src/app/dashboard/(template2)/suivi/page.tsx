import { Metadata } from "next";
import SuiviForm from "@/private/components/auth/SuiviForm";
// import AuthLayout from "@/private/components/layouts/AuthLayouts";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Inscrivez-vous à Velog Xpress",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function Suivi() {
  return (
    // <AuthLayout>
      <SuiviForm />
    // </AuthLayout>
  );
}
