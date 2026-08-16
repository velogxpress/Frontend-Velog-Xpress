import Breadcumb from "@/components/common/Breadcumb"
import ScrollToTop from "@/components/common/ScrollToTop"
import FooterThree from "@/layouts/footers/FooterThree"
import HeaderThree from "@/layouts/headers/HeaderThree"
import ContactArea from "./ContactArea"

const Contact = () => {
   return (
     <div className="theme-red">
       <ScrollToTop />
       <HeaderThree />
       <main className="fix">
         <Breadcumb title="Contactez-nous" sub_title="Contact" />
         <ContactArea />
       </main>
       <FooterThree />
     </div>
   );
}

export default Contact
