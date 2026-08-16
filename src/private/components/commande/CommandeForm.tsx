"use client";
import * as React from "react";
import { FormEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import FileInput from "../form/input/FileInput";
import Checkbox from "../form/input/Checkbox";
import Label from "../form/Label";
import Select from "../form/Select";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Avatar from "../ui/avatar/Avatar";
import AvatarText from "../ui/avatar/AvatarText";
import DatePicker from "../form/date-picker";
import {
  PencilIcon,
  TrashBinIcon,
  SearchIcon,
  PaperPlaneIcon,
  CopyIcon,

} from "../../icons";
import { useState, useEffect, useRef } from "react";
import {
  listCategoriesForSelect,getCategorieByPart
} from "../../../services/CategorieService";
import { checkPrintAgentStatus } from "../../../services/printAgentService";
import { createOrder, getlistOrders,deleteOrder,updateOrder} from "../../../services/OrderService";
import { getOrderDetails, getsOrderDetails, createOrderDetails, searchOrderDetails, printColisLabel, deleteOrderDetails, updateOrderDetails, transferOrderDetails } from "../../../services/OrderDetailsService"
import { getlistVilles } from "@/services/VilleService"; 
import { toast } from 'react-toastify';
import { ArrowRightLeft, BarChart3, Boxes, CameraIcon, FileImageIcon, MessageCircle, PackageCheck, PrinterIcon, RefreshCcw } from "lucide-react";
import Lien from "@/route/BASE_URL";
import Webcam from "react-webcam";

import { listClients,rechercherClients } from "@/services/RegisterService";
import { listOrderDetailsEtendu, searchlistOrderDetailsEtendu } from "../../../services/OrderDetailsService";
import { getAmountFees } from "../../../services/FraisService";
import { createAmnisty, printAmnistyLabel } from "../../../services/AmnistyService";
import { addOrderDetailsPhoto, deleteOrderDetailsPhoto, getOrderDetailsPhotos } from "../../../services/OrderDetailsGalleryService";
import { getClient } from "@/services/LoginService";
import { jwtDecode } from "jwt-decode";




interface Category {
  id: number;
  description: string;
  part?: string;
}

interface Order {
  id: number;
  date: string;
  createdAt?: string | null;
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
      douane: number;
      picture: string;
      note: string | null;
      user: Client | null;
      createdAt: string;
    }

interface OrderDetailsPhoto {
  id: number;
  orderDetailsId: number;
  photo: string;
  createdAt: string;
}

interface ReportItem {
  label: string;
  value: number;
}

// interface PageResponse<T> {
//   content: T[];
//   totalPages: number;
//   totalElements: number;
//   number: number; // page actuelle
//   size: number; // taille de page
//   first: boolean;
//   last: boolean;
// }

function formatInternationalPhone(phone: string): string | null {
  if (!phone) return null;

  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("509")) {
    const local = cleaned.substring(3);
    if (/^[2349]\d{7}$/.test(local)) {
      return `+509${local}`;
    }
  }

  if (/^[2349]\d{7}$/.test(cleaned)) {
    return `+509${cleaned}`;
  }

  if (cleaned.startsWith("1")) {
    const local = cleaned.substring(1);
    if (/^[2-9]\d{2}[2-9]\d{6}$/.test(local)) {
      return `+1${local}`;
    }
  }

  if (/^[2-9]\d{2}[2-9]\d{6}$/.test(cleaned)) {
    return `+1${cleaned}`;
  }

  return null;
}

function formatClientFileName(value: string): string {
  return value
    .replace(/[\\/:*?"<>|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isElectronicCategory(category: Category | null): boolean {
  return category?.part?.trim().toLocaleLowerCase("fr-FR") === "electronique" ||
    category?.part?.trim().toLocaleLowerCase("fr-FR") === "électronique";
}

function formatDeadlineDate(daysToAdd: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
  }).format(date);
}

function isElectronicPart(part: string | null | undefined): boolean {
  if (!part) return false;
  return part
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase() === "electronique";
}

function calculateColisSubtotal(
  quantity: number | null,
  unitPrice: number | null,
  customsFee: number | null,
  categoryPart: string | null
): number {
  const safePrice = unitPrice ?? 0;
  const safeCustomsFee = customsFee ?? 0;

  return isElectronicPart(categoryPart)
    ? (quantity ?? 0) * safePrice + safeCustomsFee
    : safePrice + safeCustomsFee;
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

type Option = { label: string; value: string };

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

function formatDateToDDMMYYYY(dateStr: string | null): string {
  if (!dateStr) return "";

  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
}

function formatCreatedAtFR(value: string | null | undefined): string {
  if (!value) return "N/A";

  const trimmedValue = value.trim();
  const normalizedValue = trimmedValue.includes("T")
    ? trimmedValue
    : trimmedValue.replace(" ", "T");
  const parsedDate = new Date(normalizedValue);

  if (!Number.isNaN(parsedDate.getTime())) {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(parsedDate);
  }

  const [datePart, timePart = ""] = trimmedValue.split(" ");
  const dateSeparator = datePart.includes("/") ? "/" : "-";
  const dateParts = datePart.split(dateSeparator);

  if (dateParts.length !== 3) return trimmedValue;

  const [first, second, third] = dateParts;
  const yearFirst = first.length === 4;
  const day = yearFirst ? third : first;
  const month = second;
  const year = yearFirst ? first : third;
  const formattedTime = timePart ? ` à ${timePart.slice(0, 5)}` : "";

  return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}${formattedTime}`;
}

function cleanVelogCode(value: string | null): string | null {
  if (!value) return value;

  return value.startsWith("VELOG XPRESS-")
    ? value.replace("VELOG XPRESS-", "")
    : value;
}

function normalizeReportLabel(value: string | null | undefined): string {
  return value?.trim() || "N/A";
}

function incrementReportMap(map: Map<string, number>, key: string, amount = 1): void {
  map.set(key, (map.get(key) ?? 0) + amount);
}

function toSortedReportItems(map: Map<string, number>): ReportItem[] {
  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

function getReportCategory(detail: OrderDetails): string {
  const source = `${detail.category?.part ?? ""} ${detail.category?.description ?? ""} ${detail.type ?? ""}`.toLowerCase();

  if (source.includes("hazmat") || source.includes("haz") || source.includes("dangere")) {
    return "HazMat";
  }

  if (source.includes("document")) {
    return "Document";
  }

  if (
    source.includes("elect") ||
    source.includes("élect") ||
    source.includes("electron") ||
    source.includes("électron")
  ) {
    return "Electronique";
  }

  return "Normal";
}



export default function CommandeForm() {
  const webcamRef = useRef<Webcam>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: isExpOpen,
    openModal: openExpModal,
    closeModal: closeExpModal,
  } = useModal();

  const {
    isOpen: isCreateOpen,
    openModal: openCreateModal,
    closeModal: closeCreateModal,
  } = useModal();

  const {
    isOpen: isPictureOpen,
    openModal: openPictureModal,
    closeModal: closePictureModal,
  } = useModal();

  const {
    isOpen: isCameraOpen,
    openModal: openCameraModal,
    closeModal: closeCameraModal,
  } = useModal();

  const {
    isOpen: isGalleryCameraOpen,
    openModal: openGalleryCameraModal,
    closeModal: closeGalleryCameraModal,
  } = useModal();

   const {
    isOpen: isPriceOpen,
    openModal: openPriceModal,
    closeModal: closePriceModal,
   } = useModal();
  
   const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
   } = useModal();
  
  const {
    isOpen: isEditOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();

  const {
    isOpen: isTransferOpen,
    openModal: openTransferModal,
    closeModal: closeTransferModal,
  } = useModal();

  const {
    isOpen: isReportOpen,
    openModal: openReportModal,
    closeModal: closeReportModal,
  } = useModal();

  // const {
  //   isOpen: isInfoOpen,
  //   openModal: openInfoModal,
  //   closeModal: closeInfoModal,
  //  } = useModal();

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesSpecial, setCategoriesSpecial] = useState<Category[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [recherche, setRecherche] = useState("");

  const [pages, setPages] = useState(0);
  const [totalsPages, setTotalsPages] = useState(0);
  const [rechercheExp, setRechercheExp] = useState("");



  const [orders, setOrders] = useState<Order[]>([]);
  const [details, setDetails] = useState<OrderDetails[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [orderID, setOrderID] = useState<number | null>(null);
  const [shiporders, setShiporders] = useState<string | null>(null);
  const [qtycolis, setQtycolis] = useState<number | null>(0);
  const [qtypound, setQtypound] = useState<number | null>(0);
  const [expedition, setExpedition] = useState<string | null>("N/A");
  const [status, setStatus] = useState<string | null>("N/A");
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [expeditionDate, setExpeditionDate] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isExpedite, setIsExpedite] = useState(false);
  const [typecolis, setTypecolis] = useState<string | null>(null);
  const [expediteur, setExpediteur] = useState<string | null>(null);
  const [expediteurID, setExpediteurID] = useState<number | null>(null);
  const [expediteurCode, setExpediteurCode] = useState<string | null>(null);
  const [exptelephone, setExptelephone] = useState<string | null>(null);
  const [expemail, setExpemail] = useState<string | null>(null);
  const [recipent, setRecipent] = useState<string | null>(null);
  const [rectelephone, setRectelephone] = useState<string | null>(null);
  const [recemail, setRecemail] = useState<string | null>(null);
  const [destination, setDestination] = useState<Ville[]>([]);
  const [selectedDestinationId, setSelectedDestinationId] = useState<number | null>(null);
  const [poids, setPoids] = useState<number | null>(null);
  const [tracknumber, setTracknumber] = useState<string | null>(null);
  const [categorieId, setCategorieId] = useState<string | null>(null);
  const [description, setDescription] = useState<number | null>(null);
  const [notes, setNotes] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [douane, setDouane] = useState<number | null>(null);
  const [pictures, setPictures] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<OrderDetails | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<OrderDetailsPhoto[]>([]);
  const [galleryImage, setGalleryImage] = useState<string | null>(null);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const [selectedTransferOrderId, setSelectedTransferOrderId] = useState<number | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [reportDetails, setReportDetails] = useState<OrderDetails[]>([]);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [disableFields, setDisableFields] = useState<boolean>(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [detailsClients, setDetailsClients] = useState<OrderDetails[]>([]);
  const [fraisSpeciaux, setFraisSpeciaux] = useState<Cipinfee | null>(null);
  const [labelDouane, setLabelDouane] = useState<string | null>("Frais de Douane");

  const selectedOrderReport = React.useMemo(() => {
    const cityMap = new Map<string, number>();
    const userMap = new Map<string, number>();
    const clientMap = new Map<string, number>();
    const categoryMap = new Map<string, number>([
      ["Electronique", 0],
      ["Normal", 0],
      ["Document", 0],
      ["HazMat", 0],
    ]);

    let paidCashCount = 0;
    let dueCount = 0;
    let heaviest: OrderDetails | null = null;

    reportDetails.forEach((detail) => {
      const pounds = Number(detail.pounds ?? 0);
      if (!heaviest || pounds > Number(heaviest.pounds ?? 0)) {
        heaviest = detail;
      }

      incrementReportMap(cityMap, normalizeReportLabel(detail.citypoundfee?.city?.description));
      incrementReportMap(userMap, normalizeReportLabel(detail.user?.name || detail.user?.usercode));
      incrementReportMap(clientMap, normalizeReportLabel(detail.rec_name || detail.client?.name));
      incrementReportMap(categoryMap, getReportCategory(detail));

      const condition = normalizeReportLabel(detail.condition).toLowerCase();
      if (condition.includes("pay") || condition.includes("payé") || condition.includes("cash")) {
        paidCashCount += 1;
      } else if (condition.includes("due")) {
        dueCount += 1;
      }
    });

    return {
      totalColis: reportDetails.length,
      heaviest,
      clients: toSortedReportItems(clientMap),
      topClient: toSortedReportItems(clientMap)[0] ?? null,
      categories: toSortedReportItems(categoryMap),
      cities: toSortedReportItems(cityMap),
      users: toSortedReportItems(userMap),
      invoices: {
        paidCash: paidCashCount,
        due: dueCount,
      },
    };
  }, [reportDetails]);
 

  const [isChecked, setIsChecked] = useState(true);
  const [isCheckedTwo, setIsCheckedTwo] = useState(false);

  const [filter, setFilter] = useState<string>("Client");
  const [action, setAction] = useState<string>("Expéditeur");
  const [categorieOptions, setCategorieOptions] = useState<Option[]>([]);
  const isElectronicColis = isElectronicPart(categorieId);

  const [sendColis, setSendColis] = useState<string>("Complet");
  const [user,setUser] = useState<Client | null>(null);


   
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const storedToken = localStorage.getItem("token");
        let decoded: any = null;
      
        if (storedToken) {
          try {
            decoded = jwtDecode(storedToken);
          } catch (error) {
            console.error("Failed to decode token:", error);
          }
        }
      
        const searchUser = () => { 
          const response = getClient(decoded.sub);
          response.then((res: any) => {
            const client = res.data;
            setUser(client);
          }).catch((error) => {
            console.error("Failed to fetch client data:", error);
          }); 
        }
      
        useEffect(() => {
          searchUser();
        }, []);

  const validateDeleteOrder = (): boolean => {
    let valid = true;
    const newErrors: { [key: string]: string } = {};

    if (selectedOrderId === null) {
      newErrors["selectedOrderId"] = "Veuillez sélectionner une commande à supprimer.";
      valid = false;
    }

    if (qtycolis && qtycolis > 0) {
      newErrors["qtycolis"] = "Impossible de supprimer une commande avec des détails existants.";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  }

  const validateExpedition = (): boolean => {
    let valid = true;
    const newErrors: { [key: string]: string } = {};

    if (selectedOrderId === null || qtycolis === 0) {
      newErrors["selectedOrderId"] = "Veuillez sélectionner une commande à expédier.";
      valid = false;
    }
    if (status === "Commande expédiée.") {
      newErrors["selectedOrderId"] = "La commande a déjà été expédiée.";
      valid = false;
    }
    if (qtycolis && qtycolis <= 0) {
      newErrors["qtycolis"] = "Impossible d'expédier une commande sans détails.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  const validateDetailsForm = (): boolean => {
    let valid = true;
    const newErrors: { [key: string]: string } = {};
    if (typecolis === null) {
      newErrors["typecolis"] = "Le type de colis est requis.";
      valid = false;
    }
    if (recipent === null || recipent.trim() === "") {
      newErrors["recipent"] = "Le nom du destinataire est requis.";
      valid = false;
    }
    if (selectedDestinationId === null) {
      newErrors["destination"] = "La destination est requise.";
      valid = false;
      setPoids(null);
    }
    if (categorieId === null) {
      newErrors["categorie"] = "La catégorie est requise.";
      valid = false;
    }
    if (description === null) {
      newErrors["description"] = "La description est requise.";
      valid = false;
    }

    if (poids === null || poids <= 0) {
      newErrors["poids"] = isElectronicColis
        ? "La quantité doit être un nombre positif."
        : "Le poids doit être un nombre positif.";
      valid = false;
    }
     

    setErrors(newErrors);
    return valid;
  }



  useEffect(() => {
    fetchOrders();
  }, []);

  const applySelectedOrder = (order: Order) => {
    setShiporders(order.shiporder);
    setOrderID(order.id);
    setQtycolis(order.colisQty);
    setQtypound(Number(order.poundQty.toFixed(2)));
    setExpedition(order.shipdate ?? "N/A");
    setStatus(order.status);
    setCreatedAt(order.createdAt ?? null);
    setErrors({});
  };

  const fetchOrders = async (): Promise<Order[]> => {
    try {
      const response = await getlistOrders(0);

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.content ?? [];

      setOrders(data);
      return data;
    } catch (e) {
      console.error(e);
      setOrders([]);
      return [];
    }
  };

  const refreshSelectedOrder = async (orderId = selectedOrderId) => {
    const refreshedOrders = await fetchOrders();
    if (orderId === null) return;

    const refreshedOrder = refreshedOrders.find((order) => order.id === orderId);
    if (refreshedOrder) {
      applySelectedOrder(refreshedOrder);
      await fetchOrderDetails(refreshedOrder.shiporder, 0);
    }
  };

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

    applySelectedOrder(order);
  };


  const fetchOrderDetails = async (shiporder: string, pageNumber = page) => {
    try {
      const searchTerm = recherche.trim();
      const response =
        searchTerm === ""
          ? await getOrderDetails(shiporder, pageNumber)
          : await searchOrderDetails(shiporder, searchTerm, pageNumber);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.content ?? [];

      setDetails(data);
      setTotalPages(response.data?.totalPages ?? 0);
    } catch (error) {
      console.error("Échec du chargement des détails de la commande:", error);
    }
  };
  
  
  useEffect(() => {
    if (selectedOrderId !== null) {
      const selectedOrder = orders.find(order => order.id === selectedOrderId);
      if (selectedOrder) {
        fetchOrderDetails(selectedOrder.shiporder, page);
      }
    }
  }, [selectedOrderId, shiporders, page, recherche]);


  const handleCreateOrder = () => {
    createOrder()
      .then((response) => {
        fetchOrders();
        toast.success("Nouvelle commande créée avec succès.");
      })
      .catch((error) => {
        console.error("Erreur lors de la création de la commande:", error);
      });
  };

  const handleDeleteOrder = () => {
    if (!validateDeleteOrder()) {
      return;
    }
    if (selectedOrderId === null) {
      return;
    }
    deleteOrder(shiporders!)
      .then((response) => {
        fetchOrders();
        setSelectedOrderId(null);
        setDetails([]);
        setQtycolis(0);
        setQtypound(0);
        setExpedition("N/A");
        setStatus("N/A");
        setCreatedAt(null);
        toast.success("Commande supprimée avec succès.");
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de la commande:", error);
      });
  };

  const handleExpedition = () => {
    if (!validateExpedition()) {
      return;
    }
    openModal();
  }


  function handleOpenCreateModal() {
    if (!selectedOrderId) {
      toast.error("Veuillez sélectionner une commande avant d'ajouter des détails.");
      return;
    }
    openCreateModal();
  }

  function handleOpenEditModal(detail: OrderDetails) {
    setSelectedDetail(detail);
    // Populate form fields with detail data
    setTypecolis(detail.type);
    setExpediteurID(detail.client?.id ?? null);
    setExpediteurCode(detail.client?.usercode ?? null);
    setExpediteur(detail.exp_name);
    setExptelephone(detail.exp_phone);
    setExpemail(detail.exp_email);
    setRecipent(detail.rec_name);
    setRectelephone(detail.rec_phone);
    setRecemail(detail.rec_email);
    setSelectedDestinationId(detail.citypoundfee.city.id);
    const currentCategoryPart = detail.category?.part ?? null;
    if (currentCategoryPart) {
      handleSelectedcategoryChange(currentCategoryPart);
    }
    setCategorieId(currentCategoryPart);
    setDescription(detail.category?.id ?? null);
    
    setPoids(detail.pounds);
    setTracknumber(detail.tracking);
    setNotes(detail.note);
    setPrice(detail.price);
    setDouane(detail.douane);
    if (detail.type === "Directe") {
      setDisableFields(true);
    } else {
      setDisableFields(false);
    }
    
    openEditModal();
  }



  function handleSelectOrderChange(value: number | string): void {
    const orderId = Number(value);
    setPage(0);
    setRecherche("");
    setSelectedOrderId(orderId);
    fetchOrderSelected(orderId); // OK
  }




  function handleSafeExpedier(): void {
    if (!expeditionDate) {
      toast.error("Veuillez sélectionner une date d'expédition.");
      return;
    }

    if (selectedOrderId === null || !shiporders) {
      toast.error("Aucune commande sélectionnée.");
      return;
    }
    setIsExpedite(true);
    const updatedOrder: Partial<Order> = {
      status: "Commande expédiée",
      shipdate: formatDateToDDMMYYYY(expeditionDate),
    };

    updateOrder(shiporders, updatedOrder)
      .then((response) => {
        toast.success("Commande expédiée avec succès.");
        // Mettre à jour l'état local
        setStatus(response.data.status);
        setExpedition(response.data.shipdate);
        // Fermer le modal
        closeModal();
        // Rafraîchir la liste des commandes
        fetchOrders();
        fetchOrderDetails(response.data.shiporder);
      })
      .catch((error) => {
        console.error("Erreur lors de l'expédition de la commande:", error);
        toast.error("Échec de l'expédition de la commande.");
        setIsExpedite(false);
      }).finally(() => { setIsExpedite(false);});
    
   
    
    // Optionally refresh orders
    fetchOrders();
  }

  async function fetchGalleryPhotos(orderDetailsId: number): Promise<void> {
    try {
      const response = await getOrderDetailsPhotos(orderDetailsId);
      setGalleryPhotos(response.data ?? []);
    } catch (error) {
      console.error("Erreur lors du chargement de la galerie:", error);
      setGalleryPhotos([]);
    }
  }

  function handleOpenPictureModal(detail: OrderDetails): void {
    setSelectedDetail(detail);
    fetchGalleryPhotos(detail.id);
    openPictureModal();
  }

  function handleOpenGalleryCamera(detail: OrderDetails): void {
    setSelectedDetail(detail);
    setGalleryImage(null);
    fetchGalleryPhotos(detail.id);
    openGalleryCameraModal();
  }

  async function handleOpenReportModal(): Promise<void> {
    if (!shiporders) {
      toast.info("Veuillez sélectionner une commande pour afficher le rapport.");
      return;
    }

    setIsReportLoading(true);
    setReportDetails([]);
    openReportModal();

    try {
      const response = await getsOrderDetails(shiporders);
      setReportDetails(response.data ?? []);
    } catch (error) {
      console.error("Erreur lors du chargement du rapport de la commande:", error);
      setReportDetails([]);
      toast.error("Échec du chargement du rapport de la commande.");
    } finally {
      setIsReportLoading(false);
    }
  }

  const handlePrintLabel = async (
    upc: string
  ): Promise<void> => {
    try {
      const runtime = detectRuntime();
      const running = await checkPrintAgentStatus();
  
      const response = await printColisLabel(upc);
  
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
            type: "label4x6",
            document: base64Pdf,
          }),
        });
      } else if (runtime === "WINDOWS_JAVAFX_WEBVIEW") {
        printLabel("label4x6", base64Pdf);
      } else {
        notifyPrintAgentDown();
      }
    } catch (error) {
      console.error("Erreur lors de l'impression :", error);
    }
  };

   const handlePrintAmnisty = async (
    upc: string
  ): Promise<void> => {
    try {
      const runtime = detectRuntime();
      const running = await checkPrintAgentStatus();
  
      const response = await printAmnistyLabel(upc);
  
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
            type: "label4x6",
            document: base64Pdf,
          }),
        });
      } else if (runtime === "WINDOWS_JAVAFX_WEBVIEW") {
        printLabel("label4x6", base64Pdf);
      } else {
        notifyPrintAgentDown();
      }
    } catch (error) {
      console.error("Erreur lors de l'impression :", error);
    }
  };
  

  //------------------------les programmations du details de la commande----------------------------
  
  const typeOptions: Option[] = [
    { label: "Directe", value: "Directe" },
    { label: "Indirecte", value: "Indirecte" }
  ]


  const fetchVille = async () => {
    try {
      const response = await getlistVilles(0);

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.content ?? [];

      setDestination(data);
    } catch (e) {
      console.error(e);
      setDestination([]);
    }
  };

  useEffect(() => {
    fetchVille();
  }, []);


  const villeOptions: Option[] = destination.map(r => ({
    label: r.abreger + " - " + r.description,
    value: String(r.id),
  }));

  const fetchAmountFees = async (cityID: number) => {
    try {
      const response = await getAmountFees(cityID);
      if (response.data) {
        setFraisSpeciaux(response.data);
      } 
    } catch (error) {
      console.error("Échec du chargement des frais spéciaux:", error);
      setFraisSpeciaux(null);
    }
  }
  
  const categoryOptions: Option[] = [
    { label: "Document", value: "Document" },
    { label: "Electronique", value: "Electronique" },
    { label: "Normal", value: "Normal" },
    { label: "HazMat", value: "HazMat" },
  ]

  // const descriptionOptions: Option[] = [
  //   { label: "Cheveux", value: "Cheveux" },
  //   { label: "Normal", value: "Normal" },
  //   { label: "Parfum", value: "Parfum" },
  // ]

  const fetchCategories = async (pageNumber: number) => {
    try {
      const response = await listCategoriesForSelect(pageNumber);
      setCategories(response.data.content);
    } catch (error) {
      console.error("Échec du chargement des catégories:", error);
    }
  };

  const fetchCategoriesByPart = async (pageNumber: number) => { 
    try {
      const response = await getCategorieByPart("Normal", pageNumber);
      setCategoriesSpecial(response.data.content);
    } catch (error) {
      console.error("Échec du chargement des catégories par partie:", error);
    }
  };  

  useEffect(() => {
    fetchCategories(0);
    fetchCategoriesByPart(0);
  }, []);



const handleSelectedcategoryChange = (value: string | number) => {
  const selectedType = String(value);
  setCategorieId(selectedType);
  setDescription(null);
  setPrice(null);
  setDouane(null);
  closePriceModal();
  setErrors((previousErrors) => {
    const { categorie, description: descriptionError, ...remainingErrors } = previousErrors;
    return remainingErrors;
  });

  if (selectedType === "Document" || selectedType === "Electronique" || selectedType === "HazMat") {
    const options = categories
      .filter((c) => c.part === selectedType) // 🔥 IMPORTANT
      .map((c) => ({
        label: c.description,
        value: String(c.id),
      }));

    setCategorieOptions(options);

  } else {
    setCategorieOptions([]);
    const descriptionOptions = categoriesSpecial
      .filter((c) => c.part === selectedType) // 🔥 IMPORTANT
      .map((c) => ({
        label: c.description,
        value: String(c.id),
      }));
    setCategorieOptions(descriptionOptions);
  }
};

  
  
  function handleChangeTypeColis(value: string | number): void {
    const typeValue = String(value);
    setTypecolis(typeValue);
    
    // If type is "Directe", disable expediteur fields
    if (typeValue === "Directe") {
      setDisableFields(true);
    } else if (typeValue === "Indirecte") {
      setDisableFields(false);
    }

    // Clear error for typecolis if it exists
    if (errors.typecolis) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.typecolis;
        return newErrors;
      });
    }
  }

  const handleOpenCameraModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    openCameraModal();
  };

  const capture = () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) setImage(screenshot);
  };

  const captureGallery = () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) setGalleryImage(screenshot);
  };

  const uploadPhoto = async () => {
    if (!image) return;
    // Convert base64 → Blob
    const blob = await fetch(image).then((res) => res.blob());
    const file = new File([blob], `colis_${Date.now()}.png`, { type: "image/png" });
    setPictures(file);
    closeCameraModal();
  };

  const uploadGalleryPhoto = async () => {
    if (!galleryImage || !selectedDetail) return;

    setIsGalleryUploading(true);

    try {
      const blob = await fetch(galleryImage).then((res) => res.blob());
      const file = new File([blob], `galerie_colis_${Date.now()}.png`, { type: "image/png" });
      await addOrderDetailsPhoto(selectedDetail.id, file);
      toast.success("Photo ajoutée à la galerie du colis.");
      setGalleryImage(null);
      closeGalleryCameraModal();
      await fetchGalleryPhotos(selectedDetail.id);
      openPictureModal();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la photo galerie:", error);
      toast.error("Échec de l'ajout de la photo.");
    } finally {
      setIsGalleryUploading(false);
    }
  };

  async function handleDeleteGalleryPhoto(photoId: number): Promise<void> {
    if (!selectedDetail) return;

    try {
      await deleteOrderDetailsPhoto(photoId);
      toast.success("Photo supprimée de la galerie.");
      await fetchGalleryPhotos(selectedDetail.id);
    } catch (error) {
      console.error("Erreur lors de la suppression de la photo galerie:", error);
      toast.error("Échec de la suppression de la photo.");
    }
  }

  const CAMERA = () => {
    return (
      <div>
        {!image ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            videoConstraints={videoConstraints}
          />
        ) : (
          <img src={image} alt="capture" className="w-full" />
        )}

        <div className="flex gap-2 mt-4 justify-end">
          {!image && (
            <Button onClick={capture} className="btn-primary" title="Prendre une photo avec la camera">
              📸 Prendre photo
            </Button>
          )}
          {image && (
            <>
              <Button onClick={() => setImage(null)} className="btn-outline" title="Reprendre la photo">
                Reprendre
              </Button>
              <Button onClick={uploadPhoto} className="btn-primary" title="Sauvegarder la photo du colis">
                Sauvegarder
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  const GALLERY_CAMERA = () => {
    return (
      <div className="w-full">
        {!galleryImage ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            videoConstraints={videoConstraints}
            className="w-full rounded-2xl"
          />
        ) : (
          <img src={galleryImage} alt="capture galerie" className="w-full rounded-2xl" />
        )}

        <div className="flex gap-2 mt-4 justify-end">
          {!galleryImage && (
            <Button onClick={captureGallery} className="btn-primary" title="Prendre une photo pour la galerie">
              Prendre photo
            </Button>
          )}
          {galleryImage && (
            <>
              <Button onClick={() => setGalleryImage(null)} className="btn-outline" title="Reprendre la photo">
                Reprendre
              </Button>
              <Button
                onClick={uploadGalleryPhoto}
                className="btn-primary"
                title="Ajouter cette photo à la galerie du colis"
                disabled={isGalleryUploading}
              >
                {isGalleryUploading ? "Ajout..." : "Ajouter à la galerie"}
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }
  
  useEffect(() => {
    setImage(null);
  }, [isCameraOpen]);

  useEffect(() => {
    setGalleryImage(null);
  }, [isGalleryCameraOpen]);
  
  const handleopenExpediteurModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!typecolis) {
    
      setErrors((prev) => ({
        ...prev,
        typecolis: "Veuillez sélectionner le type de colis avant de continuer.",
      }));
      return;
    }
    setAction("Expéditeur");
    openExpModal();
  };

  const handleopenRecipentModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!typecolis) {
    
      setErrors((prev) => ({
        ...prev,
        typecolis: "Veuillez sélectionner le type de colis avant de continuer.",
      }));
      return;
    }
    setAction("Destinataire");
    openExpModal();
  };
  
  const fetchClients = async (page: number) => {
    try {
      const response = await listClients(page);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.content ?? [];

      setClients(data);
      setTotalsPages(response.data?.totalPages ?? 0);
    } catch (e) {
      console.error(e);
      setClients([]);
    }
  };
  
  const fetchDetailsClients = async (page: number) => {
    try {
      const response = await listOrderDetailsEtendu(page);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.content ?? [];

      setDetailsClients(data);
      setTotalsPages(response.data?.totalPages ?? 0);
    } catch (e) {
      console.error(e);
      setDetailsClients([]);
    }
  };
  
  useEffect(() => {
    setTotalsPages(0);

    if (filter === "Client") {
      fetchClients(pages);
    }
  }, [pages, filter]);

  useEffect(() => {
    setTotalsPages(0);

    if (filter === "Ettendu") {
      fetchDetailsClients(pages);
    }
  }, [pages, filter]);


  function handleselectedExpediteur(cli: Client): void {
    if (action === "Expéditeur") {
      setExpediteurID(cli.id);
      setExpediteurCode(cli.usercode);
      setExpediteur(cli.name);
      setExptelephone(cli.phone);
      setExpemail(cli.email);
    } else if (action === "Destinataire") {
      if (typecolis === "Directe") {
        setExpediteurID(cli.id);
        setExpediteur(cli.name);
        setExptelephone(cli.phone);
        setExpemail(cli.email);
        setExpediteurCode(cli.usercode);
      }
      setRecipent(cli.name);
      setRectelephone(cli.phone);
      setRecemail(cli.email);
    }
    setFilter("Client");
    closeExpModal();
  }

  function handleselectedExpediteurdetails(clis: OrderDetails): void {
    if (action === "Expéditeur") {
      setExpediteurID(0);
      setExpediteurCode("");
      setExpediteur(clis.exp_name);
      setExptelephone(clis.exp_phone);
      setExpemail(clis.exp_email);
    } else if (action === "Destinataire") {
      if (typecolis === "Directe") {
        setExpediteurID(0);
        setExpediteurCode("");
        setExpediteur(clis.rec_name);
        setExptelephone(clis.rec_phone);
        setExpemail(clis.rec_email);
      }

      setRecipent(clis.rec_name);
      setRectelephone(clis.rec_phone);
      setRecemail(clis.rec_email);
    }
    setFilter("Client");
    closeExpModal();
  }

  const handleChecked = (name: string) => {
    setPages(0);
    setIsChecked(name === "Client");
    setIsCheckedTwo(name === "Ettendu");
    setFilter(name);
  };

   const handleCheckedColis = (name: string) => {
    setIsChecked(name === "Complet");
    setIsCheckedTwo(name === "Amnistie");
    setSendColis(name);
  };

  const handleKeyUpExp = (): void => {
    setPages(0);
    if (filter === "Client") {
      if (rechercheExp.trim() === "") {
        // If search is empty, fetch all clients
        fetchClients(0);
        return;
      }
      
      // Perform search 
      rechercherClients(rechercheExp.trim(), 0)
        .then((response) => {
          setClients(response.data.content);
          setTotalsPages(response.data.totalPages);
        })
        .catch((error) => {
          console.error("Erreur lors de la recherche des clients:", error);
        });
    }else {
    if (rechercheExp.trim() === "") {
    // If search is empty, fetch all clients
    fetchClients(0);
    return;
   }
    
  // Perform search 
  searchlistOrderDetailsEtendu(rechercheExp.trim(), 0)
    .then((response) => {
      setDetailsClients(response.data.content);
      setTotalsPages(response.data.totalPages);
    })
    .catch((error) => {
      console.error("Erreur lors de la recherche des clients:", error);
    });
  }
  };

    const cleanForm = () => {
    setTypecolis(null);
    setExpediteurID(null);
    setExpediteur(null);
    setExptelephone(null);
    setExpemail(null);
    setRecipent(null);
    setRectelephone(null);
    setRecemail(null);
    setSelectedDestinationId(null);
    setCategorieId(null);
    setDescription(null);
    setPoids(null);
    setTracknumber(null);
    setNotes(null);
    setPrice(null);
    setDouane(null);
    setPictures(null);
    setImage(null);
    setErrors({});
    setDisableFields(false);
    setExpediteurCode(null);
    setSendColis("Complet");
    setFraisSpeciaux(null);
    setCategorieOptions([]);
    setLabelDouane("Frais de Douane");
    setIsChecked(true);
    setIsCheckedTwo(false);
    closePriceModal();

  }

  useEffect(() => {
    cleanForm();
  }, [isCreateOpen]);


  useEffect(() => {
    setRechercheExp("");
    setPages(0);
    handleChecked("Client");
    fetchClients(0);
  }, [isExpOpen]);

  const handleWhatsappAfterSave = async (detail: OrderDetails) => {
    if (!detail?.rec_phone) {
      toast.info("Colis enrejistre, men nimewo WhatsApp kliyan an pa disponib.");
      return;
    }

    const formattedPhone = formatInternationalPhone(detail.rec_phone);
    if (!formattedPhone) {
      toast.info("Colis anrejistre, men nimewo kliyan an pa nan bon format pou WhatsApp.");
      return;
    }

    const publicUploadsBaseUrl = "https://www.velogxpress.com/api/uploads/products";
    const photoUrls: string[] = [];

    if (detail.picture) {
      photoUrls.push(`${publicUploadsBaseUrl}/${detail.picture}`);
    }

    try {
      const response = await getOrderDetailsPhotos(detail.id);
      const galleryPhotoUrls = (response.data ?? [])
        .map((photo: OrderDetailsPhoto) => photo.photo)
        .filter(Boolean)
        .map((photo: string) => `${publicUploadsBaseUrl}/${photo}`);

      galleryPhotoUrls.forEach((photoUrl: string) => {
        if (!photoUrls.includes(photoUrl)) {
          photoUrls.push(photoUrl);
        }
      });
    } catch (error) {
      console.error("Erreur lors du chargement des photos galerie pour WhatsApp:", error);
    }

    const clientFileName = formatClientFileName(
      detail.rec_name || detail.client?.name || "Client"
    );
    const commandeCode = (detail.ship.shiporder || detail.upc || "").trim();
    const tempFactureFileName = `${clientFileName}_${commandeCode}.pdf`;
    const tempFactureUrl = `${publicUploadsBaseUrl}/${encodeURIComponent(
      tempFactureFileName
    )}`;

    const messageLines = [
      `Bonjour ${detail.rec_name},`,
      "",
      "Nous avons recu un colis pour votre compte.",
      "Restez connecte avec nous pour d'autres notifications.",
      `Vous pouvez suivre le colis sur notre site web avec votre code de suivi: ${detail.upc}`,
      `La date limite pour recevoir ce colis est le: ${formatDeadlineDate(10)}`,
    ];

    if (photoUrls.length > 0) {
      messageLines.push("", "Photos du colis:");
      photoUrls.forEach((photoUrl, index) => {
        messageLines.push(`${index + 1}. ${photoUrl}`);
      });
    }

    if (tempFactureUrl) {
      messageLines.push("", `Facture temporaire: ${tempFactureUrl}`);
    }

    messageLines.push("", "Merci de votre confiance.");

    const whatsappPhone = formattedPhone.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
      messageLines.join("\n")
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    toast.success(`Message WhatsApp prepare pour ${detail.rec_phone}`);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (sendColis === "Complet") {

      if (!validateDetailsForm()) {
        return;
      }

      setIsSaving(true);

      try {
        const selectedOrder = {
          id: orderID!,
          shiporder: shiporders!,
          colisQty: qtycolis!,
          poundQty: qtypound!,
          shipdate: expedition!,
          status: status!
        };
        const selectedCategory = {
          id: description!,
          description: categories.find(cat => cat.id === description!)?.description || "",
          part: categorieId!
        };
        const client = {
          id: expediteurID,
          name: expediteur!,
          email: expemail,
          phone: exptelephone!,
          address: "",
          ville: {
            id: 0,
            abreger: "",
            description: "",
            region: {
              id: 0,
              description: ""
            }
          },
          usercode: expediteurCode!,
          password: "",
          status: ""
        };
        const playload = {
          ship: selectedOrder,
          client: client,
          category: selectedCategory,
          citypoundfee: fraisSpeciaux,
          pounds: poids!,
          subtotal: calculateColisSubtotal(poids, price, douane, categorieId),
          status: "Expédition en attente.",
          delivery: "",
          exp_name: expediteur!,
          exp_email: expemail,
          exp_phone: exptelephone!,
          rec_name: recipent!,
          rec_email: recemail,
          rec_phone: rectelephone!,
          type: typecolis!,
          condition: "Due",
          price: price!,
          tracking: tracknumber!,
          douane: douane!,
          note: notes!,
          user: user
        };
        const formData = new FormData();
        // Add order details
        if (pictures) formData.append("file", pictures);
        formData.append(
          "orderDetailModel",
          new Blob([JSON.stringify(playload)], { type: "application/json" })
        );

        const response = await createOrderDetails(formData);
        //handleWhatsappAfterSave(response.data as OrderDetails);
        handlePrintLabel(response.data.upc);
        // Refresh order details
        await refreshSelectedOrder();
        cleanForm();
      } catch (error) {
        console.error("Erreur lors de la création du détail de la commande:", error);
        toast.error("Échec de la création du détail de la commande.");
      } finally {
        setIsSaving(false);
      }
    } else if (sendColis === "Amnistie") {
      if(categorieId===null){
        setErrors((prev) => ({
        ...prev,
        categorie: "La catégorie est requise pour une amnistie.",
      }));
      return;
      }
      setIsSaving(true);

      try {
        const selectedCategory = {
          id: description!,
          description: categories.find(cat => cat.id === description!)?.description || "",
          part: categorieId!
        };
        
        const playload = {
          category: selectedCategory,
          pounds: poids!,
          status: "Reclamation en attente.",
          tracking: tracknumber!,
          note: notes!,
          name: expediteur!,
          telephone: exptelephone!,
          price: price!,
          douane: douane!,
          citypoundfee: fraisSpeciaux!,
          user: user
        };

        const formData = new FormData();
        // Add order details
        if (pictures) formData.append("file", pictures);
        formData.append(
          "amnistyModel",
          new Blob([JSON.stringify(playload)], { type: "application/json" })
        );

        const response = await createAmnisty(formData);
        handlePrintAmnisty(response.data.tracking);
        cleanForm();
      } catch (error) {
        console.error("Erreur lors de la création del'amnestie", error);
        toast.error("Échec de la création del'amnestie.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  function handleFixedPriceChange(value: string | number): void {
    const selectedCategoryId = Number(value);
    setErrors((previousErrors) => {
      const { description: descriptionError, ...remainingErrors } = previousErrors;
      return remainingErrors;
    });
    if (selectedCategoryId === 2) { 
      setDescription(selectedCategoryId); // Set to "Normal" category ID
      // setCategorieId("Normal");
      // Calculate subtotal based on pounds, selected destination, and category
      if (!poids || poids <= 0) {
        return;
      }

      if (!selectedDestinationId || !fraisSpeciaux) {
        setPrice(0);
        return;
      }
      // Calculate base fee from pounds
      const poundsFee = poids * (fraisSpeciaux.pounds?.amount ?? 0);
      setPrice(poundsFee);
    } else if (selectedCategoryId === 18) {
      setDescription(selectedCategoryId); // Set to "Parfum" category ID
      // setCategorieId("Parfum");
      // Optionally set a fixed price for "Parfum" category
       // Calculate subtotal based on pounds, selected destination, and category
      if (!poids || poids <= 0) {
        return;
      }

      if (!selectedDestinationId || !fraisSpeciaux) {
        setPrice(0);
        return;
      }
      // Calculate base fee from pounds
      const poundsFee = poids * (fraisSpeciaux.specialfee?.amount ?? 0);
      setPrice(poundsFee);
    } else {
      // setCategorieId("Parfum","Electronique");
      setDescription(selectedCategoryId);
      if (categorieId === "HazMat") {
        setLabelDouane("HazMat");
      } else { 
        setLabelDouane("Frais de Douane");
      }
      openPriceModal();
    }
    
  }

  function handleDestinationChange(value: string | number): void {
    const destinationId = Number(value);
    setSelectedDestinationId(destinationId);
    // Fetch special fees for the selected destination
    fetchAmountFees(destinationId);
    sumPoundsWithSelectedPrice();
    // Clear error for destination if it exists
    if (errors.destination) {
      setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.destination;
      return newErrors;
      });
    }
  }


  function sumPoundsWithPrice(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (isElectronicColis) {
      return;
    }
    // Calculate subtotal based on pounds, selected destination, and category
    if (!poids || poids <= 0) {
      return;
    }

    if (!selectedDestinationId || !fraisSpeciaux) {
      setPrice(0);
      return;
    }
    // Calculate base fee from pounds
    const poundsFee = poids * (fraisSpeciaux.pounds?.amount ?? 0);
    setPrice(poundsFee);
  }

  React.useEffect(() => {
    sumPoundsWithSelectedPrice();
  }, [selectedDestinationId]);

  function sumPoundsWithSelectedPrice(): void {
    if (isElectronicColis) {
      return;
    }
    // Calculate subtotal based on pounds, selected destination, and category
    if (!poids || poids <= 0) {
      setPrice(fraisSpeciaux?.pounds?.amount ?? 0);
      return;
    }

    if (!selectedDestinationId || !fraisSpeciaux) {
      return;
    }
    // Calculate base fee from pounds
    const poundsFee = poids * (fraisSpeciaux.pounds?.amount ?? 0);
    setPrice(poundsFee);
  }

  const handleOpenDeleteModal = (detail: OrderDetails): void => {
    setSelectedDetail(detail);
    openDeleteModal();
  }

  const handleOpenTransferModal = (detail: OrderDetails): void => {
    setSelectedDetail(detail);
    setSelectedTransferOrderId(null);
    openTransferModal();
  };

  async function handleTransferColis(): Promise<void> {
    if (!selectedDetail) {
      toast.error("Aucun colis sélectionné pour le transfert.");
      return;
    }

    if (!selectedTransferOrderId) {
      toast.error("Veuillez sélectionner la commande de destination.");
      return;
    }

    const destinationOrder = orders.find((order) => order.id === selectedTransferOrderId);

    if (!destinationOrder) {
      toast.error("Commande de destination introuvable.");
      return;
    }

    if (destinationOrder.id === selectedDetail.ship.id) {
      toast.error("Ce colis appartient déjà à cette commande.");
      return;
    }

    setIsTransferring(true);

    try {
      await transferOrderDetails(selectedDetail.id, destinationOrder.id);
      toast.success(`Colis transféré vers la commande ${destinationOrder.shiporder}.`);

      await refreshSelectedOrder();

      setSelectedTransferOrderId(null);
      closeTransferModal();
    } catch (error) {
      console.error("Erreur lors du transfert du colis:", error);
      toast.error("Échec du transfert du colis.");
    } finally {
      setIsTransferring(false);
    }
  }
  
  function handleSafeDelete(): void {
    if (selectedDetail === null) {
      toast.error("Aucun détail de commande sélectionné pour la suppression.");
      return;
    }

    deleteOrderDetails(selectedDetail.upc)
      .then(async (response) => {
        await refreshSelectedOrder();
        toast.success("Détail de la commande supprimé avec succès.");
        await fetchOrderDetails(selectedDetail.ship.shiporder, 0);
        closeDeleteModal();
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression du détail de la commande:", error);
        toast.error("Échec de la suppression du détail de la commande.");
      }); 
  }

  async function handleSafeEdit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (selectedDetail === null) {
      toast.error("Aucun détail de commande sélectionné pour la modification.");
      return;
    }
    if (!validateDetailsForm()) {
      return;
    }
    setIsSaving(true);

      try {
        const selectedOrder = {
          id: selectedDetail.ship.id!,
          shiporder: selectedDetail.ship.shiporder!,
          colisQty: selectedDetail.ship.colisQty!,
          poundQty: selectedDetail.ship.poundQty!,
          shipdate: selectedDetail.ship.shipdate!,
          status: selectedDetail.ship.status!
        };
        const selectedCategory = {
          id: description ?? selectedDetail.category?.id!,
          description: categories.find(cat => cat.id === (description ?? selectedDetail.category?.id!))?.description || "",
          part: categorieId?? selectedDetail.category?.part!
        };
        const client = {
          id: expediteurID,
          name: expediteur!,
          email: expemail,
          phone: exptelephone!,
          address: "",
          ville: {
            id: 0,
            abreger: "",
            description: "",
            region: {
              id: 0,
              description: ""
            }
          },
          usercode: expediteurCode!,
          password: "",
          status: ""
        };
        const playload = {
            ship: selectedOrder,
            client: client,
            category: selectedCategory,
            citypoundfee: fraisSpeciaux ?? selectedDetail.citypoundfee,
            pounds: poids!,
            subtotal: calculateColisSubtotal(
              poids,
              price,
              douane,
              categorieId ?? selectedDetail.category?.part ?? null
            ),
            status: "Expédition en attente.",
            delivery: "",
            exp_name: expediteur!,
            exp_email: expemail,
            exp_phone: exptelephone!,
            rec_name: recipent!,
            rec_email: recemail,
            rec_phone: rectelephone!,
            type: typecolis!,
            condition: "Due",
            price: price!,
            tracking: tracknumber!,
            douane: douane!,
            note: notes!,
            user: user
          };
       
        const response = await updateOrderDetails(selectedDetail.id, playload);
       // handlePrintLabel(response.data.upc);
        // Refresh order details
        await refreshSelectedOrder();
        setShiporders(response.data.ship.shiporder);
        await fetchOrderDetails(response.data.ship.shiporder, 0);
        toast.success(`Colis modifié avec succès pour ${recipent ?? "le client"}.`);
        // Reset form
        cleanForm();
        closeEditModal();
      } catch (error) {
        console.error("Erreur lors de la création du détail de la commande:", error);
        toast.error("Échec de la création du détail de la commande.");
      } finally {
        setIsSaving(false);
      }
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
        <div>
          <div className="flex flex-wrap items-center m-2 gap-2">
            <Button
              size="sm"
              variant="primary"
              title="Creer une nouvelle commande"
              startIcon={<CopyIcon className="size-5" />}
              onClick={handleCreateOrder}
            >
              Nouveau
            </Button>

            <Button
              size="sm"
              variant="outline"
              title="Supprimer la commande selectionnee"
              startIcon={<TrashBinIcon className="size-5" />}
              onClick={handleDeleteOrder}
            >
              Effacer
            </Button>

            <Button
              size="sm"
              variant="outline"
              title="Expedier la commande selectionnee"
              startIcon={<PaperPlaneIcon className="size-5" />}
              onClick={handleExpedition}
            >
              Expedier
            </Button>
          </div>
        </div>
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
        <div>
          {/* Placeholder for alignment */}
        </div>
      </div>
      {/* Second Row */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Information de la commande
            </h4>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-6 lg:gap-7 2xl:gap-x-20">
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
                  Date création
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formatCreatedAtFR(createdAt)}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Date Expedition
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {expedition? expedition : "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Status de la commande
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {status? status : "N/A"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  title="Rafraichir les informations de la commande"
                  startIcon={<RefreshCcw className="size-5" />}
                  onClick={() => refreshSelectedOrder()}
                >
                  Rafraichir
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  title="Cliquez sur ce bouton pour afficher le rapport de la commande sélectionnée"
                  startIcon={<BarChart3 className="size-5" />}
                  onClick={handleOpenReportModal}
                  disabled={selectedOrderId === null || isReportLoading}
                >
                  {isReportLoading ? "Chargement..." : "Rapport"}
                </Button>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      {/* End of Second Row */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
        <div>
          <div className="flex items-center m-2 gap-3 justify-end">
            <Button
              size="sm"
              variant="primary"
              title="Ajouter un detail a la commande"
              startIcon={<CopyIcon className="size-5" />}
              onClick={() => handleOpenCreateModal() }
            >
              Ajouter détaille
            </Button>
          </div>
        </div>
        <div>
          <div className="relative m-2">
            <Input
              placeholder="Recherche..."
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
          <div className="flex items-center justify-between gap-4 mt-4">
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
        {details.map((detail) => (
          <div
            key={detail.id}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-theme-sm transition hover:shadow-theme-md dark:border-white/[0.05] dark:bg-white/[0.03]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <AvatarText name={detail.rec_name || "Client"} />
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-gray-800 dark:text-white/90">
                    {detail.rec_name}
                  </h3>
                  <p className="mt-1 truncate text-theme-xs text-gray-500 dark:text-gray-400">
                    {detail.rec_phone}
                  </p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-theme-xs font-medium uppercase text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                {detail?.citypoundfee?.city?.abreger ?? "N/A"}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  Destination
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {detail?.citypoundfee?.city?.description ?? "N/A"}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  UPC Colis
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {detail.upc}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  Date et heure
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {formatCreatedAtFR(detail.createdAt)}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  Tracking number
                </p>
                <p className="mt-1 break-all text-sm font-medium leading-5 text-gray-700 dark:text-gray-300">
                  {detail.tracking || "N/A"}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  Categorie
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {detail.category?.description ?? "N/A"}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  {isElectronicCategory(detail.category) ? "QTE" : "Poids"}
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {detail.pounds} {isElectronicCategory(detail.category) ? "unité(s)" : "lbs"}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {CashBadge(detail.condition ?? "N/A")}
              {StatusBadge(
                detail.status ?? "N/A",
                detail?.citypoundfee?.city?.region?.description ?? "N/A"
              )}
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Agent: {detail.user ? detail.user.name : "N/A"}
              </span>
            </div>

            <div className="mt-5 flex max-w-full flex-wrap items-center justify-end gap-2">
              <Button
                size="sm"
                className="shrink-0 p-2"
                variant="outline"
                title="Envoyer un message WhatsApp au client"
                onClick={() => handleWhatsappAfterSave(detail)}
              >
                <MessageCircle className="size-5" />
              </Button>
              <Button
                size="sm"
                className="shrink-0 p-2"
                variant="outline"
                title="Voir ou ajouter la photo du colis"
                onClick={() => handleOpenPictureModal(detail)}
              >
                <FileImageIcon className="size-5" />
              </Button>
              <Button
                size="sm"
                className="shrink-0 p-2"
                variant="outline"
                title="Prendre plusieurs photos du colis"
                onClick={() => handleOpenGalleryCamera(detail)}
              >
                <CameraIcon className="size-5" />
              </Button>
              <Button
                size="sm"
                className="shrink-0 p-2"
                variant="outline"
                title="Imprimer l'etiquette du colis"
                onClick={() => handlePrintLabel(detail.upc)}
              >
                <PrinterIcon className="size-5" />
              </Button>
              <Button
                size="sm"
                className="shrink-0 p-2"
                variant="outline"
                title="Transferer ce colis"
                onClick={() => handleOpenTransferModal(detail)}
              >
                <ArrowRightLeft className="size-5" />
              </Button>
              <Button
                size="sm"
                className="shrink-0 p-2"
                variant="outline"
                title="Modifier ce detail de commande"
                onClick={() => handleOpenEditModal(detail)}
              >
                <PencilIcon className="size-5" />
              </Button>
              <Button
                size="sm"
                className="shrink-0 p-2"
                variant="outline"
                title="Supprimer ce detail de commande"
                onClick={() => handleOpenDeleteModal(detail)}
              >
                <TrashBinIcon className="size-5" />
              </Button>
            </div>
          </div>
        ))}

        {details.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-400 md:col-span-2 xl:col-span-3">
            Aucun detail de commande trouve.
          </div>
        )}
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
              Êtes-vous sûr de vouloir expédier cette commande ?
            </p>
          </div>
             <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                <div>
                  <Label>Date d'expiration</Label>
                  <DatePicker
                    id="date-picker"
                    placeholder="Date d'expiration"
                    onChange={(dates: Date[], currentDateString: string) => {
                      setExpeditionDate(currentDateString);
                    }}
                  />
                </div>
              </div>
          
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-center">
            <Button size="sm" variant="primary" title="Confirmer l'expedition de cette commande" onClick={handleSafeExpedier} disabled={isExpedite}>
              {isExpedite ? "Expédition en cours..." : "Okay, Confirmer"}
            </Button>
          </div>
        </div>
      </Modal>

<Modal isOpen={isCreateOpen} onClose={closeCreateModal} className="max-w-[1080px] m-4">
        <div className="no-scrollbar relative w-full max-w-[1080px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-gray-900">
          <div className="border-b border-gray-100 bg-gradient-to-r from-brand-50 via-white to-blue-50 px-5 py-5 pr-14 dark:border-white/[0.08] dark:from-brand-950/40 dark:via-gray-900 dark:to-blue-950/30 sm:px-7">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/20">
                <PackageCheck className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-300">Unité centrale d&apos;enregistrement</p>
                <h4 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">Ajouter un colis</h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Renseignez les coordonnées, les caractéristiques et les photos du colis.</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-brand-200/70 bg-white/90 p-4 shadow-sm dark:border-brand-500/20 dark:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                  <Boxes className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Ce colis sera enregistré dans la commande</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white">{shiporders ?? "Aucune commande sélectionnée"}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-medium">
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-gray-700 dark:bg-white/[0.06] dark:text-gray-300">{qtycolis ?? 0} colis</span>
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-gray-700 dark:bg-white/[0.06] dark:text-gray-300">{qtypound ?? 0} lbs</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{status ?? "N/A"}</span>
              </div>
            </div>
          </div>

          <form
            className="flex flex-col px-4 pb-5 pt-4 sm:px-7 sm:pb-7"
            onSubmit={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            encType="multipart/form-data"
          >
            <div className="custom-scrollbar max-h-[56vh] overflow-y-auto rounded-2xl bg-gray-50/70 px-4 py-5 dark:bg-white/[0.025] sm:px-5">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mb-2"> 
                <div>
                  <Label>Type Colis <span className="text-red-500">*</span></Label>
                  <Select
                    key={typecolis ?? "type-colis-empty"}
                    options={typeOptions}
                    placeholder="Sélectionnez un type de colis"
                    defaultValue={typecolis ?? ""}
                    onChange={(value: number | string) => handleChangeTypeColis(value)}
                  />
                  {errors.typecolis && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.typecolis}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-start gap-4">
                    <Checkbox
                      checked={isChecked}
                      onChange={() => handleCheckedColis("Complet")}
                      label="Complet"
                    />
                    <Checkbox
                      checked={isCheckedTwo}
                      onChange={() => handleCheckedColis("Amnistie")}
                      label="Amnistie"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
                <div>
                  <Label>Expediteur</Label>
                  <div className="relative m-2">
                  <Input
                    type="text"
                    className="pl-[62px]"
                    value={expediteur ?? ""}
                    onChange={(e) =>
                      setExpediteur(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                    placeholder="Entrez l'expéditeur"
                    disabled={disableFields}
                  />
                    <Button className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400 "
                      onClick={handleopenExpediteurModal}
                      disabled={disableFields}
                    >
                    <SearchIcon className="size-4" />
                  </Button>
                  </div>
                </div>
               
                <div>
                  <Label> Tel. Expediteur</Label>
                  <Input
                    type="text"
                    value={exptelephone ?? ""}
                    onChange={(e) =>
                      setExptelephone(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                    placeholder="Entrez le téléphone de l'expéditeur"
                    disabled={disableFields}
                  />
                </div>
                <div>
                  <Label> Email Expediteur</Label>
                  <Input
                    type="text"
                    value={expemail ?? ""}
                    onChange={(e) =>
                      setExpemail(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                    placeholder="Entrez l'email de l'expéditeur"
                    // required
                    disabled={disableFields}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
                <div>
                  <Label>Recepteur<span className="text-red-500">*</span></Label>
                  <div className="relative m-2">
                  <Input
                    type="text"
                    className="pl-[62px]"
                    value={recipent ?? ""}
                    onChange={(e) =>
                      setRecipent(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                    placeholder="Entrez le recepteur"
                    // required
                    />
                    <Button className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400 "
                    onClick={handleopenRecipentModal}>
                    <SearchIcon className="size-4" />
                   </Button>
                  </div>
                  {errors.recipent && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.recipent}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label> Tel. Recepteur</Label>
                  <Input
                    type="text"
                    value={rectelephone ?? ""}
                    onChange={(e) =>
                      setRectelephone(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                    placeholder="Entrez le téléphone du recepteur"
                    // required
                  />
                </div>
                <div>
                  <Label> Email Recepteur</Label>
                  <Input
                    type="text"
                    value={recemail ?? ""}
                    onChange={(e) =>
                      setRecemail(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                    placeholder="Entrez l'email du recepteur"
                    // required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3 mb-2">
                <div>
                  <Label>Destination<span className="text-red-500">*</span></Label>
                  <Select
                    key={selectedDestinationId ?? "destination-empty"}
                    options={villeOptions}
                    placeholder="Sélectionnez une destination"
                    defaultValue={selectedDestinationId?.toString() ?? ""}
                    onChange={(value: number | string) => handleDestinationChange(value)}
                  />
                  {errors.destination && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.destination}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Categorie<span className="text-red-500">*</span></Label>
                  <Select
                    key={categorieId ?? "categorie-empty"}
                    options={categoryOptions}
                    placeholder="Sélectionnez une categorie"
                    defaultValue={categorieId ?? ""}
                    onChange={(value: number | string) => {
                      handleSelectedcategoryChange(value);
                    }}
                  />
                  {errors.categorie && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.categorie}
                    </p>
                  )}
                </div>
                <div>
                  <Label>{isElectronicColis ? "Qte" : "Poids en (lbs)"}<span className="text-red-500">*</span></Label>
                  <Input
                    type="number"
                    min={isElectronicColis ? 1 : 0.01}
                    step={isElectronicColis ? 1 : 0.01}
                    value={poids ?? ""}
                    onChange={(e) =>
                      setPoids(e.target.value === "" ? null : Number(e.target.value))
                    }
                    onKeyUp={sumPoundsWithPrice}
                    placeholder={isElectronicColis ? "Entrez la quantité" : "Entrez le poids"}
                  />
                  {errors.poids && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.poids}
                    </p>
                  )}
                </div>
              </div>
               <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3 mb-2">
                <div>
                  <Label>Description<span className="text-red-500">*</span></Label>
                  <Select
                    key={`${categorieId ?? "categorie-empty"}-${description ?? "description-empty"}`}
                    options={categorieOptions}
                    placeholder="Sélectionnez une description"
                    defaultValue={description?.toString() ?? ""}
                    onChange={(value: number | string) => handleFixedPriceChange(value)}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.description}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Tracking Number</Label>
                  <Input
                    type="text"
                    value={tracknumber ?? ""}
                    onChange={(e) =>
                      setTracknumber(e.target.value === "" ? null : e.target.value)
                    }
                    placeholder="Entrez le numéro de suivi du colis"
                  />
                </div>
                <div>
                  <Label> Note </Label>
                  <Input
                    type="text"
                    value={notes ?? ""}
                    onChange={(e) =>
                      setNotes(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                    placeholder="Entrez une note"
                    // required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3 mb-2">
                    <div>
                      <Label>Choisir une photo du colis</Label>
                      <FileInput
                        onChange={(e) =>
                          setPictures(
                            e.target.files ? e.target.files[0] : null
                          )
                        }
                        className="custom-class"
                      />
                </div>
                <div >
                  <Label>Prendre une photo du colis</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        title="Ouvrir la camera pour prendre une photo du colis"
                        onClick={handleOpenCameraModal}
                      >
                            <CameraIcon className="size-5" />
                          Prendre une photo
                      </Button>
                    </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 dark:border-white/[0.08] sm:flex-row sm:items-center sm:justify-end">
              <Button size="sm" variant="outline" title="Annuler la creation du colis" onClick={closeCreateModal}>
                Annuler
              </Button>
              <Button size="sm" title="Enregistrer ce colis" disabled={isSaving}>
                {isSaving ? "Enregistrement en cours..." : "Enregistrer le colis"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={isPictureOpen} onClose={closePictureModal}
        className="max-w-[900px] m-4"
      >
        <div className="relative max-h-[90vh] w-full max-w-[900px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                Galerie du colis
              </h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {selectedDetail?.upc ?? "N/A"} - {galleryPhotos.length} photo{galleryPhotos.length > 1 ? "s" : ""} en galerie
              </p>
            </div>
            <Button
              size="sm"
              variant="primary"
              title="Prendre une nouvelle photo pour la galerie"
              onClick={() => {
                closePictureModal();
                openGalleryCameraModal();
              }}
            >
              <CameraIcon className="size-5" />
              Ajouter une photo
            </Button>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Photo principale
            </p>
            <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
                {selectedDetail?.picture ? (
                    <img
                      src={`${Lien.REST_API_IMAGE_URL}/${selectedDetail?.picture}`}
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
                  <div key={photo.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/[0.05] dark:bg-gray-900">
                    <a
                      href={`${Lien.REST_API_IMAGE_URL}/${photo.photo}`}
                      target="_blank"
                      rel="noreferrer"
                      title="Ouvrir cette photo de la galerie"
                    >
                      <img
                        src={`${Lien.REST_API_IMAGE_URL}/${photo.photo}`}
                        alt={`Photo galerie ${photo.id}`}
                        className="h-48 w-full object-cover"
                      />
                    </a>
                    <div className="flex items-center justify-between gap-3 p-3">
                      <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {formatCreatedAtFR(photo.createdAt)}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="p-2"
                        title="Supprimer cette photo de la galerie"
                        onClick={() => handleDeleteGalleryPhoto(photo.id)}
                      >
                        <TrashBinIcon className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500 dark:border-white/[0.08] dark:text-gray-400">
                Aucune photo ajoutée dans la galerie pour ce colis.
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

      <Modal
        isOpen={isCameraOpen} onClose={closeCameraModal}
        className="max-w-[650px] m-4"
      >
        <div className="relative max-h-[90vh] w-full max-w-[650px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-center">
            <CAMERA />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isGalleryCameraOpen} onClose={closeGalleryCameraModal}
        className="max-w-[650px] m-4"
      >
        <div className="relative max-h-[90vh] w-full max-w-[650px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
          <div className="mb-5">
            <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              Nouvelle photo galerie
            </h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Prenez une photo supplémentaire pour le colis {selectedDetail?.upc ?? "N/A"}.
            </p>
          </div>
          <div className="flex items-center gap-3 lg:justify-center">
            <GALLERY_CAMERA />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isExpOpen} onClose={closeExpModal}
        className="max-w-[1200px] m-4"
      >
        
        <div className="no-scrollbar relative w-full max-w-[1200px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Sélectionner un {action === "Expéditeur" ? "expéditeur" : "destinataire"}
            </h4>
          </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
  
          {/* 🔍 Recherche */}
          <div className="relative">
            <Input
              placeholder={`Recherche l'${action === "Expéditeur" ? "expéditeur" : "destinataire"}...`}
              type="text"
              className="pl-14"
              value={rechercheExp}
              onChange={(e) => setRechercheExp(e.target.value)}
              onKeyUp={handleKeyUpExp}
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3 py-2 text-gray-500">
              <SearchIcon className="w-5 h-5" />
            </span>
          </div>

          {/* ⏮ Pagination */}
          <div className="flex items-center justify-center gap-4">
            <button
              disabled={pages === 0}
              title="Afficher la page precedente"
              onClick={() => setPages((p) => p - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
            >
              Préc.
            </button>

            <span className="text-sm">
              Page {pages + 1} / {totalsPages}
            </span>

            <button
              disabled={pages + 1 === totalsPages}
              title="Afficher la page suivante"
              onClick={() => setPages((p) => p + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
            >
              Suiv.
            </button>
          </div>

          {/* ☑️ Filtres */}
          <div className="flex items-center justify-start gap-4">
            <Checkbox
              checked={isChecked}
              onChange={() => handleChecked("Client")}
              label="Client"
            />
            <Checkbox
              checked={isCheckedTwo}
              onChange={() => handleChecked("Ettendu")}
              label="Ettendu"
            />
          </div>

        </div>

            <div className="min-w-[900px] max-h-[400px] overflow-y-auto px-2 pb-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Code
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Nom
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Telephone 
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Email
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Ville
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
                {filter === "Client" ? (
                  clients.map((cli) => (
                    <TableRow key={cli.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        {cleanVelogCode(cli.usercode)}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        {cli.name}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        {cli.phone}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        {cli.email}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        {cli.ville.description}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            className="p-2"
                            variant="outline"
                            onClick={() => handleselectedExpediteur(cli)}
                          >
                            <PencilIcon className="size-5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  detailsClients.map((clis) => (
                    <TableRow key={clis.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        N/A
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        {clis.rec_name}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        {clis.rec_phone}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        {clis.rec_email}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        N/A
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            className="p-2"
                            variant="outline"
                            onClick={() => handleselectedExpediteurdetails(clis)}
                          >
                            <PencilIcon className="size-5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}

              </TableBody>
            </Table>
          </div>
        </div>
      </Modal>
       <Modal
        isOpen={isPriceOpen} onClose={closePriceModal}
        className="max-w-[550px] m-4 z-[10000]" 
      >
        <div className="no-scrollbar relative w-full max-w-[550px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Entrez le prix et frais de douane
            </h4>
          </div>
          <div >
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mb-2">
                  <div>
                  <Label>{isElectronicColis ? "Prix unitaire" : "Prix fixe"}</Label>
                  <Input
                    type="number"
                    value={price ?? ""}
                    onChange={(e) =>
                      setPrice(
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                    placeholder="Entrez le prix du colis"
                    // required
                  />
                </div>
                <div>
                  <Label> {labelDouane} </Label>
                  <Input
                    type="number"
                    value={douane ?? ""}
                    onChange={(e) =>
                      setDouane(
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                    placeholder={`Entrez le ${labelDouane? labelDouane.toLowerCase() : "frais de douane"}`}
                    // required
                  />
                </div>
              </div>
              <div className="mt-5 rounded-xl border border-brand-100 bg-brand-50 p-4 dark:border-brand-500/20 dark:bg-brand-500/10">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
                  {isElectronicColis ? "Sous-total électronique" : "Sous-total à prix fixe"}
                </p>
                <p className="mt-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                  {isElectronicColis ? (
                    <>
                      {poids ?? 0} × {(price ?? 0).toFixed(2)} + {(douane ?? 0).toFixed(2)} ={" "}
                    </>
                  ) : (
                    <>
                      {(price ?? 0).toFixed(2)} + {(douane ?? 0).toFixed(2)} ={" "}
                    </>
                  )}
                  {calculateColisSubtotal(poids, price, douane, categorieId).toFixed(2)} $US
                </p>
              </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isTransferOpen}
        onClose={closeTransferModal}
        className="max-w-[560px] m-4"
      >
        <div className="relative w-full max-w-[560px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
          <div className="px-2 pr-10">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Transférer ce colis
            </h4>
            <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
              Sélectionnez la commande dans laquelle vous voulez déplacer le colis{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {selectedDetail?.upc ?? "N/A"}
              </span>
              .
            </p>
          </div>

          <div className="space-y-5 px-2">
            <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600 dark:bg-white/[0.03] dark:text-gray-300">
              <p>
                Commande actuelle:{" "}
                <span className="font-semibold text-gray-800 dark:text-white/90">
                  {selectedDetail?.ship?.shiporder ?? "N/A"}
                </span>
              </p>
              <p className="mt-1 break-all">
                Tracking: {selectedDetail?.tracking || "N/A"}
              </p>
            </div>

            <div>
              <Label>Commande de destination</Label>
              <Select
                options={orders
                  .filter((order) => order.id !== selectedDetail?.ship?.id)
                  .map((order) => ({
                    label: `${order.shiporder} | ${order.date} | ${order.status}`,
                    value: String(order.id),
                  }))}
                placeholder="Sélectionnez une commande"
                onChange={(value) => setSelectedTransferOrderId(Number(value))}
              />
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button
                size="sm"
                variant="outline"
                title="Annuler le transfert"
                onClick={() => {
                  setSelectedTransferOrderId(null);
                  closeTransferModal();
                }}
                disabled={isTransferring}
              >
                Annuler
              </Button>
              <Button
                size="sm"
                variant="primary"
                title="Transferer ce colis vers la commande selectionnee"
                onClick={handleTransferColis}
                disabled={isTransferring || selectedTransferOrderId === null}
              >
                {isTransferring ? "Transfert..." : "Transferer"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isReportOpen}
        onClose={closeReportModal}
        className="max-w-[1040px] m-4"
      >
        <div className="relative max-h-[90vh] w-full max-w-[1040px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                Rapport de la commande
              </h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {shiporders ?? "Aucune commande sélectionnée"} - {selectedOrderReport.totalColis} colis
              </p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                Rapport calculé sur tous les colis de la commande, sans tenir compte de la pagination.
              </p>
            </div>
            <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
              {isReportLoading ? "Chargement..." : "Mini dashboard"}
            </div>
          </div>

          {isReportLoading ? (
            <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500 dark:border-white/[0.08] dark:text-gray-400">
              Chargement du rapport complet de la commande...
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Colis le plus lourd
              </p>
              <p className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white/90">
                {selectedOrderReport.heaviest ? `${selectedOrderReport.heaviest.pounds ?? 0} lbs` : "N/A"}
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {selectedOrderReport.heaviest?.upc ?? "Aucun colis"}
              </p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {selectedOrderReport.heaviest?.rec_name ?? "N/A"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Client avec le plus de colis
              </p>
              <p className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white/90">
                {selectedOrderReport.topClient?.value ?? 0} colis
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {selectedOrderReport.topClient?.label ?? "N/A"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Factures cash / due
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-green-50 p-3 text-center dark:bg-green-500/10">
                  <p className="text-xs font-medium text-green-700 dark:text-green-300">Payé cash</p>
                  <p className="mt-1 text-xl font-semibold text-green-800 dark:text-green-200">
                    {selectedOrderReport.invoices.paidCash}
                  </p>
                </div>
                <div className="rounded-xl bg-red-50 p-3 text-center dark:bg-red-500/10">
                  <p className="text-xs font-medium text-red-700 dark:text-red-300">Due</p>
                  <p className="mt-1 text-xl font-semibold text-red-800 dark:text-red-200">
                    {selectedOrderReport.invoices.due}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-100 p-5 dark:border-white/[0.05]">
            <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h5 className="text-base font-semibold text-gray-800 dark:text-white/90">
                  Graphique colis par ville
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Répartition de tous les colis de la commande sélectionnée.
                </p>
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Total: {selectedOrderReport.totalColis}
              </span>
            </div>

            <div className="space-y-4">
              {selectedOrderReport.cities.length > 0 ? (
                selectedOrderReport.cities.map((item) => {
                  const maxCityValue = Math.max(...selectedOrderReport.cities.map((city) => city.value), 1);
                  const width = `${Math.max((item.value / maxCityValue) * 100, 8)}%`;

                  return (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.label}</span>
                        <span className="text-sm font-semibold text-gray-800 dark:text-white/90">{item.value}</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-white/[0.05]">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all dark:bg-blue-400"
                          style={{ width }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Aucune donnée disponible pour le graphique.</p>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 p-5 dark:border-white/[0.05]">
              <h5 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                Colis par catégorie
              </h5>
              <div className="space-y-3">
                {selectedOrderReport.categories.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-white/[0.03]">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{item.label}</span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-white/90">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 p-5 dark:border-white/[0.05]">
              <h5 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                Top 5 clients
              </h5>
              <div className="max-h-[300px] space-y-3 overflow-y-auto pr-1">
                {selectedOrderReport.clients.length > 0 ? (
                  selectedOrderReport.clients.slice(0, 5).map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-white/[0.03]">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{item.label}</span>
                      <span className="text-sm font-semibold text-gray-800 dark:text-white/90">{item.value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Aucun client trouvé.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 p-5 dark:border-white/[0.05]">
              <h5 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                Colis par utilisateur
              </h5>
              <div className="max-h-[300px] space-y-3 overflow-y-auto pr-1">
                {selectedOrderReport.users.length > 0 ? (
                  selectedOrderReport.users.map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-white/[0.03]">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{item.label}</span>
                      <span className="text-sm font-semibold text-gray-800 dark:text-white/90">{item.value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Aucun utilisateur trouvé.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>

       <Modal
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
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
              Êtes-vous sûr de vouloir supprimer ce colis ?
            </p>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-center">
            <Button size="sm" variant="primary" title="Confirmer la suppression de ce colis" onClick={handleSafeDelete}>
              Okay, Confirmer
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={closeEditModal} className="max-w-[1080px] m-4">
        <div className="no-scrollbar relative w-full max-w-[1080px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-gray-900">
          <div className="border-b border-gray-100 bg-gradient-to-r from-brand-50 via-white to-blue-50 px-5 py-5 pr-14 dark:border-white/[0.08] dark:from-brand-950/40 dark:via-gray-900 dark:to-blue-950/30 sm:px-7">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/20">
                <PackageCheck className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-300">Modification du colis</p>
                <h4 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">Éditer {selectedDetail?.upc ?? "le colis"}</h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Vérifiez puis mettez à jour les informations nécessaires.</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-200/70 bg-white/90 p-4 shadow-sm dark:border-brand-500/20 dark:bg-white/[0.04]">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300"><Boxes className="size-5" /></div>
                <div><p className="text-xs text-gray-500 dark:text-gray-400">Commande associée</p><p className="font-bold text-gray-900 dark:text-white">{selectedDetail?.ship?.shiporder ?? shiporders ?? "N/A"}</p></div>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:bg-white/[0.06] dark:text-gray-300">{selectedDetail?.category?.part ?? "Catégorie non définie"}</span>
            </div>
          </div>

          <form
            className="flex flex-col px-4 pb-5 pt-4 sm:px-7 sm:pb-7"
            onSubmit={handleSafeEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
          >
            <div className="custom-scrollbar max-h-[56vh] overflow-y-auto rounded-2xl bg-gray-50/70 px-4 py-5 dark:bg-white/[0.025] sm:px-5">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mb-2"> 
                <div>
                  <Label>Type Colis <span className="text-red-500">*</span></Label>
                  <Select
                    options={typeOptions}
                    placeholder="Sélectionnez un type de colis"
                    defaultValue={selectedDetail?.type}
                    onChange={(value: number | string) => handleChangeTypeColis(value)}
                  />
                  {errors.typecolis && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.typecolis}
                    </p>
                  )}
                </div>
                </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
                <div>
                  <Label>Expediteur</Label>
                  <div className="relative m-2">
                  <Input
                    type="text"
                    className="pl-[62px]"
                    value={expediteur ?? ""}
                    onChange={(e) =>
                      setExpediteur(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                    placeholder="Entrez l'expéditeur"
                    disabled={disableFields}
                  />
                    <Button className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400 "
                      onClick={handleopenExpediteurModal}
                      disabled={disableFields}
                    >
                    <SearchIcon className="size-4" />
                  </Button>
                  </div>
                </div>
               
                <div>
                  <Label> Tel. Expediteur</Label>
                  <Input
                    type="text"
                    value={exptelephone ?? ""}
                    onChange={(e) =>
                      setExptelephone(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                    placeholder="Entrez le téléphone de l'expéditeur"
                    disabled={disableFields}
                  />
                </div>
                <div>
                  <Label> Email Expediteur</Label>
                  <Input
                    type="text"
                    value={expemail ?? ""}
                    onChange={(e) =>
                      setExpemail(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                    placeholder="Entrez l'email de l'expéditeur"
                    // required
                    disabled={disableFields}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
                <div>
                  <Label>Recepteur<span className="text-red-500">*</span></Label>
                  <div className="relative m-2">
                  <Input
                    type="text"
                    className="pl-[62px]"
                    value={recipent ?? ""}
                    onChange={(e) =>
                      setRecipent(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                    placeholder="Entrez le recepteur"
                    // required
                    />
                    <Button className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400 "
                    onClick={handleopenRecipentModal}>
                    <SearchIcon className="size-4" />
                   </Button>
                    </div>
                </div>
                {errors.recipent && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.recipent}
                    </p>
                  )}
                <div>
                  <Label> Tel. Recepteur</Label>
                  <Input
                    type="text"
                    value={rectelephone ?? ""}
                    onChange={(e) =>
                      setRectelephone(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                    placeholder="Entrez le téléphone du recepteur"
                    // required
                  />
                </div>
                <div>
                  <Label> Email Recepteur</Label>
                  <Input
                    type="text"
                    value={recemail ?? ""}
                    onChange={(e) =>
                      setRecemail(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                    placeholder="Entrez l'email du recepteur"
                    // required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3 mb-2">
                <div>
                  <Label>Destination<span className="text-red-500">*</span></Label>
                  <Select
                    options={villeOptions}
                    placeholder="Sélectionnez une destination"
                    defaultValue={selectedDetail?.citypoundfee?.city?.id?.toString()}
                    onChange={(value: number | string) => handleDestinationChange(value)}
                  />
                  {errors.destination && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.destination}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Categorie<span className="text-red-500">*</span></Label>
                  <Select
                    options={categoryOptions}
                    placeholder="Sélectionnez une categorie"
                    defaultValue={selectedDetail?.category?.part?.toString()}
                    onChange={(value: number | string) => {
                      handleSelectedcategoryChange(value);
                    }}
                  />
                </div>
                <div>
                  <Label>{isElectronicColis ? "Qte" : "Poids en (lbs)"}<span className="text-red-500">*</span></Label>
                  <Input
                    type="number"
                    min={isElectronicColis ? 1 : 0.01}
                    step={isElectronicColis ? 1 : 0.01}
                    value={poids ?? ""}
                    onChange={(e) =>
                      setPoids(e.target.value === "" ? null : Number(e.target.value))
                    }
                    onKeyUp={sumPoundsWithPrice}
                    placeholder={isElectronicColis ? "Entrez la quantité" : "Entrez le poids"}
                  />
                  {errors.poids && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.poids}
                    </p>
                  )}
                </div>
              </div>
               <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3 mb-2">
                <div>
                  <Label>Description<span className="text-red-500">*</span></Label>
                  <Select
                    key={`${selectedDetail?.id ?? "edit"}-${categorieId ?? "categorie-empty"}-${description ?? "description-empty"}`}
                    options={categorieOptions}
                    placeholder="Sélectionnez une description"
                    defaultValue={description?.toString() ?? ""}
                    onChange={(value: number | string) => handleFixedPriceChange(value)}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.description}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Tracking Number</Label>
                  <Input
                    type="text"
                    value={tracknumber ?? ""}
                    onChange={(e) =>
                      setTracknumber(e.target.value === "" ? null : e.target.value)
                    }
                    placeholder="Entrez le numéro de suivi du colis"
                  />
                </div>
                <div>
                  <Label> Note </Label>
                  <Input
                    type="text"
                    value={notes ?? ""}
                    onChange={(e) =>
                      setNotes(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                    placeholder="Entrez une note"
                    // required
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 dark:border-white/[0.08] sm:flex-row sm:items-center sm:justify-end">
              <Button size="sm" variant="outline" onClick={closeEditModal}>
                Annuler
              </Button>
              <Button size="sm" disabled={isSaving}>
                {isSaving ? "Modification en cours..." : "Modifier le colis"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
