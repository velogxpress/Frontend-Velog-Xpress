"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import {
  CalendarDays,
  CheckCircle,
  Home,
  HomeIcon,
  MapPin,
  Package,
  Phone,
  Plane,
  SearchIcon,
  ShieldCheck,
  Truck,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { trackmyOrderDetails } from "../../../services/LoginService";
import Lien from "@/route/BASE_URL";

const supportPhone = "19736406064";

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
  id: number;
  ship: Order;
  client: Client | null;
  upc: string;
  category: Category | null;
  citypoundfee: Cipinfee;
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
  tracking: string;
  douane: number;
  picture: string;
}

function addDaysToFormattedDate(dateStr: string, daysToAdd: number) {
  const [day, month, year] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + daysToAdd);

  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formattedDate(dateStr: string) {
  const [day, month, year] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function buildWhatsappSupportMessage({
  tracking,
  status,
}: {
  tracking: string;
  status: string;
}) {
  return [
    "Bonjour Velog Xpress, mwen bezwen asistans.",
    `Sujet: Support suivi colis`,
    `Tracking: ${tracking}`,
    `Statut: ${status}`,
    "Message: Mwen bezwen asistans pou colis sa.",
  ].join("\n");
}

export default function SuiviForm() {
  const [recherche, setRecherche] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [region, setRegion] = useState<boolean>(false);
  const [error, setError] = useState<{ recherche: string } | null>(null);

  const localRegions = [
    "Ouest",
    "Centre",
    "Artibonite",
    "Nippes",
    "Nord'Ouest",
    "Sud",
    "Sud'Est",
    "Grand'Anse",
  ];

  const getSteps = (isLocalRegion: boolean) => [
    { key: "CONFIRMED", label: "Colis confirme", icon: Package },
    { key: "SHIPPED", label: "Colis expedie", icon: Plane },
    {
      key: "OUT",
      label: isLocalRegion ? "En transit en Haiti" : "Colis disponible",
      icon: Truck,
    },
    { key: "DELIVERED", label: "Colis livre", icon: Home },
  ];

  const validateForm = (): boolean => {
    if (!recherche.trim()) {
      setError({ recherche: "Veuillez entrer un numero de suivi" });
      return false;
    }

    setError(null);
    return true;
  };

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
      } else if (
        result.data.status == "Commande bien arrivée en Haiti." ||
        result.data.status == "Commande bien arrivée en Haïti."
      ) {
        const desc = result.data?.citypoundfee?.city?.region?.description;
        setRegion(localRegions.includes(desc));
        setCurrentStep(2);
      } else if (result.data.status == "Commande a été livrée.") {
        setCurrentStep(3);
      } else {
        setCurrentStep(-1);
      }
    } catch {
      setError({
        recherche: "Impossible de trouver le colis. Verifiez le numero de suivi.",
      });
      setOrderDetails(null);
      setCurrentStep(-1);
    }
  }

  function handleWhatsappSupport() {
    const tracking = recherche.trim();

    if (!tracking) {
      setError({
        recherche:
          "Vous ne pouvez pas envoyer le message WhatsApp sans numéro de suivi.",
      });
      return;
    }

    setError(null);

    const text = buildWhatsappSupportMessage({
      tracking,
      status: orderDetails?.status || "Non verifie",
    });

    window.open(
      `https://wa.me/${supportPhone}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  const steps = getSteps(region);
  const safeCurrentStep = Math.max(currentStep, 0);
  const progress = orderDetails
    ? (safeCurrentStep / (steps.length - 1)) * 100
    : 0;
  const statusLabel = orderDetails?.status || "En attente de recherche";
  const imageSrc = orderDetails?.picture
    ? `${Lien.REST_API_IMAGE_URL}/${orderDetails.picture}`
    : "/images/user/colis.png";

  const quickStats = [
    {
      label: "Commande",
      value: orderDetails?.ship?.shiporder || "N/A",
      icon: ShieldCheck,
    },
    {
      label: "Destination",
      value: orderDetails?.citypoundfee?.city?.description || "N/A",
      icon: MapPin,
    },
    {
      label: "Poids",
      value: orderDetails?.pounds ? `${orderDetails.pounds} lbs` : "N/A",
      icon: Package,
    },
    {
      label: "Livraison",
      value: orderDetails?.delivery ? formattedDate(orderDetails.delivery) : "N/A",
      icon: CalendarDays,
    },
  ];

  const detailCards = [
    { label: "Categorie", value: orderDetails?.category?.description || "N/A" },
    { label: "UPC colis", value: orderDetails?.upc || "N/A" },
    { label: "Tracking", value: orderDetails?.tracking || "N/A" },
    {
      label: "Estimation",
      value: orderDetails?.ship?.date
        ? addDaysToFormattedDate(orderDetails.ship.date, 10)
        : "N/A",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-gray-950 dark:text-white">
      <section className="relative overflow-hidden bg-[#001B90] px-4 py-8 text-white sm:px-6 lg:px-10">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-green-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/20 transition hover:bg-white/20"
            >
              <HomeIcon className="h-4 w-4" />
              Retour a la page d&apos;accueil
            </Link>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-100">
              Velog Xpress Tracking
            </p>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Suivez votre colis avec une vue claire et rapide.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-blue-100">
              Entrez votre numero de suivi pour connaitre le statut, la destination,
              les frais et les informations principales de votre colis.
            </p>
          </div>

          <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur lg:w-80">
            <p className="text-sm text-blue-100">Statut actuel</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-400 text-[#001B90]">
                <Package className="h-6 w-6" />
              </span>
              <div>
                <p className="text-lg font-semibold">{statusLabel}</p>
                <p className="text-sm text-blue-100">
                  {orderDetails?.tracking || "Aucun colis selectionne"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-10">
        <div className="grid items-stretch gap-6 lg:grid-cols-[1.35fr_0.9fr]">
          <div className="flex h-full flex-col gap-6">
            <div className="rounded-3xl border border-white/70 bg-white p-5 shadow-xl shadow-blue-950/10 dark:border-white/10 dark:bg-gray-900">
              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
                <div className="relative">
                  <Input
                    placeholder="Entrez votre numero de suivi"
                    type="text"
                    className="h-14 pl-12 text-base"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleTrack();
                      }
                    }}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <SearchIcon className="h-5 w-5" />
                  </span>
                  {error?.recherche && (
                    <p className="mt-2 text-sm font-medium text-red-600">
                      {error.recherche}
                    </p>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  startIcon={<Plane className="size-5" />}
                  onClick={handleTrack}
                  className="h-14 justify-center px-8"
                >
                  Suivre
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {quickStats.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-900"
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#001B90] dark:bg-white/10 dark:text-blue-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                      {item.label}
                    </p>
                    <p className="mt-2 break-words text-base font-semibold text-gray-900 dark:text-white">
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-900">
              <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-600">
                    Progression
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Parcours du colis
                  </h2>
                </div>
                <p className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                  {orderDetails ? `${Math.round(progress)}% complete` : "En attente"}
                </p>
              </div>

              <div className="relative">
                <div className="absolute left-0 top-6 hidden h-1 w-full rounded-full bg-gray-200 sm:block" />
                <div
                  className="absolute left-0 top-6 hidden h-1 rounded-full bg-green-500 transition-all sm:block"
                  style={{ width: `${progress}%` }}
                />

                <div className="grid gap-5 sm:grid-cols-4">
                  {steps.map((step, index) => {
                    const active = orderDetails ? index <= currentStep : false;
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.key}
                        className="relative z-10 flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 sm:flex-col sm:border-0 sm:bg-transparent sm:p-0 dark:border-white/10 dark:bg-white/[0.03] sm:dark:bg-transparent"
                      >
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 ${
                            active
                              ? "border-green-500 bg-green-500 text-white"
                              : "border-gray-200 bg-white text-gray-400"
                          }`}
                        >
                          {active ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <Icon className="h-5 w-5" />
                          )}
                        </div>
                        <div className="sm:text-center">
                          <Icon
                            className={`mb-2 hidden h-6 w-6 sm:mx-auto sm:block ${
                              active ? "text-green-600" : "text-gray-400"
                            }`}
                          />
                          <p
                            className={`text-sm font-semibold ${
                              active
                                ? "text-gray-900 dark:text-white"
                                : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-900">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Details du colis
                  </h2>
                  <p className="text-sm text-gray-500">
                    Informations disponibles apres la recherche.
                  </p>
                </div>
              </div>

              <div className="grid content-start gap-3 sm:grid-cols-2">
                {detailCards.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.04]"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                      {item.label}
                    </p>
                    <p className="mt-2 break-words text-sm font-semibold text-gray-900 dark:text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-blue-950/10 dark:border-white/10 dark:bg-gray-900">
              <div className="bg-gradient-to-br from-[#001B90] to-[#0f766e] p-5 text-white">
                <p className="text-sm text-blue-100">Apercu du colis</p>
                <h2 className="mt-1 text-2xl font-bold">
                  {orderDetails?.type || "Colis Velog Xpress"}
                </h2>
              </div>
              <div className="p-5">
                <div className="flex min-h-72 items-center justify-center rounded-3xl bg-slate-50 p-4 dark:bg-white/[0.04]">
                  <Image
                    src={imageSrc}
                    alt={orderDetails?.picture || "Image du colis"}
                    width={420}
                    height={300}
                    unoptimized
                    className="max-h-72 w-full object-contain"
                  />
                </div>

                <div className="mt-5 rounded-2xl bg-blue-50 p-4 dark:bg-white/[0.04]">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#001B90] dark:text-blue-200">
                    Numero de suivi
                  </p>
                  <p className="mt-2 break-words text-lg font-bold text-gray-900 dark:text-white">
                    {orderDetails?.tracking || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-900">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Contacts colis
              </h3>
              <div className="mt-5 space-y-4">
                <div className="flex gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.04]">
                  <UserRound className="mt-1 h-5 w-5 text-[#001B90]" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Expediteur
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {orderDetails?.exp_name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {orderDetails?.exp_phone || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.04]">
                  <Phone className="mt-1 h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Receveur
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {orderDetails?.rec_name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {orderDetails?.rec_phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </aside>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl bg-[#001B90] p-6 text-white shadow-xl shadow-blue-950/20 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100">
                Besoin d&apos;aide?
              </p>
              <h3 className="mt-2 text-3xl font-bold">
                Notre support peut vous aider.
              </h3>
              <p className="mt-3 text-sm text-blue-100 sm:text-base">
                Si le statut ne change pas ou si le numero ne retourne aucun colis,
                contactez le support avec votre numero de suivi.
              </p>
            </div>
            <button
              type="button"
              onClick={handleWhatsappSupport}
              className="inline-flex shrink-0 justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#001B90] transition hover:bg-green-400 hover:text-white"
            >
              Contacter support
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
