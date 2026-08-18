import "aos/dist/aos.css";
import "@/styles/template2.scss";
import "@/styles/modern-dashboard.scss";

import DashboardAuthGate from "./DashboardAuthGate";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardAuthGate>{children}</DashboardAuthGate>;
}
