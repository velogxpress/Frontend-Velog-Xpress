import FooterThree from "@/layouts/footers/FooterThree"
import Breadcumb from "../common/Breadcumb"
import ModernAboutContent from "./ModernAboutContent"
import HeaderThree from "@/layouts/headers/HeaderThree"
import ScrollToTop from "../common/ScrollToTop"

const About = () => {
   return (
     <div className="theme-red">
       <HeaderThree />
       <ScrollToTop />
       <main className="vx-site">
         <Breadcumb sub_title="Qui Sommes-nous?" title="Qui Sommes-nous?" />
         <ModernAboutContent />
         <FooterThree />
       </main>
     </div>
   );
}

export default About
