import ComponentCard from "@/private/components/common/ComponentCard";
import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

import TauxForm from "@/private/components/taux/TauxForm";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Tableau de bord Velog Xpress - Taux du jour",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function Alerts() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Taux du jour" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Créer un taux">
          <TauxForm />
        </ComponentCard>
      </div>
    </div>
  );
}
