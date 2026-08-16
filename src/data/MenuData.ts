interface MenuItem {
   id: number;
   title: string;
   link: string;
   has_dropdown: boolean;
   sub_menus?: {
      link: string;
      title: string;
      mega_menu?: {
         link: string;
         title: string;
      }[];
   }[];
};

const menu_data: MenuItem[] = [
  {
    id: 1,
    has_dropdown: true,
    title: "Accueil",
    link: "/",
  },
  {
    id: 2,
    has_dropdown: false,
    title: "Qui Sommes-nous?",
    link: "/about",
  },
  {
    id: 3,
    has_dropdown: true,
    title: "Confidentialité",
    link: "#",
    sub_menus: [
      { link: "/confidentialite", title: "Politique" },
      { link: "/condition", title: "Termes & Conditions" },
      { link: "/marchandise", title: "Marchandises dangereuses et interdites" },
    ],
  },
  {
    id: 6,
    has_dropdown: false,
    title: "Contact",
    link: "/contact",
  },
];
export default menu_data;
