"use client";

import Input from "@/private/components/form/input/InputField";
import Label from "@/private/components/form/Label";
import Alert from "../ui/alert/Alert";
import Link from "next/link";
import React, { useState } from "react";
import { verifyToken, resetPassword } from "../../../services/RecoveryService";
import { CheckCircle2, HomeIcon, KeyRound, LockKeyhole, LogIn, RotateCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [show, setShow] = useState<boolean>(false);
  const [showing, setShowing] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirmation, setConfirmation] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  function handleCkeck(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();

    if (!token) {
      setMsg("Token manquant. Impossible de procéder.");
      setShow(true);
      return;
    }

    const pwd = password.trim();
    const conf = confirmation.trim();

    if (!pwd) {
      setMsg("Veuillez entrer votre mot de passe.");
      setShow(true);
      return;
    }

    if (pwd.length < 6) {
      setMsg("Le mot de passe doit contenir au moins 6 caractères.");
      setShow(true);
      return;
    }

    if (pwd !== conf) {
      setMsg("Les mots de passe ne correspondent pas.");
      setShow(true);
      return;
    }

    setShow(false);
    setIsSaving(true);

    verifyToken(token)
      .then((response) => {
        const validite = response.data;

        if (validite == "Token invalide" || validite == "Token expiré") {
          setMsg(
            "Token invalide ou expiré. Veuillez demander une nouvelle réinitialisation.",
          );
          setShowing(false);
          setShow(true);
          setIsSaving(false);
          return;
        }

        resetPassword(token, pwd)
          .then((resetResponse) => {
            if (resetResponse.data !== "Mot de passe mis à jour") {
              throw new Error(resetResponse.data || "La mise à jour du mot de passe a échoué.");
            }
            setMsg(
              "Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.",
            );
            setShow(false);
            setShowing(true);
            setIsSaving(false);
            setPassword("");
            setConfirmation("");
          })
          .catch((err: unknown) => {
            const error = err as {
              response?: { data?: { message?: string; detail?: string } | string };
              message?: string;
            };
            const message =
              (typeof error?.response?.data === "string" ? error.response.data : error?.response?.data?.message || error?.response?.data?.detail) ||
              error?.message ||
              "Une erreur est survenue. Veuillez réessayer.";
            setMsg(message);
            setShowing(false);
            setShow(true);
            setIsSaving(false);
          });
      })
      .catch(() => {
        setMsg(
          "Token invalide ou expiré. Veuillez demander une nouvelle réinitialisation.",
        );
        setShowing(false);
        setShow(true);
        setIsSaving(false);
      });
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
                <KeyRound className="h-6 w-6" />
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100">
                Réinitialisation
              </p>
              <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
                Définir un nouveau mot de passe
              </h1>
              <p className="mt-3 max-w-xl text-sm text-blue-100 sm:text-base">
                Entrez votre nouveau mot de passe et confirmez-le. Pour votre sécurité, le lien est valide pendant 30 minutes.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {showing ? (
              <div className="flex flex-col items-center py-5 text-center sm:py-8">
                <div className="flex size-20 items-center justify-center rounded-full bg-success-50 text-success-600 ring-8 ring-success-50/60 dark:bg-success-500/15 dark:text-success-400 dark:ring-success-500/5">
                  <CheckCircle2 className="size-10" />
                </div>
                <h2 className="mt-7 text-2xl font-bold text-gray-900 dark:text-white">
                  Mot de passe modifié avec succès
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Votre nouveau mot de passe est maintenant actif. Vous pouvez vous connecter à votre compte Velog Xpress.
                </p>
                <Link
                  href="/dashboard/signin"
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#001B90] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/15 transition hover:bg-green-600 sm:w-auto sm:min-w-[220px]"
                >
                  <LogIn className="size-5" />
                  Se connecter
                </Link>
              </div>
            ) : (
              <>
            <div className="mb-6 flex gap-3 rounded-2xl bg-blue-50 p-4 text-[#001B90] dark:bg-white/[0.04] dark:text-blue-200">
              <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">
                Utilisez un mot de passe d&apos;au moins 6 caractères, puis reconnectez-vous à votre espace client.
              </p>
            </div>

            <form>
              <div className="space-y-5">
                <div>
                  <Label>
                    Mot de passe<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div>
                  <Label>
                    Confirmation du mot de passe{" "}
                    <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="password"
                    id="confirmation"
                    name="confirmation"
                    placeholder="Confirmez votre mot de passe"
                    value={confirmation}
                    onChange={(e) => setConfirmation(e.target.value)}
                  />
                </div>

                {show && (
                  <Alert
                    variant="error"
                    title="Oups!"
                    message={msg}
                    showLink={false}
                  />
                )}

                <div className="dashboard-scope mt-5">
                  <button
                    type="submit"
                    disabled={isSaving}
                    onClick={handleCkeck}
                    className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-xl bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70 !rounded-xl !bg-[#001B90] !px-4 !py-3 hover:!bg-green-600"
                  >
                    <RotateCcw className="h-5 w-5" />
                    {isSaving ? "Réinitialisation..." : "Réinitialiser"}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-4 text-center dark:bg-white/[0.04]">
              <p className="text-sm font-normal text-gray-700 dark:text-gray-400">
                Token invalide ou expiré?{" "}
                <Link
                  href="/dashboard/recovery"
                  className="font-semibold text-[#001B90] hover:text-green-600 dark:text-brand-400"
                >
                  Demander une nouvelle réinitialisation
                </Link>
              </p>
            </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
