"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon, BoxIconLine, GroupIcon } from "@/private/icons";

import { countOrders, countOrdersNow } from "@/services/OrderService";
import { useState, useEffect } from "react";
import { countClient } from "@/services/LoginService";



export const EcommerceMetrics = () => {
  const [orders, setOrders] = useState(0);
  const [ordersNow, setOrdersNow] = useState(0);
  const [clients, setClients] = useState(0);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const [ordersResponse, ordersNowResponse, clientsResponse] = await Promise.all([
          countOrders(),
          countOrdersNow(),
          countClient(),
        ]);

        setOrders(Number(ordersResponse.data) || 0);
        setOrdersNow(Number(ordersNowResponse.data) || 0);
        setClients(Number(clientsResponse.data) || 0);
      } catch (error) {
        console.error("Erreur lors du chargement des indicateurs:", error);
      }
    };

    loadMetrics();
  }, []);


  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-white to-blue-50 p-5 shadow-theme-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg dark:border-gray-800 dark:from-white/[0.04] dark:via-white/[0.02] dark:to-blue-500/[0.08] md:p-6">
        <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-blue-100/60 dark:bg-blue-500/5" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 ring-1 ring-blue-200/60 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20">
          <GroupIcon className="size-6" />
        </div>

        <div className="relative flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Clients enregistrés
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {clients}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            {new Date().getFullYear()}
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-white to-emerald-50 p-5 shadow-theme-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg dark:border-gray-800 dark:from-white/[0.04] dark:via-white/[0.02] dark:to-emerald-500/[0.08] md:p-6">
        <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-emerald-100/60 dark:bg-emerald-500/5" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 ring-1 ring-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
          <BoxIconLine />
        </div>
        <div className="relative flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Colis {new Date().getFullYear()}
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {ordersNow}
            </h4>
          </div>

          <Badge color="success">
            <ArrowUpIcon />
           {orders} Colis en {new Date().getFullYear()-1} 
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
