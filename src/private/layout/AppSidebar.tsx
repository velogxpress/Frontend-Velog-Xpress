"use client";
import React, { useEffect, useRef, useState,useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  ChevronDownIcon,
  GridIcon,
  ListIcon,
  BoxIcon,
  TaskIcon,
  ChatIcon,
  HorizontaLDots,
  UserCircleIcon

} from "../icons/index";
import { jwtDecode } from "jwt-decode";
import { TruckIcon } from "lucide-react";
import { countUnreadFeedBack } from "@/services/FeedBackService";

type AccessType = "Admin" | "Agent" | "Client";


type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  access?: AccessType[];
  subItems?: { name: string; path: string; access?: AccessType[];pro?: boolean; new?: boolean }[];
};

type DecodedToken = {
  role?: string;
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard/admin",
    access: ["Admin"],
  },
  {
    name: "Configurations",
    icon: <ListIcon />,
    subItems: [
      { name: "Créer Ville", path: "/dashboard/admin/ville", access: ["Admin"], pro: false },
      { name: "Créer Catégorie", path: "/dashboard/admin/categorie", access: ["Admin","Agent"],pro: false },
      { name: "Frais Assurance", path: "/dashboard/admin/assurance", access: ["Admin"], pro: false },
      { name: "Frais par Livre", path: "/dashboard/admin/fepounds", access: ["Admin"], pro: false },
      { name: "Frais Spécial", path: "/dashboard/admin/specialfees", access: ["Admin"], pro: false },
      { name: "Taux du Jour", path: "/dashboard/admin/taux", access: ["Admin"], pro: false },
    { name: "Tableau de Frais", path: "/dashboard/admin/frais", access: ["Admin"], pro: false }],
  },
  {
    name: "Paramètres",
    icon: <TaskIcon />,
    access: ["Admin"],
    subItems: [{ name: "Shipping Adresse", path: "/dashboard/admin/shipping-address", access: ["Admin"], pro: false },
      { name: "Surcursale", path: "/dashboard/admin/surcursale", access: ["Admin"], pro: false },
    ],
  },
  {
    name: "Processus",
    icon: <BoxIcon />,
    access: ["Admin", "Agent", "Client"],
    subItems: [
      { name: "Créer Commandes", path: "/dashboard/admin/commande", access: ["Admin","Agent"], pro: false },
      { name: "Recevoir Commandes", path: "/dashboard/admin/recevoir-commandes", access: ["Admin","Agent"], pro: false },
      { name: "Check-in", path: "/dashboard/admin/checkin", access: ["Admin", "Agent"], pro: false },
      { name: "Storage", path: "/dashboard/admin/storage", access: ["Admin","Agent"], pro: false },
      { name: "Facture", path: "/dashboard/admin/facture", access: ["Admin","Agent"], pro: false },
      { name: "Contrôle Facture", path: "/dashboard/admin/controle-facture", access: ["Admin","Agent"], pro: false },
      { name: "Colis Amnisty", path: "/dashboard/admin/amnisty", access: ["Admin","Agent"], pro: false },
      { name: "Colis Clients", path: "/dashboard/admin/colis-clients", access: ["Admin","Agent"], pro: false },
      { name: "Livraison", path: "/dashboard/admin/livraison", access: ["Admin","Agent"], pro: false },
      { name: "Track Colis", path: "/dashboard/admin/track-colis", access: ["Admin","Agent","Client"], pro: false },
      { name: "Mes Colis", path: "/dashboard/admin/mes-colis", access: ["Admin","Agent","Client"], pro: false }
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <UserCircleIcon />,
    name: "Ressources Humaines",
    access: ["Admin","Agent"],
    subItems: [
      {
        name: "Créer Utilisateur",
        path: "/dashboard/admin/create-user",
        access: ["Admin","Agent"],
        pro: false,
      },
      {
        name: "Contrôle Agents",
        path: "/dashboard/admin/roles-permissions",
        access: ["Admin"],
        pro: false,
      },
    ],
  },
  {
    icon: <ChatIcon />,
    name: "Conversations",
    access: ["Admin","Agent","Client"],
    subItems: [
      { name: "Feedback", path: "/dashboard/admin/feedback", access: ["Client"], pro: false },
       { name: "Feedback reçus", path: "/dashboard/admin/feedback-inbox", access: ["Admin","Agent"], pro: false },
       { name: "Chat", path: "/dashboard/admin/chat", access: ["Admin","Agent"], pro: false },
    ],
  },

  {
    icon: <TruckIcon />,
    name: "Shipping",
    access: ["Admin","Agent"],
    subItems: [
      { name: "Pack Colis", path: "/dashboard/admin/pack-colis", access: ["Admin", "Agent"], pro: false, },
      { name: "Embarquement", path: "/dashboard/admin/embarquement", access: ["Admin","Agent"], pro: false, },
      {name: "Packing Consultation",path: "/dashboard/admin/packing",access: ["Admin","Agent"],pro: false,},
    ],
  },
];

const lastUpdateDate = "12 août 2026";
const lastUpdateFaqItems = [
  {
    question: "Kisa paj reset la montre apre modpas la chanje ?",
    answer:
      "Apre backend lan konfime chanjman an, chan modpas yo ak bouton reset la disparèt. Kliyan an wè sèlman yon mesaj siksè klè ak yon bouton Se connecter ki mennen li dirèkteman sou paj login lan.",
  },
  {
    question: "Poukisa nouvo modpas la pa t konn aplike malgre mesaj siksè a ?",
    answer:
      "Nouvo modpas la te konn pase nan URL la, sa ki te ka chanje karaktè espesyal yo. Kounye a li voye an sekirite nan kò JSON demann lan, backend lan fòse ekriti a nan bazdone a, epi paj la montre siksè sèlman lè backend lan konfime modpas la vrèman mete ajou.",
  },
  {
    question: "Kisa kliyan an resevwa nan email rekiperasyon an ?",
    answer:
      "Email la gen PIN rekiperasyon an ak yon bouton ki mennen dirèkteman sou paj validasyon OTP a avèk email kliyan an deja idantifye. Kliyan an valide menm PIN lan epi li kontinye chanje modpas li san li pa kreye yon dezyèm demann.",
  },
  {
    question: "Kijan yon ajan ede yon kliyan rekipere modpas li ?",
    answer:
      "Sou kat itilizatè a, bouton ki gen ikon kle a ouvri yon dyalòg sekirize. Ajan an ka kopye mesaj asistans lan oswa voye yon PIN rekiperasyon dirèkteman nan email kliyan an. Ansyen modpas la pa ka afiche paske li estoke sou fòm hash; kliyan an dwe kreye yon nouvo modpas.",
  },
  {
    question: "Èske Description lan rete disponib lè yon koli ap modifye ?",
    answer:
      "Wi. Modal edit la chaje otomatikman kategori ak Description koli ki te deja anrejistre a. Ajan an kapab modifye sèlman non kliyan, vil oswa nenpòt lòt chan san validation Description lan bloke anrejistreman an.",
  },
  {
    question: "Èske non kliyan an ka chanje lè yon koli modifye ?",
    answer:
      "Wi. Lè ajan an modifye yon koli Directe oswa Indirecte epi li chwazi yon lòt kliyan, non, telefòn ak imèl destinataire a mete ajou. Pou koli Directe, backend lan asosye koli a ak vrè kliyan ki koresponn ak ID ki chwazi a.",
  },
  {
    question: "Kijan seleksyon Description lan fonksyone kounye a ?",
    answer:
      "Lè yon kategori chwazi, lis Description lan ranpli ak opsyon kategori sa a men li pa chwazi anyen otomatikman. Ajan an dwe fè pwòp chwa li, epi apre save oswa yon nouvo chwa kategori, Description retounen vid san li pa bezwen rafrechi paj la.",
  },
  {
    question: "Kisa ki reset apre yon koli anrejistre ?",
    answer:
      "Apre save la, Type Colis, Destination ak Catégorie retounen vid epi lis opsyon yo rete disponib pou ajan an ka antre pwochen koli a san konfizyon. Commande ki seleksyone a toujou rete aktif.",
  },
  {
    question: "Ki lòt amelyorasyon ki fèt nan modal koli yo ?",
    answer:
      "Type Colis la retounen vid apre chak anrejistreman pou ajan an ka fè yon nouvo chwa. Modal modifye koli a ak modal transfè Amnisty a itilize menm prezantasyon klè ak modal kreyasyon an. Aperçu imaj yo nan Colis Clients ak Amnisty gen yon wotè kontwole pou foto yo rete pwopòsyonèl san yo pa lonje modal la.",
  },
  {
    question: "Kijan antre plizyè koli nan menm commande a amelyore ?",
    answer:
      "Apre yon koli anrejistre, fòm koli a netwaye men lis commande yo ak commande ki te seleksyone a rete aktif. Modal la montre klèman nan ki commande koli a prale, epi kat Enfòmasyon de la commande rafrechi otomatikman kantite koli ak total pwa apre ajoute, modifye, transfere oswa efase yon koli.",
  },
  {
    question: "Comment le menu latéral a-t-il été modernisé ?",
    answer:
      "Le sidebar dispose maintenant d’une meilleure hiérarchie visuelle, d’un indicateur d’espace selon le rôle, de menus actifs plus visibles, de sous-menus guidés, d’espacements plus confortables et d’un mode sombre harmonisé, sans modifier les accès ni la navigation.",
  },
  {
    question: "Comment le design du tableau de bord principal a-t-il été harmonisé ?",
    answer:
      "Les cartes du dashboard utilisent maintenant des bordures plus propres, des ombres légères, des couleurs cohérentes, un meilleur contraste en mode sombre et des interactions discrètes au survol, sans modifier leurs informations ni leur fonctionnement.",
  },
  {
    question: "Comment utiliser la nouvelle carte Rapport Général ?",
    answer:
      "La carte affiche maintenant les détails de la commande sélectionnée - numéro, date, quantité de colis et statut - avant de proposer deux actions clairement séparées pour télécharger ou imprimer le rapport.",
  },
  {
    question: "Comment un client doit-il configurer son adresse d’achat en ligne ?",
    answer:
      "Une FAQ illustrée sur la page Profil présente deux méthodes : ajouter le code identifiant après le nom complet, ou placer ce code dans Address Line 2. Le client doit choisir une seule méthode.",
  },
  {
    question: "Comment le nouvel espace Profil aide-t-il les clients ?",
    answer:
      "Le profil client présente maintenant clairement son identité, son code client, le statut du compte, ses coordonnées, la sécurité et l’adresse de livraison américaine à utiliser sur les boutiques en ligne. L’interface est plus accueillante et responsive.",
  },
  {
    question: "Comment partager une facture depuis Livraison ?",
    answer:
      "Le modal Facture prête de Livraison présente maintenant les informations de la facture et deux cartes d’action responsives pour imprimer le document ou l’envoyer au client par WhatsApp.",
  },
  {
    question: "Où la monnaie est-elle maintenant disponible lors du contrôle et de la livraison ?",
    answer:
      "Le modal Détails de facture dans Contrôle Facture affiche maintenant la monnaie. Les impressions lancées depuis Contrôle Facture et Livraison transmettent également le champ monnaie au print-agent afin d’éviter l’erreur 500 de print-json.",
  },
  {
    question: "Quelles interfaces opérationnelles ont été simplifiées pour les agents ?",
    answer:
      "Contrôle Facture dispose de modals de détails et de partage plus explicites. Check-in organise la réception par étapes et améliore le modal de notification. Livraison présente maintenant une recherche structurée et un modal de paiement clair avant la confirmation de remise du colis.",
  },
  {
    question: "La monnaie retournée apparaît-elle sur la facture ?",
    answer:
      "Oui. La facture PDF, le document partagé par WhatsApp et le message WhatsApp indiquent maintenant la monnaie calculée à partir du montant reçu, du total et du rabais. Par exemple, pour 207 $US payés avec 250 $US, la monnaie affichée est 43 $US.",
  },
  {
    question: "Comment choisir la méthode de partage d’une facture ?",
    answer:
      "Après le paiement, le modal affiche clairement les informations de la facture et deux cartes d’action distinctes : Imprimer la facture ou Envoyer par WhatsApp. L’interface est maintenant plus lisible et responsive pour les agents.",
  },
  {
    question: "Comment le modal de paiement des factures a-t-il été amélioré ?",
    answer:
      "Le modal Payroll présente maintenant le sous-total, l’assurance et le total dans des blocs distincts. Les champs Montant reçu et Rabais sont plus faciles à saisir, la monnaie à retourner est mise en évidence et les actions de confirmation sont plus claires pour les agents.",
  },
  {
    question: "Comment la page Colis Clients s’adapte-t-elle maintenant aux écrans ?",
    answer:
      "Le tableau a été remplacé par des cartes entièrement responsives. Chaque carte organise clairement le tracking, l’UPC, la commande, la catégorie, l’expéditeur, le destinataire, la livraison, la note et le statut.",
  },
  {
    question: "Quelle amélioration a été apportée au scanner caméra ?",
    answer:
      "Le scanner privilégie maintenant la caméra arrière, utilise une résolution plus élevée et un mode de détection renforcé pour lire les principaux formats QR et codes-barres sans afficher les échecs normaux de détection dans la console.",
  },
  {
    question: "Comment scanner rapidement un code dans une recherche ?",
    answer:
      "Une icône caméra est maintenant disponible dans les barres de recherche. Elle ouvre la caméra du téléphone pour lire un QR code ou un code-barres et lance la recherche avec la valeur détectée.",
  },
  {
    question: "Comment les colis électroniques apparaissent-ils dans Amnistie ?",
    answer:
      "Sur les cartes et dans les détails Amnistie, un colis électronique affiche QTE et sa valeur en unité(s). Les autres colis conservent Poids et lbs.",
  },
  {
    question: "Où trouver maintenant la liste globale des colis clients ?",
    answer:
      "La liste a été retirée du tableau de bord principal et déplacée dans Processus > Colis Clients. Cette page modernisée est réservée aux administrateurs et aux agents.",
  },
  {
    question: "Quelles nouvelles pages publiques sont disponibles ?",
    answer:
      "Le footer donne maintenant accès aux pages Privacy, Close account et Support pour consulter la confidentialité, demander la fermeture d’un compte ou obtenir de l’aide.",
  },
  {
    question: "Quel format est maintenant utilisé pour les factures temporaires ?",
    answer:
      "Les deux factures temporaires sont maintenant générées au format Letter 8,5 x 11 au lieu du format ticket 80 mm.",
  },
  {
    question: "Quelles informations ont été ajoutées au tableau des colis ?",
    answer:
      "Chaque colis affiche désormais sa date et son heure de création au format français sur 12 heures, ainsi que sa note lorsqu'elle est disponible.",
  },
  {
    question: "Comment les colis électroniques sont-ils affichés ?",
    answer:
      "Un colis électronique affiche la quantité enregistrée dans le champ pounds avec la mention UNITÉ. Par exemple, une quantité de 2 apparaît comme 2 UNITÉ. Un colis normal conserve son poids avec LBS.",
  },
  {
    question: "Qu'est-ce qui a changé sur les cards de consultation des commandes ?",
    answer:
      "Sur la page Commande, la card d'un colis électronique affiche maintenant QTE et une valeur en unité(s) à la place de Poids et lbs. Les colis non électroniques conservent l'affichage du poids en lbs.",
  },
  {
    question: "Comment l'interface de création des factures a-t-elle été améliorée ?",
    answer:
      "La page Facture dispose maintenant d'un en-tête avec le montant actuel, d'un tableau de colis plus lisible avec un état vide, et d'une card de résumé client et paiement mieux structurée. L'affichage est plus clair sur ordinateur, mobile et en mode sombre, sans modifier les calculs ni les actions existantes.",
  },
  {
    question: "Comment la présentation de la facture a-t-elle été améliorée ?",
    answer:
      "Les informations du client et le résumé des montants sont regroupés dans des blocs compacts. L'agent est intégré au tableau des totaux et la section des méthodes de paiement utilise toute la largeur disponible.",
  },
  {
    question: "Que se passe-t-il si un bouton de téléchargement dans l'email ne s'ouvre pas ?",
    answer:
      "L'adresse complète du document est maintenant affichée sous chaque bouton. Le client peut la copier et la coller directement dans la barre d'adresse de son navigateur.",
  },
  {
    question: "Quels problèmes de liens email et WhatsApp ont été corrigés ?",
    answer:
      "Les noms de fichiers sont encodés dans les URL afin de gérer correctement les espaces, accents et caractères spéciaux. Les liens WhatsApp utilisent également cet encodage.",
  },
  {
    question: "Quelle correction a été apportée aux erreurs 404 ?",
    answer:
      "Le serveur n'utilise plus un chemin local écrit en dur pour les documents. Il résout maintenant le dossier public à partir de la configuration file.upload-dir de chaque environnement, tout en conservant les anciens noms de fichiers.",
  },
];

const filterMenuByAccess = (
  items: NavItem[],
  access: AccessType | null
): NavItem[] => {
  if (!access) return [];

  return items
    .filter((item) => !item.access || item.access.includes(access))
    .map((item) => ({
      ...item,
      subItems: item.subItems?.filter(
        (sub) => !sub.access || sub.access.includes(access)
      ),
    }))
    .filter((item) => !item.subItems || item.subItems.length > 0);
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [access, setAccess] = useState<AccessType | null>(null);
  const [unreadFeedbackCount, setUnreadFeedbackCount] = useState(0);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setAccess(null);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(storedToken);
      const role = decoded.role?.toUpperCase();

      if (role === "ADMIN") {
        setAccess("Admin");
      } else if (role === "AGENT") {
        setAccess("Agent");
      } else if (role === "CLIENT") {
        setAccess("Client");
      } else {
        setAccess(null);
      }
    } catch (error) {
      console.error("Failed to decode token:", error);
      setAccess(null);
    }
  }, []);

  useEffect(() => {
    if (access !== "Admin" && access !== "Agent") {
      setUnreadFeedbackCount(0);
      return;
    }

    const fetchUnreadFeedbackCount = async () => {
      try {
        const response = await countUnreadFeedBack();
        setUnreadFeedbackCount(response?.data ?? 0);
      } catch (error) {
        console.error("Error fetching unread feedback count:", error);
        setUnreadFeedbackCount(0);
      }
    };

    fetchUnreadFeedbackCount();
    const interval = window.setInterval(fetchUnreadFeedbackCount, 60000);
    window.addEventListener("feedback-notifications-updated", fetchUnreadFeedbackCount);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("feedback-notifications-updated", fetchUnreadFeedbackCount);
    };
  }, [access]);

  const filteredNavItems = filterMenuByAccess(navItems, access);
  const filteredOthersItems = filterMenuByAccess(othersItems, access);

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-2">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {nav.name === "Conversations" &&
                unreadFeedbackCount > 0 &&
                (access === "Admin" || access === "Agent") &&
                (isExpanded || isHovered || isMobileOpen) && (
                  <span className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-error-500 text-xs font-semibold leading-none text-white">
                    {unreadFeedbackCount > 9 ? "9+" : unreadFeedbackCount}
                  </span>
                )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="relative ml-5 mt-2 space-y-1 border-l border-gray-200 pl-4 dark:border-gray-800">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
   const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname,isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <>
    <aside
      className={`fixed left-0 top-0 z-50 mt-16 flex h-screen flex-col border-r border-gray-200 bg-gradient-to-b from-white via-white to-gray-50/80 px-4 text-gray-900 shadow-[8px_0_30px_rgba(16,24,40,0.04)] transition-all duration-300 ease-in-out dark:border-gray-800 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 lg:mt-0 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex min-h-[88px] items-center border-b border-gray-100 py-5 dark:border-gray-800 ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        {typeof window !== "undefined" ? (() => {

          const href =
            access === "Admin"
              ? "/dashboard/admin"
              : access === "Agent"
              ? "/dashboard/admin/activites"
              : "/dashboard/admin/profile";

          return (
            <Link href={href} className="flex items-center gap-3 rounded-xl transition hover:opacity-90">
              {isExpanded || isHovered || isMobileOpen ? (
                <>
                  <span className="flex min-w-0 flex-col gap-1">
                    <Image className="dark:hidden" src="/images/logo/logo.svg" alt="Logo" width={150} height={40} />
                    <Image className="hidden dark:block" src="/images/logo/logo-dark.svg" alt="Logo" width={150} height={40} />
                    <span className="w-fit rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">Espace {access ?? "Utilisateur"}</span>
                  </span>
                </>
              ) : (
                <Image
                  src="/images/logo/logo-icon.svg"
                  alt="Logo"
                  width={32}
                  height={32}
                />
              )}
            </Link>
          );
        })() : (
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-6">
            <div>
              <h2
                className={`mb-3 flex text-[11px] font-semibold uppercase leading-[20px] tracking-[0.16em] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(filteredNavItems, "main")}
              {/* {renderMenuItems(navItems, "main")} */}
            </div>

            <div className="">
              <h2
                className={`mb-3 flex text-[11px] font-semibold uppercase leading-[20px] tracking-[0.16em] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Autres"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(filteredOthersItems, "others")}
              {/* {renderMenuItems(othersItems, "others")} */}
            </div>
          </div>
        </nav>
        
      </div>
      {(access === "Admin" || access === "Agent") && (
        <div className="border-t border-gray-100 pb-5 pt-4 dark:border-gray-800">
          <button
            type="button"
            title="Voir les détails de la dernière actualisation"
            onClick={() => setIsUpdateModalOpen(true)}
            className={`relative w-full overflow-hidden rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-blue-100/60 text-left shadow-theme-xs transition duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md dark:border-brand-500/15 dark:from-brand-500/10 dark:to-blue-500/5 ${
              isExpanded || isHovered || isMobileOpen ? "p-4" : "p-3"
            }`}
          >
            {isExpanded || isHovered || isMobileOpen ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
                  Dernière actualisation
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-white/90">
                  {lastUpdateDate}
                </p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Cliquez pour voir les détails.
                </p>
              </>
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-xs font-semibold text-white">
                DA
              </span>
            )}
          </button>
        </div>
      )}
    </aside>
    {(access === "Admin" || access === "Agent") && isUpdateModalOpen && (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/50 px-4 py-6">
        <div className="flex max-h-[88vh] w-full max-w-3xl flex-col rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">
                Dernière actualisation
              </p>
              <h3 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                Mise à jour du {lastUpdateDate}
              </h3>
            </div>
            <button
              type="button"
              title="Fermer la fenêtre des actualisations"
              onClick={() => setIsUpdateModalOpen(false)}
              className="rounded-lg border border-gray-200 px-3 py-1 text-sm text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
            >
              Fermer
            </button>
          </div>
          <div className="mt-6 space-y-3 overflow-y-auto pr-2">
            {lastUpdateFaqItems.map((item) => (
              <div
                key={item.question}
                className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-white/[0.06] dark:bg-white/[0.03]"
              >
                <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  {item.question}
                </h4>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default AppSidebar;
