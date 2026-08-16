import ComponentCard from "@/private/components/common/ComponentCard";
import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

import SurcursaleForm from "@/private/components/surcursale/Surcursale";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Tableau de bord Velog Xpress - Surcursale",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function Surcursale() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Surcursale" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Créer une surcursale">
          <SurcursaleForm />
        </ComponentCard>
      </div>
    </div>
  );
}
