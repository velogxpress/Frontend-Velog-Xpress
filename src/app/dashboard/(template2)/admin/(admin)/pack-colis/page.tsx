import ComponentCard from "@/private/components/common/ComponentCard";
import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

import PackColisForm from "@/private/components/pack-colis/PackColisForm";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Tableau de bord Velog Xpress - Pack Colis",
    icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function PackColis() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Pack Colis" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Pack Colis">
          <PackColisForm />
        </ComponentCard>
      </div>
    </div>
  );
}
