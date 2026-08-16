import ComponentCard from "@/private/components/common/ComponentCard";
import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

import AssuranceForm from "@/private/components/assurance/AssuranceForm";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Tableau de bord Velog Xpress - Frais d'assurance",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function Alerts() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Frais d'assurance" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Créer un frais d'assurance">
          <AssuranceForm />
        </ComponentCard>
      </div>
    </div>
  );
}
