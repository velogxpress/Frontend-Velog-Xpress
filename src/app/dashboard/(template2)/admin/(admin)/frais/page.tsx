import ComponentCard from "@/private/components/common/ComponentCard";
import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

import TableaudefraisForm from "@/private/components/frais/Tableaudefrais";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Tableau de bord Velog Xpress - Tableau de Frais",
     icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function Tableaudefrais() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Tableau de Frais" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Créer ule tableau de frais">
          <TableaudefraisForm />
        </ComponentCard>
      </div>
    </div>
  );
}
