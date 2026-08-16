"use client";
import Image from "next/image";

const Vision = () => {
  return (
    <section className="vision__area section-pb-120">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="vision__inner-wrap">
              <div
                className="vision__img wow img-custom-anim-left animated"
                data-wow-duration="1.5s"
                data-wow-delay="0.1s"
              >
                <Image
                  src="/assets/img/images/vision_img.jpg"
                  alt="img"
                  width={600}
                  height={450}
                />
              </div>

              <div className="vision__content">
                <div className="section__title section__title-two mb-25">
                  <span className="sub-title">Notre Vision</span>
                  <h2 className="title">Nous Visons À:</h2>
                </div>

                <div className="about__content-inner">
                  <div className="about__list-box about__list-box-two">
                    <ul className="list-wrap">
                      <li>
                        <i className="flaticon-check"></i> Optimiser la chaîne
                        d&apos;approvisionnement.
                      </li>
                      <li>
                        <i className="flaticon-check"></i> Renforcer la
                        satisfaction client.
                      </li>
                      <li>
                        <i className="flaticon-check"></i> Assurer la sécurité
                        des marchandises.
                      </li>
                      <li>
                        <i className="flaticon-check"></i> Contribuer à la
                        connectivité mondiale.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vision;
