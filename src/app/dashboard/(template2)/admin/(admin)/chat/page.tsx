
import { Metadata } from "next";
import React from "react";
import ChatForm from "@/private/components/chat/ChatForm";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Service Support Velog Xpress ",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function Chat() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Email Campaign Dashboard
        </h3>
        <div className="space-y-6">
          <ChatForm />
        </div>
      </div>
    </div>
  );
}
