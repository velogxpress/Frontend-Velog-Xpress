import Image from "next/image";

const About = () => {
  return (
    <section className="about__area-four section-py-140">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-6 col-md-10">
            <div className="about__img-four">
              <Image
                src="/assets/img/images/h3_about_img01.jpeg"
                alt="img"
                width={300}
                height={500}
                data-aos="fade-right"
                data-aos-delay="200"
              />
              <Image
                src="/assets/img/images/h3_about_img03.jpeg"
                alt="img"
                width={300}
                height={300}
                data-aos="fade-left"
                data-aos-delay="400"
              />
              <Image
                src="/assets/img/images/h3_about_img02.jpeg"
                alt="img"
                width={300}
                height={300}
                data-aos="fade-up"
                data-aos-delay="600"
              />
            </div>
          </div>

          {/* CONTENU TEXTUEL */}
          <div className="col-lg-6">
            <div className="about__content-four">
              <div className="section__title mb-20">
                <span className="sub-title">
                  À propos de notre entreprise logistique
                </span>
                <h2 className="title">
                  Nous sommes spécialisés dans la gestion du transport...
                </h2>
              </div>

              <p>
                Grâce à notre expertise, nous assurons une chaîne
                d’approvisionnement fluide et optimisée.
              </p>

              <div className="about__list-wrap">{/* ... */}</div>
            </div>
          </div>
        </div>
      </div>

      {/* SHAPE */}
      <div className="about__shape">
        <Image
          src="/assets/img/images/h3_about_shape.png"
          alt="shape"
          width={350}
          height={350}
          data-aos="fade-left"
          data-aos-delay="400"
        />
      </div>
    </section>
  );
};

export default About;
