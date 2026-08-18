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
import Label from "../form/Label";
import Select from "../form/Select";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Avatar from "../ui/avatar/Avatar";
import { PencilIcon, TrashBinIcon,PlusIcon,SearchIcon } from "../../icons";
import { useState, useEffect } from "react";
import { SkeletonTableRows } from "../ui/skeleton/Skeleton";
import { createSurcursal,getlistSurcursals,getSurcursal,updateSurcursal,deleteSurcursal} from "../../../services/SurcursalService";
import { getlistVilles } from "../../../services/VilleService";



interface Region{
  id: number;
  description: string;
}

interface Ville {
  id: number;
  description: string;
  abreger: string;
  region: Region;
}

interface Surcursal {
  id: number;
  name: string;
  address: string;
  ville: Ville;
  phone: string;
  horaire: string;
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
type Option = { label: string; value: number };
export default function Surcursale() {
  const { isOpen, openModal, closeModal } = useModal();
  const {isOpen: isEditOpen, openModal: openEditModal,closeModal: closeEditModal} = useModal();
  const {isOpen: isDeleteOpen, openModal: openDeleteModal,closeModal: closeDeleteModal} = useModal();
  const [surcursales, setSurcursales] = useState<Surcursal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [recherche, setRecherche] = useState("");
  const [editingSurcursal, setEditingSurcursal] = useState<Surcursal | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [villes, setVilles] = useState<Ville[]>([]);
  const [selectedVille, setSelectedVille] = useState<Option | null>(null);
  const [selectedVilleId, setSelectedVilleId] = useState<number | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [horaire, setHoraire] = useState<string | null>(null);

  const [errors, setErrors] = useState < {
    name?: string;
    address?: string;
    selectedVilleId?: string;
    phone?: string;
    horaire?: string;
  }>({});

  const fetchSurcursales = async (pageNumber: number) => {
    setIsLoading(true);
    try {
      const response = await getlistSurcursals(pageNumber);
        setSurcursales(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Échec du chargement des catégories:", error);
    } finally {
      setIsLoading(false);
    }
  };

 
  useEffect(() => {
    if (recherche.trim() === "") {
      fetchSurcursales(page);
    }
  }, [page, recherche]);


  const handleKeyUp = async () => {
    if (recherche.trim() === "") {
      fetchSurcursales(page);
    } else {
      // Filter villes based on search term
      try {
        const response = await getSurcursal(recherche, page);
        setSurcursales(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Échec de la recherche des catégories:", error);
      }
    }
  };

  function handleOpenEditModal(selectedSurcursal: Surcursal) {
    setEditingId(selectedSurcursal.id);
    setEditingSurcursal(selectedSurcursal);
    setSelectedVilleId(selectedSurcursal.ville.id);
    setSelectedVille(
      selectedSurcursal.ville
        ? {
            label:
              selectedSurcursal.ville.abreger +
              " - " +
              selectedSurcursal.ville.description,
            value: selectedSurcursal.ville.id,
          }
        : null
    );
    setName(selectedSurcursal.name);
    setAddress(selectedSurcursal.address);
    setPhone(selectedSurcursal.phone);
    setHoraire(selectedSurcursal.horaire);
    openEditModal();
  }

   function handleOpenDeleteModal(selectedSurcursal: Surcursal) {
     setEditingId(selectedSurcursal.id);
     setEditingSurcursal(selectedSurcursal);
     openDeleteModal();
   }

    useEffect(() => {
      fetchVilles();
    }, []);
    
   
    const fetchVilles = async () => {
      try {
        const response = await getlistVilles(0);
    
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.content ?? [];
    
        setVilles(data);
      } catch (e) {
        console.error(e);
        setVilles([]);
      }
    };

     const villeOptions: Option[] = villes.map((v) => ({
       label: v.abreger + " - " + v.description,
       value: v.id,
     }));

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      address?: string;
      selectedVilleId?: string;
      phone?: string;
      horaire?: string;
    } = {};

    if (!name || name.trim() === "") {
      newErrors.name = "Le nom est requis.";
    }
    if (!address || address.trim() === "") {
      newErrors.address = "L'adresse est requise.";
    }
    if (!selectedVilleId) {
      newErrors.selectedVilleId = "La ville est requise.";
    }
    if (!phone || phone.trim() === "") {
      newErrors.phone = "Le téléphone est requis.";
    }
    if (!horaire || horaire.trim() === "") {
      newErrors.horaire = "L'horaire est requis.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }


  async function handleSave(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        name: name! as string,
        address: address! as string,
        ville: {id: selectedVilleId! as number,description:"",abreger:"",region:{id:0,description:""}},
        phone: phone! as string,
        horaire: horaire! as string,
      };
   
      await createSurcursal(payload);
      cleanForm();
      fetchSurcursales(page);
      closeModal();
    } catch (error) {
      console.error("Échec de l'enregistrement des modifications:", error);
    }finally {
      setIsSaving(false);
    }
  }
  
  function cleanForm(): void {
    setName(null);
    setAddress(null);
    setSelectedVilleId(null);
    setPhone(null);
    setHoraire(null);
    setRecherche("");
    setSelectedVille(null);
    setErrors({});
  }

  function handleSafeDelete(): void {
    if (editingId == null) return;

    // Optionally you could add a loading state here if desired.
    deleteSurcursal(editingSurcursal!.name)
      .then(() => {
        setSurcursales((prev) => prev.filter((v) => v.id !== editingId));
        // If the current page becomes empty after deletion, refetch previous page if possible.
        setTimeout(() => {
          setEditingId(null);
          setEditingSurcursal(null);
          closeDeleteModal();
          setSurcursales((current) => {
            if (current.length === 0 && page > 0) {
              const newPage = page - 1;
              setPage(newPage);
              fetchSurcursales(newPage);
            } else {
              fetchSurcursales(page);
            }
            return current;
          });
        }, 0);
      })
      .catch((err) => {
        console.error("Échec de la suppression du surcursal:", err);
      });
  }



  useEffect(() => {
    if (!isOpen) {
      cleanForm();
    }
  }, [isOpen]);


  

   async function handleEditSave(e: React.FormEvent) {
     e.preventDefault();
     if (!editingSurcursal) return;

        
     try {
      const payload = {
        id: editingSurcursal.id,
        name: name! as string,
        address: address! as string,
        ville: {
          id: selectedVilleId! as number,
          description: "",
          abreger: "",
          region: { id: 0, description: "" },
        },
        phone: phone! as string,
        horaire: horaire! as string,
      };
       await updateSurcursal(editingSurcursal!.name, payload);
       cleanForm();
       closeEditModal();
       fetchSurcursales(page);
     } catch (e) {
       console.error(e);
     }
   }


  function handleSelectChange(value: number): void {
    setSelectedVilleId(value);
  }

  

  return (
    <>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
        <div>
          <div className="flex items-center m-2 gap-3 justify-end">
            <Button
              size="sm"
              variant="primary"
              startIcon={<PlusIcon className="size-5" />}
              onClick={openModal}
            >
              Nouvelle surcursale
            </Button>
          </div>
        </div>
        <div>
          <div className="relative m-2">
            <Input
              placeholder="Recherche par surcursale..."
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
                    Surcursales
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Adresse
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
                    Horaire
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
                {isLoading ? (
                  <SkeletonTableRows rows={5} columns={5} />
                ) : surcursales.map((surcursale) => (
                  <TableRow key={surcursale.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {surcursale.name}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {surcursale.address}, {surcursale.ville.description},{" "}
                      {surcursale.ville.region.description}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {surcursale.phone}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {surcursale.horaire}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          className="p-2"
                          variant="outline"
                          onClick={() => handleOpenEditModal(surcursale)}
                        >
                          <PencilIcon className="size-5" />
                        </Button>
                        <Button
                          size="sm"
                          className="p-2"
                          variant="outline"
                          onClick={() => handleOpenDeleteModal(surcursale)}
                        >
                          <TrashBinIcon className="size-5" />
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

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Créer catégorie
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Enregistrer une nouvelle catégorie pour l&apos;utiliser dans vos
              opérations.
            </p>
          </div>

          <form
            className="flex flex-col"
            onSubmit={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
          >
            <div className="custom-scrollbar h-[350px] overflow-y-auto px-2 pb-3">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                <div>
                  <Label>Adresse</Label>
                  <Input
                    type="text"
                    value={address ?? ""}
                    onChange={(e) =>
                      setAddress(e.target.value === "" ? null : e.target.value)
                    }
                    placeholder="Entrez une adresse"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Surcursale</Label>
                  <Input
                    type="text"
                    value={name ?? ""}
                    onChange={(e) =>
                      setName(e.target.value === "" ? null : e.target.value)
                    }
                    placeholder="Entrez une surcursale"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <Label>Ville</Label>
                  <div className="relative">
                    <Select
                      options={villeOptions}
                      value={selectedVilleId ?? undefined}
                      placeholder="Selectionnez un symbole"
                      onChange={handleSelectChange}
                      className="dark:bg-dark-900"
                    />
                    {errors.selectedVilleId && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.selectedVilleId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Telephone</Label>
                  <Input
                    type="text"
                    value={phone ?? ""}
                    onChange={(e) =>
                      setPhone(e.target.value === "" ? null : e.target.value)
                    }
                    placeholder="Entrez un téléphone"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <Label>Horaire</Label>
                  <Input
                    type="text"
                    value={horaire ?? ""}
                    onChange={(e) =>
                      setHoraire(e.target.value === "" ? null : e.target.value)
                    }
                    placeholder="Entrez un horaire"
                  />
                  {errors.horaire && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.horaire}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Annuler
              </Button>
              <Button size="sm" disabled={isSaving}>
                {isSaving ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        className="max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Editer surcursale
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Mettez à jour vos informations pour garder votre profil à jour.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[350px] overflow-y-auto px-2 pb-3">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                <div>
                  <Label>Adresse</Label>
                  <Input
                    type="text"
                    value={address ?? ""}
                    onChange={(e) =>
                      setAddress(e.target.value === "" ? null : e.target.value)
                    }
                    placeholder="Entrez une adresse"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Surcursale</Label>
                  <Input
                    type="text"
                    value={name ?? ""}
                    onChange={(e) =>
                      setName(e.target.value === "" ? null : e.target.value)
                    }
                    placeholder="Entrez une surcursale"
                  />
                </div>
                <div>
                  <Label>Ville</Label>
                  <div className="relative">
                    <Select
                      options={villeOptions}
                      defaultValue={selectedVille?.value}
                      placeholder="Selectionnez un symbole"
                      onChange={(e) => {
                        setSelectedVilleId(e === undefined || e === null ? null : Number(e));
                      }}
                      className="dark:bg-dark-900"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Telephone</Label>
                  <Input
                    type="text"
                    value={phone ?? ""}
                    onChange={(e) =>
                      setPhone(e.target.value === "" ? null : e.target.value)
                    }
                    placeholder="Entrez un téléphone"
                  />
                </div>
                <div>
                  <Label>Horaire</Label>
                  <Input
                    type="text"
                    value={horaire ?? ""}
                    onChange={(e) =>
                      setHoraire(e.target.value === "" ? null : e.target.value)
                    }
                    placeholder="Entrez un horaire"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" variant="primary" onClick={handleEditSave}>
                Enregistrer les modifications
              </Button>
            </div>
          </form>
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
              Êtes-vous sûr de vouloir supprimer cette surcursale ?
            </p>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-center">
            <Button size="sm" variant="primary" onClick={handleSafeDelete}>
              Okay, Confirmer
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
