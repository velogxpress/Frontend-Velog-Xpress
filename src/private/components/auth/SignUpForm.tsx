"use client";
import Input from "@/private/components/form/input/InputField";
import Label from "@/private/components/form/Label";
import Select from "@/private/components/form/Select";

import { EyeCloseIcon, EyeIcon } from "@/private/icons";
import Link from "next/link";
import React, {  useEffect, useState } from "react";
import { createClient,checkEmailExists } from "../../../services/LoginService";
import { listRegionslimite } from "../../../services/RegionService";
import { getVilleRegion } from "../../../services/VilleService";
import { CheckCircle2, HomeIcon, MapPin, ShieldCheck, UserPlus } from "lucide-react";
import Alert from "../ui/alert/Alert";


interface Region{
  id: number;
  description: string;
}
interface Ville{
  id: number;
  description: string;
  region: Region;
}

type Option = { label: string; value: string };



export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedRegionDescription,setSelectedRegionDescription]=useState<string>("");

  const[villes,setVilles]=useState<Ville[]>([]);
  const [selectedVilleId, setSelectedVilleId] = useState<number | null>(null);
  const[selectedVilleDescription,setSelectedVilleDescription]=useState<string>("");

  const[nom,setNom]=useState<string>("");
  const [email,setEmail]=useState<string>("");
  const[addresse,setAddresse]=useState<string>("");
  const [password,setPassword]=useState<string>("");
  const [phone,setPhone]=useState<string>("");

  const [errors,setErrors]=useState<{
    nom?:string;
    email?:string;
    addresse?:string;
    password?:string;
    phone?:string;
    selectedRegionId?:string;
    selectedVilleId?:string;
  }>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [alert, setAlert] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  const validateForm = (): boolean => {
    const newErrors: {
      nom?: string;
      email?: string;
      addresse?: string;
      password?: string;
      phone?: string;
      selectedRegionId?: string;
      selectedVilleId?: string;
    } = {};

    if (!nom.trim()) {
      newErrors.nom = "Le nom est requis.";
    }

    if (!email.trim()) {
      newErrors.email = "L'email est requis.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Veuillez entrer une adresse email valide.";
    }

    if (!addresse.trim()) {
      newErrors.addresse = "L'adresse est requise.";
    }

    if (!password.trim()) {
      newErrors.password = "Le mot de passe est requis.";
    }

    if (!phone.trim()) {
      newErrors.phone = "Le téléphone est requis.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  
  useEffect(() => {
  fetchRegions();
}, []);

const fetchRegions = async () => {
  try {
    const response = await listRegionslimite(0);

    const data = Array.isArray(response.data)
      ? response.data
      : response.data?.content ?? [];

    setRegions(data);
  } catch (e) {
    console.error(e);
    setRegions([]);
  }
};



const regionOptions: Option[] = regions.map(r => ({
  label: r.description,
  value: String(r.id),
}));


const villeOptions: Option[] = villes.map(v => ({
  label: v.description,
  value: String(v.id),
}));
  



const fetchVillesByRegion = async (regionId: number,page:number) => {
  try {
    
    const response = await getVilleRegion(regionId, page);
    const data = Array.isArray(response.data)
      ? response.data
      : response.data?.content ?? [];
    setVilles([]);
    setVilles(data);
  } catch (e) {
    console.error(e);
    setVilles([]);
  }
};



  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault(); // 🔑 OBLIGATWA
if (!validateForm()) {
    return;
  }
 if (!selectedRegionId) {
  setErrors(prev => ({ ...prev, selectedRegionId: "Veuillez sélectionner une région" }));
  return;
}

if (!selectedVilleId) {
  setErrors(prev => ({ ...prev, selectedVilleId: "Veuillez sélectionner une ville" }));
  return;
}


  setIsSaving(true);

  try {
    const payload = {
      name: nom,
      address: addresse,
      phone,
      email,
      password,
      ville: {
        id: selectedVilleId,
        description:selectedVilleDescription,
        region: {
          id: selectedRegionId,
          description: selectedRegionDescription,
        },
      },
    };
    const emailExists = await checkEmailExists(email);
    if (emailExists.data==="Exists") {
       setAlert({
         type: "error",
         message: "Cet email est déjà utilisé. Veuillez en choisir un autre.",
       });
      setIsSaving(false);
    } else {
    await createClient(payload);
    setAlert({
      type: "success",
      message: "Votre compte a été créé avec succès, veuillez vérifier votre email: " + email + " pour confirmer votre inscription.",
    });
    // Réinitialiser le formulaire après une inscription réussie
    setNom("");
    setAddresse("");
    setPhone("");
    setEmail("");
    setPassword("");
    setSelectedRegionId(null);
    setSelectedRegionDescription("");
    setSelectedVilleId(null);
    setSelectedVilleDescription("");
    setVilles([]);
    }
   

  } catch (error) {
    console.error("Erreur inscription:", error);
  } finally {
    setIsSaving(false);
  }
};

  return (
    <div className="flex w-full flex-1 flex-col overflow-y-auto bg-slate-50 px-4 py-6 no-scrollbar dark:bg-gray-950 lg:w-1/2 lg:px-10">
      <div className="mx-auto mb-6 w-full max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-gray-100 transition-colors hover:text-[#001B90] dark:bg-white/[0.04] dark:text-gray-300 dark:ring-white/10"
        >
          <HomeIcon className="w-4 h-4" />
          Retour a la page d&apos;accueil
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center">
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-blue-950/10 dark:border-white/10 dark:bg-gray-900">
          <div className="relative overflow-hidden bg-[#001B90] px-6 py-7 text-white sm:px-8">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-green-400/25 blur-2xl" />
            <div className="absolute bottom-0 left-10 h-28 w-28 rounded-full bg-cyan-300/20 blur-2xl" />
            <div className="relative">
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <UserPlus className="h-6 w-6" />
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100">
                Nouveau client
              </p>
              <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
                Créer votre compte Velog Xpress
              </h1>
              <p className="mt-3 max-w-xl text-sm text-blue-100 sm:text-base">
                Remplissez vos informations pour recevoir votre code client et suivre vos colis plus facilement.
              </p>
            </div>
          </div>

          <div className="grid gap-3 border-b border-gray-100 bg-slate-50 px-6 py-4 sm:grid-cols-3 sm:px-8 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                Inscription rapide
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#001B90]" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                Compte sécurisé
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-cyan-600" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                Région et ville
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <form onSubmit={handleSave}>
              <div className="grid grid-cols-1 gap-x-5 gap-y-5 lg:grid-cols-2">
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Nom Complet<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Entrez votre nom complet"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                  />
                  {errors.nom && (
                    <div className="text-error-500 text-sm mt-1">
                      {errors.nom}
                    </div>
                  )}
                </div>
                <div>
                  <Label>
                    Adresse<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Entrez votre adresse"
                    value={addresse}
                    onChange={(e) => setAddresse(e.target.value)}
                  />
                  {errors.addresse && (
                    <div className="text-error-500 text-sm mt-1">
                      {errors.addresse}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-5 gap-y-5 lg:grid-cols-2 mt-5">
                {/* <!-- First Name --> */}
                <div className="sm:col-span-1">
                  <Label>
                    Region<span className="text-error-500">*</span>
                  </Label>
                  <Select
                    options={regionOptions}
                    placeholder="Sélectionnez une région"
                    onChange={(value: string) => {
                      const id = Number(value);

                      setSelectedRegionId(id);

                      // 👇 Prendre description depuis options (IMMÉDIAT)
                      const regionDesc =
                        regionOptions.find((r) => r.value === value)?.label ||
                        "";
                      setSelectedRegionDescription(regionDesc);

                      setSelectedVilleId(null);
                      setVilles([]);

                      if (id) {
                        fetchVillesByRegion(id, 0);
                      }
                    }}
                  />

                  {errors.selectedRegionId && (
                    <div className="text-error-500 text-sm mt-1">
                      {errors.selectedRegionId}
                    </div>
                  )}
                </div>
                {/* <!-- Last Name --> */}
                <div className="sm:col-span-1">
                  <Label>
                    Ville<span className="text-error-500">*</span>
                  </Label>
                  <Select
                    options={villeOptions}
                    placeholder="Sélectionnez une ville"
                    onChange={(value: string) => {
                      const id = Number(value);
                      setSelectedVilleId(id);

                      const villeDesc =
                        villeOptions.find((v) => v.value === value)?.label ||
                        "";

                      setSelectedVilleDescription(villeDesc);
                    }}
                  />

                  {errors.selectedVilleId && (
                    <div className="text-error-500 text-sm mt-1">
                      {errors.selectedVilleId}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-5 gap-y-5 lg:grid-cols-2 mt-5">
                {/* <!-- phone --> */}
                <div>
                  <Label>
                    Telephone<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Entrez votre téléphone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    {errors.phone && (
                      <div className="text-error-500 text-sm mt-1">
                        {errors.phone}
                      </div>
                    )}
                  </div>
                </div>
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
                  {errors.email && (
                    <div className="text-error-500 text-sm mt-1">
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-5 gap-y-5 lg:grid-cols-1 mt-5">
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Entrez votre mot de passe"
                      type={showPassword ? "text" : "password"}
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
                    <div className="text-error-500 text-sm mt-1">
                      {errors.password}
                    </div>
                  )}
                </div>
                {alert && (
                  <Alert
                    variant={alert.type}
                    title={alert.type === "error" ? "Erreur" : "Succès"}
                    message={alert.message}
                  />
                )}
                {/* <!-- Button --> */}
                <div className="dashboard-scope">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center justify-center w-full 
                      px-4 py-3 text-sm font-medium text-white transition 
                      rounded-xl bg-brand-500 shadow-theme-xs hover:bg-brand-600
                      disabled:cursor-not-allowed disabled:opacity-70
                      !rounded-xl !bg-[#001B90] !px-4 !py-3 hover:!bg-green-600"
                  >
                    {isSaving ? "Enregistrement..." : "S'inscrire"}
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-center dark:bg-white/[0.04]">
              <p className="text-sm font-normal text-gray-700 dark:text-gray-400">
                Vous avez déjà un compte ?
                <Link
                  href="/dashboard/signin"
                  className="font-semibold text-[#001B90] hover:text-green-600 dark:text-brand-400"
                >
                  {" "}
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
