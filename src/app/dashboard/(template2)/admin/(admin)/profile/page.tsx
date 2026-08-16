import UserAddressCard from "@/private/components/user-profile/UserAddressCard";
import UserAuthCard from "@/private/components/user-profile/UserAuthCard";
import UserInfoCard from "@/private/components/user-profile/UserInfoCard";
import UserMetaCard from "@/private/components/user-profile/UserMetaCard";
import ShippingAddressFaq from "@/private/components/user-profile/ShippingAddressFaq";
import { Metadata } from "next";
import React from "react";
import { CircleUserRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Profile Velog Xpress ",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function Profile() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0e2269] via-[#183b8f] to-[#2458b8] px-6 py-7 text-white shadow-lg shadow-brand-500/10 sm:px-8">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />
        <div className="relative flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20"><CircleUserRound className="h-6 w-6" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">Espace personnel</p><h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Mon profil Velog Xpress</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">Consultez vos coordonnées, retrouvez votre adresse de livraison et sécurisez votre compte depuis un seul endroit.</p></div></div>
      </section>
      <div className="space-y-6">
          <UserMetaCard />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2"><UserInfoCard /><UserAuthCard /></div>
          <UserAddressCard />
          <ShippingAddressFaq />
      </div>
    </div>
  );
}
