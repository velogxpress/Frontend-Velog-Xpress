"use client";
import Link from "next/link"
import ContactForm from "../form/ContactForm"
import { useEffect, useState } from "react"
import { listSurcursals } from "@/services/SurcursalService"

interface Surcursal {
   id: number;
   name: string;
   address: string;
   ville: Ville;
   phone: string;
   horaire: string;
}

interface Ville {
   id: number;
   description: string;
   region: Region;
} 

interface Region {
   id: number;
   description: string;
}

const ContactArea = () => {
   const [surcursals, setSurcursals] = useState<Surcursal[]>([])

   useEffect(() => {
      listSurcursals(0)
         .then((response) => {
            setSurcursals(response.data.content)
         })
         .catch((error) => {
            console.error("Error fetching surcursals:", error)
         })
   }, [])

   return (
     <section className="contact__area section-py-120" style={{ background: "linear-gradient(180deg, rgb(252, 252, 253) 0%, #ffffff 58%)" }}>
       <div className="container">
         <div className="text-center mb-5">
           <span
             className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill fw-semibold mb-3"
             style={{ background: "rgba(82, 174, 29, 0.12)", color: "rgb(82, 174, 29)" }}
           >
             <i className="fas fa-headset"></i>
             Support Velog Xpress
           </span>
           <h2 className="mb-3" style={{ color: "rgb(14, 34, 105)" }}>Nous sommes proches de vous</h2>
           <p className="mx-auto mb-0" style={{ maxWidth: "720px", color: "#5f6f89" }}>
             Retrouvez nos adresses, contactez une succursale ou envoyez directement votre demande au support.
           </p>
         </div>

         <div className="row g-4 align-items-stretch mb-5">
           <div className="col-lg-7">
             <div
               className="h-100 overflow-hidden"
               style={{
                 borderRadius: "28px",
                 border: "1px solid rgba(14, 34, 105, 0.1)",
                 boxShadow: "0 24px 60px rgba(14, 34, 105, 0.12)",
                 background: "rgb(252, 252, 253)",
                 padding: "12px",
               }}
             >
               <div className="contact-map contact-map-two h-100" style={{ borderRadius: "22px", overflow: "hidden" }}>
                 <iframe
                   title="Carte Velog Xpress"
                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.2121626815187!2d-80.28728722458521!3d26.189775777085416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d90f53d32e95d7%3A0x795f35bd3f0f9071!2s5301%20N%20Nob%20Hill%20Rd%2C%20Sunrise%2C%20FL%2033351!5e0!3m2!1sen!2sus!4v1773087930209!5m2!1sen!2sus"
                   style={{ border: "0", minHeight: "430px" }}
                   loading="lazy"
                   referrerPolicy="no-referrer-when-downgrade"
                 ></iframe>
               </div>
             </div>
           </div>
           <div className="col-lg-5">
             <div
               className="h-100 d-flex flex-column justify-content-between"
               style={{
                 borderRadius: "28px",
                 padding: "34px",
                 color: "#fff",
                 background: "linear-gradient(135deg, rgb(14, 34, 105) 0%, rgb(14, 34, 105) 54%, rgb(82, 174, 29) 100%)",
                 boxShadow: "0 24px 60px rgba(14, 34, 105, 0.22)",
               }}
             >
               <div>
                 <i className="fas fa-location-dot mb-4" style={{ fontSize: "52px" }}></i>
                 <h3 className="text-white mb-3">Besoin d&apos;une réponse rapide?</h3>
                 <p className="mb-4" style={{ color: "rgba(255,255,255,0.86)" }}>
                   Notre équipe vous accompagne pour le suivi de vos colis, les horaires, les adresses et toute demande spéciale.
                 </p>
               </div>
               <div className="d-grid gap-3">
                 <Link
                   href="tel:+17869281241"
                   className="btn"
                   title="Appeler le support Velog Xpress"
                   style={{ background: "rgb(252, 252, 253)", color: "rgb(14, 34, 105)", fontWeight: 700, borderRadius: "14px", padding: "14px 18px" }}
                 >
                   <i className="fas fa-phone me-2"></i>
                   (786) 928-1241
                 </Link>
                 <Link
                   href="tel:+50947282003"
                   className="btn"
                   title="Appeler le support Velog Xpress en Haiti"
                   style={{ background: "rgb(252, 252, 253)", color: "rgb(14, 34, 105)", fontWeight: 700, borderRadius: "14px", padding: "14px 18px" }}
                 >
                   <i className="fas fa-phone me-2"></i>
                   +509 4728-2003
                 </Link>
                 <Link
                   href="mailto:info@velogxpress.com"
                   className="btn"
                   title="Envoyer un email au support Velog Xpress"
                   style={{ background: "rgba(255,255,255,0.16)", color: "#fff", fontWeight: 700, borderRadius: "14px", padding: "14px 18px", border: "1px solid rgba(255,255,255,0.35)" }}
                 >
                   <i className="fas fa-envelope me-2"></i>
                   info@velogxpress.com
                 </Link>
               </div>
             </div>
           </div>
         </div>

         <div className="row g-4 mb-5">
           {surcursals.map((surcursal) => (
             <div className="col-lg-4 col-md-6" key={surcursal.id}>
               <div
                 className="h-100"
                 style={{
                   border: "1px solid rgba(14, 34, 105, 0.1)",
                   borderRadius: "24px",
                   padding: "26px",
                   background: "rgb(252, 252, 253)",
                   boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
                 }}
               >
                 <div className="d-flex align-items-center gap-3 mb-4">
                   <div
                     className="d-inline-flex align-items-center justify-content-center flex-shrink-0"
                     style={{
                       width: "58px",
                       height: "58px",
                       borderRadius: "18px",
                       background: "rgba(14, 34, 105, 0.08)",
                       color: "rgb(14, 34, 105)",
                       fontSize: "26px",
                     }}
                   >
                     <i className="fas fa-building"></i>
                   </div>
                   <div>
                     <h4 className="mb-1" style={{ color: "rgb(14, 34, 105)" }}>{surcursal.name}</h4>
                     <span style={{ color: "rgb(82, 174, 29)", fontWeight: 700 }}>{surcursal.ville.region.description}</span>
                   </div>
                 </div>
                 <div className="d-flex gap-3 mb-3">
                   <i className="fas fa-map-marker-alt mt-1" style={{ color: "rgb(82, 174, 29)" }}></i>
                   <p className="mb-0" style={{ color: "#5f6f89" }}>
                     {surcursal.address}, {surcursal.ville.description}
                   </p>
                 </div>
                 <div className="d-flex gap-3 mb-3">
                   <i className="fas fa-clock mt-1" style={{ color: "rgb(82, 174, 29)" }}></i>
                   <p className="mb-0" style={{ color: "#5f6f89" }}>{surcursal.horaire}</p>
                 </div>
                 <Link
                   href={`tel:${surcursal.phone}`}
                   className="btn client-info-btn w-100 mt-3"
                   title={`Appeler ${surcursal.name}`}
                   style={{ background: "rgb(14, 34, 105)", borderColor: "rgb(14, 34, 105)" }}
                 >
                   <i className="fas fa-phone me-2"></i>
                   {surcursal.phone}
                 </Link>
               </div>
             </div>
           ))}
         </div>

         <div className="row">
           <div className="col-12">
             <div
               className="contact__form-wrap"
               style={{
                 borderRadius: "28px",
                 border: "1px solid rgba(14, 34, 105, 0.1)",
                 background: "rgb(252, 252, 253)",
                 boxShadow: "0 24px 60px rgba(14, 34, 105, 0.1)",
               }}
             >
               <div className="text-center mb-4">
                 <span className="d-inline-flex align-items-center gap-2 mb-3" style={{ color: "rgb(82, 174, 29)", fontWeight: 700 }}>
                   <i className="fas fa-paper-plane"></i>
                   Contact direct
                 </span>
                 <h2 className="title mb-2" style={{ color: "rgb(14, 34, 105)" }}>Laissez-nous un message</h2>
                 <p className="mb-0" style={{ color: "#5f6f89" }}>Remplissez le formulaire et nous vous répondrons rapidement.</p>
               </div>
               <ContactForm />
               <p className="ajax-response mb-0"></p>
             </div>
           </div>
         </div>
       </div>
     </section>
   );
}

export default ContactArea
