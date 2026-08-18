"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock3, Facebook, Instagram, Mail, MapPin, Phone, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { getAddress } from "@/services/AddressService";

interface Address { addressline: string; city: string; state: string; zipcode: string; phone: string; }

export default function FooterThree() {
  const [address, setAddress] = useState<Address | null>(null);

  useEffect(() => {
    getAddress(1).then((response) => setAddress(response.data as Address)).catch(() => setAddress(null));
  }, []);

  return (
    <footer className="vx-footer">
      <div className="vx-container vx-footer-grid">
        <div className="vx-footer-intro">
          <Link href="/" className="vx-footer-brand"><Image src="/assets/img/logo/VELOG-01.svg" alt="Velog Xpress" width={144} height={60} /></Link>
          <p>Des solutions logistiques fiables entre les États-Unis et Haïti, avec une visibilité claire à chaque étape.</p>
          <div className="vx-socials"><Link href="https://www.facebook.com/" aria-label="Facebook"><Facebook /></Link><Link href="https://www.instagram.com/velog_xpress/" aria-label="Instagram"><Instagram /></Link><Link href="https://wa.me/19736406064" aria-label="WhatsApp"><Send /></Link></div>
        </div>
        <div><h3>Navigation</h3><nav><Link href="/">Accueil</Link><Link href="/about">Qui sommes-nous</Link><Link href="/dashboard/suivi">Suivi colis</Link><Link href="/contact">Contact</Link></nav></div>
        <div><h3>Informations</h3><nav><Link href="/confidentialite">Confidentialité</Link><Link href="/condition">Conditions</Link><Link href="/marchandise">Marchandises</Link><Link href="/close-account">Fermer mon compte</Link></nav></div>
        <div><h3>Nous joindre</h3><ul className="vx-footer-contact"><li><MapPin /><span>{address ? `${address.addressline}, ${address.city}, ${address.state} ${address.zipcode}` : "Hollywood, Floride · États-Unis"}</span></li><li><Phone /><span>{address?.phone || "+1 (973) 640-6064"}</span></li><li><Mail /><span>info@velogxpress.com</span></li><li><Clock3 /><span>Lun–Sam · 9:00–17:00</span></li></ul></div>
      </div>
      <div className="vx-container vx-footer-bottom"><span>© {new Date().getFullYear()} Velog Xpress. Tous droits réservés.</span><span>Transport simple. Suivi transparent. Livraison fiable.</span></div>
    </footer>
  );
}
