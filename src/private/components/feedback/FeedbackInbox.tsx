"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import Button from "../ui/button/Button";
import { listFeedBacks, markAsRead } from "@/services/FeedBackService";

interface Feedback {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  date: string;
}

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
}

function initialName(name: string): string {
  const names = name.trim().split(/\s+/);
  const first = names[0]?.charAt(0) ?? "F";
  const last = names.length > 1 ? names[names.length - 1].charAt(0) : "";

  return `${first}${last}`.toUpperCase();
}

function formatDateFR(dateStr?: string): string {
  if (!dateStr || typeof dateStr !== "string") return "N/A";

  const parts = dateStr.trim().split(" ");
  if (parts.length < 2) return dateStr;

  const [datePart, timePart] = parts;
  const dateSplit = datePart.split("-");
  const timeSplit = timePart.split(":");

  if (dateSplit.length !== 3 || timeSplit.length < 2) return dateStr;

  const [day, month, year] = dateSplit.map(Number);
  const [hour, minute] = timeSplit.map(Number);

  if ([day, month, year, hour, minute].some((value) => Number.isNaN(value))) {
    return dateStr;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(year, month - 1, day, hour, minute));
}

function formatWhatsappPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10 && digits.startsWith("0")) {
    return `509${digits.slice(1)}`;
  }

  if (digits.length === 8) {
    return `509${digits}`;
  }

  return digits;
}

export default function FeedbackInbox() {
  const [feedbacks, setFeedbacks] = React.useState<Feedback[]>([]);
  const [selectedFeedback, setSelectedFeedback] = React.useState<Feedback | null>(null);
  const [replyMessage, setReplyMessage] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalElements, setTotalElements] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchFeedbacks = React.useCallback(async (pageNumber: number) => {
    setIsLoading(true);
    try {
      const response = await listFeedBacks(pageNumber);
      const data = response.data as PageResponse<Feedback>;
      const content = data.content ?? [];

      setFeedbacks(content);
      setTotalPages(data.totalPages ?? 0);
      setTotalElements(data.totalElements ?? content.length);
      setSelectedFeedback((current) => current ?? content[0] ?? null);
    } catch (error) {
      console.error("Erreur lors du chargement des feedbacks:", error);
      setFeedbacks([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchFeedbacks(page);
  }, [fetchFeedbacks, page]);

  const handleSelectFeedback = async (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setReplyMessage("");

    if (feedback.status === "U/R") {
      try {
        await markAsRead(feedback.id);
        setFeedbacks((current) =>
          current.map((item) =>
            item.id === feedback.id ? { ...item, status: "READ" } : item
          )
        );
        window.dispatchEvent(new Event("feedback-notifications-updated"));
      } catch (error) {
        console.error("Erreur lors du marquage du feedback:", error);
      }
    }
  };

  const handleWhatsappReply = () => {
    if (!selectedFeedback?.phone || !replyMessage.trim()) return;

    const phone = formatWhatsappPhone(selectedFeedback.phone);
    if (!phone) return;

    const message = encodeURIComponent(replyMessage.trim());
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="grid min-h-[calc(100vh-170px)] grid-cols-1 gap-5 xl:grid-cols-[460px_1fr]">
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Feedback clients
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {totalElements} message(s)
            </p>
          </div>
        </div>

        <div className="custom-scrollbar max-h-[calc(100vh-330px)] min-h-[620px] space-y-3 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-5 text-center text-sm text-gray-500 dark:border-white/[0.08] dark:text-gray-400">
              Chargement...
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-5 text-center text-sm text-gray-500 dark:border-white/[0.08] dark:text-gray-400">
              Aucun feedback trouve.
            </div>
          ) : (
            feedbacks.map((feedback) => (
              <button
                key={feedback.id}
                type="button"
                title="Afficher le detail du feedback"
                onClick={() => handleSelectFeedback(feedback)}
                className={`w-full rounded-lg border p-4 text-left transition ${
                  selectedFeedback?.id === feedback.id
                    ? "border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-500/10"
                    : "border-gray-200 bg-white hover:border-brand-200 hover:bg-gray-50 dark:border-white/[0.05] dark:bg-white/[0.03] dark:hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                    {initialName(feedback.name || "Feedback")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-3">
                      <span className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">
                        {feedback.name || "Client"}
                      </span>
                      {feedback.status === "U/R" && (
                        <span className="flex h-2.5 w-2.5 shrink-0 rounded-full bg-error-500" />
                      )}
                    </span>
                    <span className="mt-1 block truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                      {feedback.subject || "Sans sujet"}
                    </span>
                    <span className="mt-1 block text-theme-xs text-gray-500 dark:text-gray-400">
                      {formatDateFR(feedback.date)}
                    </span>
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            disabled={page === 0}
            title="Afficher la page precedente"
            onClick={() => setPage((current) => current - 1)}
            className="rounded bg-gray-200 px-4 py-2 disabled:opacity-40"
          >
            Precedent
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {totalPages === 0 ? 0 : page + 1} / {totalPages}
          </span>
          <button
            disabled={totalPages === 0 || page + 1 >= totalPages}
            title="Afficher la page suivante"
            onClick={() => setPage((current) => current + 1)}
            className="rounded bg-gray-200 px-4 py-2 disabled:opacity-40"
          >
            Suivant
          </button>
        </div>
      </div>

      <div className="min-h-[calc(100vh-170px)] rounded-lg border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
        {selectedFeedback ? (
          <div className="flex h-full flex-col">
            <div className="border-b border-gray-100 pb-5 dark:border-white/[0.05]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    {selectedFeedback.subject || "Sans sujet"}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {formatDateFR(selectedFeedback.date)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-theme-xs font-medium ${
                    selectedFeedback.status === "U/R"
                      ? "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500"
                      : "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
                  }`}
                >
                  {selectedFeedback.status === "U/R" ? "Non lu" : "Lu"}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
                  <p className="text-theme-xs uppercase text-gray-400 dark:text-gray-500">
                    Client
                  </p>
                  <p className="mt-1 break-words text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedFeedback.name || "N/A"}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
                  <p className="text-theme-xs uppercase text-gray-400 dark:text-gray-500">
                    Telephone
                  </p>
                  <p className="mt-1 break-words text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedFeedback.phone || "N/A"}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/[0.03]">
                  <p className="text-theme-xs uppercase text-gray-400 dark:text-gray-500">
                    Email
                  </p>
                  <p className="mt-1 break-words text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedFeedback.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="custom-scrollbar mt-5 max-h-[calc(100vh-620px)] min-h-[300px] overflow-y-auto rounded-lg bg-gray-50 p-5 text-sm leading-6 text-gray-700 dark:bg-white/[0.03] dark:text-gray-300">
              {selectedFeedback.message || "Aucun message."}
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reponse WhatsApp
              </label>
              <textarea
                rows={6}
                value={replyMessage}
                onChange={(event) => setReplyMessage(event.target.value)}
                placeholder="Ekri repons ou vle voye sou WhatsApp..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
              />
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                size="sm"
                title="Voye repons lan sou WhatsApp"
                disabled={!selectedFeedback.phone || !replyMessage.trim()}
                startIcon={<MessageCircle className="size-4" />}
                onClick={handleWhatsappReply}
              >
                Reponn sou WhatsApp
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 dark:border-white/[0.08] dark:text-gray-400">
            Chwazi yon feedback pou we detay li.
          </div>
        )}
      </div>
    </div>
  );
}
