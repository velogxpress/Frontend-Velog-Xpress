/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import menu_data from "@/data/MenuData";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const MobileMenu = () => {
   const currentRoute = usePathname();
   const [navTitle, setNavTitle] = useState("");
   const [subNavTitle, setSubNavTitle] = useState("");

   const isMenuItemActive = (menuLink: string) => {
      return currentRoute === menuLink;
   };

   const isSubMenuItemActive = (subMenuLink: string) => {
      return currentRoute === subMenuLink;
   };

   //openMobileMenu
   const openMobileMenu = (menu: any) => {
      if (navTitle === menu) {
         setNavTitle("");
      } else {
         setNavTitle(menu);
      }
   };

   //openMobileSubMenu
   const openMobileSubMenu = (sub_m: any) => {
      if (subNavTitle === sub_m) {
         setSubNavTitle("");
      } else {
         setSubNavTitle(sub_m);
      }
   };

   return (
      <ul className="navigation">
         {menu_data.map((menu) => (
            <li key={menu.id} onClick={() => openMobileMenu(menu.title)} className={menu.sub_menus ? "menu-item-has-children" : ""}>
               <Link href={menu.link}
                  className={`${(isMenuItemActive(menu.link) || (menu.sub_menus && menu.sub_menus.some((sub_m) => sub_m.link && isSubMenuItemActive(sub_m.link)))) ? "active" : ""}`}>
                  {menu.title}
                  {menu.sub_menus && <div className={`dropdown-btn ${navTitle === menu.title ? "open" : ""}`}><span className="plus-line"></span></div>}
               </Link>
               {menu.has_dropdown && (
                  <>
                     {menu.sub_menus && (
                        <ul className="sub-menu" style={{ display: navTitle === menu.title ? "block" : "none" }}>
                           {menu.sub_menus.map((sub_m, i) => (
                              <li key={i} onClick={() => openMobileSubMenu(sub_m.title)} className={sub_m.mega_menu ? "menu-item-has-children" : ""}>
                                 <Link href={sub_m.link} className={`${sub_m.link && isSubMenuItemActive(sub_m.link) ? "active" : ""}`}>
                                    {sub_m.title}
                                 </Link>
                                 {sub_m.mega_menu && <div className={`dropdown-btn ${subNavTitle === sub_m.title ? "open" : ""}`}><span className="plus-line"></span></div>}
                                 {sub_m.mega_menu && (
                                    <ul className="sub-menu" style={{ display: subNavTitle === sub_m.title ? "block" : "none" }}>
                                       {sub_m.mega_menu.map((mega_m, i) => (
                                          <li key={i}>
                                             <Link href={mega_m.link} className={`${mega_m.link && isSubMenuItemActive(mega_m.link) ? "active" : ""}`}>
                                                {mega_m.title}
                                             </Link>
                                          </li>
                                       ))}
                                    </ul>
                                 )}
                              </li>
                           ))}
                        </ul>
                     )}
                  </>
               )}
            </li>
         ))}
      </ul>
   );
};

export default MobileMenu;