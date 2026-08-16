
import Image from "next/image";
import Mission from "@/components/pages/who-we-are/Mission";
import Vision from "@/components/pages/who-we-are/Vision";
import CTA from "@/components/pages/who-we-are/CTA";

const AboutArea = () => {
  return (
    <section className="about__area-two section-py-120" style={{ background: "linear-gradient(180deg, rgb(252, 252, 253) 0%, #ffffff 100%)" }}>
      <div className="container">
        <div className="row align-items-center justify-content-center gutter-24">
          <div className="col-lg-6 col-md-9">
            <div className="about__img-two">
              <Image
                src="/assets/img/images/inner_about_img01.jpg"
                alt="img"
                width={450}
                height={450}
                data-aos="fade-right"
                data-aos-delay="400"
              />

              <Image
                src="/assets/img/images/inner_about_img02.jpg"
                alt="img"
                width={370}
                height={450}
                data-aos="fade-up"
                data-aos-delay="600"
              />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="about__content-two">
              <div className="section__title section__title-two mb-20">
                <span className="sub-title">Nous</span>
                <h2 className="title">
                  Des solutions logistiques et de transport fiables vous font
                  gagner du temps !
                </h2>
              </div>

              <p className="info-one">
                Velog Xpress est une entreprise spécialisée dans le transport,
                la réception et la livraison de colis entre les États-Unis et
                Haïti. Nous accompagnons nos clients avec des solutions simples,
                rapides et adaptées à leurs besoins.
              </p>

              <p className="info-one">
                Notre objectif principal est de devenir un partenaire
                incontournable pour les particuliers et les entreprises qui
                recherchent un service fiable, transparent et efficace.
              </p>

              <div
                className="mt-4"
                style={{
                  background: "rgb(252, 252, 253)",
                  border: "1px solid rgba(14, 34, 105, 0.1)",
                  borderRadius: "24px",
                  boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
                  padding: "26px",
                }}
              >
                <p className="info-one mb-3" style={{ color: "rgb(14, 34, 105)" }}>
                  <b>POURQUOI NOUS CHOISIR ?</b>
                </p>

                <div className="about__content-inner">
                  <div className="about__list-box about__list-box-two">
                    <ul className="list-wrap">
                      <li>
                        <i className="flaticon-check"></i> Un réseau fiable
                        entre les États-Unis et Haïti.
                      </li>
                      <li>
                        <i className="flaticon-check"></i> Des solutions
                        adaptées aux particuliers comme aux entreprises.
                      </li>
                      <li>
                        <i className="flaticon-check"></i> Un suivi clair pour
                        rester informé à chaque étape.
                      </li>
                      <li>
                        <i className="flaticon-check"></i> Un engagement fort
                        envers l&apos;efficacité et la satisfaction client.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Mission />
          <Vision />
          <CTA />
        </div>
      </div>
    </section>
  );
};

export default AboutArea;
