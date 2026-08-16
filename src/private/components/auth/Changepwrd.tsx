"use client";

import Alert from "../ui/alert/Alert";
import Link from "next/link";
import { CheckCircle2, HomeIcon, LogIn, MailCheck } from "lucide-react";

export default function Changepwrd() {
  function handleCkeck(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    window.location.href = "/dashboard/signin";
  }

  return (
    <div className="flex w-full flex-1 flex-col overflow-y-auto bg-slate-50 px-4 py-6 no-scrollbar dark:bg-gray-950 lg:w-1/2 lg:px-10">
      <div className="mx-auto mb-6 w-full max-w-xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-gray-100 transition-colors hover:text-[#001B90] dark:bg-white/[0.04] dark:text-gray-300 dark:ring-white/10"
        >
          <HomeIcon className="h-4 w-4" />
          Retour à la page d&apos;accueil
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center">
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-blue-950/10 dark:border-white/10 dark:bg-gray-900">
          <div className="relative overflow-hidden bg-[#001B90] px-6 py-7 text-white sm:px-8">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-green-400/25 blur-2xl" />
            <div className="absolute bottom-0 left-8 h-28 w-28 rounded-full bg-cyan-300/20 blur-2xl" />
            <div className="relative">
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <CheckCircle2 className="h-6 w-6" />
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100">
                Confirmation
              </p>
              <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
                Vérifiez votre boîte de réception
              </h1>
              <p className="mt-3 max-w-xl text-sm text-blue-100 sm:text-base">
                Nous avons envoyé les instructions nécessaires pour finaliser la réinitialisation de votre mot de passe. Le lien est valide pendant 30 minutes.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-6 flex gap-3 rounded-2xl bg-blue-50 p-4 text-[#001B90] dark:bg-white/[0.04] dark:text-blue-200">
              <MailCheck className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">
                Ouvrez votre email et suivez le lien reçu pour continuer. Ce lien est valide pendant 30 minutes. Vérifiez aussi vos courriers indésirables si vous ne voyez pas le message.
              </p>
            </div>

            <Alert
              variant="success"
              title="Succès!"
              message="Un lien de réinitialisation a été envoyé à votre email. Il est valide pendant 30 minutes. Veuillez vérifier votre boîte de réception."
              showLink={false}
            />

            <div className="dashboard-scope mt-6">
              <button
                type="button"
                onClick={handleCkeck}
                className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-xl bg-brand-500 shadow-theme-xs hover:bg-brand-600 !rounded-xl !bg-[#001B90] !px-4 !py-3 hover:!bg-green-600"
              >
                <LogIn className="h-5 w-5" />
                Retour à la page de connexion
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-center dark:bg-white/[0.04]">
              <p className="text-sm font-normal text-gray-700 dark:text-gray-400">
                Vous pouvez aussi retourner à{" "}
                <Link
                  href="/dashboard/recovery"
                  className="font-semibold text-[#001B90] hover:text-green-600 dark:text-brand-400"
                >
                  la récupération du mot de passe
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
