"use client";
import React, { FormEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useState,useEffect } from "react";
import { SkeletonCardGrid } from "../ui/skeleton/Skeleton";
import { listAmnisty,searchmyAmnisty,updateAmnistyStatus,downloadAmnistyInvoice,printAmnistyLabel } from "@/services/AmnistyService";
import Button from "../ui/button/Button";
import { Boxes, DownloadIcon, FileImageIcon, ForwardIcon, MessageCircleIcon, PackageCheck, PencilIcon, PrinterIcon } from "lucide-react";
import Input from "../form/input/InputField";
import { SearchIcon } from "../../icons";
import { Modal } from "../ui/modal";
import { useModal } from "../../hooks/useModal";
import Lien from "@/route/BASE_URL";
import Label from "../form/Label";
import Select from "../form/Select";
import Checkbox from "../form/input/Checkbox";

import { checkPrintAgentStatus } from "../../../services/PrintAgentService";
import { listClients,rechercherClients } from "@/services/RegisterService";
import { listOrderDetailsEtendu, searchlistOrderDetailsEtendu } from "../../../services/OrderDetailsService";
import { getlistOrders} from "../../../services/OrderService";
import { createSendOrderDetails,printColisLabel} from "../../../services/OrderDetailsService"
import { getlistVilles } from "@/services/VilleService";
import { getAmountFees } from "../../../services/FraisService";
import { listCategoriesForSelect, getCategorieByPart } from "../../../services/CategorieService";
import { getClient } from "@/services/LoginService";
import { jwtDecode } from "jwt-decode";


// Dynamically import the ReactApexChart component
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
      douane: number;
      picture: string;
      note: string | null;
      user: Client | null;
      createdAt: string;
}
    
interface Amnisty{
  id: number;
  category: Category;
  pounds: number;
  status: string;
  tracking: string;
  picture: string;
  note: string;
  name: string;
  telephone: string;
  price: number;
  douane: number;
  citypoundfee: Cipinfee;
  user: Client | null;
  createdAt: string;
}

  const StatusBadge = (status:string) => {
if(status==="Reclamation en attente."){
    return(
      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
        {status}
      </span>
    )
  }else  {
    return(
      <span className="inline-flex items-center rounded-full bg-success-100 px-2.5 py-0.5 text-xs font-medium text-success-800">
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

function cleanVelogCode(value: string | null): string | null {
  if (!value) return value;

  return value.startsWith("VELOG XPRESS-")
    ? value.replace("VELOG XPRESS-", "")
    : value;
}

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

function formatLocalDateFrenchDateTime(
  value: string | null | undefined
): string {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    console.error("Date invalide :", value);
    return "";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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


export default function AmnistyTab() {
  const AMNISTY_PAGE_SIZE = 9;
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isSendOpen, openModal: openSendModal, closeModal: closeSendModal } = useModal();
  const {isOpen: isExpOpen,openModal: openExpModal,closeModal: closeExpModal,} = useModal();

  const {isOpen: isPriceOpen,openModal: openPriceModal,closeModal: closePriceModal,} = useModal();
  const [amnisties, setAmnisties] = useState<Amnisty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDetail, setSelectedDetail] = useState<Amnisty | null>(null);
  const [amnistyPage, setAmnistyPage] = useState(0);
  const [recherche, setRecherche] = useState("");
  const totalAmnistyPages = Math.max(
    1,
    Math.ceil(amnisties.length / AMNISTY_PAGE_SIZE)
  );
  const paginatedAmnisties = amnisties.slice(
    amnistyPage * AMNISTY_PAGE_SIZE,
    amnistyPage * AMNISTY_PAGE_SIZE + AMNISTY_PAGE_SIZE
  );

  //-------------- Send Colis Modal ----------------//
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [shiporders, setShiporders] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
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
    const [disableFields, setDisableFields] = useState<boolean>(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [detailsClients, setDetailsClients] = useState<OrderDetails[]>([]);
    const [fraisSpeciaux, setFraisSpeciaux] = useState<Cipinfee | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
    const [isChecked, setIsChecked] = useState(true);
    const [isCheckedTwo, setIsCheckedTwo] = useState(false);
  
    const [filter, setFilter] = useState<string>("Client");
    const [action, setAction] = useState<string>("Expéditeur");
    const [categorieOptions, setCategorieOptions] = useState<Option[]>([]);
    const isElectronicColis = isElectronicPart(categorieId);
  
    const [pages, setPages] = useState(0);
    const [totalsPages, setTotalsPages] = useState(0);
    const [rechercheExp, setRechercheExp] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesSpecial, setCategoriesSpecial] = useState<Category[]>([]);
  const [user, setUser] = useState<Client | null>(null);
  const [labelDouane, setLabelDouane] = useState<string | null>("Frais de Douane");

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


  //-------------- End Send Colis Modal ----------------//

  const fectchAmnisty = async () => {
    try {
      const response = await listAmnisty()
      setAmnisties(response.data)
    } catch (error) {
      console.error("Échec du chargement des amnisty:", error);
    }
    
  }

 useEffect(() => {
  // appel initial
  fectchAmnisty().finally(() => setIsLoading(false));

  // interval
  const interval = setInterval(() => {
    fectchAmnisty();
  }, 5000); // 5 secondes

  // cleanup (OBLIGATWA)
  return () => clearInterval(interval);

}, []);

useEffect(() => {
  if (amnistyPage > 0 && amnistyPage + 1 > totalAmnistyPages) {
    setAmnistyPage(totalAmnistyPages - 1);
  }
}, [amnistyPage, totalAmnistyPages]);


  const handleKeyUp = async (searchTerm = recherche) => {
    setAmnistyPage(0);
    if(searchTerm.trim() === ""){
      fectchAmnisty();
    }else{
      try {
        const response = await searchmyAmnisty(searchTerm);
        setAmnisties(response.data);
      } catch (error) {
        console.error("Échec de la recherche des amnisty:", error);
      }
    }
  };


  function handleOpenModal(amnisty: Amnisty): void {
    setSelectedDetail(amnisty);
    openModal();
  }

  function handleOpenSendModal(amnisty: Amnisty): void {
    setSelectedDetail(amnisty);
    setPoids(amnisty?.pounds);
    setTracknumber(amnisty?.tracking);
    setCategorieId(String(amnisty?.category?.part));
    //setDescription(amnisty?.category?.id);
    setNotes(amnisty?.note);
    setPrice(amnisty?.price);
    setDouane(amnisty?.douane);
    //setDestination([amnisty?.citypoundfee?.city!]);
    //setSelectedDestinationId(amnisty?.citypoundfee?.city.id ?? null);
    setExpediteur(amnisty?.name);
    setExptelephone(amnisty?.telephone);
    setDisableFields(true);
    openSendModal();
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
      setPrice(null);
    }
    if (categorieId === null) {
      newErrors["categorie"] = "La catégorie est requise.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }


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
  
    const fetchOrderSelected = async (orderId: number) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      console.warn("Order not found for id:", orderId);
      return;
    }

    setShiporders(order.shiporder);
    setErrors({}); // Clear previous errors
  };
  
  function handleSelectOrderChange(value: number | string): void {
    const orderId = Number(value);
    setSelectedOrderId(orderId);
    fetchOrderSelected(orderId);
    // Clear error for selectedOrderId if it exists
    if (errors.selectedOrderId) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.selectedOrderId;
        return newErrors;
      });
    }
  }

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

  
  const handleopenExpediteurModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!selectedOrderId) {
      
        setErrors((prev) => ({
          ...prev,
          selectedOrderId: "Veuillez sélectionner une commande avant de continuer.",
        }));
        return;
      }
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
       if (!selectedOrderId) {
      
        setErrors((prev) => ({
          ...prev,
          selectedOrderId: "Veuillez sélectionner une commande avant de continuer.",
        }));
        return;
      }
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
      setErrors({});
      setDisableFields(false);
      setExpediteurCode(null);
      setFraisSpeciaux(null);
      setCategorieOptions([]);
      setLabelDouane("Frais de Douane");
      setIsChecked(true);
      setIsCheckedTwo(false);
      closePriceModal();
  
    }
  
  
  
    useEffect(() => {
      setRechercheExp("");
      setPages(0);
      handleChecked("Client");
      fetchClients(0);
    }, [isExpOpen]);

const handleChecked = (name: string) => {
    setPages(0);
    setIsChecked(name === "Client");
    setIsCheckedTwo(name === "Ettendu");
    setFilter(name);
};
  
  const categoryOptions: Option[] = [
      { label: "Document", value: "Document" },
      { label: "Electronique", value: "Electronique" },
    { label: "Normal", value: "Normal" },
      { label: "HazMat", value: "HazMat" },
    ]
  
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

useEffect(() => {
  if (categorieId === "Document" || categorieId === "Electronique" || categorieId === "HazMat") {
    const options = categories
      .filter((c) => c.part === categorieId) // 🔥 IMPORTANT
      .map((c) => ({
        label: c.description,
        value: String(c.id),
      }));

    setCategorieOptions(options);
  } else if (categorieId === "Normal") {
    const descriptionOptions = categoriesSpecial
      .filter((c) => c.part === categorieId) // 🔥 IMPORTANT
      .map((c) => ({
        label: c.description,
        value: String(c.id),
      }));
    setCategorieOptions(descriptionOptions);
  }
}, [categorieId, categories, categoriesSpecial]);

  
  async function handleDestinationChange(value: string | number): Promise<void> {
    const destinationId = Number(value);
    setSelectedDestinationId(destinationId);
    // Fetch special fees for the selected destination
     const response = await getAmountFees(destinationId);
      if (response.data) {
        setFraisSpeciaux(response.data);
      if (!isElectronicColis && poids !== null && response.data) {
      const poundsFee = poids * (response.data.pounds?.amount ?? 0);
      setPrice(poundsFee);
    }
      } 
    if (errors.destination) {
      setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.destination;
      return newErrors;
      });
    }
  }
  
function handleFixedPriceChange(value: string | number): void {
    const selectedCategoryId = Number(value);
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

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validate required fields
    if (!validateDetailsForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      const selectedOrder = {
          id: selectedOrderId!,
          shiporder: shiporders!,
          colisQty: ""!,
          poundQty: ""!,
          shipdate: ""!,
          status: ""!
        };
        const selectedCategory = {
          id: description! ?? selectedDetail?.category?.id ?? 0,
          description: categories.find(cat => cat.id === (description! ?? selectedDetail?.category?.id ?? 0))?.description || "",
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
          citypoundfee: fraisSpeciaux ?? selectedDetail?.citypoundfee ?? 0,
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
          picture: selectedDetail?.picture || "",
          note: notes!,
          user: user
        };
//console.log("Payload pour création du colis:", playload);
      const playloadAmnisty = {
          category: selectedCategory,
          pounds: poids!,
          status: "Reclamer.",
          tracking: selectedDetail!.tracking,
          note: selectedDetail!.note!
        };

      const response = await createSendOrderDetails(playload);
      // Print label after successful save
      if (response.data) {
       // console.log("Colis enregistré avec succès:", response.data.tracking);
        await updateAmnistyStatus(selectedDetail!.tracking, playloadAmnisty);
        fectchAmnisty();
        await handlePrintLabel(response.data.upc);
        cleanForm();
      }
      closeSendModal();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du colis:", error);
      // Handle error - show notification, etc.
    } finally {
      setIsSaving(false);
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

  function downloadInvoiceBlob(blob: Blob, fileName: string): void {
    const url = globalThis.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    globalThis.URL.revokeObjectURL(url);
  }

  function getAmnistyInvoiceUrl(amnisty: Amnisty): string {
    return `${Lien.REST_API_BASE_URL}/amnisty/amnistyinvoicedownload?name=${encodeURIComponent(
      amnisty.name.trim()
    )}&phone=${encodeURIComponent(
      amnisty.telephone.trim()
    )}&tracking=${encodeURIComponent(amnisty.tracking.trim())}`;
  }

  async function handleDownloadInvoice(amnisty: Amnisty): Promise<void> {
    const fileName = `facture_${amnisty.name.trim() || amnisty.tracking}.pdf`;

    try {
      const response = await downloadAmnistyInvoice(
        amnisty.name,
        amnisty.telephone,
        amnisty.tracking
      );
      downloadInvoiceBlob(new Blob([response.data]), fileName);
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status !== 401) {
        console.error("Erreur lors du téléchargement :", error);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(getAmnistyInvoiceUrl(amnisty), {
          headers: {
            Accept: "application/pdf",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const blob = await response.blob();
        downloadInvoiceBlob(blob, fileName);
      } catch (retryError) {
        console.error("Erreur lors du téléchargement :", retryError);
        alert(
          "Impossible de télécharger cette facture. Veuillez vérifier votre session puis réessayer."
        );
      }
    }
  }

  function handleWhatsappInvoice(amnisty: Amnisty): void {
    const clientName = amnisty.name.trim();
    const clientPhone = amnisty.telephone.trim();
    const tracking = amnisty.tracking.trim();
    const formattedPhone = formatInternationalPhone(clientPhone);

    if (!formattedPhone) {
      alert("Le numéro de téléphone du client n'est pas valide pour WhatsApp.");
      return;
    }

    const invoiceUrl = getAmnistyInvoiceUrl({
      ...amnisty,
      name: clientName,
      telephone: clientPhone,
      tracking,
    });

    const message = [
      `Bonjour ${clientName},`,
      "",
      `Votre facture pour le colis amnisty ${tracking} est disponible.`,
      `Vous pouvez la consulter ou la télécharger ici: ${invoiceUrl}`,
      "",
      "Veuillez noter que le traitement de votre colis ne pourra pas être effectué tant que cette facture n’aura pas été réglée. Merci de procéder au paiement afin d’éviter tout retard dans le processus.",
      "",
      "Merci de votre confiance.",
    ].join("\n");

    const whatsappPhone = formattedPhone.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <>
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Colis Amnisty
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Tout ces colis sont sans destinataire final.
          </p>
        </div>
        <div className="flex w-full flex-col items-stretch gap-3 sm:items-end">
          <div className="flex w-full flex-col items-stretch gap-3 lg:w-auto lg:flex-row lg:items-center lg:justify-end">
            <div className="relative w-full lg:w-[320px]">
              <Input
                placeholder="Recherche par trancking..."
                type="text"
                className="pl-15"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                onKeyUp={(e) => handleKeyUp(e.currentTarget.value)}
              />
              <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400 ">
                <SearchIcon className="w-6 h-6 text-gray-500" />
              </span>
            </div>
            {amnisties.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50 p-2 dark:border-white/[0.05] dark:bg-white/[0.03]">
                <p className="px-2 text-sm text-gray-500 dark:text-gray-400">
                  Page {amnistyPage + 1} sur {totalAmnistyPages} - {amnisties.length} colis
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    title="Afficher la page précédente"
                    disabled={amnistyPage === 0}
                    onClick={() => setAmnistyPage((page) => Math.max(page - 1, 0))}
                  >
                    Précédent
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    title="Afficher la page suivante"
                    disabled={amnistyPage + 1 >= totalAmnistyPages}
                    onClick={() =>
                      setAmnistyPage((page) =>
                        Math.min(page + 1, totalAmnistyPages - 1)
                      )
                    }
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <SkeletonCardGrid count={6} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" />
      ) : (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {paginatedAmnisties.map((amnisty) => (
          <div
            key={amnisty.id}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-theme-sm transition hover:shadow-theme-md dark:border-white/[0.05] dark:bg-white/[0.03]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="break-all text-base font-semibold text-gray-800 dark:text-white/90">
                  {amnisty.tracking}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {amnisty?.name || "N/A"} - {amnisty?.telephone || "N/A"}
                </p>
              </div>
              {StatusBadge(amnisty.status)}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  Catégorie
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {amnisty.category?.description || "N/A"}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  {isElectronicPart(amnisty.category?.part) ? "QTE" : "Poids"}
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {amnisty.pounds} {isElectronicPart(amnisty.category?.part) ? "unité(s)" : "lbs"}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03] sm:col-span-2">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  Note
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {amnisty.note || "N/A"}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03] sm:col-span-2">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  Date
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {formatLocalDateFrenchDateTime(amnisty.createdAt) || "N/A"}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03] sm:col-span-2">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  Agent
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {amnisty.user?.name|| "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-5 flex max-w-full flex-wrap items-center justify-end gap-2">
              <Button
                size="sm"
                className="shrink-0 p-2"
                variant="outline"
                title="Imprimer l'etiquette du colis"
                onClick={() => handlePrintAmnisty(amnisty.tracking)}
              >
                <PrinterIcon className="size-5" />
              </Button>
              <Button
                size="sm"
                className="shrink-0 p-2"
                variant="outline"
                title="Voir la photo du colis amnisty"
                onClick={() => handleOpenModal(amnisty)}
              >
                <FileImageIcon className="size-5" />
              </Button>
              <Button
                size="sm"
                className="shrink-0 p-2"
                variant="outline"
                title="Transformer ce colis amnisty en colis"
                onClick={() => handleOpenSendModal(amnisty)}
              >
                <ForwardIcon className="size-5" />
              </Button>
              {amnisty.name && amnisty.telephone && (
                <>
                  <Button
                    size="sm"
                    className="shrink-0 p-2"
                    variant="outline"
                    title="Télécharger la facture de ce colis amnisty"
                    onClick={() => handleDownloadInvoice(amnisty)}
                  >
                    <DownloadIcon className="size-5" />
                  </Button>
                  <Button
                    size="sm"
                    className="shrink-0 p-2"
                    variant="outline"
                    title="Envoyer la facture de ce colis amnisty par WhatsApp"
                    onClick={() => handleWhatsappInvoice(amnisty)}
                  >
                    <MessageCircleIcon className="size-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}

        {amnisties.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-400 md:col-span-2 xl:col-span-3">
            Aucun colis amnisty trouvé.
          </div>
        )}
      </div>
      )}
      </div>
       <Modal
        isOpen={isOpen} onClose={closeModal}
        className="max-w-[650px] m-4"
      >
        <div className="no-scrollbar relative max-h-[90vh] w-full max-w-[650px] overflow-y-auto rounded-3xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-white/[0.08] dark:bg-gray-900 sm:p-7">
          <div className="mb-5 pr-10"><p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">Aperçu du colis Amnisty</p><h4 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{selectedDetail?.upc ?? "Détails du colis"}</h4></div>
          <div className="flex h-[260px] w-full items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-3 dark:border-white/[0.06] dark:bg-white/[0.03] sm:h-[340px]">
                {selectedDetail?.picture ? (
                    <img src={Lien.resolveFileUrl(selectedDetail?.picture)} alt={`${selectedDetail?.picture}`} className="h-full w-full object-contain" />
                  ) : (
                    
                      <img src="/images/user/colis.png" alt="Default Colis Image" className="h-full w-full object-contain" />
                    
                  )}
          </div>
          <div className="mt-5 overflow-hidden rounded-2xl border border-gray-100 dark:border-white/[0.06]">
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
                  <TableCell className="py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                    Tracking Number
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                    :
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    {selectedDetail?.tracking?selectedDetail?.tracking:"N/A"}
                  </TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell className="py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                    Prix
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                    :
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    {selectedDetail?.citypoundfee?.city?.description ?? "N/A"}
                </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                    Categorie
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                    :
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    {selectedDetail?.category?.description}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                    {isElectronicPart(selectedDetail?.category?.part) ? "QTE" : "Poids"}
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                    :
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    {selectedDetail?.pounds} {isElectronicPart(selectedDetail?.category?.part) ? "unité(s)" : "lbs"}
                </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                    Prix
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                    :
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    {selectedDetail?.price ?? "0"} $US
                </TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell className="py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                    Douane
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                    :
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    {selectedDetail?.douane ?? "0"} $US
                </TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell className="py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                    Sous Total
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                    :
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    {(selectedDetail?.price ?? 0) + (selectedDetail?.douane ?? 0)} $US
                </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                    Status
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                    :
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    {selectedDetail?.status}
                </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isSendOpen} onClose={closeSendModal} className="max-w-[1080px] m-4">
        <div className="no-scrollbar relative w-full max-w-[1080px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-gray-900">
          <div className="border-b border-gray-100 bg-gradient-to-r from-brand-50 via-white to-blue-50 px-5 py-5 pr-14 dark:border-white/[0.08] dark:from-brand-950/40 dark:via-gray-900 dark:to-blue-950/30 sm:px-7">
            <div className="flex items-start gap-4"><div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/20"><PackageCheck className="size-6" /></div><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-300">Transfert depuis Amnisty</p><h4 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">Créer le colis dans une commande</h4><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Complétez les informations avant de transférer ce colis.</p></div></div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-200/70 bg-white/90 p-4 shadow-sm dark:border-brand-500/20 dark:bg-white/[0.04]"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300"><Boxes className="size-5" /></div><div><p className="text-xs text-gray-500 dark:text-gray-400">Colis à transférer</p><p className="font-bold text-gray-900 dark:text-white">{selectedDetail?.upc ?? "N/A"}</p></div></div><div className="flex flex-wrap gap-2"><span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:bg-white/[0.06] dark:text-gray-300">{selectedDetail?.category?.part ?? "N/A"}</span><span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">{selectedDetail?.category?.description ?? "N/A"}</span></div></div>
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
                    <Label>Commande <span className="text-red-500">*</span></Label>
                    <Select
                        options={orderOptions}
                        placeholder="Sélectionnez une commande"
                        onChange={(value) =>handleSelectOrderChange(value)}
                      />
                    
                    {errors["selectedOrderId"] && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors["selectedOrderId"]}
                      </p>
                    )}
                </div>
                <div>
                  <Label>Type Colis <span className="text-red-500">*</span></Label>
                  <Select
                    options={typeOptions}
                    placeholder="Sélectionnez un type de colis"
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
                  <Label>Expediteur<span className="text-red-500">*</span></Label>
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
                    //defaultValue={selectedDetail?.citypoundfee?.city?.id ?? ""}
                    placeholder="Sélectionnez une destination"
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
                    defaultValue={selectedDetail?.category?.part ?? ""}
                    placeholder="Sélectionnez une categorie"
                    onChange={(value: number | string) => {
                      handleSelectedcategoryChange(value);
                    }}
                  />
                </div>
                <div>
                  <Label>{isElectronicColis ? "Qte" : "Poids en (lbs)"}</Label>
                  <Input
                    type="number"
                    min={isElectronicColis ? 1 : 0.01}
                    step={isElectronicColis ? 1 : 0.01}
                    value={poids ?? ""}
                    onChange={(e) =>
                      setPoids(e.target.value === "" ? null : Number(e.target.value))
                    }
                    placeholder={isElectronicColis ? "Entrez la quantité" : "Entrez le poids"}
                    disabled={disableFields}
                  />
                </div>
              </div>
               <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3 mb-2">
                <div>
                  <Label>Description<span className="text-red-500">*</span></Label>
                  <Select
                    options={categorieOptions}
                    defaultValue={selectedDetail?.category?.id ?? ""}
                    placeholder="Sélectionnez une description"
                    onChange={(value: number | string) => handleFixedPriceChange(value)}
                  />
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
                    disabled={disableFields}
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
                    disabled={disableFields}
                  />
                </div>
              </div>
           
            </div>

            <div className="mt-5 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 dark:border-white/[0.08] sm:flex-row sm:items-center sm:justify-end">
              <Button size="sm" variant="outline" onClick={closeSendModal}>
                Annuler
              </Button>
              <Button size="sm" disabled={isSaving}>
                {isSaving ? "Enregistrement en cours..." : "Enregistrer le colis"}
              </Button>
            </div>
          </form>
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
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
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
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
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
        className="max-w-[550px] m-4"
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
                  step={0.01}
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
                  step={0.01}
                    value={douane ?? ""}
                    onChange={(e) =>
                      setDouane(
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                    placeholder={`Entrez le ${labelDouane?.toLowerCase()}`}
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
      </>
  );
}
