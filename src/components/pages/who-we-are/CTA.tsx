import InjectableSvg from "@/components/common/InjectableSvg";
import Image from "next/image";
import Link from "next/link";

const CTA = () => {
  return (
    <section className="cta__area">
      <div className="container">
        <div className="cta__wrap-two">
          <div className="cta__img">
            <Image
              src="/assets/img/images/cta_img.jpg"
              alt="img"
              width={600}
              height={250}
            />
          </div>

          <div className="cta__content-two">
            <div className="content__left">
              <h2 className="title">
                Avez-vous besoin de plus d&apos;informations sur nos services ?
              </h2>
              <p>Rejoignez les entreprises qui nous font confiance.</p>
            </div>

            <div className="cta__btn-two">
              <Link href="/contact" className="btn">
                Contactez-nous{" "}
                <InjectableSvg
                  src="/assets/img/icon/right_arrow.svg"
                  alt=""
                  className=" "
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
