import ComponentCard from "@/private/components/common/ComponentCard";
import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

import VilleForm from "@/private/components/ville/VilleForm";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Tableau de bord Velog Xpress - Ville",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function Alerts() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Ville" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Créer une ville">
        <VilleForm />
        </ComponentCard>
      </div>
    </div>
  );
}
