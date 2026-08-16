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
import Select from "../form/Select";
import Checkbox from "../form/input/Checkbox";
import Label from "../form/Label";

import {
  SearchIcon,
} from "../../icons";
import { useState, useEffect, useMemo } from "react";

import { getlistOrders} from "../../../services/OrderService";
import { findClientInOrderDetails,searchClientInOrderDetails,getClientInOrderDetails} from "../../../services/OrderDetailsService"
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import { createFacture,getFacture,whatsappFacture} from "../../../services/FactureService";
import { getAgentSurcursal } from "../../../services/AgentsurcursalService";
import { createQuickFactureDetails } from "../../../services/FactureDetailsService";
import { checkPrintAgentStatus } from "../../../services/printAgentService";
import { getClient } from "@/services/RegisterService";
import { ArrowLeftRight, Banknote, CalendarDays, CheckLineIcon, CircleDollarSign, FactoryIcon, Mail, MessageCircle, Package, PencilIcon, Phone, PrinterIcon, ReceiptText, ShieldCheck, Tag, User2Icon, WalletCards } from "lucide-react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { getTaux } from "@/services/TauxService";
import { getFactureDetails } from "@/services/FactureDetailsService";
import Lien from "@/route/BASE_URL";




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
  role: string;
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
    destination: string;
}

interface FactureDetails{
    id:number;
    facture:Facture;
    colis:string;
    category:Category | null;
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




type Option = { label: string; value: string };

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

export default function Facturation() {
  const [code, setCode] = useState<string>("");
      const storedToken = localStorage.getItem("token");
      let decoded: any = null;
    
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
    
const [taux, setTaux] = useState<Taux | null>(null);

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


  const { isOpen, openModal, closeModal } = useModal();
  const {isOpen: isPayerOpen,openModal: openPayerModal,closeModal: closePayerModal,} = useModal();
  const { isOpen: isClientOpen, openModal: openClientModal, closeModal: closeClientModal, } = useModal();
  const { isOpen:isSendOpen, openModal:openSendModal, closeModal:closeSendModal } = useModal();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [details, setDetails] = useState<OrderDetails[]>([]);
  const [surcursal, setSurcursal] = useState<AgentSurcursal | null>(null); 
  const [utilisateur, setUtilisateur] = useState<Client | null>(null);
  const [counter, setCounter] = useState<number>(0);
  const [filter, setFilter] = useState<string>("Payé");
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedTwo, setIsCheckedTwo] = useState(true);
  const [rechercheclient, setRechercheclient] = useState<string>("");
  const [montant, setMontant] = useState<number>(0);

  const [orderDetailClients, setOrderDetailClients] = useState<OrderDetails[]>([]);
  const [clientname, setClientname] = useState<string>("");
  const [clientemail, setClientemail] = useState<string>("");
  const [clientphone, setClientphone] = useState<string>("");

  const [upc, setUpc] = useState<string>("");
  const [tracking, setTracking] = useState<string>("");
  const [qte, setQte] = useState<number>(0);
  const [prix, setPrix] = useState<number>(0);
  const [douane, setDouane] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [effectif, setEffectif] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [monnaie, setMonnaie] = useState<number>(0);
  const [assurance, setAssurance] = useState<number>(0);
  const [destination, setDestination] = useState<string>("");
  const [selectedFactures, setSelectedFactures] = useState<Facture | null>(null);

  const [items, setItems] = useState<Array<{id: string;upc: string;tracking: string;qte: number;prix: number;douane: number;total: number;}>>([]);
  const [selectedItemDetail, setSelectedItemDetail] = useState<{id: string;upc: string;tracking: string;qte: number;prix: number;douane: number;total: number;} | null>(null);
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => b.id.localeCompare(a.id));
  }, [items]);
    
    const fetchSurcursal = async (codes:string) => {
      try {
        const response = await getAgentSurcursal(codes);
        // console.log("Surcursal chargé:", response.data);
        setSurcursal(response.data);
      } catch (error) {
        console.error("Échec du chargement du surcursal:", error);
      }
    };
  
    const fetchUtilisateur = async (codes:string) => {
      try {
        const response = await getClient(codes);
       // console.log("Utilisateur chargé:", response.data);
        setUtilisateur(response.data);
      } catch (error) {
        console.error("Échec du chargement de l'utilisateur:", error);
      }
    };
  
    useEffect(() => {
      if (code) {
        fetchSurcursal(code);
        fetchUtilisateur(code);
      }
    }, [code]);
  
  
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
  
  
  const fetchOrderSelected = async (orderId: number) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      console.warn("Order not found for id:", orderId);
      return;
    }
    setSelectedOrder(order);
  };

  function handleSelectOrderChange(value: number | string): void {
    const orderId = Number(value);
    setSelectedOrderId(orderId);
    fetchOrderSelected(orderId); // OK
  }
  
  const handleChecked = (name: string) => {
    setIsChecked(name === "Due");
    setIsCheckedTwo(name === "Payé");
    setFilter(name);
  };
  
  function handleCleanForm(): void {
    setSelectedOrder(null);
    setSelectedOrderId(null);
    setDetails([]);
    setCounter(0);
    setIsChecked(false);
    setIsCheckedTwo(true);
    setFilter("Payé");
    setMontant(0);
    setItems([]);
    setClientname("");
    setClientphone("");
    setClientemail("");
    setUpc("");
    setTracking("");
    setQte(0);
    setPrix(0);
    setDouane(0);
    setTotal(0);
    setEffectif(0);
    setDiscount(0);
    setBalance(0);
    setMonnaie(0);
  }

  const handleOpenClientModal = () => {
    if(!selectedOrderId){
      toast.error("Veuillez d'abord sélectionner une commande.");
      return;
    }
    openClientModal();
  };

  useEffect(() => {
    const fetchClients = async (orderId:number) => {
      try {
        const { data } = await findClientInOrderDetails(orderId);
        setOrderDetailClients(data);
      } catch (error) {
        console.error("Erreur récupération clients:", error);
      }
    };
    if (selectedOrderId) {
      fetchClients(selectedOrderId);
    }

  }, [selectedOrderId]);


  function handleSelectedClient(item: OrderDetails): void {
  setClientname(item.rec_name);
  setClientphone(item.rec_phone);
  setClientemail(item.rec_email || "");
    setAssurance(item.citypoundfee.insurance.amount || 0);
    setDestination(item.citypoundfee.city.description || "N/A");


  getClientInOrderDetails(selectedOrderId!, encodeURIComponent(item.rec_phone))
    .then((response) => {
      if (!Array.isArray(response.data)) {
        setItems([]);
        setCounter(0);
        setMontant(0);
        return;
      }
    setDetails(response.data);
      const newItems = response.data.map((data: any) => ({
        id: `${data.upc}-${crypto.randomUUID()}`,
        upc: data.upc,
        tracking: data.tracking,
        qte: data.pounds,
        prix: data.price ?? 0,
        douane: data.douane ?? 0,
        total: data.subtotal ?? 0,
      }));

      const montantFinal = calculerTotal(newItems);

      setItems(newItems);          // 🔁 remplace la liste
      setMontant(montantFinal);    // ✅ total juste
      setCounter(newItems.length);
    })
    .catch((error) => {
      console.error("Erreur lors de la recherche des clients :", error);
    })
    .finally(() => {
      closeClientModal();
    });
}



  function handleSearchClient(e: React.KeyboardEvent<HTMLInputElement>): void {
    const searchValue = (e.target as HTMLInputElement).value;
    setRechercheclient(searchValue);
    if(searchValue.trim() === ""){
      if (selectedOrderId) {
        const fetchClients = async (orderId:number) => {
          try {
            const { data } = await findClientInOrderDetails(orderId);
            setOrderDetailClients(data);
          } catch (error) {
            console.error("Erreur récupération clients:", error);
          }
        };
        fetchClients(selectedOrderId);
      }
      return;
    }

    searchClientInOrderDetails(selectedOrderId!,searchValue)
      .then((response) => {
        setOrderDetailClients(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la recherche des clients :", error);
      });
  
  }

  const calculerTotal = (list: typeof items) =>
  list.reduce((sum, item) => sum + (item.total ?? 0), 0);

  
  function handleEditItems(item: { id: string; upc: string; tracking: string; qte: number; prix: number; douane: number; total: number; }): void {
    setSelectedItemDetail(item);
    setUpc(item.upc);
    setTracking(item.tracking);
    setQte(item.qte);
    setPrix(item.prix);
    setDouane(item.douane);
    setTotal(item.total);
    openModal();
  }

type EditPayload = Partial<{
  upc: string;
  tracking: string;
  qte: number;
  prix: number;
  douane: number;
  total: number;
}>;

  const editItem = (id: string, changes: EditPayload) => {
  const updatedItems = items.map((item) =>
    item.id === id
      ? {
          ...item,
          ...changes,
          // sécurité : recalculer total si prix / qte / douane changent
          total:
            changes.total ??(changes.prix ?? item.prix) +
              (changes.douane ?? item.douane),
        }
      : item
  );

  const montantFinal = calculerTotal(updatedItems);

  setItems(updatedItems);
  setMontant(montantFinal);
  setCounter(updatedItems.length);
  closeModal();
  };
  
  const handleSumCash = () => {
  const newEffectif = effectif;
  const newMonnaie = newEffectif - ((montant +assurance) - discount);
  setMonnaie(Math.max(newMonnaie, 0));
  };
  
  
  const savefacturedetails = async (facture: Facture) => {
  
    if (items.length > 0) {
      items.forEach(async (item) => { 
        const detail = details.find(d => d.upc === item.upc);

        const factureDetailsData: FactureDetails = {
          id: 0,
          facture: facture,
          colis: item.upc,
          category: detail?.category ?? null, // ✅ category par UPC
          description: item.tracking ?? "N/A",
          fixedprice: item.prix ?? 0,
          pounds: item.qte,
          fee: item.douane ?? 0,
          soubtotal: item.total,
        };
        await createQuickFactureDetails(factureDetailsData)
      });   
    }
  };

  async function handleSafePay() {
    // Validation
    if (!selectedOrderId) {
      toast.error("Veuillez sélectionner une commande.");
      return;
    }

    if (!clientname.trim() || !clientphone.trim()) {
      toast.error("Veuillez renseigner le nom et le téléphone du client.");
      return;
    }

    if (items.length === 0) {
      toast.error("Aucun colis dans la facture.");
      return;
    }

    if (filter === "Payé" && effectif < montant - discount) {
      toast.error("Le montant reçu est insuffisant.");
      return;
    }

    setIsSaving(true);

    try {
      // Créer la facture
      const factureData = {
      client: clientname,
      clientphone: clientphone,
      amount: montant+assurance,
      ship: selectedOrder,
      status: filter,
      user: utilisateur,
      tarif: 0,
      assurance: assurance,
      discount: discount,
      subtotal: montant,
      balance: balance,
      effectif: effectif,
        surcursal: surcursal!,
        destination: destination? destination : "N/A",
      };
      const factureResponse = await createFacture(factureData);
     await savefacturedetails(factureResponse.data as Facture);
      // handlePrintLabel(factureResponse.data.code);
      handleOpenPrintFacture(factureResponse.data as Facture);
      closePayerModal();
      handleCleanForm();
     
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
      toast.error("Échec de la création de la facture.");
    } finally {
      setIsSaving(false);
    }
  }

  function handlePrintFacture(selectedFacture: Facture) {
      handlePrintLabel(selectedFacture?.code);
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
async function handleNotifierWhatsapp(): Promise<void> {
    if (!selectedFactures?.clientphone) {
      toast.error("Le numéro de téléphone du destinataire est indisponible");
      return;
    }

     try {
       const response = await whatsappFacture(selectedFactures?.code ?? "");
         // console.log("Response from whatsappFacture API:", response.data);
          const pdfFileName = `${selectedFactures?.code ?? ""}.pdf`;
          const pdfUrl = Lien.resolveFileUrl(encodeURIComponent(pdfFileName));
          
          const invoiceTotal = (selectedFactures?.amount ?? 0) - (selectedFactures?.discount ?? 0);
          const invoiceChange = Math.max((selectedFactures?.effectif ?? 0) - invoiceTotal, 0);
          const message = `Bonjour ${selectedFactures?.client},\nNous vous informons que votre facture ${selectedFactures?.code} d’un montant de ${invoiceTotal.toFixed(2)} USD est prête.\nMontant reçu : ${(selectedFactures?.effectif ?? 0).toFixed(2)} USD\nMonnaie : ${invoiceChange.toFixed(2)} USD\n\nMerci de votre confiance et de votre fidélité.\n\nVous pouvez consulter et télécharger votre facture ici:\n ${pdfUrl}`;
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
      <div className="space-y-5">
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0e2269] via-[#183b8f] to-[#2458b8] px-6 py-6 text-white shadow-lg shadow-brand-500/10 sm:px-8">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-emerald-400/10" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                <ReceiptText className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">Facturation</p>
                <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Créer une nouvelle facture</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                  Sélectionnez une commande, vérifiez les colis et complétez les informations du client.
                </p>
              </div>
            </div>
            <div className="flex min-w-[220px] items-center gap-3 rounded-xl bg-white/10 px-5 py-4 backdrop-blur-sm ring-1 ring-white/15">
              <CircleDollarSign className="h-6 w-6 text-emerald-300" />
              <div>
                <p className="text-xs uppercase tracking-wide text-blue-100">Montant actuel</p>
                <p className="mt-0.5 text-2xl font-semibold">{montant.toFixed(2)} $US</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-sm dark:border-white/[0.06] dark:bg-white/[0.03] xl:col-span-8">
            <div className="border-b border-gray-100 px-5 py-5 dark:border-white/[0.06] sm:px-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-brand-500" />
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Colis de la facture</h2>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Choisissez la commande à facturer puis contrôlez chaque ligne.</p>
                </div>
                <span className="inline-flex w-fit items-center rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                  {counter} {counter === 1 ? "colis" : "colis"}
                </span>
              </div>
              <div className="mt-4 max-w-md">
                <Select
                  options={orderOptions}
                  placeholder="Sélectionnez une commande"
                  onChange={(value) =>handleSelectOrderChange(value)}
                />
              </div>
            </div>

            <div className="custom-scrollbar min-h-[420px] max-w-full overflow-x-auto overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 border-b border-gray-100 bg-gray-50/95 backdrop-blur dark:border-white/[0.05] dark:bg-gray-900/95">
                  <TableRow>
                    {["UPC", "Tracking", "Qté / lbs", "Prix", "Douane", "Sous-total", ""].map((label) => (
                      <TableCell key={label || "actions"} isHeader className="whitespace-nowrap px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {sortedItems.map((item) => (
                    <TableRow key={item.id} className="transition-colors hover:bg-brand-50/40 dark:hover:bg-white/[0.025]">
                      <TableCell className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-800 dark:text-white/90">{item.upc}</TableCell>
                      <TableCell className="max-w-[180px] px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="block truncate" title={item.tracking}>{item.tracking || "N/A"}</span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">{item.qte}</TableCell>
                      <TableCell className="whitespace-nowrap px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{item.prix.toFixed(2)} $</TableCell>
                      <TableCell className="whitespace-nowrap px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{item.douane.toFixed(2)} $</TableCell>
                      <TableCell className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-800 dark:text-white/90">{item.total.toFixed(2)} $</TableCell>
                      <TableCell className="px-5 py-4 text-end">
                        <Button variant="outline" size="sm" className="p-2" onClick={() => handleEditItems(item)}>
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {sortedItems.length === 0 && (
                <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-white/[0.05]">
                    <Package className="h-7 w-7" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-gray-800 dark:text-white/90">Aucun colis sélectionné</h3>
                  <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">Sélectionnez une commande ci-dessus pour afficher les colis à inclure dans la facture.</p>
                </div>
              )}
            </div>
          </section>

          <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-white/[0.06] dark:bg-white/[0.03] sm:p-6 xl:col-span-4">
            <form className="flex h-full flex-col" onSubmit={(e) => e.preventDefault()}>
              <div className="flex items-center gap-3 border-b border-gray-100 pb-5 dark:border-white/[0.06]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                  <ReceiptText className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Résumé de la facture</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Informations et statut du paiement</p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-brand-100 bg-brand-50/70 p-4 dark:border-brand-500/20 dark:bg-brand-500/10">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-brand-600 dark:text-brand-400">Total à facturer</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{montant.toFixed(2)} $US</p>
                  </div>
                  <CircleDollarSign className="h-8 w-8 text-brand-500" />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <Label>Date facture</Label>
                  <div className="relative mt-1.5">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input type="text" className="w-full pl-10" placeholder="Date facture" value={new Date().toLocaleDateString()} disabled />
                  </div>
                </div>

                <div>
                  <Label>Informations du client</Label>
                  <div className="relative mt-1.5">
                    <Input type="text" className="pl-11 pr-11" placeholder="Nom du client" value={clientname} onChange={(e) => setClientname(e.target.value)} />
                    <User2Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <button type="button" title="Rechercher un client" onClick={handleOpenClientModal} className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-400">
                      <SearchIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input type="text" className="w-full pl-10" placeholder="Téléphone du client" value={clientphone} onChange={(e) => setClientphone(e.target.value)} />
                </div>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input type="text" className="w-full pl-10" placeholder="Email du client" value={clientemail} onChange={(e) => setClientemail(e.target.value)} />
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-gray-200 p-4 dark:border-white/[0.08]">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Type de facture</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Checkbox checked={isCheckedTwo} onChange={() => handleChecked("Payé")} label="Payé" />
                  <Checkbox checked={isChecked} onChange={() => handleChecked("Due")} label="Due" />
                </div>
              </div>

              <div className="mt-auto flex flex-col-reverse gap-3 pt-7 sm:flex-row sm:justify-end">
                <Button size="sm" variant="outline" onClick={handleCleanForm}>Annuler</Button>
                {((utilisateur?.role === "Admin") || (utilisateur?.role === "Agent" && surcursal?.surcursal?.name === "International")) && (
                  <Button size="sm" variant="primary" onClick={openPayerModal}>Continuer</Button>
                )}
              </div>
            </form>
          </aside>
        </div>
      </div>
      <Modal
        isOpen={isClientOpen}
        onClose={closeClientModal}
        className="max-w-[900px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[900px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2  text-center">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 ">
              Consultation des clients
            </h4>
            <div className="relative w-full mb-2">
              <Input
                placeholder="Recherchez un client par nom, email ou téléphone"
                type="text"
                className="pl-[62px]"
                value={rechercheclient}
                onChange={(e) => setRechercheclient(e.target.value)}
                onKeyUp={handleSearchClient}
              />
              <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500">
                <SearchIcon className="size-6" />
              </span> 
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="max-w-full overflow-x-auto">
                <div className="custom-scrollbar h-[350px] overflow-y-auto px-2 pb-3">
                  <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableRow>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          NOM CLIENT
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          EMAIL
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          TELEPHONE
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          VILLE
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          {""}
                        </TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {orderDetailClients.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {item.rec_name}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {item.rec_email}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {item.rec_phone}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {item?.citypoundfee?.city?.description ? item.citypoundfee.city.description : "N/A"}
                          </TableCell>

                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            <Button
                              variant="outline"
                              size="sm"
                              className="m-2"
                              startIcon={<CheckLineIcon />}
                              onClick={() => handleSelectedClient(item)}
                            >
                              {" "}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[1020px] m-4">
        <div className="no-scrollbar relative w-full max-w-[1020px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Éditer le colis {selectedItemDetail?.upc}
            </h4>
          </div>

          <form
            className="flex flex-col"
            onSubmit={(e)=>e.preventDefault()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
          >
            <div className="custom-scrollbar h-[200px] overflow-y-auto px-2 pb-3">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
                <div>
                  <Label>UPC</Label>
                  <Input
                    type="text"
                    value={upc}
                    onChange={(e) =>
                      setUpc(e.target.value)
                    }
                    placeholder="Entrez l'UPC"
                  />
                </div>
                <div>
                  <Label> Tracking</Label>
                  <Input
                    type="text"
                    value={tracking??""}
                    onChange={(e) =>
                      setTracking(e.target.value)
                    }
                    placeholder="Entrez le tracking"
                  />
                </div>
                <div>
                  <Label> Qte Lbs</Label>
                  <Input
                    type="number"
                    step={0.01}
                    value={qte??0}
                    onChange={(e) =>
                      setQte(Number(e.target.value))
                    }
                    placeholder="Entrez la quantité en livres"
                    // required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
                <div>
                  <Label>Prix</Label>
                  
                  <Input
                    type="number"
                    step={0.01}
                    value={prix??0}
                    onChange={(e) =>setPrix(Number(e.target.value))}
                    placeholder="Entrez le recepteur"
                    // required
                    />
                </div>
                <div>
                  <Label>Frais Douane</Label>
                  <Input
                    type="number"
                    step={0.01}
                    value={douane??0}
                    onChange={(e) =>
                      setDouane(Number(e.target.value))
                    }
                    placeholder="Entrez le frais de douane"
                    // required
                  />
                </div>
                <div>
                  <Label> Sous Total</Label>
                  <Input
                    type="number"
                    step={0.01}
                    value={total??0}
                    onChange={(e) =>
                      setTotal(Number(e.target.value))
                    }
                    placeholder="Entrez le sous total"
                    // required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline">
                Annuler
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  if (!selectedItemDetail) return;

                  const payload: any = {};

                  if (upc !== undefined && upc !== "") payload.upc = upc;
                  if (tracking !== undefined && tracking !== "") payload.tracking = tracking;
                  if (qte !== undefined) payload.qte = qte;
                  if (prix !== undefined) payload.prix = prix;
                  if (douane !== undefined) payload.douane = douane;

                  editItem(selectedItemDetail.id, payload);
                }}
              >
                Modifier
              </Button>

            </div>
          </form>
        </div>
      </Modal>
       <Modal
        isOpen={isPayerOpen}
        onClose={closePayerModal}
        className="m-4 max-w-[720px]"
      >
        <div className="no-scrollbar relative max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-gray-900">
          <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-blue-900 px-5 py-6 text-white sm:px-7">
            <div className="absolute -right-10 -top-14 h-40 w-40 rounded-full bg-white/10" />
            <div className="relative flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20"><WalletCards className="h-6 w-6" /></span>
              <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">Encaissement</p><h4 className="mt-1 text-xl font-semibold sm:text-2xl">Paiement de la facture</h4><p className="mt-1 text-sm text-blue-100">Vérifiez les montants avant de confirmer.</p></div>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-7">
            <section>
              <div className="mb-3 flex items-center justify-between"><h5 className="font-semibold text-gray-800 dark:text-white/90">Résumé de la facture</h5><span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 dark:bg-white/[0.06] dark:text-gray-400">USD</span></div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10"><Banknote className="h-4 w-4" /></span><p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-400">Sous-total</p><p className="mt-1 text-lg font-semibold text-gray-800 dark:text-white">{montant.toFixed(2)} <span className="text-xs font-medium text-gray-400">$US</span></p></div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/10"><ShieldCheck className="h-4 w-4" /></span><p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-400">Assurance</p><p className="mt-1 text-lg font-semibold text-gray-800 dark:text-white">{assurance.toFixed(2)} <span className="text-xs font-medium text-gray-400">$US</span></p></div>
                <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-500/20 dark:bg-brand-500/10"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"><CircleDollarSign className="h-4 w-4" /></span><p className="mt-3 text-xs font-medium uppercase tracking-wide text-brand-500">Montant total</p><p className="mt-1 text-xl font-bold text-brand-700 dark:text-brand-300">{(montant+assurance).toFixed(2)} <span className="text-xs font-medium">$US</span></p></div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800 sm:p-5">
              <h5 className="mb-4 font-semibold text-gray-800 dark:text-white/90">Détails de l’encaissement</h5>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div><Label><span className="mb-1.5 flex items-center gap-2"><Banknote className="h-4 w-4 text-emerald-600" /> Montant reçu ($US)</span></Label><Input type="number" step={0.01} className="w-full text-base font-semibold" value={effectif} onChange={(e) => setEffectif(Number(e.target.value))} onKeyUp={handleSumCash} /></div>
                <div><Label><span className="mb-1.5 flex items-center gap-2"><Tag className="h-4 w-4 text-amber-600" /> Rabais ($US)</span></Label><Input type="number" step={0.01} className="w-full text-base font-semibold" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} onKeyUp={handleSumCash} /></div>
              </div>
              <div className="mt-4 flex flex-col gap-3 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-500/10 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"><ArrowLeftRight className="h-4 w-4" /></span><div><p className="text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Monnaie retournée</p><p className="text-xs text-gray-500 dark:text-gray-400">Montant à remettre au client</p></div></div><p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{monnaie.toFixed(2)} <span className="text-sm font-medium">$US</span></p></div>
            </section>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 dark:border-gray-800 sm:flex-row sm:justify-end">
            <Button size="sm" variant="outline" onClick={closePayerModal} disabled={isSaving}>Annuler</Button>
            <Button
              size="sm"
              variant="primary"
              className="sm:min-w-[210px]"
              disabled={isSaving}
              onClick={() => {
                handleSafePay();
              }}
            >
              {isSaving ? "Paiement en cours..." : "Confirmer le paiement"}
            </Button>
          </div>
          </div>
        </div>
      </Modal>
       <Modal
        isOpen={isSendOpen} onClose={closeSendModal}
        className="m-4 max-w-[680px]"
      >
        <div className="no-scrollbar relative max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-gray-900">
          <div className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white px-5 py-6 dark:border-gray-800 dark:from-white/[0.05] dark:to-transparent sm:px-7">
            <div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"><ReceiptText className="h-6 w-6" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">Facture prête</p><h4 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Choisir une méthode</h4><p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">Imprimez la facture immédiatement ou envoyez-la au client par WhatsApp.</p></div></div>
          </div>

          <div className="space-y-6 p-5 sm:p-7">
            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:grid-cols-2">
              <div className="min-w-0"><p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400"><FactoryIcon className="h-3.5 w-3.5" /> Numéro de facture</p><p className="mt-1.5 truncate font-semibold text-gray-800 dark:text-white" title={selectedFactures?.code ?? "N/A"}>{selectedFactures?.code ?? "N/A"}</p></div>
              <div className="min-w-0 sm:border-l sm:border-gray-200 sm:pl-4 dark:sm:border-gray-700"><p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400"><User2Icon className="h-3.5 w-3.5" /> Client</p><p className="mt-1.5 truncate font-semibold text-gray-800 dark:text-white" title={selectedFactures?.client ?? "N/A"}>{selectedFactures?.client ?? "N/A"}</p><p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{selectedFactures?.clientphone ?? "N/A"}</p></div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button type="button" onClick={() => handlePrintFacture(selectedFactures!)} className="group flex min-h-[170px] flex-col items-start rounded-2xl border-2 border-gray-200 p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-brand-400 hover:bg-brand-50/50 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:hover:border-brand-600 dark:hover:bg-brand-500/[0.06]"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-500/15 dark:text-brand-400"><PrinterIcon className="h-5 w-5" /></span><span className="mt-4 font-semibold text-gray-900 dark:text-white">Imprimer la facture</span><span className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-400">Préparer une copie papier pour le client.</span><span className="mt-auto pt-4 text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">Choisir l’impression</span></button>
              <button type="button" onClick={() => handleNotifierWhatsapp(selectedFactures!)} className="group flex min-h-[170px] flex-col items-start rounded-2xl border-2 border-gray-200 p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-50/50 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-500/10 dark:border-gray-700 dark:hover:border-emerald-600 dark:hover:bg-emerald-500/[0.06]"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-500/15 dark:text-emerald-400"><MessageCircle className="h-5 w-5" /></span><span className="mt-4 font-semibold text-gray-900 dark:text-white">Envoyer par WhatsApp</span><span className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-400">Partager rapidement la facture avec le client.</span><span className="mt-auto pt-4 text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Choisir WhatsApp</span></button>
            </div>

            <div className="flex justify-end border-t border-gray-100 pt-5 dark:border-gray-800"><Button size="sm" variant="outline" onClick={closeSendModal}>Fermer</Button></div>
          </div>
        </div>
      </Modal>
    </>
  );
}
