"use client";
import React, { useState ,useEffect} from "react";
import Select from "../form/Select";
import { getlistOrders } from "@/services/OrderService";
import Button from "../ui/button/Button";
import { CalendarDays, DownloadIcon, FileBarChart, PackageCheck, PrinterIcon } from "lucide-react";
import { checkPrintAgentStatus } from "../../../services/printAgentService";
import { printRapportGeneral } from "@/services/OrderService";
import { toast } from 'react-toastify';

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


type Option = { label: string; value: string };

export default function RapportTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderObj, setSelectedOrderObj] = useState<Order | null>(null);

  const fetchOrders = async () => {
        try {
          const response = await getlistOrders(0);
    
          const data = Array.isArray(response.data)
            ? response.data
            : response.data?.content ?? [];
    
          setOrders(data);
        } catch (e) {
          console.error(e);
          setOrders([]);
        }
      };
   
    
      useEffect(() => {
        fetchOrders();
      }, []);
  
const orderOptions: Option[] = orders.map(r => ({
    label: r.shiporder+" | "+r.date+" | "+r.status,
    value: String(r.id),
  }));
  
function handleSelectOrderChange(value: number | string): void {
    const order = orders.find(
        (s) => s.id.toString() === value
      ) || null;
      setSelectedOrderObj(order);
}
  
const handlePrintLabel = async (
    upc: string
  ): Promise<void> => {
    try {
      const runtime = detectRuntime();
      const running = await checkPrintAgentStatus();
  
      const response = await printRapportGeneral(upc);
  
      if (!response?.data || !(response.data instanceof Blob)) {
        console.error("PDF introuvable ou mauvais type");
        return;
      }
  
      // 🔥 Blob → Base64 (CORRECT)
      const base64Pdf = await blobToBase64(response.data);
  
      if (!base64Pdf) {
        console.error("Base64 PDF introuvable");
        return;
      }
  
      if (runtime === "BROWSER") {
        if (!running) {
          notifyPrintAgentDown();
          return;
        }
  
        await fetch("http://localhost:9100/print", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "pdf",
            document: base64Pdf,
          }),
        });
      } else if (runtime === "WINDOWS_JAVAFX_WEBVIEW") {
        printLabel("pdf", base64Pdf);
      } else {
        notifyPrintAgentDown();
      }
    } catch (error) {
      console.error("Erreur lors de l'impression :", error);
    }
};
  
    const handleDownload = async (upc: string) => {
      try {
          const response = await printRapportGeneral(upc);
          // Créer un lien de téléchargement temporaire
          const url = globalThis.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          // 👉 Nom du fichier (adapter selon ton backend)
          link.setAttribute("download", `rapportgeneral_${upc}.pdf`);
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
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-r from-slate-50 via-white to-brand-50 px-5 py-6 dark:border-gray-800 dark:from-white/[0.04] dark:via-transparent dark:to-brand-500/[0.06] sm:px-6">
        <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-brand-100/60 dark:bg-brand-500/5" />
        <div className="relative flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-500/20"><FileBarChart className="h-6 w-6" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">Documents opérationnels</p><h3 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">Rapport Général</h3><p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">Sélectionnez une commande pour télécharger ou imprimer le rapport complet de ses opérations.</p></div></div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">1. Choisir une commande</label>
            <Select options={orderOptions} placeholder="Sélectionnez une commande" onChange={(value) => handleSelectOrderChange(value)} className="w-full dark:bg-dark-900" />
          </div>

          {selectedOrderObj ? <div className="grid grid-cols-2 gap-3 rounded-2xl border border-brand-100 bg-brand-50/50 p-4 dark:border-brand-500/15 dark:bg-brand-500/[0.06] sm:grid-cols-4"><div><p className="text-xs uppercase text-gray-400">Commande</p><p className="mt-1 font-semibold text-gray-800 dark:text-white">{selectedOrderObj.shiporder}</p></div><div><p className="flex items-center gap-1.5 text-xs uppercase text-gray-400"><CalendarDays className="h-3.5 w-3.5" /> Date</p><p className="mt-1 font-semibold text-gray-800 dark:text-white">{selectedOrderObj.date}</p></div><div><p className="flex items-center gap-1.5 text-xs uppercase text-gray-400"><PackageCheck className="h-3.5 w-3.5" /> Colis</p><p className="mt-1 font-semibold text-gray-800 dark:text-white">{selectedOrderObj.colisQty}</p></div><div><p className="text-xs uppercase text-gray-400">Statut</p><span className="mt-1 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-brand-600 shadow-theme-xs dark:bg-gray-900 dark:text-brand-400">{selectedOrderObj.status}</span></div></div> : <div className="rounded-xl border border-dashed border-gray-300 px-4 py-5 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">Les détails de la commande apparaîtront ici après la sélection.</div>}

          <div><p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">2. Choisir une action</p><div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
  
  <div className="w-full">
    <Button
      variant="outline" className="h-12 w-full whitespace-nowrap" startIcon={<DownloadIcon className="h-5 w-5" />}
      onClick={() => {
        if (selectedOrderObj) {
          handleDownload(selectedOrderObj.shiporder);
        }else{
          toast.error("Veuillez sélectionner une commande avant de télécharger.");
        }
      }}
    >
      Télécharger le rapport
    </Button>
  </div>

  {/* Imprimer */}
  <div className="w-full">
    <Button
      variant="primary" className="h-12 w-full whitespace-nowrap" startIcon={<PrinterIcon className="h-5 w-5" />}
      onClick={() => {
        if (selectedOrderObj) {
          handlePrintLabel(selectedOrderObj.shiporder);
        }else{
          toast.error("Veuillez sélectionner une commande avant d'imprimer.");
        }
      }}
    >
      Imprimer le rapport
    </Button>
  </div>

</div></div></div>
    </div>
  );
}
