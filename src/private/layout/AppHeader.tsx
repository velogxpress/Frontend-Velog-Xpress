"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Menu, Moon, Search, Sun } from "lucide-react";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import NotificationDropdown from "@/private/components/header/NotificationDropdown";
import UserDropdown from "@/private/components/header/UserDropdown";
import { useSidebar } from "@/private/context/SidebarContext";
import { useTheme } from "@/private/context/ThemeContext";

const routes = [
  ["Tableau de bord", "/dashboard/admin"], ["Activités", "/dashboard/admin/activites"], ["Commandes", "/dashboard/admin/commande"],
  ["Check-in", "/dashboard/admin/checkin"], ["Storage", "/dashboard/admin/storage"], ["Factures", "/dashboard/admin/facture"],
  ["Livraison", "/dashboard/admin/livraison"], ["Track colis", "/dashboard/admin/track-colis"], ["Mes colis", "/dashboard/admin/mes-colis"],
  ["Colis clients", "/dashboard/admin/colis-clients"], ["Profil", "/dashboard/admin/profile"], ["Chat", "/dashboard/admin/chat"],
  ["Embarquement", "/dashboard/admin/embarquement"], ["Pack colis", "/dashboard/admin/pack-colis"], ["Support", "/dashboard/admin/support"],
];

export default function AppHeader() {
  const router = useRouter();
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const [role, setRole] = useState("");
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) { try { setRole(jwtDecode<{ role?: string }>(token).role?.toUpperCase() || ""); } catch { setRole(""); } }
    const handleKey = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); inputRef.current?.focus(); } };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const handleToggle = () => window.innerWidth >= 1024 ? toggleSidebar() : toggleMobileSidebar();
  const homePath = role === "ADMIN" ? "/dashboard/admin" : role === "AGENT" ? "/dashboard/admin/activites" : "/dashboard/admin/profile";
  const searchResults = query.trim() ? routes.filter(([label]) => label.toLowerCase().includes(query.toLowerCase())).slice(0, 6) : [];
  const handleSearch = (event: FormEvent) => { event.preventDefault(); if (searchResults[0]) { router.push(searchResults[0][1]); setQuery(""); } };

  return (
    <header className="vx-admin-header">
      <div className="vx-admin-header-main">
        <button className="vx-header-icon" onClick={handleToggle} aria-label={isMobileOpen ? "Fermer la navigation" : "Ouvrir la navigation"}><Menu size={19} /></button>
        <Link href={homePath} className="vx-mobile-logo"><Image src="/assets/img/logo/VELOG-01.svg" alt="Velog Xpress" width={130} height={48} /></Link>
        <form className="vx-admin-search" onSubmit={handleSearch}>
          <Search size={18} aria-hidden="true" /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher une page, un colis, une facture…" aria-label="Rechercher dans le portail" /><kbd>⌘ K</kbd>
          {searchResults.length > 0 && <div className="vx-search-results">{searchResults.map(([label, href]) => <Link href={href} key={href} onClick={() => setQuery("")}><Search size={14} /><span>{label}</span><small>Ouvrir →</small></Link>)}</div>}
        </form>
        <div className="vx-admin-actions">
          <button className="vx-header-icon" type="button" onClick={toggleTheme} aria-label={theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
          {(role === "ADMIN" || role === "AGENT") && <NotificationDropdown />}
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
