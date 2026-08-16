 import type { Metadata } from "next";
 import { EcommerceMetrics } from "@/private/components/ecommerce/EcommerceMetrics";
 import React from "react";
 import MonthlyTarget from "@/private/components/activites/MonthlyTarget";
 import MonthlySalesChart from "@/private/components/ecommerce/MonthlySalesChart";
 import StatisticsChart from "@/private/components/ecommerce/StatisticsChart";
 import CommandeTab from "@/private/components/activites/CommandeTab";




export const metadata: Metadata = {
  title: "Velog Xpress - Transport & Logistics",
  description: "Tableau de bord Velog Xpress - Reception des Commandes",
   icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function Activites() {
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
          <StatisticsChart />
        </div>
  
        <div className="col-span-12">
          <CommandeTab />
        </div>
  
      </div>
    );
}
