import ComponentCard from "@/private/components/common/ComponentCard";
import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

import FactureForm from "@/private/components/facture/FactureForm";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Tableau de bord Velog Xpress - Facture",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function Facture() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Facture" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Créer une facture">
          <FactureForm />
        </ComponentCard>
      </div>
    </div>
  );
}
