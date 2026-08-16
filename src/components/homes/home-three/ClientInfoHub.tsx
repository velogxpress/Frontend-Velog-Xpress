import Link from "next/link";

const latestInfo = [
  {
    title: "Horaires et adresses",
    text: "Consultez nos points de service avant de déposer ou récupérer vos colis.",
    icon: "flaticon-warehouse",
    href: "/contact",
    cta: "Voir nos adresses",
  },
  {
    title: "Suivi en temps réel",
    text: "Gardez votre tracking à portée de main pour suivre chaque mouvement.",
    icon: "flaticon-delivery",
    href: "/dashboard/suivi",
    cta: "Tracker un colis",
  },
  {
    title: "Support WhatsApp",
    text: "Pour une urgence, envoyez vos informations au support depuis le formulaire.",
    icon: "fab fa-whatsapp",
    href: "#support-client",
    cta: "Ouvrir le formulaire",
  },
];

const steps = [
  {
    number: "01",
    title: "Créer votre compte",
    text: "Inscrivez-vous pour obtenir votre code client et préparer vos envois.",
  },
  {
    number: "02",
    title: "Envoyer ou acheter",
    text: "Déposez vos colis ou utilisez votre adresse Velog Xpress pour vos achats.",
  },
  {
    number: "03",
    title: "Suivre la livraison",
    text: "Utilisez le tracking pour connaître l'état de votre colis jusqu'à la réception.",
  },
];

const supportQuestions = [
  {
    title: "Je n'arrive pas à suivre mon colis",
    text: "Vérifiez le code tracking, puis contactez le support si le colis ne s'affiche pas.",
    icon: "flaticon-delivery",
  },
  {
    title: "J'ai une question sur ma facture",
    text: "Préparez votre code facture ou votre numéro de téléphone pour une réponse rapide.",
    icon: "fas fa-file-invoice-dollar",
  },
  {
    title: "Je veux confirmer une adresse",
    text: "Contactez le support avant l'envoi pour éviter les erreurs de destination.",
    icon: "fas fa-check-circle",
  },
  {
    title: "Quand mon colis sera disponible?",
    text: "Le statut du colis vous indique l'étape actuelle. Gardez votre téléphone et votre email disponibles pour les notifications.",
    icon: "fas fa-clock",
  },
  {
    title: "Quels documents faut-il pour récupérer un colis?",
    text: "Présentez une pièce d'identité valide, votre code client ou votre numéro de tracking au comptoir.",
    icon: "fas fa-id-card",
  },
  {
    title: "Comment contacter rapidement le support?",
    text: "Utilisez le formulaire support ou WhatsApp avec votre nom, téléphone et numéro de suivi pour accélérer la réponse.",
    icon: "fab fa-whatsapp",
  },
];

export default function ClientInfoHub() {
  return (
    <>
      <section id="infos-client" className="section-py-120">
        <div className="container-fluid px-3 px-xl-5">
          <div className="row align-items-center justify-content-center">
            <div className="col-xxl-3 col-xl-4 col-lg-5">
              <div className="section__title mb-25">
                <span className="sub-title">Informations clients</span>
                <h2 className="title">Restez informé à chaque étape de votre colis</h2>
              </div>
              <p>
                Nous avons regroupé les accès les plus importants pour vous aider à
                suivre vos colis, calculer vos frais et contacter le support sans perdre
                du temps.
              </p>
            </div>
            <div className="col-xxl-8 col-xl-8 col-lg-7">
              <div className="row gutter-24">
                {latestInfo.map((item) => (
                  <div key={item.title} className="col-md-4 mb-4 mb-md-5">
                    <div
                      className="h-100 rounded-4 border-0 p-4 p-xl-5 shadow-sm position-relative overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(82, 174, 29, 0.14), rgba(14, 34, 105, 0.12))",
                      }}
                    >
                      <span
                        className="position-absolute top-0 end-0 rounded-circle"
                        style={{
                          width: 120,
                          height: 120,
                          transform: "translate(35%, -35%)",
                          background: "rgba(252, 252, 253, 0.72)",
                        }}
                      />
                      <div className="mb-4 position-relative">
                        <div
                          className="mb-0"
                          style={{
                            color: "rgb(14, 34, 105)",
                            fontSize: 64,
                            lineHeight: 1,
                          }}
                        >
                          <i className={item.icon}></i>
                        </div>
                      </div>
                      <div className="features__content-three pe-xl-3 position-relative">
                        <h4 className="title mb-2">{item.title}</h4>
                        <p>{item.text}</p>
                        {item.href.startsWith("/dashboard") ? (
                          <a
                            href={item.href}
                            className="btn client-info-btn mt-3"
                            style={{ background: "rgb(14, 34, 105)", borderColor: "rgb(14, 34, 105)" }}
                          >
                            {item.cta}
                          </a>
                        ) : (
                          <Link
                            href={item.href}
                            className="btn client-info-btn mt-3"
                            style={{ background: "rgb(14, 34, 105)", borderColor: "rgb(14, 34, 105)" }}
                          >
                            {item.cta}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="services__area-three section-py-120">
        <div className="container">
          <div className="row align-items-center mb-35">
            <div className="col-lg-7">
              <div className="section__title white-title">
                <span className="sub-title">Comment ça marche</span>
                <h3 className="title">Un processus simple pour vos envois</h3>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="section__content white-content">
                <p>
                  De la création du compte jusqu&apos;à la livraison, chaque étape est pensée
                  pour garder le client informé.
                </p>
              </div>
            </div>
          </div>

          <div className="row gutter-24">
            {steps.map((step) => (
              <div key={step.number} className="col-lg-4 col-md-6">
                <div className="services__item-three">
                  <div className="services__content-three">
                    <span className="sub-title">{step.number}</span>
                    <h4 className="title">{step.title}</h4>
                    <p>{step.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section-py-120"
        style={{ background: "linear-gradient(180deg, #ffffff 0%, rgb(252, 252, 253) 100%)" }}
      >
        <div className="container">
          <div className="section__title text-center mb-40">
            <span className="sub-title">FAQ Support</span>
            <h2 className="title">Questions fréquentes avant de contacter le support</h2>
            <p className="mx-auto mb-0" style={{ maxWidth: "720px", color: "#5f6f89" }}>
              Retrouvez les réponses les plus utiles avant de contacter l&apos;équipe Velog Xpress.
            </p>
          </div>
          <div className="row gutter-24">
            {supportQuestions.map((item) => (
              <div key={item.title} className="col-lg-4 col-md-6 mb-4">
                <div
                  className="h-100 position-relative overflow-hidden"
                  style={{
                    background: "rgb(252, 252, 253)",
                    border: "1px solid rgba(14, 34, 105, 0.1)",
                    borderRadius: "24px",
                    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
                    padding: "28px",
                  }}
                >
                  <span
                    className="position-absolute top-0 end-0 rounded-circle"
                    style={{
                      width: 110,
                      height: 110,
                      transform: "translate(35%, -35%)",
                      background: "rgba(82, 174, 29, 0.1)",
                    }}
                  />
                  <div
                    className="d-inline-flex align-items-center justify-content-center mb-4 position-relative"
                    style={{
                      width: "62px",
                      height: "62px",
                      borderRadius: "20px",
                      background: "linear-gradient(135deg, rgba(14, 34, 105, 0.1), rgba(82, 174, 29, 0.14))",
                      color: "rgb(14, 34, 105)",
                      fontSize: "28px",
                    }}
                  >
                    <i className={item.icon}></i>
                  </div>
                  <div className="features__content-three position-relative">
                    <h4 className="title mb-3" style={{ color: "rgb(14, 34, 105)" }}>{item.title}</h4>
                    <p className="mb-0" style={{ color: "#5f6f89" }}>{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
