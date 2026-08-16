"use client";
import React from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Avatar from "../ui/avatar/Avatar";
import AvatarText from "../ui/avatar/AvatarText";
import { PencilIcon, TrashBinIcon,SearchIcon } from "../../icons";
import { useState, useEffect } from "react";
import Select from "../form/Select";
import {
  createCipinfee,
  listCipinfees,
  searchCipinfee,
  updateCipinfee,
  deleteCipinfee,
} from "../../../services/FraisService";
import { getlistVilles } from "../../../services/VilleService";
import { getlistSpecialfees } from "../../../services/SpecialfeeService";
import {getlistAssurances} from "../../../services/InssuranceService";
import {getlistFeepounds} from "../../../services/FeepoundsService";



interface Specialfee {
  id: number;
  amount: number;
}

interface Feepounds{
  id: number;
  amount: number;
}

interface Ville{
  id: number;
  description: string;
  abreger: string;
  region:Region
}

interface Region{
  id: number;
  description: string;
}

interface Insurance{
  id: number;
  amount: number;
}

interface Cipinfee{
  id: number;
  city: Ville;
  pounds: Feepounds;
  insurance: Insurance;
  specialfee: Specialfee;
}



type Option = { label: string; value: number };


export default function Tableaudefrais() {
  const { isOpen, openModal, closeModal } = useModal();
  const {isOpen: isEditOpen, openModal: openEditModal,closeModal: closeEditModal} = useModal();
  const {isOpen: isDeleteOpen, openModal: openDeleteModal,closeModal: closeDeleteModal} = useModal();
  const [cipinfees, setCipinfees] = useState<Cipinfee[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [recherche, setRecherche] = useState("");
  const [editingCipinfee, setEditingCipinfee] = useState<Cipinfee | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [feepounds, setFeepounds] = useState<Feepounds[]>([]);
  const [specialfees, setSpecialfees] = useState<Specialfee[]>([]);
  const [villes, setVilles] = useState<Ville[]>([]);

  const [selectedInsurance, setSelectedInsurance] = useState<Option | null>(null);
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<number | null>(null);

  const [selectedFeepounds, setSelectedFeepounds] = useState<Option | null>(null);
  const [selectedFeepoundsId, setSelectedFeepoundsId] = useState<number | null>(null);

  const [selectedSpecialfee, setSelectedSpecialfee] = useState<Option | null>(null);
  const [selectedSpecialfeeId, setSelectedSpecialfeeId] = useState<number | null>(null);

  const [selectedVille, setSelectedVille] = useState<Option | null>(null);
  const [selectedVilleId, setSelectedVilleId] = useState<number | null>(null);

  
 
const [errors, setErrors] = useState<{
  selectedFeepoundsId?: string;
  selectedInsuranceId?: string;
  selectedSpecialfeeId?: string;
  selectedVilleId?: string;
}>({});

  const fetchCipinfees = async (pageNumber: number) => {
    try {
      const response = await listCipinfees(pageNumber);
      
      setCipinfees(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Échec du chargement des frais cipin:", error);
    }
  };

  useEffect(() => {
    if (recherche.trim() === "") {
      fetchCipinfees(page);
    }
  }, [page, recherche]);

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

 const fetchSpecialfees = async () => {
     try {
       const response = await getlistSpecialfees(0);
       setSpecialfees(response.data.content);
     } catch (error) {
       console.error("Échec du chargement des frais speciaux:", error);
     }
   };
 
   useEffect(() => {
    
       fetchSpecialfees();
     
   }, []);

   const specialfeeOptions: Option[] = specialfees.map((v) => ({
     label: "$US "+v.amount,
     value: v.id,
   }));

const fetchInsurances = async () => {
    try {
      const response = await getlistAssurances(0);
      setInsurances(response.data.content);
    } catch (error) {
      console.error("Échec du chargement des assurances:", error);
    }
  };

  useEffect(() => {

      fetchInsurances();
    
  }, []);


const inssuranceOptions: Option[] = insurances.map((v) => ({
  label: "$US " + v.amount,
  value: v.id,
}));


const fetchFeepounds = async () => {
    try {
      const response = await getlistFeepounds(0);
      setFeepounds(response.data.content);
    } catch (error) {
      console.error("Échec du chargement des frais par livre:", error);
    }
  };

  useEffect(() => {
  
      fetchFeepounds();
  }, []);

const feepoundsOptions: Option[] = feepounds.map((v) => ({
  label: "$US " + v.amount,
  value: v.id,
}));



  const handleKeyUp = async () => {
    if (recherche.trim() === "") {
      fetchCipinfees(page);
    } else {
      // Filter villes based on search term
      try {
        const response = await searchCipinfee(recherche, page);
        setCipinfees(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Échec de la recherche des catégories:", error);
      }
    }
  };

function handleOpenEditModal(selectedCipinfee: Cipinfee) {
  setEditingId(selectedCipinfee.id);
  setEditingCipinfee(selectedCipinfee);
  setSelectedVilleId(selectedCipinfee.city.id);
  setSelectedVille(selectedCipinfee.city ? { label: selectedCipinfee.city.abreger + " - " + selectedCipinfee.city.description, value: selectedCipinfee.city.id } : null);
  setSelectedFeepoundsId(selectedCipinfee.pounds.id);
  setSelectedFeepounds(selectedCipinfee.pounds ? { label: "$US " + selectedCipinfee.pounds.amount, value: selectedCipinfee.pounds.id } : null);
  setSelectedInsuranceId (selectedCipinfee.insurance.id);
  setSelectedInsurance(selectedCipinfee.insurance ? { label: "$US " + selectedCipinfee.insurance.amount, value: selectedCipinfee.insurance.id } : null);
  setSelectedSpecialfeeId (selectedCipinfee.specialfee.id);
  setSelectedSpecialfee(selectedCipinfee.specialfee ? { label: "$US " + selectedCipinfee.specialfee.amount, value: selectedCipinfee.specialfee.id } : null);
  openEditModal();
}

useEffect(() => {
    if (editingCipinfee) {
      setSelectedVilleId(editingCipinfee.city.id);
      setSelectedFeepoundsId(editingCipinfee.pounds.id);  
      setSelectedInsuranceId(editingCipinfee.insurance.id);
      setSelectedSpecialfeeId(editingCipinfee.specialfee.id);
    }
}, [editingCipinfee, isEditOpen]);

   function handleOpenDeleteModal(selectedCipinfee: Cipinfee) {
     setEditingId(selectedCipinfee.id);
     setEditingCipinfee(selectedCipinfee);
     openDeleteModal();
   }

  const validateForm = (): boolean => {
    const newErrors: {
      selectedFeepoundsId?: string;
      selectedInsuranceId?: string;
      selectedSpecialfeeId?: string;
      selectedVilleId?: string;
    } = {};

    if (!selectedFeepoundsId) {
      newErrors.selectedFeepoundsId = "Le frais par livre est requis.";
    }

    if (!selectedInsuranceId) {
      newErrors.selectedInsuranceId = "L'assurance est requise.";
    }

    if (!selectedSpecialfeeId) {
      newErrors.selectedSpecialfeeId = "Le frais spécial est requis.";
    }

    if (!selectedVilleId) {
      newErrors.selectedVilleId = "La ville est requise.";
    }

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
        city: {id: selectedVilleId,description:"",abreger:"",region:{id:0,description:""}},
        pounds: {id: selectedFeepoundsId, amount: 0},
        insurance: {id: selectedInsuranceId, amount: 0},
        specialfee: {id: selectedSpecialfeeId, amount: 0},
      };
      
       await createCipinfee(payload);
      
       setErrors({});
       fetchCipinfees(page);
       cleanForm();
     closeModal();
    } catch (error) {
      console.error("Échec de l'enregistrement des modifications:", error);
    }finally {
      setIsSaving(false);
    }
  }
  
  function cleanForm(): void {
    if (selectedFeepoundsId) setSelectedFeepoundsId(null);
    if (selectedInsuranceId) setSelectedInsuranceId(null);
    if (selectedSpecialfeeId) setSelectedSpecialfeeId(null);
    if (selectedVilleId) setSelectedVilleId(null);
  }

  function handleSafeDelete(): void {
    if (editingId == null) return;

    // Optionally you could add a loading state here if desired.
    deleteCipinfee(editingId)
      .then(() => {
        setCipinfees((prev) => prev.filter((v) => v.id !== editingId));
        // If the current page becomes empty after deletion, refetch previous page if possible.
        setTimeout(() => {
          setEditingId(null);
          setEditingCipinfee(null);
          closeDeleteModal();
          setCipinfees((current) => {
            if (current.length === 0 && page > 0) {
              const newPage = page - 1;
              setPage(newPage);
              fetchCipinfees(newPage);
            } else {
              fetchCipinfees(page);
            }
            return current;
          });
        }, 0);
      })
      .catch((err) => {
        console.error("Échec de la suppression d'assurance:", err);
      });
  }



  useEffect(() => {
    if (!isOpen) {
      cleanForm();
    }
  }, [isOpen]);

   async function handleEditSave(e: React.FormEvent) {
     e.preventDefault();
     if (!editingCipinfee) return;

      const payload = {
        city: {
          id: selectedVilleId,
          description: "",
          abreger: "",
          region: { id: 0, description: "" },
        },
        pounds: { id: selectedFeepoundsId, amount: 0 },
        insurance: { id: selectedInsuranceId, amount: 0 },
        specialfee: { id: selectedSpecialfeeId, amount: 0 },
      };

     try {
       await updateCipinfee(editingId!, payload);
       closeEditModal();
       fetchCipinfees(page);
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
              title="Ajouter un nouveau tableau de frais"
              startIcon={
                <span className="text-xl leading-none font-semibold">+</span>
              }
              onClick={openModal}
            >
              Nouveau tableau de frais
            </Button>
          </div>
        </div>
        <div>
          <div className="relative m-2">
            <Input
              placeholder="Recherche par montant..."
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
              title="Afficher la page precedente"
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
        {cipinfees.map((cipinfee) => (
          <div
            key={cipinfee.id}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-theme-sm transition hover:shadow-theme-md dark:border-white/[0.05] dark:bg-white/[0.03]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <AvatarText name={cipinfee.city?.description || "Ville"} />
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-gray-800 dark:text-white/90">
                    {cipinfee.city?.description ?? "N/A"}
                  </h3>
                  <p className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">
                    Ville
                  </p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-theme-xs font-medium uppercase text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                {cipinfee.city?.abreger ?? "N/A"}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  Frais par livre
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  $US {cipinfee.pounds?.amount ?? 0}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  Assurance
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  $US {cipinfee.insurance?.amount ?? 0}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  Frais Special
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  $US {cipinfee.specialfee?.amount ?? 0}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <Button
                size="sm"
                className="p-2"
                variant="outline"
                title="Modifier ce tableau de frais"
                onClick={() => handleOpenEditModal(cipinfee)}
              >
                <PencilIcon className="size-5" />
              </Button>
              <Button
                size="sm"
                className="p-2"
                variant="outline"
                title="Supprimer ce tableau de frais"
                onClick={() => handleOpenDeleteModal(cipinfee)}
              >
                <TrashBinIcon className="size-5" />
              </Button>
            </div>
          </div>
        ))}

        {cipinfees.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-400 md:col-span-2 xl:col-span-3">
            Aucun tableau de frais trouve.
          </div>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Créer tableau de frais
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Enregistrer un nouveau tableau de frais pour l&apos;utiliser dans vos
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
            <div className="custom-scrollbar h-[200px] overflow-y-auto px-2 pb-3">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Ville</Label>
                  <Select
                    options={villeOptions}
                    value={selectedVilleId}
                    placeholder="Sélectionnez une ville"
                    isDisabled={!selectedVilleId && villeOptions.length === 0}
                    onChange={(value: number | string) => {
                      const id = Number(value); // 👈 FIX 1
                      setSelectedVilleId(id);
                    }}
                  />
                  {errors.selectedVilleId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.selectedVilleId}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Frais par livre</Label>
                  <Select
                    options={feepoundsOptions}
                    value={selectedFeepoundsId}
                    placeholder="Sélectionnez un frais par livre"
                    isDisabled={
                      !selectedFeepoundsId && feepoundsOptions.length === 0
                    }
                    onChange={(value: number | string) => {
                      const id = Number(value); // 👈 FIX 1
                      setSelectedFeepoundsId(id);
                    }}
                  />
                  {errors.selectedFeepoundsId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.selectedFeepoundsId}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Assurance</Label>
                  <Select
                    options={inssuranceOptions}
                    value={selectedInsuranceId}
                    placeholder="Sélectionnez un frais d'assurance"
                    isDisabled={
                      !selectedInsuranceId && inssuranceOptions.length === 0
                    }
                    onChange={(value: number | string) => {
                      const id = Number(value); // 👈 FIX 1
                      setSelectedInsuranceId(id);
                    }}
                  />
                  {errors.selectedInsuranceId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.selectedInsuranceId}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Frais Special</Label>
                  <Select
                    options={specialfeeOptions}
                    value={selectedSpecialfeeId}
                    placeholder="Sélectionnez un frais spécial"
                    isDisabled={
                      !selectedSpecialfeeId && specialfeeOptions.length === 0
                    }
                    onChange={(value: number | string) => {
                      const id = Number(value); // 👈 FIX 1
                      setSelectedSpecialfeeId(id);
                    }}
                  />
                  {errors.selectedSpecialfeeId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.selectedSpecialfeeId}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" title="Annuler la creation du tableau de frais" onClick={closeModal}>
                Annuler
              </Button>
              <Button size="sm" title="Enregistrer ce tableau de frais" disabled={isSaving}>
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
              Editer Tableau de Frais
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Mettez à jour vos informations pour garder votre profil à jour.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[200px] overflow-y-auto px-2 pb-3">
              <div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Ville</Label>
                    <Select
                      options={villeOptions}
                      defaultValue={selectedVille?.value} // 👈 ID LA
                      placeholder="Sélectionnez une ville"
                      disabled={villeOptions.length === 0}
                      onChange={(value) => {
                        setSelectedVilleId(value);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Frais par livre</Label>
                    <Select
                      options={feepoundsOptions}
                      defaultValue={selectedFeepounds?.value}
                      placeholder="Sélectionnez un frais par livre"
                      isDisabled={
                        !selectedFeepoundsId && feepoundsOptions.length === 0
                      }
                      onChange={(value: number | string) => {
                        const id = Number(value); // 👈 FIX 1
                        setSelectedFeepoundsId(id);
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Assurance</Label>
                    <Select
                      options={inssuranceOptions}
                      defaultValue={selectedInsurance?.value}
                      placeholder="Sélectionnez un frais d'assurance"
                      isDisabled={
                        !selectedInsuranceId && inssuranceOptions.length === 0
                      }
                      onChange={(value: number | string) => {
                        const id = Number(value); // 👈 FIX 1
                        setSelectedInsuranceId(id);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Frais Special</Label>
                    <Select
                      options={specialfeeOptions}
                      defaultValue={selectedSpecialfee?.value}
                      placeholder="Sélectionnez un frais spécial"
                      isDisabled={
                        !selectedSpecialfeeId && specialfeeOptions.length === 0
                      }
                      onChange={(value: number | string) => {
                        const id = Number(value); // 👈 FIX 1
                        setSelectedSpecialfeeId(id);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" title="Fermer le formulaire de modification" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" variant="primary" title="Enregistrer les modifications du tableau de frais" onClick={handleEditSave}>
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
              Êtes-vous sûr de vouloir supprimer ce tableau de frais ?
            </p>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-center">
            <Button size="sm" variant="primary" title="Confirmer la suppression de ce tableau de frais" onClick={handleSafeDelete}>
              Okay, Confirmer
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
