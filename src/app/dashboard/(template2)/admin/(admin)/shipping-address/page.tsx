import ComponentCard from "@/private/components/common/ComponentCard";
import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

import AddressForm from "@/private/components/shipping-address/Address";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Tableau de bord Velog Xpress - Adresse de livraison",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function Address() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Adresse de livraison" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Créer une adresse de livraison">
          <AddressForm />
        </ComponentCard>
      </div>
    </div>
  );
}
