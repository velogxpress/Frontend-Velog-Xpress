"use client";
import Image from "next/image";
import Link from "next/link";
import {getAddress} from "../../services/AddressService"
import {useState,useEffect} from "react";

interface Address {
  addressline: string;
  city: string;
  state: string;
  zipcode: string;
  phone: string;
}

function formatInternationalPhone(phone: string): string | null {
  if (!phone) return null;

  // retire tout sa ki pa chif
  let cleaned = phone.replace(/\D/g, "");

  // =========================
  // 🇭🇹 HAITI
  // =========================

  // Si li gen 509 devan
  if (cleaned.startsWith("509")) {
    const local = cleaned.substring(3);
    if (/^[2349]\d{7}$/.test(local)) {
      return `+509${local}`;
    }
  }

  // Si li gen 8 chif (Ayiti san prefix)
  if (/^[2349]\d{7}$/.test(cleaned)) {
    return `+509${cleaned}`;
  }

  // =========================
  // 🇺🇸 USA
  // =========================

  // Si li kòmanse pa 1
  if (cleaned.startsWith("1")) {
    const local = cleaned.substring(1);
    if (/^[2-9]\d{2}[2-9]\d{6}$/.test(local)) {
      return `+1${local}`;
    }
  }

  // Si li gen 10 chif (USA san prefix)
  if (/^[2-9]\d{2}[2-9]\d{6}$/.test(cleaned)) {
    return `+1${cleaned}`;
  }

  return null; // pa valab
}

const FooterThree = () => {
  const [address, setAddress] = useState<Address | null>(null);
  let value = 1;
  
  const fetchAddress = async () => {
      try {
        const response = await getAddress(value);
        setAddress(response.data as Address);
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

  useEffect(() => {
        fetchAddress();
  }, []);

  function openWhatsApp(e) {
    e.preventDefault();

    const phone = "7869281241";
    const text = "Bonjou Velog Xpress, mwen bezwen enfomasyon";
    const whatsappUrl = `https://wa.me/${encodeURIComponent(formatInternationalPhone(phone) ?? "")}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank","noopener,noreferrer");

  }

  return (
    <footer className="footer__area footer__area-four fix">
      <div className="container">
        <div className="footer__top footer__top-two">
          <div className="row">
            <div className="col-xl-4 col-lg-5 col-md-6">
              <div className="footer__widget">
                <div className="footer__logo">
                  <Link href="/">
                    <Image
                      src="/assets/img/logo/VELOG 2-01.svg"
                      alt="logo"
                      width={160}
                      height={50}
                    />
                  </Link>
                </div>

                <div className="footer__content footer__content-three">
                  <p>
                    Velog Xpress, est une entreprise spécialisée dans le
                    transport...
                  </p>
                </div>

                <div className="footer__social footer__social-three">
                  <ul className="list-wrap">
                    <li>
                      <Link
                        href="https://www.facebook.com/profile.php?id=61565811063029&mibextid=LQQJ4d&rdid=lZMGvcnwQ60foMK2&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2FeCka1k2UiEDHaPyB%2F%3Fmibextid%3DLQQJ4d"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-facebook-f"></i>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://www.instagram.com/velog_xpress/?igsh=ODFzZ3h3bGVkY2lm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-instagram"></i>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://www.tiktok.com/@velog_xpress?_t=ZM-8rpVOXpmh68&_r=1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-tiktok"></i>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href=""
                        onClick={openWhatsApp}
                      >
                        <i className="fab fa-whatsapp"></i>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="copyright-text copyright-text-three">
                  <p>Copyright Velog Xpress | Tous droits réservés</p>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-6 col-sm-6">
              <div className="footer__widget">
                <h4 className="footer__widget-title footer__widget-title-two">
                  Importants
                </h4>
                <div className="footer__link footer__link-three">
                  <ul className="list-wrap">
                    <li>
                      <Link href="/confidentialite">
                        Politique et Confidentialité
                      </Link>
                    </li>
                    <li>
                      <Link href="/condition">Termes & Conditions</Link>
                    </li>
                    <li>
                      <Link href="/marchandise">
                        Marchandises dangereuses et interdites
                      </Link>
                    </li>
                    <li><Link href="/privacy">Privacy</Link></li>
                    <li><Link href="/close-account">Close account</Link></li>
                    <li><Link href="/support">Support</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
              <div className="footer__widget">
                <h4 className="footer__widget-title footer__widget-title-two">
                  Liens Rapides
                </h4>
                <div className="footer__link footer__link-three">
                  <ul className="list-wrap">
                    <li>
                      <Link href="/">Accueil</Link>
                    </li>
                    <li>
                      <Link href="/about">Qui Sommes-nous?</Link>
                    </li>
                    <li>
                      <Link href="/contact">Contact</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="footer__widget">
                <h4 className="footer__widget-title footer__widget-title-two">
                  Information
                </h4>
                <div className="footer__info-wrap footer__info-wrap-three">
                  <ul className="list-wrap">
                    <li>
                      <i className="flaticon-location-1"></i>
                      <p>
                        {address?.addressline} <br /> {address?.city}, {address?.state} {" "}
                        {address?.zipcode}
                      </p>
                    </li>
                    <li>
                      <i className="flaticon-telephone"></i>
                      <p>{address?.phone}</p>
                    </li>
                    <li>
                      <i className="flaticon-time"></i>
                      <p>
                        Lun – Ven: 9h00 am – 5h00 pm, <br /> Samedi : 9h00 am -
                        5h00 pm
                        <br /> Dimanche: <span>Fermé</span>
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* ... le reste inchangé ... */}
          </div>
        </div>
      </div>

      <div className="footer__shape footer__shape-two footer__shape-three">
        <Image
          src="/assets/img/images/h3_footer_shape01.png"
          alt="shape"
          width={300}
          height={300}
        />
        <Image
          src="/assets/img/images/h3_footer_shape02.png"
          alt="shape"
          width={300}
          height={300}
          data-aos="fade-left"
          data-aos-delay="400"
        />
      </div>
    </footer>
  );
};

export default FooterThree;
