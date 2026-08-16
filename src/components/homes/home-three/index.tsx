import HeaderThree from "@/layouts/headers/HeaderThree"
import Hero from "./Hero"
import Features from "./Features"
import About from "./About"
import Brand from "../home-three/Brand";
import Services from "./Services"
import Faq from "./Faq"
import SupportClient from "./SupportClient"
import ClientInfoHub from "./ClientInfoHub"
import FooterThree from "@/layouts/footers/FooterThree"
import ScrollToTop from "@/components/common/ScrollToTop"

const HomeThree = () => {
   return (
     <div className="theme-orange">
       <ScrollToTop />
       <HeaderThree />
       <main className="fix">
         <Hero />
         <About />
         <Services />
         <Features />
         <ClientInfoHub />
         <Brand style={true} />
         <Faq />
         <SupportClient />
       </main>
       <FooterThree />
     </div>
   );
}

export default HomeThree
