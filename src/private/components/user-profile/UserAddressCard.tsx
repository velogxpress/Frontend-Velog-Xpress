"use client";
import React from "react";
import { useState, useEffect } from "react";
import { getAddress } from "@/services/AddressService";
import { MapPin, PackageCheck } from "lucide-react";


interface Address {
  addressline: string;
  city: string;
  state: string;
  zipcode: string;
  phone: string;
}

export default function UserAddressCard() {
  const [address, setAddress] = useState<Address | null>(null);
    let value = 1;
    
    const fetchAddress = async () => {
        try {
          const response = await getAddress(value);
          setAddress(response.data as Address);
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      };
  
    useEffect(() => {
          fetchAddress();
    }, []);
  
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-white/[0.02] sm:flex-row sm:items-start sm:justify-between lg:p-6">
        <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"><PackageCheck className="h-5 w-5" /></span><div><h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">Mon adresse de livraison aux États-Unis</h4><p className="mt-1 max-w-3xl text-sm leading-6 text-gray-500 dark:text-gray-400">Utilisez exactement cette adresse comme <strong>Shipping Address</strong> sur Amazon, eBay, Temu et vos autres boutiques. Velog Xpress pourra ainsi identifier et recevoir vos colis.</p></div></div>
      </div>
      <div className="p-5 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:col-span-2">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Adresse
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {address?.addressline || "N/A"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Ville
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {address?.city || "N/A"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                State
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {address?.state || "N/A"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:col-span-2 lg:col-span-1">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Zip Code
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {address?.zipcode || "N/A"}
              </p>
            </div>
          </div><div className="mt-4 flex items-start gap-3 rounded-xl bg-brand-50 p-4 dark:bg-brand-500/10"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" /><p className="text-sm leading-6 text-gray-600 dark:text-gray-300">Vérifiez que votre <strong>code client</strong> apparaît dans les informations de votre commande en ligne. C’est ce code qui aide l’équipe à associer le colis à votre compte.</p></div>
        </div>
      </div>
      </div>
    </div>
  );
}
