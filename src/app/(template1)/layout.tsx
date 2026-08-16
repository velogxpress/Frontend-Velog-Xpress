import "../../styles/index.scss";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Velog Xpress - Transport & Logistics",
    template: "Velog Xpress",
  },
  description: "Suivi et gestion des colis Velog Xpress",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};
export default function Template1Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
