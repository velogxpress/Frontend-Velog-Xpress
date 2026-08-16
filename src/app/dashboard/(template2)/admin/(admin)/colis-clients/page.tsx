import type { Metadata } from "next";
import ClientTab from "@/private/components/ecommerce/ClientTab";
import { PackageSearch } from "lucide-react";

export const metadata: Metadata = {
  title: "Colis clients | Velog Xpress",
  description: "Consultation globale des colis clients",
};

export default function ColisClientsPage() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0e2269] via-[#183b8f] to-[#2458b8] px-6 py-7 text-white shadow-lg shadow-brand-500/10 sm:px-8">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />
        <div className="relative flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
            <PackageSearch className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">Processus</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Colis globaux des clients</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
              Recherchez un colis par tracking ou code UPC, consultez son parcours et téléchargez le rapport client.
            </p>
          </div>
        </div>
      </section>
      <ClientTab />
    </div>
  );
}
