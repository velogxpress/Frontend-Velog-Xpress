import ComponentCard from "@/private/components/common/ComponentCard";
import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

import PackingForm from "@/private/components/packing/PackingForm";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Tableau de bord Velog Xpress - Packing Consultation",
    icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function PackingConsultation() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Packing Consultation" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Packing Consultation">
          <PackingForm />
        </ComponentCard>
      </div>
    </div>
  );
}
