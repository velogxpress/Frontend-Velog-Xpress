import Link from "next/link";
import { ArrowRight, CalendarDays, PackagePlus, ScanLine } from "lucide-react";

export default function DashboardWelcome() {
  const formattedDate = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  return (
    <section className="vx-dashboard-welcome">
      <div><p>Vue générale · {formattedDate}</p><h1>Bonjour — voici l’essentiel.</h1><span>Les opérations prioritaires et la performance de Velog Xpress, réunies dans une vue claire.</span></div>
      <div className="vx-dashboard-quick-actions"><Link href="/dashboard/admin/commande"><PackagePlus /> Nouvelle commande</Link><Link href="/dashboard/admin/checkin"><ScanLine /> Scanner un colis</Link><Link href="/dashboard/admin/activites"><CalendarDays /> Voir les activités <ArrowRight /></Link></div>
    </section>
  );
}
