import FooterThree from "@/layouts/footers/FooterThree"
import Breadcumb from "../common/Breadcumb"
import HeaderThree from "@/layouts/headers/HeaderThree"
import ScrollToTop from "../common/ScrollToTop"
import Politique from "@/components/confidentialite/politique";
const Confidentialite = () => {
  return (
    <div className="theme-red">
      <HeaderThree />
      <ScrollToTop />
      <main className="vx-site">
        <Breadcumb
          sub_title="Politique"
          title="Confidentialité"
              />
              
         <Politique/>
        <FooterThree />
      </main>
    </div>
  );
};

export default Confidentialite;
