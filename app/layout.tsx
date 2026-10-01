import type { Metadata } from 'next';
import { Figtree, Geist_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Provider } from '@/components/core/provider';

const figtree = Figtree({
  variable: '--font-figtree-text',
  subsets: ['latin'],
  display: 'swap',
});

const space = Space_Grotesk({
  variable: '--font-space-heading',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'DesignLoop | Master Low-Level Design with AI',
    template: '%s | DesignLoop',
  },

  description:
    'Solve real-world low-level design problems, master design patterns, and get instant feedback from your AI design assistant.',

  keywords: [
    'Low Level Design',
    'LLD Interview Prep',
    'LLD Practice',
    'Object-Oriented Design',
    'Design Patterns',
    'Software Architecture',
    'System Design',
    'AI Design Assistant',
  ],

  applicationName: 'DesignLoop',

  openGraph: {
    title: 'DesignLoop | Master Low-Level Design with AI',
    description:
      'Practice real-world LLD problems, master design patterns, and get instant AI feedback on your designs.',
    type: 'website',
    siteName: 'DesignLoop',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'DesignLoop | Master Low-Level Design with AI',
    description:
      'Practice real-world LLD problems and get instant feedback from your AI design assistant.',
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        'h-full',
        'antialiased',
        figtree.variable,
        space.variable,
        geistMono.variable,
        'font-figtree-text'
      )}
    >
      <body className="min-h-full font-figtree-text">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
