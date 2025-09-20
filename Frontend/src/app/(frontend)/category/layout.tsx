import { Metadata } from 'next'

type Props = {
  children: React.ReactNode
  params: { slug?: string } // Add params for dynamic routes
}

// Function to get category data based on slug
function getCategoryData(slug?: string) {
  if (!slug) {
    return {
      name: 'AI Tools Categories',
      description: 'Browse our comprehensive collection of AI tools organized by category',
      url: '/category',
    }
  }

  // Convert slug to readable name
  const categoryName = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' & ')

  return {
    name: categoryName,
    description: `Explore ${categoryName} AI tools. Find the best artificial intelligence solutions for ${categoryName.toLowerCase()}.`,
    url: `/category/${slug}`,
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug?: string }
}): Promise<Metadata> {
  const categoryData = getCategoryData(params?.slug)
  const canonicalUrl = `https://aitoolscover.com${categoryData.url}` // Same URL for both

  return {
    title: `${categoryData.name} - AI Tools Cover | Discover Best AI Solutions`,
    description: categoryData.description,
    keywords: [
      categoryData.name,
      'AI tools',
      'artificial intelligence',
      'AI categories',
      'AI tools by category',
      'machine learning tools',
      'productivity AI',
      'business AI tools',
      'design AI tools',
      'development AI tools',
      'AI software',
      'AI applications',
      'browse AI tools',
      'AI tool directory',
      'best AI tools',
    ].join(', '),
    openGraph: {
      title: `${categoryData.name} - AI Tools Cover`,
      description: categoryData.description,
      type: 'website',
      url: canonicalUrl, // Same as canonical
      images: [
        {
          url: '/images/category-overview-og.jpg',
          width: 1200,
          height: 630,
          alt: `AI Tools Cover - ${categoryData.name}`,
        },
      ],
      siteName: 'AI Tools Cover',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryData.name} - AI Tools Cover`,
      description: categoryData.description,
      images: ['/images/category-overview-twitter.jpg'],
      creator: '@aitoolscover',
      site: '@aitoolscover',
    },
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
    alternates: {
      canonical: canonicalUrl, // Same as OpenGraph URL
    },
    verification: {
      google: 'your-google-verification-code',
    },
    other: {
      'revisit-after': '7 days',
      'content-language': 'en',
      distribution: 'global',
      rating: 'general',
    },
  }
}

export default function CategoryLayout({ children, params }: Props) {
  const categoryData = getCategoryData(params?.slug)
  const fullUrl = `https://aitoolscover.com${categoryData.url}`

  // Dynamic JSON-LD based on category
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryData.name,
    description: categoryData.description,
    url: fullUrl,
    mainEntity: {
      '@type': 'ItemList',
      name: categoryData.name,
      description: `Collection of ${categoryData.name.toLowerCase()} AI tools`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Business & Productivity',
          url: 'https://aitoolscover.com/category/business-productivity',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Design & Art',
          url: 'https://aitoolscover.com/category/design-art',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Development & Programming',
          url: 'https://aitoolscover.com/category/development-programming',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Content Creation',
          url: 'https://aitoolscover.com/category/content-creation',
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: 'Marketing & Sales',
          url: 'https://aitoolscover.com/category/marketing-sales',
        },
      ],
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: params?.slug
        ? [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://aitoolscover.com',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Categories',
              item: 'https://aitoolscover.com/category',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: categoryData.name,
              item: fullUrl,
            },
          ]
        : [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://aitoolscover.com',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Categories',
              item: 'https://aitoolscover.com/category',
            },
          ],
    },
    provider: {
      '@type': 'Organization',
      name: 'AI Tools Cover',
      url: 'https://aitoolscover.com',
      logo: 'https://aitoolscover.com/logo.png',
      sameAs: [
        'https://twitter.com/aitoolscover',
        'https://www.facebook.com/aitoolscover',
        'https://www.linkedin.com/company/aitoolscover',
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <link rel="preconnect" href="https://ai-tools-backend-p3sk.onrender.com" />
      <link rel="dns-prefetch" href="https://ai-tools-backend-p3sk.onrender.com" />
      {children}
    </>
  )
}
