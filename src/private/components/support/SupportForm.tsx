"use client";

import {
  CheckCircle2,
  DownloadIcon,
  Headphones,
  MonitorDown,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

const supportSteps = [
  "Téléchargez le module selon votre appareil.",
  "Lancez le fichier et gardez l'application ouverte.",
  "Communiquez le code d'accès à l'équipe technique.",
];

const supportFeatures = [
  {
    title: "Assistance à distance",
    description: "Permet à l'équipe technique d'intervenir rapidement sur le poste.",
    icon: <Headphones className="size-5" />,
  },
  {
    title: "Diagnostic sécurisé",
    description: "Utile pour vérifier l'installation, les impressions et les accès.",
    icon: <ShieldCheck className="size-5" />,
  },
  {
    title: "Compatible multi-appareils",
    description: "Disponible pour ordinateur et application mobile Android.",
    icon: <MonitorDown className="size-5" />,
  },
];

function downloadFile(path: string, filename: string) {
  const link = document.createElement("a");
  link.href = path;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function SupportForm() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="bg-gray-50 p-6 dark:bg-white/[0.02] lg:col-span-5 lg:p-8">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
              <Headphones className="size-6" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Centre de support technique
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Téléchargez le module de support pour permettre à l&apos;équipe Velog Xpress de vous
              assister pendant une installation, une maintenance ou un incident technique.
            </p>

            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                Contact support
              </p>
              <a
                href="mailto:contact@wymcode.com"
                title="Cliquer pour envoyer un email au support"
                className="mt-1 block text-sm font-semibold text-blue-600 hover:underline dark:text-blue-300"
              >
                contact@wymcode.com
              </a>
              <a
                href="https://wa.me/19736406064"
                target="_blank"
                rel="noopener noreferrer"
                title="Cliquer pour ouvrir WhatsApp et contacter le support"
                className="mt-2 block text-sm font-semibold text-success-600 hover:underline dark:text-success-400"
              >
                WhatsApp: +1 973 640-6064
              </a>
            </div>
          </div>

          <div className="p-6 lg:col-span-7 lg:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => downloadFile("/downloads/VX Package.rar", "VX Package.rar")}
                className="group rounded-xl border border-gray-200 p-5 text-left transition hover:border-blue-200 hover:bg-blue-50 dark:border-gray-800 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10"
                title="Télécharger le module support pour ordinateur"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-white/90">
                    <MonitorDown className="size-5" />
                  </div>
                  <DownloadIcon className="size-5 text-gray-400 group-hover:text-blue-600" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-800 dark:text-white/90">
                  Module support ordinateur
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Package d&apos;assistance pour Windows et macOS.
                </p>
                <span className="mt-4 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  VX Package.rar
                </span>
              </button>

              <button
                type="button"
                onClick={() => downloadFile("/downloads/velog-app.apk", "velog-app.apk")}
                className="group rounded-xl border border-gray-200 p-5 text-left transition hover:border-blue-200 hover:bg-blue-50 dark:border-gray-800 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10"
                title="Télécharger l'application mobile Android"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-white/90">
                    <Smartphone className="size-5" />
                  </div>
                  <DownloadIcon className="size-5 text-gray-400 group-hover:text-blue-600" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-800 dark:text-white/90">
                  Application mobile
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  APK Android pour accéder aux outils Velog Xpress.
                </p>
                <span className="mt-4 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  velog-app.apk
                </span>
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {supportSteps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"
                >
                  <span className="flex size-8 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                    {index + 1}
                  </span>
                  <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {supportFeatures.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-white/90">
              {feature.icon}
            </div>
            <h3 className="mt-4 font-semibold text-gray-800 dark:text-white/90">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              {feature.description}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white/90">
              Avant de lancer une session support
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Vérifiez ces points pour éviter les interruptions pendant l&apos;assistance.
            </p>
          </div>
          <span className="rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-700 dark:bg-success-500/15 dark:text-success-400">
            Recommandé
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            "Connexion internet stable",
            "Imprimante ou appareil branché",
            "Accès administrateur disponible",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <CheckCircle2 className="size-4 text-success-600 dark:text-success-400" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
        © {new Date().getFullYear()} Wym Compagnie. Tous droits réservés.
      </footer>
    </div>
  );
}
