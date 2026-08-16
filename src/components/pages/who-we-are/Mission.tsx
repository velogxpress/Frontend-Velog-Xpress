import Image from "next/image";

const Mission = () => {
  return (
    <section className="mission__area section-py-120">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="mission__inner-wrap">
              {/* Image principale */}
              <div
                className="mission__img wow img-custom-anim-right animated"
                data-wow-duration="1.5s"
                data-wow-delay="0.1s"
              >
                <Image
                  src="/assets/img/images/mission_img.jpg"
                  alt="img"
                  width={600}
                  height={600}
                />
              </div>

              {/* Contenu */}
              <div className="mission__content">
                <div className="section__title section__title-two mb-20">
                  <span className="sub-title">NOTRE MISSION</span>
                  <h2 className="title">
                    Fournir Des Solutions Logistiques Fiables, Rapides Et
                    Accessibles
                  </h2>
                </div>

                <p>
                  Notre mission est de fournir des solutions logistiques
                  fiables, rapides et accessibles, tout en simplifiant les
                  échanges entre nos clients, leurs fournisseurs et leurs
                  familles. Chaque colis est traité avec attention afin
                  d&apos;offrir une expérience claire et rassurante.
                </p>

                <div className="about__list-box about__list-box-two about__list-box-three">
                  <ul className="list-wrap">
                    <li>
                      <i className="flaticon-check"></i>Simplifier
                      l&apos;expédition internationale
                    </li>
                    <li>
                      <i className="flaticon-check"></i>Créer des connexions
                      globales
                    </li>
                    <li>
                      <i className="flaticon-check"></i>Prioriser la
                      satisfaction client
                    </li>
                    <li>
                      <i className="flaticon-check"></i>Promouvoir la fiabilité
                      et l&apos;innovation
                    </li>
                  </ul>
                </div>

                {/* Shape */}
                <div className="shape">
                  <Image
                    src="/assets/img/images/mission_shape.svg"
                    alt="shape"
                    width={300}
                    height={300}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
