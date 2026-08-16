"use client"
import Image, { StaticImageData } from "next/image"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import brand_1 from "@/assets/img/brand/fedex.png"
import brand_2 from "@/assets/img/brand/dhl.png"
import brand_3 from "@/assets/img/brand/brand_img03.png"
import brand_4 from "@/assets/img/brand/usps.png"
import brand_5 from "@/assets/img/brand/ups.png"
import brand_6 from "@/assets/img/brand/shippex.png"

interface BrandItem {
   image: StaticImageData;
   alt: string;
   href: string;
}

const brand_data: BrandItem[] = [
   {
      image: brand_1,
      alt: "FedEx",
      href: "https://www.fedex.com/",
   },
   {
      image: brand_2,
      alt: "DHL",
      href: "https://www.dhl.com/",
   },
   {
      image: brand_3,
      alt: "Truck Delivery",
      href: "https://www.google.com/",
   },
   {
      image: brand_4,
      alt: "USPS",
      href: "https://www.usps.com/",
   },
   {
      image: brand_5,
      alt: "UPS",
      href: "https://www.ups.com/",
   },
   {
      image: brand_6,
      alt: "Shippex",
      href: "https://shippex.com/",
   },
   {
      image: brand_4,
      alt: "USPS",
      href: "https://www.usps.com/",
   },
];

// const setting = {
//    slidesPerView: 6,
//    spaceBetween: 30,
//    observer: true,
//    observeParents: true,
//    loop: true,
//    breakpoints: {
//       '1200': {
//          slidesPerView: 6,
//       },
//       '992': {
//          slidesPerView: 5,
//       },
//       '768': {
//          slidesPerView: 4,
//       },
//       '576': {
//          slidesPerView: 3,
//       },
//       '0': {
//          slidesPerView: 2,
//       },
//    },
// }

const setting = {
  slidesPerView: 6,
  spaceBetween: 30,
  loop: true,
  observer: true,
  observeParents: true,

  autoplay: {
    delay: 1000,
    disableOnInteraction: false,
  },

  modules: [Autoplay],

  breakpoints: {
    1200: { slidesPerView: 6 },
    992: { slidesPerView: 5 },
    768: { slidesPerView: 4 },
    576: { slidesPerView: 3 },
    0: { slidesPerView: 2 },
  },
};


interface PropsType {
   style?: boolean;
}

const Brand = ({ style }: PropsType) => {
   return (
      <div className={`${style ? "brand__area-two" : "brand__area"}`}>
         <div className="container">
            <Swiper {...setting} className="brand-active fix">
               {brand_data.map((brand, i) => (
                  <SwiperSlide key={i}>
                     <div className="brand__item">
                        <a
                           href={brand.href}
                           target="_blank"
                           rel="noopener noreferrer"
                           title={`Ouvrir le site ${brand.alt}`}
                        >
                           <Image src={brand.image} alt={brand.alt} />
                        </a>
                     </div>
                  </SwiperSlide>
               ))}
            </Swiper>
         </div>
      </div>
   )
}

export default Brand
