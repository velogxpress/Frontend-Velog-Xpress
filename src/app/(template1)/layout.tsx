import "../../styles/index.scss";
import "../../styles/modern-public.scss";
import type { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "velogxpress.com";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  const title = "Velog Xpress — Transport simple, suivi transparent";
  const description = "Transport aérien et maritime entre les États-Unis et Haïti avec un suivi clair à chaque étape.";

  return {
    metadataBase,
    title: { default: title, template: "%s | Velog Xpress" },
    description,
    icons: { icon: "/favicon.png", shortcut: "/favicon.png", apple: "/favicon.png" },
    openGraph: { title, description, type: "website", url: "/", images: [{ url: "/og.png", width: 1734, height: 907, alt: "Velog Xpress — transport entre les États-Unis et Haïti" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  };
}
export default function Template1Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
