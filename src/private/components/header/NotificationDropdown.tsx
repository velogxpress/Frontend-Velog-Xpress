"use client";

import React, { useState,useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import {unreadFeedBack,markAsRead} from "@/services/FeedBackService";
import { useModal } from "@/private/hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";


interface Feedback{
  id: number;
  name:string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  date: string;
}

function formatDateFR(dateStr?: string): string {
  // 1️⃣ Vérification de base
  if (!dateStr || typeof dateStr !== "string") return "";

  // 2️⃣ Séparation date / heure
  const parts = dateStr.trim().split(" ");
  if (parts.length < 2) return "";

  const datePart = parts[0];
  const timePart = parts[1];

  // 3️⃣ Séparation jour-mois-année
  const dateSplit = datePart.split("-");
  if (dateSplit.length !== 3) return "";

  const [day, month, year] = dateSplit.map(Number);

  // 4️⃣ Séparation heure:minute
  const timeSplit = timePart.split(":");
  if (timeSplit.length < 2) return "";

  const [hour, minute] = timeSplit.map(Number);

  // 5️⃣ Vérification valeurs numériques
  if (
    [day, month, year, hour, minute].some(
      (v) => Number.isNaN(v)
    )
  ) {
    return "";
  }

  // 6️⃣ Création date
  const date = new Date(year, month - 1, day, hour, minute);

  // 7️⃣ Format FR
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}



const initialname=(name:string)=>{
  const names = name.split(" ");
  let initials = names[0].charAt(0).toUpperCase();
  if (names.length > 1) {
    initials += names[names.length - 1].charAt(0).toUpperCase();
  }
  return initials.toUpperCase();
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  const { isOpen: isModalOpen, openModal, closeModal } = useModal();

  const fetchNotifications = async (pageNumber: number) => {
    try {
      const response = await unreadFeedBack(pageNumber);
      const data = response?.data;
      setFeedbacks(data?.content ?? []);
      setTotalPages(data?.totalPages ?? 0);
      if (data?.content && data.content.length > 0) {
        setNotifying(true);
      }else{
        setNotifying(false);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

 

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
  };
  const handleOpenModal = (feedback: Feedback) => () => {
    setSelectedFeedback(feedback);
    openModal();
  };

  useEffect(() => {
    if (selectedFeedback) {
      markAsRead(selectedFeedback.id).finally(() => {
        window.dispatchEvent(new Event("feedback-notifications-updated"));
      });
    }
    fetchNotifications(page);
  }, [page, selectedFeedback]);

  return (
    <>
    <div className="relative">
      <button
        className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
            !notifying ? "hidden" : "flex"
          }`}
        >
          <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
        </span>
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notifications
          </h5>
          <button
            onClick={toggleDropdown}
            className="text-gray-500 transition dropdown-toggle dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <svg
              className="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {/* Example notification items */}
         { feedbacks.length === 0 ? (
            <li className="text-center text-gray-500 dark:text-gray-400">
              Pas de nouvelles notifications
            </li>
          ) : (
            feedbacks.map((feedback) => (
          <li key={feedback.id}>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
              onClick={handleOpenModal(feedback)}
                >
              <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
              <span className="mr-3 overflow-hidden rounded-full h-11 w-11 items-center flex items-center text-gray-700 border border-gray-200 dark:border-gray-800 dark:text-gray-400 justify-center">
                {initialname(feedback.name)}
              </span>
                <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
              </span>

              <span className="block">
                <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    {feedback.name}
                  </span>
                  {/* <span>{getTimeOnly(feedback.date)}</span> */}
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    <br/>{feedback.subject}
                  </span>
                </span>

                <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                  <span>Date</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>{formatDateFR(feedback.date)}</span>
                </span>
              </span>
            </DropdownItem>
          </li>
            )))}
          
          {/* Add more items as needed */}
        </ul>
        <div className="flex items-center justify-between mt-4">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
            >
              Précédent
            </button>

            <span>
              Page {page + 1} / {totalPages}
            </span>

            <button
              disabled={page + 1 === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
            >
              Suivant
            </button>
          </div>
      </Dropdown>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-[720px] m-4">
          {selectedFeedback && (
          <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.05] dark:bg-white/[0.03]">
                
                {/* HEADER */}
                <div className="border-b px-6 py-4 dark:border-white/[0.05]">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    📩 Feedback client
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Détails du message envoyé par le client le {formatDateFR(selectedFeedback.date)}
                  </p>
                </div>

                {/* BODY */}
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                    {/* NOM */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Nom
                      </p>
                      <div className="mt-1 rounded-lg bg-gray-50 px-4 py-2 text-gray-800 dark:bg-gray-900 dark:text-white">
                        {selectedFeedback.name}
                      </div>
                    </div>

                    {/* EMAIL */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Email
                      </p>
                      <div className="mt-1 rounded-lg bg-gray-50 px-4 py-2 text-gray-800 dark:bg-gray-900 dark:text-white">
                        {selectedFeedback.email}
                      </div>
                    </div>

                    {/* TELEPHONE */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Téléphone
                      </p>
                      <div className="mt-1 rounded-lg bg-gray-50 px-4 py-2 text-gray-800 dark:bg-gray-900 dark:text-white">
                        {selectedFeedback.phone}
                      </div>
                    </div>

                    {/* SUJET */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Sujet
                      </p>
                      <div className="mt-1 rounded-lg bg-gray-50 px-4 py-2 font-medium text-gray-800 dark:bg-gray-900 dark:text-white">
                        {selectedFeedback.subject}
                      </div>
                    </div>

                    {/* MESSAGE */}
                    <div className="lg:col-span-2">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Message
                      </p>
                      <div className="mt-1 min-h-[120px] whitespace-pre-wrap rounded-lg bg-gray-50 px-4 py-3 text-gray-800 dark:bg-gray-900 dark:text-white">
                        {selectedFeedback.message}
                      </div>
                    </div>

                  </div>
                </div>

                {/* FOOTER */}
                <div className="flex justify-end border-t bg-gray-50 px-6 py-4 dark:border-white/[0.05] dark:bg-gray-900">
                  <Button variant="outline" onClick={closeModal}>
                    Fermer
                  </Button>
                </div>
              </div>
          )}
          
          </Modal>
      </>
  );
}
