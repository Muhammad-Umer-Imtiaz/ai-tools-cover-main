import { Metadata } from 'next'

type Props = {
  params: Promise<{ category: string }> // Note: params is now a Promise
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Await the params Promise first
  const { category } = await params

  // Now you can safely use the category
  const categoryName = decodeURIComponent(category).replace(/-/g, ' ')

  // Ensure the category URL is properly encoded for canonical URL
  const cleanCategory = encodeURIComponent(category.toLowerCase().trim())
  const canonicalUrl = `https://aitoolscover.com/category/${cleanCategory}`

  // Keep the OpenGraph URL as the original category parameter
  const openGraphUrl = `https://aitoolscover.com/category/${category}`

  return {
    title: `Best AI Tools for ${categoryName} - AI Tools Cover`,
    description: `Discover the best ${categoryName} AI tools to optimize your workflow. Explore our curated collection of cutting-edge artificial intelligence tools for ${categoryName.toLowerCase()}.`,
    keywords: `${categoryName} AI tools, artificial intelligence, ${categoryName.toLowerCase()}, AI software, machine learning tools`,

    // Add canonical URL - properly formatted and encoded
    alternates: {
      canonical: canonicalUrl,
    },

    // Add robots meta
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
      title: `Best AI Tools for ${categoryName} - AI Tools Cover`,
      description: `Discover the best ${categoryName} AI tools to optimize your workflow. Explore our curated collection of cutting-edge artificial intelligence tools.`,
      type: 'website',
      url: openGraphUrl,
      siteName: 'AI Tools Cover',
      images: [
        {
          url: `https://aitoolscover.com/og-image-${cleanCategory}.jpg`,
          width: 1200,
          height: 630,
          alt: `Best AI Tools for ${categoryName}`,
        },
      ],
    },

    // Twitter Card metadata for better social sharing
    twitter: {
      card: 'summary_large_image',
      title: `Best AI Tools for ${categoryName} - AI Tools Cover`,
      description: `Discover the best ${categoryName} AI tools to optimize your workflow. Explore our curated collection of cutting-edge artificial intelligence tools.`,
      images: [`https://aitoolscover.com/og-image-${cleanCategory}.jpg`],
    },

    // Additional SEO metadata
    verification: {
      google: 'your-google-verification-code', // Replace with your actual verification code
    },
  }
}

export default function CategoryLayout({ children }: Props) {
  return children
}
