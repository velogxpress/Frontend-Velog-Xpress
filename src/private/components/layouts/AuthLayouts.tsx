"use client";
import "aos/dist/aos.css";
import GridShape from "@/private/components/common/GridShape";
//import ThemeTogglerTwo from "@/private/components/common/ThemeTogglerTwo";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0">

  {/* Colonne gauche : formulaire */}
  <div className="lg:w-3/5 w-full flex items-center justify-center">
    {children}
  </div>

  {/* Colonne droite : visuel + logo */}
  <div className="lg:w-2/5 w-full h-full lg:grid items-center hidden">
    <div className="relative items-center justify-center flex z-1">
      <GridShape />
      <div className="flex flex-col items-center max-w-xs">
        <Link href="/" className="block mb-4">
          <Image
            width={231}
            height={48}
            src="/images/logo/auth-logo.svg"
            alt="Logo"
          />
        </Link>
        <p className="text-center text-gray-400 dark:text-white/60">
          De loin, la meilleure Compagnie Haïtienne en matière de réception,
          gestion, traitement et Transport de courriers.
        </p>
      </div>
    </div>
  </div>

</div>

  );
}
