import Unauthorized from "@/private/components/auth/unauthorized";
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

export default function UnauthorizedPage() {
  return (
      <Unauthorized />
  );
}
