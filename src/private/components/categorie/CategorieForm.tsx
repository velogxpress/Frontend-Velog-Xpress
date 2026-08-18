"use client";
import * as React from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Avatar from "../ui/avatar/Avatar";
import AvatarText from "../ui/avatar/AvatarText";
import { PencilIcon, TrashBinIcon,SearchIcon } from "../../icons";
import { useState, useEffect } from "react";
import { SkeletonCardGrid } from "../ui/skeleton/Skeleton";
import { createCategorie,listCategories, searchCategorie, updateCategorie, deleteCategorie} from "../../../services/CategorieService";



interface Category {
  id: number;
  description: string;
  part?: string;
}


 type Option = { label: string; value: string };
 const symboleOptions: Option[] = [
   { label: "Document", value: "Document" },
   { label: "Electronique", value: "Electronique" },
   { label: "Normal", value: "Normal" },
   { label: "HazMat", value: "HazMat" },
 ];

export default function CategorieForm() {
  const { isOpen, openModal, closeModal } = useModal();
  const {isOpen: isEditOpen, openModal: openEditModal,closeModal: closeEditModal} = useModal();
  const {isOpen: isDeleteOpen, openModal: openDeleteModal,closeModal: closeDeleteModal} = useModal();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [recherche, setRecherche] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [description, setDescription] = useState<string | null>(null);
  const [part, setPart] = useState<string>("");
 


  const [errors, setErrors] = useState < {
    description?: string;
    part?: string;
  }>({});

  const fetchCategories = async (pageNumber: number) => {
    setIsLoading(true);
    try {
      const response = await listCategories(pageNumber);
        setCategories(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Échec du chargement des catégories:", error);
    } finally {
      setIsLoading(false);
    }
  };

 

  useEffect(() => {
    if (recherche.trim() === "") {
      fetchCategories(page);
    }
  }, [page, recherche]);

 



  const handleKeyUp = async () => {
    if (recherche.trim() === "") {
      fetchCategories(page);
    } else {
      // Filter villes based on search term
      try {
        const response = await searchCategorie(recherche, page);
        setCategories(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Échec de la recherche des catégories:", error);
      }
    }
  };

  function handleOpenEditModal(selectedCategorie: Category) {
    setEditingId(selectedCategorie.id);
    setEditingCategory(selectedCategorie);
    openEditModal();
  }

   function handleOpenDeleteModal(selectedCategorie: Category) {
     setEditingId(selectedCategorie.id);
     setEditingCategory(selectedCategorie);
     openDeleteModal();
   }

  const validateForm = (): boolean => {
    const newErrors: {
      description?: string;
      part?: string;
    } = {}; 
    if (!description || description.trim() === "") {
      newErrors.description = "La description est requise.";
    }
     if (!part || part.trim() === "") {
      newErrors.part = "La partie est requise.";
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
        description: description,
        part: part,
      };
      await createCategorie(payload);
      setDescription("");
      setPart("");
      setErrors({});
      fetchCategories(page);
      closeModal();
    } catch (error) {
      console.error("Échec de l'enregistrement des modifications:", error);
    }finally {
      setIsSaving(false);
    }
  }
  
  function cleanForm(): void {
    setDescription("");
    setPart("");
    setErrors({});
  }

  function handleSafeDelete(): void {
    if (editingId == null) return;

    // Optionally you could add a loading state here if desired.
    deleteCategorie(editingId)
      .then(() => {
        setCategories((prev) => prev.filter((v) => v.id !== editingId));
        // If the current page becomes empty after deletion, refetch previous page if possible.
        setTimeout(() => {
          setEditingId(null);
          setEditingCategory(null);
          closeDeleteModal();
          setCategories((current) => {
            if (current.length === 0 && page > 0) {
              const newPage = page - 1;
              setPage(newPage);
              fetchCategories(newPage);
            } else {
              fetchCategories(page);
            }
            return current;
          });
        }, 0);
      })
      .catch((err) => {
        console.error("Échec de la suppression du categorie:", err);
      });
  }



  useEffect(() => {
    if (!isOpen) {
      cleanForm();
    }
  }, [isOpen]);


  

   async function handleEditSave(e: React.FormEvent) {
     e.preventDefault();
     if (!editingCategory) return;

     const payload = {
       description: editingCategory.description,
       part: editingCategory.part,

     };

     try {
       await updateCategorie(editingId!, payload);
       closeEditModal();
       fetchCategories(page);
     } catch (e) {
       console.error(e);
     }
   }


  function handleSelectChange(value: string): void {
    setPart(value);
  }

  

  return (
    <>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
        <div>
          <div className="flex items-center m-2 gap-3 justify-end">
            <Button
              size="sm"
              variant="primary"
              title="Ajouter une nouvelle categorie"
              startIcon={
                <span className="text-xl leading-none font-semibold">+</span>
              }
              onClick={openModal}
            >
              Nouvelle catégorie
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
      {isLoading ? (
        <SkeletonCardGrid count={6} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" />
      ) : (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-theme-sm transition hover:shadow-theme-md dark:border-white/[0.05] dark:bg-white/[0.03]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <AvatarText name={category.description || "Categorie"} />
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-gray-800 dark:text-white/90">
                    {category.description}
                  </h3>
                  <p className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">
                    Categorie
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
              <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                Groupe
              </p>
              <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                {category.part ?? "N/A"}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <Button
                size="sm"
                className="p-2"
                variant="outline"
                title="Modifier cette categorie"
                onClick={() => handleOpenEditModal(category)}
              >
                <PencilIcon className="size-5" />
              </Button>
              <Button
                size="sm"
                className="p-2"
                variant="outline"
                title="Supprimer cette categorie"
                onClick={() => handleOpenDeleteModal(category)}
              >
                <TrashBinIcon className="size-5" />
              </Button>
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-400 md:col-span-2 xl:col-span-3">
            Aucune categorie trouvee.
          </div>
        )}
      </div>
      )}

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
            <div className="custom-scrollbar h-[200px] overflow-y-auto px-2 pb-3">
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
                    placeholder="Entrez la description du catégorie"
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
                  <Label>Groupe</Label>
                  <div className="relative">
                    <Select
                      options={symboleOptions}
                      placeholder="Selectionnez un symbole"
                      onChange={handleSelectChange}
                      className="dark:bg-dark-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" title="Annuler la creation de la categorie" onClick={closeModal}>
                Annuler
              </Button>
              <Button size="sm" title="Enregistrer cette categorie" disabled={isSaving}>
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
              Editer catégorie
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
                    <Label>Description</Label>
                    <Input
                      type="text"
                      value={editingCategory?.description || ""}
                      onChange={(e) =>
                        setEditingCategory((prev) => ({
                          ...prev!,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                  <div>
                    <Label>Groupe</Label>
                    <div className="relative">
                      <Select
                        options={symboleOptions}
                        defaultValue={
                          symboleOptions.find(
                            (o) => o.value === editingCategory?.part
                          )?.value
                        }
                        placeholder="Sélectionnez un groupe"
                        onChange={(e) =>
                          setEditingCategory((prev) => ({
                            ...prev!,
                            part: e,
                          }))
                        }
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
              <Button size="sm" variant="primary" title="Enregistrer les modifications de la categorie" onClick={() => handleEditSave({} as React.FormEvent)}>
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
              Êtes-vous sûr de vouloir supprimer cette categorie ?
            </p>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-center">
            <Button size="sm" variant="primary" title="Confirmer la suppression de cette categorie" onClick={handleSafeDelete}>
              Okay, Confirmer
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
