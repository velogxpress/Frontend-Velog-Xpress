import ComponentCard from "@/private/components/common/ComponentCard";
import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

import LivraisonForm from "@/private/components/livraison/LivraisonForm";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Tableau de bord Velog Xpress - Livraison",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function Livraison() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Livraison" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Livraison des colis">
          <LivraisonForm />
        </ComponentCard>
      </div>
    </div>
  );
}
