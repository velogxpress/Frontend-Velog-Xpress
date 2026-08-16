"use client";
import React, { useState ,useEffect} from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Alert from "../ui/alert/Alert";
import { updatePassword } from "../../../services/PasswordService";
import { jwtDecode } from "jwt-decode";
import { getClient } from "@/services/LoginService";



interface Client {
  name: string;
  email: string;
  address: string;
  ville: Ville;
  usercode: string;
  password: string;
  phone: string;
  role: string;
  status: string;
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

function cleanVelogCode(value: string | null): string | null {
  if (!value) return value;

  return value.startsWith("VELOG XPRESS-")
    ? value.replace("VELOG XPRESS-", "")
    : value;
}

export default function UserAuthCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [msg,setMsg]=useState<string>("");
  const [showAlert,setShowAlert]=useState<boolean>(false);
  const [password,setPassword]=useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [colors,setColors]=useState<string>("error");
  const [titre, setTitre] = useState<string>("Oups!");

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
        }).catch((error) => {
          console.error("Failed to fetch client data:", error);
        }); 
      }
    
      useEffect(() => {
        searchUser();
      }, []);


  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const pwd = password.trim();
    const conf = confirmPassword.trim();

    if (!pwd) {
      setMsg("Veuillez entrer votre mot de passe.");
      setTitre("Oups!");
      setColors("error");
      setShowAlert(true);
      return;
    }
    if (pwd.length < 6) {
      setMsg("Le mot de passe doit contenir au moins 6 caractères.");
      setTitre("Oups!");
      setColors("error");
      setShowAlert(true);
      return;
    }
    if (pwd !== conf) {
      setMsg("Les mots de passe ne correspondent pas.");
      setTitre("Oups!");
      setColors("error");
      setShowAlert(true);
      return;
    }
    setShowAlert(false);
    const updatedClient = {
      name: clientName || "",
      email: cleintEmail || "",
      address: clientAdress || "",
      ville: {
        id: Number(clientCityID || "0"),
        description: clientCity || "",
        abreger: clientCityAbreger || "",
        region: {
          id: Number(clientRegionID || "0"),
          description: clientRegion || "",
        },
      },
      usercode: clientCode || "",
      password: conf,
      phone: clientPhone|| "",
      role: clientRole || "",
      status: clientStatus || "",
    };
  
    updatePassword(clientCode, updatedClient)
      .then((response) => {
        // Password updated successfully
        setPassword("");
        setConfirmPassword("");
        setMsg("Mot de passe mis à jour avec succès.");
        setTitre("Succès!");
        setColors("success");
        setShowAlert(true);
      })
      .catch((error) => {
        setMsg(
          "Erreur lors de la mise à jour du mot de passe. Veuillez réessayer."
        );
        setTitre("Oups!");
        setColors("error");
        setShowAlert(true);
      });

  };
  return (
    <>
      <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Sécurité du compte
            </h4>
            <p className="mb-5 mt-1 text-sm text-gray-500 dark:text-gray-400">Retrouvez vos identifiants et protégez l’accès à votre espace.</p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-white/[0.04]">
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Code Personnel
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {cleanVelogCode(clientCode) || "N/A"}
                </p>
              </div>

              <div className="min-w-0 rounded-xl bg-gray-50 p-4 dark:bg-white/[0.04]">
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90" title={cleintEmail || "N/A"}>
                  {cleintEmail || "N/A"}
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
            Modifier le mot de passe
          </button>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Changer mot de passe
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Entrez votre ancien mot de passe pour confirmer l'authentication.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar mb-4">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Nouveau mot de passe</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div>
                  <Label>Confirmer le mot de passe</Label>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
              </div>
            </div>
            {showAlert && (
              <Alert
                variant={colors}
                title={titre}
                message={msg}
                showLink={false}
              />
            )}
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Fermer
              </Button>

              <Button size="sm" onClick={handleSave}>
                Enregistrer
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
