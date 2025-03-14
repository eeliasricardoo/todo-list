import { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import { ToasterProvider } from "@/components/ui/toaster-provider";
import { AuthHeader } from '@/components/auth/auth-header';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Lista de Tarefas',
  description: 'Aplicativo de lista de tarefas criado com Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html 
        lang="pt-BR" 
        suppressHydrationWarning
      >
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <AuthHeader />
          <main>
            {children}
          </main>
          <ToasterProvider />
        </body>
      </html>
    </ClerkProvider>
  );
}
