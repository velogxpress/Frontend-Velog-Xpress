"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/private/context/AuthContext";

import { useSidebar } from "@/private/context/SidebarContext";
import AppHeader from "@/private/layout/AppHeader";
import AppSidebar from "@/private/layout/AppSidebar";
import Backdrop from "@/private/layout/Backdrop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

if (typeof window !== "undefined") {
    require("bootstrap/dist/js/bootstrap");
}

  useEffect(() => {
    if (loading || !user) return;

    const role = user.roles[0]; // Admin | Agent | Client
    const agentAllowedRoutes = [
      "/dashboard/admin/activites",
      "/dashboard/admin/amnisty",
    ];
    const isAgentAllowed = agentAllowedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // 🔁 REDIRECTION PAR RÔLE (UNE SEULE FOIS)
    if (role === "Admin" && pathname === "/dashboard/admin") return;

    if (role === "Agent" && !isAgentAllowed) {
      router.replace("/dashboard/admin/activites");
    }

    if (role === "Client" && !pathname.startsWith("/dashboard/admin/profile")) {
      router.replace("/dashboard/admin/profile");
    }
  }, [user, loading, pathname, router]);

  if (loading) return null;
  if (!user) return null;

  // ⛔️ BLOQUER ACCÈS NON AUTORISÉ
  const role = user.roles[0];
  const agentAllowedRoutes = [
    "/dashboard/admin/activites",
    "/dashboard/admin/amnisty",
  ];
  const isAgentAllowed = agentAllowedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (
    (role === "Agent" && !isAgentAllowed) ||
    (role === "Client" && !pathname.startsWith("/dashboard/admin/profile"))
  ) {
    return null;
  }

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[268px]"
    : "lg:ml-[82px]";

  return (
    <div className="min-h-screen xl:flex admin-scope vx-admin-shell">
      <AppSidebar />
      <Backdrop />

      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader />
        <div className="vx-admin-content p-4 mx-auto md:p-6">{children}</div>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          theme="colored"
          style={{ marginTop: "80px" }}
        />
      </div>
    </div>
  );
}
