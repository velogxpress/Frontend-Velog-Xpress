
import ComponentCard from "@/private/components/common/ComponentCard";
import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import FeedBackForm from "@/private/components/feedback/FeedBackForm";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Create Feedback Velog Xpress ",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function Feedback() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Feedback" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Créer une feedback">
          <FeedBackForm />
        </ComponentCard>
      </div>
    </div>
  );
}
