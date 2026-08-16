import ComponentCard from "@/private/components/common/ComponentCard";
import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

import ReceptionForm from "@/private/components/recevoir-commandes/ReceptionForm";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Tableau de bord Velog Xpress - Reception des Commandes",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function Reception() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Reception des Commandes" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Recevoir les Commandes">
          <ReceptionForm />
        </ComponentCard>
      </div>
    </div>
  );
}
