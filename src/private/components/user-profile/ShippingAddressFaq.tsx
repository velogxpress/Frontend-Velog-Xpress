"use client";

import { BadgeCheck, CircleHelp } from "lucide-react";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getClient } from "@/services/LoginService";

const addressRows = [
  ["Address Line 1", "5301 North Nob Hill Rd"],
  ["City", "Sunrise"],
  ["State", "Florida"],
  ["Zip Code", "33351"],
];

function AddressRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return <div className={`grid grid-cols-[110px_minmax(0,1fr)] gap-3 border-t px-4 py-3 text-sm first:border-t-0 dark:border-gray-800 ${highlight ? "bg-brand-50 dark:bg-brand-500/10" : "border-gray-100"}`}><span className="font-medium text-gray-500 dark:text-gray-400">{label}</span><span className={`break-words font-semibold ${highlight ? "text-brand-700 dark:text-brand-300" : "text-gray-800 dark:text-gray-200"}`}>{value || "Laissez vide"}</span></div>;
}

export default function ShippingAddressFaq() {
  const [clientName, setClientName] = useState("Client");
  const [clientCode, setClientCode] = useState("Votre code client");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<{ sub?: string }>(token);
      if (!decoded.sub) return;

      getClient(decoded.sub).then((response) => {
        const client = response.data;
        const code = String(client?.usercode ?? "").replace(/^VELOG XPRESS-/, "");
        setClientName(client?.name || "Client");
        setClientCode(code || "Votre code client");
      }).catch((error) => {
        console.error("Impossible de charger les informations du client:", error);
      });
    } catch (error) {
      console.error("Token client invalide:", error);
    }
  }, []);

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b border-gray-100 bg-gradient-to-r from-brand-50 to-blue-50 p-5 dark:border-gray-800 dark:from-brand-500/10 dark:to-blue-500/5 lg:p-6"><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white"><CircleHelp className="h-5 w-5" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">FAQ - Adresse d’achat</p><h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">Comment configurer mon adresse lorsque j’achète en ligne ?</h3><p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">Vous pouvez utiliser l’une des deux méthodes ci-dessous. Votre code identifiant doit obligatoirement apparaître dans le nom ou dans <strong>Address Line 2</strong>.</p></div></div></div>
      <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2 lg:p-6">
        <article className="overflow-hidden rounded-2xl border-2 border-brand-200 dark:border-brand-500/25"><div className="flex items-center gap-3 bg-brand-50 px-4 py-4 dark:bg-brand-500/10"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">1</span><div><h4 className="font-semibold text-gray-900 dark:text-white">Code à côté de votre nom</h4><p className="text-xs text-gray-500 dark:text-gray-400">Ajoutez le code identifiant après votre nom complet.</p></div></div><div className="divide-y divide-gray-100 dark:divide-gray-800"><AddressRow label="Name" value={`${clientName} ${clientCode}`} highlight /><AddressRow label="Address Line 1" value="5301 North Nob Hill Rd" /><AddressRow label="Address Line 2" value="" />{addressRows.slice(1).map(([label,value]) => <AddressRow key={label} label={label} value={value} />)}</div></article>
        <article className="overflow-hidden rounded-2xl border-2 border-emerald-200 dark:border-emerald-500/25"><div className="flex items-center gap-3 bg-emerald-50 px-4 py-4 dark:bg-emerald-500/10"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">2</span><div><h4 className="font-semibold text-gray-900 dark:text-white">Code nan Address Line 2</h4><p className="text-xs text-gray-500 dark:text-gray-400">Mete non an nòmal epi mete code la nan dezyèm liy adrès la.</p></div></div><div className="divide-y divide-gray-100 dark:divide-gray-800"><AddressRow label="Name" value={clientName} /><AddressRow label="Address Line 1" value="5301 North Nob Hill Rd" /><AddressRow label="Address Line 2" value={clientCode} highlight />{addressRows.slice(1).map(([label,value]) => <AddressRow key={label} label={label} value={value} />)}</div></article>
      </div>
      <div className="mx-5 mb-5 flex items-start gap-3 rounded-xl bg-amber-50 p-4 dark:bg-amber-500/10 lg:mx-6 lg:mb-6"><BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" /><p className="text-sm leading-6 text-amber-900 dark:text-amber-200"><strong>Enpòtan:</strong> Pa itilize toude metòd yo ansanm. Chwazi youn sèlman epi verifye code <strong>{clientCode}</strong> la ekri san erè anvan ou valide acha a.</p></div>
    </section>
  );
}
