import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PropsType {
  title: string;
  sub_title: string;
}

const Breadcumb = ({ title, sub_title }: PropsType) => {
  return (
    <section className="vx-page-hero">
      <div className="vx-container">
        <nav className="vx-breadcrumb" aria-label="Fil d’Ariane" itemScope itemType="https://schema.org/BreadcrumbList">
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem"><Link href="/" itemProp="item"><span itemProp="name">Accueil</span></Link><meta itemProp="position" content="1" /></span>
          <ChevronRight size={14} aria-hidden="true" />
          <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem"><span itemProp="name">{sub_title}</span><meta itemProp="position" content="2" /></span>
        </nav>
        <h1>{title}</h1>
        <p>Des informations claires pour avancer sereinement avec Velog Xpress.</p>
      </div>
    </section>
  );
};

export default Breadcumb;
