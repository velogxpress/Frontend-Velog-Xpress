"use client";
import * as React from "react";
import Image from "next/image";

import Label from "../form/Label";
import Input from "../form/input/InputField";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { createStore } from "../../../services/StoreService"; 
import { getTags } from "../../../services/TagService";
import { trackmyOrderDetails } from "@/services/OrderDetailsService";


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

interface Tag {
  id: number;
  description: string;
  qrcode: string;
}
    
interface Store {
  id: number;
  orderdetails: OrderDetails;
  tag: Tag;
  status: string;
}

function getAfterLastUnderscore(str: string): string {
  return str.substring(str.lastIndexOf('_') + 1);
}

export default function EmbarquementForm() {
  const { isOpen, openModal, closeModal } = useModal(); 
  const [orderDetailsData, setOrderDetailsData] = useState<OrderDetails | null>(null);

  const [colisCode, setColisCode] = useState<string>("");
  const colisCodeRef = useRef<HTMLInputElement>(null);
  const [codeTag, setCodeTag] = useState<string>("");
  const codeTagRef = useRef<HTMLInputElement>(null);

  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  const beepError = () => {
  // Son system / default beep (pa toujou menm sou tout browser)
  window.navigator.vibrate?.(80); // (opsyonèl, sou telefòn)
  const audio = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=");
  audio.play().catch(() => {});
};

  
  
  

 useEffect(() => {
 
    requestAnimationFrame(() => {
      colisCodeRef.current?.focus();
    });
  
 }, []);
  
  useEffect(() => {

    const processScan = async () => {

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

      // ❌ Si li depase 12 chif
      if (colisCode.length > 12) {
        toast.error("Code-barres invalide : il doit contenir exactement 13 chiffres.");
        beepError();
        setColisCode("");
        return;
      }

      // ✅ Si li gen egzakteman 12 chif → ouvri modal la
      if (colisCode.length === 12) {
        try {
          const response = await trackmyOrderDetails(colisCode);
      
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
      }
    };

    processScan();

}, [colisCode, openModal]);



  useEffect(() => {

      if (!isOpen) return;

      const t = setTimeout(() => {
        codeTagRef.current?.focus();
      }, 0);

      return () => clearTimeout(t);
    
}, [isOpen]);

 useEffect(() => {
  if (!codeTag) return;

  if (scanTimeoutRef.current) {
    clearTimeout(scanTimeoutRef.current);
  }

  scanTimeoutRef.current = setTimeout(async () => {  // ✅ make li async

    const validTag = /^[A-Za-z]{3}\d{7}$/;

    if (!validTag.test(codeTag)) {
      toast.error("QR Code invalide. Format attendu : TVX1572049");
      beepError();
      setCodeTag("");
      return;
    }

    try {
      const res = await getTags(codeTag); // ✅ await mache kounye a

      if (!res || !res.data) {
        toast.error("Aucune donnée trouvée pour ce code QR.");
        beepError();
        setCodeTag("");
        return;
      }

      if (orderDetailsData) {
        await handlePack(orderDetailsData, res.data);
      }

      closeModal();

      setCodeTag("");
      setColisCode("");

      setTimeout(() => {
        colisCodeRef.current?.focus();
      }, 80);

    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la recherche du tag.");
      beepError();
      setCodeTag("");
    }

  }, 150);

}, [codeTag]);



const handlePack = async (tag: OrderDetails, code: Tag) => {
  try {
  
       const playloadStore = {
         orderdetails: tag,
         tag: code,
         status: "STOCKED"
       };
       await createStore(playloadStore);
       setCodeTag("");
       setColisCode("");
       colisCodeRef.current?.focus();
       closeModal();
    
  } catch (error) {
    console.error("Error packing tag:", tag, error);
  }
};

  
  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[300px]">
            <div className="flex flex-col items-center justify-center gap-6 px-4 mt-6 text-center">
                <div className="flex flex-col items-center justify-center gap-6 px-4 mt-6 text-center">

                  <Image
                    src="/images/user/barcode.jpg"
                    alt="Pack Colis"
                    width={200}
                    height={200}
                  />

                  <div className="flex flex-col gap-4 w-full max-w-md">
                    <Label htmlFor="code" className="text-lg font-medium">
                      Scannez le code-barre du colis pour le stocker
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
                    src="/images/user/qrcode.avif"
                    alt="Pack Colis"
                    width={200}
                    height={200}
                  />

                  <div className="flex flex-col gap-4 w-full max-w-md">
                    <Label htmlFor="codetag" className="text-lg font-medium">
                      Scannez le code QR du BIN
                    </Label>

                    <Input
                      id="codetag"
                      name="codetag"
                      type="text"
                      value={codeTag}
                      onChange={(e) => setCodeTag(e.target.value)}
                      placeholder="Scannez le code QR du BIN"
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
