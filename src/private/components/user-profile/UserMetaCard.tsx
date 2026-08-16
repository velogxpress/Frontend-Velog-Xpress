"use client";
import React from "react";
import { useState,useEffect} from "react";
import { jwtDecode } from "jwt-decode";
import { getClient } from "@/services/LoginService";


function cleanVelogCode(value: string | null): string | null {
  if (!value) return value;

  return value.startsWith("VELOG XPRESS-")
    ? value.replace("VELOG XPRESS-", "")
    : value;
}

export default function UserMetaCard() {
  const [clientName, setClientName] = useState("");
  const [clientCode, setClientCode] = useState("");
  const [initials, setInitials] = useState("");
  const [cleintEmail, setClientEmail] = useState("");
  const [clientAdress, setClientAddress] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientCity, setClientCity] = useState("");
  const [clientRegion, setClientRegion] = useState("");
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
        setClientRegion(client.ville.region.description);
        setClientStatus(client.status);
        setClientRole(client.role);
      }).catch((error) => {
        console.error("Failed to fetch client data:", error);
      }); 
    }
  
    useEffect(() => {
      searchUser();
    }, []);
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="h-2 bg-gradient-to-r from-brand-500 via-blue-500 to-cyan-400" />
      <div className="p-5 lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-blue-700 text-2xl font-bold text-white shadow-lg shadow-brand-500/20 ring-4 ring-brand-50 dark:ring-brand-500/10">
            
              {initials || "OP"}
           
          </div>
          <div className="order-3 xl:order-2">
            <div className="mb-2 flex flex-col items-center gap-2 xl:flex-row"><h4 className="text-xl font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
              {clientName || "Client"}
            </h4><span className="rounded-full bg-success-50 px-2.5 py-1 text-xs font-semibold text-success-600 dark:bg-success-500/10 dark:text-success-400">{clientStatus || "Actif"}</span></div>
            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Code client : <span className="font-semibold text-gray-700 dark:text-gray-300">{cleanVelogCode(clientCode) || "N/A"}</span>
              </p>
              <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {clientAdress || "N/A"}, {clientCity || "N/A"}, {clientRegion || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end"></div>
        </div>
      </div>
      </div>
    </div>
  );
}
