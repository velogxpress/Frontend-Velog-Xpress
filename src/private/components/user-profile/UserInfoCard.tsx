"use client";
import { useState,useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "@/private/components/form/Select";
import { updateClient } from "../../../services/RegisterService";
import { listRegions} from "../../../services/RegionService";
import { getVilleRegion } from "../../../services/VilleService";
import { jwtDecode } from "jwt-decode";
import { getClient } from "@/services/LoginService";


interface Region {
  id: number;
  description: string;
}
interface Ville {
  id: number;
  description: string;
  region: Region;
}


type Option = { label: string; value: number };

function cleanVelogCode(value: string | null): string | null {
  if (!value) return value;

  return value.startsWith("VELOG XPRESS-")
    ? value.replace("VELOG XPRESS-", "")
    : value;
}

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
    const [regions, setRegions] = useState<Region[]>([]);
    const [selectedRegion, setSelectedRegion] = useState<Option | null>(null);
    const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
    const [selectedRegionDescription,setSelectedRegionDescription]=useState<string>("");

    const[villes,setVilles]=useState<Ville[]>([]);
    const [selectedVilleId, setSelectedVilleId] = useState<number | null>(null);
  const [selectedVilleDescription, setSelectedVilleDescription] = useState<string>("");
  
    const [clientName, setClientName] = useState("");
    const [clientCode, setClientCode] = useState("");
    const [initials, setInitials] = useState("");
    const [cleintEmail, setClientEmail] = useState("");
    const [clientAdress, setClientAddress] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [clientCity, setClientCity] = useState("");
    const [clientCityID, setClientCityID] = useState("");
    const [clientCityAbreger, setClientCityAbreger] = useState("");
    const [clientRegion, setClientRegion] = useState("");
    const [clientRegionID, setClientRegionID] = useState("");
    const [clientStatus, setClientStatus] = useState("");
    const [clientRole, setClientRole] = useState("");
  
    const [phone,setPhone]=useState<string>("");
    const [address, setAddress] = useState<string>("");
  
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
            setClientName(client.name);
            setClientCode(client.usercode);
            setClientEmail(client.email);
            const parts = client.name?.split(" ");
            const firstName = parts ? parts[0] : "";
            const lastName = parts && parts.length > 1 ? parts[parts.length - 1] : "";
            setInitials(`${firstName.charAt(0)}${lastName.charAt(0)}`);
            setClientAddress(client.address);
            setClientPhone(client.phone);
            setClientCity(client.ville.description);
            setClientCityID(client.ville.id.toString());
            setClientCityAbreger(client.ville.abreger);
            setClientRegion(client.ville.region.description);
            setClientRegionID(client.ville.region.id.toString());
            setClientStatus(client.status);
            setClientRole(client.role);
            setPhone(client.phone);
            setAddress(client.address);
            setSelectedRegionId(client.ville.region.id);
            setSelectedVilleId(client.ville.id);
           setSelectedRegionDescription(client.ville.region.description);
           setSelectedVilleDescription(client.ville.description);
            fetchVillesByRegion(client.ville.region.id, 0);
           
          }).catch((error) => {
            console.error("Failed to fetch client data:", error);
          }); 
        }
      
        useEffect(() => {
          searchUser();
        }, []);
  

 

    const [errors,setErrors]=useState<{
        selectedRegionId?:string;
        selectedVilleId?:string;
      }>({});

    const [isSaving,setIsSaving]=useState<boolean>(false);

  


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
      value: r.id,
    }));
    
    
    const villeOptions: Option[] = villes.map(v => ({
      label: v.description,
      value: v.id,
    }));
      
    
    
    
    useEffect(() => {
      if (selectedRegion) {
        fetchVillesByRegion(selectedRegion.value, 0);
      }
    }, [selectedRegion]);
    
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
    

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle save logic here
     if (!selectedRegionId) {
       setErrors((prev) => ({
         ...prev,
         selectedRegionId: "Veuillez sélectionner une région",
       }));
       return;
     }

     if (!selectedVilleId) {
       setErrors((prev) => ({
         ...prev,
         selectedVilleId: "Veuillez sélectionner une ville",
       }));
       return;
     }
      setIsSaving(true);
    
    const updatedClient = {
      name: clientName,
      email: cleintEmail,
      address: address,
      ville: {
        id: selectedVilleId,
        description: selectedVilleDescription,
        region: {
          id: selectedRegionId,
          description: selectedRegionDescription,
        },
      },
      usercode: clientCode,
      phone: phone,
      role: clientRole,
      status: clientStatus,
    };

    updateClient(clientCode, updatedClient)
      .then((response) => {
        // Optionally, show a success message to the user
        // Update localStorage
        setPhone(phone);
        setAddress(address);
        setSelectedRegionId(selectedRegionId);
        setSelectedVilleId(selectedVilleId);
      })
      .catch((error) => {
        console.error("Error updating client:", error);
        // Optionally, show an error message to the user
      })
      .finally(() => {
        setIsSaving(false);
      });
    closeModal();
  };
  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Informations Personnelles
          </h4>
          <p className="mb-5 mt-1 text-sm text-gray-500 dark:text-gray-400">Coordonnées utilisées pour votre compte et vos livraisons.</p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-white/[0.04]">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Nom Complet
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {clientName || "Client"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-white/[0.04]">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Adresse
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {clientAdress || ""},{" "}
                {clientCity || ""},{" "}
                {clientRegion || ""}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-white/[0.04]">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {cleintEmail || "randomuser@pimjo.com"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-white/[0.04]">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Téléphone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {clientPhone || "+09 363 398 46"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Role
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {clientRole || "Team Manager"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Status
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {clientStatus || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Editer
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Editer les informations personnelles
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Mettez à jour vos informations pour garder votre profil à jour.
            </p>
          </div>
          <form className="flex flex-col" onSubmit={handleSave}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Nom Complet</Label>
                    <Input
                      type="text"
                      defaultValue={clientName || ""}
                      disabled
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email</Label>
                    <Input
                      type="text"
                      defaultValue={cleintEmail || ""}
                      disabled
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Rôle</Label>
                    <Input
                      type="text"
                      defaultValue={clientRole || ""}
                      disabled
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>
                      Téléphone<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>
                      Adresse<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      disabled={!(clientRole === "Admin" || clientRole === "Agent")}
                    />
                  </div>
                  {(clientRole === "Admin" || clientRole === "Agent") && (
                    <>
                      <div className="col-span-2">
                        <Label>
                          Region<span className="text-error-500">*</span>
                        </Label>
                        <Select
                          options={regionOptions}
                          value={selectedRegionId}
                          placeholder="Sélectionnez une région"
                          onChange={(value: number | string) => {
                            const id = Number(value);

                            setSelectedRegionId(id);

                            // 👇 Prendre description depuis options (IMMÉDIAT)
                            const regionDesc =
                              regionOptions.find((r) => r.value === id)?.label ||
                              "";
                            setSelectedRegionDescription(regionDesc);

                            setSelectedVilleId(null);
                            setVilles([]);

                            if (id) {
                              fetchVillesByRegion(id, 0);
                            }
                          }}
                        />
                        {errors.selectedRegionId && (
                          <div className="text-error-500 text-sm mt-1">
                            {errors.selectedRegionId}
                          </div>
                        )}
                      </div>

                      <div className="col-span-2">
                        <Label>
                          Ville<span className="text-error-500">*</span>
                        </Label>
                        <Select
                          options={villeOptions}
                          value={selectedVilleId}
                          placeholder="Sélectionnez une ville"
                          isDisabled={!selectedRegionId}
                          onChange={(value: number | string) => {
                            const id = Number(value);
                            setSelectedVilleId(id);

                            const villeDesc =
                              villeOptions.find((v) => v.value === id)?.label || "";

                            setSelectedVilleDescription(villeDesc);
                          }}
                        />
                        {errors.selectedVilleId && (
                          <div className="text-error-500 text-sm mt-1">
                            {errors.selectedVilleId}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Fermer
              </Button>
              <Button size="sm" disabled={isSaving}>
                {isSaving
                  ? "Enregistrement en cours..."
                  : "Enregistrer les modifications"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
