"use client";

import GridShape from "@/private/components/common/GridShape";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import "@/styles/globals.tailwind.css";

export default function Unauthorized() {
  const router = useRouter();

  const handleBack = () => {
    // retounen sou paj anvan an
    if (window.history.length > 1) {
      router.back();
    } else {
      // fallback si pa gen history
      router.push("/dashboard/signin");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
      <GridShape />

      <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
        <h3 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
          NON AUTORISÉ
        </h3>

        <Image
          src="/images/error/401.png"
          alt="Unauthorized"
          className="dark:hidden"
          width={472}
          height={152}
        />

        <Image
          src="/images/error/401-dark.png"
          alt="Unauthorized"
          className="hidden dark:block"
          width={472}
          height={152}
        />

        <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
          Accès refusé. Vous devez avoir les autorisations nécessaires pour consulter cette page.
        </p>


        {/* Bouton Back */}
        <button
          onClick={handleBack}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-blue-500 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600 m-4"
        >
          ← Retour
        </button>

        {/* Bouton Login */}
        <Link
          href="/dashboard/signin"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Aller à la connexion
        </Link>
      </div>

      <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
        &copy; {new Date().getFullYear()} - Velog Xpress
      </p>
    </div>
  );
}
