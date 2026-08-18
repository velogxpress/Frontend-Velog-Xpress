import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, BadgeCheck, Box, Headphones, MapPinned, PackageCheck,
  Plane, Scale, ShieldCheck, Ship, ShoppingBag, Smartphone, Sparkles, Users,
} from "lucide-react";

const services = [
  { title: "Fret aérien", label: "Le plus rapide", copy: "Départs réguliers, traitement prioritaire et suivi détaillé pour vos achats et petits colis.", image: "/assets/img/services/services_img06.jpg", icon: Plane },
  { title: "Fret maritime", label: "Grande capacité", copy: "Une solution économique pour les marchandises lourdes, volumineuses ou en grande quantité.", image: "/assets/img/services/services_img01.jpg", icon: Ship },
  { title: "Gestion douanière", label: "Accompagnement", copy: "Documentation, conformité et coordination locale pour réduire les blocages à l’arrivée.", image: "/assets/img/services/services_img02.jpg", icon: ShieldCheck },
];

const steps = [
  ["1", "Créez votre compte", "Recevez votre code client et votre adresse personnalisée aux États-Unis."],
  ["2", "Envoyez vos achats", "Utilisez votre adresse Velog sur Amazon, Temu, Shein et vos autres boutiques."],
  ["3", "Suivez chaque étape", "Recevez une mise à jour à la réception, au départ et à l’arrivée."],
  ["4", "Récupérez sereinement", "Consultez votre facture puis choisissez la succursale ou la livraison."],
];

const clientTools = [
  { icon: ShoppingBag, title: "Adresse d’achat", text: "Copiez votre adresse américaine et votre code client sans risque d’erreur.", href: "/dashboard/admin/profile" },
  { icon: Scale, title: "Calculateur", text: "Estimez le coût selon la destination, la catégorie et le poids.", href: "/#calculateur" },
  { icon: PackageCheck, title: "Mes colis", text: "Retrouvez vos colis, factures et prochaines actions dans un même espace.", href: "/dashboard/admin/mes-colis" },
  { icon: Headphones, title: "Support humain", text: "Demandez de l’aide avec le contexte nécessaire déjà associé à votre compte.", href: "/support" },
];

export default function ModernHomeSections() {
  return (
    <>
      <section className="vx-partners" aria-label="Transporteurs partenaires">
        <div className="vx-container vx-partner-row">
          <span>Nos réseaux partenaires</span>
          {[["dhl.png", "DHL"], ["fedex.png", "FedEx"], ["ups.png", "UPS"], ["usps.png", "USPS"], ["shippex.png", "Shippex"]].map(([image, alt]) => <Image key={alt} src={`/assets/img/brand/${image}`} alt={alt} width={120} height={44} />)}
        </div>
      </section>

      <section className="vx-section">
        <div className="vx-container">
          <div className="vx-section-head"><div><p className="vx-eyebrow">Solutions adaptées</p><h2>Une route claire pour chaque envoi.</h2></div><p>Choisissez la rapidité de l’aérien, la capacité du maritime ou notre accompagnement douanier.</p></div>
          <div className="vx-service-grid">
            {services.map((service) => { const Icon = service.icon; return <article className="vx-service-card" key={service.title}><div className="vx-service-image"><Image src={service.image} alt={service.title} fill sizes="(max-width: 900px) 100vw, 33vw" /></div><div className="vx-service-content"><span className="vx-tag"><Icon size={14} /> {service.label}</span><h3>{service.title}<ArrowRight size={19} /></h3><p>{service.copy}</p></div></article>; })}
          </div>
        </div>
      </section>

      <section className="vx-section vx-section-navy">
        <div className="vx-container">
          <div className="vx-section-head"><div><p className="vx-eyebrow">Comment ça marche</p><h2>Quatre étapes. Zéro surprise.</h2></div><p>Votre espace client centralise l’adresse d’achat, le suivi, les factures et l’historique.</p></div>
          <div className="vx-workflow">{steps.map(([number, title, text]) => <article className="vx-workflow-step" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </div>
      </section>

      <section className="vx-section">
        <div className="vx-container vx-about-grid">
          <div className="vx-photo-stack"><Image src="/assets/img/images/h3_about_img01.jpeg" alt="Équipe Velog Xpress" fill sizes="(max-width: 900px) 100vw, 45vw" /><Image src="/assets/img/images/h3_about_img02.jpeg" alt="Opérations logistiques Velog Xpress" width={320} height={380} /></div>
          <div><p className="vx-eyebrow">Une équipe entre deux pays</p><h2>La technologie pour la visibilité. L’humain pour la confiance.</h2><p className="vx-body-lede">Velog Xpress coordonne transport, réception, facturation et service client dans une expérience unique conçue pour les réalités du corridor États-Unis–Haïti.</p><div className="vx-feature-list"><div><span><Smartphone /></span><div><h3>Une information utile au bon moment</h3><p>Statut, prochaine étape, montant et point de retrait restent faciles à comprendre.</p></div></div><div><span><Users /></span><div><h3>Un support proche du terrain</h3><p>Une équipe disponible en français et en créole pour résoudre rapidement les imprévus.</p></div></div></div><div className="vx-metrics"><div><strong>2 pays</strong><span>Une seule expérience</span></div><div><strong>7j/7</strong><span>Suivi accessible</span></div><div><strong>100%</strong><span>Traçabilité interne</span></div></div></div>
        </div>
      </section>

      <section className="vx-section vx-section-soft"><div className="vx-container"><div className="vx-section-head"><div><p className="vx-eyebrow">Votre espace client</p><h2>Tout ce dont vous avez besoin, sans chercher.</h2></div><p>Les actions fréquentes restent simples sur téléphone comme sur ordinateur.</p></div><div className="vx-tools-grid">{clientTools.map((item) => { const Icon = item.icon; return <Link href={item.href} className="vx-tool-card" key={item.title}><span><Icon /></span><h3>{item.title}</h3><p>{item.text}</p><b>Ouvrir <ArrowRight size={14} /></b></Link>; })}</div></div></section>

      <section className="vx-section"><div className="vx-container vx-trust-panel"><div><p className="vx-eyebrow">Pensé pour nos clients</p><h2>Une expérience qui rassure.</h2><div className="vx-trust-icons"><span><BadgeCheck /> Statuts compréhensibles</span><span><MapPinned /> Emplacement visible</span><span><Box /> Historique complet</span></div></div><blockquote><Sparkles /><p>“Je sais quand mon colis est reçu, combien je dois payer et quand je peux le récupérer. Je n’ai plus besoin d’appeler pour chaque étape.”</p><footer><strong>Nadia P.</strong><span>Cliente Velog Xpress · Port-au-Prince</span></footer></blockquote></div></section>

      <section className="vx-section vx-cta-section"><div className="vx-container"><div className="vx-cta"><div><p className="vx-eyebrow">Commencez aujourd’hui</p><h2>Prêt à simplifier vos prochains envois ?</h2><p>Créez votre espace Velog Xpress en quelques minutes.</p></div><Link href="/dashboard/signup" className="vx-button">Créer mon compte <ArrowRight size={18} /></Link></div></div></section>
    </>
  );
}
