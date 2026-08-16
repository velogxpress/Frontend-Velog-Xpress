"use client";
import Input from "@/private/components/form/input/InputField";
import Label from "@/private/components/form/Label";
import Button from "@/private/components/ui/button/Button";
import {EyeCloseIcon, EyeIcon } from "@/private/icons";
import Link from "next/link";
import React, { useState } from "react";
import Alert from "../../components/ui/alert/Alert";

import { login,getClient } from "../../../services/LoginService";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/private/context/AuthContext";
import { Download, HomeIcon, LockKeyhole } from "lucide-react";


interface DecodedToken {
  sub: string;
  role: string;
  exp?: number;
}

export default function SignInForm() {
   const { login: startSession } = useAuth();
   const [showPassword, setShowPassword] = useState(false);
  const [utilisateur, setUtilisateur] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    utilisateur?: string;
    password?: string;
  }>({});

  const [show, setShow] = useState<boolean>(false);
  
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!utilisateur.trim()) {
      newErrors.utilisateur = "L'utilisateur est requis.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(utilisateur.trim())) {
      newErrors.utilisateur = "Veuillez entrer une adresse email valide.";
    }

    if (!password.trim()) {
      newErrors.password = "Le mot de passe est requis.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication logic
    if (!validateForm()) return;
    try {
      const payload = {
        username: utilisateur.trim(),
        password: password.trim(),
      };

    login(payload).then((response: { data: { token: string } }) => {
    const token = response.data.token;
      // 🔐 SECURITY: single source of truth for session storage — see
      // AuthContext.login(), which also sets the non-sensitive routing
      // cookie middleware.ts reads. Previously this stored the raw JWT
      // itself in a second, unprotected cookie.
      startSession(token);

            try {
              const decoded = jwtDecode<DecodedToken>(token);
              
              const role = decoded.role?.toUpperCase()
              const response = getClient(decoded.sub);
              response.then(() => {
                 if (role === "ADMIN") {
                        window.location.href = "/dashboard/admin";
                        // You can use decoded token information if needed
                      } else if (role === "AGENT") {
                        window.location.href = "/dashboard/admin/activites";
                        // You can use decoded token information if needed
                      }else {
                        window.location.href = "/dashboard/admin/mes-colis";
                        // You can use decoded token information if needed
                      } 
              })
              .catch(() => {
                 setShow(true);
                 setUtilisateur("");
                 setPassword("");
                 return;
              });
            } catch {
              setShow(true);
              setUtilisateur("");
              setPassword("");
              return;
            }

        })
        .catch(() => {
          setShow(true);
          setUtilisateur("");
          setPassword("");
        });
      
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col overflow-y-auto bg-slate-50 px-4 py-6 no-scrollbar dark:bg-gray-950 lg:w-1/2 lg:px-10">
      <div className="mx-auto mb-6 w-full max-w-xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-gray-100 transition-colors hover:text-[#001B90] dark:bg-white/[0.04] dark:text-gray-300 dark:ring-white/10"
        >
          <HomeIcon className="w-4 h-4" />
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
                <LockKeyhole className="h-6 w-6" />
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100">
                Accès client
              </p>
              <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
                Se connecter
              </h1>
              <p className="mt-3 max-w-xl text-sm text-blue-100 sm:text-base">
                Accédez à votre espace Velog Xpress pour suivre vos colis et consulter vos informations.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-3">
               <button
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-slate-50 px-7 py-3 text-sm font-semibold text-gray-700 ring-1 ring-gray-100 transition-colors hover:bg-blue-50 hover:text-[#001B90] dark:bg-white/[0.04] dark:text-white/90 dark:ring-white/10 dark:hover:bg-white/10"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/downloads/velog-app.apk";
                  link.download = "velog-app.apk";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                type="button"
              >
                <Download className="h-5 w-5" />
                Télécharger l&apos;application Android
              </button> 

               {/* <button
                className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/downloads/velog-app.ipa";
                  link.download = "velog-app.ipa";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                type="button"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.5 2a4.35 4.35 0 01-1.27 3.2 3.69 3.69 0 01-2.79 1.3 4.17 4.17 0 011.26-3.16A4.4 4.4 0 0116.5 2zM12.11 7.17c2.06 0 3.4 1.11 4.57 1.11 1.13 0 2.07-1.08 3.61-1.08a6.29 6.29 0 012.54.68A6.56 6.56 0 0120 12.28c0 1.58.35 3.19 1 4.47a6.61 6.61 0 01-1.5.55 6.27 6.27 0 01-1.4.15c-1.31 0-2.12-.91-3.62-.91s-2 .91-3.58.91a6.47 6.47 0 01-1.53-.16 6.46 6.46 0 01-1.4-.55c-.71-1.31-1.06-2.82-1.06-4.38a7 7 0 011.3-4.16 4.45 4.45 0 013.5-1.9z" />
                </svg>
                IOS App
              </button>  */}
              
            </div>
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Entrez votre email et votre mot de passe
                </span>
              </div>
            </div> 
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="info@gmail.com" type="email" value={utilisateur} onChange={(e) => setUtilisateur(e.target.value)} />
                </div>
                {errors.utilisateur && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.utilisateur}
                    </p>
                  )}
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrez votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={EyeIcon.src}
                          alt=""
                          className="fill-gray-500 dark:fill-gray-400"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={EyeCloseIcon.src}
                          alt=""
                          className="fill-gray-500 dark:fill-gray-400"
                        />
                      )}
                    </span>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400"></span>
                  </div>
                  <Link
                    href="/dashboard/recovery"
                    className="text-sm font-semibold text-[#001B90] hover:text-green-600 dark:text-brand-400"
                  >
                    Mot de passe oublié?
                  </Link>
                </div>
                 <div className="mt-4 text-justify text-red-600 font-semibold">
                  {show && (
                    <Alert
                      variant="error"
                      title="Oups!"
                      message="Utilisateur ou mot de passe incorrect."
                      showLink={false}
                    />
                  )}
                </div>
                <div>
                  <Button
                    className="w-full 
                    px-4 py-3 text-sm font-medium text-white transition 
                    rounded-xl bg-brand-500 shadow-theme-xs hover:bg-brand-600
                    !rounded-xl !bg-[#001B90] !px-4 !py-3 hover:!bg-green-600"
                    size="sm"
                  >
                    Se connecter
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-center dark:bg-white/[0.04]">
              <p className="text-sm font-normal text-gray-700 dark:text-gray-400">
                Vous n&apos;avez pas encore de compte? {""}
                  <Link
                    href="/dashboard/signup"
                    className="font-semibold text-[#001B90] hover:text-green-600 dark:text-brand-400"
                  >
                  S&apos;inscrire
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
