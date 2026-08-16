import SignInForm from "@/private/components/auth/SignInForm";
import AuthLayout from "@/private/components/layouts/AuthLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Se connecter à Velog Xpress",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function SignIn() {
  return (
     <AuthLayout>
        <SignInForm />
    </AuthLayout>
  );
}
