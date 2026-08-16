import ComponentCard from "@/private/components/common/ComponentCard";
import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

import EmbarquementForm from "@/private/components/embarquement/EmbarquementForm";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Tableau de bord Velog Xpress - Embarquement",
    icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function Embarquement() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Embarquement" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Embarquement">
          <EmbarquementForm />
        </ComponentCard>
      </div>
    </div>
  );
}
