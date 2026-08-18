"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Menu, PackageSearch, UserRound, X } from "lucide-react";

const HeaderThree = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <>
      <div className="vx-utility-bar">
        <div className="vx-container vx-utility-inner">
          <span><i /> Miami → Haïti · Départs chaque semaine</span>
          <span>Lun–Sam, 9:00–17:00 · +1 (973) 640-6064</span>
        </div>
      </div>
      <header className="vx-header">
        <div className="vx-container vx-nav-inner">
          <Link href="/" className="vx-brand" aria-label="Velog Xpress, accueil">
            <Image src="/assets/img/logo/VELOG-01.svg" alt="Velog Xpress" width={144} height={60} priority />
          </Link>

          <nav className={`vx-main-nav ${isMenuOpen ? "is-open" : ""}`} aria-label="Navigation principale">
            <Link href="/">Accueil</Link>
            <Link href="/about">Qui sommes-nous</Link>
            <Link href="/support">Support</Link>
            <Link href="/contact">Contact</Link>
            <div className={`vx-nav-dropdown ${isInfoOpen ? "is-open" : ""}`}>
              <button type="button" onClick={() => setIsInfoOpen((value) => !value)} aria-expanded={isInfoOpen}>
                Informations <ChevronDown size={15} aria-hidden="true" />
              </button>
              <div className="vx-nav-dropdown-panel">
                <Link href="/confidentialite">Politique de confidentialité</Link>
                <Link href="/condition">Termes et conditions</Link>
                <Link href="/marchandise">Marchandises réglementées</Link>
                <Link href="/close-account">Fermer mon compte</Link>
              </div>
            </div>
          </nav>

          <div className="vx-nav-actions">
            <Link href="/dashboard/signin" className="vx-button vx-button-ghost"><UserRound size={17} />Se connecter</Link>
            <Link href="/dashboard/suivi" className="vx-button"><PackageSearch size={17} />Suivre un colis</Link>
          </div>
          <button className="vx-menu-button" type="button" onClick={() => setIsMenuOpen((value) => !value)} aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={isMenuOpen}>
            {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>
    </>
  );
};

export default HeaderThree;
