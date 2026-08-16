"use client";
import Input from "@/private/components/form/input/InputField";
import Label from "@/private/components/form/Label";
import Alert from "../../components/ui/alert/Alert";

import React, { useState } from "react";
import { getClient } from "../../../services/LoginService";
import { createRecovery } from "../../../services/RecoveryService";
import { useRouter } from "next/navigation";
import { useNavigation } from "@/private/context/NavigationContext";
import Link from "next/link";
import { HomeIcon, KeyRound, MailCheck } from "lucide-react";



export default function Recovery() {
  const router = useRouter();
  const { setData } = useNavigation();

  const [show, setShow] = useState<boolean>(false);
  const [email,setEmail]=useState<string>("");
  const [msg,setMsg]=useState<string>("");

  const handleGo = () => {
    setData({
      emails: email.trim(),
    });

    router.push("/dashboard/verifyotp");
  };

  function handleCkeck(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
   
    const trimmed = email.trim();
    if (!trimmed) {
      setMsg("Veuillez entrer votre adresse email.");
      setShow(true);
      return;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(trimmed)) {
      setMsg("Veuillez entrer une adresse email valide.");
      setShow(true);
      return;
    }

    // hide previous messages
    setShow(false);

    getClient(email).then((res)=>{
      if(res.data.length===0){
        setMsg("Aucun compte n'existe avec cet email. Veuillez utiliser un email différent.");
        setShow(true);
        return;
      }
      // call recovery service
    createRecovery({ email: trimmed })
      .then(() => {
        setShow(false);
        handleGo();
      })
      .catch((err: { response?: { data?: { message?: string } }; message?: string }) => {
        const message =
          err?.response?.data?.message || err?.message || "Une erreur est survenue. Veuillez réessayer.";
        setMsg(message);
        setShow(true);
      });

    }).catch((err)=>{
      console.log("Erreur lors de la vérification de l'email:",err);
    })
    
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
                Mot de passe oublié
              </p>
              <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
                Récupérer votre accès
              </h1>
              <p className="mt-3 max-w-xl text-sm text-blue-100 sm:text-base">
                Entrez votre adresse email pour recevoir les instructions de réinitialisation de mot de passe. Le lien sera valide pendant 30 minutes.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-6 flex gap-3 rounded-2xl bg-blue-50 p-4 text-[#001B90] dark:bg-white/[0.04] dark:text-blue-200">
              <MailCheck className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">
                Nous vérifierons votre compte puis nous vous redirigerons vers la validation OTP. Le lien de récupération restera valide pendant 30 minutes.
              </p>
            </div>

            <form>
              <div className="space-y-5">
              {/* <!-- Email --> */}
             
              <div>
                <Label>
                  Email<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Entrez votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
             

              
                  <div className="mt-4 text-justify text-red-600 font-semibold">
                    {show && (
                      <Alert
                        variant="error"
                        title="Oups!"
                        message={msg}
                        showLink={false}
                      />
                    )}
                  </div>
                  {/* <!-- Button --> */}
                  <div className="dashboard-scope">
                    <button
                      type="submit"
                     // disabled={isSaving}
                     onClick={handleCkeck}
                      className="flex items-center justify-center w-full 
                        px-4 py-3 text-sm font-medium text-white transition 
                        rounded-xl bg-brand-500 shadow-theme-xs hover:bg-brand-600
                        !rounded-xl !bg-[#001B90] !px-4 !py-3 hover:!bg-green-600"
                    >
                      Envoyer les instructions
                    </button>
                  </div>
               
              </div>
            
            </form>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-center dark:bg-white/[0.04]">
              <p className="text-sm font-normal text-gray-700 dark:text-gray-400">
                Vous vous souvenez de votre mot de passe?{" "}
                <Link
                  href="/dashboard/signin"
                  className="font-semibold text-[#001B90] hover:text-green-600 dark:text-brand-400"
                >
                  Se connecter
                </Link>
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
