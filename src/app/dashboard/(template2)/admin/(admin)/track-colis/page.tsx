import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

import TrackForm from "@/private/components/track-colis/TrackForm";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Tableau de bord Velog Xpress - Suivi des colis",
};

export default function Track() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Suivi des colis" />
      <div className="space-y-5 sm:space-y-6">
        <TrackForm />
      </div>
    </div>
  );
}
