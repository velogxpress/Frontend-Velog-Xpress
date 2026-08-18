"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useState,useEffect,useMemo } from "react";
import { SkeletonChart } from "../ui/skeleton/Skeleton";
import { countClientCity } from "@/services/RegisterService";


// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(
  () => import("react-apexcharts").then((mod) => mod.default),
  {
    ssr: false,
  }
);

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

const numberFormatter = new Intl.NumberFormat("fr-FR");

export default function MonthlySalesChart() {

  const [data, setData] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await countClientCity();
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }
  };

  useEffect(() => {
    fetchData().finally(() => setIsLoading(false));
    const interval = setInterval(() => {
      fetchData();
    }, 5000); // ⏱️ 5 secondes
      // nettoyage pour éviter memory leak
      return () => clearInterval(interval);
  }, []);
  
  const groupedData = useMemo(() => {
    const safeData = Array.isArray(data) ? data : [];
    return safeData
      .map((item) => ({
        abreger:
          item?.ville?.abreger?.trim() ||
          item?.ville?.description?.trim() ||
          "N/A",
        total: Number(item?.id) || 0,
      }))
      .filter((item) => item.total > 0)
      .sort((a, b) => b.total - a.total);
    
  }, [data]);

  const chartData = useMemo(() => groupedData.slice(0, 8), [groupedData]);
  const maxTotal = chartData[0]?.total || 0;
  const hasMoreCities = groupedData.length > chartData.length;

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        speed: 500,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "50%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (value) => `${numberFormatter.format(Number(value))}`,
      style: {
        fontSize: "12px",
        fontWeight: 700,
        colors: ["#FFFFFF"],
      },
      dropShadow: {
        enabled: false,
      },
    },
    stroke: {
      show: false,
    },
    xaxis: {
      categories: chartData.map((item) => item.abreger),
      max: maxTotal > 0 ? Math.ceil(maxTotal * 1.15) : undefined,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        formatter: (value) => numberFormatter.format(Number(value)),
        style: {
          colors: "#667085",
          fontSize: "12px",
        },
      },
    },
    legend: {
      show: false,
    },
    yaxis: {
      title: {
        text: undefined,
      },
      labels: {
        style: {
          colors: "#344054",
          fontSize: "12px",
          fontWeight: 600,
        },
      },
    },
    grid: {
      borderColor: "#EAECF0",
      yaxis: {
        lines: {
          show: false,
        },
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.1,
        gradientToColors: ["#0BA5EC"],
        opacityFrom: 0.95,
        opacityTo: 0.95,
        stops: [0, 100],
      },
    },

    tooltip: {
      theme: "light",
      x: {
        show: true,
      },
      y: {
        formatter: (val: number) => `${numberFormatter.format(val)} client(s)`,
      },
    },
  };
  
  const series = [
    {
      name: "Clients",
      data: chartData.map((item) => item.total),
    },
  ];
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 shadow-theme-sm transition duration-200 hover:shadow-lg dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Clients par ville
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Classement des villes selon le nombre de clients.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
          Top {numberFormatter.format(chartData.length)}{hasMoreCities ? ` / ${numberFormatter.format(groupedData.length)}` : ""}
        </span>
      </div>

      {isLoading ? (
        <SkeletonChart className="h-[250px] w-full" />
      ) : (
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[650px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={250}
          />
        </div>
      </div>
      )}
    </div>
  );
}
