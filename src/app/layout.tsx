
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/hooks/use-auth';
import { TranslationProvider } from '@/hooks/use-translation';
import { FloatingLanguageSwitcher } from '@/components/layout/floating-language-switcher';

export const metadata: Metadata = {
  title: 'Scarlet Link',
  description: 'Connecting Patients, Donors, and Doctors.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <TranslationProvider>
            {children}
            <Toaster />
            <FloatingLanguageSwitcher />
          </TranslationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
