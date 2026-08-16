import ComponentCard from "@/private/components/common/ComponentCard";
import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import AmnistyTab from "@/private/components/ecommerce/AmnistyTab";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Tableau de bord Velog Xpress - Colis Amnisty",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function AmnistyPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Colis Amnisty" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Registre des colis amnisty">
          <AmnistyTab />
        </ComponentCard>
      </div>
    </div>
  );
}
