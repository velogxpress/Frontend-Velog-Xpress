import ComponentCard from "@/private/components/common/ComponentCard";
import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

import CommandeForm from "@/private/components/commande/CommandeForm";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Tableau de bord Velog Xpress - Commande",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function Commande() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Commande" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Registre des commandes">
          <CommandeForm />
        </ComponentCard>
      </div>
    </div>
  );
}
