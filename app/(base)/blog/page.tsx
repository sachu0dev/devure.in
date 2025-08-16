import Hero from "@/components/blogs/Hero";
import Search from "@/components/blogs/Search";
import { SmoothCursorWrapper } from "@/components/ui/SmoothCursorWrapper";
import { getAllBlogs, getAllCategories, getAllTags } from "@/lib/blog";
import { getCanonicalDomain, getCurrentDomain } from "@/lib/utils";
import { Metadata } from "next";

// ISR: Revalidate every 6 hours
export const revalidate = 21600; // 6 hours in seconds

// Generate metadata dynamically
export async function generateMetadata(): Promise<Metadata> {
  // Fetch data for metadata generation
  const [blogs, categories, tags] = await Promise.all([
    getAllBlogs(),
    getAllCategories(),
    getAllTags(),
  ]);

  // Get current domain dynamically
  const currentDomain = getCurrentDomain();
  const canonicalDomain = getCanonicalDomain();

  // Find the latest featured blog
  const latestFeaturedBlog = blogs
    .filter((blog) => blog.featured)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  // Create dynamic description
  const description = latestFeaturedBlog
    ? `Explore insights, tutorials, and deep dives into technology on the Devure blog. Latest featured: "${latestFeaturedBlog.title}" - ${latestFeaturedBlog.description}. Discover web development tips, software engineering best practices, and cutting-edge technology insights.`
    : "Explore insights, tutorials, and deep dives into technology on the Devure blog. Discover web development tips, software engineering best practices, and cutting-edge technology insights.";

  const dynamicKeywords = [
    "blog",
    "technology",
    "web development",
    "software engineering",
    "tutorials",
    "insights",
    "programming",
    "React",
    "Next.js",
    "TypeScript",
    "best practices",
    "coding",
    "development",
    "tech blog",
    "programming tutorials",
    "software development",
    "web design",
    "frontend development",
    "backend development",
    "full stack development",
    // Add dynamic categories
    ...categories.map((cat) => cat.name),
    // Add dynamic tags
    ...tags.map((tag) => tag.name),
  ];

  // Dynamic article tags
  const dynamicArticleTags = [
    "Technology",
    "Programming",
    "Web Development",
    "Software Engineering",
    // Add top categories
    ...categories.slice(0, 5).map((cat) => cat.name),
    // Add top tags
    ...tags.slice(0, 5).map((tag) => tag.name),
  ].join(", ");

  return {
    title: "Blog - Devure | Technology Insights & Tutorials",
    description,
    keywords: dynamicKeywords,
    authors: [{ name: "Devure Team" }],
    creator: "Devure Team",
    publisher: "Devure",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(currentDomain),
    openGraph: {
      title: "Blog - Devure | Technology Insights & Tutorials",
      description,
      url: `${currentDomain}/blog`,
      siteName: "Devure",
      images: [
        {
          url: `${currentDomain}/blog-og.jpg`,
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
      description,
      images: [`${currentDomain}/blog-og.jpg`],
      creator: "@devure",
      site: "@devure",
    },
    alternates: {
      canonical: `${canonicalDomain}/blog`,
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
      "article:section": "Technology Blog",
      "article:tag": dynamicArticleTags,
    },
  };
}

export default async function BlogPage() {
  // Server-side data fetching for blogs, categories, and tags
  const [blogs, categories, tags] = await Promise.all([
    getAllBlogs(),
    getAllCategories(),
    getAllTags(),
  ]);

  // Get current domain dynamically
  const currentDomain = getCurrentDomain();
  const canonicalDomain = getCanonicalDomain();

  // Enhanced structured data for SEO with categories and tags
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Devure Blog",
    description:
      "Technology insights, tutorials, and deep dives into web development and software engineering.",
    url: `${currentDomain}/blog`,
    publisher: {
      "@type": "Organization",
      name: "Devure",
      url: currentDomain,
      logo: {
        "@type": "ImageObject",
        url: `${currentDomain}/blog-og.jpg`,
      },
    },
    // Add categories and tags to structured data
    about: categories.map((category) => ({
      "@type": "Thing",
      name: category.name,
      description:
        category.description || `${category.name} articles and tutorials`,
      url: `${canonicalDomain}/blog/category/${category.slug}`,
    })),
    keywords: [
      ...categories.map((cat) => cat.name),
      ...tags.map((tag) => tag.name),
      "technology",
      "programming",
      "web development",
      "software engineering",
    ].join(", "),
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
      dateModified: blog.date,
      url: `${canonicalDomain}/blog/${blog.slug}`,
      articleSection: blog.category,
      keywords: blog.tags.join(", "),
    })),
    // Additional structured data for better SEO
    mainEntity: {
      "@type": "ItemList",
      name: "Blog Categories",
      description: "Available blog categories and topics",
      numberOfItems: categories.length,
      itemListElement: categories.map((category, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Thing",
          name: category.name,
          description: category.description || `${category.name} articles`,
          url: `${canonicalDomain}/blog/category/${category.slug}`,
          numberOfItems: category.postCount,
        },
      })),
    },
    // Tags structured data
    additionalProperty: tags.map((tag) => ({
      "@type": "PropertyValue",
      name: tag.name,
      value: tag.postCount,
      url: `${canonicalDomain}/blog/tag/${tag.slug}`,
    })),
  };

  return (
    <>
      {/* Enhanced Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <main>
        <SmoothCursorWrapper />

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
          <Search blogs={blogs} categories={categories} tags={tags} />
        </section>
      </main>
    </>
  );
}
