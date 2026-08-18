"use client";
import React, { useCallback, useMemo } from "react";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

import Select from "../form/Select";
import { useState, useEffect } from "react";
import { SkeletonChart } from "../ui/skeleton/Skeleton";
import { getlistOrders } from "../../../services/OrderService";
import { colisvilleGraphe } from "../../../services/OrderDetailsService";
import { amountvilleGraphe } from "../../../services/OrderDetailsService";

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
interface Client{
  id: number;
  name: string;
  address: string;
  phone: string;
  ville: Ville;
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

interface Category {
  id: number;
  description: string;
  part?: string;
}

interface Insurance {
  id: number;
  amount: number;
}

interface Specialfee {
  id: number;
  amount: number;
}

interface Feepounds {
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

type Option = { label: string; value: string };

const numberFormatter = new Intl.NumberFormat("fr-FR");
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

function formatNumber(value: number) {
  return numberFormatter.format(Number.isFinite(value) ? value : 0);
}

function formatCurrency(value: number) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

function getCityLabel(item: OrderDetails) {
  return (
    item?.citypoundfee?.city?.abreger?.trim() ||
    item?.citypoundfee?.city?.description?.trim() ||
    "N/A"
  );
}

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function StatisticsChart() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [data, setData] = useState<OrderDetails[]>([]);
  const [data2, setData2] = useState<OrderDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (orderID: number) => {
      try {
        const response = await colisvilleGraphe(orderID);
        setData(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
  }, []);
  
  const fetchData2 = useCallback(async (orderID: number) => {
      try {
        const response = await amountvilleGraphe(orderID);
        setData2(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await getlistOrders(0);

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.content ?? [];

      setOrders(data);

      const firstOrder = data[0];
      if (firstOrder) {
        fetchData(firstOrder.id);
        fetchData2(firstOrder.id);
      }
    } catch (e) {
      console.error(e);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, fetchData2]);
  
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const orderOptions: Option[] = orders.map(r => ({
    label: r.shiporder+" | "+r.date+" | "+r.status,
    value: String(r.id),
  }));
  
  function handleSelectOrderChange(value: number | string): void {
    const orderId = Number(value);
    fetchData(orderId);
    fetchData2(orderId);
  }
    
  const groupedData = useMemo(() => {
    const map = new Map<string, { colis: number; amount: number }>();

    data.forEach((item) => {
      const label = getCityLabel(item);
      const current = map.get(label) || { colis: 0, amount: 0 };
      current.colis += Number(item.upc) || Number(item.id) || 0;
      map.set(label, current);
    });

    data2.forEach((item) => {
      const label = getCityLabel(item);
      const current = map.get(label) || { colis: 0, amount: 0 };
      current.amount += Number(item.subtotal) || 0;
      map.set(label, current);
    });

    return Array.from(map.entries())
      .map(([ville, value]) => ({
        ville,
        colis: value.colis,
        amount: Number(value.amount.toFixed(2)),
      }))
      .filter((item) => item.colis > 0 || item.amount > 0)
      .sort((a, b) => b.colis - a.colis);
  }, [data, data2]);

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#12B76A"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        borderRadiusApplication: "end",
        columnWidth: "42%",
      },
    },
    stroke: {
      show: true,
      curve: "smooth",
      width: [0, 3],
    },
    markers: {
      size: 4,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Hide grid lines on x-axis
        },
      },
      yaxis: {
        lines: {
          show: true, // Show grid lines on y-axis
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: [
        {
          formatter: (value) => `${formatNumber(value)} colis`,
        },
        {
          formatter: (value) => formatCurrency(value),
        },
      ],
    },
    xaxis: {
      type: "category",
      categories: groupedData.map((item) => item.ville),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
      labels: {
        rotate: -25,
        trim: true,
      },
    },
    yaxis: [
      {
        seriesName: "Qte Colis",
        title: {
          text: "Colis",
        },
        labels: {
          formatter: (value) => formatNumber(value),
          style: {
            fontSize: "12px",
            colors: ["#6B7280"],
          },
        },
      },
      {
        seriesName: "Montant $US",
        opposite: true,
        title: {
          text: "Montant $US",
        },
        labels: {
          formatter: (value) => formatCurrency(value),
          style: {
            fontSize: "12px",
            colors: ["#6B7280"],
          },
        },
      },
    ],
  };

  const series = [
    {
      name: "Qte Colis",
      type: "column",
      data: groupedData.map((item) => item.colis),
    },
    {
      name: "Montant $US",
      type: "line",
      data: groupedData.map((item) => item.amount),
    },
  ];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 shadow-theme-sm transition duration-200 hover:shadow-lg dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Colis par ville
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Quantite de colis par ville pour la commande selectionee.
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

      {isLoading ? (
        <SkeletonChart className="h-[310px] w-full" />
      ) : (
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={310}
          />
        </div>
      </div>
      )}
    </div>
  );
}
