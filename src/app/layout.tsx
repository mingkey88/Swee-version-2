import type { Metadata } from 'next';
import { Geist, Geist_Mono, Sacramento } from 'next/font/google';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Thin script close to the Swee wordmark in the brand deck.
const sacramento = Sacramento({
  variable: '--font-sacramento',
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Swee: beauty services without the sales pressure',
    template: '%s · Swee',
  },
  description:
    'Book trusted beauty and wellness services in Singapore. Transparent prices, vetted businesses, and no hard selling.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${sacramento.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
