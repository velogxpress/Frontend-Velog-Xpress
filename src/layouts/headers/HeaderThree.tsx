"use client";
import Link from "next/link";
import NavMenu from "./menu/NavMenu";
import Image from "next/image";
import UseSticky from "@/hooks/UseSticky";
import { useState } from "react";
import MobileSidebar from "./menu/MobileSidebar";
import InjectableSvg from "@/components/common/InjectableSvg";

const HeaderThree = () => {
  const { sticky } = UseSticky();
  const [isActive, setIsActive] = useState<boolean>(false);

  return (
    <header className="transparent-header">
      <div
        id="sticky-header"
        className={`tg-header__area tg-header__area-four ${
          sticky ? "tg-sticky-menu sticky-menu sticky-menu__show" : ""
        }`}
      >
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="tgmenu__wrap">
                <div className="logo">
                  <Link href="/">
                    <Image
                      src="/assets/img/logo/VELOG-01.svg"
                      alt="Logo"
                      width={160}
                      height={60}
                    />
                  </Link>
                </div>

                <div className="tgmenu__navbar-wrap tgmenu__main-menu d-none d-xl-flex">
                  <NavMenu />
                </div>

                <div className="tgmenu__action tgmenu__action-four d-none d-md-flex">
                  <ul className="list-wrap">
                    <li className="header-btn">
                      <a href="/dashboard/signin" className="btn btn-three">
                        <InjectableSvg
                          src="/assets/img/icon/right_arrow.svg"
                          alt=""
                          className="injectable"
                        />
                        SE CONNECTER
                      </a>
                    </li>
                  </ul>
                </div>

                <div
                  onClick={() => setIsActive(true)}
                  className="mobile-nav-toggler mobile-nav-toggler-two"
                >
                  <i className="tg-flaticon-menu-1"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileSidebar isActive={isActive} setIsActive={setIsActive} />
    </header>
  );
};

export default HeaderThree;
