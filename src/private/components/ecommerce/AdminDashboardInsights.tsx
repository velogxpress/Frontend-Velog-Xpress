"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { BarChart3, CircleDollarSign, PackageCheck, ReceiptText } from "lucide-react";
import { getDashboardOrders } from "@/services/OrderService";
import { listOrderDetailsDashboard } from "@/services/OrderDetailsService";
import { listFacturesDashboard } from "@/services/FactureService";

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
  abreger: string;
  region?: Region;
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

interface CityPoundFee {
  city?: Ville;
}

interface OrderDetails {
  id: number;
  ship?: Order;
  citypoundfee?: CityPoundFee;
  pounds: number;
  subtotal: number;
  status: string;
  condition: string | null;
}

interface Facture {
  id: number;
  code: string;
  date: string;
  amount: number;
  discount: number;
  balance?: number;
  status: string;
}

type GroupedValue = {
  label: string;
  value: number;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("fr-FR");

function getContent<T>(payload: T[] | { content?: T[] } | null | undefined): T[] {
  if (Array.isArray(payload)) return payload;
  return Array.isArray(payload?.content) ? payload.content : [];
}

function formatMoney(value: number) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

function getMonthLabel(dateValue: string | null | undefined) {
  const date = dateValue ? new Date(dateValue) : null;
  if (!date || Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("fr-FR", {
    month: "short",
    year: "2-digit",
  });
}

function groupByLabel<T>(
  items: T[],
  getLabel: (item: T) => string | null | undefined,
  getValue: (item: T) => number = () => 1
) {
  const map = new Map<string, number>();

  items.forEach((item) => {
    const label = getLabel(item)?.trim();
    if (!label) return;
    map.set(label, (map.get(label) || 0) + getValue(item));
  });

  return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
}

function takeTop(items: GroupedValue[], limit: number) {
  return [...items].sort((a, b) => b.value - a.value).slice(0, limit);
}

export default function AdminDashboardInsights() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [details, setDetails] = useState<OrderDetails[]>([]);
  const [factures, setFactures] = useState<Facture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [ordersResponse, detailsResponse, facturesResponse] = await Promise.all([
          getDashboardOrders(),
          listOrderDetailsDashboard(),
          listFacturesDashboard(),
        ]);

        setOrders(getContent<Order>(ordersResponse.data));
        setDetails(getContent<OrderDetails>(detailsResponse.data));
        setFactures(getContent<Facture>(facturesResponse.data));
      } catch (error) {
        console.error("Erreur lors du chargement des graphiques dashboard:", error);
        setOrders([]);
        setDetails([]);
        setFactures([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const orderMonthlyData = useMemo(() => {
    const map = new Map<string, { colis: number; revenu: number }>();

    orders.forEach((order) => {
      const label = getMonthLabel(order.date);
      const current = map.get(label) || { colis: 0, revenu: 0 };
      current.colis += Number(order.colisQty) || 0;
      current.revenu += Number(order.amount) || 0;
      map.set(label, current);
    });

    return Array.from(map.entries()).reverse().slice(-8);
  }, [orders]);

  const recentOrdersRevenue = useMemo(
    () =>
      orders.slice(0, 8).map((order) => ({
        label: order.shiporder || `CMD-${order.id}`,
        value: Number(order.amount) || 0,
      })),
    [orders]
  );

  const colisByStatus = useMemo(
    () => takeTop(groupByLabel(details, (item) => item.status || "Sans statut"), 6),
    [details]
  );

  const colisByCity = useMemo(
    () =>
      takeTop(
        groupByLabel(
          details,
          (item) =>
            item.citypoundfee?.city?.description ||
            item.citypoundfee?.city?.abreger ||
            "Ville non definie"
        ),
        8
      ),
    [details]
  );

  const factureStatus = useMemo(
    () => takeTop(groupByLabel(factures, (item) => item.status || "Sans statut"), 6),
    [factures]
  );

  const totals = useMemo(() => {
    const orderAmount = orders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
    const factureAmount = factures.reduce(
      (sum, facture) =>
        sum + Math.max((Number(facture.amount) || 0) - (Number(facture.discount) || 0), 0),
      0
    );
    const factureBalance = factures.reduce(
      (sum, facture) => sum + (Number(facture.balance) || 0),
      0
    );
    const pounds = details.reduce((sum, item) => sum + (Number(item.pounds) || 0), 0);

    return {
      orders: orders.length,
      details: details.length,
      orderAmount,
      factureAmount,
      factureBalance,
      pounds,
    };
  }, [details, factures, orders]);

  const monthlyOptions: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
      type: "area",
    },
    colors: ["#465FFF", "#12B76A"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.28, opacityTo: 0 },
    },
    xaxis: {
      categories: orderMonthlyData.map(([label]) => label),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { formatter: (value) => numberFormatter.format(value) } },
    legend: { position: "top", horizontalAlign: "left", fontFamily: "Outfit" },
    tooltip: {
      y: {
        formatter: (value, opts) =>
          opts.seriesIndex === 1 ? formatMoney(value) : `${numberFormatter.format(value)} colis`,
      },
    },
  };

  const revenueOptions: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
      type: "bar",
    },
    colors: ["#F79009"],
    plotOptions: {
      bar: {
        borderRadius: 5,
        borderRadiusApplication: "end",
        columnWidth: "42%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: recentOrdersRevenue.map((item) => item.label),
      labels: { rotate: -35, trim: true },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { formatter: (value) => formatMoney(value) } },
    tooltip: { y: { formatter: (value) => formatMoney(value) } },
  };

  const donutOptions = (labels: string[], colors: string[]): ApexOptions => ({
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
    },
    labels,
    colors,
    legend: {
      position: "bottom",
      fontFamily: "Outfit",
    },
    dataLabels: { enabled: true },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: "68%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: (w) =>
                numberFormatter.format(
                  w.globals.seriesTotals.reduce((sum: number, value: number) => sum + value, 0)
                ),
            },
          },
        },
      },
    },
  });

  const cityOptions: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
      type: "bar",
    },
    colors: ["#0BA5EC"],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: colisByCity.map((item) => item.label),
      labels: { formatter: (value) => numberFormatter.format(Number(value)) },
    },
    tooltip: { y: { formatter: (value) => `${numberFormatter.format(value)} colis` } },
  };

  const monthlySeries = [
    {
      name: "Colis",
      data: orderMonthlyData.map(([, value]) => Number(value.colis.toFixed(2))),
    },
    {
      name: "Revenu",
      data: orderMonthlyData.map(([, value]) => Number(value.revenu.toFixed(2))),
    },
  ];

  const statusSeries = colisByStatus.map((item) => item.value);
  const factureSeries = factureStatus.map((item) => item.value);
  const citySeries = [{ name: "Colis", data: colisByCity.map((item) => item.value) }];
  const revenueSeries = [
    { name: "Montant", data: recentOrdersRevenue.map((item) => Number(item.value.toFixed(2))) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Commandes analysees"
          value={numberFormatter.format(totals.orders)}
          helper={`${numberFormatter.format(totals.details)} colis suivis`}
          icon={<BarChart3 className="size-5" />}
        />
        <StatCard
          title="Revenu commandes"
          value={formatMoney(totals.orderAmount)}
          helper={`${numberFormatter.format(Number(totals.pounds.toFixed(2)))} lbs`}
          icon={<CircleDollarSign className="size-5" />}
        />
        <StatCard
          title="Factures nettes"
          value={formatMoney(totals.factureAmount)}
          helper="Montant apres rabais"
          icon={<ReceiptText className="size-5" />}
        />
        <StatCard
          title="Balance facture"
          value={formatMoney(totals.factureBalance)}
          helper={loading ? "Chargement..." : "Reste a encaisser"}
          icon={<PackageCheck className="size-5" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <ChartPanel
          className="xl:col-span-8"
          title="Evolution commandes et revenus"
          description="Vue mensuelle basee sur les commandes recentes."
        >
          <ReactApexChart options={monthlyOptions} series={monthlySeries} type="area" height={320} />
        </ChartPanel>

        <ChartPanel
          className="xl:col-span-4"
          title="Etat des colis"
          description="Repartition des statuts des colis."
        >
          <ReactApexChart
            options={donutOptions(
              colisByStatus.map((item) => item.label),
              ["#465FFF", "#12B76A", "#F79009", "#F04438", "#7A5AF8", "#0BA5EC"]
            )}
            series={statusSeries}
            type="donut"
            height={320}
          />
        </ChartPanel>

        <ChartPanel
          className="xl:col-span-8"
          title="Top villes par colis"
          description="Les destinations les plus presentes dans les donnees chargees."
        >
          <ReactApexChart options={cityOptions} series={citySeries} type="bar" height={320} />
        </ChartPanel>

        <ChartPanel
          className="xl:col-span-4"
          title="Statut factures"
          description="Payees, dues et autres statuts."
        >
          <ReactApexChart
            options={donutOptions(
              factureStatus.map((item) => item.label),
              ["#12B76A", "#F04438", "#F79009", "#465FFF", "#667085", "#7A5AF8"]
            )}
            series={factureSeries}
            type="donut"
            height={300}
          />
        </ChartPanel>

        <ChartPanel
          className="xl:col-span-12"
          title="Revenu par commande"
          description="Dernieres commandes avec leurs montants."
        >
          <ReactApexChart options={revenueOptions} series={revenueSeries} type="bar" height={320} />
        </ChartPanel>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  helper,
  icon,
}: {
  title: string;
  value: string;
  helper: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-sm transition duration-200 hover:shadow-lg dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-white/90">
        {icon}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <h3 className="mt-2 text-xl font-semibold text-gray-800 dark:text-white/90">{value}</h3>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helper}</p>
    </div>
  );
}

function ChartPanel({
  title,
  description,
  className = "",
  children,
}: {
  title: string;
  description: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 shadow-theme-sm transition duration-200 hover:shadow-lg dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{title}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <div className="max-w-full overflow-x-auto custom-scrollbar">{children}</div>
    </div>
  );
}
