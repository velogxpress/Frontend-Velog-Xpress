import PageBreadcrumb from "@/private/components/common/PageBreadCrumb";
import FeedbackInbox from "@/private/components/feedback/FeedbackInbox";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Velog Xpress - Feedback reçus",
  description: "Consultation des feedbacks clients Velog Xpress",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function FeedbackInboxPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Feedback reçus" />
      <div className="space-y-5 sm:space-y-6">
        <FeedbackInbox />
      </div>
    </div>
  );
}
