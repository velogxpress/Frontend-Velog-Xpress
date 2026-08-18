"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  Boxes, ChevronDown, CircleDollarSign, CircleHelp, ClipboardCheck, Gauge,
  Inbox, LayoutDashboard, ListChecks, MailOpen, MapPin, MapPinned,
  MessageSquareText, MessagesSquare, Package, PackagePlus, PackageSearch,
  PlaneTakeoff, ReceiptText, Scale, Settings2, ShieldCheck, Tags, Truck,
  UserPlus, UserRound, UsersRound, Warehouse,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSidebar } from "@/private/context/SidebarContext";
import { countUnreadFeedBack } from "@/services/FeedBackService";

type AccessType = "Admin" | "Agent" | "Client";
type NavItem = { name: string; path: string; icon: LucideIcon; access: AccessType[]; badge?: "feedback" };
type NavGroup = { name: string; icon: LucideIcon; access: AccessType[]; items: NavItem[] };

const groups: NavGroup[] = [
  { name: "Configurations", icon: Settings2, access: ["Admin", "Agent"], items: [
    { name: "Villes", path: "/dashboard/admin/ville", icon: MapPin, access: ["Admin"] },
    { name: "Catégories", path: "/dashboard/admin/categorie", icon: Tags, access: ["Admin", "Agent"] },
    { name: "Frais d’assurance", path: "/dashboard/admin/assurance", icon: ShieldCheck, access: ["Admin"] },
    { name: "Frais par livre", path: "/dashboard/admin/fepounds", icon: Scale, access: ["Admin"] },
    { name: "Frais spéciaux", path: "/dashboard/admin/specialfees", icon: CircleDollarSign, access: ["Admin"] },
    { name: "Taux du jour", path: "/dashboard/admin/taux", icon: Gauge, access: ["Admin"] },
    { name: "Tableau des frais", path: "/dashboard/admin/frais", icon: ListChecks, access: ["Admin"] },
  ]},
  { name: "Paramètres", icon: MapPinned, access: ["Admin"], items: [
    { name: "Adresse d’expédition", path: "/dashboard/admin/shipping-address", icon: MapPinned, access: ["Admin"] },
    { name: "Succursales", path: "/dashboard/admin/surcursale", icon: Warehouse, access: ["Admin"] },
  ]},
  { name: "Processus", icon: Boxes, access: ["Admin", "Agent", "Client"], items: [
    { name: "Créer commandes", path: "/dashboard/admin/commande", icon: PackagePlus, access: ["Admin", "Agent"] },
    { name: "Recevoir commandes", path: "/dashboard/admin/recevoir-commandes", icon: Inbox, access: ["Admin", "Agent"] },
    { name: "Check-in", path: "/dashboard/admin/checkin", icon: ClipboardCheck, access: ["Admin", "Agent"] },
    { name: "Storage", path: "/dashboard/admin/storage", icon: Warehouse, access: ["Admin", "Agent"] },
    { name: "Facture", path: "/dashboard/admin/facture", icon: ReceiptText, access: ["Admin", "Agent"] },
    { name: "Contrôle facture", path: "/dashboard/admin/controle-facture", icon: ShieldCheck, access: ["Admin", "Agent"] },
    { name: "Colis Amnisty", path: "/dashboard/admin/amnisty", icon: Package, access: ["Admin", "Agent"] },
    { name: "Colis clients", path: "/dashboard/admin/colis-clients", icon: Boxes, access: ["Admin", "Agent"] },
    { name: "Livraison", path: "/dashboard/admin/livraison", icon: Truck, access: ["Admin", "Agent"] },
    { name: "Track colis", path: "/dashboard/admin/track-colis", icon: PackageSearch, access: ["Admin", "Agent", "Client"] },
    { name: "Mes colis", path: "/dashboard/admin/mes-colis", icon: Package, access: ["Admin", "Agent", "Client"] },
  ]},
  { name: "Ressources humaines", icon: UsersRound, access: ["Admin", "Agent"], items: [
    { name: "Créer utilisateur", path: "/dashboard/admin/create-user", icon: UserPlus, access: ["Admin", "Agent"] },
    { name: "Rôles et permissions", path: "/dashboard/admin/roles-permissions", icon: UsersRound, access: ["Admin"] },
  ]},
  { name: "Conversations", icon: MessageSquareText, access: ["Admin", "Agent", "Client"], items: [
    { name: "Envoyer un feedback", path: "/dashboard/admin/feedback", icon: MessageSquareText, access: ["Client"] },
    { name: "Feedback reçus", path: "/dashboard/admin/feedback-inbox", icon: MailOpen, access: ["Admin", "Agent"], badge: "feedback" },
    { name: "Chat", path: "/dashboard/admin/chat", icon: MessagesSquare, access: ["Admin", "Agent"] },
  ]},
  { name: "Shipping", icon: PlaneTakeoff, access: ["Admin", "Agent"], items: [
    { name: "Pack colis", path: "/dashboard/admin/pack-colis", icon: Boxes, access: ["Admin", "Agent"] },
    { name: "Embarquement", path: "/dashboard/admin/embarquement", icon: PlaneTakeoff, access: ["Admin", "Agent"] },
    { name: "Packing consultation", path: "/dashboard/admin/packing", icon: ListChecks, access: ["Admin", "Agent"] },
  ]},
];

const getAccess = (): AccessType | null => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return null;
  try {
    const role = jwtDecode<{ role?: string }>(token).role?.toUpperCase();
    if (role === "ADMIN") return "Admin";
    if (role === "AGENT") return "Agent";
    if (role === "CLIENT") return "Client";
  } catch { return null; }
  return null;
};

export default function AppSidebar() {
  const pathname = usePathname();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar();
  const [access, setAccess] = useState<AccessType | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [unread, setUnread] = useState(0);
  const showLabels = isExpanded || isHovered || isMobileOpen;

  useEffect(() => setAccess(getAccess()), []);

  const refreshUnread = useCallback(() => {
    if (access === "Admin" || access === "Agent") countUnreadFeedBack().then((response) => setUnread(Number(response.data) || 0)).catch(() => setUnread(0));
  }, [access]);

  useEffect(() => {
    refreshUnread();
    window.addEventListener("feedback-notifications-updated", refreshUnread);
    return () => window.removeEventListener("feedback-notifications-updated", refreshUnread);
  }, [refreshUnread]);

  const visibleGroups = useMemo(() => !access ? [] : groups.filter((group) => group.access.includes(access)).map((group) => ({ ...group, items: group.items.filter((item) => item.access.includes(access)) })).filter((group) => group.items.length), [access]);

  useEffect(() => {
    const active = visibleGroups.find((group) => group.items.some((item) => pathname.startsWith(item.path)));
    if (active) setOpenGroup(active.name);
  }, [pathname, visibleGroups]);

  const homePath = access === "Admin" ? "/dashboard/admin" : access === "Agent" ? "/dashboard/admin/activites" : "/dashboard/admin/profile";

  return (
    <aside className={`vx-admin-sidebar ${showLabels ? "is-wide" : "is-compact"} ${isMobileOpen ? "is-mobile-open" : ""}`} onMouseEnter={() => !isExpanded && setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="vx-sidebar-head"><Link href={homePath} className="vx-sidebar-logo"><Image src="/assets/img/logo/VELOG-01.svg" alt="Velog Xpress" width={144} height={60} priority /></Link></div>
      {showLabels && <div className="vx-workspace"><small>Espace actif</small><strong>{access === "Admin" ? "Administration" : access === "Agent" ? "Opérations" : "Espace client"} · Velog Xpress</strong></div>}
      <nav className="vx-sidebar-nav" aria-label="Navigation du portail">
        {access === "Admin" && <><p className="vx-nav-label">Vue générale</p><Link className={`vx-sidebar-link ${pathname === "/dashboard/admin" ? "active" : ""}`} href="/dashboard/admin" title="Tableau de bord"><span><LayoutDashboard size={18} /></span>{showLabels && <b>Tableau de bord</b>}</Link></>}
        {access === "Agent" && <><p className="vx-nav-label">Vue générale</p><Link className={`vx-sidebar-link ${pathname.includes("/activites") ? "active" : ""}`} href="/dashboard/admin/activites" title="Activités"><span><Gauge size={18} /></span>{showLabels && <b>Activités</b>}</Link></>}
        {visibleGroups.map((group) => {
          const Icon = group.icon;
          const isOpen = openGroup === group.name;
          return <div className={`vx-sidebar-group ${isOpen ? "open" : ""}`} key={group.name}><button type="button" onClick={() => setOpenGroup(isOpen ? null : group.name)} title={group.name}><span><Icon size={18} /></span>{showLabels && <><b>{group.name}</b><ChevronDown className="vx-group-chevron" size={15} /></>}</button>{showLabels && <div className="vx-sidebar-subnav">{group.items.map((item) => { const ItemIcon = item.icon; const active = pathname.startsWith(item.path); return <Link className={`vx-sidebar-link ${active ? "active" : ""}`} href={item.path} key={item.path} onClick={() => isMobileOpen && toggleMobileSidebar()}><span><ItemIcon size={16} /></span><b>{item.name}</b>{item.badge === "feedback" && unread > 0 && <em>{unread > 99 ? "99+" : unread}</em>}</Link>; })}</div>}</div>;
        })}
      </nav>
      <div className="vx-sidebar-footer"><Link href={access === "Client" ? "/support" : "/dashboard/admin/support"} className="vx-sidebar-link"><span><CircleHelp size={18} /></span>{showLabels && <b>Aide et support</b>}</Link><Link href="/dashboard/admin/profile" className="vx-sidebar-link"><span><UserRound size={18} /></span>{showLabels && <b>Mon profil</b>}</Link></div>
    </aside>
  );
}
