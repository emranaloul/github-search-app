import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SearchIcon } from 'lucide-react';
import { SearchProvider } from '@/context/SearchContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'GitHub Search',
  description: 'A simple GitHub search app built with Next.js and TypeScript.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-black min-h-screen flex flex-col dark`}
      >
        <header className='border-b border-zinc-200 bg-white py-4 px-6 dark:border-zinc-800 dark:bg-black'>
          <div className='container mx-auto p-4'>
            <div className='flex item-center gap-2'>
              <SearchIcon className='h-6 w-6 my-auto' />
              <h1>
                <span className='dark:text-zinc-50 text-zinc-950 text-2xl '>
                  GitHub Search
                </span>
              </h1>
            </div>
          </div>
        </header>
        <SearchProvider>{children}</SearchProvider>
      </body>
    </html>
  );
}
