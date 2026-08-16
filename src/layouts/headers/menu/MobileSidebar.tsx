import Image from "next/image";
import Link from "next/link";

import NavMenu from "./NavMenu";

interface MobileSidebarProps {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}

const MobileSidebar = ({ isActive, setIsActive }: MobileSidebarProps) => {
  return (
    <div className={isActive ? "mobile-menu-visible" : ""}>
      <div className="tgmobile__menu">
        <nav className="tgmobile__menu-box">
          <div onClick={() => setIsActive(false)} className="close-btn">
            <i className="tg-flaticon-close"></i>
          </div>

          <div className="nav-logo">
            <Link href="/">
              <Image
                src="/assets/img/logo/VELOG-01.svg"
                alt="Logo"
                width={160}
                height={50}
              />
            </Link>
          </div>

          <div className="tgmobile__menu-outer">
            <NavMenu />
          </div>
        </nav>
      </div>

      <div
        className="tgmobile__menu-backdrop"
        onClick={() => setIsActive(false)}
      ></div>
    </div>
  );
};

export default MobileSidebar;
