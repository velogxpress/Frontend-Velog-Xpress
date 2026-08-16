
import { SidebarProvider } from "@/private/context/SidebarContext";
import { ThemeProvider } from "@/private/context/ThemeContext";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </ThemeProvider>
  );
}
