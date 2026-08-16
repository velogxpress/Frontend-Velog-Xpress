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
import {getStorage,updateStorage} from "../../../services/StorageService";





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

type Option = { label: string; value: string };

function getAfterLastUnderscore(str: string): string {
  return str.substring(str.lastIndexOf('_') + 1);
}

export default function EmbarquementForm() {
  const { isOpen, openModal, closeModal } = useModal();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderSelected, setOrderSelected] = useState<Order | null>(null);  
  const [shiporders, setShiporders] = useState<string | null>(null);
  const [isShowing, setIsShowing] = useState(false);


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
    if (shiporders) {
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
      if (colisCode.length > 13) {
        toast.error("Code-barres invalide : il doit contenir exactement 13 chiffres.");
        beepError();
        setColisCode("");
        return;
      }

      // ✅ Si li gen egzakteman 12 chif → ouvri modal la
      if (colisCode.length === 13) {
        openModal();
        return;
      }
    }
  // Si li poko 12, pa fè anyen (ap tann scanner fini)
}, [colisCode, openModal]);



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
  if (!codeTag) return;

  // Chak fwa gen nouvo karaktè → reset timer la
  if (scanTimeoutRef.current) {
    clearTimeout(scanTimeoutRef.current);
  }

  // Nou tann scanner la fini tape
  scanTimeoutRef.current = setTimeout(() => {

    const validTag = /^\d+_OF_\d+_[A-Za-z0-9]+$/;

    if (!validTag.test(codeTag)) {
      toast.error("QR Code invalide. Format attendu : 1_OF_1_Box");
      beepError();
      setCodeTag("");
      return;
    }

    // ✅ Scanner fini pou vre la
    handlePack(colisCode, codeTag);

    closeModal();

    setCodeTag("");
    setColisCode("");

    setTimeout(() => {
      colisCodeRef.current?.focus();
    }, 80);

  }, 150); // ← DELAY KI ENPÒTAN (150ms–250ms ideyal)

}, [codeTag]);




const handlePack = async (tag: string, code: string) => {
  try {
    const storage = await getStorage(tag);

    if (storage.data) {
      const playloadDetails = {
        order: storage.data.order || "",
        container: tag,
        description: code,
        airwaybill: getAfterLastUnderscore(code),
      };
      const id = storage.data.id;
      //console.log("Storage trouvé pour le container:", storage.data);
      await updateStorage(id,playloadDetails);
      setCodeTag("");
      setColisCode("");
      colisCodeRef.current?.focus();
      closeModal();
    } 
  } catch (error) {
    console.error("Error packing tag:", tag, error);
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
                      Scannez le code-barre du container tag pour le packer
                    </Label>

                    <Input
                      id="code"
                      name="code"
                      type="text"
                      value={colisCode}
                      onChange={(e) => setColisCode(e.target.value)}
                      placeholder="Scannez le code du container tag"
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
                    src="/images/user/qrcode.avif"
                    alt="Pack Colis"
                    width={200}
                    height={200}
                  />

                  <div className="flex flex-col gap-4 w-full max-w-md">
                    <Label htmlFor="codetag" className="text-lg font-medium">
                      Scannez le code QR du airway bill pour embarquer
                    </Label>

                    <Input
                      id="codetag"
                      name="codetag"
                      type="text"
                      value={codeTag}
                      onChange={(e) => setCodeTag(e.target.value)}
                      placeholder="Scannez le code QR du airway bill"
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
