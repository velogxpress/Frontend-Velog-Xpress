import FooterThree from "@/layouts/footers/FooterThree"
import Breadcumb from "../common/Breadcumb"
import HeaderThree from "@/layouts/headers/HeaderThree"
import ScrollToTop from "../common/ScrollToTop"
import Conditions from "@/components/condition/condition";
const Condition = () => {
  return (
    <div className="theme-red">
      <HeaderThree />
      <ScrollToTop />
      <main className="vx-site">
        <Breadcumb
          sub_title="Conditions"
          title="Termes et Conditions"
        />

        <Conditions />
        <FooterThree />
      </main>
    </div>
  );
};

export default Condition;
