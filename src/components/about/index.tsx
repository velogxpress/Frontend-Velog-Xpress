import FooterThree from "@/layouts/footers/FooterThree"
import Breadcumb from "../common/Breadcumb"
import AboutArea from "./AboutArea"
import FeaturesArea from "./FeaturesArea"
import VideoArea from "./VideoArea"
import HeaderThree from "@/layouts/headers/HeaderThree"
import ScrollToTop from "../common/ScrollToTop"

const About = () => {
   return (
     <div className="theme-red">
       <HeaderThree />
       <ScrollToTop />
       <main className="fix">
         <Breadcumb sub_title="Qui Sommes-nous?" title="Qui Sommes-nous?" />
         <AboutArea />
         <FeaturesArea />
         <VideoArea />
         <FooterThree />
       </main>
     </div>
   );
}

export default About
