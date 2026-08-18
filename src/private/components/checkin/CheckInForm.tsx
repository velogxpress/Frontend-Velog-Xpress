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
  SearchIcon,
} from "../../icons";
import { useState, useEffect } from "react";
import { SkeletonTableRows } from "../ui/skeleton/Skeleton";
import { toast} from "react-toastify";

import { getlistOrders} from "../../../services/OrderService";
import { updateReceiveOrderDetails,getOrderdetailsCity,updateOrderDetailsStatus,surcursalOrderDetails} from "../../../services/OrderDetailsService"
import { BellDotIcon, ClipboardCheck, MailIcon, MapPin, MessageCircle, PackageCheck, PhoneIcon, ThumbsUpIcon, Truck } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Avatar from "../ui/avatar/Avatar";



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

  const rowBadge = (status:string) => {
  if (status == "Commande prête à être livrée." || status==="Commande a été livrée.") {
      return "bg-success-100";
  } else {
    return "bg-error-100";
    }
  }

  const StatusBadge = (status:string) => {
  if(status==="Commande expédiée."){
    return "Colis Expédié";
  }else if(status==="Commande a été livrée."){
    return "Colis Livré";
  }else if(status==="Expédition en attente."){
    return "Colis en attente";
      
  }else if (status == "Commande bien arrivée en Haiti." || status == "Commande bien arrivée en Haïti.") {
    return "Colis Disponible";
  }else if (status == "Commande prête à être livrée." ) {
    return "Client informé";
  }
}



type Option = { label: string; value: string };

export default function ReceptionForm() {

  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen:isSendOpen, openModal:openSendModal, closeModal:closeSendModal } = useModal();
  const [recherche, setRecherche] = useState("");
  


  const [orders,setOrders]=useState<Order[]>([]);
  const [details,setDetails]=useState<OrderDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shiporders,setShiporders]=useState<string | null>(null);
  const [qtycolis,setQtycolis]=useState<number | null>(0);
  const [qtypound,setQtypound]=useState<number | null>(0);
  const [expedition,setExpedition]=useState<string | null>("N/A");
  const [status, setStatus] = useState<string | null>("N/A");
  const [destination, setDestination] = useState<Ville[]>([]);
  const [selectedVilleId, setSelectedVilleId] = useState<number | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<OrderDetails | null>(null);

   
const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
  setIsLoading(true);
  try {
    const response = await surcursalOrderDetails(shiporder,cityID);
    setDetails(response.data);
  } catch (error) {
    console.error("Échec du chargement des détails de la commande:", error);
  } finally {
    setIsLoading(false);
  }
};
  

  
  
useEffect(() => {
  if (selectedVilleId !== null && selectedVilleId.toString().trim() !== "") {
      fetchOrderDetails(shiporders!, selectedVilleId!);
  }
}, [selectedVilleId]);


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
    const response = updateReceiveOrderDetails(recherche, selectedVilleId!);
    response.then((res) => {
      if (res.data === "Success!") {
        // Refresh order details
        fetchOrderDetails(shiporders!, selectedVilleId!);
        setRecherche("");
      } else if (res.data === "Wrong city"){
        openModal();
        setRecherche("");
      }
    }).catch((error) => {
      console.error("Erreur lors de la réception du colis:", error);
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
  

  async function handleConfirmOrder(): Promise<void> {
    // Validate that an order is selected
    const newErrors: { [key: string]: string } = {};
    
    if (recherche === null) {
      newErrors["recherche"] = "Veuillez sélectionner une commande";
      setErrors(newErrors);
      return;
    }

    if (details.length === 0) {
      newErrors["recherche"] = "Aucun détail de commande à confirmer";
      setErrors(newErrors);
      return;
    }

    try {
      const response = await updateOrderDetailsStatus(recherche);
      if (response.data!=="Success!") {
        throw new Error("Échec de la mise à jour du statut des détails de la commande");
      } else {
        toast.success(`Réception confirmée pour la commande ${details[0]?.ship.shiporder} avec ${details[0]?.ship.colisQty} colis`);
      
        // Refresh the data
        await fetchOrders();
      
        // Clear selection
        setShiporders(null);
        setQtycolis(0);
        setQtypound(0);
        setExpedition("N/A");
        setStatus("N/A");
        setDetails([]);
        setDestination([]);
        setRecherche("");
        setErrors({});
      }
      
    } catch (error) {
      console.error("Erreur lors de la confirmation de réception:", error);
      newErrors["recherche"] = "Échec de la confirmation de réception";
      setErrors(newErrors);
    }
  }


  function handleSendFacture(details: OrderDetails): void {
    if (!details) {
      toast.error("Aucun détail de commande à envoyer");
      return;
    }
    setSelectedOrderId(details);
    openSendModal();
  }

  async function hadleNotifierEmail(): Promise<void> {
    
    if (!selectedOrderId?.rec_email) {
      toast.error("L'adresse email du destinataire est indisponible");
      return;
    }

    const response = updateReceiveOrderDetails(selectedOrderId?.upc, selectedVilleId!);
    response.then((res) => {
      if (res.data !== "Wrong city") {
        // Refresh order details
        fetchOrderDetails(shiporders!, selectedVilleId!);
        toast.success(`Notification email envoyée à ${selectedOrderId?.rec_email}`);
      } else if (res.data === "Wrong city"){
        openModal();
      }
    }).catch((error) => {
      console.error("Erreur lors de la réception du colis:", error);
      toast.error("Échec de l'envoi de l'email de notification");
    });
  }

  async function handleNotifierWhatsapp(): Promise<void> {
    if (!selectedOrderId?.rec_phone) {
      toast.error("Le numéro de téléphone du destinataire est indisponible");
      return;
    }

    try {
       const response = updateReceiveOrderDetails(selectedOrderId?.upc, selectedVilleId!);
      response.then((res) => {
        if (res.data !== "Wrong city") {
          // Refresh order details
          fetchOrderDetails(shiporders!, selectedVilleId!);
          const message = `Bonjour ${selectedOrderId?.rec_name},\n ${res.data}`;
          const encodedMessage = encodeURIComponent(message);
          const whatsappUrl = `https://wa.me/${encodeURIComponent(formatInternationalPhone(selectedOrderId?.rec_phone) ?? "")}?text=${encodedMessage}`;
          window.open(whatsappUrl, "_blank","noopener,noreferrer");
        } else if (res.data === "Wrong city"){
          openModal();
        }
      }).catch((error) => {
        console.error("Erreur lors de la réception du colis:", error);
        toast.error("Échec de l'envoi de l'email de notification");
      });
      toast.success(`Message WhatsApp préparé pour ${selectedOrderId?.rec_phone}`);

    } catch (error) {
      console.error("Erreur lors de l'envoi du message WhatsApp:", error);
      toast.error("Échec de l'envoi du message WhatsApp");
    }
  }
  return (
    <>
      <section className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#0e2269] via-[#183b8f] to-[#2458b8] px-6 py-7 text-white shadow-lg sm:px-8"><div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20"><ClipboardCheck className="h-6 w-6" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">Réception</p><h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Check-in des colis</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">Sélectionnez une commande et une succursale, scannez les colis puis confirmez leur réception.</p></div></div></section>
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
        <div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">2. Succursale de réception</p><div className="relative">
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
      <div className="mb-4 grid grid-cols-1 items-end gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:grid-cols-[minmax(0,1fr)_auto_auto]">
    
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">3. Scanner ou rechercher un colis</p><div className="relative">
            <Input
              placeholder="Tapez ou scannez le code du colis"
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
              {details.length} Colis trouvés
            </h4>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-3 justify-end">
            <Button
              size="sm"
              variant="primary"
              startIcon={<ThumbsUpIcon className="size-5" />}
              onClick={() => handleConfirmOrder() }
            >
              Accusez de réception
            </Button>
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
                    Action
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Destination
                  </TableCell>
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
                    UPC Colis
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Categorie
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
                    Condition
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHeader>
               

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {isLoading ? (
                  <SkeletonTableRows rows={5} columns={9} />
                ) : details.map((detail) => (
                  <TableRow key={detail.id} className={rowBadge(detail.status)}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <Button
                          size="sm"
                          className="p-2"
                          variant="outline"
                          onClick={() => handleSendFacture(detail)}
                        >
                          <BellDotIcon className="size-5" />
                        </Button>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {detail.citypoundfee.city.description}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {detail.rec_name}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {detail.rec_phone}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {detail.upc}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {detail.category?.description}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {detail.pounds} lbs
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {detail.condition?detail.condition:"N/A"}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {StatusBadge(detail.status)}
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
        className="max-w-[450px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[450px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Avatar src="/images/user/question.png" size="xxlarge" />
          </div>
          <div className="px-2  text-center">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 flex items-center justify-center">
              Alerte d&apos;information !
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Verification de la ville du colis requise.
            </p>
          </div>
             <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                <div>
                  <p className="mb-6 text-md text-red-800 dark:text-gray-400 lg:mb-7">
                    Oups! Le colis que vous essayez de recevoir ne correspond pas à la ville sélectionnée.
                    Veuillez vérifier le code du colis et la ville avant de continuer.
                  </p>
                </div>
              </div>
          
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-center">
            <Button size="sm" variant="primary" onClick={closeModal}>
              Okay, Confirmer
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isSendOpen} onClose={closeSendModal}
        className="m-4 max-w-[620px]"
      >
        <div className="no-scrollbar relative max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-gray-900"><div className="bg-gradient-to-br from-brand-600 to-blue-900 px-5 py-6 text-white sm:px-7"><div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15"><BellDotIcon className="h-6 w-6" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">Colis reçu</p><h4 className="mt-1 text-xl font-semibold sm:text-2xl">Notification du client</h4><p className="mt-1 text-sm text-blue-100">Choisissez le canal pour prévenir le destinataire.</p></div></div></div><div className="space-y-5 p-5 sm:p-7"><div className="grid gap-3 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:grid-cols-3"><div><p className="text-xs uppercase text-gray-400">Commande</p><p className="mt-1 font-semibold text-gray-800 dark:text-white">{selectedOrderId?.ship?.shiporder ?? "N/A"}</p></div><div><p className="text-xs uppercase text-gray-400">Client</p><p className="mt-1 font-semibold text-gray-800 dark:text-white">{selectedOrderId?.rec_name ?? "N/A"}</p></div><div><p className="text-xs uppercase text-gray-400">Destination</p><p className="mt-1 font-semibold text-gray-800 dark:text-white">{selectedOrderId?.citypoundfee?.city?.description ?? "N/A"}</p></div></div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {selectedOrderId?.rec_email && (
              <button type="button" onClick={hadleNotifierEmail} className="group rounded-2xl border-2 border-gray-200 p-5 text-left transition hover:border-brand-400 hover:bg-brand-50 dark:border-gray-700"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600"><MailIcon className="h-5 w-5" /></span><p className="mt-4 font-semibold text-gray-900 dark:text-white">Notifier par email</p><p className="mt-1 truncate text-sm text-gray-500" title={selectedOrderId?.rec_email ?? ""}>{selectedOrderId?.rec_email}</p></button>
            )}
            <button type="button" onClick={handleNotifierWhatsapp} className="group rounded-2xl border-2 border-gray-200 p-5 text-left transition hover:border-emerald-400 hover:bg-emerald-50 dark:border-gray-700"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600"><MessageCircle className="h-5 w-5" /></span><p className="mt-4 font-semibold text-gray-900 dark:text-white">Notifier par WhatsApp</p><p className="mt-1 text-sm text-gray-500">{selectedOrderId?.rec_phone ?? "N/A"}</p></button></div><div className="flex justify-end border-t border-gray-100 pt-5 dark:border-gray-800"><Button size="sm" variant="outline" onClick={closeSendModal}>Fermer</Button></div></div>
        </div>
      </Modal>
    </>
  );
}
