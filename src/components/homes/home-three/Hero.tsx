import Image from "next/image"
import InjectableSvg from "@/components/common/InjectableSvg"

import banner_img from "@/assets/img/banner/h3_hero_img01.png"
import banner_img2 from "@/assets/img/banner/h3_hero_img02.png"
import banner_img3 from "@/assets/img/banner/h3_hero_img03.png"
import banner_shape1 from "@/assets/img/banner/h3_hero_shape01.png"
import banner_shape2 from "@/assets/img/banner/h3_hero_shape02.png"
import banner_shape3 from "@/assets/img/banner/h3_hero_shape03.png"

const Hero = () => {
   return (
     <section
       className="banner__area-two fix banner__bg-two"
       style={{ backgroundImage: `url(/assets/img/banner/h3_hero_bg.jpg)` }}
     >
       <div className="container">
         <div className="row gutter-20 justify-content-center">
           <div className="col-lg-6">
             <div className="banner__content-two">
               <h3 className="title" data-aos="fade-up" data-aos-delay="200">
                 {/* Air<Image src={banner_title} alt="" />  Logistics & Cargo */}
                 Air Cargo Shipping Pour Haiti
               </h3>
                <div
                 className="banner__btn "
                 data-aos="fade-up"
                 data-aos-delay="600"
               >
                 <a href="/dashboard/suivi" className="btn  border-btn m-2">
                   SUIVRE MON COLIS{" "}
                   <InjectableSvg
                     src="/assets/img/icon/right_arrow.svg"
                     alt=""
                     className="injectable"
                   />
                 </a>
               </div>
               <p data-aos="fade-up" data-aos-delay="400">
                 Velog Xpress, est une entreprise spécialisée dans le transport
                 de marchandises par voie aérienne, et maritime offrant des
                 solutions de fret rapide, fiable et sécurisée.
               </p>
               <div
                 className="banner__btn "
                 data-aos="fade-up"
                 data-aos-delay="600"
               >
                 <a href="/dashboard/signup" className="btn  border-btn m-2">
                   CREER UN COMPTE{" "}
                   <InjectableSvg
                     src="/assets/img/icon/right_arrow.svg"
                     alt=""
                     className="injectable"
                   />
                 </a>
                 <a href="/dashboard/signin" className="btn border-btn m-2">
                   SE CONNECTER{" "}
                   <InjectableSvg
                     src="/assets/img/icon/right_arrow.svg"
                     alt=""
                     className="injectable"
                   />
                 </a>
               </div>
             </div>
           </div>
           <div className="col-lg-6 col-md-10">
             <div className="banner__img-two">
               <Image
                 src={banner_img}
                 alt="img"
                 className="main-img hero-container-move"
                 data-aos="fade-up"
                 data-aos-delay="600"
               />
               <div className="shape">
                 <Image src={banner_shape1} alt="shape" className="hero-box-drop hero-box-drop-one" />
                 <Image src={banner_shape2} alt="shape" className="hero-box-drop hero-box-drop-two" />
                 <Image src={banner_shape3} alt="shape" className="hero-box-drop hero-box-drop-three" />
               </div>
             </div>
           </div>
         </div>
       </div>
       <div className="banner__shape-wrap-two">
         <Image
           src={banner_img2}
           alt="img"
           className="hero-plane-fly"
           data-aos="fade-up"
           data-aos-delay="1000"
         />
         <Image
           src={banner_img3}
           alt="img"
           className="hero-cargo-drift"
           data-aos="fade-left"
           data-aos-delay="800"
         />
       </div>
     </section>
   );
}

export default Hero
