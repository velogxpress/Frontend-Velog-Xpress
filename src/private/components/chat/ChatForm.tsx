"use client";

import * as React from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { toast } from "react-toastify";
import { sendEmail } from "../../../services/SendEmailService";
import { listAllClients } from "../../../services/RegisterService";


type RecipientStatus = "pending" | "sent" | "duplicate" | "invalid" | "failed";

type ClientRecord = {
  id?: number | string;
  name?: string | null;
  email?: string | null;
  usercode?: string | null;
};

type Recipient = {
  email: string;
  name: string;
  usercode: string;
  status: RecipientStatus;
  reason: string;
  attempts: number;
  sentAt: string | null;
};

type Stats = {
  totalClients: number;
  uniqueValidEmails: number;
  invalidEmails: number;
  duplicateEmails: number;
};

type CampaignSnapshot = {
  subject: string;
  message: string;
  batchSize: number;
  intervalHours: number;
  isRunning: boolean;
  lastRunAt: string | null;
  nextRunAt: string | null;
  recipients: Recipient[];
  audienceMode?: "all" | "test";
  testEmails?: string[];
  testRecipients?: Recipient[];
};

type ClientResponse = {
  content?: ClientRecord[];
  totalPages?: number;
  last?: boolean;
};

const STORAGE_KEY = "velogxpress-email-campaign";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_BATCH_SIZE = 300;
const MAX_BATCH_SIZE = 300;
const RECIPIENTS_PER_PAGE = 18;

const EMPTY_STATS: Stats = {
  totalClients: 0,
  uniqueValidEmails: 0,
  invalidEmails: 0,
  duplicateEmails: 0,
};

const statusStyles: Record<RecipientStatus, string> = {
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  sent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  duplicate:
    "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  invalid: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  failed: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
};

function normaliseText(value: string | null | undefined): string {
  return (value ?? "").trim();
}

function normaliseEmail(email: string | null | undefined): string {
  return normaliseText(email).toLowerCase();
}

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

function buildRecipients(
  clients: ClientRecord[],
  previousRecipients: Recipient[] = []
): { recipients: Recipient[]; stats: Stats } {
  const previousByEmail = new Map(
    previousRecipients.map((recipient) => [recipient.email, recipient])
  );
  const seenEmails = new Set<string>();
  const recipients: Recipient[] = [];

  let invalidEmails = 0;
  let duplicateEmails = 0;
  let uniqueValidEmails = 0;

  clients.forEach((client, index) => {
    const email = normaliseEmail(client.email);
    const name = normaliseText(client.name) || "Client sans nom";
    const usercode = normaliseText(client.usercode) || `CLIENT-${index + 1}`;

    if (!email || !isValidEmail(email)) {
      invalidEmails += 1;
      recipients.push({
        email: email || `sans-email-${index + 1}`,
        name,
        usercode,
        status: "invalid",
        reason: email ? "Email invalide" : "Email manquant",
        attempts: 0,
        sentAt: null,
      });
      return;
    }

    if (seenEmails.has(email)) {
      duplicateEmails += 1;
      recipients.push({
        email,
        name,
        usercode,
        status: "duplicate",
        reason: "Email duplique",
        attempts: 0,
        sentAt: null,
      });
      return;
    }

    seenEmails.add(email);
    uniqueValidEmails += 1;

    const previous = previousByEmail.get(email);
    recipients.push({
      email,
      name,
      usercode,
      status: previous?.status === "sent" || previous?.status === "failed" ? previous.status : "pending",
      reason:
        previous?.status === "sent"
          ? "Email envoye"
          : previous?.status === "failed"
          ? previous.reason || "Echec precedent"
          : "Pret pour envoi",
      attempts: previous?.attempts ?? 0,
      sentAt: previous?.sentAt ?? null,
    });
  });

  return {
    recipients,
    stats: {
      totalClients: clients.length,
      uniqueValidEmails,
      invalidEmails,
      duplicateEmails,
    },
  };
}

function formatDate(dateValue: string | null): string {
  if (!dateValue) return "--";

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(dateValue));
}

function formatCountdown(targetDate: string | null): string {
  if (!targetDate) return "--";

  const remaining = new Date(targetDate).getTime() - Date.now();
  if (remaining <= 0) return "Maintenant";

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  }

  return `${minutes.toString().padStart(2, "0")}m ${seconds
    .toString()
    .padStart(2, "0")}s`;
}

function buildTestRecipients(testEmails: string[]): Recipient[] {
  const seenEmails = new Set<string>();

  return testEmails.map((emailValue, index) => {
    const email = normaliseEmail(emailValue);
    const name = `Test ${index + 1}`;
    const usercode = `TEST-${index + 1}`;

    if (!email || !isValidEmail(email)) {
      return {
        email: email || `test-sans-email-${index + 1}`,
        name,
        usercode,
        status: "invalid" as RecipientStatus,
        reason: email ? "Email invalide" : "Email manquant",
        attempts: 0,
        sentAt: null,
      };
    }

    if (seenEmails.has(email)) {
      return {
        email,
        name,
        usercode,
        status: "duplicate" as RecipientStatus,
        reason: "Email duplique",
        attempts: 0,
        sentAt: null,
      };
    }

    seenEmails.add(email);

    return {
      email,
      name,
      usercode,
      status: "pending" as RecipientStatus,
      reason: "Pret pour test",
      attempts: 0,
      sentAt: null,
    };
  });
}

async function fetchAllClients(): Promise<ClientRecord[]> {
  const response = await listAllClients(0);
  const data = response.data as ClientResponse;

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  return [];
}

export default function ChatForm() {
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [batchSize, setBatchSize] = React.useState(DEFAULT_BATCH_SIZE);
  const [intervalHours, setIntervalHours] = React.useState(1);
  const [isRunning, setIsRunning] = React.useState(false);
  const [isLoadingClients, setIsLoadingClients] = React.useState(true);
  const [isSendingBatch, setIsSendingBatch] = React.useState(false);
  const [lastRunAt, setLastRunAt] = React.useState<string | null>(null);
  const [nextRunAt, setNextRunAt] = React.useState<string | null>(null);
  const [recipients, setRecipients] = React.useState<Recipient[]>([]);
  const [stats, setStats] = React.useState<Stats>(EMPTY_STATS);
  const [statusFilter, setStatusFilter] = React.useState<"all" | RecipientStatus>("all");
  const [currentRecipientsPage, setCurrentRecipientsPage] = React.useState(1);
  const [audienceMode, setAudienceMode] = React.useState<"all" | "test">("all");
  const [testEmails, setTestEmails] = React.useState(["", "", ""]);
  const [testRecipients, setTestRecipients] = React.useState<Recipient[]>(
    buildTestRecipients(["", "", ""])
  );
  const [isHydrated, setIsHydrated] = React.useState(false);

  const activeRecipients = React.useMemo(() => {
    if (audienceMode === "test") {
      return testRecipients;
    }

    return recipients;
  }, [audienceMode, recipients, testRecipients]);

  const pendingRecipients = React.useMemo(
    () => activeRecipients.filter((recipient) => recipient.status === "pending"),
    [activeRecipients]
  );
  const sentRecipients = React.useMemo(
    () => activeRecipients.filter((recipient) => recipient.status === "sent"),
    [activeRecipients]
  );
  const failedRecipients = React.useMemo(
    () => activeRecipients.filter((recipient) => recipient.status === "failed"),
    [activeRecipients]
  );

  const filteredRecipients = React.useMemo(() => {
    if (statusFilter === "all") {
      return activeRecipients;
    }

    return activeRecipients.filter((recipient) => recipient.status === statusFilter);
  }, [activeRecipients, statusFilter]);

  const totalRecipientPages = React.useMemo(() => {
    return Math.max(1, Math.ceil(filteredRecipients.length / RECIPIENTS_PER_PAGE));
  }, [filteredRecipients.length]);

  const visibleRecipients = React.useMemo(
    () =>
      filteredRecipients.slice(
        (currentRecipientsPage - 1) * RECIPIENTS_PER_PAGE,
        currentRecipientsPage * RECIPIENTS_PER_PAGE
      ),
    [currentRecipientsPage, filteredRecipients]
  );

  React.useEffect(() => {
    setCurrentRecipientsPage(1);
  }, [statusFilter]);

  React.useEffect(() => {
    if (currentRecipientsPage > totalRecipientPages) {
      setCurrentRecipientsPage(totalRecipientPages);
    }
  }, [currentRecipientsPage, totalRecipientPages]);

  const progressPercentage = React.useMemo(() => {
    if (stats.uniqueValidEmails === 0) return 0;
    return Math.round((sentRecipients.length / stats.uniqueValidEmails) * 100);
  }, [sentRecipients.length, stats.uniqueValidEmails]);

  const loadClients = React.useCallback(async () => {
    setIsLoadingClients(true);

    try {
      let savedState: CampaignSnapshot | null = null;
      const rawState =
        typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;

      if (rawState) {
        savedState = JSON.parse(rawState) as CampaignSnapshot;
        setSubject(savedState.subject ?? "");
        setMessage(savedState.message ?? "");
        setBatchSize(savedState.batchSize ?? DEFAULT_BATCH_SIZE);
        setIntervalHours(savedState.intervalHours ?? 1);
        setIsRunning(savedState.isRunning ?? false);
        setLastRunAt(savedState.lastRunAt ?? null);
        setNextRunAt(savedState.nextRunAt ?? null);
        setAudienceMode(savedState.audienceMode ?? "all");
        setTestEmails(savedState.testEmails ?? ["", "", ""]);
        setTestRecipients(savedState.testRecipients ?? []);
      }

      const clients = await fetchAllClients();
      const { recipients: builtRecipients, stats: builtStats } = buildRecipients(
        clients,
        savedState?.recipients ?? []
      );

      setRecipients(builtRecipients);
      setStats(builtStats);
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
      toast.error("Impossible de charger les clients pour la campagne email.");
    } finally {
      setIsLoadingClients(false);
      setIsHydrated(true);
    }
  }, []);

  React.useEffect(() => {
    void loadClients();
  }, [loadClients]);

  React.useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;

    const snapshot: CampaignSnapshot = {
      subject,
      message,
      batchSize,
      intervalHours,
      isRunning,
      lastRunAt,
      nextRunAt,
      recipients,
      audienceMode,
      testEmails,
      testRecipients,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }, [
    batchSize,
    intervalHours,
    isHydrated,
    isRunning,
    lastRunAt,
    message,
    nextRunAt,
    recipients,
    subject,
    audienceMode,
    testEmails,
    testRecipients,
  ]);

  const handleTestEmailChange = (index: number, value: string) => {
    setTestEmails((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item))
    );
    setTestRecipients((current) => {
      const nextEmails = testEmails.map((item, itemIndex) =>
        itemIndex === index ? value : item
      );
      const rebuiltRecipients = buildTestRecipients(nextEmails);

      return rebuiltRecipients.map((recipient, recipientIndex) => {
        const previousRecipient = current[recipientIndex];
        if (
          previousRecipient &&
          previousRecipient.email === recipient.email &&
          (previousRecipient.status === "sent" || previousRecipient.status === "failed")
        ) {
          return previousRecipient;
        }

        return recipient;
      });
    });
  };

  const executeBatch = React.useCallback(async (continueCampaign = isRunning) => {
    if (isSendingBatch) return;
    if (!subject.trim() || !message.trim()) {
      toast.error("Ajoutez un sujet et un message avant l'envoi.");
      setIsRunning(false);
      setNextRunAt(null);
      return;
    }

    const sourceRecipients = audienceMode === "test" ? testRecipients : recipients;
    const currentPending = sourceRecipients.filter((recipient) => recipient.status === "pending");
    if (currentPending.length === 0) {
      toast.info("Tous les emails valides ont deja ete traites.");
      setIsRunning(false);
      setNextRunAt(null);
      return;
    }

    const recipientsForBatch = currentPending.slice(0, batchSize);
    setIsSendingBatch(true);

    const updatedRecipients = audienceMode === "test" ? [...sourceRecipients] : [...recipients];
    const recipientIndexes = new Map(
      updatedRecipients.map((recipient, index) => [
        `${recipient.email}-${recipient.usercode}`,
        index,
      ])
    );

    let sentCount = 0;
    let failedCount = 0;

    for (const recipient of recipientsForBatch) {
      const recipientKey = `${recipient.email}-${recipient.usercode}`;
      const recipientIndex = recipientIndexes.get(recipientKey);

      if (recipientIndex === undefined) {
        continue;
      }

      try {
        await sendEmail(
          encodeURIComponent(recipient.email),
          encodeURIComponent(subject.trim()),
          encodeURIComponent(message.trim())
        );

        updatedRecipients[recipientIndex] = {
          ...updatedRecipients[recipientIndex],
          status: "sent",
          reason: "Email envoye",
          attempts: updatedRecipients[recipientIndex].attempts + 1,
          sentAt: new Date().toISOString(),
        };
        sentCount += 1;
      } catch (error) {
        console.error(`Erreur envoi email vers ${recipient.email}:`, error);
        updatedRecipients[recipientIndex] = {
          ...updatedRecipients[recipientIndex],
          status: "failed",
          reason: "Echec de l'envoi",
          attempts: updatedRecipients[recipientIndex].attempts + 1,
          sentAt: null,
        };
        failedCount += 1;
      }
    }

    const remainingPending = updatedRecipients.filter(
      (recipient) => recipient.status === "pending"
    ).length;

    if (audienceMode === "test") {
      setTestRecipients(updatedRecipients);
    } else {
      setRecipients(updatedRecipients);
    }

    const runTimestamp = new Date().toISOString();
    setLastRunAt(runTimestamp);

    if (remainingPending > 0 && continueCampaign) {
      const nextTimestamp = new Date(
        Date.now() + intervalHours * 60 * 60 * 1000
      ).toISOString();
      setNextRunAt(nextTimestamp);
      setIsRunning(true);
      toast.success(
        `${sentCount} email(s) envoye(s), ${failedCount} en echec. Prochain lot dans ${intervalHours}h.`
      );
    } else {
      setIsRunning(false);
      setNextRunAt(null);
      toast.success(
        `Lot termine: ${sentCount} email(s) envoye(s), ${failedCount} en echec.`
      );
    }

    setIsSendingBatch(false);
  }, [audienceMode, batchSize, intervalHours, isRunning, isSendingBatch, message, recipients, subject, testRecipients]);

  React.useEffect(() => {
    if (!isRunning || !nextRunAt || isSendingBatch) return;

    const interval = window.setInterval(() => {
      if (Date.now() >= new Date(nextRunAt).getTime()) {
        void executeBatch(true);
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [executeBatch, isRunning, isSendingBatch, nextRunAt]);

  const handleStartCampaign = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Le sujet et le message sont obligatoires.");
      return;
    }

    if (pendingRecipients.length === 0) {
      toast.info("Aucun email valide en attente d'envoi.");
      return;
    }

    setIsRunning(true);
    setNextRunAt(null);
    await executeBatch(true);
  };

  const handlePauseCampaign = () => {
    setIsRunning(false);
    setNextRunAt(null);
    toast.info("La campagne est mise en pause.");
  };

  const handleResetCampaign = () => {
    setSubject("");
    setMessage("");

    if (audienceMode === "test") {
      setTestEmails(["", "", ""]);
      setTestRecipients(buildTestRecipients(["", "", ""]));
      setIsRunning(false);
      setLastRunAt(null);
      setNextRunAt(null);
      toast.info("Les emails de test ont ete reinitialises.");
      return;
    }

    setRecipients((currentRecipients) =>
      currentRecipients.map((recipient) => {
        if (recipient.status === "sent" || recipient.status === "failed") {
          return {
            ...recipient,
            status: "pending",
            reason: "Pret pour envoi",
            attempts: 0,
            sentAt: null,
          };
        }

        return recipient;
      })
    );
    setIsRunning(false);
    setLastRunAt(null);
    setNextRunAt(null);
    toast.info("La campagne a ete reinitialisee.");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-6 text-white shadow-xl dark:border-white/[0.08]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/80">
              Campaign Control
            </p>
            <h2 className="mt-3 text-2xl font-semibold lg:text-3xl">
              Tableau d&apos;envoi email clients
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              Cette vue dedoublonne les emails, ecarte les adresses invalides et
              envoie les messages par lots pour reduire le risque de blocage par
              SendGrid.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/70">
                Statut
              </p>
              <p className="mt-2 text-lg font-semibold">
                {isRunning ? "Campagne active" : "Campagne en pause"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/70">
                Prochain lot
              </p>
              <p className="mt-2 text-lg font-semibold">
                {formatCountdown(nextRunAt)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/70">
                Progression
              </p>
              <p className="mt-2 text-lg font-semibold">{progressPercentage}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/[0.08] dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Clients charges</p>
          <p className="mt-3 text-3xl font-semibold text-gray-900 dark:text-white">
            {stats.totalClients}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            Emails valides uniques
          </p>
          <p className="mt-3 text-3xl font-semibold text-emerald-900 dark:text-emerald-100">
            {stats.uniqueValidEmails}
          </p>
        </div>
        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 dark:border-violet-500/20 dark:bg-violet-500/10">
          <p className="text-sm text-violet-700 dark:text-violet-300">
            Emails dupliques
          </p>
          <p className="mt-3 text-3xl font-semibold text-violet-900 dark:text-violet-100">
            {stats.duplicateEmails}
          </p>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-500/20 dark:bg-rose-500/10">
          <p className="text-sm text-rose-700 dark:text-rose-300">Emails invalides</p>
          <p className="mt-3 text-3xl font-semibold text-rose-900 dark:text-rose-100">
            {stats.invalidEmails}
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.08] dark:bg-white/[0.03]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Redaction du message
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Premier lot immediat, puis repetition automatique selon
                l&apos;intervalle choisi.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void loadClients()}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/[0.05]"
            >
              {isLoadingClients ? "Chargement..." : "Rafraichir les clients"}
            </button>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label>Mode d&apos;envoi</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setAudienceMode("all")}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    audienceMode === "all"
                      ? "border-cyan-500 bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/[0.05]"
                  }`}
                >
                  <p className="font-semibold">Tous les clients</p>
                  <p className="mt-1 text-xs opacity-80">
                    Utilise la liste dedoublonnee du systeme.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAudienceMode("test");
                    setTestRecipients((current) =>
                      current.length > 0 ? current : buildTestRecipients(testEmails)
                    );
                  }}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    audienceMode === "test"
                      ? "border-cyan-500 bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/[0.05]"
                  }`}
                >
                  <p className="font-semibold">Mode test</p>
                  <p className="mt-1 text-xs opacity-80">
                    Envoie seulement aux 3 emails que ou antre manyelman.
                  </p>
                </button>
              </div>
            </div>

            {audienceMode === "test" && (
              <div className="md:col-span-2 rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4 dark:border-cyan-500/20 dark:bg-cyan-500/10">
                <p className="text-sm font-semibold text-cyan-900 dark:text-cyan-200">
                  Emails de test
                </p>
                <p className="mt-1 text-xs text-cyan-800 dark:text-cyan-300">
                  Antre jiska 3 email pou verifye mesaj la anvan ou itilize lis kliyan an.
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {testEmails.map((email, index) => (
                    <div key={`test-email-${index}`}>
                      <Label htmlFor={`test-email-${index + 1}`}>Email test {index + 1}</Label>
                      <Input
                        id={`test-email-${index + 1}`}
                        type="email"
                        placeholder={`test${index + 1}@example.com`}
                        value={email}
                        onChange={(event) =>
                          handleTestEmailChange(index, event.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="subject">Sujet</Label>
              <Input
                id="subject"
                type="text"
                placeholder="Ex: Mise a jour Velog Xpress"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="batch-size">Taille du lot</Label>
              <Input
                id="batch-size"
                type="number"
                min="1"
                max={MAX_BATCH_SIZE.toString()}
                value={batchSize}
                onChange={(event) =>
                  setBatchSize(
                    Math.min(
                      MAX_BATCH_SIZE,
                      Math.max(1, Number(event.target.value) || DEFAULT_BATCH_SIZE)
                    )
                  )
                }
                hint="Maximum 300 emails par lot."
              />
            </div>
            <div>
              <Label htmlFor="interval">Intervalle entre les lots</Label>
              <select
                id="interval"
                value={intervalHours}
                onChange={(event) => setIntervalHours(Number(event.target.value))}
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option value={1}>Chaque 1 heure</option>
                <option value={2}>Chaque 2 heures</option>
                <option value={3}>Chaque 3 heures</option>
                <option value={4}>Chaque 4 heures</option>
              </select>
            </div>
            <div>
              <Label htmlFor="pending-count">Emails en attente</Label>
              <Input
                id="pending-count"
                type="text"
                value={pendingRecipients.length}
                disabled
              />
            </div>
          </div>

          <div className="mt-5">
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              rows={9}
              placeholder="Ecrivez le message qui sera envoye aux clients..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void handleStartCampaign()}
              disabled={isLoadingClients || isSendingBatch}
              className="rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSendingBatch ? "Envoi en cours..." : "Envoyer la campagne"}
            </button>
            <button
              type="button"
              onClick={() => void executeBatch()}
              disabled={isLoadingClients || isSendingBatch || pendingRecipients.length === 0}
              className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/[0.05]"
            >
              Envoyer le prochain lot maintenant
            </button>
            <button
              type="button"
              onClick={handlePauseCampaign}
              disabled={!isRunning}
              className="rounded-xl border border-amber-300 px-5 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-amber-500/30 dark:text-amber-300 dark:hover:bg-amber-500/10"
            >
              Mettre en pause
            </button>
            <button
              type="button"
              onClick={handleResetCampaign}
              disabled={isSendingBatch}
              className="rounded-xl border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-500/30 dark:text-rose-300 dark:hover:bg-rose-500/10"
            >
              Reinitialiser la campagne
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.08] dark:bg-white/[0.03]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Suivi de la campagne
            </h3>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  Envoyes
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                  {sentRecipients.length}
                </p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  En attente
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                  {pendingRecipients.length}
                </p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  Echecs
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                  {failedRecipients.length}
                </p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  Dernier lot
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                  {formatDate(lastRunAt)}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
              Le planificateur automatique repose sur cette page ouverte dans le
              navigateur. Les statuts sont sauvegardes localement pour reprendre
              la campagne apres un rafraichissement.
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.08] dark:bg-white/[0.03]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  File des emails
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Apercu des destinataires et de leur statut.
                </p>
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as "all" | RecipientStatus)
                }
                className="h-10 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option value="all">Tous</option>
                <option value="pending">Pending</option>
                <option value="sent">Sent</option>
                <option value="failed">Failed</option>
                <option value="duplicate">Duplicate</option>
                <option value="invalid">Invalid</option>
              </select>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="max-h-[520px] overflow-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                  <thead className="bg-gray-50 dark:bg-gray-900/60">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                        Client
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-transparent">
                    {visibleRecipients.map((recipient) => (
                      <tr key={`${recipient.email}-${recipient.usercode}`}>
                        <td className="px-4 py-3 align-top">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {recipient.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {recipient.usercode}
                          </p>
                        </td>
                        <td className="px-4 py-3 align-top text-sm text-gray-600 dark:text-gray-300">
                          {recipient.email}
                        </td>
                        <td className="px-4 py-3 align-top">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[recipient.status]}`}
                          >
                            {recipient.status}
                          </span>
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            {recipient.reason}
                          </p>
                          {recipient.sentAt && (
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              Envoye le {formatDate(recipient.sentAt)}
                            </p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {filteredRecipients.length} resultat(s). Page {currentRecipientsPage} sur{" "}
                {totalRecipientPages}.
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentRecipientsPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentRecipientsPage === 1}
                  className="rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/[0.05]"
                >
                  Precedent
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentRecipientsPage((page) =>
                      Math.min(totalRecipientPages, page + 1)
                    )
                  }
                  disabled={currentRecipientsPage === totalRecipientPages}
                  className="rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/[0.05]"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
