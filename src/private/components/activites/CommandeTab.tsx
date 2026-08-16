"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import React, { useCallback, useMemo } from "react";
import Select from "../form/Select";
import { useState, useEffect } from "react";
import { getlistOrders } from "../../../services/OrderService";
import { colisvilleGraphe } from "../../../services/OrderDetailsService";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface Region{
  id: number;
  description: string;
}

interface Ville{
  id: number;
  description: string;
  abreger: string;
  region: Region;
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

interface Feepounds {
  id: number;
  amount: number;
}

interface Insurance {
  id: number;
  amount: number;
}

interface Specialfee {
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

interface OrderDetails {
  id: number;
  ship: Order;
  citypoundfee: Cipinfee;
  upc: string;
  subtotal: number;
}

type Option = { label: string; value: string };

const numberFormatter = new Intl.NumberFormat("fr-FR");

function formatNumber(value: number) {
  return numberFormatter.format(Number.isFinite(value) ? value : 0);
}

function getCityLabel(item: OrderDetails) {
  return (
    item.citypoundfee?.city?.description?.trim() ||
    item.citypoundfee?.city?.abreger?.trim() ||
    "Ville non definie"
  );
}

export default function CommandeTab() {
  
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [qtycolis, setQtycolis] = useState<number | null>(0);
    const [qtypound, setQtypound] = useState<number | null>(0);
    const [expedition, setExpedition] = useState<string | null>("N/A");
    const [status, setStatus] = useState<string | null>("N/A");
    const [colisByCity, setColisByCity] = useState<OrderDetails[]>([]);
    const [chartLoading, setChartLoading] = useState(false);

    const fetchOrderChart = useCallback(async (orderId: number) => {
      try {
        setChartLoading(true);
        const colisResponse = await colisvilleGraphe(orderId);

        setColisByCity(Array.isArray(colisResponse.data) ? colisResponse.data : []);
      } catch (error) {
        console.error("Erreur lors du chargement du graphique commande:", error);
        setColisByCity([]);
      } finally {
        setChartLoading(false);
      }
    }, []);

    const fetchOrders = useCallback(async () => {
      try {
        const response = await getlistOrders(0);
  
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.content ?? [];
  
        setOrders(data);
      } catch (e) {
        console.error(e);
        setOrders([]);
      }
    }, []);

   useEffect(() => {
      fetchOrders();
    }, [fetchOrders]);
  
    const orderOptions: Option[] = orders.map(r => ({
      label: r.shiporder + " - " + r.status,
      value: String(r.id),
    }));
  
  
    const fetchOrderSelected = async (orderId: number) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) {
        console.warn("Order not found for id:", orderId);
        return;
      }
  
      setSelectedOrder(order);
      setQtycolis(order.colisQty);
      setQtypound(Number(order.poundQty.toFixed(2)));
      setExpedition(order.shipdate ?? "N/A");
      setStatus(order.status);
      fetchOrderChart(orderId);

    };
  
  function handleSelectOrderChange(value: number | string): void {
    const orderId = Number(value);
    fetchOrderSelected(orderId); // OK
  }

  const cityChartData = useMemo(() => {
    const map = new Map<string, number>();

    colisByCity.forEach((item) => {
      const label = getCityLabel(item);
      map.set(label, (map.get(label) || 0) + (Number(item.upc) || Number(item.id) || 0));
    });

    return Array.from(map.entries())
      .map(([city, colis]) => ({
        city,
        colis,
      }))
      .sort((a, b) => b.colis - a.colis);
  }, [colisByCity]);

  const commandChartOptions: ApexOptions = useMemo(() => ({
    chart: {
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
      type: "bar",
      animations: {
        enabled: false,
      },
    },
    colors: ["#465FFF"],
    plotOptions: {
      bar: {
        borderRadius: 5,
        borderRadiusApplication: "end",
        columnWidth: "45%",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: false,
    },
    xaxis: {
      categories: cityChartData.map((item) => item.city),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { trim: true, rotate: -25 },
    },
    yaxis: {
      title: { text: "Colis" },
      labels: { formatter: (value) => formatNumber(Number(value)) },
    },
    legend: { show: false },
    tooltip: {
      y: {
        formatter: (value) => `${formatNumber(Number(value))} colis`,
      },
    },
  }), [cityChartData]);

  const commandChartSeries = useMemo(() => [
    {
      name: "Quantite colis",
      data: cityChartData.map((item) => item.colis),
    },
  ], [cityChartData]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Controle Commande
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Information de la commande sélectionnée
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <div className="relative m-2">
            <Select
              options={orderOptions}
              placeholder="Sélectionnez une commande"
              onChange={(value) =>handleSelectOrderChange(value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Quantite de colis
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {qtycolis}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Quantite de Poids
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {qtypound} lbs
                </p>
                </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Date Expedition
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {expedition? expedition : "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Status de la commande
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {status? status : "N/A"}
                </p>
              </div>
              
            </div>
          </div>
        </div>
        {selectedOrder && (
          <div className="mt-6 border-t border-gray-100 pt-5 dark:border-gray-800">
            <div className="mb-4">
              <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                Detail de la commande {selectedOrder.shiporder}
              </h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Quantite de colis par ville.
              </p>
            </div>
            {chartLoading ? (
              <div className="flex min-h-[280px] items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                Chargement du graphique...
              </div>
            ) : cityChartData.length > 0 ? (
              <div className="min-w-[760px] xl:min-w-full">
                <ReactApexChart
                  options={commandChartOptions}
                  series={commandChartSeries}
                  type="bar"
                  height={330}
                />
              </div>
            ) : (
              <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                Aucune donnee trouvee pour cette commande.
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
