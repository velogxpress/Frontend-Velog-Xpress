"use client";
import React from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import Label from "../form/Label";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Avatar from "../../components/ui/avatar/Avatar";
import AvatarText from "../../components/ui/avatar/AvatarText";
import { PencilIcon, TrashBinIcon,SearchIcon } from "../../icons";
import { useState, useEffect } from "react";
import { SkeletonCardGrid } from "../ui/skeleton/Skeleton";
import { createVille,listVilles, getlistVilles, updateVille, deleteVille } from "../../../services/VilleService";
import { listRegions, getRegionByID } from "../../../services/RegionService";


interface Ville {
  id: number;
  description: string;
  abreger: string;
  region?: Region;
}

interface Region {
  id: number;
  description: string;
}

 type Option = { label: string; value: string };
const PAGE_SIZE = 9;

export default function VilleForm() {
  const { isOpen, openModal, closeModal } = useModal();
  const {isOpen: isEditOpen, openModal: openEditModal,closeModal: closeEditModal} = useModal();
  const {isOpen: isDeleteOpen, openModal: openDeleteModal,closeModal: closeDeleteModal} = useModal();
  const [villes, setVilles] = useState<Ville[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [recherche, setRecherche] = useState("");
    const [editingVille, setEditingVille] = useState<Ville | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [description, setDescription] = useState<string | null>(null);
  const [abreger, setAbreger] = useState<string | null>(null);
  const [regionList, setRegionList] = useState<Region[]>([]);
  const [region, setRegion] = useState<Region | null>(null);


  const [errors, setErrors] = useState < {
    description?: string;
    abreger?: string;
    region?: string;
  }>({});

  const fetchVilles = async (pageNumber: number) => {
    setIsLoading(true);
    try {
      const response = await listVilles(pageNumber);
      setVilles(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Échec du chargement des villes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRegions=async () => {
    try {
      const response = await listRegions();   
      setRegionList(response.data.content);
    } catch (error) {
      console.error("Échec du chargement des régions:", error);
    }
  };

  const searchVilles = async (searchTerm: string, pageNumber: number) => {
      try {
        const response = await getlistVilles(0);
        const data = response.data.content ?? [];
        const filteredVilles = data.filter((ville: Ville) => {
          const description = ville.description?.toLowerCase() ?? "";
          const abreger = ville.abreger?.toLowerCase() ?? "";

          return (
            description.includes(searchTerm) || abreger.includes(searchTerm)
          );
        });
        const nextTotalPages = Math.ceil(filteredVilles.length / PAGE_SIZE);
        const start = pageNumber * PAGE_SIZE;
        const end = start + PAGE_SIZE;

        setVilles(filteredVilles.slice(start, end));
        setTotalPages(nextTotalPages);
      } catch (error) {
        console.error("Échec de la recherche des villes:", error);
      }
  };

  useEffect(() => {
    const searchTerm = recherche.trim().toLowerCase();

    if (searchTerm === "") {
      fetchVilles(page);
    } else {
      searchVilles(searchTerm, page);
    }
  }, [page, recherche]);

  useEffect(() => {
    fetchRegions();
  }, []);

  const symboleOptions: Option[] = regionList.map((reg) => ({
    label: reg.description,
    value: reg.id.toString(),
  }));

  function handleOpenEditModal(selectedVille: Ville) {
    setEditingId(selectedVille.id);
    setEditingVille(selectedVille);
    openEditModal();
  }

   function handleOpenDeleteModal(selectedVille: Ville) {
     setEditingId(selectedVille.id);
     setEditingVille(selectedVille);
     openDeleteModal();
   }

  const validateForm = (): boolean => {
    const newErrors: {
      description?: string;
      abreger?: string;
      region?: string;
    } = {}; 
    if (!description || description.trim() === "") {
      newErrors.description = "La description est requise.";
    }
    if (!abreger || abreger.trim() === "" ) {
      newErrors.abreger = "L'abréviation est requise.";
    } else if (abreger.length !== 3) {
        newErrors.abreger = "L'abréviation doit contenir exactement 3 caractères.";
      
    }
    // if (!region) {
    //   newErrors.region = "La région est requise.";
    // }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  async function handleSave(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        description: description,
        abreger: abreger,
        region: region,
      };
      console.log("Payload to be sent:", payload);
      await createVille(payload);
      setDescription(null);
      setAbreger(null);
      setRegion(null);
      setErrors({});
      fetchVilles(page);
      closeModal();
    } catch (error) {
      console.error("Échec de l'enregistrement des modifications:", error);
    }finally {
      setIsSaving(false);
    }
  }
  
  function cleanForm(): void {
    setDescription(null);
    setAbreger(null);
    setRegion(null);
    setErrors({});
  }

  function handleSafeDelete(): void {
    if (editingId == null) return;

    // Optionally you could add a loading state here if desired.
    deleteVille(editingId)
      .then(() => {
        setVilles((prev) => prev.filter((v) => v.id !== editingId));
        // If the current page becomes empty after deletion, refetch previous page if possible.
        setTimeout(() => {
          setEditingId(null);
          setEditingVille(null);
          closeDeleteModal();
          setVilles((current) => {
            if (current.length === 0 && page > 0) {
              const newPage = page - 1;
              setPage(newPage);
              fetchVilles(newPage);
            } else {
              fetchVilles(page);
            }
            return current;
          });
        }, 0);
      })
      .catch((err) => {
        console.error("Échec de la suppression de la ville:", err);
      });
  }

const handleSelectChange = async (selectedOption: Option | null) => {
  if (selectedOption) {
    try {
      const response = await getRegionByID(Number(selectedOption));

      setRegion(response.data);
    } catch (error) {
      console.error("Échec de la récupération de la région:", error);
      setRegion(null);
    }
  } else {
    setRegion(null);
  }
  setErrors((prev) => ({ ...prev, region: undefined }));
};

  useEffect(() => {
    if (!isOpen) {
      cleanForm();
    }
  }, [isOpen]);


  async function handleEditSelectChange(option: Option | null) {
    if (!option) return;
    const response = await getRegionByID(Number(option));

    setEditingVille((prev) => ({
      ...prev!,
      region: response.data,
    }));
  }


   async function handleEditSave(e: React.FormEvent) {
     e.preventDefault();
     if (!editingVille) return;

     const payload = {
       description: editingVille.description,
       abreger: editingVille.abreger,
       region: {
         description: editingVille.region?.description,
       },
     };

     try {
       await updateVille(editingId!, payload);
       closeEditModal();
       fetchVilles(page);
     } catch (e) {
       console.error(e);
     }
   }


  return (
    <>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
        <div>
          <div className="flex items-center m-2 gap-3 justify-end">
            <Button
              size="sm"
              variant="primary"
              title="Ajouter une nouvelle ville"
              startIcon={
                <span className="text-xl leading-none font-semibold">+</span>
              }
              onClick={openModal}
            >
              Nouvelle ville
            </Button>
          </div>
        </div>
        <div>
          <div className="relative m-2">
            <Input
              placeholder="Recherche par ville ou abreger"
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
        {villes.map((ville) => (
          <div
            key={ville.id}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-theme-sm transition hover:shadow-theme-md dark:border-white/[0.05] dark:bg-white/[0.03]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <AvatarText name={ville.description || "Ville"} />
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-gray-800 dark:text-white/90">
                    {ville.description}
                  </h3>
                  <p className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">
                    Description
                  </p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-theme-xs font-medium uppercase text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                {ville.abreger}
              </span>
            </div>

            <div className="mt-5 rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
              <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                Region
              </p>
              <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                {ville.region?.description ?? "N/A"}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <Button
                size="sm"
                className="p-2"
                variant="outline"
                title="Modifier cette ville"
                onClick={() => handleOpenEditModal(ville)}
              >
                <PencilIcon className="size-5" />
              </Button>
              <Button
                size="sm"
                className="p-2"
                variant="outline"
                title="Supprimer cette ville"
                onClick={() => handleOpenDeleteModal(ville)}
              >
                <TrashBinIcon className="size-5" />
              </Button>
            </div>
          </div>
        ))}

        {villes.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-400 md:col-span-2 xl:col-span-3">
            Aucune ville trouvee.
          </div>
        )}
      </div>
      )}

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Créer ville
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Enregistrer une nouvelle ville pour l&apos;utiliser dans vos
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
            <div className="custom-scrollbar h-[300px] overflow-y-auto px-2 pb-3">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                <div>
                  <Label>Description</Label>
                  <Input
                    type="text"
                    value={description ?? ""}
                    onChange={(e) =>
                      setDescription(
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                    placeholder="Entrez la description de la ville"
                    // required
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                <div>
                  <Label>Abreger</Label>
                  <Input
                    type="text"
                    value={abreger?.toUpperCase() ?? ""}
                    onChange={(e) =>
                      setAbreger(e.target.value === "" ? null : e.target.value)
                    }
                    placeholder="Entrez la valeur finale"
                    //required
                    min="3"
                    max="3"
                  />
                  {errors.abreger && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.abreger}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                <div>
                  <Label>Region</Label>
                  <div className="relative">
                    <Select
                      options={symboleOptions}
                      placeholder="Selectionnez un symbole"
                      onChange={handleSelectChange}
                      className="dark:bg-dark-900"
                    />
                  </div>
                  {errors.region && (
                    <p className="text-red-500 text-sm mt-1">{errors.region}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" title="Annuler la creation de la ville" onClick={closeModal}>
                Annuler
              </Button>
              <Button size="sm" title="Enregistrer cette ville" disabled={isSaving}>
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
              Editer ville
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Mettez à jour vos informations pour garder votre profil à jour.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[300px] overflow-y-auto px-2 pb-3">
              <div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                  <div>
                    <Label>Description</Label>
                    <Input
                      type="text"
                      value={editingVille?.description || ""}
                      onChange={(e) =>
                        setEditingVille((prev) => ({
                          ...prev!,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                  <div>
                    <Label>Abreger</Label>
                    <Input
                      type="text"
                      value={editingVille?.abreger || ""}
                      onChange={(e) =>
                        setEditingVille((prev) => ({
                          ...prev!,
                          abreger: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                  <div>
                    <Label>Region</Label>
                    <div className="relative">
                      <Select
                        options={symboleOptions}
                        defaultValue={symboleOptions.find(
                          (o) =>
                            o.value === editingVille?.region?.id?.toString()
                        )}
                        placeholder="Sélectionnez une région"
                        onChange={handleEditSelectChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" title="Fermer le formulaire de modification" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" variant="primary" title="Enregistrer les modifications de la ville" onClick={handleEditSave}>
                Enregistrer les modification
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
              Êtes-vous sûr de vouloir supprimer cette ville ?
            </p>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-center">
            <Button size="sm" variant="primary" title="Confirmer la suppression de cette ville" onClick={handleSafeDelete}>
              Okay, Confirmer
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
