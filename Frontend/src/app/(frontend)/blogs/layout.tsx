// app/blogs/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Tools Cover Blog - Latest Articles on AI Tools & Productivity',
  description:
    'Explore the latest articles and tutorials about AI tools, productivity, and artificial intelligence. Stay updated with tips, reviews, and insights.',
  keywords: [
    'AI tools',
    'AI blog',
    'productivity',
    'artificial intelligence',
    'machine learning',
    'AI tutorials',
    'reviews',
    'tips',
  ].join(', '),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: 'https://aitoolscover.com/blogs',
  },
  openGraph: {
    title: 'AI Tools Cover Blog - Latest Articles',
    description:
      'Explore the latest articles and tutorials about AI tools, productivity, and artificial intelligence.',
    type: 'website',
    url: 'https://aitoolscover.com/blogs',
    images: [
      {
        url: 'https://aitoolscover.com/logo.png',
        width: 800,
        height: 600,
        alt: 'AI Tools Cover Blog',
      },
    ],
    siteName: 'AI Tools Cover',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tools Cover Blog',
    description: 'Explore the latest articles and tutorials about AI tools, productivity, and AI.',
    images: ['https://aitoolscover.com/logo.png'],
    creator: '@aitoolscover',
  },
}

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* JSON-LD Structured Data for Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'AI Tools Cover Blog',
            url: 'https://aitoolscover.com/blogs',
            description:
              'Explore the latest articles and tutorials about AI tools, productivity, and artificial intelligence.',
            publisher: {
              '@type': 'Organization',
              name: 'AI Tools Cover',
              logo: {
                '@type': 'ImageObject',
                url: 'https://aitoolscover.com/logo.png',
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://aitoolscover.com/blogs',
            },
          }),
        }}
      />
      {children}
    </>
  )
}
