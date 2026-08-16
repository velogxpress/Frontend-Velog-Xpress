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
import Label from "../form/Label";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Avatar from "../ui/avatar/Avatar";
import { PencilIcon, TrashBinIcon,PlusIcon,SearchIcon } from "../../icons";
import { useState, useEffect } from "react";
import { createSpecialfee,listSpecialfees, getSpecialfeeByAmount, updateSpecialfee, deleteSpecialfee} from "../../../services/SpecialfeeService";




interface Specialfee {
  id: number;
  amount: number;
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
 

export default function SpecialFeeForm() {
  const { isOpen, openModal, closeModal } = useModal();
  const {isOpen: isEditOpen, openModal: openEditModal,closeModal: closeEditModal} = useModal();
  const {isOpen: isDeleteOpen, openModal: openDeleteModal,closeModal: closeDeleteModal} = useModal();
  const [specialfees, setSpecialfees] = useState<Specialfee[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [recherche, setRecherche] = useState("");
    const [editingSpecialfee, setEditingSpecialfee] = useState<Specialfee | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [amount, setAmount] = useState<number | null>(null);
 


  const [errors, setErrors] = useState < {
    amount?: string;
  }>({});

  const fetchSpecialfees = async (pageNumber: number) => {
    try {
      const response = await listSpecialfees(pageNumber);
      setSpecialfees(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Échec du chargement des frais speciaux:", error);
    }
  };

 

  useEffect(() => {
    if (recherche.trim() === "") {
      fetchSpecialfees(page);
    }
  }, [page, recherche]);

 



  const handleKeyUp = async () => {
    if (recherche.trim() === "") {
      fetchSpecialfees(page);
    } else {
      // Filter villes based on search term
      try {
        const response = await getSpecialfeeByAmount(recherche, page);
        setSpecialfees(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Échec de la recherche des catégories:", error);
      }
    }
  };

  function handleOpenEditModal(selectedSpecialfee: Specialfee) {
    setEditingId(selectedSpecialfee.id);
    setEditingSpecialfee(selectedSpecialfee);
    openEditModal();
  }

   function handleOpenDeleteModal(selectedSpecialfee: Specialfee) {
     setEditingId(selectedSpecialfee.id);
     setEditingSpecialfee(selectedSpecialfee);
     openDeleteModal();
   }

  const validateForm = (): boolean => {
    const newErrors: {
      amount?: string;
    } = {}; 
    if (amount == null || amount <0) {
      newErrors.amount = "Le montant est requis et doit être supérieur ou égal à zéro.";
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
        amount: amount,
      };
      await createSpecialfee(payload);
      setAmount(null);
      setErrors({});
      fetchSpecialfees(page);
      closeModal();
    } catch (error) {
      console.error("Échec de l'enregistrement des modifications:", error);
    }finally {
      setIsSaving(false);
    }
  }
  
  function cleanForm(): void {
    setAmount(null);
    setErrors({});
  }

  function handleSafeDelete(): void {
    if (editingId == null) return;

    // Optionally you could add a loading state here if desired.
    deleteSpecialfee(editingId)
      .then(() => {
        setSpecialfees((prev) => prev.filter((v) => v.id !== editingId));
        // If the current page becomes empty after deletion, refetch previous page if possible.
        setTimeout(() => {
          setEditingId(null);
          setEditingSpecialfee(null);
          closeDeleteModal();
          setSpecialfees((current) => {
            if (current.length === 0 && page > 0) {
              const newPage = page - 1;
              setPage(newPage);
              fetchSpecialfees(newPage);
            } else {
              fetchSpecialfees(page);
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
     if (!editingSpecialfee) return;

     const payload = {
       amount: editingSpecialfee.amount,

     };

     try {
       await updateSpecialfee(editingId!, payload);
       closeEditModal();
       fetchSpecialfees(page);
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
              Nouveau frais spécial
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
                    Frais
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
                {specialfees.map((specialfee) => (
                  <TableRow key={specialfee.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      { "$US "}{specialfee.amount}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          className="p-2"
                          variant="outline"
                          onClick={() => handleOpenEditModal(specialfee)}
                        >
                          <PencilIcon className="size-5" />
                        </Button>
                        <Button
                          size="sm"
                          className="p-2"
                          variant="outline"
                          onClick={() => handleOpenDeleteModal(specialfee)}
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
              Créer frais spécial
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Enregistrer un nouveau frais spécial pour l&apos;utiliser dans vos
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
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                <div>
                  <Label>Montant</Label>
                  <Input
                    type="number"
                    value={amount ?? ""}
                    onChange={(e) =>
                      setAmount(
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                    placeholder="Entrez le montant"
                    // required
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.amount}
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
              Editer Frais spécial
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Mettez à jour vos informations pour garder votre profil à jour.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[200px] overflow-y-auto px-2 pb-3">
              <div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                  <div>
                    <Label>Montant</Label>
                    <Input
                      type="text"
                      value={editingSpecialfee?.amount || ""}
                      onChange={(e) =>
                        setEditingSpecialfee((prev) => ({
                          ...prev!,
                          amount: Number(e.target.value),
                        }))
                      }
                    />
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
              Êtes-vous sûr de vouloir supprimer ce frais spécial ?
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
