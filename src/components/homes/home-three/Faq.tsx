"use client";
import { useEffect, useState } from "react";
import Image from "next/image"
import shape from "@/assets/img/images/faq_shape.png"
import FaqForm from "@/components/form/FaqForm";


interface DataType {
   id: number;
   title: string;
   desc: JSX.Element;
   showAnswer: boolean;

}

const faq_data: DataType[] = [
  {
    id: 1,
    title: " Envoyer un colis avec Velog Xpress ",
    desc: (
      <>
        Bénéficiez de nos services en toute sécurité pour envoyer vos colis
        entre les Etats-Unis et partout en Haïti.
      </>
    ),
    showAnswer: true,
  },
  {
    id: 2,
    title: "Achat en ligne avec Velog Xpress",
    desc: (
      <>
        Utilisez notre service d&apos;achat en ligne pour acheter ce que vous voulez,
        et vos commandes vous seront livrées dans les plus brefs délais.
      </>
    ),
    showAnswer: false,
  },
  {
    id: 3,
    title: "Nos Adresses en Haïti",
    desc: (
      <>
        Nous avons répertorié toutes nos adresses aux États-Unis et en Haïti.
        Cela vous permettra de nous localiser facilement pour envoyer ou
        recevoir vos colis.
      </>
    ),
    showAnswer: false,
  },
  {
    id: 4,
    title: "Calculatrice de frais d'expédition",
    desc: (
      <>
        Trouvez une estimation avec notre calculateur en entrant la destination,
        la cétegorie et le poid de votre colis, en vous fournissant le montant
        réel.
      </>
    ),
    showAnswer: false,
  },
];



const Faq = () => {

   const [faqData, setFaqData] = useState<DataType[]>([]);

   

   useEffect(() => {
      setFaqData(faq_data);
   }, []);

   const toggleAnswer = (faqId: number) => {
      setFaqData((prevFaqData) =>
         prevFaqData.map((faq) =>
            faq.id === faqId
               ? { ...faq, showAnswer: !faq.showAnswer }
               : { ...faq, showAnswer: false }
         )
      );
   };

   

   return (
     <section className="faq__area-two section-py-140">
       <div className="container">
         <div className="row align-items-center">
           <div className="col-lg-6">
             <div className="faq__content">
               <div className="section__title white-title mb-30">
                 <span className="sub-title">FAQ Velog Xpress</span>
                 <h2 className="title">
                   Nous offrons les meilleurs services de messagerie, rapides et
                   fiables.
                 </h2>
               </div>
               <div className="faq__wrap-three">
                 <div className="accordion" id="accordionExample">
                   {faqData.map((item) => (
                     <div key={item.id} className="accordion-item">
                       <h2 className="accordion-header">
                         <button
                           className={`accordion-button ${
                             item.showAnswer ? "" : "collapsed"
                           }`}
                           type="button"
                           onClick={() => toggleAnswer(item.id)}
                         >
                           {item.title}
                         </button>
                       </h2>
                       <div
                         className={`accordion-collapse collapse ${
                           item.showAnswer ? "show" : ""
                         }`}
                       >
                         <div className="accordion-body">
                           <p>{item.desc}</p>
                           
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
           </div>
           <div className="col-lg-6">
             <div className="request__wrap-two">
               <h2 className="title">Calculateur</h2>
               {/* <div className="price_filter">
                        <div className="price_slider_amount">
                           <span>Estimation de prix</span>
                           <input type="text" id="amount" name="price" placeholder="" />
                        </div>
                        <div id="slider-range"></div>
                     </div> */}
               <FaqForm />
             </div>
           </div>
         </div>
       </div>
       <div className="faq__shape">
         <Image src={shape} alt="shape" />
       </div>
     </section>
   );
}

export default Faq
