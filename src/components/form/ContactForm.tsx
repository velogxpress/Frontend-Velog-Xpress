"use client"
import { toast } from 'react-toastify';
import {useState} from 'react';
import { createFeedBack } from "@/services/FeedBackService";


interface Feedback {
name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactForm = () => {
const [nom,setNom]=useState("");
const [email,setEmail]=useState("");
const [phone,setPhone]=useState("");
const [subject,setSubject]=useState("");
const [message,setMessage]=useState("");
const[errors,setErrors]=useState<{[key:string]:string}>({});

const validateForm = () => {
    const newErrors: {[key:string]:string} = {};
    if (!nom) newErrors.nom = "Le nom est requis.";
    if (!email) newErrors.email = "L'email est requis.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "L'email n'est pas valide.";
    if(!phone) newErrors.phone = "Le téléphone est requis.";
    if (!message) newErrors.message = "Le message est requis.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

   function handleSubmit(): import("react").FormEventHandler<HTMLFormElement> {
      return async (e) => {
         e.preventDefault();
         if (!validateForm()) return;

         const payload: Feedback = {
            name: nom,
            email: email,
            phone: phone,
            subject: subject,
            message: message,
         };

         try {
            
            await createFeedBack(payload);
            toast.success("Message envoyé avec succès.");
            setNom("");
            setEmail("");
            setPhone("");
            setSubject("");
            setMessage("");
            setErrors({});
         } catch (error) {
            console.error(error);
            toast.error("Une erreur est survenue lors de l'envoi.");
            setErrors(prev => ({ ...prev, submit: "Erreur d'envoi. Réessayez plus tard." }));
         }
      };
   }
  function openWhatsApp(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const supportPhone = "19736406064";
    const text = "Bonjour Velog Xpress, j'ai besoin d'informations.";
    const url = `https://wa.me/${supportPhone}?text=${encodeURIComponent(text)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }
   return (
      <form onSubmit={handleSubmit()} className="contact__form" id="contact-form">
         <div className="row gutter-20">
            <div className="col-lg-4">
               <div className="form-grp">
                  <input type="text" placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} />
                  <p className="form_error">{errors.nom}</p>
               </div>
            </div>
            <div className="col-lg-4">
               <div className="form-grp">
                  <input  type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
                  <p className="form_error">{errors.email}</p>
               </div>
            </div>
            <div className="col-lg-4">
               <div className="form-grp">
                  <input type="tel" name="phone" placeholder="téléphone" value={phone} onChange={e => setPhone(e.target.value)} />
                  <p className="form_error">{errors.phone}</p>
               </div>
            </div>
         </div>
         <div className="form-grp">
            <input type="text" name="subject" placeholder="Sujet" value={subject} onChange={e => setSubject(e.target.value)} />
         </div>
         <div className="form-grp">
            <textarea placeholder="Commentaires" value={message} onChange={e => setMessage(e.target.value)}></textarea>
            <p className="form_error">{errors.message}</p>
         </div>
         {errors.submit && <p className="form_error">{errors.submit}</p>}
         <div className="d-flex flex-wrap gap-3">
            <button
               type="submit"
               className="btn client-info-btn"
               title="Envoyer votre message au support"
               style={{ background: "rgb(14, 34, 105)", borderColor: "rgb(14, 34, 105)" }}
            >
               Envoyer le message
               <i className="fas fa-arrow-right ms-2"></i>
            </button>
            <button
               type="button"
               className="btn client-info-btn"
               onClick={openWhatsApp}
               title="Ouvrir une conversation WhatsApp avec le support"
               style={{ background: "rgb(14, 34, 105)", borderColor: "rgb(14, 34, 105)" }}
            >
               <i className="fab fa-whatsapp me-2"></i>
               Chat avec nous
            </button>
         </div>
      </form>
   )
}

export default ContactForm
