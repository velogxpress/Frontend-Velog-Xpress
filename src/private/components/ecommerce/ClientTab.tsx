"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "../ui/table";
import { useState,useEffect } from "react";
import { SkeletonCardGrid } from "../ui/skeleton/Skeleton";
import Button from "../ui/button/Button";
import { DownloadIcon, Eye, Mail, MapPin, PackageSearch, Phone, Truck} from "lucide-react";
import Input from "../form/input/InputField";
import { SearchIcon } from "../../icons";
import { Modal } from "../ui/modal";
import { useModal } from "../../hooks/useModal";
import Lien from "@/route/BASE_URL";


import { getAllOrderDetails, searchAllOrderDetails,downloadColisClient } from "../../../services/OrderDetailsService";


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


function sortOrderDetailsDesc(details: OrderDetails[]): OrderDetails[] {
  return [...details].sort((a, b) => (Number(b?.id) || 0) - (Number(a?.id) || 0));
}



export default function ClientTab() {
  const { isOpen, openModal, closeModal } = useModal();

  const [orderdetails, setOrderdetails] = useState<OrderDetails[]>([]);
  const [selectedDetail, setSelectedDetail] = useState<OrderDetails | null>(null);

  const [recherche, setRecherche] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

const handleKeyUp = async () => {
  setPage(0);
};
  
useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const value = recherche.trim();

      // 🔍 SI GEN SEARCH
      if (value !== "") {
        const response = await searchAllOrderDetails(value, page);
        setOrderdetails(sortOrderDetailsDesc(response.data.content ?? []));
        setTotalPages(response.data.totalPages);
      } 
      // 📄 SINON NORMAL
      else {
        const response = await getAllOrderDetails(page);
        setOrderdetails(sortOrderDetailsDesc(response.data.content ?? []));
        setTotalPages(response.data.totalPages);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, [page, recherche]); // 🔥 trè enpòtan
  

  async function handleDownloadInvoice(): Promise<void> {
    try {
            const response = await downloadColisClient(recherche);
            // Créer un lien de téléchargement temporaire
            const url = globalThis.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            // 👉 Nom du fichier (adapter selon ton backend)
            link.setAttribute("download", `colisclient_${recherche || "unknown"}.pdf`);
            document.body.appendChild(link);
            link.click();
            // Nettoyage
            link.remove();
            globalThis.URL.revokeObjectURL(url);
          } catch (error) {
            console.error("Erreur lors du téléchargement :", error);
          }
  }

  function handleOpenModal(detail: OrderDetails): void {
    setSelectedDetail(detail);
    openModal();
  }

  

  return (
    <>
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-col gap-5 border-b border-gray-100 bg-gray-50/70 px-5 py-5 dark:border-gray-800 dark:bg-white/[0.02] lg:flex-row lg:items-center lg:justify-between sm:px-6">
  
  {/* LEFT SIDE */}
  <div className="flex items-start gap-3">
    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"><PackageSearch className="h-5 w-5" /></span>
    <div><h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Répertoire des colis</h3>
    <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Consultez les colis traités ou en cours de traitement.</p></div>
  </div>

  {/* RIGHT SIDE */}
  <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:max-w-2xl lg:justify-end">

    {/* INPUT */}
    <div className="relative w-full sm:min-w-[330px]">
      <Input
        placeholder="Rechercher par tracking ou UPC..."
        type="text"
        className="pl-15 w-full"
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        onKeyUp={handleKeyUp}
      />
      <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <SearchIcon className="w-6 h-6 text-gray-500" />
      </span>
    </div>

    {/* BUTTON */}
     <Button
      size="sm"
      className="h-11 w-full shrink-0 whitespace-nowrap sm:w-[190px]"
              variant="outline"
              onClick={handleDownloadInvoice}
    >
      <DownloadIcon className="size-5" />
      <span>
        Télécharger le rapport
      </span>
    </Button> 

  </div>
</div>

      <div className="px-4 pb-5 sm:px-6">
        <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">{orderdetails.length} colis affiché{orderdetails.length > 1 ? "s" : ""}</span>
            <div className="flex items-center gap-3">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.04]"
            >
              Précédent
            </button>

            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {page + 1} / {Math.max(totalPages, 1)}
            </span>

            <button
              disabled={page + 1 === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.04]"
            >
              Suivant
            </button>
            </div>
        </div>
        {isLoading ? (
          <SkeletonCardGrid count={6} className="grid grid-cols-1 gap-4 xl:grid-cols-2" />
        ) : orderdetails.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 px-5 py-16 text-center dark:border-gray-700">
            <PackageSearch className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" />
            <p className="mt-3 font-medium text-gray-700 dark:text-gray-300">Aucun colis trouvé</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Essayez un autre numéro de tracking ou code UPC.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {orderdetails.map((detail) => (
              <article key={detail.id} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-800">
                <div className="flex flex-col gap-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-5 py-4 dark:border-gray-800 dark:from-white/[0.04] dark:to-transparent sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0"><p className="text-xs font-medium uppercase tracking-wider text-gray-400">Tracking</p><p className="mt-1 truncate font-semibold text-gray-900 dark:text-white" title={detail.tracking || "N/A"}>{detail.tracking || "N/A"}</p></div>
                  <div className="flex shrink-0 items-center gap-2">{StatusBadge(detail.status)}<button type="button" onClick={() => handleOpenModal(detail)} aria-label="Voir les détails du colis" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-brand-300 hover:text-brand-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"><Eye className="h-4 w-4" /></button></div>
                </div>
                <div className="space-y-5 p-5">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {[{label:"UPC colis",value:detail.upc},{label:"Commande",value:detail.ship?.shiporder},{label:"Catégorie",value:detail.category?.description}].map((item) => <div key={item.label} className="rounded-xl bg-gray-50 p-3 dark:bg-white/[0.04]"><p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">{item.label}</p><p className="mt-1 break-words text-sm font-semibold text-gray-700 dark:text-gray-200">{item.value || "N/A"}</p></div>)}
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {[{title:"Expéditeur",name:detail.exp_name,phone:detail.exp_phone,email:detail.exp_email},{title:"Destinataire",name:detail.rec_name,phone:detail.rec_phone,email:detail.rec_email}].map((person) => <div key={person.title} className="rounded-xl border border-gray-100 p-4 dark:border-gray-800"><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">{person.title}</p><p className="font-medium text-gray-800 dark:text-gray-200">{person.name || "N/A"}</p><p className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"><Phone className="h-3.5 w-3.5 shrink-0" />{person.phone || "N/A"}</p><p className="mt-1.5 flex min-w-0 items-center gap-2 text-sm text-gray-500 dark:text-gray-400"><Mail className="h-3.5 w-3.5 shrink-0" /><span className="truncate" title={person.email || "N/A"}>{person.email || "N/A"}</span></p></div>)}
                  </div>
                  <div className="flex flex-col gap-3 rounded-xl bg-brand-50/60 p-4 dark:bg-brand-500/[0.08] sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400"><Truck className="h-3.5 w-3.5" /> Livraison</p><p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">{detail.delivery || "Non renseignée"}</p></div>
                    <div className="min-w-0 sm:max-w-[55%]"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400"><MapPin className="h-3.5 w-3.5" /> Note</p><p className="mt-1 break-words text-sm text-gray-600 dark:text-gray-400">{detail.note || "Aucune note"}</p></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      </div>

       <Modal
        isOpen={isOpen} onClose={closeModal}
        className="max-w-[650px] m-4"
      >
        <div className="no-scrollbar relative max-h-[90vh] w-full max-w-[650px] overflow-y-auto rounded-3xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-white/[0.08] dark:bg-gray-900 sm:p-7">
          <div className="mb-5 pr-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">Aperçu du colis</p>
            <h4 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{selectedDetail?.upc ?? "Détails du colis"}</h4>
          </div>
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
                    Poids
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                    :
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    {selectedDetail?.pounds} lbs
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
      </>
  );
}
