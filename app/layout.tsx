import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { metadataConfig } from '@/config/metadata';
import { TooltipProvider } from '@/components/ui/tooltip';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: metadataConfig.title,
    template: `%s | ${metadataConfig.title}`,
  }, //%s will be replaced with the page title
  description: metadataConfig.description,
  keywords: metadataConfig.keywords,
  icons: [
    {
      url: '/logo/logo.webp',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <TooltipProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </TooltipProvider>
    </html>
  );
}
