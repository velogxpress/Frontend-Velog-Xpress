"use client"
import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import service_img1 from "@/assets/img/services/services_img06.jpg"
import service_img2 from "@/assets/img/services/services_img01.jpg"
import service_img4 from "@/assets/img/services/services_img02.jpg"


const tab_img: StaticImageData[] = [service_img1, service_img2, service_img4]

interface DataType {
   id: number;
   title: string;
   icon: string;
}

const tab_title: DataType[] = [
  {
    id: 1,
    title: "Fret aérien express & régulier",
    icon: "flaticon-air-freight",
  },
  {
    id: 2,
    title: "Marchandises volumineuses",
    icon: "flaticon-ship",
  },

  {
    id: 3,
    title: "Services de gestion douanière",
    icon: "flaticon-truck",
  },
];


const Services = () => {

   const [activeTab, setActiveTab] = useState(0);

   const handleTabClick = (index: number) => {
      setActiveTab(index);
   };

   return (
     <section className="services__area-three section-py-140">
       <div className="container">
         <div className="row align-items-center">
           <div className="col-lg-7">
             <div className="section__title white-title mb-40">
               <span className="sub-title">Nos meilleurs services</span>
               <h3 className="title">
                 Meilleurs services de transport <br /> pour nos clients
               </h3>
             </div>
           </div>
           <div className="col-lg-5">
             <div className="section__content white-content mb-40">
               <p>
                 Chez Velog Xpress, nous nous engageons à offrir une gamme
                 complète de services de transport de fret et de logistique,
                 adaptés aux besoins variés de nos clients.
               </p>
             </div>
           </div>
         </div>
         <div className="row">
           <div className="col-lg-6">
             <div className="services__nav-wrap">
               <ul className="nav nav-tabs" id="myTab" role="tablist">
                 {tab_title.map((tab, index) => (
                   <li
                     key={index}
                     onClick={() => handleTabClick(index)}
                     className="nav-item"
                     role="presentation"
                   >
                     <button
                       className={`nav-link ${
                         activeTab === index ? "active" : ""
                       }`}
                          id="freight-tab"
                     >
                       <span className="left-content">
                         <i className={tab.icon}></i>
                         <span>{tab.title}</span>
                       </span>
                       <span className="arrow">
                         <i className="flaticon-right-up"></i>
                       </span>
                     </button>
                   </li>
                 ))}
               </ul>
             </div>
           </div>
           <div className="col-lg-6">
             <div className="services__tab-img">
               <div className="tab-content" id="myTabContent">
                 {tab_img.map((img, index) => (
                   <div
                     key={index}
                     className={`tab-pane fade ${
                       activeTab === index ? "show active" : ""
                     }`}
                     id="freight-tab-pane"
                   >
                     <div className="services__thumb-two">
                       <Link href="/services-details">
                         <Image src={img} alt="img" />
                       </Link>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           </div>
         </div>
       </div>
     </section>
   );
}

export default Services
