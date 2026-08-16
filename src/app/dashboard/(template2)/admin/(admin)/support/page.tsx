import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

import SupportForm from "@/private/components/support/SupportForm";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Tableau de bord Velog Xpress - Surcursale",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function Support() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Service Support" />
      <div className="space-y-5 sm:space-y-6">
        <SupportForm />
      </div>
    </div>
  );
}
