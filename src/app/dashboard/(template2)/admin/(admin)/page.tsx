 import type { Metadata } from "next";
 import { EcommerceMetrics } from "@/private/components/ecommerce/EcommerceMetrics";
 import React from "react";
 import MonthlyTarget from "@/private/components/ecommerce/MonthlyTarget";
 import MonthlySalesChart from "@/private/components/ecommerce/MonthlySalesChart";
 import StatisticsChart from "@/private/components/ecommerce/StatisticsChart";
import CommandeTab from "@/private/components/ecommerce/CommandeTab";
import FactureTab from "@/private/components/ecommerce/FactureTab";
import RapportTab from "@/private/components/ecommerce/RapportTab";
import AdminDashboardInsights from "@/private/components/ecommerce/AdminDashboardInsights";

export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Tableau de bord Velog Xpress",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>
      <div className="col-span-12">
        <AdminDashboardInsights />
      </div>
      <div className="col-span-12">
        <StatisticsChart />
      </div>
      <div className="col-span-12">
        <CommandeTab/>
      </div>
     <div className="col-span-12">
        <FactureTab />
      </div>
      <div className="col-span-12">
        <RapportTab />
      </div>
    </div>
  );
}
