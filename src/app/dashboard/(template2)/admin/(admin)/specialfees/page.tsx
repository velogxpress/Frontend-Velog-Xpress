import ComponentCard from "@/private/components/common/ComponentCard";
import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

import SpecialFeeForm from "@/private/components/specialfees/SpecialFeeForm";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Tableau de bord Velog Xpress - Frais special",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function Alerts() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Frais special" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Créer un frais special">
          <SpecialFeeForm />
        </ComponentCard>
      </div>
    </div>
  );
}
