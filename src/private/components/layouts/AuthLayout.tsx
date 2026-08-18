"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, PackageCheck, ShieldCheck } from "lucide-react";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-scope vx-auth-shell">
      <aside className="vx-auth-aside">
        <Link href="/" className="vx-auth-logo"><Image width={144} height={60} src="/assets/img/logo/VELOG-01.svg" alt="Velog Xpress" priority /></Link>
        <div className="vx-auth-message">
          <p>Votre logistique, en un seul endroit</p>
          <h1>Gérez vos envois avec confiance.</h1>
          <span>Suivi, factures, adresse américaine et assistance réunis dans une expérience simple et sécurisée.</span>
          <div className="vx-auth-features"><div><PackageCheck /> Suivi accessible 24/7</div><div><ShieldCheck /> Données et accès protégés</div></div>
        </div>
        <div className="vx-auth-proof"><span><Check /> Support humain</span><span><Check /> Informations transparentes</span></div>
      </aside>
      <main className="vx-auth-main">{children}</main>
    </div>
  );
}
