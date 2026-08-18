import FooterThree from "@/layouts/footers/FooterThree";
import HeaderThree from "@/layouts/headers/HeaderThree";
import Breadcumb from "@/components/common/Breadcumb";
import ScrollToTop from "@/components/common/ScrollToTop";

type Section = { title: string; content: string };

export default function PublicInfoPage({ title, subtitle, intro, sections }: { title: string; subtitle: string; intro: string; sections: Section[] }) {
  return (
    <div className="theme-red">
      <HeaderThree />
      <ScrollToTop />
      <main className="vx-site">
        <Breadcumb sub_title={subtitle} title={title} />
        <section className="blog-details-area legal-page section-py-120">
          <div className="container"><div className="row justify-content-center"><div className="col-xl-9 col-lg-10">
            <div className="blog__details-wrapper"><div className="blog-details-content">
              <h3 className="title">{title}</h3><p>{intro}</p>
              {sections.map((section) => <div className="blog__details-inner-wrap" key={section.title}><div className="blog__details-inner-content"><h4 className="inner-title">{section.title}</h4><p>{section.content}</p></div></div>)}
            </div></div>
          </div></div></div>
        </section>
        <FooterThree />
      </main>
    </div>
  );
}
