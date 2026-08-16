"use client";
import Input from "@/private/components/form/input/InputField";
import Label from "@/private/components/form/Label";
import Alert from "../ui/alert/Alert";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { createRecovery, getRecovery, updateRecovery } from "../../../services/RecoveryService";
import { useNavigation } from "@/private/context/NavigationContext";
import { useRouter } from "next/navigation";
import { HomeIcon, MailCheck, ShieldCheck } from "lucide-react";



export default function Verify() {
  const navigation = useNavigation();
  const [email, setEmail] = useState<string>(navigation.data?.emails || "");
  const router = useRouter();
  const { setData } = navigation;


  const [show, setShow] = useState<boolean>(false);
  const [msg,setMsg]=useState<string>("");
  const [msgs,setMsgs]=useState<string>("Un code de vérification a été envoyé à votre email: "+email);
  const [code,setCode]=useState<string>("");

  useEffect(() => {
    const emailFromLink = new URLSearchParams(window.location.search).get("email")?.trim();
    const resolvedEmail = emailFromLink || navigation.data?.emails || "";

    if (resolvedEmail) {
      setEmail(resolvedEmail);
      setMsgs("Entrez le code de vérification envoyé à votre email: " + resolvedEmail);
      setData({ emails: resolvedEmail });
    } else {
      setMsgs("Email manquant. Retournez à la page de récupération pour demander un code.");
    }
  }, []);

 const handleGo = () => {
    setData({
      emails: email.trim(),
    });

    router.push("/dashboard/changepwrd");
  };

  function handleCkeck(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    // basic validation
   
      if(!code.trim()){
        setMsg("Veuillez entrer le code reçu par email.");
        setShow(true);
        return;
      }
      getRecovery(email).then(async (res)=>{
       // console.log("recovery data:",res.data);
        if(res.data.length===0){
          setMsg("Code invalide. Veuillez vérifier le code et réessayer.");
          setShow(true);
          return;
        }
        if(res.data.code!==code.trim()){
          setMsg("Code invalide. Veuillez vérifier le code et réessayer.");
          setShow(true);
          return;
        }
        // redirect to change password page
        if (!email) {
          setMsg("Email manquant. Impossible de procéder.");
          setShow(true);
          return;
        }
        try {
          const response = await updateRecovery(email);
          if (response && response.status >= 200 && response.status < 300) {
            setShow(false);
            handleGo();
          } else {
            setMsg("Échec de la mise à jour. Veuillez réessayer.");
            setShow(true);
          }
        } catch (err) {
          console.log("Erreur lors de la mise à jour du recovery:", err);
          setMsg("Une erreur est survenue. Veuillez réessayer plus tard.");
          setShow(true);
        }
        
        
      }).catch((err)=>{
        console.log("Erreur lors de la vérification du code:",err);
      })
      return;

    }
    
  async function handleResendClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (!email) {
      setMsg("Email manquant. Impossible d'envoyer le code.");
      setShow(true);
      return;
    }
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setMsg("Email manquant. Impossible d'envoyer le code.");
      setShow(true);
      return;
    }
   // console.log("Resending code to email:", trimmedEmail);
    try {
      const response = await createRecovery({email: trimmedEmail});
      if (response && response.status >= 200 && response.status < 300) {
        setMsgs("Un nouveau code a été envoyé à votre email: " + trimmedEmail);
        setShow(false);
      } else {
        setMsg("Échec de l'envoi du code. Veuillez réessayer.");
        setShow(true);
      }
    } catch (err) {
     // console.log("Erreur lors de l'envoi du code:", err);
      setMsg("Une erreur est survenue. Veuillez réessayer plus tard: " + err);
      setShow(true);
    }
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
                <ShieldCheck className="h-6 w-6" />
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100">
                Vérification OTP
              </p>
              <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
                Vérifier le code
              </h1>
              <p className="mt-3 max-w-xl text-sm text-blue-100 sm:text-base">
                Entrez le code reçu par email afin de continuer la réinitialisation de votre mot de passe.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <form>
              <div className="space-y-5">
              {/* <!-- Email --> */}
                <div className="font-semibold">
                    <Alert
                      variant="success"
                      title="Succès!"
                      message={msgs}
                      showLink={false}
                    />
              </div>
                <div>
                <Label>
                  Code de vérification<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="code"
                  name="code"
                  placeholder="Entrez le code reçu"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
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
                  <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400"></span>
                  </div>
                  <Link
                    href="#"
                    onClick={(e) => handleResendClick(e)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#001B90] hover:text-green-600 dark:text-brand-400"
                  >
                    <MailCheck className="h-4 w-4" />
                    Vous n’avez pas reçu le code ? Envoyer à nouveau
                  </Link>
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
                      Vérifier le code
                    </button>
                  </div>
                
              </div>
            
            </form>
            
          </div>
        </div>
      </div>
    </div>
  );
}
