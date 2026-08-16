import ComponentCard from "@/private/components/common/ComponentCard";
import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

import FeepoundForm from "@/private/components/fepounds/FeepoundForm";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Tableau de bord Velog Xpress - Frais par livre",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function Alerts() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Frais par livre" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Créer un frais par livre">
          <FeepoundForm />
        </ComponentCard>
      </div>
    </div>
  );
}
