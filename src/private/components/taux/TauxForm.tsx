"use client";
import React from "react";
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
import Label from "../form/Label";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Avatar from "../ui/avatar/Avatar";
import { PencilIcon, TrashBinIcon,PlusIcon,SearchIcon } from "../../icons";
import { useState, useEffect } from "react";
import { SkeletonTableRows } from "../ui/skeleton/Skeleton";
import { createTaux,listTaux, searchTaux, updateTaux, deleteTaux } from "../../../services/TauxService";




interface Taux {
  id: number;
  devise: string;
  buy: number;
  sale?: number;
  symbole: string;
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

type Option = { label: string; value: string };
const symboleOptions: Option[] = [
  {label:"Dollars US",value:"Dollars US"},
  {label:"Dollars CAN",value:"Dollars CAN"},
  {label:"Gourdes",value:"Gourdes"},
  {label:"Pesos RD",value:"Pesos RD"},
  {label:"Euros",value:"Euros"},
];

export default function TauxForm() {
  const { isOpen, openModal, closeModal } = useModal();
  const {isOpen: isEditOpen, openModal: openEditModal,closeModal: closeEditModal} = useModal();
  const {isOpen: isDeleteOpen, openModal: openDeleteModal,closeModal: closeDeleteModal} = useModal();
  const [taux, setTaux] = useState<Taux[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [recherche, setRecherche] = useState("");
    const [editingTaux, setEditingTaux] = useState<Taux | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [devise, setDevise] = useState<string | null>(null);
  const [achat, setAchat] = useState<number | null>(null);
  const [vente, setVente] = useState<number|null>(null);



  const [errors, setErrors] = useState < {
    devise?: string;
    achat?: string;
    vente?: string;
  }>({});

  const fetchTaux = async (pageNumber: number) => {
    setIsLoading(true);
    try {
      const response = await listTaux(pageNumber);
      setTaux(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Échec du chargement des villes:", error);
    } finally {
      setIsLoading(false);
    }
  };

 

  useEffect(() => {
    if (recherche.trim() === "") {
      fetchTaux(page);
    }
  }, [page, recherche]);


  const handleKeyUp = async () => {
    if (recherche.trim() === "") {
      fetchTaux(page);
    } else {

      try {
        const response = await searchTaux(recherche, page);
        setTaux(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Échec de la recherche des villes:", error);
      }
    }
  };

  function handleOpenEditModal(selectedTaux: Taux) {
    setEditingId(selectedTaux.id);
    setEditingTaux(selectedTaux);
    openEditModal();
  }

   function handleOpenDeleteModal(selectedTaux: Taux) {
     setEditingId(selectedTaux.id);
     setEditingTaux(selectedTaux);
     openDeleteModal();
   }

  const validateForm = (): boolean => {
    const newErrors: {
      devise?: string;
      achat?: string;
      vente?: string;
    } = {}; 
    if (!devise || devise.trim() === "") {
      newErrors.devise = "La devise est requise.";
    }
    if (!achat || achat<=0 ) {
      newErrors.achat = "L'achat est requis et doit être supérieur à zéro.";
    }
    if (!vente || vente<=0 ) {
      newErrors.vente = "La vente est requise et doit être supérieure à zéro.";
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
        devise: devise,
        buy: achat,
        sale: vente
      };
     
      await createTaux(payload);
      setDevise(null);
      setAchat(null);
      setVente(null);
      setErrors({});
      fetchTaux(page);
      closeModal();
    } catch (error) {
      console.error("Échec de l'enregistrement des modifications:", error);
    }finally {
      setIsSaving(false);
    }
  }
  
  function cleanForm(): void {
    setDevise(null);
    setAchat(null);
    setVente(null);
    setErrors({});
  }

  function handleSafeDelete(): void {
    if (editingId == null) return;

    // Optionally you could add a loading state here if desired.
    deleteTaux(editingId)
      .then(() => {
        setTaux((prev) => prev.filter((v) => v.id !== editingId));
        // If the current page becomes empty after deletion, refetch previous page if possible.
        setTimeout(() => {
          setEditingId(null);
          setEditingTaux(null);
          closeDeleteModal();
          setTaux((current) => {
            if (current.length === 0 && page > 0) {
              const newPage = page - 1;
              setPage(newPage);
              fetchTaux(newPage);
            } else {
              fetchTaux(page);
            }
            return current;
          });
        }, 0);
      })
      .catch((err) => {
        console.error("Échec de la suppression du taux:", err);
      });
  }

const handleSelectChange = async (selectedOption: Option | null) => {
  if (selectedOption) {
    setDevise(selectedOption);
    } else {
    setDevise(null);
  }
};

  useEffect(() => {
    if (!isOpen) {
      cleanForm();
    }
  }, [isOpen]);


  async function handleEditSelectChange(option: Option | null) {
    if (!option) return;
    setEditingTaux((prev) => ({
      ...prev!,
      symbole: option.value,
    }));
  }


   async function handleEditSave(e: React.FormEvent) {
     e.preventDefault();
     if (!editingTaux) return;

     const payload = {
       devise: editingTaux.devise,
       buy: editingTaux.buy,
       sale: editingTaux.sale,
     };

     try {
       await updateTaux(editingId!, payload);
       closeEditModal();
       fetchTaux(page);
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
              startIcon={<PlusIcon className="size-5" />}
              onClick={openModal}
            >
              Nouveau taux
            </Button>
          </div>
        </div>
        <div>
          <div className="relative m-2">
            <Input
              placeholder="Recherche par region"
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
                    Devise
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Achat
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Vente
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Symbole
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
                ) : taux.map((tauxItem) => (
                  <TableRow key={tauxItem.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {tauxItem.devise}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {"$HTG " + tauxItem.buy}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {"$HTG " + tauxItem.sale}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {tauxItem.symbole}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          className="p-2"
                          variant="outline"
                          onClick={() => handleOpenEditModal(tauxItem)}
                        >
                          <PencilIcon className="size-5" />
                        </Button>
                        <Button
                          size="sm"
                          className="p-2"
                          variant="outline"
                          onClick={() => handleOpenDeleteModal(tauxItem)}
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
              Créer taux du jour
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Enregistrer un nouveau taux pour l&apos;utiliser dans vos
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
                  <Label>Devise</Label>
                  <div className="relative">
                    <Select
                      options={symboleOptions}
                      placeholder="Selectionnez un devis"
                      onChange={handleSelectChange}
                      className="dark:bg-dark-900"
                    />
                  </div>
                  {errors.devise && (
                    <p className="text-red-500 text-sm mt-1">{errors.devise}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Achat</Label>
                  <Input
                    type="text"
                    value={achat ?? ""}
                    onChange={(e) =>
                      setAchat(
                        e.target.value ? parseFloat(e.target.value) : null
                      )
                    }
                    placeholder="Entrez taux d'achat"
                    //required
                  />
                  {errors.achat && (
                    <p className="text-red-500 text-sm mt-1">{errors.achat}</p>
                  )}
                </div>
                <div>
                  <Label>Vente</Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={vente ?? ""}
                      onChange={(e) =>
                        setVente(
                          e.target.value ? parseFloat(e.target.value) : null
                        )
                      }
                      placeholder="Entrez taux d'achat"
                      //required
                    />
                  </div>
                  {errors.vente && (
                    <p className="text-red-500 text-sm mt-1">{errors.vente}</p>
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
              Editer taux du jour
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
                    <Label>Devise</Label>
                    <Select
                      options={symboleOptions}
                      defaultValue={symboleOptions.find(
                        (o) => o.value === editingTaux?.devise
                      )}
                      placeholder="Sélectionnez un devise"
                      onChange={handleEditSelectChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Achat</Label>
                    <Input
                      type="text"
                      value={editingTaux?.buy || ""}
                      onChange={(e) =>
                        setEditingTaux((prev) => ({
                          ...prev!,
                          buy: parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Vente</Label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={editingTaux?.sale || ""}
                        onChange={(e) =>
                          setEditingTaux((prev) => ({
                            ...prev!,
                            sale: parseFloat(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" variant="primary" onClick={handleEditSave}>
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
              Êtes-vous sûr de vouloir supprimer ce taux ?
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
