"use client";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import {SearchIcon,} from "../../icons";
import { useState, useEffect } from "react";
import { SkeletonTableRows } from "../ui/skeleton/Skeleton";
import { getlistOrders} from "../../../services/OrderService";
import { listStorageDetails,getStorageDetails,findStorageDetails } from "../../../services/StorageDetailsService";
import Label from "../form/Label";



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

  interface Storage {
    id: number;
    container: string;
    order: Order;
    description: string;
    airwaybill: string;
  }

  interface StorageDetails {
    id: number;
    storage: Storage;
    orderdetails: OrderDetails;
  }
type Option = { label: string; value: string };

function formatColis(value: string): string {
  const parts = value.split('_');

  const number = parts[2]; // nimewo ki apre OF
  const type = parts[3];   // dènye string lan

  return `${number} ${type}`;
}

function getAfterLastUnderscore(str: string): string {
  return str.substring(str.lastIndexOf('_') + 1);
}

export default function PackingForm() {
  const [recherche, setRecherche] = useState("");

  const [details, setDetails] = useState<StorageDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<StorageDetails[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderSelected, setOrderSelected] = useState<Order | null>(null);  
  const [shiporders, setShiporders] = useState<string | null>(null);

  
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
  
   React.useEffect(() => {
    fetchOrders();
   }, []);
  
  const fetchContainerDetails=(order:string) => {
    findStorageDetails(order)
      .then((response) => {
        console.log("Container Details Response:", response.data);
        setSelectedDetail(response.data);
      })
      .catch((error) => {
        console.error("Error fetching storage details:", error);
      }); 
  }
  
    function handleSelectOrderChange(value: number | string): void {
      const orderId = Number(value);
      const selectedOrder = orders.find(order => order.id === orderId);
      setOrderSelected(selectedOrder || null);
      if (selectedOrder) {
        setShiporders(selectedOrder.shiporder);
        fetchContainerDetails(selectedOrder.shiporder);
      }
    }
  
  

  const fetchStorage=async(order:string)=>{
    setIsLoading(true);
    try {
      const response = await listStorageDetails(order);
      setDetails(response.data);
    } catch (error) {
      console.error("Error fetching storage details:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (shiporders) {
      fetchStorage(shiporders || "");
      fetchContainerDetails(shiporders || "");
    }
   
  }, [shiporders]);

  function handleKeyUp(): void {
    if (!recherche) {
      fetchStorage(shiporders || "");
    } else {
      getStorageDetails(shiporders || "", recherche.trim())
        .then((response) => {
          setDetails(response.data);
        })
        .catch((error) => {
          console.error("Error searching storage details:", error);
        });
    }
  }

  return (
    <>
    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 justify-end">
        <div className="relative m-2">
          <Label htmlFor="order-select" className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Sélectionnez une commande pour voir les détails d'embarquement
          </Label>
            <Select
              options={orderOptions}
              placeholder="Sélectionnez une commande"
              onChange={(value) =>handleSelectOrderChange(value)}
            />
          </div>
    </div>
      {/* Second Row */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Information des containers en embarquement
            </h4>

         {selectedDetail.map((details, index) => (
            <div key={index} className="grid grid-cols-1 gap-4 lg:grid-cols-6 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Container
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {details?.storage?.container?details.storage.container:"N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Quantite colis
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {details?.orderdetails?.id?details.orderdetails.id:"0"} colis
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Commande
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {details?.storage?.order?.shiporder?details.storage.order.shiporder:"N/A"}
                </p>
             </div>
             <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Date
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {details?.storage?.order?.date?details.storage.order.date:"N/A"}
                </p>
             </div>
             
             <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Quantite container
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {details?.storage?.description?formatColis(details.storage.description):"N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Airway bill
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {details?.storage?.airwaybill?getAfterLastUnderscore(details.storage.airwaybill):"N/A"}
                </p>
              </div>
              
            </div>
         ))}

          </div>
        </div>
      </div>
      {/* End of Second Row */}

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3 justify-end">
        <div>
          <div className="relative m-2">
            <Input
              placeholder="Rechercher vos colis..."
              type="text"
              className="pl-15"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              onKeyUp={() => handleKeyUp()}
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400 ">
              <SearchIcon className="w-6 h-6 text-gray-500" />
            </span>
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Container
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Client
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Telephone
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Category
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Poids
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Destination
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Commande
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Embarquement
                  </TableCell>

                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {isLoading ? (
                  <SkeletonTableRows rows={5} columns={8} />
                ) : details.map((detail) => (
                  <TableRow key={detail?.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {detail?.storage?.container?detail.storage.container:"N/A"}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {detail?.orderdetails?.rec_name?detail.orderdetails.rec_name:"N/A"}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {detail?.orderdetails?.rec_phone?detail.orderdetails.rec_phone:"N/A"}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {detail?.orderdetails?.category?.description?detail.orderdetails.category.description:"N/A"}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {detail?.orderdetails?.pounds?detail.orderdetails.pounds:"0"} lbs
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {detail?.orderdetails?.citypoundfee?.city?.description?detail.orderdetails.citypoundfee.city.description:"N/A"}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {detail?.storage?.order?.shiporder?detail.storage.order.shiporder:"N/A"}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      {detail?.storage?.description?detail.storage.description:"N/A"}
                    </TableCell>
                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
       
    </>
  );
}
