import Image from "next/image"
import shape from "@/assets/img/images/features_shape.png"

const FeaturesArea = () => {
   return (
     <section className="features__area section-pb-90">
       <div className="container">
         <div className="row justify-content-center gutter-24 about__content-two text-center mb-40">
           <div className="col-xl-8 col-lg-9">
             <span className="sub-title">Nos services</span>
             <h2 className="title mb-3" style={{ color: "rgb(14, 34, 105)" }}>
               Des solutions pensées pour vos colis
             </h2>
             <p className="info-one mb-0">
               Chez Velog Xpress, nous nous engageons à offrir une gamme
               complète de services de transport de fret et de logistique,
               adaptés aux besoins variés de nos clients.
             </p>
           </div>
         </div>
         <div className="row justify-content-center gutter-24">
           <div
             className="col-lg-4 col-md-6"
             data-aos="fade-up"
             data-aos-delay="400"
           >
             <div className="features__item">
               <div className="features__icon">
                 <i className="flaticon-air-freight"></i>
               </div>
               <div className="features__content">
                 <h2 className="title">Fret Aérien Express et Régulier.</h2>
                 <p>
                   Faites vos commandes sur Amazon, eBay, Temu, Shein, Alibaba,
                   etc.
                 </p>
                 <h2 className="number">01</h2>
               </div>
             </div>
           </div>
           <div
             className="col-lg-4 col-md-6"
             data-aos="fade-up"
             data-aos-delay="600"
           >
             <div className="features__item">
               <div className="features__icon">
                 <i className="flaticon-air-freight"></i>
               </div>
               <div className="features__content">
                 <h2 className="title">Fret de Marchandises Volumineuses.</h2>
                 <p>
                   Envoyez des colis volumineux à votre famille sans problème
                   partout en Haiti.
                 </p>
                 <h2 className="number">02</h2>
               </div>
             </div>
           </div>
           <div
             className="col-lg-4 col-md-6"
             data-aos="fade-up"
             data-aos-delay="800"
           >
             <div className="features__item">
               <div className="features__icon">
                 <i className="flaticon-ship"></i>
               </div>
               <div className="features__content">
                 <h2 className="title">Services de gestion douanière</h2>
                 <p>
                   Calcul des droits et taxes, et la garantie de la conformité à
                   toutes les lois et réglementations locales.
                 </p>
                 <h2 className="number">03</h2>
               </div>
             </div>
           </div>
         </div>
       </div>
       <div className="features__shape">
         <Image
           src={shape}
           alt="shape"
           data-aos="fade-left"
           data-aos-delay="400"
         />
       </div>
     </section>
   );
}

export default FeaturesArea
