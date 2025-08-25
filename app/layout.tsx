import './globals.css';
import type { Metadata } from 'next';
import { Inter, Work_Sans } from 'next/font/google';
import { auth } from '@/auth';
import SessionProvider from '@/components/SessionProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const workSans = Work_Sans({ subsets: ['latin'], variable: '--font-worksans' });

export const metadata: Metadata = {
  title: 'Agenda Exora',
  description: 'PWA Agenda',
  manifest: '/manifest.webmanifest',
  themeColor: '#555BF6',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  return (
    <html lang="es-ES" className={`${inter.variable} ${workSans.variable}`}> 
      <body className="font-sans bg-white text-complement4 dark:bg-complement4 dark:text-white">
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
