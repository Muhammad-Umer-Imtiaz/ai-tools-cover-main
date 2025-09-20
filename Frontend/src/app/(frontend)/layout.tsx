// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import CompleteFooterSection from '@/components/Footer'
import LayoutWrapper from '@/components/LayoutWrapper'
import { Toaster } from 'react-hot-toast'
import ScrollButton from '@/components/ScrollButton'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// ✅ SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://aitoolscover.com'),
  title: 'AI Tools Cover - Discover the Best AI Tools',
  description:
    'Find and explore the best AI tools for your needs. Comprehensive directory of artificial intelligence software and applications.',
  alternates: {
    canonical: 'https://aitoolscover.com',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  keywords: [
    'AI tools',
    'best AI apps',
    'artificial intelligence software',
    'AI directory',
    'machine learning tools',
    'productivity AI',
  ],
  authors: [{ name: 'AI Tools Cover Team' }],
  publisher: 'AI Tools Cover',
}

// ✅ Viewport config alag export me (Next.js 13+)
export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-B1170RF10M"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-B1170RF10M');
            `,
          }}
        />
        {/* ✅ Social / Open Graph Meta Tags */}
        <meta property="og:title" content="AI Tools Cover - Discover the Best AI Tools" />
        <meta
          property="og:description"
          content="Find and explore the best AI tools for your needs. Comprehensive directory of artificial intelligence software and applications."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aitoolscover.com" />
        <meta property="og:image" content="https://aitoolscover.com/logo.png" />
        {/* ✅ Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Tools Cover - Discover the Best AI Tools" />
        <meta
          name="twitter:description"
          content="Find and explore the best AI tools for your needs. Comprehensive directory of artificial intelligence software and applications."
        />
        <meta name="twitter:image" content="https://aitoolscover.com/logo.png" />
        <meta name="twitter:site" content="@YourTwitterHandle" />
        {/* ✅ Schema Markup for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'AI Tools Cover',
              url: 'https://aitoolscover.com',
              publisher: {
                '@type': 'Organization',
                name: 'AI Tools Cover',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://aitoolscover.com/logo.png',
                },
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://aitoolscover.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <Navbar />
        <Toaster />
        <LayoutWrapper>{children}</LayoutWrapper>
        <CompleteFooterSection />
        <ScrollButton type="top" />
        <ScrollButton type="bottom" />
      </body>
    </html>
  )
}
