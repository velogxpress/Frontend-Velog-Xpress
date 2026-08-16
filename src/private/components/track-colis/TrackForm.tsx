"use client";
import Input from "../form/input/InputField";
import { useState} from "react";

import { trackmyOrderDetails } from "../../../services/OrderDetailsService"



interface Category {
  id: number;
  description: string;
  part?: string;
}

interface Order {
  id: number;
  date: string;
  shiporder: string;
  colisQty: number;
  poundQty: number;
  amount: number;
  status: string;
  shipdate: string | null;
}

interface Specialfee {
  id: number;
  amount: number;
}

interface Feepounds {
  id: number;
  amount: number;
}

interface Ville {
  id: number;
  description: string;
  abreger: string;
  region: Region;
}

interface Region {
  id: number;
  description: string;
}

interface Insurance {
  id: number;
  amount: number;
}

interface Cipinfee {
  id: number;
  city: Ville;
  pounds: Feepounds;
  insurance: Insurance;
  specialfee: Specialfee;
}

interface Client {
  id: number;
  name: string;
  email: string;
  address: string;
  ville: Ville;
  usercode: string;
  password: string;
  phone: string;
  status: string;
}
interface OrderDetails {
      id: number
      ship:Order;
      client:Client | null;
      upc:string;
      category:Category | null;
      citypoundfee:Cipinfee;
      pounds: number;
      subtotal: number;
      status: string;
      delivery: string;
      exp_name: string;
      exp_email: string | null;
      exp_phone: string;
      rec_name: string;
      rec_email: string | null;
      rec_phone: string;
      type: string;
      condition: string | null;
  price: number;
  tracking:string
    }

import {
  AlertCircle,
  CalendarDays,
  CheckCircle,
  ClipboardList,
  Home,
  MapPin,
  Package,
  Plane,
  Route,
  Scale,
  SearchIcon,
  Truck,
} from "lucide-react";





function addDaysToFormattedDate(dateStr: string, daysToAdd: number) {
  // Séparer la date
  const [day, month, year] = dateStr.split("-").map(Number);

  // Créer la date (⚠️ month - 1)
  const date = new Date(year, month - 1, day);

  // Ajouter les jours
  date.setDate(date.getDate() + daysToAdd);

  // Formatter en français
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return date.toLocaleDateString("fr-FR", options);
}

function FormattedDate(dateStr: string) {
  // Séparer la date
  const [day, month, year] = dateStr.split("-").map(Number);

  // Créer la date (⚠️ month - 1)
  const date = new Date(year, month - 1, day);

  // Ajouter les jours
  date.setDate(date.getDate());

  // Formatter en français
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return date.toLocaleDateString("fr-FR", options);
}



export default function TrackForm() {
  const [recherche, setRecherche] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [region, setRegion] = useState<boolean>(false);
const localRegions = [
  "Ouest",
  "Centre",
  "Artibonite",
  "Nippes",
  "Nord'Ouest",
  "Sud",
  "Sud'Est",
  "Grand'Anse"
];
  const [error, setError] = useState<{recherche: string} | null>(null);

  const validateForm = (): boolean => {
    let valid = true;

    if (!recherche.trim()) {
      setError({ recherche: "Veuillez entrer un numéro de suivi" });
      valid = false;
    } else {
      setError(null);
    }

    return valid;
  }

 const getSteps = (region: boolean) => [
  { key: "CONFIRMED", label: "Colis Confirmé", icon: Package },
  { key: "SHIPPED", label: "Colis Expédié", icon: Plane },
  { 
    key: "OUT", 
    label: region ? "En transite en Haiti" : "Colis Disponible", 
    icon: Truck 
  },
  { key: "DELIVERED", label: "Colis Livré", icon: Home },
];

  async function handleTrack(): Promise<void> {
   if (!validateForm()) {
      return;
   }
    setError(null);
    
    try {
      const result = await trackmyOrderDetails(recherche);
      setOrderDetails(result.data || null);
      if (result.data.status == "Expédition en attente.") {
        setCurrentStep(0);
      } else if (result.data.status == "Commande expédiée.") {
        setCurrentStep(1);
      } else if (result.data.status == "Commande prête à être livrée.") {
        setRegion(false);
        setCurrentStep(2);
      } else if (result.data.status == "Commande bien arrivée en Haiti." || result.data.status == "Commande bien arrivée en Haïti.") {
        const desc = result.data?.citypoundfee?.city?.region?.description;
        if (localRegions.includes(desc)) {
           setRegion(true);
        } else {
          setRegion(false);
        } 
        setCurrentStep(2);
      } else if (result.data.status == "Commande a été livrée.") {
        setCurrentStep(3);
      } else {
        setCurrentStep(-1);
      }

    } catch {
      setError({ recherche: "Impossible de trouver le colis. Vérifiez le numéro de suivi." });
      setOrderDetails(null);
    } 
  }

  const steps = getSteps(region);
  const progressWidth =
    currentStep >= 0 ? `${(currentStep / (steps.length - 1)) * 100}%` : "0%";
  const hasResult = Boolean(orderDetails);
  const currentStatus = orderDetails?.status || "Aucun colis recherché";
  const detailItems = [
    {
      label: "Commande",
      value: orderDetails?.ship?.shiporder || "N/A",
      icon: ClipboardList,
    },
    {
      label: "Numéro de suivi",
      value: orderDetails?.tracking || "N/A",
      icon: Route,
    },
    {
      label: "Poids du colis",
      value: orderDetails?.pounds ? `${orderDetails.pounds} lbs` : "N/A",
      icon: Scale,
    },
    {
      label: "Destination",
      value: orderDetails?.citypoundfee?.city?.description || "N/A",
      icon: MapPin,
    },
    {
      label: "Est. de livraison",
      value: orderDetails?.ship?.date
        ? addDaysToFormattedDate(orderDetails.ship.date, 10)
        : "N/A",
      icon: CalendarDays,
    },
    {
      label: "Livraison",
      value: orderDetails?.delivery ? FormattedDate(orderDetails.delivery) : "N/A",
      icon: Truck,
    },
  ];


  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="relative bg-gradient-to-br from-[#0e2269] via-[#14327f] to-[#52ae1d] px-6 py-7 text-white sm:px-8">
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 left-8 h-28 w-28 rounded-full bg-green-300/20 blur-2xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100">
                Traceur de colis
              </p>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Rechercher et suivre un colis
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-blue-100 sm:text-base">
                Entrez le numéro de suivi pour consulter le statut, la destination
                et l&apos;avancement du colis.
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 px-4 py-3 ring-1 ring-white/20">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-100">
                Statut actuel
              </p>
              <p className="mt-1 text-lg font-semibold">{currentStatus}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <div className="relative">
              <Input
                placeholder="Entrez votre numéro de suivi"
                type="text"
                className="h-12 pl-14"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTrack();
                }}
              />
              <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <SearchIcon className="h-5 w-5" />
              </span>
            </div>
            {error?.recherche && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-500/10">
                <AlertCircle className="h-4 w-4" />
                {error.recherche}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleTrack}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0e2269] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#52ae1d] focus:outline-none focus:ring-2 focus:ring-[#0e2269]/20"
            title="Lancer la recherche du colis"
          >
            <Plane className="h-5 w-5" />
            Suivre
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {detailItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#0e2269]/10 text-[#0e2269] dark:bg-white/10 dark:text-blue-200">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                {item.label}
              </p>
              <p className="mt-2 break-words text-base font-semibold text-gray-900 dark:text-white">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#52ae1d]">
              Progression
            </p>
            <h4 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
              Parcours du colis
            </h4>
          </div>
          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
              hasResult
                ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-300"
                : "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-300"
            }`}
          >
            <Package className="h-4 w-4" />
            {hasResult ? currentStatus : "En attente de recherche"}
          </span>
        </div>

        <div className="relative hidden min-h-[145px] items-start justify-between md:flex">
          <div className="absolute left-0 top-5 h-1 w-full rounded-full bg-gray-200 dark:bg-gray-800"></div>
          <div
            className="absolute left-0 top-5 h-1 rounded-full bg-[#52ae1d] transition-all duration-500"
            style={{ width: progressWidth }}
          ></div>

          {steps.map((step, index) => {
            const active = index <= currentStep;
            const Icon = step.icon;

            return (
              <div key={step.key} className="relative z-10 flex w-32 flex-col items-center text-center">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full border-4 transition ${
                    active
                      ? "border-[#52ae1d] bg-[#52ae1d] text-white"
                      : "border-gray-300 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900"
                  }`}
                >
                  {active ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <Icon className={`mt-4 h-7 w-7 ${active ? "text-[#52ae1d]" : "text-gray-400"}`} />
                <p className={`mt-2 text-sm font-semibold ${active ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-3 md:hidden">
          {steps.map((step, index) => {
            const active = index <= currentStep;
            const Icon = step.icon;
            return (
              <div
                key={step.key}
                className={`flex items-center gap-4 rounded-2xl border p-4 ${
                  active
                    ? "border-[#52ae1d]/30 bg-green-50 text-gray-900 dark:bg-green-500/10 dark:text-white"
                    : "border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-white/[0.03]"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    active ? "bg-[#52ae1d] text-white" : "bg-white text-gray-400 dark:bg-gray-900"
                  }`}
                >
                  {active ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </span>
                <div>
                  <p className="text-sm font-semibold">{step.label}</p>
                  <p className="text-xs text-gray-500">
                    {active ? "Étape atteinte" : "En attente"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
