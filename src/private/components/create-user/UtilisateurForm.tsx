"use client";
import * as React from "react";
import type { FormEvent } from "react";
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
import Avatar from "../ui/avatar/Avatar";
import AvatarText from "../ui/avatar/AvatarText";
import { EyeIcon, PencilIcon, SearchIcon, TrashBinIcon } from "../../icons";
import { useState, useEffect } from "react";
import { SkeletonCardGrid } from "../ui/skeleton/Skeleton";
import { listClients,rechercherClients,updateUtilisateur,deleteClient} from "@/services/RegisterService";
import { Check, Copy, KeyRound, Mail, PenBoxIcon, PlusSquareIcon, ShieldCheck, StopCircle, User2Icon, UserCog2Icon } from "lucide-react";
import { toast } from "react-toastify";
import Label from "../form/Label";
import { checkEmailExists,createUtilisateur } from "../../../services/RegisterService";
import { listRegions } from "../../../services/RegionService";
import { getVilleRegion } from "../../../services/VilleService";
import { deleteOrderDetails, myOrderDetailsDashboard } from "../../../services/OrderDetailsService";
import Select from "@/private/components/form/Select";
import { createRecovery } from "@/services/RecoveryService";


interface Region {
  id: number;
  description: string;
}
interface Ville {
  id: number;
  description: string;
  region: Region;
}

interface Utilisateur {
  id:number;
  name:string;
  email:string;
  address:string;
  ville: Ville;
  usercode:string;
  phone:string;
  role:string;
  status:string;
}

interface Category {
  id: number;
  description: string;
}

interface Order {
  id: number;
  date: string;
  shiporder: string;
}

interface Cipinfee {
  id: number;
  city: Ville;
}

interface OrderDetails {
  id: number;
  ship: Order;
  upc: string;
  category: Category | null;
  citypoundfee: Cipinfee;
  pounds: number;
  status: string;
  delivery: string;
  tracking: string;
}

interface PageResponse<T> {
  content: T[];
  totalPages: number;
}


const RoleBadge = (status:string) => {
  if(status==="Admin"){
    return(
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        {status}
      </span>
    )
  }if(status==="Agent"){
    return(
      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
        {status}
      </span>
    )
  }else{
    return(
      <span className="inline-flex items-center rounded-full bg-warning-100 px-2.5 py-0.5 text-xs font-medium text-warning-800">
        {status}
      </span>
    )
  }
}

const StatusBadge = (status:string) => {
if(status==="Inactif(ve)"){
    return(
      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
        {status}
      </span>
    )
} else {
  return(
      <span className="inline-flex items-center rounded-full  px-2.5 py-0.5 text-xs font-medium ">
        {status}
      </span>
    )
  }
}
function cleanVelogCode(value: string | null): string | null {
  if (!value) return value;

  return value.startsWith("VELOG XPRESS-")
    ? value.replace("VELOG XPRESS-", "")
    : value;
}

type Option = { label: string; value: string };

export default function UtilisateurForm() {
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const { isOpen: isCreateOpen, openModal: openCreateModal, closeModal: closeCreateModal } = useModal();
  const { isOpen: isColisOpen, openModal: openColisModal, closeModal: closeColisModal } = useModal();
  const { isOpen: isRecoveryOpen, openModal: openRecoveryModal, closeModal: closeRecoveryModal } = useModal();
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [recherche, setRecherche] = useState("");
  const [editingUtilisateur, setEditingUtilisateur] = useState<Utilisateur | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedColisUtilisateur, setSelectedColisUtilisateur] = useState<Utilisateur | null>(null);
  const [clientColis, setClientColis] = useState<OrderDetails[]>([]);
  const [isLoadingColis, setIsLoadingColis] = useState(false);
  const [recoveryUtilisateur, setRecoveryUtilisateur] = useState<Utilisateur | null>(null);
  const [isSendingRecovery, setIsSendingRecovery] = useState(false);
  const [isRecoveryMessageCopied, setIsRecoveryMessageCopied] = useState(false);

  const [isSavings, setIsSavings] = useState(false);
  const[code,setCode]=useState<string|null>(null);
  const[nom,setNom]=useState<string|null>(null);
  const[telephone,setTelephone]=useState<string|null>(null);
  const[email,setEmail]=useState<string|null>(null);
  const [adresse, setAdresse] = useState<string | null>(null);

    const [regions, setRegions] = useState<Region[]>([]);
    const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
    const [selectedRegionDescription,setSelectedRegionDescription]=useState<string>("");
  
    const[villes,setVilles]=useState<Ville[]>([]);
    const [selectedVilleId, setSelectedVilleId] = useState<number | null>(null);
    const[selectedVilleDescription,setSelectedVilleDescription]=useState<string>("");
  
    const[nome,setNome]=useState<string>("");
    const [emaile,setEmaile]=useState<string>("");
    const[addresse,setAddresse]=useState<string>("");
    const [phone,setPhone]=useState<string>("");
  
    const [errors,setErrors]=useState<{
      nome?:string;
      emaile?:string;
      addresse?:string;
      password?:string;
      phone?:string;
      selectedRegionId?:string;
      selectedVilleId?:string;
    }>({});
  const [isSaving,setIsSaving]=useState<boolean>(false);

  const recoveryMessage = recoveryUtilisateur
    ? `Bonjour ${recoveryUtilisateur.name},\n\nUne demande de récupération de mot de passe a été lancée pour votre compte Velog Xpress (${recoveryUtilisateur.email}).\n\nConsultez votre boîte email : vous y trouverez votre code PIN ainsi qu’un bouton qui vous conduira directement à la validation OTP pour choisir un nouveau mot de passe. Ne recommencez pas une nouvelle demande de récupération.\n\nPour votre sécurité, votre ancien mot de passe ne peut ni être affiché ni envoyé par email.\n\nSi vous n’êtes pas à l’origine de cette demande, ignorez ce message et contactez le support Velog Xpress.`
    : "";

  const handleOpenRecoveryModal = (utilisateur: Utilisateur) => {
    setRecoveryUtilisateur(utilisateur);
    setIsRecoveryMessageCopied(false);
    openRecoveryModal();
  };

  const handleCopyRecoveryMessage = async () => {
    if (!recoveryMessage) return;
    try {
      await navigator.clipboard.writeText(recoveryMessage);
      setIsRecoveryMessageCopied(true);
      toast.success("Message de récupération copié.");
    } catch (error) {
      console.error("Échec de la copie du message:", error);
      toast.error("Impossible de copier le message.");
    }
  };

  const handleSendRecoveryEmail = async () => {
    if (!recoveryUtilisateur?.email) {
      toast.error("Aucune adresse email disponible pour cet utilisateur.");
      return;
    }

    setIsSendingRecovery(true);
    try {
      await createRecovery({ email: recoveryUtilisateur.email });
      toast.success(`Code de récupération envoyé à ${recoveryUtilisateur.email}.`);
    } catch (error) {
      console.error("Échec de l'envoi de la récupération:", error);
      toast.error("Impossible d’envoyer l’email de récupération.");
    } finally {
      setIsSendingRecovery(false);
    }
  };



  const fetchUtilisateurs = async (pageNumber: number) => {
    try {
      const response = await listClients(pageNumber);
        setUtilisateurs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Échec du chargement des utilisateurs:", error);
    }
  };

 

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (recherche.trim() === "") {
          await fetchUtilisateurs(page);
          return;
        }

        const response = await rechercherClients(recherche, page);
        setUtilisateurs(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Échec de la recherche des utilisateurs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, recherche]);

  function handleOpenEditModal(selectedUtilisateur: Utilisateur) {
    setEditingId(selectedUtilisateur.id);
    setEditingUtilisateur(selectedUtilisateur);
    openModal();
  }

  

  async function handleUpdateAdmin(): Promise<void> {
    if (!editingId) return;
    try {
      // Update user role to Admin
      const payload = {
        id: editingId,
        name: editingUtilisateur?.name,
        email: editingUtilisateur?.email,
        address: editingUtilisateur?.address,
        ville: editingUtilisateur?.ville,
        usercode: editingUtilisateur?.usercode,
        phone: editingUtilisateur?.phone,
        role: "Admin",
        status: editingUtilisateur?.status,
      };
      // await updateUserRole(payload
      await updateUtilisateur(editingUtilisateur?.usercode,payload).then(() => {
        closeModal();
        fetchUtilisateurs(page);
        toast.success("Utilisateur mis à jour avec le rôle Admin:");
      });
    } catch (error) {
      console.error("Échec de la mise à jour du rôle admin:", error);
    } 
  }

  async function handleUpdateAgent(): Promise<void> {
    if (!editingId) return;
    try {
      // Update user role to Agent
      const newRole = editingUtilisateur?.role === "Agent" ? "Client" : "Agent";
      const payload = {
        id: editingId,
        name: editingUtilisateur?.name,
        email: editingUtilisateur?.email,
        address: editingUtilisateur?.address,
        ville: editingUtilisateur?.ville,
        usercode: editingUtilisateur?.usercode,
        phone: editingUtilisateur?.phone,
        role: newRole,
        status: editingUtilisateur?.status,
      };
      // await updateUserRole(payload
      await updateUtilisateur(editingUtilisateur?.usercode,payload).then(() => {
        closeModal();
        fetchUtilisateurs(page);
        toast.success(" Utilisateur mis à jour avec le rôle " + newRole);
      });
    } catch (error) {
      console.error("Échec de la mise à jour du rôle admin:", error);
    } 
  }

  async function handleUpdateClient(): Promise<void> {
    if (!editingId) return;
    try {
      // Update user status to Inactif(ve) or Actif(ve)
      const newStatus = editingUtilisateur?.status === "Actif(ve)" ? "Inactif(ve)" : "Actif(ve)";
      const payload = {
        id: editingId,
        name: editingUtilisateur?.name,
        email: editingUtilisateur?.email,
        address: editingUtilisateur?.address,
        ville: editingUtilisateur?.ville,
        usercode: editingUtilisateur?.usercode,
        phone: editingUtilisateur?.phone,
        role: editingUtilisateur?.role,
        status: newStatus,
      };
      // await updateUserRole(payload
      await updateUtilisateur(editingUtilisateur?.usercode,payload).then(() => {
        closeModal();
        fetchUtilisateurs(page);
        toast.success("Utilisateur est maintenant " + newStatus);
      });
    } catch (error) {
      console.error("Échec de la mise à jour du rôle admin:", error);
    } 
  }

  function handleOpenEditInfoModal(selectedUtilisateur: Utilisateur) {
    setEditingId(selectedUtilisateur.id);
    setEditingUtilisateur(selectedUtilisateur);
    // You can implement additional logic here if needed
    openEditModal();
  }

  async function fetchClientColis(usercode: string): Promise<void> {
    setIsLoadingColis(true);
    try {
      const response = await myOrderDetailsDashboard(usercode);
      const data = response.data as PageResponse<OrderDetails>;
      setClientColis(data.content ?? []);
    } catch (error) {
      console.error("Échec du chargement des colis de l'utilisateur:", error);
      setClientColis([]);
      toast.error("Impossible de charger les colis de cet utilisateur.");
    } finally {
      setIsLoadingColis(false);
    }
  }

  async function handleOpenClientColisModal(selectedUtilisateur: Utilisateur): Promise<void> {
    setSelectedColisUtilisateur(selectedUtilisateur);
    setClientColis([]);
    openColisModal();
    await fetchClientColis(selectedUtilisateur.usercode);
  }

  async function handleDeleteClientColis(detail: OrderDetails): Promise<void> {
    try {
      await deleteOrderDetails(detail.upc);
      setClientColis((current) => current.filter((item) => item.id !== detail.id));
      toast.success("Colis supprimé avec succès!");
    } catch (error) {
      console.error("Échec de la suppression du colis:", error);
      toast.error("Impossible de supprimer ce colis.");
    }
  }

  async function handleOpenDeleteModal(selectedUtilisateur: Utilisateur) {
    if (!selectedUtilisateur) return;
    try {
      await deleteClient(selectedUtilisateur.usercode).then(() => {
        fetchUtilisateurs(page);
        toast.success("Utilisateur supprimé avec succès!");
      });
    } catch (error) {
      console.error("Échec de la suppression de l'utilisateur:", error);
    } 
  }
  function handleSafeEdit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!editingId) return;
    setIsSaving(true);
    const ville = { 
      id: selectedVilleId ?? editingUtilisateur?.ville.id,
      description: selectedVilleDescription || editingUtilisateur?.ville.description,
      region: {
        id: selectedRegionId ?? editingUtilisateur?.ville.region.id,
        description: selectedRegionDescription || editingUtilisateur?.ville.region.description,
      },
    };
    const payload = {
      id: editingId,
      name: nom ?? editingUtilisateur?.name,
      email: email ?? editingUtilisateur?.email,
      address: adresse ?? editingUtilisateur?.address,
      ville: ville,
      usercode: code ?? editingUtilisateur?.usercode,
      phone: telephone ?? editingUtilisateur?.phone,
      role: editingUtilisateur?.role,
      status: editingUtilisateur?.status,
    };
    updateUtilisateur(editingUtilisateur?.usercode,payload)
      .then(() => {
        toast.success("Les informations de l'utilisateur ont été mises à jour avec succès!");
        fetchUtilisateurs(page);
      })
      .catch((error) => {
        console.error("Échec de la mise à jour des informations de l'utilisateur:", error);
        toast.error("Une erreur s'est produite lors de la mise à jour des informations de l'utilisateur.");
      })
      .finally(() => {
        setIsSaving(false);
      });
    closeEditModal();
  }

  
  
    const validateForm = (): boolean => {
      const newErrors: {
        nome?: string;
        emaile?: string;
        addresse?: string;
        phone?: string;
        selectedRegionId?: string;
        selectedVilleId?: string;
      } = {};
  
      if (!nome.trim()) {
        newErrors.nome = "Le nom est requis.";
      }
  
      if (!emaile.trim()) {
        newErrors.emaile = "L'email est requis.";
      }
  
      if (!addresse.trim()) {
        newErrors.addresse = "L'adresse est requise.";
      }
  
  
      if (!phone.trim()) {
        newErrors.phone = "Le téléphone est requis.";
      }
  
      setErrors(newErrors);
  
      return Object.keys(newErrors).length === 0;
    };
  
    
    useEffect(() => {
    fetchRegions();
  }, []);
  
  const fetchRegions = async () => {
    try {
      const response = await listRegions();
  
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.content ?? [];
  
      setRegions(data);
    } catch (e) {
      console.error(e);
      setRegions([]);
    }
  };
  
  
  
  const regionOptions: Option[] = regions.map(r => ({
    label: r.description,
    value: String(r.id),
  }));
  
  
  const villeOptions: Option[] = villes.map(v => ({
    label: v.description,
    value: String(v.id),
  }));
    
  
  const fetchVillesByRegion = async (regionId: number,page:number) => {
    try {
      
      const response = await getVilleRegion(regionId, page);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.content ?? [];
      setVilles([]);
      setVilles(data);
    } catch (e) {
      console.error(e);
      setVilles([]);
    }
  };
  
  React.useEffect(() => { 
    if (editingUtilisateur) {
      setSelectedRegionId(editingUtilisateur.ville.region.id);
      setSelectedRegionDescription(editingUtilisateur.ville.region.description);
      fetchVillesByRegion(editingUtilisateur.ville.region.id, 0);
      setSelectedVilleId(editingUtilisateur.ville.id);
      setSelectedVilleDescription(editingUtilisateur.ville.description);
    }
  }, [editingUtilisateur]);
  
  
const handleSaveCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 🔑 OBLIGATWA
  if (!validateForm()) {
      return;
    }
   if (!selectedRegionId) {
    setErrors(prev => ({ ...prev, selectedRegionId: "Veuillez sélectionner une région" }));
    return;
  }
  
  if (!selectedVilleId) {
    setErrors(prev => ({ ...prev, selectedVilleId: "Veuillez sélectionner une ville" }));
    return;
  }
  
    setIsSavings(true);
  
    try {
      const payload = {
        name: nome,
        address: addresse,
        phone,
        email: emaile,
        password:'',
        ville: {
          id: selectedVilleId,
          description:selectedVilleDescription,
          region: {
            id: selectedRegionId,
            description: selectedRegionDescription,
          },
        },
      };
      //console.log("Payload pour création:", payload);
      const emailExists = await checkEmailExists(emaile);
      if (emailExists.data === "Exists") {
        toast.error("Cet email est déjà utilisé. Veuillez en choisir un autre.");
        setIsSavings(false);
      } else {
        await createUtilisateur(payload);
      toast.success("Utilisateur créé avec succès!");
      // Réinitialiser le formulaire après une inscription réussie
      fetchUtilisateurs(page);
      setNome("");
      setAddresse("");
      setPhone("");
      setEmaile("");
      setSelectedRegionId(null);
      setSelectedRegionDescription("");
      setSelectedVilleId(null);
      setSelectedVilleDescription("");
      setVilles([]);
      }
     
  
    } catch (error) {
      console.error("Erreur inscription:", error);
      toast.error("Erreur lors de l'inscription");
    } finally {
      setIsSavings(false);
    }
  };



  return (
    <>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
        <div>
          <div className="flex items-center m-2 gap-3 justify-end">
            <Button
              size="sm"
              variant="primary"
              title="Créer un nouveau utilisateur"
              startIcon={<PlusSquareIcon className="size-5" />}
              onClick={openCreateModal}
            >
              Nouveau Utilisateur
            </Button>
          </div>
        </div>
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
      {isLoading ? (
        <SkeletonCardGrid count={6} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" />
      ) : (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {utilisateurs.map((utilisateur) => (
          <div
            key={utilisateur.id}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-theme-sm transition hover:shadow-theme-md dark:border-white/[0.05] dark:bg-white/[0.03]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <AvatarText name={utilisateur.name || "Utilisateur"} />
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-gray-800 dark:text-white/90">
                    {utilisateur.name}
                  </h3>
                  <p className="mt-1 truncate text-theme-xs text-gray-500 dark:text-gray-400">
                    Code: {cleanVelogCode(utilisateur.usercode)}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                {RoleBadge(utilisateur.role)}
                {StatusBadge(utilisateur.status)}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  Telephone
                </p>
                <p className="mt-1 break-words text-sm font-medium text-gray-700 dark:text-gray-300">
                  {utilisateur.phone || "N/A"}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  Email
                </p>
                <p className="mt-1 break-words text-sm font-medium text-gray-700 dark:text-gray-300">
                  {utilisateur.email || "N/A"}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03] sm:col-span-2">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  Adresse
                </p>
                <p className="mt-1 break-words text-sm font-medium text-gray-700 dark:text-gray-300">
                  {utilisateur.address || "N/A"}
                  {utilisateur.ville?.description ? `, ${utilisateur.ville.description}` : ""}
                  {utilisateur.ville?.region?.description ? `, ${utilisateur.ville.region.description}` : ""}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <Button
                size="sm"
                className="p-2"
                variant="outline"
                title="Aider cet utilisateur à récupérer son mot de passe"
                onClick={() => handleOpenRecoveryModal(utilisateur)}
              >
                <KeyRound className="size-5" />
              </Button>
              <Button
                size="sm"
                className="p-2"
                variant="outline"
                title="Changer le rôle ou le statut de cet utilisateur"
                onClick={() => handleOpenEditModal(utilisateur)}
              >
                <PencilIcon className="size-5" />
              </Button>
              <Button
                size="sm"
                className="p-2"
                variant="outline"
                title="Modifier les informations de cet utilisateur"
                onClick={() => handleOpenEditInfoModal(utilisateur)}
              >
                <PenBoxIcon className="size-5" />
              </Button>
              <Button
                size="sm"
                className="p-2"
                variant="outline"
                title="Voir et supprimer les colis de cet utilisateur"
                onClick={() => handleOpenClientColisModal(utilisateur)}
              >
                <EyeIcon className="size-5" />
              </Button>
              <Button
                size="sm"
                className="p-2"
                variant="outline"
                title="Supprimer cet utilisateur"
                onClick={() => handleOpenDeleteModal(utilisateur)}
              >
                <TrashBinIcon className="size-5" />
              </Button>
            </div>
          </div>
        ))}

        {utilisateurs.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-400 md:col-span-2 xl:col-span-3">
            Aucun utilisateur trouve.
          </div>
        )}
      </div>
      )}

      <Modal isOpen={isRecoveryOpen} onClose={closeRecoveryModal} className="max-w-[680px] m-4">
        <div className="no-scrollbar relative max-h-[90vh] w-full max-w-[680px] overflow-y-auto rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-gray-900">
          <div className="border-b border-gray-100 bg-gradient-to-r from-brand-50 via-white to-blue-50 px-5 py-6 pr-14 dark:border-white/[0.08] dark:from-brand-950/40 dark:via-gray-900 dark:to-blue-950/30 sm:px-7">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/20">
                <KeyRound className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-300">Assistance sécurisée</p>
                <h4 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">Récupération du mot de passe</h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{recoveryUtilisateur?.name ?? "Utilisateur"} · {recoveryUtilisateur?.email ?? "Email indisponible"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-7">
            <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
              <ShieldCheck className="mt-0.5 size-5 shrink-0" />
              <p className="text-sm leading-6">Le mot de passe actuel est chiffré et ne peut pas être récupéré. Envoyez plutôt un code sécurisé afin que le client choisisse un nouveau mot de passe.</p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <Label>Message à transmettre au client</Label>
                <button type="button" onClick={handleCopyRecoveryMessage} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-brand-600 transition hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-500/10">
                  {isRecoveryMessageCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {isRecoveryMessageCopied ? "Copié" : "Copier"}
                </button>
              </div>
              <div className="whitespace-pre-wrap rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-300">{recoveryMessage}</div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 dark:border-white/[0.08] sm:flex-row sm:justify-end">
              <Button size="sm" variant="outline" onClick={closeRecoveryModal}>Fermer</Button>
              <Button size="sm" startIcon={<Mail className="size-4" />} onClick={handleSendRecoveryEmail} disabled={isSendingRecovery || !recoveryUtilisateur?.email}>
                {isSendingRecovery ? "Envoi en cours..." : "Envoyer le code par email"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isColisOpen} onClose={closeColisModal} className="max-w-[1100px] m-4">
        <div className="relative flex max-h-[85vh] w-full max-w-[1100px] flex-col overflow-hidden rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Colis de {selectedColisUtilisateur?.name ?? "cet utilisateur"}
            </h4>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Supprimez les colis lies a cet ancien compte avant de supprimer le compte utilisateur.
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[900px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        UPC
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Tracking
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Commande
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Ville
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Poids
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Statut
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {clientColis.map((detail) => (
                      <TableRow key={detail.id}>
                        <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-700 dark:text-gray-300">
                          {detail.upc || "N/A"}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-700 dark:text-gray-300">
                          {detail.tracking || "N/A"}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-700 dark:text-gray-300">
                          {detail.ship?.shiporder || "N/A"}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-700 dark:text-gray-300">
                          {detail.citypoundfee?.city?.description || "N/A"}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-700 dark:text-gray-300">
                          {detail.pounds ?? 0} lbs
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-700 dark:text-gray-300">
                          {detail.status || "N/A"}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          <Button
                            size="sm"
                            className="p-2"
                            variant="outline"
                            title="Supprimer ce colis"
                            onClick={() => handleDeleteClientColis(detail)}
                          >
                            <TrashBinIcon className="size-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {isLoadingColis && (
            <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500 dark:border-white/[0.08] dark:text-gray-400">
              Chargement des colis...
            </div>
          )}

          {!isLoadingColis && clientColis.length === 0 && (
            <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500 dark:border-white/[0.08] dark:text-gray-400">
              Aucun colis trouve pour cet utilisateur.
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button size="sm" variant="outline" title="Fermer la liste des colis" onClick={closeColisModal}>
              Fermer
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isOpen} onClose={closeModal}
        className="max-w-[450px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[450px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Avatar src="/images/user/Access.png" size="xxlarge" />
          </div>
          <div className="px-2  text-center">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 flex items-center justify-center">
              Authorisation et Suppression
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Choisir l&apos;action desirez-vous pour cet utilisateur!
            </p>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 justify-center">
            <Button size="sm" variant="outline" title="Attribuer le rôle Admin" onClick={handleUpdateAdmin}
              startIcon={<UserCog2Icon className="w-4 h-4 mr-2 text-green-800 dark:text-green-800" />}
            >
              Admin
            </Button>
            <Button size="sm" variant="outline" title="Basculer entre Agent et Client" onClick={handleUpdateAgent}
              startIcon={<User2Icon className="w-4 h-4 mr-2 text-blue-800 dark:text-blue-800" />}
            >
              {editingUtilisateur?.role==="Agent" ? "Client" : "Agent"}
            </Button>
            <Button size="sm" variant="outline" title="Bloquer ou débloquer cet utilisateur" onClick={handleUpdateClient}
              startIcon={<StopCircle className="w-4 h-4 mr-2 text-warning-800 dark:text-warning-800" />}
            >
              {editingUtilisateur?.status==="Actif(ve)" ? "Bloquer" : "Debloquer"}
            </Button>
          </div>
          
        </div>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={closeEditModal} className="max-w-[1020px] m-4">
        <div className="no-scrollbar relative w-full max-w-[1020px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Editer les information de cet utilisateur ({editingUtilisateur?.name} - {editingUtilisateur?.usercode})
            </h4>
          </div>

          <form
            className="flex flex-col"
            onSubmit={handleSafeEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            encType="multipart/form-data"
          >
            <div className="custom-scrollbar h-[300px] overflow-y-auto px-2 pb-3">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
                <div>
                  <Label>Code</Label>
                  <Input
                    type="text"
                    value={editingUtilisateur?.usercode ?? ""}
                    onChange={(e) =>
                      setCode(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                    placeholder="Entrez le code utilisateur"
                  />
                </div>
               
                <div>
                  <Label>Nom Complet</Label>
                  <Input
                    type="text"
                    value={nom ?? editingUtilisateur?.name ?? ""}
                    onChange={(e) =>
                      setNom(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                    placeholder="Entrez le téléphone"
                  />
                </div>
                <div>
                  <Label> Email</Label>
                  <Input
                    type="text"
                    value={email ?? editingUtilisateur?.email ?? ""}
                    onChange={(e) =>
                      setEmail(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                    placeholder="Entrez l'email"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
                <div>
                  <Label>Telephone</Label>
                  <Input
                    type="text"
                    value={telephone ?? editingUtilisateur?.phone ?? ""}
                    onChange={(e) =>
                      setTelephone(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                    placeholder="Entrez le téléphone"
                   
                    />
                </div>
                
                <div>
                  <Label> Adresse</Label>
                  <Input
                    type="text"
                    value={adresse ?? editingUtilisateur?.address ?? ""}
                    onChange={(e) =>
                      setAdresse(e.target.value === "" ? null : e.target.value)
                    }
                    placeholder="Entrez l'adresse"
                    // required
                  />
                </div>
                  <div className="sm:col-span-1">
                    <Label>
                      Region
                    </Label>
                    <Select
                        options={regionOptions}
                    placeholder="Sélectionnez une région"
                    defaultValue={editingUtilisateur ? String(editingUtilisateur.ville.region.id) : undefined}
                        onChange={(value: string) => {
                          const id = Number(value);

                          setSelectedRegionId(id);

                          // 👇 Prendre description depuis options (IMMÉDIAT)
                          const regionDesc =
                            regionOptions.find(r => r.value === value)?.label || "";
                            setSelectedRegionDescription(regionDesc);
                          
                          setSelectedVilleId(null);
                          setVilles([]);

                          if (id) {
                            fetchVillesByRegion(id, 0);
                          }
                        }}
                      />

                    {errors.selectedRegionId && (<div className="text-error-500 text-sm mt-1">{errors.selectedRegionId}</div>)}
                  </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
                <div className="sm:col-span-1">
                    <Label>
                      Ville
                    </Label>
                     <Select
                    options={villeOptions}
                    defaultValue={editingUtilisateur ? String(editingUtilisateur.ville.id) : undefined}
                        placeholder="Sélectionnez une ville"
                        onChange={(value: string) => {
                          const id = Number(value);
                          setSelectedVilleId(id);

                          const villeDesc =
                            villeOptions.find(v => v.value === value)?.label || "";

                          setSelectedVilleDescription(villeDesc);
                        }}
                      />

                      {errors.selectedVilleId && (<div className="text-error-500 text-sm mt-1">{errors.selectedVilleId}</div>)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" title="Annuler la modification" onClick={closeEditModal}>
                Annuler
              </Button>
              <Button size="sm" title="Enregistrer la modification" disabled={isSaving}>
                {isSaving ? "Modification en cours..." : "Modifier"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal isOpen={isCreateOpen} onClose={closeCreateModal} className="max-w-[900px] m-4">
        <div className="no-scrollbar relative w-full max-w-[900px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Créer un utilisateur
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Enregistrer un nouveau utilisateur pour l&apos;utiliser dans vos
              opérations.
            </p>
          </div>

          <form className="flex flex-col" onSubmit={handleSaveCreate} onKeyDown={(e) => {if (e.key === "Enter") {e.preventDefault();}}}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Nom Complet<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Entrez votre nom complet"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                  {errors.nome && (<div className="text-error-500 text-sm mt-1">{errors.nome}</div>)}
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Adresse<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Entrez votre adresse"
                    value={addresse}
                    onChange={(e) => setAddresse(e.target.value)}
                  />
                  {errors.addresse && (<div className="text-error-500 text-sm mt-1">{errors.addresse}</div>)}
                </div>
                </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mt-5 mb-5">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Region<span className="text-error-500">*</span>
                    </Label>
                    <Select
                        options={regionOptions}
                        placeholder="Sélectionnez une région"
                        onChange={(value: string) => {
                          const id = Number(value);

                          setSelectedRegionId(id);

                          // 👇 Prendre description depuis options (IMMÉDIAT)
                          const regionDesc =
                            regionOptions.find(r => r.value === value)?.label || "";
                            setSelectedRegionDescription(regionDesc);
                          
                          setSelectedVilleId(null);
                          setVilles([]);

                          if (id) {
                            fetchVillesByRegion(id, 0);
                          }
                        }}
                      />

                    {errors.selectedRegionId && (<div className="text-error-500 text-sm mt-1">{errors.selectedRegionId}</div>)}
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Ville<span className="text-error-500">*</span>
                    </Label>
                     <Select
                        options={villeOptions}
                        placeholder="Sélectionnez une ville"
                        onChange={(value: string) => {
                          const id = Number(value);
                          setSelectedVilleId(id);

                          const villeDesc =
                            villeOptions.find(v => v.value === value)?.label || "";

                          setSelectedVilleDescription(villeDesc);
                        }}
                      />

                      {errors.selectedVilleId && (<div className="text-error-500 text-sm mt-1">{errors.selectedVilleId}</div>)}
                </div>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mt-5">
                  {/* <!-- phone --> */}
                <div>
                  <Label>
                    Telephone<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Entrez votre téléphone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    {errors.phone && (<div className="text-error-500 text-sm mt-1">{errors.phone}</div>)}
                  </div>
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Entrez votre email"
                    value={emaile}
                    onChange={(e) => setEmaile(e.target.value)}
                  />
                  {errors.emaile && (<div className="text-error-500 text-sm mt-1">{errors.emaile}</div>)}
                </div>
                </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1 mt-5 mb-5">
                {/* <!-- Email --> */}
                <div>
                  
              </div>
              </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" title="Annuler la création" onClick={closeCreateModal}>
                Annuler
              </Button>
              <Button size="sm" title="Enregistrer le nouveau utilisateur" disabled={isSavings}>
                {isSavings ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
