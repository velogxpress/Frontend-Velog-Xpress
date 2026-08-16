
import ComponentCard from "@/private/components/common/ComponentCard";
import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import ControleFactureForm from "@/private/components/controle-facture/ControleFactureForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Controle Facture Velog Xpress ",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function ControleFacture() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Controle Facture" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Controle Facture">
          <ControleFactureForm />
        </ComponentCard>
      </div>
    </div>
  );
}
