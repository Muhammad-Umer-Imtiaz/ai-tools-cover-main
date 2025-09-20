import { Metadata } from "next";

type Props = {
  children: React.ReactNode;
};

// Static SEO metadata for category listing page
export const metadata: Metadata = {
  title: "AI Tools Categories - AI Tools Cover | Discover Best AI Solutions",
  description:
    "Browse and discover the best AI tools organized by category. Find productivity, design, image, video, automation and more AI-powered solutions.",
  openGraph: {
    title: "AI Tools Categories - AI Tools Cover",
    description:
      "Browse and discover the best AI tools organized by category.",
    url: "https://aitoolscover.com/category",
  },
  alternates: {
    canonical: "https://aitoolscover.com/category",
  },
};

export default function CategoryLayout({ children }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Tools Categories",
    description:
      "Browse our comprehensive collection of AI tools organized by category",
    url: "https://aitoolscover.com/category",
    provider: {
      "@type": "Organization",
      name: "AI Tools Cover",
      url: "https://aitoolscover.com",
      logo: "https://aitoolscover.com/logo.png",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
