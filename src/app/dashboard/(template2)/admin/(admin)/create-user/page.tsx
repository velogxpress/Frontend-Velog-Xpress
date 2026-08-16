
import ComponentCard from "@/private/components/common/ComponentCard";
import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import UtilisateurForm from "@/private/components/create-user/UtilisateurForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Create User Velog Xpress ",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function Utilisateur() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Utilisateur" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Roles & Permissions">
          <UtilisateurForm />
        </ComponentCard>
      </div>
    </div>
  );
}
