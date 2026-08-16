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

import {
  DollarLineIcon,
  SearchIcon,
} from "../../icons";
import { useState, useEffect } from "react";
import { toast} from "react-toastify";

import { getlistOrders} from "../../../services/OrderService";
import { getOrderdetailsCity, updateColisStatus, getLivraisionDetailsCity, searchClientLivraison, searchOrderDetails } from "../../../services/OrderDetailsService"
import {getAgentSurcursal} from "../../../services/AgentsurcursalService";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Avatar from "../ui/avatar/Avatar";
import { createFacture,getFacture,whatsappFacture} from "../../../services/FactureService";
import { createFactureDetails,getFactureDetails } from "../../../services/FactureDetailsService";
import { checkPrintAgentStatus } from "../../../services/printAgentService";
import { getClient } from "@/services/RegisterService";
import { jwtDecode } from "jwt-decode";
import { PrinterIcon, MessageCircle, User2Icon, FactoryIcon, LocateIcon, Store, Truck, PackageCheck, MapPin, CircleDollarSign, ShieldCheck, WalletCards, ReceiptText } from "lucide-react";
import { getStore, updateStore } from "../../../services/StoreService";
import { getTaux } from "@/services/TauxService";
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
      douane: number | null;
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


interface Tag{
  id: number;
  description: string;
  qrcode: string;
}
interface Store{
  id: number;
  orderdetails: OrderDetails;
  tag: Tag;
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



export default function LivraisonForm() {
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
      //console.log("Taux de change chargé:", response.data);
      setTaux(response.data);
    } catch (error) {
      console.error("Échec du chargement du taux de change:", error);
    }
  };

  useEffect(() => {
    fetchTaux();
  }, []);


  
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isLocationModalOpen, openModal: openLocationModal, closeModal: closeLocationModal } = useModal();
  const { isOpen:isSendOpen, openModal:openSendModal, closeModal:closeSendModal } = useModal();
  const [recherche, setRecherche] = useState("");


  const [orders,setOrders]=useState<Order[]>([]);
  const [details,setDetails]=useState<OrderDetails[]>([]);
  const [shiporders,setShiporders]=useState<string | null>(null);
  const [qtycolis,setQtycolis]=useState<number | null>(0);
  const [qtypound,setQtypound]=useState<number | null>(0);
  const [expedition,setExpedition]=useState<string | null>("N/A");
  const [status, setStatus] = useState<string | null>("N/A");
  const [destination, setDestination] = useState<Ville[]>([]);
  const [selectedVilleId, setSelectedVilleId] = useState<number | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<OrderDetails | null>(null);
  const [surcursal, setSurcursal] = useState<AgentSurcursal | null>(null); 
  const [utilisateur, setUtilisateur] = useState<Client | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [destinationName, setDestinationName] = useState<string | null>(null);
  const [selectedFactures, setSelectedFactures] = useState<Facture | null>(null);

   
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const fetchSurcursal = async (codes:string) => {
    try {
      const response = await getAgentSurcursal(codes);
      setSurcursal(response.data);
    } catch (error) {
      console.error("Échec du chargement du surcursal:", error);
    }
  };

  const fetchUtilisateur = async (codes:string) => {
    try {
      const response = await getClient(codes);
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


useEffect(() => {
  fetchOrders();
}, []);

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

const orderOptions: Option[] = orders.map(r => ({
    label: r.shiporder+" | "+r.date+" | "+r.status,
    value: String(r.id),
  }));


const fetchOrderSelected = async (orderId: number,pageNumber: number) => {
  const order = orders.find((o) => o.id === orderId);
  if (!order) {
    console.warn("Order not found for id:", orderId);
    return;
  }

  setShiporders(order.shiporder);
  setQtycolis(order.colisQty);
  setQtypound(Number(order.poundQty.toFixed(2)));
  setExpedition(order.shipdate ?? "N/A");
  setStatus(order.status);
  setErrors({}); // Clear previous errors
};


const fetchOrderDetails = async (shiporder: string,cityID:Number) => {
  try {
    const response = await getLivraisionDetailsCity(shiporder,cityID);
    setDetails(response.data);
  } catch (error) {
    console.error("Échec du chargement des détails de la commande:", error);
  }
};
  

  
  
useEffect(() => {
  if (selectedVilleId !== null && selectedVilleId.toString().trim() !== "") {
      fetchOrderDetails(shiporders!, selectedVilleId!);
  }
}, [selectedVilleId, shiporders]);


 function handleSelectOrderChange(value: number | string): void {
  const orderId = Number(value);
   fetchOrderSelected(orderId, 0); // OK
   // Clear destination on order change
   fetchVille(shiporders!, 0);
}


  function handleKeyUp(): void {

    if (recherche.trim() === "") {
      return;
    }
    if (!shiporders || !selectedVilleId) {
      toast.error("Veuillez sélectionner une commande et une ville avant de rechercher.");
      return;
    }
    const response=searchClientLivraison(shiporders!,selectedVilleId!, recherche);
    response.then((res)=>{
      setDetails(res.data);
    }).catch((error)=>{
      console.error("Erreur de recherche du client:", error);
    }); 

  }
  //les programmations du details de la commande
  

const fetchVille = async (shiporder: string, pageNumber: number) => {
  try {
    const response = await getOrderdetailsCity(shiporder, pageNumber);

    const data = Array.isArray(response.data)
      ? response.data
      : response.data?.content ?? [];

  setDestination([]); // Clear previous destinations

    // 🔥 EXTRACTION SAFE DES VILLES
    const villes = data
      .filter((r: any) => r.citypoundfee?.city)
      .map((r: any) => r.citypoundfee.city);

    setDestination(villes);

  } catch (e) {
    console.error("fetchVille error:", e);
    setDestination([]);
  }
};


useEffect(() => {
  if (shiporders) {
    fetchVille(shiporders, 0);
  }
}, [shiporders]);

const villeOptions: Option[] = destination.map(r => ({
  label: r.abreger+" - "+r.description,
  value: String(r.id),
}));
  
function handleSelectVilleChange(value: number | string): void {
  const villeId = Number(value);
  setSelectedVilleId(villeId);
  fetchOrderDetails(shiporders!, villeId);
}
  

function handleOpenCashModal(detail: OrderDetails): void {
  openModal(); // Show warning modal about city mismatch
  setSelectedOrderId(detail);
  setDestinationName(detail.citypoundfee?.city.description || "N/A");
    
}

function handleOpenLocationModal(detail: OrderDetails): void {
  openLocationModal();
  getStore(detail.id).then((response) => {
    setSelectedStore(response.data);
  }).catch((error) => {
    console.error("Échec du chargement du store:", error);
  });
}

const savefacturedetails = async (facture: Facture) => {
  try {
    const response = await searchOrderDetails(
      shiporders!,
      selectedOrderId?.rec_name!,
      0
    );

    const orderDetailsList =
      Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.content)
        ? response.data.content
        : [];

    if (orderDetailsList.length === 0) {
      toast.warning("Aucun détail de commande trouvé");
      return;
    }

    await Promise.all(
      orderDetailsList.map(async (orderDetail: any) => {
        const factureDetailsData: FactureDetails = {
          id: 0,
          facture: facture,
          colis: orderDetail.upc,
          category: orderDetail.category!,
          description: orderDetail.tracking ?? "N/A",
          fixedprice: orderDetail.price ?? 0,
          pounds: orderDetail.pounds ?? 0,
          fee: orderDetail.douane ?? 0,
          soubtotal: orderDetail.subtotal ?? 0,
        };

        await createFactureDetails(factureDetailsData);
        setSelectedVilleId(orderDetail.citypoundfee?.city.id || null);
      })
    );

  } catch (error) {
    console.error("Erreur lors de la création des détails de la facture:", error);
    toast.error("Erreur lors de la création des détails de la facture");
  }
};


async function handleCreatefacture(): Promise<void> {
  if (!selectedOrderId) {
    toast.error("Aucune commande sélectionnée");
    return;
  }
  if (selectedOrderId.condition === "Payé") {
    updateColisStatus(selectedOrderId.rec_phone,selectedOrderId.ship.id).then((response) => {
      closeModal();
      // Refresh the details list
      if (shiporders && selectedVilleId) {
        fetchOrderDetails(shiporders, selectedVilleId);
      }
      const playloadStore = {
        orderdetails: selectedOrderId,
        tag: {
          id: selectedStore?.tag.id || 0,
          description: selectedStore?.tag.description || "N/A",
          qrcode: selectedStore?.tag.qrcode || "N/A",
        },
        status: "Livré",
      };  
      updateStore(selectedOrderId.id, playloadStore);
    }).catch((error)=>{
      console.error("Erreur lors de la mise à jour du statut du colis:", error);
      toast.error("Erreur lors de la mise à jour du statut du colis");
    });
    
  } else {
    try {
    // Create facture logic here
    const factureData = {
      client: selectedOrderId.rec_name,
      clientphone: selectedOrderId.rec_phone,
      amount: (selectedOrderId.subtotal+ (selectedOrderId.citypoundfee?.insurance?.amount ?? 0)),
      ship: selectedOrderId.ship,
      status: "Payé",
      user: utilisateur,
      tarif: 0,
      assurance: selectedOrderId.citypoundfee?.insurance?.amount ?? 0,
      discount: 0,
      subtotal: selectedOrderId.subtotal,
      balance: 0,
      effectif: (selectedOrderId.subtotal + (selectedOrderId.citypoundfee?.insurance?.amount ?? 0)),
      surcursal: surcursal!,
      destination: destinationName ?? "N/A",
    };
      const response = await createFacture(factureData);
      const facture = response.data as Facture;
      await savefacturedetails(facture);
      handleOpenPrintFacture(facture);
     // handlePrintLabel(facture.code);
      const playloadStore = {
        orderdetails: selectedOrderId,
        tag: {
          id: selectedStore?.tag.id || 0,
          description: selectedStore?.tag.description || "N/A",
          qrcode: selectedStore?.tag.qrcode || "N/A",
        },
        status: "Livré",
      };  
      updateStore(selectedOrderId.id, playloadStore);
    closeModal();
    // Refresh the details list
    if (shiporders && selectedVilleId) {
      fetchOrderDetails(shiporders, selectedVilleId);
    }
  } catch (error) {
    console.error("Erreur lors de la création de la facture:", error);
    toast.error("Erreur lors de la création de la facture");
  }
  
  }
  
}

async function handlePrintFacture(selectedFacture: Facture) {
      for (let copyIndex = 0; copyIndex < 3; copyIndex += 1) {
        await handlePrintLabel(selectedFacture?.code);
      }
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
          console.log("Response from whatsappFacture API:", response.data);
          const pdfUrl = Lien.resolveFileUrl(`${selectedFactures?.code}.pdf`);
          
          const message = `Bonjour ${selectedFactures?.client},\nNous vous informons que votre facture ${selectedFactures?.code} d’un montant de ${selectedFactures?.amount.toFixed(2)} USD est prête. Merci de votre confiance et de votre fidélité.\n\nVous pouvez consulter et télécharger votre facture ici:\n ${pdfUrl}`;
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
      <section className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#0e2269] via-[#183b8f] to-[#2458b8] px-6 py-7 text-white shadow-lg sm:px-8"><div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20"><Truck className="h-6 w-6" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">Distribution</p><h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Livraison des colis</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">Filtrez les factures, vérifiez le paiement et localisez rapidement chaque colis avant sa remise.</p></div></div></section>
      <div className="mb-5 grid grid-cols-1 gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03] lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">1. Commande</p><div className="relative">
            <Select
              options={orderOptions}
              placeholder="Sélectionnez une commande"
              onChange={(value) =>handleSelectOrderChange(value)}
            />
          </div>
          {errors["selectedOrderId"] && (
            <p className="mt-1 text-xs text-red-500">
              {errors["selectedOrderId"]}
            </p>
          )}
          {errors["qtycolis"] && (
            <p className="mt-1 text-xs text-red-500">
              {errors["qtycolis"]}
            </p>
          )}
          {errors["status"] && (
            <p className="mt-1 text-xs text-red-500">
              {errors["status"]}
            </p>
          )}
          {errors["expedition"] && (
            <p className="mt-1 text-xs text-red-500">
              {errors["expedition"]}
            </p>
          )}
          {errors["qtycolis"] && (
            <p className="mt-1 text-xs text-red-500">
              {errors["qtycolis"]}
            </p>
          )}
        </div>
        <div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">2. Succursale</p><div className="relative">
            <Select
              options={villeOptions}
              placeholder="Sélectionnez un surcursal"
              onChange={(value) =>handleSelectVilleChange(value)}
            />
        </div></div>
        <div>
       
        </div>
      </div>
      {/* Second Row */}
      <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Information de la commande
            </h4>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-white/[0.04]">
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Quantite de colis
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {qtycolis}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 dark:bg-white/[0.04]">
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Quantite de Poids
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {qtypound} lbs
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 dark:bg-white/[0.04]">
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Date Expedition
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {expedition}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 dark:bg-white/[0.04]">
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Status de la commande
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {status}
                </p>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      {/* End of Second Row */}
      <div className="mb-4 grid grid-cols-1 items-end gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:grid-cols-[minmax(0,1fr)_auto]">
    
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">3. Rechercher un client</p><div className="relative">
            <Input
              placeholder="Tapez le nom ou téléphone du client"
              type="text"
              className="pl-15"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              onKeyUp={() => handleKeyUp()}
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400 ">
              <SearchIcon className="w-6 h-6 text-gray-500" />
            </span>
          </div>
          {errors["recherche"] && (
            <p className="mt-1 text-xs text-red-500">
              {errors["recherche"]}
            </p>
          )}
        </div>

        <div>
          <div className="flex h-11 items-center rounded-lg bg-brand-50 px-4 dark:bg-brand-500/10">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              {details.length} Factures trouvées
            </h4>
          </div>
        </div>
    
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Client 
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Phone
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Qte Colis
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Poids
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
                    Sous Total
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Condition
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {details.map((detail) => (
                  <TableRow key={detail.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {detail.rec_name}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {detail.rec_phone}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {detail.upc} colis
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {detail.pounds.toFixed(2)} lbs
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {detail.douane?detail.douane:"0"} $US
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {detail.subtotal.toFixed(2)} $US
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {CashBadge(detail.condition?detail.condition:"N/A")}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                      <Button
                          size="sm"
                          className="p-2"
                          variant="outline"
                          onClick={() => handleOpenLocationModal(detail)}
                        >
                          <LocateIcon className="size-5" />
                        </Button>
                      <Button
                          size="sm"
                          className="p-2"
                          variant="outline"
                          onClick={() => handleOpenCashModal(detail)}
                        >
                          <DollarLineIcon className="size-5" />
                        </Button>
                        </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
       <Modal
        isOpen={isOpen} onClose={closeModal}
        className="m-4 max-w-[620px]"
      >
        <div className="no-scrollbar relative max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-gray-900"><div className="bg-gradient-to-br from-emerald-600 to-emerald-800 px-5 py-6 text-white sm:px-7"><div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15"><WalletCards className="h-6 w-6" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">Validation avant livraison</p><h4 className="mt-1 text-xl font-semibold sm:text-2xl">Information de paiement</h4><p className="mt-1 text-sm text-emerald-100">Contrôlez le statut et le montant avant de remettre le colis.</p></div></div></div><div className="space-y-5 p-5 sm:p-7"><div className="grid gap-3 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:grid-cols-3"><div><p className="text-xs uppercase text-gray-400">Client</p><p className="mt-1 font-semibold text-gray-800 dark:text-white">{selectedOrderId?.rec_name ?? "N/A"}</p><p className="text-sm text-gray-500">{selectedOrderId?.rec_phone ?? "N/A"}</p></div><div><p className="text-xs uppercase text-gray-400">Commande</p><p className="mt-1 font-semibold text-gray-800 dark:text-white">{selectedOrderId?.ship.shiporder ?? "N/A"}</p></div><div><p className="text-xs uppercase text-gray-400">Destination</p><p className="mt-1 font-semibold text-gray-800 dark:text-white">{destinationName ?? "N/A"}</p></div></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]"><CircleDollarSign className="h-5 w-5 text-brand-600" /><p className="mt-3 text-xs uppercase text-gray-400">Sous-total</p><p className="mt-1 font-semibold text-gray-800 dark:text-white">{selectedOrderId?.subtotal.toFixed(2) ?? "0.00"} $US</p></div><div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]"><ShieldCheck className="h-5 w-5 text-blue-600" /><p className="mt-3 text-xs uppercase text-gray-400">Assurance</p><p className="mt-1 font-semibold text-gray-800 dark:text-white">{selectedOrderId?.citypoundfee.insurance.amount.toFixed(2) ?? "0.00"} $US</p></div><div className="col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10 sm:col-span-1"><WalletCards className="h-5 w-5 text-emerald-600" /><p className="mt-3 text-xs uppercase text-emerald-600">Montant à payer</p><p className="mt-1 text-xl font-bold text-emerald-700 dark:text-emerald-300">{((selectedOrderId?.subtotal ?? 0) + (selectedOrderId?.citypoundfee?.insurance?.amount ?? 0)).toFixed(2)} $US</p></div></div><div className="flex flex-col gap-3 rounded-xl bg-gray-50 p-4 dark:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs uppercase text-gray-400">Statut de paiement</p><div className="mt-2">{CashBadge(selectedOrderId?.condition ?? "N/A")}</div></div><p className="max-w-xs text-sm text-gray-500 dark:text-gray-400">Confirmez uniquement après avoir vérifié le paiement et l’identité du client.</p></div><div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 dark:border-gray-800 sm:flex-row sm:justify-end"><Button size="sm" variant="outline" onClick={closeModal}>Annuler</Button><Button size="sm" variant="primary" onClick={() => handleCreatefacture()} startIcon={<PackageCheck className="h-5 w-5" />}>Confirmer payé et livré</Button></div></div>
        </div>
      </Modal>

       <Modal
        isOpen={isLocationModalOpen} onClose={closeLocationModal}
        className="max-w-[450px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[450px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Avatar src="/images/user/target.png" size="xxlarge" />
          </div>
          <div className="px-2  text-center">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 flex items-center justify-center">
              Location du colis
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              {selectedStore?.orderdetails?.rec_name ?? "N/A"} - {selectedStore?.orderdetails?.rec_phone ?? "N/A"} - {selectedStore?.orderdetails?.ship?.shiporder ?? "N/A"}
            </p>
          </div>
             <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                <div>
                  <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7 text-center">
                   Ce colis est actuellement au BIN:
                  </p>
                  <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 flex items-center justify-center">
                    {selectedStore?.tag?.description ?? "N/A"}
                  </h1>
                </div>
              </div>
        </div>
      </Modal>
      <Modal
        isOpen={isSendOpen} onClose={closeSendModal}
        className="m-4 max-w-[680px]"
      >
        <div className="no-scrollbar relative max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-gray-900">
          <div className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white px-5 py-6 dark:border-gray-800 dark:from-white/[0.05] dark:to-transparent sm:px-7"><div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"><ReceiptText className="h-6 w-6" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">Facture prête</p><h4 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Choisir une méthode</h4><p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">Imprimez la facture de livraison ou envoyez-la au client par WhatsApp.</p></div></div></div>
          <div className="space-y-6 p-5 sm:p-7">
            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:grid-cols-2"><div className="min-w-0"><p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400"><FactoryIcon className="h-3.5 w-3.5" /> Numéro de facture</p><p className="mt-1.5 truncate font-semibold text-gray-800 dark:text-white">{selectedFactures?.code ?? "N/A"}</p></div><div className="min-w-0 sm:border-l sm:border-gray-200 sm:pl-4 dark:sm:border-gray-700"><p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400"><User2Icon className="h-3.5 w-3.5" /> Client</p><p className="mt-1.5 truncate font-semibold text-gray-800 dark:text-white">{selectedFactures?.client ?? "N/A"}</p><p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{selectedFactures?.clientphone ?? "N/A"}</p></div></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><button type="button" onClick={() => handlePrintFacture(selectedFactures!)} className="group flex min-h-[170px] flex-col items-start rounded-2xl border-2 border-gray-200 p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-brand-400 hover:bg-brand-50/50 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white"><PrinterIcon className="h-5 w-5" /></span><span className="mt-4 font-semibold text-gray-900 dark:text-white">Imprimer la facture</span><span className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-400">Préparer une copie papier pour le client.</span><span className="mt-auto pt-4 text-xs font-semibold uppercase tracking-wide text-brand-600">Choisir l’impression</span></button><button type="button" onClick={() => handleNotifierWhatsapp(selectedFactures!)} className="group flex min-h-[170px] flex-col items-start rounded-2xl border-2 border-gray-200 p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-50/50 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-500/10 dark:border-gray-700"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white"><MessageCircle className="h-5 w-5" /></span><span className="mt-4 font-semibold text-gray-900 dark:text-white">Envoyer par WhatsApp</span><span className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-400">Partager rapidement la facture de livraison.</span><span className="mt-auto pt-4 text-xs font-semibold uppercase tracking-wide text-emerald-600">Choisir WhatsApp</span></button></div>
            <div className="flex justify-end border-t border-gray-100 pt-5 dark:border-gray-800"><Button size="sm" variant="outline" onClick={closeSendModal}>Fermer</Button></div>
          </div>
        </div>
      </Modal>
    </>
  );
}
