import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Image Prompts for ChatGPT, DALL-E, Midjourney & More',
  description:
    'Explore 100+ AI image prompts for ChatGPT, DALL-E, Midjourney, Gemini & Stable Diffusion. Create portraits, landscapes, fantasy, and abstract art.',
  keywords: [
    'AI image prompts',
    'ChatGPT DALL-E prompts',
    'Midjourney prompts',
    'Google Gemini image prompts',
    'Leonardo AI prompts',
    'Stable Diffusion prompts',
    'AI art generation',
    'image generation prompts',
    'creative AI prompts',
    'digital art prompts',
    'fantasy art prompts',
    'portrait prompts',
    'landscape prompts',
    'abstract art prompts',
    'photography prompts',
    'architecture prompts',
    'anime prompts',
    'cyberpunk prompts',
  ].join(', '),
  authors: [{ name: 'AI Tools Directory' }],
  creator: 'AI Tools Directory',
  publisher: 'AI Tools Directory',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yoursite.com/prompts',
    title: 'AI Image Prompts for ChatGPT, DALL-E, Midjourney & More',
    description:
      'Explore 100+ AI image prompts for ChatGPT, DALL-E, Midjourney, Gemini & Stable Diffusion. Create portraits, landscapes, fantasy, and abstract art.',
    siteName: 'AI Tools Directory',
    images: [
      {
        url: 'https://yoursite.com/images/ai-prompts-og.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Image Prompts Collection - Professional prompts for ChatGPT DALL-E, Midjourney, Gemini, Leonardo AI',
        type: 'image/jpeg',
      },
      {
        url: 'https://yoursite.com/images/ai-prompts-square.jpg',
        width: 1080,
        height: 1080,
        alt: 'AI Image Prompts - Create stunning art with AI',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@yourtwitterhandle',
    creator: '@yourtwitterhandle',
    title: 'AI Image Prompts for ChatGPT, DALL-E, Midjourney & More',
    description:
      'Explore 100+ AI image prompts for ChatGPT, DALL-E, Midjourney, Gemini & Stable Diffusion. Create portraits, landscapes, fantasy, and abstract art.',
    images: [
      {
        url: 'https://yoursite.com/images/ai-prompts-twitter.jpg',
        alt: 'AI Image Prompts Collection',
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: 'https://yoursite.com/prompts',
    languages: {
      'en-US': 'https://yoursite.com/prompts',
      en: 'https://yoursite.com/prompts',
    },
  },
  category: 'Technology',
  classification: 'AI Tools and Resources',
  other: {
    'article:section': 'AI Tools',
    'article:tag':
      'AI prompts, image generation, ChatGPT, Midjourney, Gemini, Leonardo AI, Stable Diffusion',
    'format-detection': 'telephone=no',
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
    // other: {
    //   'msvalidate.01': 'your-bing-verification-code',
    // },
  },
  appleWebApp: {
    capable: true,
    title: 'AI Prompts',
    statusBarStyle: 'default',
  },
  applicationName: 'AI Tools Directory',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#7d42fb' },
    { media: '(prefers-color-scheme: dark)', color: '#7d42fb' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#7d42fb',
      },
    ],
  },
}

interface PromptsLayoutProps {
  children: React.ReactNode
}

export default function PromptsLayout({ children }: PromptsLayoutProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://yoursite.com/prompts#webpage',
    name: 'AI Image Prompts Collection',
    description:
      'Professional AI image prompts for ChatGPT DALL-E, Midjourney, Google Gemini, Leonardo AI, and Stable Diffusion',
    url: 'https://yoursite.com/prompts',
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://yoursite.com/#website',
      name: 'AI Tools Directory',
      url: 'https://yoursite.com',
      publisher: {
        '@type': 'Organization',
        '@id': 'https://yoursite.com/#organization',
        name: 'AI Tools Directory',
        url: 'https://yoursite.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://yoursite.com/images/logo.png',
          width: 300,
          height: 300,
        },
      },
    },
    mainEntity: {
      '@type': 'ItemList',
      name: 'AI Image Prompts',
      description: 'Curated collection of professional AI image prompts',
      numberOfItems: 8,
      itemListElement: [
        {
          '@type': 'CreativeWork',
          '@id': 'https://yoursite.com/prompts#cinematic-portrait',
          name: 'Cinematic Portrait Prompt',
          description:
            'Perfect for creating movie-like character portraits with professional lighting',
          category: 'Portrait',
          about: 'AI image generation prompt for cinematic portraits',
          keywords: 'portrait, cinematic, dramatic, film-noir, ChatGPT DALL-E',
        },
        {
          '@type': 'CreativeWork',
          '@id': 'https://yoursite.com/prompts#ethereal-landscape',
          name: 'Ethereal Landscape Prompt',
          description: 'Creates breathtaking fantasy landscapes with magical elements',
          category: 'Landscape',
          about: 'AI image generation prompt for fantasy landscapes',
          keywords: 'landscape, fantasy, mystical, golden-hour, Midjourney',
        },
        {
          '@type': 'CreativeWork',
          '@id': 'https://yoursite.com/prompts#abstract-fluid-art',
          name: 'Abstract Fluid Art Prompt',
          description: 'Generate stunning abstract art with flowing, organic forms',
          category: 'Abstract',
          about: 'AI image generation prompt for abstract art',
          keywords: 'abstract, fluid, vibrant, modern, Google Gemini',
        },
        {
          '@type': 'CreativeWork',
          '@id': 'https://yoursite.com/prompts#street-photography',
          name: 'Street Photography Prompt',
          description: 'Capture authentic street moments with professional photography techniques',
          category: 'Photography',
          about: 'AI image generation prompt for street photography',
          keywords: 'street, photography, urban, candid, Leonardo AI',
        },
        {
          '@type': 'CreativeWork',
          '@id': 'https://yoursite.com/prompts#dragon-fantasy-art',
          name: 'Dragon Fantasy Art Prompt',
          description: 'Epic fantasy scenes featuring mythical creatures and environments',
          category: 'Fantasy',
          about: 'AI image generation prompt for fantasy art',
          keywords: 'dragon, fantasy, epic, castle, Stable Diffusion',
        },
        {
          '@type': 'CreativeWork',
          '@id': 'https://yoursite.com/prompts#modern-architecture',
          name: 'Modern Architecture Prompt',
          description: 'Showcase contemporary architectural designs with professional precision',
          category: 'Architecture',
          about: 'AI image generation prompt for architecture',
          keywords: 'architecture, modern, minimalist, geometric, ChatGPT DALL-E',
        },
        {
          '@type': 'CreativeWork',
          '@id': 'https://yoursite.com/prompts#anime-character-portrait',
          name: 'Anime Character Portrait Prompt',
          description: 'Create beautiful anime-style character artwork',
          category: 'Portrait',
          about: 'AI image generation prompt for anime portraits',
          keywords: 'anime, character, portrait, ghibli, Midjourney',
        },
        {
          '@type': 'CreativeWork',
          '@id': 'https://yoursite.com/prompts#cyberpunk-cityscape',
          name: 'Cyberpunk Cityscape Prompt',
          description: 'Immersive cyberpunk environments with futuristic elements',
          category: 'Landscape',
          about: 'AI image generation prompt for cyberpunk scenes',
          keywords: 'cyberpunk, futuristic, cityscape, neon, Leonardo AI',
        },
      ],
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://yoursite.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'AI Prompts',
          item: 'https://yoursite.com/prompts',
        },
      ],
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://yoursite.com/prompts?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Additional meta tags for better SEO */}
        <meta name="theme-color" content="#7d42fb" />
        <meta name="msapplication-TileColor" content="#7d42fb" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://images.unsplash.com" />

        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Additional link tags */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="robots" type="text/plain" href="/robots.txt" />

        {/* Hreflang for internationalization (add more as needed) */}
        <link rel="alternate" hrefLang="en" href="https://yoursite.com/prompts" />
        <link rel="alternate" hrefLang="x-default" href="https://yoursite.com/prompts" />
      </head>

      <body className="antialiased">
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-purple-600 text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>

        {/* Main content wrapper */}
        <div id="main-content">{children}</div>

        {/* Analytics and tracking scripts */}
        {/* Google Analytics */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_title: 'AI Image Prompts Collection',
                    page_location: 'https://yoursite.com/prompts'
                  });
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  )
}
