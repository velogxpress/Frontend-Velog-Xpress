"use client";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import { useState, useEffect } from "react";
import { getFactureDetails } from "@/services/FactureDetailsService";
import { listFactures,searchFacture,printFactureA4,getFacture,whatsappFacture } from "@/services/FactureService";
import { SearchIcon} from "../../icons";
import { EyeIcon, PrinterIcon, DownloadIcon, MessageCircle, User2Icon, FactoryIcon, ReceiptText, Phone, Package, CircleDollarSign, ShieldCheck, WalletCards } from "lucide-react";
import { checkPrintAgentStatus } from "../../../services/printAgentService";
import { getTaux } from "@/services/TauxService";
import Avatar from "../ui/avatar/Avatar";
import AvatarText from "../ui/avatar/AvatarText";
import { toast } from "react-toastify";
import Lien from "@/route/BASE_URL";



interface Region {
  id: number;
  description: string;
}

interface Ville {
  id: number;
  description: string;
  region: Region;
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


interface Surcursal {
  id: number;
  name: string;
  address: string;
  ville: Ville;
  phone: string;
  horaire: string;
}

interface AgentSurcursal{
    id:number;
    client:Client;
    surcursal: Surcursal;
}

interface Facture{
  id:number;
  code:string;
  date:string;
  client:string;
  clientphone:string;
  amount:number;
  status:string;
  ship:Order;
  user:Client;
  tarif:number;
  assurance:number;
  discount:number;
  subtotal: number;
  balance?: number;
  effectif?: number;
  monnaie?: number;
  surcursal: AgentSurcursal;
}

interface FactureDetails{
    id:number;
    facture:Facture;
    colis:string;
    category:Category;
    description:string;
    fixedprice:number;
    pounds:number;
    fee:number;
    soubtotal:number;
}

interface Taux{
    id:number;
    devise: string;
    buy: number;
    sale: number;
    symbole: string;
}

const CashBadge = (status:string) => {
  if(status==="Payé"){
    return(
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        {status}
      </span>
    )
  }if(status==="N/A"){
    return(
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        {status}
      </span>
    )
  }else{
    return(
      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
        {status}
      </span>
    )
  }
}




 const notifyPrintAgentDown = () => {
        alert(
          "⛔ Le Print Agent n’est pas démarré. Veuillez le lancer avant d’imprimer."
        );
 };
  
 function detectRuntime() {
      const ua = navigator.userAgent;
  
      // ✅ JavaFX WebView Windows
      // Windows JavaFX WebView (flag ou mete a)
      if (
        (window as any).__WINDOWS_WEBVIEW__ === true ||
        /OperisDesktop|JAVAFX/i.test(navigator.userAgent)
      ) {
        return "WINDOWS_JAVAFX_WEBVIEW";
      }
  
  
      // Android WebView
      if ((window as any).AndroidApp) {
        return "ANDROID_WEBVIEW";
      }
  
      if (/wv|Android.*Version\/[\d.]+/i.test(ua)) {
        return "ANDROID_WEBVIEW";
      }
  
      // iOS WebView
      if (/iPhone|iPad|iPod/i.test(ua) && !/Safari/i.test(ua)) {
        return "IOS_WEBVIEW";
      }
  
      return "BROWSER";
 }
    
  function printLabel(type: string, base64: string) {
    document.title = `PRINT:${type}:${encodeURIComponent(base64)}`;
  }

  const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result.split(",")[1]);
      } else {
        reject("Invalid file type");
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // page actuelle
  size: number; // taille de page
  first: boolean;
  last: boolean;
}

function formatInternationalPhone(phone: string): string | null {
  if (!phone) return null;

  // retire tout sa ki pa chif
  let cleaned = phone.replace(/\D/g, "");

  // =========================
  // 🇭🇹 HAITI
  // =========================

  // Si li gen 509 devan
  if (cleaned.startsWith("509")) {
    const local = cleaned.substring(3);
    if (/^[2349]\d{7}$/.test(local)) {
      return `+509${local}`;
    }
  }

  // Si li gen 8 chif (Ayiti san prefix)
  if (/^[2349]\d{7}$/.test(cleaned)) {
    return `+509${cleaned}`;
  }

  // =========================
  // 🇺🇸 USA
  // =========================

  // Si li kòmanse pa 1
  if (cleaned.startsWith("1")) {
    const local = cleaned.substring(1);
    if (/^[2-9]\d{2}[2-9]\d{6}$/.test(local)) {
      return `+1${local}`;
    }
  }

  // Si li gen 10 chif (USA san prefix)
  if (/^[2-9]\d{2}[2-9]\d{6}$/.test(cleaned)) {
    return `+1${cleaned}`;
  }

  return null; // pa valab
}



export default function ControleFactureForm() {
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen:isSendOpen, openModal:openSendModal, closeModal:closeSendModal } = useModal();
  const [factures, setFactures] = useState<Facture[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [recherche, setRecherche] = useState("");
  const [editingFacture, setEditingFacture] = useState<Facture | null>(null);
  const [factureDetails, setFactureDetails] = useState<FactureDetails[]>([]);
  const [poids, setPoids] = useState(0);
  const [taux, setTaux] = useState<Taux | null>(null);
  const [selectedFactures, setSelectedFactures] = useState<Facture | null>(null);


  const fetchTaux = async () => {
    try {
      const response = await getTaux("Dollars US");
      
      setTaux(response.data);
    } catch (error) {
      console.error("Échec du chargement du taux de change:", error);
    }
  };

  useEffect(() => {
    fetchTaux();
  }, []);

  const fetchFactures = async (pageNumber: number) => {
    try {
      const response = await listFactures(pageNumber);
      setFactures(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Échec du chargement des agents surcursals:", error);
    }
  };

 

  useEffect(() => {
    if (recherche.trim() === "") {
      fetchFactures(page);
    } else {
      // Filter villes based on search term
      handleKeyUp();
    }
  }, [page, recherche]);


  const handleKeyUp = async () => {
    if (recherche.trim() === "") {
      fetchFactures(page);
    } else {
      // Filter villes based on search term
      try {
        const response = await searchFacture(recherche, page);
        setFactures(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Échec de la recherche des agents surcursals:", error);
      }
    }
  };

  

  function handleOpenModal(selectedFacture: Facture) {
    setEditingFacture(selectedFacture);
    openModal();
  }

   function handlePrintFacture(selectedFacture: Facture) {
      handlePrintLabel(selectedFacture?.code);
   }
  function handlePrintFactureA4(selectedFacture: Facture) {
      handleDownload(selectedFacture?.code);
   }

  const handlePrintLabel = async (upc: string): Promise<void> => {
          try {
            const runtime = detectRuntime();
            const running = await checkPrintAgentStatus();
  
            // const response = await printFacture(upc);
            const response: any = await getFacture(upc);
            const details = await getFactureDetails(upc, 0);
            const detList = details.data.content;

            const items = detList.map((det: FactureDetails) => ({
              id: det.id,
              colis: det.colis,
              category: det.category?.description,
              description: det.description,
              fixedprice: det.fixedprice,
              pounds: det.pounds,
              fee: det.fee,
              soubtotal: det.soubtotal
            }));

            const body = {
                  id:response.data.id,
                  code:response.data.code,
                  date:response.data.date,
                  client:response.data.client,
                  clientphone:response.data.clientphone,
                  amount:response.data.amount,
                  status:response.data.status,
                  ship:response.data.ship.shiporder,
                  user:response.data.user.name,
                  tarif:response.data.tarif,
                  assurance:response.data.assurance,
                  discount:response.data.discount,
                  subtotal:response.data.subtotal,
                  balance:response.data.balance,
                  effectif:response.data.effectif,
                  monnaie:Math.max(
                    (response.data.effectif ?? 0) -
                      ((response.data.amount ?? 0) - (response.data.discount ?? 0)),
                    0
                  ),
                  surcursal:response.data.surcursal.surcursal.name,
                  destination:response.data.destination,
                  taux:taux?.sale,
                  items: items
            }
  
            if (runtime === "BROWSER") {
              if (!running) {
                notifyPrintAgentDown();
                return;
              }
  
              await fetch("http://localhost:9100/print-json", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
              });

            } else if (runtime === "WINDOWS_JAVAFX_WEBVIEW") {
             // printLabel("ticket80", base64Pdf);
            } else {
              notifyPrintAgentDown();
            }
          } catch (error) {
            console.error("Erreur lors de l'impression :", error);
          }
  };

    const handleDownload = async (upc: string) => {
      try {
          const response = await printFactureA4(upc);
          // Créer un lien de téléchargement temporaire
          const url = globalThis.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          // 👉 Nom du fichier (adapter selon ton backend)
          link.setAttribute("download", `factureA4_${upc}.pdf`);
          document.body.appendChild(link);
          link.click();
          // Nettoyage
          link.remove();
          globalThis.URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Erreur lors du téléchargement :", error);
        }
      };
  
  
  
  const fecthFactureDetails = async (factureId:string) => {
    try {
      const response = await getFactureDetails(factureId,0);
      setFactureDetails(response.data.content);
    } catch (error) {
      console.error("Échec du chargement des détails de la facture:", error);
    }
  };

  useEffect(() => {
    if (editingFacture) {
      fecthFactureDetails(editingFacture.code);
    }
  }, [editingFacture]);

  useEffect(() => {
    const totalPoids = factureDetails.reduce((sum, detail) => sum + detail.pounds, 0);
    setPoids(totalPoids);
  }, [factureDetails]);


   async function handleNotifierWhatsapp(): Promise<void> {
    if (!selectedFactures?.clientphone) {
      toast.error("Le numéro de téléphone du destinataire est indisponible");
      return;
    }

     try {
          await whatsappFacture(selectedFactures?.code ?? "");
      
          const pdfFileName = `${selectedFactures?.code ?? ""}.pdf`;
          const pdfUrl = Lien.resolveFileUrl(encodeURIComponent(pdfFileName));
          const netAmount =
            (selectedFactures?.amount ?? 0) - (selectedFactures?.discount ?? 0);
          
          const message = `Bonjour ${selectedFactures?.client},\nNous vous informons que votre facture ${selectedFactures?.code} d’un montant de ${netAmount.toFixed(2)} USD est prête. Merci de votre confiance et de votre fidélité.\n\nVous pouvez consulter et télécharger votre facture ici:\n ${pdfUrl}`;
          const encodedMessage = encodeURIComponent(message);
          const whatsappUrl = `https://wa.me/${encodeURIComponent(formatInternationalPhone(selectedFactures?.clientphone) ?? "")}?text=${encodedMessage}`;
          window.open(whatsappUrl, "_blank","noopener,noreferrer");

    } catch (error) {
      console.error("Erreur lors de l'envoi du message WhatsApp:", error);
      toast.error("Échec de l'envoi du message WhatsApp");
    }
   }


  const handleOpenPrintFacture = (facture: Facture) => {
    setSelectedFactures(facture);
    openSendModal();
  }


  return (
    <>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
        <div>
          <div className="relative m-2">
            <Input
              placeholder="Recherche par catégorie..."
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
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {factures.map((facture) => (
          <div
            key={facture.id}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-theme-sm transition hover:shadow-theme-md dark:border-white/[0.05] dark:bg-white/[0.03]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <AvatarText name={facture.client || "Client"} />
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-gray-800 dark:text-white/90">
                    {facture.client ?? "N/A"}
                  </h3>
                  <p className="mt-1 truncate text-theme-xs text-gray-500 dark:text-gray-400">
                    {facture.clientphone ?? "N/A"}
                  </p>
                </div>
              </div>
              {CashBadge(facture.status)}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  Date
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {facture.date}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  Code
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {facture.code}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  Commande
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {facture.ship?.shiporder ?? "N/A"}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  Agent
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {facture?.user?.name ?? "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
              <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                Surcursal
              </p>
              <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                {facture?.surcursal?.surcursal?.name ?? "N/A"},{" "}
                {facture?.surcursal?.surcursal?.ville?.description ?? "N/A"}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <Button
                size="sm"
                className="p-2"
                variant="outline"
                title="Voir les details de cette facture"
                onClick={() => handleOpenModal(facture)}
              >
                <EyeIcon className="size-5" />
              </Button>
              <Button
                size="sm"
                className="p-2"
                variant="outline"
                title="Envoyer cette facture par WhatsApp"
                onClick={() => handleOpenPrintFacture(facture)}
              >
                <MessageCircle className="size-5" />
              </Button>
              <Button
                size="sm"
                className="p-2"
                variant="outline"
                title="Imprimer cette facture"
                onClick={() => handleOpenPrintFacture(facture)}
              >
                <PrinterIcon className="size-5" />
              </Button>
              <Button
                size="sm"
                className="p-2"
                variant="outline"
                title="Telecharger cette facture en format A4"
                onClick={() => handlePrintFactureA4(facture)}
              >
                <DownloadIcon className="size-5" />
                A4
              </Button>
            </div>
          </div>
        ))}

        {factures.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-400 md:col-span-2 xl:col-span-3">
            Aucune facture trouvee.
          </div>
        )}
      </div>
    
      <Modal isOpen={isOpen} onClose={closeModal} className="m-4 max-w-[960px]">
        <div className="no-scrollbar relative max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-gray-900">
          <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-blue-900 px-5 py-6 text-white sm:px-7"><div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20"><ReceiptText className="h-6 w-6" /></span><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">Détails de la facture</p><h4 className="mt-1 break-all text-xl font-semibold sm:text-2xl">{editingFacture?.code ?? "N/A"}</h4><div className="mt-2 flex flex-col gap-1 text-sm text-blue-100 sm:flex-row sm:items-center sm:gap-4"><span className="flex items-center gap-1.5"><User2Icon className="h-4 w-4" />{editingFacture?.client ?? "N/A"}</span><span className="flex items-center gap-1.5"><Phone className="h-4 w-4" />{editingFacture?.clientphone ?? "N/A"}</span></div></div></div></div>
          <div className="space-y-6 p-5 sm:p-7">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[{label:"Commande",value:editingFacture?.ship.shiporder ?? "N/A",icon:<Package className="h-4 w-4" />},{label:"Sous-total",value:`${editingFacture?.subtotal?.toFixed(2) ?? "0.00"} $US`,icon:<CircleDollarSign className="h-4 w-4" />},{label:"Assurance",value:`${editingFacture?.assurance?.toFixed(2) ?? "0.00"} $US`,icon:<ShieldCheck className="h-4 w-4" />},{label:"Montant total",value:`${editingFacture?.amount?.toFixed(2) ?? "0.00"} $US`,icon:<WalletCards className="h-4 w-4" />}].map(item => <div key={item.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">{item.icon}</span><p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-gray-400">{item.label}</p><p className="mt-1 break-words text-sm font-semibold text-gray-800 dark:text-white">{item.value}</p></div>)}
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-gray-200 p-4 dark:border-gray-800 sm:grid-cols-5">{[{label:"Montant reçu",value:editingFacture?.effectif},{label:"Monnaie",value:Math.max((editingFacture?.effectif ?? 0) - ((editingFacture?.amount ?? 0) - (editingFacture?.discount ?? 0)), 0)},{label:"Balance",value:editingFacture?.balance},{label:"Rabais",value:editingFacture?.discount},{label:"Poids total",value:poids,suffix:" lbs"}].map(item => <div key={item.label} className={item.label === "Monnaie" ? "rounded-xl bg-emerald-50 p-3 dark:bg-emerald-500/10" : "p-3"}><p className={`text-xs ${item.label === "Monnaie" ? "font-semibold text-emerald-600 dark:text-emerald-400" : "text-gray-400"}`}>{item.label}</p><p className={`mt-1 font-semibold ${item.label === "Monnaie" ? "text-emerald-700 dark:text-emerald-300" : "text-gray-700 dark:text-gray-200"}`}>{item.value?.toFixed(2) ?? "0.00"}{item.suffix ?? " $US"}</p></div>)}</div>
            <div><div className="mb-3 flex items-center justify-between"><h5 className="font-semibold text-gray-800 dark:text-white">Colis inclus</h5><span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">{factureDetails.length} colis</span></div>

          <form className="flex flex-col">
            <div className="custom-scrollbar max-h-[320px] overflow-x-auto overflow-y-auto rounded-2xl border border-gray-200 dark:border-gray-800">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Colis
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Trancking
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Catégorie
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Pounds
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Prix
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Frais Douane
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Sous-total
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody >
                  {factureDetails.map((detail) => (
                    <TableRow key={detail.id}>
                      <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        {detail?.colis ?? "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        {detail?.description ?? "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        {detail?.category?.description ?? "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        {detail?.pounds?.toFixed(2) ?? "0"} lbs
                      </TableCell>
                      <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        {detail?.fixedprice?.toFixed(2) ?? "0"} $US
                      </TableCell>
                      <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        {detail?.fee?.toFixed(2) ?? "0"} $US
                      </TableCell>
                      <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        {detail?.soubtotal?.toFixed(2) ?? "0"} $US
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </form></div>
          </div>
        </div>
      </Modal>
       <Modal
        isOpen={isSendOpen} onClose={closeSendModal}
        className="m-4 max-w-[680px]"
      >
        <div className="no-scrollbar relative max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-gray-900"><div className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white px-5 py-6 dark:border-gray-800 dark:from-white/[0.05] dark:to-transparent sm:px-7"><div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"><ReceiptText className="h-6 w-6" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">Facture prête</p><h4 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Choisir une méthode</h4><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Imprimez la facture ou partagez-la avec le client.</p></div></div></div><div className="space-y-6 p-5 sm:p-7"><div className="grid grid-cols-1 gap-3 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:grid-cols-2"><div><p className="text-xs uppercase tracking-wide text-gray-400">Numéro de facture</p><p className="mt-1 font-semibold text-gray-800 dark:text-white">{selectedFactures?.code ?? "N/A"}</p></div><div className="sm:border-l sm:border-gray-200 sm:pl-4 dark:sm:border-gray-700"><p className="text-xs uppercase tracking-wide text-gray-400">Client</p><p className="mt-1 font-semibold text-gray-800 dark:text-white">{selectedFactures?.client ?? "N/A"}</p><p className="text-sm text-gray-500">{selectedFactures?.clientphone ?? "N/A"}</p></div></div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><button type="button" onClick={() => handlePrintFacture(selectedFactures!)} className="group flex min-h-[165px] flex-col items-start rounded-2xl border-2 border-gray-200 p-5 text-left transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-brand-50/50 hover:shadow-lg dark:border-gray-700"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-600 group-hover:bg-brand-600 group-hover:text-white"><PrinterIcon className="h-5 w-5" /></span><span className="mt-4 font-semibold text-gray-900 dark:text-white">Imprimer la facture</span><span className="mt-1 text-sm text-gray-500 dark:text-gray-400">Préparer une copie papier.</span></button><button type="button" onClick={() => handleNotifierWhatsapp(selectedFactures!)} className="group flex min-h-[165px] flex-col items-start rounded-2xl border-2 border-gray-200 p-5 text-left transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-50/50 hover:shadow-lg dark:border-gray-700"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white"><MessageCircle className="h-5 w-5" /></span><span className="mt-4 font-semibold text-gray-900 dark:text-white">Envoyer par WhatsApp</span><span className="mt-1 text-sm text-gray-500 dark:text-gray-400">Partager la facture avec le client.</span></button></div><div className="flex justify-end border-t border-gray-100 pt-5 dark:border-gray-800"><Button size="sm" variant="outline" onClick={closeSendModal}>Fermer</Button></div></div>
        </div>
      </Modal>
    </>
  );
}
