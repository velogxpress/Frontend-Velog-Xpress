import HeaderThree from "@/layouts/headers/HeaderThree"
import Hero from "./Hero"
import ModernHomeSections from "./ModernHomeSections"
import FooterThree from "@/layouts/footers/FooterThree"
import ScrollToTop from "@/components/common/ScrollToTop"

const HomeThree = () => {
   return (
     <div className="theme-orange">
       <ScrollToTop />
       <HeaderThree />
       <main className="vx-site">
         <Hero />
         <ModernHomeSections />
       </main>
       <FooterThree />
     </div>
   );
}

export default HomeThree
