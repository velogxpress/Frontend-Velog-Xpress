"use client";
 import { useState, useEffect} from "react";
import { countClient } from "@/services/LoginService";
import Count from "@/components/common/Count";
import Image from "next/image";

import shape_1 from "@/assets/img/images/features_shapes.png";
import {countOrders} from "@/services/OrderService";




const backYear=()=>{
  const currentYear = new Date().getFullYear();
  return currentYear - 1;
}
const Features = () => {

    const [orders, setOrders] = useState(0);
    const [clients, setClients] = useState(0);



  const countColis= async () => {
    const response = await countOrders();
    setOrders(response.data);
  }

  useEffect(() => {
    countColis();
  }, [orders]);

const countClients= async () => {
    const response = await countClient();
    setClients(response.data);
  }

  useEffect(() => {
    countClients();
  }, [clients]);
   
   
  return (
    <section className="features__area-two">
      <div className="container">
        <div className="row gx-0 align-items-center">
          <div className="col-lg-7 order-0 order-lg-2">
            <div className="features__item-wrap">
              <div className="features__item-two">
                <div className="features__icon-two">
                  <i className="flaticon-air-freight"></i>
                </div>
                <div className="features__content-two">
                  <h2 className="title">Fret aérien express & régulier</h2>
                  <p>
                    Faites vos commandes sur Amazon, eBay, Temu, Shein, Alibaba, etc.
                  </p>
                </div>
              </div>
              <div className="features__item-two">
                <div className="features__icon-two">
                  <i className="flaticon-ship"></i>
                </div>
                <div className="features__content-two">
                  <h2 className="title">Fret de machandises volumineuses</h2>
                  <p>
                    Envoyez des colis volumineux à votre famille sans problème partout en Haiti.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="features__content-wrap">
              <div className="section__title white-title mb-35">
                <h2 className="title">
                  meilleure entreprise de transport & <br /> de logistique
                </h2>
              </div>
              <div className="counter__wrap counter__wrap-two">
                <div className="counter__item counter__item-four">
                  <div className="counter__icon counter__icon-four">
                    <i className="flaticon-package"></i>
                  </div>
                  <div className="counter__content">
                    <h2 className="count">
                      <span className="counter-number">
                        <Count number={orders} />
                      </span>
                      
                    </h2>
                    <p>Nombre de paquets livrés en {backYear()}</p>
                  </div>
                </div>
                <div className="counter__item counter__item-four">
                  <div className="counter__icon counter__icon-four">
                    <i className="flaticon-planet-earth"></i>
                  </div>
                  <div className="counter__content">
                    <h2 className="count">
                      <span className="counter-number">
                        <Count number={clients} />
                      </span>
                      
                    </h2>
                    <p>Total des clients actifs utilisant notre service</p>
                  </div>
                </div>
              </div>
              <Image src={shape_1} alt="shape" className="shape" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
