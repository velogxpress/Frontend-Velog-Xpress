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
import { toast} from "react-toastify";

import { getlistOrders} from "../../../services/OrderService";
import { downloadManifeste, getOrderDetails,getOrderdetailsCity,updateOrderDetailsStatus} from "../../../services/OrderDetailsService"
import { DownloadIcon, ThumbsUpIcon } from "lucide-react";
import { set } from "react-hook-form";



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

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // page actuelle
  size: number; // taille de page
  first: boolean;
  last: boolean;
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

 const StatusBadge = (status:string,region:string) => {
  if(status==="Commande expédiée."){
    return(
      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
        Colis Expédié
      </span>
    )
  }else if(status==="Commande a été livrée."){
    return(
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        Colis Livré
      </span>
    )
  }else if(status==="Expédition en attente."){
    return(
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
        Colis Confirmé
      </span>
    )
  } else if (status == "Commande prête à être livrée." || status == "Commande bien arrivée en Haiti." || status == "Commande bien arrivée en Haïti.") {
    if (region === "Ouest" || region==="Centre" || region==="Artibonite" || region==="Nippes" || region==="Nord-Ouest" || region==="Sud" || region==="Sud-Est" || region==="Grand'Anse") {
      return (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          En transite en Haiti
        </span>
      )
    } else {

      return (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
          Colis Disponible
        </span>
      )
    }
  }
 }

type Option = { label: string; value: string };

export default function ReceptionForm() {

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [recherche, setRecherche] = useState("");


  const [orders,setOrders]=useState<Order[]>([]);
  const [details,setDetails]=useState<OrderDetails[]>([]);
  const [selectedOrderId,setSelectedOrderId]=useState<number | null>(null);
  const [shiporders,setShiporders]=useState<string | null>(null);
  const [qtycolis,setQtycolis]=useState<number | null>(0);
  const [qtypound,setQtypound]=useState<number | null>(0);
  const [expedition,setExpedition]=useState<string | null>("N/A");
  const [status, setStatus] = useState<string | null>("N/A");
  const [destination, setDestination] = useState<Ville[]>([]);
  const [selectedVilleId, setSelectedVilleId] = useState<number | null>(null);

   
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


const fetchOrderDetails = async (shiporder: string,pageNumber: number) => {
  try {
    const response = await getOrderDetails(shiporder,pageNumber);
    setDetails(response.data.content);
    setTotalPages(response.data.totalPages);
  } catch (error) {
    console.error("Échec du chargement des détails de la commande:", error);
  }
};
  

  
  
useEffect(() => {
  if (recherche !== null && recherche.trim() !== "") {
      fetchOrderDetails(recherche, page);
  }
}, [recherche, page]);


 function handleSelectOrderChange(value: number | string): void {
  const orderId = Number(value);
  setSelectedOrderId(orderId);
   fetchOrderSelected(orderId, page); // OK
   // Clear destination on order change
   fetchVille(shiporders!, page);
}


  function handleKeyUp(): void {
    setPage(0);
    if (recherche.trim() === "") {
      return;
    }
     fetchOrderDetails(recherche!, 0);
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
        setSelectedOrderId(null);
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

    const handleDownload = async (order:string,cityID:number) => {
      try {
          const response = await downloadManifeste(order, cityID);
          // Créer un lien de téléchargement temporaire
          const url = globalThis.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          // 👉 Nom du fichier (adapter selon ton backend)
          link.setAttribute("download", `manifeste_${order}.pdf`);
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
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
        <div>
          <div className="relative m-2">
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
        <div className="relative m-2">
            <Select
              options={villeOptions}
              placeholder="Sélectionnez une ville"
              onChange={(value) =>handleSelectVilleChange(value)}
            />
        </div>
        <div className="relative m-2">
          <Button variant="primary"
            startIcon={<DownloadIcon className="w-5 h-5 mr-2" />}
            onClick={() => handleDownload(shiporders!, selectedVilleId!)}
          >
            Telecharger Manifest
            </Button>
          </div>
        
        <div>
       
        </div>
      </div>
      {/* Second Row */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Information de la commande
            </h4>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Quantite de colis
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {qtycolis}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Quantite de Poids
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {qtypound} lbs
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Date Expedition
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {expedition}
                </p>
              </div>

              <div>
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
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
    
        <div>
          <div className="relative m-2">
            <Input
              placeholder="Tapez ou scannez le code du commande"
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
          <div className="flex items-center justify-between mt-4">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
            >
              Précédent
            </button>

            <span>
              Page {page + 1} / {totalPages}
            </span>

            <button
              disabled={page + 1 === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
            >
              Suivant
            </button>
          </div>
        </div>
        <div>
          <div className="flex items-center m-2 gap-3 justify-end">
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
                {details.map((detail) => (
                  <TableRow key={detail.id}>
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
                      {CashBadge(detail.condition?detail.condition:"N/A")}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {StatusBadge(detail.status, detail?.citypoundfee?.city?.region?.description ?? "N/A")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
