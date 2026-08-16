"use client";
import * as React from "react";

import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { useState} from "react";
import { createFeedBack } from "@/services/FeedBackService";

interface Feedback {
name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function FeedbackForm() {
  
const [nom,setNom]=useState(localStorage.getItem("userName") || "");
const [email,setEmail]=useState(localStorage.getItem("userEmail") || "");
const [phone,setPhone]=useState(localStorage.getItem("telephone") || "");
const [subject,setSubject]=useState("");
const [message,setMessage]=useState("");

  return (
    
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
  <div className="custom-scrollbar max-h-[500px] overflow-y-auto p-6">
    
    {/* FORM GRID */}
    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
      
      {/* NOM */}
      <div>
        <Label>
          Nom <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          value={nom}
          placeholder="Entrez votre nom"
          onChange={(e) => setNom(e.target.value)}
        />
      </div>

      {/* TELEPHONE */}
      <div>
        <Label>
          Téléphone <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          value={phone}
          placeholder="Entrez votre téléphone"
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* EMAIL */}
      <div>
        <Label>
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          type="email"
          value={email}
          placeholder="Entrez votre email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* SUBJECT */}
      <div>
        <Label>
          Sujet <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          value={subject}
          placeholder="Entrez votre sujet"
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      {/* MESSAGE (pleine largeur) */}
      <div className="lg:col-span-2">
        <Label>
          Message <span className="text-red-500">*</span>
        </Label>
        <textarea
          rows={5}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
          value={message}
          placeholder="Entrez votre message"
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
    </div>
  </div>

  {/* FOOTER */}
  <div className="flex justify-end gap-3 border-t bg-gray-50 p-4 dark:bg-gray-900">
    <Button
      variant="outline"
      onClick={() => {
        setNom("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
      }}
    >
      Annuler
    </Button>

    <Button
      onClick={async () => {
        const feedback: Feedback = {
          name: nom,
          email,
          phone,
          subject,
          message,
        };
        await createFeedBack(feedback);
        setNom("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
      }}
    >
      Envoyer le message
    </Button>
  </div>
</div>

    );
}
