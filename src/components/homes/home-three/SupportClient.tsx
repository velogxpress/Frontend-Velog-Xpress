"use client";

import { FormEvent, useState } from "react";

const supportPhone = "19736406064";

function buildWhatsappMessage({
  name,
  phone,
  subject,
  message,
}: {
  name: string;
  phone: string;
  subject: string;
  message: string;
}) {
  return [
    "Bonjour Velog Xpress, mwen bezwen asistans.",
    `Nom: ${name}`,
    `Téléphone: ${phone}`,
    `Sujet: ${subject || "Support client"}`,
    `Message: ${message}`,
  ].join("\n");
}

export default function SupportClient() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isWhatsAppHover, setIsWhatsAppHover] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !phone.trim() || !message.trim()) {
      setError("Nom, téléphone et message sont obligatoires.");
      return;
    }

    setError("");
    const text = buildWhatsappMessage({
      name: name.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    window.open(
      `https://wa.me/${supportPhone}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section
      id="support-client"
      className="section-py-120"
      style={{ background: "linear-gradient(180deg, rgb(252, 252, 253) 0%, #ffffff 100%)" }}
    >
      <div className="container">
        <div className="row align-items-center gutter-24">
          <div className="col-lg-5">
            <div className="section__title mb-30">
              <span className="sub-title">Support client</span>
              <h2 className="title">
                Besoin d&apos;aide avec un colis, une facture ou votre compte?
              </h2>
            </div>
            <p className="mb-25">
              Remplissez ces informations et contactez notre équipe directement sur
              WhatsApp. Votre message arrivera avec vos coordonnées pour nous aider à
              répondre plus vite.
            </p>

            <div className="row gutter-20">
              <div className="col-sm-6">
                <div
                  className="h-100 position-relative overflow-hidden"
                  style={{
                    background: "rgb(252, 252, 253)",
                    border: "1px solid rgba(14, 34, 105, 0.1)",
                    borderRadius: "24px",
                    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
                    padding: "26px",
                  }}
                >
                  <span
                    className="position-absolute top-0 end-0 rounded-circle"
                    style={{
                      width: 96,
                      height: 96,
                      transform: "translate(35%, -35%)",
                      background: "rgba(82, 174, 29, 0.12)",
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
                      fontSize: "30px",
                    }}
                  >
                    <i className="flaticon-delivery"></i>
                  </div>
                  <div className="features__content-three position-relative">
                    <h4 className="title mb-2" style={{ color: "rgb(14, 34, 105)" }}>Suivi colis</h4>
                    <p className="mb-0" style={{ color: "#5f6f89" }}>
                      Questions sur tracking, livraison et réception.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div
                  className="h-100 position-relative overflow-hidden"
                  style={{
                    background: "rgb(252, 252, 253)",
                    border: "1px solid rgba(14, 34, 105, 0.1)",
                    borderRadius: "24px",
                    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
                    padding: "26px",
                  }}
                >
                  <span
                    className="position-absolute top-0 end-0 rounded-circle"
                    style={{
                      width: 96,
                      height: 96,
                      transform: "translate(35%, -35%)",
                      background: "rgba(14, 34, 105, 0.12)",
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
                      fontSize: "30px",
                    }}
                  >
                    <i className="flaticon-customer-service"></i>
                  </div>
                  <div className="features__content-three position-relative">
                    <h4 className="title mb-2" style={{ color: "rgb(14, 34, 105)" }}>Réponse rapide</h4>
                    <p className="mb-0" style={{ color: "#5f6f89" }}>
                      Contact direct avec le support via WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="/dashboard/suivi"
              className="btn mt-20"
              title="Ouvrir la page de suivi colis"
              style={{
                background: "rgb(14, 34, 105)",
                color: "#fff",
                borderRadius: "14px",
                fontWeight: 700,
                padding: "15px 24px",
                boxShadow: "0 14px 30px rgba(14, 34, 105, 0.18)",
              }}
            >
              <i className="flaticon-delivery me-2"></i>
              Suivre un colis
            </a>
          </div>

          <div className="col-lg-7">
            <div
              className="request__wrap-two position-relative overflow-hidden"
              style={{
                background: "rgb(252, 252, 253)",
                border: "1px solid rgba(14, 34, 105, 0.1)",
                borderRadius: "30px",
                boxShadow: "0 24px 60px rgba(14, 34, 105, 0.12)",
              }}
            >
              <span
                className="position-absolute top-0 end-0 rounded-circle"
                style={{
                  width: 190,
                  height: 190,
                  transform: "translate(35%, -45%)",
                  background: "linear-gradient(135deg, rgba(14, 34, 105, 0.12), rgba(82, 174, 29, 0.14))",
                }}
              />
              <div className="position-relative">
                <span
                  className="d-inline-flex align-items-center gap-2 mb-3"
                  style={{ color: "rgb(82, 174, 29)", fontWeight: 700 }}
                >
                  <i className="fab fa-whatsapp"></i>
                  Support WhatsApp
                </span>
                <h2 className="title mb-3" style={{ color: "rgb(14, 34, 105)" }}>Contacter le support</h2>
                <p className="mb-4" style={{ color: "#5f6f89" }}>
                  Envoyez votre demande avec vos coordonnées pour permettre à l&apos;équipe de vous répondre plus vite.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="contact__form">
                <div className="row gutter-20">
                  <div className="col-md-6">
                    <div className="form-grp">
                      <input
                        type="text"
                        placeholder="Nom complet"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-grp">
                      <input
                        type="tel"
                        placeholder="Téléphone"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-grp">
                  <input
                    type="text"
                    placeholder="Sujet"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                  />
                </div>

                <div className="form-grp">
                  <textarea
                    placeholder="Expliquez votre problème"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                  />
                </div>

                {error && <p className="form_error">{error}</p>}

                <button
                  type="submit"
                  className="btn support-whatsapp-btn"
                  title="Envoyer ces informations au support via WhatsApp"
                  onMouseEnter={() => setIsWhatsAppHover(true)}
                  onMouseLeave={() => setIsWhatsAppHover(false)}
                  onFocus={() => setIsWhatsAppHover(true)}
                  onBlur={() => setIsWhatsAppHover(false)}
                  style={{
                    background: isWhatsAppHover ? "rgb(14, 34, 105)" : "rgb(82, 174, 29)",
                    borderColor: isWhatsAppHover ? "rgb(14, 34, 105)" : "rgb(82, 174, 29)",
                  }}
                >
                  <i className="fab fa-whatsapp"></i> Contacter sur WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
