"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import React, { useCallback, useMemo, useState ,useEffect} from "react";
import { SkeletonTableRows } from "../ui/skeleton/Skeleton";
import Select from "../form/Select";
import { listSurcursals } from "@/services/SurcursalService";
import { getlistOrders } from "@/services/OrderService";
import {getFactureSatistique,getFactureSatistiqueSurcursal,listFactureslimite} from "../../../services/FactureService";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface Region {
  id: number;
  description: string;
}

interface Ville {
  id: number;
  description: string;
  region: Region;
}

interface Surcursal {
  id: number;
  name: string;
  address: string;
  ville: Ville;
  phone: string;
  horaire: string;
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

const StatusBadge = (status:string) => {
if(status==="Due"){
    return(
      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
        {status}
      </span>
    )
  }else if(status==="Payé") {
    return(
      <span className="inline-flex items-center rounded-full bg-success-100 px-2.5 py-0.5 text-xs font-medium text-success-800">
        {status}
      </span>
    )
} else {
    return(
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
        {status}
      </span>
    )
  }
  }

type Option = { label: string; value: string };

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("fr-FR");

function formatMoney(value: number) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

export default function FactureTab() {
  const [surcursals, setSurcursals] = useState<Surcursal[]>([]);
  const [selectedSurcursalObj, setSelectedSurcursalObj] = useState<Surcursal | null>(null); 
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderObj, setSelectedOrderObj] = useState<Order | null>(null);
  const [factures, setFactures] = useState<Facture[]>([]);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchSurcursals = async () => {
      try {
        const response = await listSurcursals(0);
        setSurcursals(response.data.content);
      } catch (error) {
        console.error("Échec du chargement des surcursals:", error);
      }
    };
  
  const fetchOrders = async () => {
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
    };
 
  
    useEffect(() => {
      fetchSurcursals();
      fetchOrders();
    }, []);
  
  const surcursalOptions: Option[] = surcursals.map((surcursal) => ({
      label: surcursal.name+" - "+surcursal.address+", "+surcursal.ville.description,
      value: surcursal.id.toString(),
  }));
  
  function handleSelectChange(value: string): void {
      const surcursal = surcursals.find(
        (s) => s.id.toString() === value
      ) || null;
      setSelectedSurcursalObj(surcursal);
  }
  
 const orderOptions: Option[] = orders.map(r => ({
    label: r.shiporder+" | "+r.date+" | "+r.status,
    value: String(r.id),
  }));
  
function handleSelectOrderChange(value: number | string): void {
    const order = orders.find(
        (s) => s.id.toString() === value
      ) || null;
      setSelectedOrderObj(order);
}
  
const fetchFactures = useCallback(async () => {
    setIsLoading(true);
    try {
      let response;
      if (selectedSurcursalObj && selectedOrderObj) {
        console.log("Fetching with both filters:", selectedOrderObj.id, selectedSurcursalObj.id);
        response = await getFactureSatistiqueSurcursal(selectedOrderObj.id, selectedSurcursalObj.id, page);
        console.log("Response:", response.data.content);
      } else if (selectedOrderObj) {
        response = await getFactureSatistique(selectedOrderObj.id,page);
      } else {
        response = await listFactureslimite(page);
      }
  
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.content ?? [];
  
      setFactures(data);
      setTotalPages(response.data.totalPages || 0);
    } catch (e) {
      console.error(e);
      setFactures([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, selectedOrderObj, selectedSurcursalObj]);

  useEffect(() => {
    fetchFactures();
  }, [fetchFactures]);

  const chartData = useMemo(() => {
    return factures.map((facture, index) => ({
      label:
        facture?.surcursal?.surcursal?.ville?.description ||
        facture?.ship?.shiporder ||
        facture?.code ||
        `Facture ${index + 1}`,
      subtotal: Number(facture?.subtotal) || 0,
      amount: Number(facture?.amount) || 0,
      effectif: Number(facture?.effectif) || 0,
      balance: Number(facture?.balance) || 0,
    }));
  }, [factures]);

  const statusData = useMemo(() => {
    const map = new Map<string, number>();

    factures.forEach((facture) => {
      const status = facture?.status || "N/A";
      map.set(status, (map.get(status) || 0) + 1);
    });

    return Array.from(map.entries()).map(([status, total]) => ({ status, total }));
  }, [factures]);

  const totalAmount = useMemo(
    () => factures.reduce((sum, facture) => sum + (Number(facture?.amount) || 0), 0),
    [factures]
  );

  const factureChartOptions: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
      type: "bar",
    },
    colors: ["#465FFF", "#0BA5EC", "#12B76A", "#F04438"],
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: "end",
        columnWidth: "42%",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 3,
      colors: ["transparent"],
    },
    xaxis: {
      categories: chartData.map((item) => item.label),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        rotate: -20,
        trim: true,
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => formatMoney(value),
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    tooltip: {
      y: {
        formatter: (value) => formatMoney(value),
      },
    },
  };

  const factureChartSeries = [
    {
      name: "Sous-total",
      data: chartData.map((item) => Number(item.subtotal.toFixed(2))),
    },
    {
      name: "Montant",
      data: chartData.map((item) => Number(item.amount.toFixed(2))),
    },
    {
      name: "Effectif",
      data: chartData.map((item) => Number(item.effectif.toFixed(2))),
    },
    {
      name: "Balance",
      data: chartData.map((item) => Number(item.balance.toFixed(2))),
    },
  ];

  const statusChartOptions: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
    },
    labels: statusData.map((item) => item.status),
    colors: ["#12B76A", "#F04438", "#F79009", "#465FFF", "#667085"],
    dataLabels: { enabled: true },
    stroke: { width: 0 },
    legend: {
      position: "bottom",
      fontFamily: "Outfit",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "68%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Factures",
              formatter: (w) =>
                numberFormatter.format(
                  w.globals.seriesTotals.reduce((sum: number, value: number) => sum + value, 0)
                ),
            },
          },
        },
      },
    },
  };

  const statusChartSeries = statusData.map((item) => item.total);
  
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 shadow-theme-sm transition duration-200 hover:shadow-lg dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Controle des Factures
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Liste des factures générées par surcursales
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <div className="relative">
                    <Select
                      options={orderOptions}
                      placeholder="Sélectionnez une commande"
                      onChange={(value) =>handleSelectOrderChange(value)}
                      className="dark:bg-dark-900"
                    />
          </div>
          <div className="relative">
                    <Select
                      options={surcursalOptions}
                      placeholder="Selectionnez un surcursal"
                      onChange={handleSelectChange}
                      className="dark:bg-dark-900"
                    />
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <div className="flex items-center justify-end mt-4">
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
          <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Commande
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Surcursal
                    </TableCell>
                    <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Sous-Total
                    </TableCell>
                    <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Assurance
                    </TableCell>
                    <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Montant
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Rabais
                </TableCell>
                <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Effectif
                </TableCell>
                <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Balance
                </TableCell>
                <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {isLoading ? (
                  <SkeletonTableRows rows={5} columns={9} />
                ) : factures.map((facture,index) => (
                  <TableRow key={`${facture?.id}-${index}`}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {facture?.ship?.shiporder?? "N/A"}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {facture?.surcursal?.surcursal?.ville?.description ?? "N/A"}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {facture?.subtotal?.toFixed(2) ?? "0.00"} $US
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {facture?.assurance?.toFixed(2) ?? "0.00"} $US
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {facture?.amount?.toFixed(2) ?? "0.00"} $US
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {facture?.discount?.toFixed(2) ?? "0.00"} $US
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {facture?.effectif?.toFixed(2) ?? "0.00"} $US
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {facture?.balance?.toFixed(2) ?? "0.00"} $US
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {StatusBadge(facture?.status?? "N/A")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-5 dark:border-gray-800">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Graphique des factures affichées
            </h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Le graphique suit les mêmes filtres que la table.
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
            Total: {formatMoney(totalAmount)}
          </span>
        </div>

        {chartData.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800 xl:col-span-8">
              <div className="max-w-full overflow-x-auto custom-scrollbar">
                <div className="min-w-[760px] xl:min-w-full">
                  <ReactApexChart
                    options={factureChartOptions}
                    series={factureChartSeries}
                    type="bar"
                    height={320}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800 xl:col-span-4">
              <ReactApexChart
                options={statusChartOptions}
                series={statusChartSeries}
                type="donut"
                height={320}
              />
            </div>
          </div>
        ) : (
          <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
            Aucune facture à afficher dans le graphique.
          </div>
        )}
      </div>
    </div>
  );
}
