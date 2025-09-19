import React from 'react';
import Script from 'next/script';
import { Metadata } from 'next';

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>; // Changed to Promise
};

export default async function BlogLayout({ children, params }: Props) {
  // Await the params promise
  const { id: blogId } = await params;
  
  const blogTitle = 'Blog Article'; // fallback, title needs to be fetched or passed differently
  const siteName = 'AI Tools Cover Blog';
  const pageTitle = `${siteName} - ${blogTitle}`;
  const canonicalUrl = `https://aitoolscover.com/blogs/${blogId}`;

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: pageTitle,
    description: `Read this article on AI Tools Cover to learn about AI tools, productivity, and more.`,
    author: { '@type': 'Organization', name: 'AI Tools Cover' },
    publisher: {
      '@type': 'Organization',
      name: 'AI Tools Cover',
      logo: { '@type': 'ImageObject', url: 'https://aitoolscover.com/logo.png' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };

  return (
    <>
      {/* JSON-LD for SEO */}
      <Script type="application/ld+json" id="blog-jsonld">
        {JSON.stringify(jsonLd)}
      </Script>

      {/* Main content */}
      <main className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
        {children}
      </main>
    </>
  );
}

// Static metadata for SEO (dynamic title using function)
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>; // Changed to Promise
}): Promise<Metadata> => {
  // Await the params promise
  const { id } = await params;
  
  const blogTitle = 'Blog Article'; // title needs to be fetched or passed differently
  const siteName = 'AI Tools Cover Blog';
  const pageTitle = `${siteName} - ${blogTitle}`;
  const canonicalUrl = `https://aitoolscover.com/blogs/${id}`;

  return {
    title: pageTitle,
    description: `Read this article on AI Tools Cover to learn about AI tools, productivity, and more.`,
    robots: 'index, follow',
    alternates: {
      canonical: canonicalUrl,
    },
  };
};