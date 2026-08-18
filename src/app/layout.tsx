
import "aos/dist/aos.css";
import { AuthProvider } from "@/private/context/AuthContext";
import { NavigationProvider } from "@/private/context/NavigationContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <NavigationProvider>
            {children}
          </NavigationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
