/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Thumbs } from 'swiper/modules';
import { Swiper as SwiperClass } from 'swiper/types';
import InjectableSvg from "@/components/common/InjectableSvg";

// import author_1 from "@/assets/img/images/prosperite.svg"
// import author_2 from "@/assets/img/images/progres.svg"
// import author_3 from "@/assets/img/images/puissance.svg"
// import author_4 from "@/assets/img/images/reussite.svg"
import shape from "@/assets/img/images/testimonial_shape.png"

// const author_data: StaticImageData[] = [author_1, author_2, author_3, author_4];

interface DataType {
   id: number;
   title: string;
   designation: string;
   desc: JSX.Element;
}

const testi_data: DataType[] = [
   {
      id: 1,
      title: "La prospérité",
      designation: "Décision intérieure",
      desc: (<>“ La prospérité commence le jour où l’on décide d’avancer avec confiance, même par petits pas.”</>),
   },
   {
      id: 2,
      title: "Le progrès",
      designation: "Continuité quotidienne",
      desc: (<>“ Chaque progrès, même discret, construit les fondations d’un avenir plus riche et plus solide.”</>),
   },
   {
      id: 3,
      title: "La réussite",
      designation: "Vision et effort",
      desc: (<>“ La réussite n’est pas un hasard, mais le résultat d’une vision claire et d’efforts constants.”</>),
   },
   {
      id: 4,
      title: "La puissance",
      designation: "Détermination et opportunité",
      desc: (<>“ Là où la détermination rencontre l’opportunité, la prospérité devient inévitable.”</>),
   },
];

interface PropsType {
   style?: boolean;
}

const Testimonial = ({ style }: PropsType) => {

   const [isLoop, setIsLoop] = useState(false);
   useEffect(() => {
      setIsLoop(true);
   }, []);

   const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

   return (
      <section className={`${style ? "testimonial__area-two section-pt-130 section-pb-130" : "testimonial__area"}`}>
         <div className="container">
            <div className="row justify-content-center">
               <div className="col-xl-8 col-lg-10">
                  <div className="testimonial__wrap fix">
                     <div className={`testimonial__icon ${style ? "testimonial__icon-two" : ""}`}>
                        <InjectableSvg src="/assets/img/icon/quote.svg" alt="" className="injectable" />
                     </div>
                     <div className="testimonial-slider-dot">
                        <Swiper
                           onSwiper={setThumbsSwiper}
                           spaceBetween={0}
                           slidesPerView={4}
                           loop={true}
                           modules={[Thumbs, Navigation, Autoplay]}
                           className="testimonial__nav"
                        >
                           {/* {author_data.map((img, i) => (
                              <SwiperSlide key={i}>
                                 <button><Image src={img} alt="img" /></button>
                              </SwiperSlide>
                           ))} */}
                        </Swiper>
                     </div>
                     <Swiper
                        modules={[Thumbs, Navigation, Autoplay]}
                        thumbs={{ swiper: thumbsSwiper }}
                        spaceBetween={0}
                        loop={true}
                        navigation={{
                           nextEl: ".testimonial-button-next",
                           prevEl: ".testimonial-button-prev",
                        }}
                        className="testimonial-active"
                     >
                        {testi_data.map((item) => (
                           <SwiperSlide key={item.id} className="swiper-slide">
                              <div className="testimonial__item">
                                 <div className="testimonial__info">
                                    <h2 className="name">{item.title}</h2>
                                    <span>{item.designation}</span>
                                 </div>
                                 <div className="testimonial__rating">
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                 </div>
                                 <div className={`testimonial__content ${style ? "testimonial__content-two" : ""}`}>
                                    <p>{item.desc}</p>
                                 </div>
                              </div>
                           </SwiperSlide>
                        ))}
                        <div className="testimonial__nav-wrap">
                           <button className="testimonial-button-prev">
                              <i className="flaticon-left-arrow"></i>
                           </button>
                           <button className="testimonial-button-next">
                              <i className="flaticon-right-arrow"></i>
                           </button>
                        </div>
                     </Swiper>
                  </div>
               </div>
            </div>
            {!style && <div className="testimonial__shape">
               <Image src={shape} alt="img" />
            </div>}
         </div>
      </section>
   )
}

export default Testimonial
