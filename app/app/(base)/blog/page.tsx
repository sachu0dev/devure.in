import { Metadata } from "next";
import { getAllBlogs, getAllCategories } from "@/lib/blog";
import Hero from "@/components/blogs/Hero";
import Search from "@/components/blogs/Search";

export const metadata: Metadata = {
  title: "Blog - Devure | Technology Insights & Tutorials",
  description:
    "Explore insights, tutorials, and deep dives into technology on the Devure blog. Discover web development tips, software engineering best practices, and cutting-edge technology insights.",
  keywords:
    "blog, technology, web development, software engineering, tutorials, insights, programming, React, Next.js, TypeScript, best practices",
  authors: [{ name: "Devure Team" }],
  creator: "Devure Team",
  publisher: "Devure",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://devure.in"),
  openGraph: {
    title: "Blog - Devure | Technology Insights & Tutorials",
    description:
      "Explore insights, tutorials, and deep dives into technology on the Devure blog. Discover web development tips, software engineering best practices, and cutting-edge technology insights.",
    url: "https://devure.in/blog",
    siteName: "Devure",
    images: [
      {
        url: "https://devure.in/blog-og.jpg",
        width: 1200,
        height: 630,
        alt: "Devure Blog - Technology Insights & Tutorials",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Devure | Technology Insights & Tutorials",
    description:
      "Explore insights, tutorials, and deep dives into technology on the Devure blog.",
    images: ["https://devure.in/blog-og.jpg"],
    creator: "@devure",
    site: "@devure",
  },
  alternates: {
    canonical: "https://devure.in/blog",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:alt": "Devure Blog - Technology Insights & Tutorials",
  },
};

export default async function BlogPage() {
  // Server-side data fetching
  const [blogs, categories] = await Promise.all([
    getAllBlogs(),
    getAllCategories(),
  ]);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Devure Blog",
    description:
      "Technology insights, tutorials, and deep dives into web development and software engineering.",
    url: "https://devure.in/blog",
    publisher: {
      "@type": "Organization",
      name: "Devure",
      url: "https://devure.in",
      logo: {
        "@type": "ImageObject",
        url: "https://devure.in/logo.png",
      },
    },
    blogPost: blogs.map((blog) => ({
      "@type": "BlogPosting",
      headline: blog.title,
      description: blog.description,
      image: blog.coverImage,
      author: {
        "@type": "Person",
        name: blog.author.name,
      },
      datePublished: blog.date,
      dateModified: blog.date, // BlogPostSummary doesn't have updatedAt
      url: `https://devure.in/blog/${blog.slug}`,
      articleSection: blog.category,
      keywords: blog.tags.join(", "),
    })),
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <main>
        <section
          className="bg-foreground flex items-center justify-center text-4xl text-foreground"
          data-scroll-section
          aria-label="Blog Hero"
        >
          <Hero />
        </section>
        <section
          className="min-h-screen bg-background flex justify-center text-4xl text-background"
          data-scroll-section
          id="search"
          aria-label="Blog Search and Listing"
        >
          <Search blogs={blogs} categories={categories} />
        </section>
      </main>
    </>
  );
}
