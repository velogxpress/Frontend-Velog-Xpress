import FooterThree from "@/layouts/footers/FooterThree"
import Breadcumb from "../common/Breadcumb"
import HeaderThree from "@/layouts/headers/HeaderThree"
import ScrollToTop from "../common/ScrollToTop"
import Harzmat from "@/components/marchandise/harzmat";
const Condition = () => {
  return (
    <div className="theme-red">
      <HeaderThree />
      <ScrollToTop />
      <main className="vx-site">
        <Breadcumb
          sub_title="Marchandises Dangereuses et interdites"
          title="Marchandises"
        />

        <Harzmat />
        <FooterThree />
      </main>
    </div>
  );
};

export default Condition;
