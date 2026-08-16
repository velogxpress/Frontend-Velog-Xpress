"use client"
import VideoPopup from "@/modals/VideoPopup"
import { useState } from "react"
import Link from "next/link"

const VideoArea = () => {

   const [isVideoOpen, setIsVideoOpen] = useState(false);

   return (
      <>
         <section className="video__area-three">
            <div className="video__bg video__bg-three" style={{ backgroundImage: `url(/assets/img/bg/video_bg03.jpg)` }}></div>
            <div className="container">
               <div className="row align-items-center">
                  <div className="col-xl-7 col-lg-6 order-0 order-lg-2">
                     <div className="video__play-btn video__play-btn-two">
                        <a onClick={() => setIsVideoOpen(true)} style={{ cursor: "pointer" }} className="play-btn popup-video"><i className="fas fa-play"></i></a>
                     </div>
                  </div>
                  <div className="col-xl-5 col-lg-6">
                     <div className="video__content-two">
                        <h2 className="title">Looking for the best logistics transport service?</h2>
                        <div className="video__contact">
                           <div className="icon">
                              <i className="flaticon-telephone"></i>
                           </div>
                           <div className="content">
                              <span>Emergency Call:</span>
                              <Link href="tel:0123456789">(205) 555-0100</Link>
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
            videoId={"Ml4XCF-JS0k"}
         />
      </>
   )
}

export default VideoArea
