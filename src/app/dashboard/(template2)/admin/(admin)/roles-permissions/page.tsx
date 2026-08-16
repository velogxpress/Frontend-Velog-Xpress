
import ComponentCard from "@/private/components/common/ComponentCard";
import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import PermissionForm from "@/private/components/roles-permissions/PermissionForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Agent par Surcursale Velog Xpress ",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function Permissions() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Agent par Surcursale" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Agent par Surcursale">
          <PermissionForm />
        </ComponentCard>
      </div>
    </div>
  );
}
