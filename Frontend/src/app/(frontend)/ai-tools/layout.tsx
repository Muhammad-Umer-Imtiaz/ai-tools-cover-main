import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best AI Tools by Category - AI Tools Cover',
  description: 'Discover top AI tools by category: productivity, text, image, video, automation, and more.',
  
  // Canonical URL
  alternates: {
    canonical: 'https://aitoolscover.com/ai-tools',
  },
  
  // Robots meta
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
  
  // Open Graph
  openGraph: {
    title: 'AI Tools by Category - AI Tools Cover',
    description: 'Browse and discover the best AI tools organized by category. Find productivity tools, text generators, image tools, video tools, automation, and more AI-powered solutions.',
    type: 'website',
    url: 'https://aitoolscover.com/ai-tools',
    siteName: 'AI Tools Cover',
    images: [
      {
        url: 'https://aitoolscover.com/og-image-ai-tools.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Tools by Category - AI Tools Cover',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tools by Category - AI Tools Cover',
    description: 'Browse and discover the best AI tools organized by category. Find productivity tools, text generators, image tools, video tools, automation, and more.',
    images: ['https://aitoolscover.com/og-image-ai-tools.jpg'],
  },
  
  // Additional SEO metadata
  other: {
    'apple-mobile-web-app-title': 'AI Tools Cover',
    'application-name': 'AI Tools Cover',
  },
};

export default function AIToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}