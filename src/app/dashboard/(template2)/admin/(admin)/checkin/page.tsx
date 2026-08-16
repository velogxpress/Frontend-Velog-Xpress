import ComponentCard from "@/private/components/common/ComponentCard";
import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

import CheckInForm from "@/private/components/checkin/CheckInForm";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Tableau de bord Velog Xpress - Check-In",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function CheckIn() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Check-In" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Entrer des colis disponibles">
          <CheckInForm />
        </ComponentCard>
      </div>
    </div>
  );
}
