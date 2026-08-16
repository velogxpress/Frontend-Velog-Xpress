"use client";
import * as React from "react";
import Image from "next/image";

import Select from "../form/Select";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

import { getlistOrders} from "../../../services/OrderService";
import {createStorage,getStorage} from "../../../services/StorageService";
import { createStorageDetails } from "../../../services/StorageDetailsService";
import { searchsOrderDetails } from "@/services/OrderDetailsService";

interface Category {
  id: number;
  description: string;
  part?: string;
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

interface Specialfee {
  id: number;
  amount: number;
}

interface Feepounds {
  id: number;
  amount: number;
}

interface Ville {
  id: number;
  description: string;
  abreger: string;
  region: Region;
}

interface Region {
  id: number;
  description: string;
}

interface Insurance {
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
      douane: number,
      picture: string;
    }

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // page actuelle
  size: number; // taille de page
  first: boolean;
  last: boolean;
}

interface Storage {
  id: number;
  order: Order;
  container: string;
  description: string;
  airwaybill: string;
}

interface StorageDetails {
  id: number;
  storage: Storage;
  orderdetails: OrderDetails;
}

type Option = { label: string; value: string };

export default function PackColisForm() {
  const { isOpen, openModal, closeModal } = useModal();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderSelected, setOrderSelected] = useState<Order | null>(null);  
  const [shiporders, setShiporders] = useState<string | null>(null);
  const [isShowing, setIsShowing] = useState(false);
  const [orderDetailsData, setOrderDetailsData] = useState<OrderDetails[]>([]);


  const [colisCode, setColisCode] = useState<string>("");
  const colisCodeRef = useRef<HTMLInputElement>(null);
  const [codeTag, setCodeTag] = useState<string>("");
  const codeTagRef = useRef<HTMLInputElement>(null);


  const beepError = () => {
  // Son system / default beep (pa toujou menm sou tout browser)
  window.navigator.vibrate?.(80); // (opsyonèl, sou telefòn)
  const audio = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=");
  audio.play().catch(() => {});
};

  
  useEffect(() => {
      fetchOrders();
    }, []);
  
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
  
    const orderOptions: Option[] = orders.map(r => ({
      label: r.shiporder+" | "+r.date+" | "+r.status,
      value: String(r.id),
    }));

  function handleSelectOrderChange(value: number | string): void {
    const orderId = Number(value);
    setIsShowing(true);
    const selectedOrder = orders.find(order => order.id === orderId);
    setOrderSelected(selectedOrder || null);
    if (selectedOrder) {
      setShiporders(selectedOrder.shiporder);
    }
  }

 useEffect(() => {
  if (isShowing) {
    requestAnimationFrame(() => {
      colisCodeRef.current?.focus();
    });
  }
 }, [isShowing]);
  
 useEffect(() => {

  const processScan = async () => {

    if (!shiporders) return;
    if (!colisCode) return;

    // ❌ Si gen karaktè ki pa chif
    if (/[^0-9]/.test(colisCode)) {
      toast.error(
        "Vous avez scanné un code-barres invalide. Veuillez scanner un code-barres contenant uniquement des chiffres."
      );
      beepError();
      setColisCode("");
      return;
    }

    // ❌ Si li pa egzakteman 12 chif
    if (colisCode.length !== 12) {
      if (colisCode.length > 12) {
        toast.error("Code-barres invalide : il doit contenir exactement 12 chiffres.");
        beepError();
        setColisCode("");
      }
      return; // si li < 12 → tann scanner fini
    }

    try {
     const response = await searchsOrderDetails(shiporders, colisCode);

      if (!response || !response.data) {
        toast.error("Aucune donnée trouvée pour ce code.");
        beepError();
        setColisCode("");
        return;
      }

      // mete li nan state pou UI
      setOrderDetailsData(response.data);

      openModal();

    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la recherche.");
      beepError();
    }

  };

  processScan();

}, [colisCode, shiporders]);



  useEffect(() => {
    
    if (shiporders) {
      if (!isOpen) return;

      const t = setTimeout(() => {
        codeTagRef.current?.focus();
      }, 0);

      return () => clearTimeout(t);
    }
}, [isOpen]);

  useEffect(() => {
    const processTagScan = async () => {
      if (shiporders) {
        // ❌ Si gen karaktè ki pa chif
        if (/[^0-9]/.test(codeTag)) {
          toast.error(
            "Vous avez scanné un code-barres invalide. Veuillez scanner un code-barres contenant uniquement des chiffres."
          );
          beepError();
          setCodeTag("");
          return;
        }

        const isComplete = /^\d{13}$/.test(codeTag);

        if (!isComplete) return;
        const storage = await getStorage(codeTag);
        
        if (!storage.data) {
          const payload = {
            order: orderSelected || "",
            container: codeTag,
            description: "",
            airwaybill: "",
          };

          const response = await createStorage(payload);
          await handlePack(response.data); // ✅ pase li dirèkteman

        } else {
          await handlePack(storage.data); // ✅ menm bagay la
        }

        // ✅ fèmen modal la
        closeModal();

        // ✅ reset input (pou pwochen scan)
        setCodeTag("");
        setColisCode("");

        // (opsyonèl) refocus sou premye input la si ou vle
        requestAnimationFrame(() => {
          colisCodeRef.current?.focus();
        });
      }
    };

    processTagScan();
}, [codeTag]);

  const handlePack = async (storage: any) => {
  try {
    const playloadDetails = {
      storage: storage,
      orderdetails: orderDetailsData[0],
    };

    await createStorageDetails(playloadDetails);

    setCodeTag("");
    setColisCode("");
    colisCodeRef.current?.focus();
    closeModal();

  } catch (error) {
    toast.error("Erreur lors de l'emballage du colis.");
    beepError();
  }
};

  
  return (
    <>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3 justify-end">
        <div>
          <div className="relative m-2">
            <Select
              options={orderOptions}
              placeholder="Sélectionnez une commande"
              onChange={(value) =>handleSelectOrderChange(value)}
            />
          </div>
        </div>
        
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[300px]">
            <div className="flex flex-col items-center justify-center gap-6 px-4 mt-6 text-center">
             {isShowing && (
                <div className="flex flex-col items-center justify-center gap-6 px-4 mt-6 text-center">

                  <p className="text-sm text-gray-500 bg-green-100 p-2 rounded-md">
                    Commande sélectionnée : {shiporders}
                  </p>

                  <Image
                    src="/images/user/barcode.jpg"
                    alt="Pack Colis"
                    width={200}
                    height={200}
                  />

                  <div className="flex flex-col gap-4 w-full max-w-md">
                    <Label htmlFor="code" className="text-lg font-medium">
                      Scannez le code-barre du colis pour le packer
                    </Label>

                    <Input
                      id="code"
                      name="code"
                      type="text"
                      value={colisCode}
                      onChange={(e) => setColisCode(e.target.value)}
                      placeholder="Scannez le code du colis"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 mb-6"
                      ref={colisCodeRef}
                    />
                  </div>

                </div>   
              )}
            </div>

          </div>
        </div>
      </div>
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[650px] m-4">
        <div className="no-scrollbar relative w-full max-w-[650px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
             <div className="flex flex-col items-center justify-center gap-6 px-4 mt-6 text-center">

                  <p className="text-sm text-gray-500 bg-green-100 p-2 rounded-md">
                    Colis sélectionné : {colisCode}
                  </p>

                  <Image
                    src="/images/user/barcode.jpg"
                    alt="Pack Colis"
                    width={200}
                    height={200}
                  />

                  <div className="flex flex-col gap-4 w-full max-w-md">
                    <Label htmlFor="codetag" className="text-lg font-medium">
                      Scannez le code-barre du container tag pour le packer
                    </Label>

                    <Input
                      id="codetag"
                      name="codetag"
                      type="text"
                      value={codeTag}
                      onChange={(e) => setCodeTag(e.target.value)}
                      placeholder="Scannez le code du container tag"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 mb-6"
                      ref={codeTagRef}
                    />
                  </div>

                </div>   
          </div>
      </Modal>
    </>
  );
}
