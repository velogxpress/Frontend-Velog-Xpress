"use client"
import { useInView } from "react-intersection-observer";
import VideoPopup from "@/modals/VideoPopup"
import { useState } from "react"

const VideoArea = () => {

   const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.75,
   });

   const [isVideoOpen, setIsVideoOpen] = useState(false);

   return (
     <>
       <section className="video__area-two section-py-140">
         <div
           className="video__bg video__bg-two"
           style={{ backgroundImage: `url(/assets/img/bg/video_bg02.jpg)` }}
         ></div>
         <div className="container">
           <div className="row align-items-center">
             <div className="col-xl-7 col-lg-6 order-0 order-lg-2">
               <div className="video__play-btn video__play-btn-two">
                 <a
                   onClick={() => setIsVideoOpen(true)}
                   style={{ cursor: "pointer" }}
                   className="play-btn popup-video"
                 >
                   <i className="fas fa-play"></i>
                 </a>
               </div>
             </div>
             <div className="col-xl-5 col-lg-6">
               <div className="video__content">
                 <div className="section__title white-title mb-30">
                   <span className="sub-title">
                     Équipes client et services agiles
                   </span>
                   <h2 className="title">Depuis les États-Unis vers Haïti.</h2>
                 </div>
                 <div className="progress__wrap progress__wrap-two" ref={ref}>
                   <div className="progress__item progress__item-two">
                     <div className="progress__item-top">
                       <h3 className="progress__title">Livraison réussie</h3>
                       <div className="progress-value">
                         <span className="counter-number">100</span>%
                       </div>
                     </div>
                     <div className="progress">
                       <div
                         className="progress-bar"
                         style={{
                           width: "100%",
                           animation: inView ? "animate-positive 1.8s" : "none",
                           opacity: inView ? "1" : "0",
                         }}
                       ></div>
                     </div>
                   </div>
                   <div className="progress__item progress__item-two">
                     <div className="progress__item-top">
                       <h3 className="progress__title">Clients satisfaits</h3>
                       <div className="progress-value">
                         <span className="counter-number">100</span>%
                       </div>
                     </div>
                     <div className="progress">
                       <div
                         className="progress-bar"
                         style={{
                           width: "100%",
                           animation: inView ? "animate-positive 1.8s" : "none",
                           opacity: inView ? "1" : "0",
                         }}
                       ></div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </section>
       <VideoPopup
         isVideoOpen={isVideoOpen}
         setIsVideoOpen={setIsVideoOpen}
         videoId={"NCccGpNvh6U"}
       />
     </>
   );
}

export default VideoArea
