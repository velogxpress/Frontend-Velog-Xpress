"use client";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import {
  SearchIcon,
  DownloadIcon
} from "../../icons";
import { useState, useEffect, useRef } from "react";
import { myOrderDetailsDashboard,myOrderDetailsList,searchmyOrderDetails,downloadFacture} from "../../../services/OrderDetailsService"
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import {
  CheckCircle,
  FileImageIcon,
  PackageCheck,
  Scale,
  Truck,
  Check,
  Calendar,
  Tag,
  DollarSign,
  MapPin,
  Building2,
  ClipboardList,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import Lien from "@/route/BASE_URL";
import { jwtDecode } from "jwt-decode";
import { getClient } from "@/services/LoginService";
import { getOrderDetailsPhotos } from "../../../services/OrderDetailsGalleryService";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

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
      tracking: string;
      douane: number,
      picture: string;
    }

interface OrderDetailsPhoto {
  id: number;
  orderDetailsId: number;
  photo: string;
  createdAt: string;
}

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // page actuelle
  size: number; // taille de page
  first: boolean;
  last: boolean;
}

// 🎨 REDESIGN: single source of truth for the "where is this package in its
// journey" color. Confirmé (not shipped yet) = brand, anything still moving
// (Expédié, or arrived-in-Haiti-but-needs-further-domestic-transit) = warning,
// anything ready-or-done (Disponible, Livré) = success. StatusBadge, the card
// accent bar and the Stepper all read from this so the color story stays
// consistent across the card.
type Accent = "brand" | "warning" | "success";

const getAccent = (status: string, region: string): Accent => {
  if (status === "Commande a été livrée.") return "success";
  if (status === "Expédition en attente.") return "brand";
  if (status === "Commande expédiée.") return "warning";
  if (
    status === "Commande prête à être livrée." ||
    status === "Commande bien arrivée en Haiti." ||
    status === "Commande bien arrivée en Haïti."
  ) {
    const stillMovingInHaiti =
      region === "Ouest" ||
      region === "Centre" ||
      region === "Artibonite" ||
      region === "Nippes" ||
      region === "Nord'Ouest" ||
      region === "Sud" ||
      region === "Sud'Est" ||
      region === "Grand'Anse";
    return stillMovingInHaiti ? "warning" : "success";
  }
  return "brand";
};

const accentClasses: Record<Accent, { bar: string; chip: string; dot: string }> = {
  brand: {
    bar: "bg-brand-500",
    chip: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400",
    dot: "bg-brand-500",
  },
  warning: {
    bar: "bg-warning-500",
    chip: "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400",
    dot: "bg-warning-500",
  },
  success: {
    bar: "bg-success-500",
    chip: "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400",
    dot: "bg-success-500",
  },
};

// 3-stage progress used by the card Stepper: 1 = confirmed, 2 = en route
// (shipped / arrived in Haiti but not yet delivered), 3 = delivered.
const getStepIndex = (status: string): number => {
  if (status === "Commande a été livrée.") return 3;
  if (
    status === "Commande expédiée." ||
    status === "Commande prête à être livrée." ||
    status === "Commande bien arrivée en Haiti." ||
    status === "Commande bien arrivée en Haïti."
  ) {
    return 2;
  }
  return 1;
};

// Text is byte-for-byte the same copy the client already sees — only the
// chip styling changed (unified dot + pill using the accent tokens above).
const StatusBadge = (status: string, region: string) => {
  let label: string | null = null;

  if (status === "Commande expédiée.") {
    label = "Colis Expédié";
  } else if (status === "Commande a été livrée.") {
    label = "Colis Livré";
  } else if (status === "Expédition en attente.") {
    label = "Colis Confirmé";
  } else if (
    status === "Commande prête à être livrée." ||
    status === "Commande bien arrivée en Haiti." ||
    status === "Commande bien arrivée en Haïti."
  ) {
    label =
      getAccent(status, region) === "warning"
        ? "En transite en Haiti"
        : "Colis Disponible";
  }

  if (!label) return null;

  const { chip, dot } = accentClasses[getAccent(status, region)];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${chip}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
};

const CashBadge = (status: string) => {
  if (status === "Payé") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-400">
        <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
        {status}
      </span>
    );
  }
  if (status === "N/A") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-white/[0.05] dark:text-gray-300">
        <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-error-50 px-2.5 py-1 text-xs font-medium text-error-600 dark:bg-error-500/15 dark:text-error-400">
      <span className="h-1.5 w-1.5 rounded-full bg-error-500" />
      {status}
    </span>
  );
};

interface DecodedToken {
  sub?: string;
}

const getStatusLabel = (status: string, region: string) => {
  if (status === "Commande expédiée.") return "Colis expedie";
  if (status === "Commande a été livrée.") return "Colis livre";
  if (status === "Expédition en attente.") return "Colis confirme";
  if (
    status === "Commande prête à être livrée." ||
    status === "Commande bien arrivée en Haiti." ||
    status === "Commande bien arrivée en Haïti."
  ) {
    if (
      region === "Ouest" ||
      region === "Centre" ||
      region === "Artibonite" ||
      region === "Nippes" ||
      region === "Nord'Ouest" ||
      region === "Sud" ||
      region === "Sud'Est" ||
      region === "Grand'Anse"
    ) {
      return "En transit";
    }

    return "Disponible";
  }

  return status || "N/A";
};

// 3-stage progress indicator for a package card (Confirmé → Transit → Livré).
function Stepper({ step }: { step: number }) {
  const stages = ["Confirmé", "Transit", "Livré"];
  return (
    <div className="flex items-center">
      {stages.map((stage, i) => {
        const idx = i + 1;
        const done = idx <= step;
        return (
          <React.Fragment key={stage}>
            <div className="flex flex-col items-center gap-1">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  done
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-gray-200 bg-white text-gray-300 dark:border-white/10 dark:bg-white/[0.03]"
                }`}
              >
                {done && <Check className="size-3" />}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  done
                    ? "text-gray-700 dark:text-gray-300"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {stage}
              </span>
            </div>
            {idx < stages.length && (
              <span
                className={`mx-1 mb-4 h-0.5 flex-1 ${
                  idx < step ? "bg-brand-500" : "bg-gray-200 dark:bg-white/10"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// One icon-labeled row in a package card's info grid.
function InfoField({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 border-b border-gray-100 pb-2 dark:border-white/[0.05]">
      <Icon className="mt-0.5 size-3.5 shrink-0 text-gray-400 dark:text-gray-500" />
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase text-gray-400 dark:text-gray-500">
          {label}
        </p>
        <p className="truncate text-xs font-medium text-gray-700 dark:text-gray-300">
          {value}
        </p>
      </div>
    </div>
  );
}

// One icon-labeled inline field used by the list-view row.
function ListInfoField({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center gap-1.5 text-xs">
      <Icon className="size-3.5 shrink-0 text-gray-400 dark:text-gray-500" />
      <span className="shrink-0 text-gray-400 dark:text-gray-500">{label}:</span>
      <span className="truncate font-medium text-gray-700 dark:text-gray-300">
        {value}
      </span>
    </div>
  );
}

export default function ColisForm() {
  const { isOpen, openModal, closeModal } = useModal();
  const [code, setCode] = useState<string>("");
    const storedToken = localStorage.getItem("token");
    let decoded: DecodedToken | null = null;
  
    if (storedToken) {
      try {
        decoded = jwtDecode(storedToken);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  
  
  const searchUser = async () => {
  if (!decoded?.sub) return;

  try {
    const res = await getClient(decoded.sub);
    const client = res.data;

    setCode(client.usercode);
  } catch (error) {
    console.error("Failed to fetch client data:", error);
  }
};

  
    useEffect(() => {
      searchUser();
    }, []);
  
  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [recherche, setRecherche] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [details, setDetails] = useState<OrderDetails[]>([]);
  const [dashboardDetails, setDashboardDetails] = useState<OrderDetails[]>([]);
  const [selectedDetail, setSelectedDetail] = useState<OrderDetails | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<OrderDetailsPhoto[]>([]);
  
  // 🔐 BUG FIX: rapid page clicks (or any timing where an older request
  // happens to resolve after a newer one) used to let a stale response
  // overwrite the screen with the wrong page's data — since nothing tracked
  // which request was actually the latest. That's why it looked
  // inconsistent ("sometimes it works, sometimes it doesn't") rather than
  // reliably broken: it depended entirely on network timing. A request
  // sequence counter discards any response that isn't from the most
  // recently fired request.
  const fetchRequestId = useRef(0);

  // 🔐 BUG FIX: on a failed request (e.g. the backend 500s for a specific
  // page), this used to just console.error and leave `details`/`totalPages`
  // untouched — so the screen kept showing whichever page last loaded
  // successfully, with no indication anything had gone wrong. That's what
  // made the pagination look broken in a very specific, confusing way:
  // Suivant/Précédent past a page that errors would appear to "do nothing"
  // (page number changes, cards don't), because the fetch really did fail
  // silently. Now a failed page shows an explicit error state instead of
  // frozen stale data, with a retry button that just re-runs fetchDetails.
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchDetails = async (code: string) => {
    const requestId = ++fetchRequestId.current;
    try {
      const response =
        recherche.trim() === ""
          ? await myOrderDetailsList(code, page)
          : await searchmyOrderDetails(code, recherche, page);
      if (requestId !== fetchRequestId.current) return; // a newer request has since fired — ignore this stale response
      const data: PageResponse<OrderDetails> = response.data;
      setDetails(data.content);
      setTotalPages(data.totalPages);
      setFetchError(null);
    } catch (error) {
      if (requestId !== fetchRequestId.current) return;
      console.error("Error fetching order details:", error);
      setFetchError(
        "Impossible de charger cette page. Veuillez réessayer."
      );
    }
  };

  useEffect(() => {
  if (!code) return; // ⛔ tann code vini

  fetchDetails(code);
}, [page, code, recherche]);

  const fetchDashboardDetails = async (code: string) => {
    try {
      const response = await myOrderDetailsDashboard(code);
      const data: PageResponse<OrderDetails> = response.data;
      setDashboardDetails(data.content ?? []);
    } catch (error) {
      console.error("Error fetching dashboard order details:", error);
    }
  };

  useEffect(() => {
    if (!code) return;
    fetchDashboardDetails(code);
  }, [code]);

  const dashboardStats = React.useMemo(() => {
    const statusCounts = new Map<string, number>();
    let totalPounds = 0;
    let totalAmount = 0;
    let delivered = 0;
    let inTransit = 0;
    let paid = 0;

    dashboardDetails.forEach((detail) => {
      totalPounds += Number(detail.pounds || 0);
      totalAmount += Number(detail.subtotal || detail.price || 0);
      if (detail.status === "Commande a été livrée.") delivered += 1;
      if (
        detail.status === "Commande expédiée." ||
        detail.status === "Commande prête à être livrée." ||
        detail.status === "Commande bien arrivée en Haiti." ||
        detail.status === "Commande bien arrivée en Haïti."
      ) {
        inTransit += 1;
      }
      if (detail.condition === "Payé") paid += 1;

      const label = getStatusLabel(
        detail.status,
        detail.citypoundfee?.city?.region?.description ?? "N/A"
      );
      statusCounts.set(label, (statusCounts.get(label) ?? 0) + 1);
    });

    return {
      total: dashboardDetails.length,
      totalPounds,
      totalAmount,
      delivered,
      inTransit,
      paid,
      chartLabels: Array.from(statusCounts.keys()),
      chartSeries: Array.from(statusCounts.values()),
    };
  }, [dashboardDetails]);

  const chartOptions: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
    },
    labels: dashboardStats.chartLabels,
    legend: {
      position: "bottom",
      fontSize: "13px",
    },
    colors: ["#465FFF", "#12B76A", "#F79009", "#667085", "#7A5AF8"],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      width: 2,
      colors: ["#ffffff"],
    },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: () => `${dashboardStats.total}`,
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} colis`,
      },
    },
  };


  async function fetchGalleryPhotos(orderDetailsId: number): Promise<void> {
    try {
      const response = await getOrderDetailsPhotos(orderDetailsId);
      setGalleryPhotos(response.data ?? []);
    } catch (error) {
      console.error("Erreur lors du chargement de la galerie:", error);
      setGalleryPhotos([]);
    }
  }

  function handleOpenEditModal(detail: OrderDetails): void {
    setSelectedDetail(detail);
    fetchGalleryPhotos(detail.id);
    openModal();
  }

  const handleDownload = async (detail: OrderDetails) => {
    try {
        const response = await downloadFacture(code, detail?.ship.shiporder);
        // Créer un lien de téléchargement temporaire
        const url = globalThis.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        // 👉 Nom du fichier (adapter selon ton backend)
        link.setAttribute("download", `facture_${detail?.ship.shiporder}.pdf`);
        document.body.appendChild(link);
        link.click();
        // Nettoyage
        link.remove();
        globalThis.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Erreur lors du téléchargement :", error);
      }
    };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm transition hover:shadow-theme-md dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
              <PackageCheck className="size-5" />
            </span>
            <div>
              <p className="text-theme-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Total colis
              </p>
              <p className="mt-0.5 text-2xl font-semibold text-gray-800 dark:text-white/90">
                {dashboardStats.total}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm transition hover:shadow-theme-md dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400">
              <CheckCircle className="size-5" />
            </span>
            <div>
              <p className="text-theme-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Livres
              </p>
              <p className="mt-0.5 text-2xl font-semibold text-gray-800 dark:text-white/90">
                {dashboardStats.delivered}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm transition hover:shadow-theme-md dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400">
              <Truck className="size-5" />
            </span>
            <div>
              <p className="text-theme-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                En transit
              </p>
              <p className="mt-0.5 text-2xl font-semibold text-gray-800 dark:text-white/90">
                {dashboardStats.inTransit}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm transition hover:shadow-theme-md dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-gray-300">
              <Scale className="size-5" />
            </span>
            <div>
              <p className="text-theme-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Poids total
              </p>
              <p className="mt-0.5 text-2xl font-semibold text-gray-800 dark:text-white/90">
                {dashboardStats.totalPounds.toFixed(2)} lbs
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-white/[0.05] dark:bg-white/[0.03] lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Statut de mes colis
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Repartition des colis par statut
            </p>
          </div>
          {dashboardStats.chartSeries.length > 0 ? (
            <ReactApexChart
              options={chartOptions}
              series={dashboardStats.chartSeries}
              type="donut"
              height={260}
            />
          ) : (
            <div className="flex h-[260px] items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              Aucun colis pour afficher le graphique.
            </div>
          )}
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-white/[0.05] dark:bg-white/[0.03]">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Resume financier
          </h3>

          <div className="mt-4 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-white/70">
              Valeur estimee
            </p>
            <p className="mt-1 text-2xl font-semibold text-white">
              $US {dashboardStats.totalAmount.toFixed(2)}
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Colis payes
                </span>
                <span className="font-semibold text-gray-800 dark:text-white/90">
                  {dashboardStats.paid} / {dashboardStats.total}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-success-500"
                  style={{
                    width: `${
                      dashboardStats.total > 0
                        ? (dashboardStats.paid / dashboardStats.total) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  En attente
                </span>
                <span className="font-semibold text-gray-800 dark:text-white/90">
                  {Math.max(dashboardStats.total - dashboardStats.paid, 0)} /{" "}
                  {dashboardStats.total}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-warning-500"
                  style={{
                    width: `${
                      dashboardStats.total > 0
                        ? (Math.max(dashboardStats.total - dashboardStats.paid, 0) /
                            dashboardStats.total) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3 justify-end">
        <div>
          <div className="relative m-2">
            <Input
              placeholder="Rechercher vos colis..."
              type="text"
              className="pl-15"
              value={recherche}
              onChange={(e) => {
                setPage(0);
                setRecherche(e.target.value);
              }}
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400 ">
              <SearchIcon className="w-6 h-6 text-gray-500" />
            </span>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mt-4">
            <button
              disabled={page === 0}
              title="Afficher la page precedente"
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
            >
              Précédent
            </button>

            <span>
              Page {totalPages === 0 ? 0 : page + 1} / {totalPages}
            </span>

            <button
              disabled={totalPages === 0 || page + 1 >= totalPages}
              title="Afficher la page suivante"
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
            >
              Suivant
            </button>
          </div>
        </div>
        <div className="flex items-center justify-start mt-4 lg:justify-end">
          <div className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <button
              type="button"
              title="Affichage en grille"
              onClick={() => setViewMode("grid")}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                viewMode === "grid"
                  ? "bg-gray-100 text-gray-700 dark:bg-white/[0.08] dark:text-white"
                  : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              }`}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              title="Affichage en liste"
              onClick={() => setViewMode("list")}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                viewMode === "list"
                  ? "bg-gray-100 text-gray-700 dark:bg-white/[0.08] dark:text-white"
                  : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              }`}
            >
              <ListIcon className="size-4" />
            </button>
          </div>
        </div>
      </div>
      {fetchError ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-error-200 bg-error-50 p-6 text-center dark:border-error-500/20 dark:bg-error-500/10">
          <p className="text-sm font-medium text-error-600 dark:text-error-400">
            {fetchError}
          </p>
          <Button size="sm" onClick={() => fetchDetails(code)}>
            Réessayer
          </Button>
        </div>
      ) : (
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
            : "flex flex-col gap-3"
        }
      >
        {details.map((detail) => {
          const region = detail.citypoundfee?.city?.region?.description ?? "N/A";
          const accent = accentClasses[getAccent(detail.status, region)];

          if (viewMode === "list") {
            return (
              <div
                key={detail.id}
                className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-theme-sm transition hover:shadow-theme-md dark:border-white/[0.05] dark:bg-white/[0.03] sm:flex-row sm:items-center"
              >
                <span
                  className={`hidden h-10 w-1.5 shrink-0 rounded-full sm:block ${accent.bar}`}
                />

                <div className="min-w-[150px] shrink-0">
                  <h3 className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">
                    {detail.upc}
                  </h3>
                  <p className="mt-0.5 truncate text-[11px] text-gray-500 dark:text-gray-400">
                    Tracking: {detail.tracking ? detail.tracking : "N/A"}
                  </p>
                </div>

                <span className="inline-flex w-fit shrink-0 items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase text-gray-600 dark:bg-white/[0.05] dark:text-gray-300">
                  <MapPin className="size-3" />
                  {detail.citypoundfee?.city?.abreger ?? "N/A"}
                </span>

                <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3 lg:grid-cols-6">
                  <ListInfoField
                    icon={ClipboardList}
                    label="Commande"
                    value={detail.ship?.shiporder ?? "N/A"}
                  />
                  <ListInfoField
                    icon={Calendar}
                    label="Date"
                    value={detail.ship?.date ?? "N/A"}
                  />
                  <ListInfoField
                    icon={Building2}
                    label="Ville"
                    value={detail.citypoundfee?.city?.description ?? "N/A"}
                  />
                  <ListInfoField
                    icon={Tag}
                    label="Categorie"
                    value={detail.category?.description ?? "N/A"}
                  />
                  <ListInfoField
                    icon={Scale}
                    label="Poids"
                    value={`${detail.pounds} lbs`}
                  />
                  <ListInfoField
                    icon={DollarSign}
                    label="Prix"
                    value={`${detail.price ? detail.price : "0"} $US`}
                  />
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {CashBadge(detail.condition ? detail.condition : "N/A")}
                  {StatusBadge(detail.status, region)}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    size="sm"
                    className="p-2"
                    variant="outline"
                    title="Voir la photo et les details du colis"
                    onClick={() => handleOpenEditModal(detail)}
                  >
                    <FileImageIcon className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="p-2"
                    title="Telecharger la facture du colis"
                    onClick={() => handleDownload(detail)}
                  >
                    <DownloadIcon className="size-4" />
                  </Button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={detail.id}
              className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-sm transition hover:shadow-theme-md dark:border-white/[0.05] dark:bg-white/[0.03]"
            >
              <span className={`absolute inset-x-0 top-0 h-1 ${accent.bar}`} />

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">
                      {detail.upc}
                    </h3>
                    <p className="mt-0.5 truncate text-[11px] text-gray-500 dark:text-gray-400">
                      Tracking: {detail.tracking ? detail.tracking : "N/A"}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase text-gray-600 dark:bg-white/[0.05] dark:text-gray-300">
                    <MapPin className="size-3" />
                    {detail.citypoundfee?.city?.abreger ?? "N/A"}
                  </span>
                </div>

                <div className="mt-4">
                  <Stepper step={getStepIndex(detail.status)} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5">
                  <InfoField
                    icon={ClipboardList}
                    label="Code commande"
                    value={detail.ship?.shiporder ?? "N/A"}
                  />
                  <InfoField
                    icon={Calendar}
                    label="Date commande"
                    value={detail.ship?.date ?? "N/A"}
                  />
                  <InfoField
                    icon={Building2}
                    label="Ville"
                    value={detail.citypoundfee?.city?.description ?? "N/A"}
                  />
                  <InfoField
                    icon={Tag}
                    label="Categorie"
                    value={detail.category?.description ?? "N/A"}
                  />
                  <InfoField
                    icon={Scale}
                    label="Poids"
                    value={`${detail.pounds} lbs`}
                  />
                  <InfoField
                    icon={DollarSign}
                    label="Prix"
                    value={`${detail.price ? detail.price : "0"} $US`}
                  />
                  <InfoField
                    icon={Truck}
                    label="Date Livraison"
                    value={detail.delivery ? detail.delivery : "N/A"}
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {CashBadge(detail.condition ? detail.condition : "N/A")}
                  {StatusBadge(detail.status, region)}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Button
                    size="sm"
                    className="flex-1 justify-center p-2"
                    variant="outline"
                    title="Voir la photo et les details du colis"
                    onClick={() => handleOpenEditModal(detail)}
                  >
                    <FileImageIcon className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 justify-center p-2"
                    title="Telecharger la facture du colis"
                    onClick={() => handleDownload(detail)}
                  >
                    <DownloadIcon className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {details.length === 0 && (
          <div
            className={`rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-400 ${
              viewMode === "grid" ? "sm:col-span-2 xl:col-span-3" : ""
            }`}
          >
            Aucun colis trouve.
          </div>
        )}
      </div>
      )}
          <Modal
        isOpen={isOpen} onClose={closeModal}
        className="max-w-[900px] m-4"
      >
        <div className="relative max-h-[90vh] w-full max-w-[900px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
          <div className="mb-6">
            <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              Galerie du colis
            </h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {selectedDetail?.upc ?? "N/A"} - {galleryPhotos.length} photo{galleryPhotos.length > 1 ? "s" : ""} en galerie
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Photo principale
            </p>
            <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
                {selectedDetail?.picture ? (
                    <img
                      src={Lien.resolveFileUrl(selectedDetail?.picture)}
                      alt={`${selectedDetail?.picture}`}
                      className="max-h-[360px] w-full rounded-2xl object-contain"
                    />
                  ) : (
                    
                      <img src="/images/user/colis.png" alt="Default Colis Image" className="max-h-[260px] object-contain" />
                    
                  )}
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Photos de la galerie
              </p>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-white/[0.05] dark:text-gray-300">
                {galleryPhotos.length} photo{galleryPhotos.length > 1 ? "s" : ""}
              </span>
            </div>

            {galleryPhotos.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {galleryPhotos.map((photo) => (
                  <a
                    key={photo.id}
                    href={Lien.resolveFileUrl(photo.photo)}
                    target="_blank"
                    rel="noreferrer"
                    title="Ouvrir cette photo de la galerie"
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/[0.05] dark:bg-gray-900"
                  >
                    <img
                      src={Lien.resolveFileUrl(photo.photo)}
                      alt={`Photo galerie ${photo.id}`}
                      className="h-48 w-full object-cover"
                    />
                  </a>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500 dark:border-white/[0.08] dark:text-gray-400">
                Aucune autre photo ajoutée pour ce colis.
              </div>
            )}
          </div>

          
          <div className="flex items-center gap-3 px-2 mt-6 ">
            <Table>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                 <TableRow className="px-4">
                    <TableCell className="px-5 py-4 sm:px-6 text-end">
                      {" "}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-center">
                      {" "}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {" "}
                    </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Type Colis
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    :
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 ">
                    {selectedDetail?.type}
                  </TableCell>
                  <TableCell className=" py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Destination
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    :
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    {" "}{selectedDetail?.citypoundfee?.city?.description}
                </TableCell>

                </TableRow>
                <TableRow>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Expediteur
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    :
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 ">
                    {selectedDetail?.exp_name? selectedDetail?.exp_name:"N/A"}
                  </TableCell>
                  <TableCell className=" py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Expediteur Phone
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    :
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    {" "}{selectedDetail?.exp_phone?selectedDetail?.exp_phone:"N/A"}
                </TableCell>

                </TableRow>
                <TableRow>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    UPC Colis
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    :
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 ">
                    {selectedDetail?.upc}
                  </TableCell>
                  <TableCell className=" py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Tracking Number
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    :
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    {" "}{selectedDetail?.tracking?selectedDetail?.tracking:"N/A"}
                </TableCell>

                </TableRow>
                <TableRow>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Commande
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    :
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 ">
                    {selectedDetail?.ship.shiporder}
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Categorie
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    :
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                   {" "} {selectedDetail?.category?.description}
                </TableCell>
                  </TableRow>
                  <TableRow>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Poids
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    :
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 ">
                    {selectedDetail?.pounds} lbs
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Prix
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    :
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    {" "}{selectedDetail?.price ? selectedDetail?.price.toFixed(2) : "0"} $US
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Douane
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    :
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 ">
                    {selectedDetail?.douane ? selectedDetail?.douane.toFixed(2) : "0"} $US
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Sous Total
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    :
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    {" "}{selectedDetail?.subtotal ? selectedDetail?.subtotal.toFixed(2) : "0"} $US
                  </TableCell>
                </TableRow>
  
              </TableBody>
            </Table>
          </div>
        </div>
      </Modal>
    </>
  );
}
