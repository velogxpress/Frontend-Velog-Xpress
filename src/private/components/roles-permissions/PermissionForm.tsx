"use client";
import * as React from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Avatar from "../ui/avatar/Avatar";
import { PencilIcon, TrashBinIcon,SearchIcon } from "../../icons";
import { useState, useEffect } from "react";
import { createAgentSurcursal,listAgentSurcursal,searchAgentSurcursal,deleteAgentSurcursal,updateAgentSurcursal} from "../../../services/AgentsurcursalService";
import { listSurcursals } from "@/services/SurcursalService";
import { PlusSquareIcon } from "lucide-react";
import { listAgents } from "@/services/RegisterService";


interface Region {
  id: number;
  description: string;
}

interface Ville {
  id: number;
  description: string;
  region: Region;
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

interface Surcursal {
  id: number;
  name: string;
  address: string;
  ville: Ville;
  phone: string;
  horaire: string;
}
interface AgentSurcursale {
  id: number;
  client: Client;
  surcursal: Surcursal;
}

function cleanVelogCode(value: string | null | undefined): string {
  if (!value) return "N/A";

  return value.startsWith("VELOG XPRESS-")
    ? value.replace("VELOG XPRESS-", "")
    : value;
}

function getInitials(value: string | null | undefined): string {
  if (!value) return "NA";

  const initials = value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "NA";
}


 type Option = { label: string; value: string };

export default function PermissionForm() {
  const { isOpen, openModal, closeModal } = useModal();
  const {isOpen: isEditOpen, openModal: openEditModal,closeModal: closeEditModal} = useModal();
  const {isOpen: isDeleteOpen, openModal: openDeleteModal,closeModal: closeDeleteModal} = useModal();
  const [agentsurcursals, setAgentsurcursals] = useState<AgentSurcursale[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [recherche, setRecherche] = useState("");
  const [editingAgentSurcursale, setEditingAgentSurcursale] = useState<AgentSurcursale | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [surcursals, setSurcursals] = useState<Surcursal[]>([]);
  const [agents, setAgents] = useState<Client[]>([]);

  const [selectedSurcursalObj, setSelectedSurcursalObj] = useState<Surcursal | null>(null);
  const [selectedAgentObj, setSelectedAgentObj] = useState<Client | null>(null);
  const [erros, setErros] = useState<string>("");



  const fetchAgentsurcursals = async (pageNumber: number) => {
    try {
      const response = await listAgentSurcursal(pageNumber);
        setAgentsurcursals(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Échec du chargement des agents surcursals:", error);
    }
  };

 

  useEffect(() => {
    const fetchData = async () => {
      if (recherche.trim() === "") {
        fetchAgentsurcursals(page);
        return;
      }

      try {
        const response = await searchAgentSurcursal(recherche, page);
        setAgentsurcursals(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Échec de la recherche des agents surcursals:", error);
      }
    };

    fetchData();
  }, [page, recherche]);

  const fetchSurcursals = async () => {
    try {
      const response = await listSurcursals(0);
      setSurcursals(response.data.content);
    } catch (error) {
      console.error("Échec du chargement des surcursals:", error);
    }
  };

  useEffect(() => {
    fetchSurcursals();
  }, []);

const surcursalOptions: Option[] = surcursals.map((surcursal) => ({
    label: surcursal.name+" - "+surcursal.address,
    value: surcursal.id.toString(),
  }));


  const fetchAgents = async () => {
    try {
      const response = await listAgents(0);
      setAgents(response.data.content);
    } catch (error) {
      console.error("Échec du chargement des agents:", error);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []); 

   const agentOptions: Option[] = agents.map((agent) => ({
     label: cleanVelogCode(agent.usercode)+ " - " + agent.name,
     value: agent.id.toString(),
   }));


  function handleOpenEditModal(selectedAgent: AgentSurcursale) {
    setEditingId(selectedAgent.id);
    setEditingAgentSurcursale(selectedAgent);
    openEditModal();
  }

   function handleOpenDeleteModal(selectedAgent: AgentSurcursale) {
     setEditingId(selectedAgent.id);
     setEditingAgentSurcursale(selectedAgent);
     openDeleteModal();
   }




  async function handleSave(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!selectedSurcursalObj || !selectedAgentObj) {
        setErros("Surcursal ou Agent non sélectionné.");
        setIsSaving(false);
        return;
      }
    setIsSaving(true);
    try {
      const payload = {
        surcursal: selectedSurcursalObj,
        client: selectedAgentObj,
      };
      await createAgentSurcursal(payload);
      fetchAgentsurcursals(page);
      closeModal();
    } catch (error) {
      console.error("Échec de l'enregistrement des modifications:", error);
    }finally {
      setIsSaving(false);
    }
  }
  


  function handleSafeDelete(): void {
    if (editingId == null) return;
    deleteAgentSurcursal(editingAgentSurcursale!.client.usercode)
      .then(() => {
        fetchAgentsurcursals(page);
        closeDeleteModal();
      })
      .catch((error) => {
        console.error("Échec de la suppression de l'agent surcursal:", error);
      });
  }



   async function handleEditSave(e: React.FormEvent) {
     e.preventDefault();
     if (editingId == null || !editingAgentSurcursale) return;
     try {
       const payload = {
         surcursal: selectedSurcursalObj || editingAgentSurcursale.surcursal,
         client: selectedAgentObj || editingAgentSurcursale.client,
       };
        await updateAgentSurcursal(editingAgentSurcursale.client.usercode, payload);
       fetchAgentsurcursals(page);
       closeEditModal();
     } catch (error) {
       console.error("Échec de l'enregistrement des modifications:", error);
     }
   }


    function handleSelectChange(value: string): void {
      const surcursal = surcursals.find(
        (s) => s.id.toString() === value
      ) || null;
      setSelectedSurcursalObj(surcursal);
    }

    function handleSelectAgentChange(value: string): void {
      const agent = agents.find(
        (a) => a.id.toString() === value
      ) || null;
      setSelectedAgentObj(agent);
    }
  

  return (
    <>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
        <div>
          <div className="flex items-center m-2 gap-3 justify-end">
            <Button
              size="sm"
              variant="primary"
              title="Créer un nouveau agent surcursal"
              startIcon={<PlusSquareIcon className="size-5" />}
              onClick={openModal}
            >
              Nouveau agent
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {agentsurcursals.map((agentSurcursal) => (
          <div
            key={agentSurcursal.id}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-theme-sm transition hover:shadow-theme-md dark:border-white/[0.05] dark:bg-white/[0.03]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                  {getInitials(agentSurcursal.surcursal?.name)}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-gray-800 dark:text-white/90">
                    {agentSurcursal.surcursal?.name ?? "N/A"}
                  </h3>
                  <p className="mt-1 truncate text-theme-xs text-gray-500 dark:text-gray-400">
                    Agent: {agentSurcursal.client?.name ?? "N/A"}
                  </p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-theme-xs font-medium text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                {cleanVelogCode(agentSurcursal.client?.usercode)}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  Telephone
                </p>
                <p className="mt-1 break-words text-sm font-medium text-gray-700 dark:text-gray-300">
                  {agentSurcursal.surcursal?.phone || "N/A"}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  Ville
                </p>
                <p className="mt-1 break-words text-sm font-medium text-gray-700 dark:text-gray-300">
                  {agentSurcursal.surcursal?.ville?.description || "N/A"}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03] sm:col-span-2">
                <p className="text-theme-xs font-medium uppercase text-gray-400 dark:text-gray-500">
                  Adresse
                </p>
                <p className="mt-1 break-words text-sm font-medium text-gray-700 dark:text-gray-300">
                  {agentSurcursal.surcursal?.address || "N/A"}
                  {agentSurcursal.surcursal?.ville?.description ? `, ${agentSurcursal.surcursal.ville.description}` : ""}
                  {agentSurcursal.surcursal?.ville?.region?.description ? `, ${agentSurcursal.surcursal.ville.region.description}` : ""}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <Button
                size="sm"
                className="p-2"
                variant="outline"
                title="Modifier cet agent surcursal"
                onClick={() => handleOpenEditModal(agentSurcursal)}
              >
                <PencilIcon className="size-5" />
              </Button>
              <Button
                size="sm"
                className="p-2"
                variant="outline"
                title="Supprimer cet agent surcursal"
                onClick={() => handleOpenDeleteModal(agentSurcursal)}
              >
                <TrashBinIcon className="size-5" />
              </Button>
            </div>
          </div>
        ))}

        {agentsurcursals.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-400 md:col-span-2 xl:col-span-3">
            Aucun agent surcursal trouve.
          </div>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Créer un Agent Surcursal
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Enregistrer un agent surcursal pour l&apos;utiliser dans vos
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
            <div className="custom-scrollbar h-[220px] overflow-y-auto px-2 pb-3">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                <div>
                  <Label>Surcursal</Label>
                   <Select
                      options={surcursalOptions}
                      placeholder="Selectionnez un surcursal"
                      onChange={handleSelectChange}
                      className="dark:bg-dark-900"
                    />
                </div>
                {erros && (
                  <div className="text-red-500 text-sm mt-2">{erros}</div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                <div>
                  <Label>Agent</Label>
                  <div className="relative">
                    <Select
                      options={agentOptions}
                      placeholder="Selectionnez un agent"
                      onChange={handleSelectAgentChange}
                      className="dark:bg-dark-900"
                    />
                  </div>
                </div>
              </div>
              {erros && (
                <div className="text-red-500 text-sm mt-2">{erros}</div>
              )}
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" title="Annuler la création" onClick={closeModal}>
                Annuler
              </Button>
              <Button size="sm" title="Enregistrer cet agent surcursal" disabled={isSaving}>
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
              Editer l&apos;agent surcursal
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Mettez à jour vos informations pour garder votre profil à jour.
            </p>
          </div>
          <form className="flex flex-col" onSubmit={handleEditSave} onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}>
            <div className="custom-scrollbar h-[200px] overflow-y-auto px-2 pb-3">
              <div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                   <div>
                    <Label>Surcursal</Label>
                   <Select
                        options={surcursalOptions}
                        defaultValue={
                          surcursalOptions.find(
                            (o) => o.value === editingAgentSurcursale?.surcursal?.id.toString()
                          )?.value
                        }
                        placeholder="Sélectionnez un surcursal"
                        onChange={(e) =>
                          setEditingAgentSurcursale((prev) => ({
                            ...prev!,
                            surcursal: { ...prev!.surcursal, id: parseInt(e) },
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
                        options={agentOptions}
                        defaultValue={
                          agentOptions.find(
                            (o) => o.value === editingAgentSurcursale?.client?.id.toString()
                          )?.value
                        }
                        placeholder="Sélectionnez un agent"
                        onChange={(e) =>
                          setEditingAgentSurcursale((prev) => ({
                            ...prev!,
                            client: { ...prev!.client, id: parseInt(e) },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" title="Fermer la modification" onClick={closeEditModal}>
                Close
              </Button>
              <Button size="sm" variant="primary" title="Enregistrer les modifications">
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
              Êtes-vous sûr de vouloir supprimer cet agent surcursal ?
            </p>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-center">
            <Button size="sm" variant="primary" title="Confirmer la suppression" onClick={handleSafeDelete}>
              Okay, Confirmer
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
