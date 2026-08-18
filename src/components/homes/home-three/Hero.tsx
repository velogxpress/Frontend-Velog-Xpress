"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, CircleCheck, PackageCheck, Search } from "lucide-react";
import { FormEvent, useState } from "react";

const Hero = () => {
   const [tracking, setTracking] = useState("");

   const handleTracking = (event: FormEvent<HTMLFormElement>) => {
     event.preventDefault();
     const query = tracking.trim() ? `?tracking=${encodeURIComponent(tracking.trim())}` : "";
     window.location.href = `/dashboard/suivi${query}`;
   };

   return (
     <>
       <section className="vx-hero">
         <div className="vx-container vx-hero-grid">
           <div className="vx-hero-copy">
             <p className="vx-eyebrow">Logistique États-Unis ↔ Haïti</p>
             <h1>Vos colis avancent. Vous le <span>savez toujours.</span></h1>
             <p className="vx-lede">Transport aérien et maritime avec un suivi clair, des délais prévisibles et une équipe disponible du dépôt jusqu’à la livraison.</p>
             <div className="vx-hero-actions">
               <Link href="/dashboard/suivi" className="vx-button vx-button-green">Suivre mon colis <ArrowRight size={18} /></Link>
               <Link href="/dashboard/signup" className="vx-button vx-button-ghost">Créer un compte</Link>
             </div>
             <div className="vx-hero-notes"><span><Check /> Suivi en temps réel</span><span><Check /> Tarifs transparents</span><span><Check /> Support bilingue</span></div>
           </div>
           <div className="vx-hero-visual">
             <div className="vx-hero-stage">
               <div className="vx-route-line" />
               <Image src="/assets/img/banner/h3_hero_img01.png" alt="Transport aérien Velog Xpress" width={771} height={238} priority />
             </div>
             <div className="vx-status-card vx-status-top"><CircleCheck /><div><strong>Colis pris en charge</strong><span>Miami · Aujourd’hui, 10:42</span></div></div>
             <div className="vx-status-card vx-status-bottom"><div className="vx-status-label"><i /> En transit</div><span>Livraison estimée</span><strong>Jeudi 20 août</strong><div className="vx-mini-progress"><i /></div></div>
           </div>
         </div>
       </section>
       <div className="vx-container vx-quick-track-wrap">
         <div className="vx-quick-track">
           <div className="vx-quick-title"><PackageCheck /><div><strong>Où est votre colis ?</strong><span>Entrez un numéro de tracking ou UPC.</span></div></div>
           <form onSubmit={handleTracking} className="vx-track-form">
             <Search size={19} aria-hidden="true" />
             <input value={tracking} onChange={(event) => setTracking(event.target.value)} aria-label="Numéro de suivi" placeholder="Ex. VX-2408-98172" />
             <button className="vx-button" type="submit">Rechercher</button>
           </form>
           <Link href="/support">Aide au suivi <ArrowRight size={15} /></Link>
         </div>
       </div>
     </>
   );
}

export default Hero
