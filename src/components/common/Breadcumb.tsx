import Link from "next/link";

interface PropsType {
  title: string;
  sub_title: string;
}

const Breadcumb = ({ title, sub_title }: PropsType) => {
  return (
    <section
      className="breadcrumb__area breadcrumb__bg"
      style={{ backgroundImage: `url(/assets/img/bg/breadcrumb_bg.jpg)` }}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="breadcrumb__content">
              <h1 className="title">{title}</h1>

              <nav
                className="breadcrumb"
                itemScope
                itemType="https://schema.org/BreadcrumbList"
              >
                {/* ACCUEIL */}
                <span
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                >
                  <Link href="/" itemProp="item">
                    <span itemProp="name">Accueil</span>
                  </Link>
                  <meta itemProp="position" content="1" />
                </span>

                <span className="breadcrumb-separator">
                  <i className="flaticon-right-arrow"></i>
                </span>

                {/* PAGE COURANTE */}
                <span
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                >
                  <span itemProp="name">{sub_title}</span>
                  <meta itemProp="position" content="2" />
                </span>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Breadcumb;
