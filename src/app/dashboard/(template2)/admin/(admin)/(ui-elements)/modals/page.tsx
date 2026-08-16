import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import DefaultModal from "@/private/components/example/ModalExample/DefaultModal";
import FormInModal from "@/private/components/example/ModalExample/FormInModal";
import FullScreenModal from "@/private/components/example/ModalExample/FullScreenModal";
import ModalBasedAlerts from "@/private/components/example/ModalExample/ModalBasedAlerts";
import VerticallyCenteredModal from "@/private/components/example/ModalExample/VerticallyCenteredModal";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Modals | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Modals page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function Modals() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Modals" />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 xl:gap-6">
        <DefaultModal />
        <VerticallyCenteredModal />
        <FormInModal />
        <FullScreenModal />
        <ModalBasedAlerts />
      </div>
    </div>
  );
}
