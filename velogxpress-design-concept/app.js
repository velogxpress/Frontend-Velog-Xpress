(function () {
  "use strict";

  const app = document.getElementById("app");
  const surface = document.body.dataset.surface || "public";
  const publicPage = document.body.dataset.page || "home";

  const asset = (name) => `assets/${name}`;
  const currentYear = new Date().getFullYear();

  const publicNav = [
    ["Accueil", "index.html", "home"],
    ["Qui sommes-nous", "about.html", "about"],
    ["Support", "support.html", "support"],
    ["Contact", "contact.html", "contact"]
  ];

  const header = (active) => `
    <div class="utility-bar">
      <div class="container utility-inner">
        <span>● Miami → Haïti · Départs chaque semaine</span>
        <span>Lun–Sam, 9:00–17:00 · +1 (973) 640-6064</span>
      </div>
    </div>
    <header class="site-header">
      <div class="container nav-inner">
        <a class="brand" href="index.html" aria-label="Velog Xpress, accueil"><img src="${asset("velog-logo.svg")}" alt="Velog Xpress"></a>
        <nav class="main-nav" id="main-nav" aria-label="Navigation principale">
          ${publicNav.map(([label, href, key]) => `<a href="${href}" class="${active === key ? "active" : ""}">${label}</a>`).join("")}
          <div class="nav-dropdown">
            <button type="button" data-dropdown aria-expanded="false">Informations <span>⌄</span></button>
            <div class="nav-dropdown-panel">
              <a href="confidentialite.html">Politique de confidentialité</a>
              <a href="condition.html">Termes et conditions</a>
              <a href="marchandise.html">Marchandises réglementées</a>
              <a href="privacy.html">Privacy</a>
              <a href="close-account.html">Fermer mon compte</a>
            </div>
          </div>
        </nav>
        <button class="menu-button" type="button" data-menu aria-label="Ouvrir le menu">☰</button>
        <div class="nav-actions">
          <a class="btn btn-sm btn-ghost" href="auth.html#signin">Se connecter</a>
          <a class="btn btn-sm" href="tracking.html">Suivre un colis</a>
        </div>
      </div>
    </header>`;

  const footer = () => `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <a class="footer-brand" href="index.html"><img src="${asset("velog-logo.svg")}" alt="Velog Xpress"></a>
          <p style="max-width:310px;margin-top:18px">Des solutions logistiques fiables entre les États-Unis et Haïti, avec une visibilité claire à chaque étape.</p>
          <div class="socials"><span>FB</span><span>IG</span><span>TT</span><span>WA</span></div>
        </div>
        <div>
          <h3>Navigation</h3>
          <div class="footer-links"><a href="index.html">Accueil</a><a href="about.html">Qui sommes-nous</a><a href="tracking.html">Suivi colis</a><a href="contact.html">Contact</a></div>
        </div>
        <div>
          <h3>Informations</h3>
          <div class="footer-links"><a href="confidentialite.html">Confidentialité</a><a href="condition.html">Conditions</a><a href="marchandise.html">Marchandises</a><a href="close-account.html">Fermer mon compte</a></div>
        </div>
        <div>
          <h3>Nous joindre</h3>
          <p>2031 Tyler Street<br>Hollywood, FL 33020</p>
          <p>support@velogxpress.com<br>+1 (973) 640-6064</p>
        </div>
      </div>
      <div class="container footer-bottom"><span>© ${currentYear} Velog Xpress. Tous droits réservés.</span><span>Transport simple. Suivi transparent. Livraison fiable.</span></div>
    </footer>`;

  const home = () => `
    <main>
      <section class="hero">
        <div class="container hero-grid">
          <div class="hero-copy">
            <p class="eyebrow">Logistique États-Unis ↔ Haïti</p>
            <h1>Vos colis avancent. Vous le <span>savez toujours.</span></h1>
            <p class="lede">Transport aérien et maritime avec un suivi clair, des délais prévisibles et une équipe disponible du dépôt jusqu’à la livraison.</p>
            <div class="hero-actions">
              <a class="btn btn-green" href="tracking.html">Suivre mon colis <span>→</span></a>
              <a class="btn btn-ghost" href="auth.html#signup">Créer un compte</a>
            </div>
            <div class="hero-notes"><span>Suivi en temps réel</span><span>Tarifs transparents</span><span>Support bilingue</span></div>
          </div>
          <div class="hero-visual" aria-label="Illustration du service de transport Velog Xpress">
            <div class="hero-plane"><div class="route-line"></div><img src="${asset("hero-cargo.png")}" alt="Avion cargo et colis"></div>
            <div class="visual-label"><span class="icon-box green">✓</span><div><strong>Colis pris en charge</strong><small>Miami · Aujourd’hui, 10:42</small></div></div>
            <div class="delivery-card"><span class="tag green"><span class="status-dot"></span> En transit</span><p>Livraison estimée<br><strong style="color:var(--ink)">Jeudi 20 août</strong></p><div class="mini-progress"><span></span></div></div>
          </div>
        </div>
      </section>
      <div class="container quick-track-wrap">
        <div class="quick-track">
          <div><h3>Où est votre colis ?</h3><p>Entrez un numéro de tracking ou UPC.</p></div>
          <form class="track-input" data-demo-form data-action="tracking"><input aria-label="Numéro de suivi" placeholder="Ex. VX-2408-98172"><button class="btn btn-sm" type="submit">Rechercher</button></form>
          <a href="tracking.html" style="color:var(--navy);font-size:13px;font-weight:800">Aide au suivi →</a>
        </div>
      </div>
      <div class="container logo-strip" aria-label="Transporteurs partenaires"><div class="logo-word">DHL</div><div class="logo-word">FEDEX</div><div class="logo-word">UPS</div><div class="logo-word">USPS</div><div class="logo-word">SHIPPEX</div></div>

      <section class="section">
        <div class="container">
          <div class="section-head"><div><p class="eyebrow">Solutions adaptées</p><h2>Une route claire pour chaque envoi.</h2></div><p>Choisissez la rapidité de l’aérien, la capacité du maritime ou notre accompagnement douanier.</p></div>
          <div class="service-grid">
            <article class="service-card"><img src="${asset("air-freight.jpg")}" alt="Fret aérien"><div class="service-content"><span class="tag green">Le plus rapide</span><h3>Fret aérien <span>↗</span></h3><p>Départs réguliers, traitement prioritaire et suivi détaillé pour vos achats et petits colis.</p></div></article>
            <article class="service-card"><img src="${asset("sea-freight.jpg")}" alt="Transport maritime"><div class="service-content"><span class="tag">Grande capacité</span><h3>Fret maritime <span>↗</span></h3><p>Une solution économique pour les marchandises lourdes, volumineuses ou en grande quantité.</p></div></article>
            <article class="service-card"><img src="${asset("customs.jpg")}" alt="Gestion logistique"><div class="service-content"><span class="tag">Accompagnement</span><h3>Gestion douanière <span>↗</span></h3><p>Documentation, conformité et coordination locale pour réduire les blocages à l’arrivée.</p></div></article>
          </div>
        </div>
      </section>

      <section class="section section-navy">
        <div class="container">
          <div class="section-head"><div><p class="eyebrow" style="color:#a9dc89">Comment ça marche</p><h2>Quatre étapes. Zéro surprise.</h2></div><p style="color:rgba(255,255,255,.62)">Votre espace client centralise l’adresse d’achat, le suivi, les factures et l’historique.</p></div>
          <div class="workflow">
            <article class="workflow-step"><span class="step-number">1</span><h3>Créez votre compte</h3><p>Recevez votre code client et votre adresse personnalisée aux États-Unis.</p></article>
            <article class="workflow-step"><span class="step-number">2</span><h3>Envoyez vos achats</h3><p>Utilisez votre adresse Velog sur Amazon, Temu, Shein et vos autres boutiques.</p></article>
            <article class="workflow-step"><span class="step-number">3</span><h3>Suivez chaque étape</h3><p>Recevez une mise à jour à la réception, au départ et à l’arrivée.</p></article>
            <article class="workflow-step"><span class="step-number">4</span><h3>Récupérez sereinement</h3><p>Consultez votre facture puis choisissez la succursale ou la livraison.</p></article>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container about-split">
          <div class="photo-stack"><img src="${asset("about-team.jpeg")}" alt="Équipe Velog Xpress"><img src="${asset("about-operation.jpeg")}" alt="Opérations logistiques Velog Xpress"></div>
          <div>
            <p class="eyebrow">Une équipe entre deux pays</p><h2>La technologie pour la visibilité. L’humain pour la confiance.</h2>
            <p>Velog Xpress coordonne transport, réception, facturation et service client dans une expérience unique conçue pour les réalités du corridor États-Unis–Haïti.</p>
            <div class="feature-list">
              <div class="feature-item"><span class="icon-box green">01</span><div><h4>Une information utile au bon moment</h4><p>Statut, prochaine étape, montant et point de retrait restent faciles à comprendre.</p></div></div>
              <div class="feature-item"><span class="icon-box">02</span><div><h4>Un support proche du terrain</h4><p>Une équipe disponible en français et en créole pour résoudre rapidement les imprévus.</p></div></div>
            </div>
            <div class="metric-row"><div class="metric"><strong>2 pays</strong><span>Une seule expérience</span></div><div class="metric"><strong>7j/7</strong><span>Suivi accessible</span></div><div class="metric"><strong>100%</strong><span>Traçabilité interne</span></div></div>
          </div>
        </div>
      </section>

      <section class="section section-soft">
        <div class="container">
          <div class="testimonial"><div><p class="eyebrow">Pensé pour nos clients</p><h2>Une expérience qui rassure.</h2></div><div><p class="quote">“Je sais quand mon colis est reçu, combien je dois payer et quand je peux le récupérer. Je n’ai plus besoin d’appeler pour chaque étape.”</p><strong>— Nadia P.</strong><p style="font-size:13px">Cliente Velog Xpress · Port-au-Prince</p></div></div>
        </div>
      </section>
      <section class="section"><div class="container"><div class="cta-band"><div><h2>Prêt à simplifier vos prochains envois ?</h2><p>Créez votre espace Velog Xpress en quelques minutes.</p></div><a class="btn" href="auth.html#signup">Créer mon compte →</a></div></div></section>
    </main>`;

  const pageHero = (title, intro) => `
    <section class="page-hero"><div class="container"><div class="breadcrumb"><a href="index.html">Accueil</a><span>›</span><span>${title}</span></div><h1>${title}</h1><p>${intro}</p></div></section>`;

  const publicPages = {
    about: {
      title: "Plus qu’un transporteur, un partenaire de confiance.",
      intro: "Nous rapprochons les familles, les entrepreneurs et leurs achats grâce à une logistique simple entre les États-Unis et Haïti.",
      body: `
        <section class="section"><div class="container about-split"><div class="photo-stack"><img src="${asset("about-team.jpeg")}" alt="Équipe Velog Xpress"><img src="${asset("about-operation.jpeg")}" alt="Opérations Velog Xpress"></div><div><p class="eyebrow">Notre histoire</p><h2>Une entreprise construite autour de la fiabilité.</h2><p>Velog Xpress est née d’une idée simple : le client ne devrait jamais avoir à deviner où se trouve son colis. Notre équipe relie les opérations de Miami à nos succursales en Haïti avec des processus transparents et un accompagnement de proximité.</p><div class="feature-list"><div class="feature-item"><span class="icon-box green">M</span><div><h4>Notre mission</h4><p>Rendre le transport international accessible, prévisible et humain.</p></div></div><div class="feature-item"><span class="icon-box">V</span><div><h4>Notre vision</h4><p>Devenir la référence de confiance du commerce et de la logistique sur le corridor Haïti–États-Unis.</p></div></div></div></div></div></section>
        <section class="section section-soft"><div class="container"><div class="section-head"><div><p class="eyebrow">Nos principes</p><h2>Ce qui guide chaque livraison.</h2></div></div><div class="support-grid"><article class="support-card"><span class="icon-box green">01</span><h3>Transparence</h3><p>Des statuts compréhensibles et des coûts expliqués avant la remise.</p></article><article class="support-card"><span class="icon-box">02</span><h3>Rigueur</h3><p>Des contrôles précis à chaque changement de responsabilité.</p></article><article class="support-card"><span class="icon-box green">03</span><h3>Proximité</h3><p>Une équipe qui connaît les réalités de ses clients et de leurs destinations.</p></article></div></div></section>`
    },
    contact: {
      title: "Parlons de votre prochain envoi.",
      intro: "Une question sur votre compte, un colis ou une livraison ? Choisissez le canal qui vous convient.",
      body: `
        <section class="section section-soft"><div class="container contact-grid"><div class="contact-panel"><p class="eyebrow">Coordonnées</p><h2>Notre équipe est disponible.</h2><p>Pour un traitement plus rapide, préparez votre numéro de tracking, UPC ou facture.</p><div class="contact-list"><div class="contact-item"><span class="icon-box green">WA</span><div><strong>WhatsApp</strong><span>+1 (973) 640-6064 · réponse rapide</span></div></div><div class="contact-item"><span class="icon-box">@</span><div><strong>E-mail</strong><span>support@velogxpress.com</span></div></div><div class="contact-item"><span class="icon-box green">FL</span><div><strong>Miami / Hollywood</strong><span>2031 Tyler Street, Hollywood, FL 33020</span></div></div><div class="contact-item"><span class="icon-box">HT</span><div><strong>Haïti</strong><span>Consultez la liste des succursales dans votre espace.</span></div></div></div></div>
        <form class="form-card form-grid" data-demo-form><div class="field"><label>Nom complet</label><input required placeholder="Votre nom"></div><div class="field"><label>Téléphone</label><input required placeholder="+509 / +1"></div><div class="field full"><label>Adresse e-mail</label><input type="email" placeholder="nom@exemple.com"></div><div class="field full"><label>Sujet</label><select><option>Suivi d’un colis</option><option>Facturation</option><option>Compte et connexion</option><option>Autre demande</option></select></div><div class="field full"><label>Votre message</label><textarea required placeholder="Décrivez votre demande et ajoutez le numéro concerné."></textarea></div><div class="field full"><button class="btn btn-green" type="submit">Envoyer la demande →</button></div></form></div></section>`
    },
    support: {
      title: "Comment pouvons-nous vous aider ?",
      intro: "Trouvez rapidement une réponse, suivez votre colis ou transmettez une demande complète à notre équipe.",
      body: `
        <section class="section section-soft"><div class="container"><div class="support-grid"><a class="support-card" href="tracking.html"><span class="icon-box green">TR</span><h3>Suivre un colis</h3><p>Consultez le statut, l’historique et la prochaine étape de livraison.</p></a><article class="support-card"><span class="icon-box">$</span><h3>Comprendre une facture</h3><p>Retrouvez le poids, les frais, le rabais, le paiement et la monnaie.</p></article><article class="support-card"><span class="icon-box green">ID</span><h3>Compte et mot de passe</h3><p>Récupérez l’accès, mettez à jour votre profil ou demandez une fermeture.</p></article></div></div></section>
        <section class="section"><div class="container content-grid"><div><p class="eyebrow">Questions fréquentes</p><h2>Les réponses les plus utiles.</h2>${["Comment utiliser mon adresse Velog pour un achat en ligne ?","Que signifie le statut « En transit » ?","Quand ma facture devient-elle disponible ?","Puis-je changer ma succursale de livraison ?"].map((q,i)=>`<article class="article-card"><h3>${q}</h3><p>${["Ajoutez votre code client après votre nom ou dans Address Line 2 — une seule méthode suffit.","Votre colis a quitté le point précédent et se dirige vers la prochaine installation Velog.","Elle apparaît après le contrôle du colis et le calcul final des frais applicables.","Contactez le support avant l’arrivée du colis afin que l’équipe vérifie les options disponibles."][i]}</p></article>`).join("")}</div><aside class="side-card"><span class="tag green">Support direct</span><h3 style="margin-top:18px">Vous n’avez pas trouvé ?</h3><p>Envoyez votre numéro de tracking et une description du problème. Nous préparerons la réponse avant de vous recontacter.</p><a class="btn btn-green" href="contact.html">Contacter l’équipe</a></aside></div></section>`
    }
  };

  const legalContent = {
    confidentialite: ["Politique de confidentialité", "Velog Xpress protège les informations confiées lors de la création d’un compte, d’une commande et du suivi d’un colis.", [
      ["1. Informations collectées", "Nous collectons les coordonnées, informations de livraison, détails de colis, transactions et données techniques nécessaires au fonctionnement du service."],
      ["2. Utilisation des données", "Ces données servent à gérer le transport, le suivi, la facturation, la sécurité du compte, les notifications et le service client."],
      ["3. Partage et protection", "L’accès est limité aux équipes et partenaires autorisés. Les informations ne sont transmises que lorsque la livraison, le paiement ou la loi l’exige."],
      ["4. Vos droits", "Vous pouvez demander l’accès, la correction ou la suppression de vos données en contactant notre équipe de support."]
    ]],
    privacy: ["Privacy", "Une présentation claire de la manière dont vos informations personnelles sont utilisées et protégées.", [
      ["Données utilisées", "Nous utilisons uniquement les informations nécessaires au transport, au suivi, à la facturation et au service client."],
      ["Protection et partage", "Les accès sont limités aux personnes autorisées et aux partenaires nécessaires à la livraison."],
      ["Vos choix", "Vous pouvez demander l’accès, la correction ou la suppression de vos données via le support."]
    ]],
    condition: ["Termes et conditions", "Les règles essentielles pour utiliser les services Velog Xpress de manière sûre et transparente.", [
      ["1. Acceptation du service", "L’utilisation de nos services implique l’acceptation des règles de dépôt, de transport, de paiement et de livraison présentées ici."],
      ["2. Déclaration des marchandises", "Le client doit fournir une description exacte, la valeur et toute information utile concernant le contenu du colis."],
      ["3. Tarifs et paiements", "Les frais dépendent du poids, du volume, de la catégorie, de l’assurance, de la destination et des services additionnels."],
      ["4. Retrait et livraison", "Une pièce d’identité ou une autorisation peut être demandée avant toute remise afin de protéger le propriétaire du colis."],
      ["5. Réclamations", "Toute anomalie doit être signalée rapidement avec le numéro de suivi, des photos et les documents disponibles."]
    ]],
    "close-account": ["Fermer mon compte", "Vous pouvez demander la fermeture de votre compte Velog Xpress à tout moment.", [
      ["1. Envoyer la demande", "Contactez le support avec le nom, le téléphone et l’adresse e-mail associés au compte. Ne communiquez jamais votre mot de passe."],
      ["2. Vérification", "Notre équipe vérifiera votre identité afin de protéger votre compte contre les demandes non autorisées."],
      ["3. Données conservées", "Certaines informations liées aux paiements, expéditions ou obligations légales peuvent être conservées pendant la durée exigée."],
      ["4. Confirmation", "Un message de confirmation vous sera envoyé lorsque la demande sera traitée."]
    ]]
  };

  const legalPage = (key) => {
    const [title, intro, sections] = legalContent[key];
    return `${pageHero(title, intro)}<section class="section section-soft"><div class="container content-grid"><div>${sections.map(([heading, content])=>`<article class="article-card"><h3>${heading}</h3><p>${content}</p></article>`).join("")}</div><aside class="side-card"><span class="tag green">Document simplifié</span><h3 style="margin-top:18px">Besoin d’une précision ?</h3><p>Notre équipe peut expliquer comment ces règles s’appliquent à votre compte ou à un envoi spécifique.</p><a class="btn btn-green" href="contact.html">Nous contacter</a></aside></div></section>`;
  };

  const merchandisePage = () => `${pageHero("Marchandises dangereuses et interdites", "Vérifiez votre article avant l’expédition afin d’éviter les retards, retours ou saisies.")}
    <section class="section section-soft"><div class="container"><div class="notice"><strong>Important</strong><span>Cette liste est indicative. Les règles peuvent varier selon le transporteur, le mode d’expédition et la réglementation applicable.</span></div><div class="section-head" style="margin-top:46px"><div><p class="eyebrow">Articles interdits</p><h2>Ne placez jamais ces produits dans votre colis.</h2></div></div><div class="danger-grid">${[
      ["EXP", "Explosifs et feux d’artifice", "Pétards, munitions, fusées et composants explosifs."],
      ["FLM", "Produits inflammables", "Essence, alcool concentré, solvants, peintures et aérosols non autorisés."],
      ["ARM", "Armes et objets réglementés", "Armes à feu, pièces essentielles, dispositifs de défense et articles assimilés."],
      ["DRG", "Substances illégales", "Drogues, médicaments contrôlés sans prescription et produits interdits."],
      ["CUR", "Argent et valeurs", "Espèces, cartes prépayées, titres négociables et métaux précieux non déclarés."],
      ["BIO", "Matières biologiques", "Échantillons, déchets médicaux, animaux et produits biologiques réglementés."]
    ].map(([code,title,text])=>`<article class="danger-item"><span class="icon-box">${code}</span><div><strong>${title}</strong><p>${text}</p></div></article>`).join("")}</div><div class="cta-band" style="margin-top:48px"><div><h2>Vous avez un doute sur un article ?</h2><p>Envoyez une photo, la fiche produit et la quantité à notre équipe avant l’achat.</p></div><a class="btn" href="contact.html">Faire vérifier l’article</a></div></div></section>`;

  function renderPublic() {
    let body = "";
    if (publicPage === "home") body = home();
    else if (publicPages[publicPage]) {
      const page = publicPages[publicPage];
      body = `${pageHero(page.title, page.intro)}${page.body}`;
    } else if (publicPage === "marchandise") body = merchandisePage();
    else body = legalPage(publicPage);
    app.innerHTML = `${header(publicPage)}${body}${footer()}${globalUi()}`;
  }

  const trackingShell = () => `
    <div class="tracking-page">
      <header class="simple-header"><div class="container"><a class="brand" href="index.html"><img src="${asset("velog-logo.svg")}" alt="Velog Xpress"></a><div style="display:flex;gap:10px"><a class="btn btn-sm btn-ghost" href="support.html">Besoin d’aide ?</a><a class="btn btn-sm" href="auth.html#signin">Mon compte</a></div></div></header>
      <section class="tracking-hero"><div class="container"><p class="eyebrow" style="color:#a9dc89">Suivi public</p><h1>Suivez votre colis en toute clarté.</h1><p>Un seul numéro pour consulter le statut, l’emplacement et la prochaine étape.</p><form class="large-search" data-tracking-search><input value="VX-2408-98172" aria-label="Numéro de tracking"><button class="btn btn-green" type="submit">Afficher le suivi</button></form></div></section>
      <main class="container tracking-content">
        <section class="tracking-card">
          <div class="package-head"><div><p class="eyebrow">Tracking VX-2408-98172</p><h2>Miami → Port-au-Prince</h2><p>Livraison estimée : jeudi 20 août</p></div><span class="tag green"><span class="status-dot"></span> En transit</span></div>
          <div class="timeline">
            <div class="timeline-item done"><span class="timeline-dot">✓</span><div><time>14 août · 10:42</time><h3>Colis reçu à l’entrepôt</h3><p>Hollywood, Floride · Poids enregistré : 8.4 lb</p></div></div>
            <div class="timeline-item done"><span class="timeline-dot">✓</span><div><time>15 août · 16:10</time><h3>Contrôle et préparation terminés</h3><p>Le colis est affecté au prochain départ aérien.</p></div></div>
            <div class="timeline-item active"><span class="timeline-dot">●</span><div><time>18 août · 07:35</time><h3>En transit vers Haïti</h3><p>Votre colis a quitté notre centre de Miami.</p></div></div>
            <div class="timeline-item"><span class="timeline-dot"></span><div><time>Prochaine étape</time><h3>Arrivée et contrôle local</h3><p>Une notification sera envoyée après le traitement.</p></div></div>
            <div class="timeline-item"><span class="timeline-dot"></span><div><time>Étape finale</time><h3>Prêt pour la livraison</h3><p>La facture et les options de remise seront affichées.</p></div></div>
          </div>
        </section>
        <aside style="display:grid;gap:16px;align-content:start"><section class="tracking-card"><span class="icon-box green">PK</span><h3 style="margin-top:15px">Détails du colis</h3><div class="info-table"><div class="info-row"><span>Catégorie</span><strong>Électronique</strong></div><div class="info-row"><span>Poids</span><strong>8.4 lb</strong></div><div class="info-row"><span>Mode</span><strong>Aérien</strong></div><div class="info-row"><span>Destination</span><strong>PAP-01</strong></div><div class="info-row"><span>Destinataire</span><strong>Nadia P.</strong></div></div></section><section class="tracking-card"><h3>Une question ?</h3><p style="font-size:13px">Partagez ce numéro avec notre équipe : <strong style="color:var(--ink)">VX-2408-98172</strong></p><a class="btn btn-green" href="support.html">Contacter le support</a></section></aside>
      </main>
    </div>${globalUi()}`;

  const authScreens = {
    signin: {
      title: "Heureux de vous revoir.", intro: "Accédez à vos colis, factures et notifications.", fields: `
        <div class="field"><label>Adresse e-mail</label><input type="email" required placeholder="vous@exemple.com"></div>
        <div class="field"><label>Mot de passe</label><div class="password-wrap"><input type="password" required placeholder="Votre mot de passe"><button class="password-toggle" type="button" data-password aria-label="Afficher le mot de passe">○</button></div></div>
        <div class="auth-options"><label><input type="checkbox"> Se souvenir de moi</label><a href="#recovery">Mot de passe oublié ?</a></div>
        <button class="btn btn-green" type="submit">Se connecter →</button>`, footer: `Nouveau chez Velog Xpress ? <a href="#signup">Créer un compte</a>`
    },
    signup: {
      title: "Créez votre espace.", intro: "Obtenez votre code client et votre adresse d’achat personnalisée.", fields: `
        <div class="form-grid"><div class="field"><label>Prénom</label><input required placeholder="Prénom"></div><div class="field"><label>Nom</label><input required placeholder="Nom"></div></div>
        <div class="field"><label>Téléphone</label><input required placeholder="+509 / +1"></div><div class="field"><label>Adresse e-mail</label><input type="email" required placeholder="vous@exemple.com"></div>
        <div class="field"><label>Mot de passe</label><div class="password-wrap"><input type="password" required placeholder="8 caractères minimum"><button class="password-toggle" type="button" data-password>○</button></div></div>
        <label style="font-size:12px;color:var(--muted)"><input type="checkbox" required> J’accepte les termes et la politique de confidentialité.</label><button class="btn btn-green" type="submit">Créer mon compte →</button>`, footer: `Vous avez déjà un compte ? <a href="#signin">Se connecter</a>`
    },
    recovery: {
      title: "Récupérez votre accès.", intro: "Nous enverrons un code sécurisé à l’adresse associée à votre compte.", fields: `<div class="field"><label>Adresse e-mail</label><input type="email" required placeholder="vous@exemple.com"></div><button class="btn btn-green" type="submit" data-next="verifyotp">Envoyer le code →</button>`, footer: `<a href="#signin">← Retour à la connexion</a>`
    },
    verifyotp: {
      title: "Vérifiez votre identité.", intro: "Entrez le code à six chiffres envoyé à n•••@email.com.", fields: `<div class="otp">${Array(6).fill('<input inputmode="numeric" maxlength="1" aria-label="Chiffre du code">').join("")}</div><button class="btn btn-green" type="submit" data-next="reset-password">Valider le code →</button><p style="font-size:12px;text-align:center;margin:0">Code non reçu ? <a href="#verifyotp" style="color:var(--navy);font-weight:800">Renvoyer dans 00:42</a></p>`, footer: `<a href="#recovery">← Modifier l’adresse e-mail</a>`
    },
    "reset-password": {
      title: "Choisissez un nouveau mot de passe.", intro: "Utilisez au moins huit caractères, un chiffre et un symbole.", fields: `<div class="field"><label>Nouveau mot de passe</label><div class="password-wrap"><input type="password" required placeholder="Nouveau mot de passe"><button class="password-toggle" type="button" data-password>○</button></div></div><div class="field"><label>Confirmer le mot de passe</label><input type="password" required placeholder="Répétez le mot de passe"></div><button class="btn btn-green" type="submit" data-next="signin">Mettre à jour →</button>`, footer: `<a href="#signin">Retour à la connexion</a>`
    },
    changepwrd: {
      title: "Sécurisez votre compte.", intro: "Votre administrateur demande un nouveau mot de passe avant de continuer.", fields: `<div class="field"><label>Mot de passe actuel</label><input type="password" required></div><div class="field"><label>Nouveau mot de passe</label><input type="password" required></div><div class="field"><label>Confirmer</label><input type="password" required></div><button class="btn btn-green" type="submit">Enregistrer →</button>`, footer: `<a href="#signin">Annuler et se déconnecter</a>`
    },
    unauthorized: {
      title: "Accès non autorisé.", intro: "Votre rôle ne permet pas d’ouvrir cette page.", fields: `<div class="notice"><strong>403</strong><span>Demandez à un administrateur de vérifier vos permissions si vous pensez qu’il s’agit d’une erreur.</span></div><a class="btn" href="dashboard.html">Retour au tableau de bord</a>`, footer: `<a href="#signin">Changer de compte</a>`
    }
  };

  function renderAuth() {
    const key = (location.hash || "#signin").slice(1);
    const screen = authScreens[key] || authScreens.signin;
    document.title = `${screen.title.replace(".", "")} — Velog Xpress`;
    app.innerHTML = `<div class="auth-page"><div class="auth-shell"><aside class="auth-aside"><a class="brand" href="index.html"><img src="${asset("velog-logo.svg")}" alt="Velog Xpress"></a><div><p class="eyebrow" style="color:#a9dc89">Votre logistique, en un seul endroit</p><h1>Gérez vos envois avec confiance.</h1><p>Suivi, factures, adresse américaine et assistance réunis dans une expérience simple et sécurisée.</p></div><div class="auth-proof"><span>✓ Données protégées</span><span>✓ Suivi 24/7</span><span>✓ Support humain</span></div></aside><main class="auth-main"><section class="auth-card"><div class="auth-tabs"><a class="${key === "signin" ? "active" : ""}" href="#signin">Connexion</a><a class="${key === "signup" ? "active" : ""}" href="#signup">Créer un compte</a></div><h2>${screen.title}</h2><p>${screen.intro}</p><form class="auth-form" data-auth-form>${screen.fields}</form><p class="auth-link">${screen.footer}</p></section></main></div></div>${globalUi()}`;
    bindCommon();
  }

  const dashboardGroups = [
    { label: "Vue générale", glyph: "DG", pages: [
      ["dashboard", "Tableau de bord", "overview"], ["pages", "Toutes les pages", "map"], ["activites", "Activités", "activity"], ["historique", "Historique", "table"]
    ]},
    { label: "Configurations", glyph: "CF", pages: [
      ["ville", "Villes", "setup"], ["categorie", "Catégories", "setup"], ["assurance", "Frais d’assurance", "setup"], ["fepounds", "Frais par livre", "setup"], ["specialfees", "Frais spéciaux", "setup"], ["taux", "Taux du jour", "setup"], ["frais", "Tableau des frais", "table"]
    ]},
    { label: "Paramètres", glyph: "PR", pages: [
      ["shipping-address", "Adresse d’expédition", "setup"], ["surcursale", "Succursales", "setup"], ["profile", "Profil", "profile"], ["support-admin", "Support interne", "support"]
    ]},
    { label: "Processus", glyph: "PX", pages: [
      ["commande", "Créer commandes", "process"], ["recevoir-commandes", "Recevoir commandes", "process"], ["checkin", "Check-in", "process"], ["storage", "Storage", "process"], ["facture", "Facture", "invoice"], ["controle-facture", "Contrôle facture", "table"], ["amnisty", "Colis Amnisty", "parcels"], ["colis-clients", "Colis clients", "parcels"], ["livraison", "Livraison", "process"], ["track-colis", "Track colis", "tracking"], ["mes-colis", "Mes colis", "parcels"]
    ]},
    { label: "Ressources humaines", glyph: "RH", pages: [
      ["create-user", "Créer utilisateur", "form"], ["roles-permissions", "Rôles et permissions", "roles"]
    ]},
    { label: "Conversations", glyph: "CO", pages: [
      ["feedback", "Envoyer un feedback", "form"], ["feedback-inbox", "Feedback reçus", "table"], ["chat", "Chat", "chat"]
    ]},
    { label: "Shipping", glyph: "SH", pages: [
      ["pack-colis", "Pack colis", "process"], ["embarquement", "Embarquement", "process"], ["packing", "Packing consultation", "table"]
    ]},
    { label: "Composants hérités", glyph: "UI", pages: [
      ["calendar", "Calendrier", "calendar"], ["bar-chart", "Bar chart", "chart"], ["line-chart", "Line chart", "chart"], ["form-elements", "Form elements", "form"], ["basic-tables", "Basic tables", "table"], ["alerts", "Alerts", "components"], ["avatars", "Avatars", "components"], ["badge", "Badges", "components"], ["buttons", "Buttons", "components"], ["images", "Images", "components"], ["modals", "Modals", "components"], ["videos", "Videos", "components"]
    ]}
  ];

  const allDashboardPages = dashboardGroups.flatMap(group => group.pages.map(page => ({ key: page[0], label: page[1], kind: page[2], group: group.label })));

  const dashboardSidebar = (active) => `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-head"><a class="brand" href="index.html"><img src="${asset("velog-logo.svg")}" alt="Velog Xpress"></a><button class="sidebar-close" data-sidebar-close>×</button></div>
      <div class="workspace-card"><small>Espace actif</small><strong>Administration · Miami</strong></div>
      <nav class="sidebar-nav" aria-label="Navigation du portail">
        ${dashboardGroups.map((group, index) => {
          const containsActive = group.pages.some(page => page[0] === active);
          if (group.pages.length <= 4 && index === 0) return `<div class="nav-label">${group.label}</div>${group.pages.map(page => sidebarLink(page, active)).join("")}`;
          return `<div class="sidebar-group ${containsActive ? "open" : ""}"><button class="sidebar-group-button" type="button"><span class="nav-glyph">${group.glyph}</span>${group.label}</button><div class="sidebar-subnav">${group.pages.map(page => sidebarLink(page, active)).join("")}</div></div>`;
        }).join("")}
      </nav>
    </aside>`;

  const sidebarLink = (page, active) => `<a class="sidebar-link ${page[0] === active ? "active" : ""}" href="#${page[0]}"><span class="nav-glyph">${page[1].slice(0,2).toUpperCase()}</span>${page[1]}</a>`;

  const dashboardTopbar = () => `
    <header class="dashboard-topbar"><button class="dash-menu" data-sidebar-open>☰</button><div class="top-search"><input data-page-search placeholder="Rechercher une page, un colis, une facture…"><div class="search-results" id="search-results"></div></div><div class="top-actions"><button class="icon-button" data-theme aria-label="Changer le thème">◐</button><button class="icon-button" aria-label="Notifications">●</button><a class="profile-chip" href="#profile"><span class="avatar">JD</span><span><strong>Jodelin D.</strong><small>Administrateur</small></span></a></div></header>`;

  const dashHeading = (title, intro, action = "Nouvel élément") => `<div class="dash-heading"><div><p class="eyebrow">Espace opérationnel</p><h1>${title}</h1><p>${intro}</p></div><div class="dash-actions"><button class="btn btn-sm btn-ghost" data-toast="Export préparé">Exporter</button>${action ? `<button class="btn btn-sm btn-green" data-modal="action-modal">+ ${action}</button>` : ""}</div></div>`;

  const kpis = () => `<div class="kpi-grid">${[
    ["CP", "1 284", "Colis actifs", "+8,2%"], ["CM", "326", "Commandes ce mois", "+12,4%"], ["RV", "$48.6k", "Revenus encaissés", "+6,1%"], ["DL", "94,8%", "Livraisons à temps", "+2,3%"]
  ].map(([icon,value,label,delta],i)=>`<article class="kpi-card"><div class="kpi-top"><span class="icon-box ${i%2===0?"green":""}">${icon}</span><span class="delta">↑ ${delta}</span></div><strong>${value}</strong><span>${label}</span></article>`).join("")}</div>`;

  const bars = () => [42,58,48,76,65,88,72,91,68,82,74,94].map((height,i)=>`<span class="bar ${i%3===1?"green":""}" style="height:${height}%" data-label="${["Sep","Oct","Nov","Déc","Jan","Fév","Mar","Avr","Mai","Juin","Juil","Aoû"][i]}"></span>`).join("");

  const overviewPage = () => `${dashHeading("Bonjour Jodelin — voici l’essentiel.", "Une vue claire de la performance et des opérations qui demandent votre attention.", null)}${kpis()}<div class="dash-grid"><section class="panel"><div class="panel-head"><div><h2>Volume des expéditions</h2><p>Aérien et maritime · 12 derniers mois</p></div><span class="tag green">+14,6%</span></div><div class="panel-body"><div class="chart">${bars()}</div></div></section><section class="panel"><div class="panel-head"><div><h2>Objectif mensuel</h2><p>Août ${currentYear}</p></div></div><div class="panel-body"><div class="target-ring"><strong>72%</strong></div><div class="target-meta"><div><strong>$48.6k</strong><span>Réalisé</span></div><div><strong>$67.5k</strong><span>Objectif</span></div></div></div></section></div><section class="panel" style="margin-top:16px"><div class="panel-head"><div><h2>Priorités opérationnelles</h2><p>Éléments nécessitant une action aujourd’hui</p></div><a class="btn btn-sm btn-ghost" href="#activites">Voir les activités</a></div>${tableMarkup("priority")}</section>`;

  const sampleRows = {
    priority: [
      ["VX-2408-98172", "Facture à contrôler", "Nadia Pierre", "Aujourd’hui · 10:42", "À vérifier"],
      ["CMD-88241", "Réception à confirmer", "Samuel Jean", "Aujourd’hui · 09:16", "En attente"],
      ["VX-2408-97703", "Livraison planifiée", "Ruth Charles", "Demain · 11:00", "Confirmé"],
      ["PK-01842", "Embarquement", "Pack PAP-04", "18 août · 07:35", "En transit"]
    ],
    default: [
      ["VX-2408-98172", "Nadia Pierre", "Électronique", "8.4 lb", "En transit"],
      ["VX-2408-98043", "Samuel Jean", "Vêtements", "12.7 lb", "Reçu"],
      ["VX-2408-97881", "Marline Joseph", "Maison", "24.2 lb", "À contrôler"],
      ["VX-2408-97703", "Ruth Charles", "Documents", "2.1 lb", "Livré"],
      ["VX-2408-97225", "Pierre Louis", "Électronique", "3 unité(s)", "Facturé"]
    ]
  };

  const tableMarkup = (variant = "default") => {
    const rows = sampleRows[variant] || sampleRows.default;
    const heads = variant === "priority" ? ["Référence", "Action", "Client / lot", "Échéance", "Statut", ""] : ["Tracking", "Client", "Catégorie", "Poids / QTE", "Statut", ""];
    return `<div class="table-wrap"><table class="data-table"><thead><tr>${heads.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((row,i)=>`<tr>${row.map((cell,cellIndex)=>`<td>${cellIndex===0?`<strong>${cell}</strong><span class="subtle">${i%2?"Créé hier":"Mis à jour il y a 12 min"}</span>`:cellIndex===row.length-1?`<span class="tag ${cell.includes("Livré")||cell.includes("Confirmé")||cell.includes("Reçu")?"green":cell.includes("attente")||cell.includes("vérifier")?"warn":""}">${cell}</span>`:cell}</td>`).join("")}<td><div class="row-actions"><button data-toast="Détails ouverts">•••</button></div></td></tr>`).join("")}</tbody></table></div>`;
  };

  const standardTablePage = (page) => `${dashHeading(page.label, `Consultez, filtrez et gérez les données de ${page.label.toLowerCase()} depuis une vue cohérente.`, "Ajouter")}<section class="panel"><div class="panel-head"><div><h2>${page.label}</h2><p>5 résultats sur 1 284</p></div><span class="tag">Mis à jour à l’instant</span></div><div class="filters"><input data-table-filter placeholder="Rechercher par numéro, nom ou statut"><select><option>Tous les statuts</option><option>En attente</option><option>En transit</option><option>Terminé</option></select><select><option>Ce mois</option><option>7 derniers jours</option><option>Cette année</option></select></div>${tableMarkup()}</section>`;

  const setupPage = (page) => `${dashHeading(page.label, `Configurez ${page.label.toLowerCase()} sans perdre le contexte opérationnel.`, "Ajouter")}<div class="form-layout"><section class="panel"><div class="panel-head"><div><h2>Paramètres actifs</h2><p>Les changements sont historisés</p></div></div>${tableMarkup()}</section><aside class="panel"><div class="panel-head"><h2>Bonnes pratiques</h2></div><div class="panel-body"><div class="summary-list"><div class="summary-item"><span>Valeurs actives</span><strong>12</strong></div><div class="summary-item"><span>Dernière modification</span><strong>Aujourd’hui</strong></div><div class="summary-item"><span>Modifié par</span><strong>Jodelin D.</strong></div></div><div class="notice" style="margin-top:16px"><strong>Conseil</strong><span>Vérifiez l’impact sur les factures en cours avant de modifier un tarif.</span></div></aside></div>`;

  const processPage = (page) => `${dashHeading(page.label, `Un parcours guidé pour ${page.label.toLowerCase()} avec moins d’erreurs et une prochaine action toujours visible.`, "Commencer")}<div class="process-banner"><div><h2>${page.label}</h2><p>Scannez ou recherchez une référence pour démarrer le traitement.</p></div><div class="stepper"><span class="step-pill active">1 · Identifier</span><span class="step-pill">2 · Vérifier</span><span class="step-pill">3 · Confirmer</span></div></div><div class="form-layout"><section class="panel"><div class="panel-head"><div><h2>Informations principales</h2><p>Les champs obligatoires sont indiqués</p></div></div><form class="panel-body form-grid" data-demo-form><div class="field full"><label>Commande ou tracking</label><input placeholder="Scanner ou saisir une référence"></div><div class="field"><label>Succursale</label><select><option>Port-au-Prince · PAP-01</option><option>Cap-Haïtien · CAP-01</option></select></div><div class="field"><label>Agent responsable</label><input value="Jodelin D." readonly></div><div class="field"><label>Catégorie</label><select><option>Sélectionner</option><option>Électronique</option><option>Vêtements</option></select></div><div class="field"><label>Poids / quantité</label><input placeholder="0.00"></div><div class="field full"><label>Note opérationnelle</label><textarea placeholder="Ajouter une précision utile pour la prochaine équipe"></textarea></div><div class="field full"><button class="btn btn-green" type="submit">Vérifier et continuer →</button></div></form></section><aside class="panel"><div class="panel-head"><h2>Résumé en direct</h2></div><div class="panel-body"><div class="empty-state" style="min-height:280px;padding:20px"><div><span class="icon-box green">SC</span><h3>Aucune référence</h3><p>Scannez un code pour afficher les informations et les contrôles nécessaires.</p><button class="btn btn-sm btn-ghost" data-toast="Caméra simulée">Ouvrir la caméra</button></div></div></div></aside></div>`;

  const parcelsPage = (page) => `${dashHeading(page.label, `Une vue en cartes responsive pour consulter rapidement chaque colis.`, "Nouveau colis")}<section class="panel"><div class="filters"><input data-card-filter placeholder="Tracking, UPC, client ou commande"><select><option>Tous les statuts</option><option>En transit</option><option>À contrôler</option></select><button class="btn btn-sm btn-ghost" data-toast="Caméra simulée">Scanner</button></div><div class="panel-body"><div class="parcel-grid">${sampleRows.default.slice(0,6).map((row,i)=>`<article class="parcel-card"><div class="parcel-card-head"><div><h3>${row[0]}</h3><p>UPC 00${i+1}84219</p></div><span class="tag ${i===3?"green":""}">${row[4]}</span></div><div class="parcel-meta"><div><span>Client</span><strong>${row[1]}</strong></div><div><span>Commande</span><strong>CMD-${88241-i*31}</strong></div><div><span>Catégorie</span><strong>${row[2]}</strong></div><div><span>Poids / QTE</span><strong>${row[3]}</strong></div></div><div class="row-actions" style="margin-top:13px"><button data-toast="Aperçu ouvert">⌕</button><button data-modal="action-modal">✎</button><button data-toast="Lien copié">↗</button></div></article>`).join("")}</div></div></section>`;

  const invoicePage = (page) => `${dashHeading(page.label, "Créez une facture lisible avec un résumé client, des frais détaillés et un calcul transparent.", "Nouvelle facture")}<div class="process-banner"><div><h2>Facture en préparation</h2><p>Commande CMD-88241 · Nadia Pierre · 3 colis</p></div><span class="tag green">Montant actuel · $186.40</span></div><div class="form-layout"><section class="panel"><div class="panel-head"><div><h2>Colis facturés</h2><p>Vérifiez poids, catégorie et frais</p></div><button class="btn btn-sm btn-ghost" data-modal="action-modal">+ Ajouter</button></div>${tableMarkup()}</section><aside class="panel"><div class="panel-head"><h2>Résumé du paiement</h2></div><div class="panel-body"><div class="summary-list"><div class="summary-item"><span>Sous-total</span><strong>$168.00</strong></div><div class="summary-item"><span>Assurance</span><strong>$8.40</strong></div><div class="summary-item"><span>Frais spéciaux</span><strong>$10.00</strong></div></div><div class="summary-item summary-total"><span>Total à payer</span><strong>$186.40</strong></div><button class="btn btn-green" style="width:100%;margin-top:18px" data-toast="Facture enregistrée">Enregistrer la facture</button></div></aside></div>`;

  const profilePage = () => `${dashHeading("Mon profil", "Gérez votre identité, votre sécurité et votre adresse d’achat aux États-Unis.", "Modifier")}<div class="form-layout"><section class="panel"><div class="process-banner" style="margin:0;border-radius:0"><div style="display:flex;align-items:center;gap:16px"><span class="avatar" style="width:62px;height:62px;font-size:18px;background:var(--green)">JD</span><div><h2>Jodelin Desrameaux</h2><p>Code client · VX-10482</p></div></div><span class="tag green">Compte vérifié</span></div><div class="panel-body"><div class="form-grid"><div class="field"><label>Nom complet</label><input value="Jodelin Desrameaux" readonly></div><div class="field"><label>Téléphone</label><input value="+509 37 00 0000" readonly></div><div class="field"><label>E-mail</label><input value="jodelin@example.com" readonly></div><div class="field"><label>Rôle</label><input value="Administrateur" readonly></div></div></div></section><aside class="panel"><div class="panel-head"><h2>Adresse d’achat</h2></div><div class="panel-body"><span class="tag green">Copier dans votre boutique</span><h3 style="margin-top:18px">Jodelin Desrameaux VX-10482</h3><p style="font-size:13px">2031 Tyler Street<br>Hollywood, FL 33020<br>United States</p><button class="btn btn-ghost" style="width:100%" data-toast="Adresse copiée">Copier l’adresse</button></div></aside></div>`;

  const rolesPage = () => `${dashHeading("Rôles et permissions", "Comprenez qui peut voir ou modifier chaque partie du système.", "Créer un rôle")}<section class="panel"><div class="panel-head"><h2>Matrice d’accès</h2><span class="tag">3 rôles actifs</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Fonction</th><th>Administrateur</th><th>Agent</th><th>Client</th></tr></thead><tbody>${[["Configurations","Total","Partiel","Aucun"],["Processus","Total","Opérationnel","Mes données"],["Ressources humaines","Total","Création","Aucun"],["Conversations","Supervision","Support","Feedback"],["Shipping","Total","Opérationnel","Aucun"]].map(row=>`<tr>${row.map((cell,i)=>`<td>${i===0?`<strong>${cell}</strong>`:`<span class="tag ${cell==="Total"||cell==="Opérationnel"?"green":cell==="Aucun"?"red":""}">${cell}</span>`}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section>`;

  const formPage = (page) => `${dashHeading(page.label, `Un formulaire structuré et accessible pour ${page.label.toLowerCase()}.`, "Nouveau")}<section class="panel"><div class="panel-head"><div><h2>Informations</h2><p>Complétez les données principales</p></div></div><form class="panel-body form-grid" data-demo-form><div class="field"><label>Nom complet</label><input required placeholder="Saisir un nom"></div><div class="field"><label>Adresse e-mail</label><input type="email" placeholder="nom@exemple.com"></div><div class="field"><label>Type</label><select><option>Sélectionner</option><option>Client</option><option>Agent</option></select></div><div class="field"><label>Succursale</label><select><option>Miami</option><option>Port-au-Prince</option></select></div><div class="field full"><label>Description</label><textarea placeholder="Ajoutez le contexte nécessaire"></textarea></div><div class="field full"><div style="display:flex;justify-content:flex-end;gap:9px"><button class="btn btn-ghost" type="reset">Annuler</button><button class="btn btn-green" type="submit">Enregistrer</button></div></div></form></section>`;

  const chatPage = () => `${dashHeading("Conversations", "Retrouvez les demandes clients et l’historique de chaque échange.", "Nouvelle conversation")}<section class="panel"><div class="chat-layout"><aside class="chat-list">${["Nadia Pierre","Samuel Jean","Marline Joseph","Ruth Charles"].map((name,i)=>`<div class="chat-person ${i===0?"active":""}"><span class="avatar">${name.split(" ").map(x=>x[0]).join("")}</span><div><strong>${name}</strong><span>${i===0?"Mon colis est-il arrivé ?":"Merci pour votre aide"}</span></div><time>${10+i}:4${i}</time></div>`).join("")}</aside><div class="chat-messages"><div class="panel-head"><div><h2>Nadia Pierre</h2><p>Tracking VX-2408-98172 · En transit</p></div><span class="tag green">En ligne</span></div><div class="messages"><div class="bubble">Bonjour, est-ce que mon colis est déjà arrivé en Haïti ?</div><div class="bubble mine">Bonjour Nadia. Il est actuellement en transit vers Port-au-Prince. L’arrivée est prévue jeudi.</div><div class="bubble">Merci ! Je recevrai une notification ?</div><div class="bubble mine">Oui, dès que le contrôle local sera terminé.</div></div><form class="message-input" data-demo-form><input placeholder="Écrire une réponse…"><button class="btn btn-sm btn-green">Envoyer</button></form></div></div></section>`;

  const trackingAdminPage = () => `${dashHeading("Track colis", "Une vue complète du parcours, des événements et des informations client.", "Mettre à jour")}<div class="form-layout"><section class="panel"><div class="panel-body"><div class="package-head"><div><p class="eyebrow">VX-2408-98172</p><h2 style="font-size:23px">Miami → Port-au-Prince</h2></div><span class="tag green">En transit</span></div><div class="timeline"><div class="timeline-item done"><span class="timeline-dot">✓</span><div><time>14 août · 10:42</time><h3>Réception entrepôt</h3><p>Poids : 8.4 lb</p></div></div><div class="timeline-item done"><span class="timeline-dot">✓</span><div><time>15 août · 16:10</time><h3>Contrôle terminé</h3><p>Facturation préliminaire créée</p></div></div><div class="timeline-item active"><span class="timeline-dot">●</span><div><time>18 août · 07:35</time><h3>En transit</h3><p>Pack PK-01842</p></div></div></div></div></section><aside class="panel"><div class="panel-head"><h2>Informations</h2></div><div class="panel-body"><div class="info-table"><div class="info-row"><span>Client</span><strong>Nadia Pierre</strong></div><div class="info-row"><span>Commande</span><strong>CMD-88241</strong></div><div class="info-row"><span>Catégorie</span><strong>Électronique</strong></div><div class="info-row"><span>Destination</span><strong>PAP-01</strong></div></div></div></aside></div>`;

  const mapPage = () => `${dashHeading("Toutes les pages", "Inventaire complet des routes trouvées dans le frontend actuel et incluses dans cette proposition.", null)}<div class="page-map">${dashboardGroups.map(group=>`<section class="map-group"><h3>${group.label}<span class="tag">${group.pages.length}</span></h3><div class="map-links">${group.pages.map(page=>`<a href="#${page[0]}"><span>${page[1]}</span><small>Ouvrir →</small></a>`).join("")}</div></section>`).join("")}<section class="map-group"><h3>Public et compte <span class="tag">19</span></h3><div class="map-links">${[["Accueil","index.html"],["Accueil /home-three","home-three.html"],["Accueil /se","se.html"],["Qui sommes-nous","about.html"],["Contact","contact.html"],["Support","support.html"],["Confidentialité","confidentialite.html"],["Conditions","condition.html"],["Marchandises","marchandise.html"],["Privacy","privacy.html"],["Fermer le compte","close-account.html"],["Suivi public","tracking.html"],["Connexion","auth.html#signin"],["Inscription","auth.html#signup"],["Récupération","auth.html#recovery"],["Vérification OTP","auth.html#verifyotp"],["Nouveau mot de passe","auth.html#reset-password"],["Changer le mot de passe","auth.html#changepwrd"],["Accès non autorisé","auth.html#unauthorized"]].map(([label,href])=>`<a href="${href}"><span>${label}</span><small>Ouvrir ↗</small></a>`).join("")}</div></section></div>`;

  const calendarPage = () => `${dashHeading("Calendrier", "Planifiez les départs, arrivées et actions d’équipe dans une vue partagée.", "Nouvel événement")}<section class="panel"><div class="panel-head"><h2>Août ${currentYear}</h2><div class="dash-actions"><button class="btn btn-sm btn-ghost">Aujourd’hui</button><button class="btn btn-sm btn-ghost">‹</button><button class="btn btn-sm btn-ghost">›</button></div></div><div class="panel-body"><div style="display:grid;grid-template-columns:repeat(7,1fr);border:1px solid var(--line)">${["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"].map(d=>`<strong style="padding:10px;text-align:center;font-size:11px;background:var(--canvas)">${d}</strong>`).join("")}${Array.from({length:35},(_,i)=>`<div style="min-height:90px;padding:7px;border-top:1px solid var(--line);border-right:1px solid var(--line);font-size:10px;color:var(--muted)">${i<3?"":i-2}${[8,11,17,23].includes(i)?`<span class="tag ${i===17?"green":""}" style="display:flex;margin-top:5px">Départ ${i%2?"AIR":"SEA"}</span>`:""}</div>`).join("")}</div></div></section>`;

  const componentsPage = (page) => `${dashHeading(page.label, "Composants hérités regroupés dans le design system pour assurer une expérience cohérente.", "Ouvrir un exemple")}<section class="panel"><div class="panel-head"><h2>${page.label}</h2><span class="tag green">Design system</span></div><div class="panel-body"><div class="support-grid"><article class="support-card"><span class="icon-box green">A</span><h3>État principal</h3><p>Contraste, espacement et libellé accessibles pour l’action la plus importante.</p><button class="btn btn-sm btn-green" style="margin-top:12px" data-modal="action-modal">Essayer</button></article><article class="support-card"><span class="icon-box">B</span><h3>État secondaire</h3><p>Une apparence discrète qui maintient la hiérarchie de la page.</p><button class="btn btn-sm btn-ghost" style="margin-top:12px" data-toast="Action secondaire">Action</button></article><article class="support-card"><span class="icon-box">C</span><h3>État informatif</h3><p>Les couleurs de statut gardent toujours un libellé explicite.</p><div style="display:flex;gap:6px;flex-wrap:wrap"><span class="tag green">Succès</span><span class="tag warn">Attention</span><span class="tag red">Erreur</span></div></article></div></div></section>`;

  function dashboardPageContent(page) {
    switch (page.kind) {
      case "overview": return overviewPage();
      case "map": return mapPage();
      case "setup": return setupPage(page);
      case "process": return processPage(page);
      case "invoice": return invoicePage(page);
      case "parcels": return parcelsPage(page);
      case "profile": return profilePage();
      case "roles": return rolesPage();
      case "form": return formPage(page);
      case "chat": return chatPage();
      case "tracking": return trackingAdminPage();
      case "calendar": return calendarPage();
      case "components": return componentsPage(page);
      case "chart": return `${dashHeading(page.label, "Analyse visuelle des volumes, revenus et tendances opérationnelles.", null)}${kpis()}<section class="panel" style="margin-top:16px"><div class="panel-head"><h2>${page.label}</h2><span class="tag green">12 mois</span></div><div class="panel-body"><div class="chart">${bars()}</div></div></section>`;
      case "activity": return `${dashHeading(page.label, "Les événements importants classés par urgence et par étape opérationnelle.", null)}<section class="panel"><div class="filters"><input placeholder="Rechercher une activité"><select><option>Toutes les équipes</option><option>Miami</option><option>Haïti</option></select></div>${tableMarkup("priority")}</section>`;
      default: return standardTablePage(page);
    }
  }

  function renderDashboard() {
    const key = (location.hash || "#dashboard").slice(1);
    const page = allDashboardPages.find(item => item.key === key) || allDashboardPages[0];
    document.title = `${page.label} — Portail Velog Xpress`;
    app.innerHTML = `<div class="dashboard-page"><div class="dashboard-shell">${dashboardSidebar(page.key)}<div class="dashboard-main">${dashboardTopbar()}<main class="dashboard-content">${dashboardPageContent(page)}</main></div></div></div>${globalUi()}`;
    bindCommon();
    bindDashboard();
  }

  function globalUi() {
    return `<div class="modal-backdrop" id="action-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal"><div class="modal-head"><h2 id="modal-title">Nouvel élément</h2><button class="modal-close" data-modal-close>×</button></div><form data-demo-form><div class="modal-body"><div class="form-grid"><div class="field full"><label>Référence ou nom</label><input required placeholder="Saisir une valeur"></div><div class="field"><label>Type</label><select><option>Standard</option><option>Prioritaire</option></select></div><div class="field"><label>Statut</label><select><option>Actif</option><option>En attente</option></select></div><div class="field full"><label>Note</label><textarea placeholder="Informations complémentaires"></textarea></div></div></div><div class="modal-actions"><button class="btn btn-sm btn-ghost" type="button" data-modal-close>Annuler</button><button class="btn btn-sm btn-green" type="submit">Enregistrer</button></div></form></div></div><div class="toast" id="toast"><span class="icon-box green" style="width:28px;height:28px">✓</span><span id="toast-text">Action terminée</span></div>`;
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    const text = document.getElementById("toast-text");
    if (!toast || !text) return;
    text.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.__vxToast);
    window.__vxToast = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function bindCommon() {
    document.querySelectorAll("[data-menu]").forEach(button => button.addEventListener("click", () => document.getElementById("main-nav")?.classList.toggle("open")));
    document.querySelectorAll("[data-dropdown]").forEach(button => button.addEventListener("click", () => {
      const parent = button.closest(".nav-dropdown");
      parent?.classList.toggle("open");
      button.setAttribute("aria-expanded", String(parent?.classList.contains("open")));
    }));
    document.querySelectorAll("[data-password]").forEach(button => button.addEventListener("click", () => {
      const input = button.parentElement?.querySelector("input");
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
      button.textContent = input.type === "password" ? "○" : "●";
    }));
    document.querySelectorAll("[data-toast]").forEach(button => button.addEventListener("click", () => showToast(button.dataset.toast || "Action terminée")));
    document.querySelectorAll("[data-modal]").forEach(button => button.addEventListener("click", () => document.getElementById(button.dataset.modal)?.classList.add("open")));
    document.querySelectorAll("[data-modal-close]").forEach(button => button.addEventListener("click", () => button.closest(".modal-backdrop")?.classList.remove("open")));
    document.querySelectorAll("[data-demo-form]").forEach(form => form.addEventListener("submit", event => {
      event.preventDefault();
      const action = form.dataset.action;
      if (action === "tracking") { location.href = "tracking.html"; return; }
      form.closest(".modal-backdrop")?.classList.remove("open");
      showToast("Vos informations ont été enregistrées");
    }));
    document.querySelectorAll("[data-auth-form]").forEach(form => form.addEventListener("submit", event => {
      event.preventDefault();
      const next = form.querySelector("[data-next]")?.dataset.next;
      if (next) location.hash = next;
      else if ((location.hash || "#signin") === "#signin") location.href = "dashboard.html";
      else showToast("Étape terminée avec succès");
    }));
    document.querySelectorAll("[data-tracking-search]").forEach(form => form.addEventListener("submit", event => { event.preventDefault(); showToast("Suivi actualisé à l’instant"); }));
  }

  function bindDashboard() {
    document.querySelectorAll(".sidebar-group-button").forEach(button => button.addEventListener("click", () => button.closest(".sidebar-group")?.classList.toggle("open")));
    document.querySelector("[data-sidebar-open]")?.addEventListener("click", () => document.getElementById("sidebar")?.classList.add("open"));
    document.querySelector("[data-sidebar-close]")?.addEventListener("click", () => document.getElementById("sidebar")?.classList.remove("open"));
    document.querySelector("[data-theme]")?.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("vx-theme", document.body.classList.contains("dark") ? "dark" : "light");
    });
    const pageSearch = document.querySelector("[data-page-search]");
    pageSearch?.addEventListener("change", () => {
      const term = pageSearch.value.toLowerCase().trim();
      const match = allDashboardPages.find(page => page.label.toLowerCase().includes(term));
      if (match) location.hash = match.key;
      else showToast("Aucune page correspondante");
    });
    const filter = document.querySelector("[data-table-filter]");
    filter?.addEventListener("input", () => {
      document.querySelectorAll(".data-table tbody tr").forEach(row => row.style.display = row.textContent.toLowerCase().includes(filter.value.toLowerCase()) ? "" : "none");
    });
    const cardFilter = document.querySelector("[data-card-filter]");
    cardFilter?.addEventListener("input", () => {
      document.querySelectorAll(".parcel-card").forEach(card => card.style.display = card.textContent.toLowerCase().includes(cardFilter.value.toLowerCase()) ? "" : "none");
    });
  }

  if (localStorage.getItem("vx-theme") === "dark" && surface === "dashboard") document.body.classList.add("dark");

  if (surface === "public") { renderPublic(); bindCommon(); }
  if (surface === "tracking") { app.innerHTML = trackingShell(); bindCommon(); }
  if (surface === "auth") { renderAuth(); window.addEventListener("hashchange", renderAuth); }
  if (surface === "dashboard") { renderDashboard(); window.addEventListener("hashchange", renderDashboard); }
})();
