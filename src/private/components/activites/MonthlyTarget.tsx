"use client";
import { useCallback, useState,useEffect } from "react";
import { getTotalFacturesFromMyCity } from "../../../services/OrderDetailsService";
import { getFactureTodayFromMyCity } from "@/services/FactureService";
import { getTaux } from "@/services/TauxService";
import { getAgentSurcursal } from "@/services/AgentsurcursalService";
import { jwtDecode } from "jwt-decode";
import { getClient } from "@/services/LoginService";

interface Category {
  id: number;
  description: string;
  part?: string;
}

interface Order {
  id: number;
  date: string;
  shiporder: string;
  colisQty: number;
  poundQty: number;
  amount: number;
  status: string;
  shipdate: string | null;
}

interface Specialfee {
  id: number;
  amount: number;
}

interface Feepounds {
  id: number;
  amount: number;
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

interface Insurance {
  id: number;
  amount: number;
}

interface Cipinfee {
  id: number;
  city: Ville;
  pounds: Feepounds;
  insurance: Insurance;
  specialfee: Specialfee;
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
interface OrderDetails {
      id: number
      ship:Order;
      client:Client | null;
      upc:string;
      category:Category | null;
      citypoundfee:Cipinfee;
      pounds: number;
      subtotal: number;
      status: string;
      delivery: string;
      exp_name: string;
      exp_email: string | null;
      exp_phone: string;
      rec_name: string;
      rec_email: string | null;
      rec_phone: string;
      type: string;
      condition: string | null;
      price: number;
      tracking: string;
      douane: number;
      picture: string;
      note: string | null;
}
    
interface Surcursal {
  id: number;
  name: string;
  address: string;
  ville: Ville;
  phone: string;
  horaire: string;
}

interface AgentSurcursal{
    id:number;
    client:Client;
    surcursal: Surcursal;
}
interface Facture{
    id:number;
    code:string;
    date:string;
    client:string;
    clientphone:string;
    amount:number;
    status:string;
    ship:Order;
    user:Client;
    tarif:number;
    assurance:number;
    discount:number;
  subtotal: number;
  balance?: number;
  effectif?: number;
  surcursal: AgentSurcursal;
}

interface Taux {
  id: number;
  devise: string;
  buy: number;
  sale?: number;
  symbole: string;
}

interface DecodedToken {
  sub?: string;
}

export default function MonthlyTarget() {
  const [code, setCode] = useState<string>("");
  const storedToken = localStorage.getItem("token");
      let decoded: DecodedToken | null = null;
    
      if (storedToken) {
        try {
          decoded = jwtDecode<DecodedToken>(storedToken);
        } catch (error) {
          console.error("Failed to decode token:", error);
        }
      }
    
    
    const searchUser = useCallback(async () => {
    if (!decoded?.sub) return;
  
    try {
      const res = await getClient(decoded.sub);
      const client = res.data;
  
      setCode(client.usercode);
    } catch (error) {
      console.error("Failed to fetch client data:", error);
    }
  }, [decoded?.sub]);
  
    
  useEffect(() => {
    searchUser();
  }, [searchUser]);
    

  const [data, setData] = useState<OrderDetails>({} as OrderDetails);
  const [currentFacture, setCurrentFacture] = useState<Facture>({} as Facture);
  const [taux, setTaux] = useState<Taux>({} as Taux);
  const [agentSurcursal, setAgentSurcursal] = useState<number>(0);
  const [agentSurcursalData, setAgentSurcursalData] = useState<number>(0);

  const fetchAgentSurcursal = async (user:string) => {
    try {
      const response = await getAgentSurcursal(user);
      setAgentSurcursal(response.data.surcursal.ville.id);
      setAgentSurcursalData(response.data.surcursal.id);
    } catch (error) {
      console.error("Error fetching agent surcursal:", error);
    }
  };

  useEffect(() => {
    if (!code) return; // ⛔ tann code vini
    fetchAgentSurcursal(code);
  }, [code]);
  
    const fetchData = async (id:number) => {
      try {
        const response = await getTotalFacturesFromMyCity(id);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };
  
  const fetchFactureToday = async (id:number) => {
      try {
        const response = await getFactureTodayFromMyCity(id);
        setCurrentFacture(response.data);
      } catch (error) {
        console.error("Error fetching today's facture:", error);
      }
  };
  const fetchTaux = async () => {
    try {
      const response = await getTaux("Dollars US");
      setTaux(response.data);
    } catch (error) {
      console.error("Error fetching taux:", error);
    }
  };

  
  
  useEffect(() => {
      if (agentSurcursal !== 0 && agentSurcursalData !== 0) { 
      fetchData(agentSurcursal);
     fetchFactureToday(agentSurcursal);
     fetchTaux();
      const interval = setInterval(() => {
        fetchData(agentSurcursal);
        fetchFactureToday(agentSurcursalData);
        fetchTaux();
      }, 5000); // ⏱️ 5 secondes
        //nettoyage pour éviter memory leak
        return () => clearInterval(interval);
      }
    }, [agentSurcursal, agentSurcursalData]);

  const valor = data.subtotal
    ? (((currentFacture.amount || 0) * 100 || 0) / data.subtotal)
    : 0;
  const progress = Math.min(Math.max(valor, 0), 100);
  const objectif = data.subtotal || 0;
  const revenu = currentFacture.amount || 0;
  const restant = Math.max(objectif - revenu, 0);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-1 flex-col px-5 pb-6 pt-5 bg-white shadow-default rounded-2xl dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Objectif Quotidien
            </h3>
            <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
              Objectif que tu as fixé pour chaque jour.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-1 flex-col justify-center rounded-2xl bg-gray-50 p-5 dark:bg-white/[0.03]">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Progression du jour
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-800 dark:text-white/90">
                  {progress.toFixed(2)}%
                </span>
                <span className="text-sm font-medium text-success-600 dark:text-success-500">
                  atteint
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">Reste</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
                ${restant.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-6 h-4 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-success-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
            <span>$0.00</span>
            <span>${objectif.toFixed(2)}</span>
          </div>
        </div>
        <p className="mx-auto mt-4 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          Vous avez gagné {(currentFacture.amount|| 0).toFixed(2)}$ aujourd’hui. Continuez votre excellent travail !  
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Objectif
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            ${(data.subtotal || 0).toFixed(2)}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
                fill="#039855"
              />
            </svg>
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Revenu
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            ${(currentFacture.amount || 0).toFixed(2)}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
                fill="#039855"
              />
            </svg>
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Taux du jour
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {(taux?.sale || 0).toFixed(2)} HTG
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
                fill="#039855"
              />
            </svg>
          </p>
        </div>
      </div>
    </div>
  );
}
