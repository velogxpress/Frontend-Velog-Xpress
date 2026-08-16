// import UserAddressCard from "@/private/components/user-profile/UserAddressCard";
// import UserAuthCard from "@/private/components/user-profile/UserAuthCard";
// import UserInfoCard from "@/private/components/user-profile/UserInfoCard";
// import UserMetaCard from "@/private/components/user-profile/UserMetaCard";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Historique Velog Xpress ",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function Historique() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Historique
        </h3>
        <div className="space-y-6">
          <h1>Historique Section Coming Soon</h1>
          {/* <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard />
          <UserAuthCard /> */}
        </div>
      </div>
    </div>
  );
}
