import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/navbar"; // Import de ta Navbar
import { Toaster } from "@/components/ui/sonner"; // Pour les notifications élégantes
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SessionProvider } from "@/components/providers/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TANKAACADEMY | Plateforme d'Apprentissage",
  description: "Apprenez et enseignez sur la meilleure plateforme éducative.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}
      >
        <div className="h-full">
          <SessionProvider>
            <div className="h-[80px] fixed inset-y-0 w-full z-50">
              <Navbar />
            </div>
            <main className="pt-[80px] h-full">
              {children}
            </main>
            
            {/* Composant pour les Toasts Shadcn (succès/erreur) */}
            <Toaster />
            <ConfettiProvider />
            <ModalProvider />
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}