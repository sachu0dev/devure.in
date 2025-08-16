import { SmoothCursorWrapper } from "@/components/ui/SmoothCursorWrapper";
import Hero from "@/components/work/Hero";
import ProjectsList from "@/components/work/ProjectsList";
import {
  getAllProjectCategories,
  getAllProjects,
  getAllProjectTags,
} from "@/lib/projects";
import { getCanonicalDomain, getCurrentDomain } from "@/lib/utils";
import { Metadata } from "next";

// ISR: Revalidate every 6 hours
export const revalidate = 21600; // 6 hours in seconds

// Generate metadata dynamically
export async function generateMetadata(): Promise<Metadata> {
  // Fetch data for metadata generation
  const [projects, categories, tags] = await Promise.all([
    getAllProjects(),
    getAllProjectCategories(),
    getAllProjectTags(),
  ]);

  // Get current domain dynamically
  const currentDomain = getCurrentDomain();
  const canonicalDomain = getCanonicalDomain();

  // Find the latest featured project
  const latestFeaturedProject = projects
    .filter((project) => project.isFeatured)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

  // Create dynamic description
  const description = latestFeaturedProject
    ? `Explore our portfolio of innovative projects at Devure. From ${latestFeaturedProject.category} to cutting-edge solutions, we deliver excellence in every project. Latest featured: "${latestFeaturedProject.title}".`
    : "Explore our portfolio of innovative projects at Devure. From web development to custom software solutions, we deliver excellence in every project.";

  const dynamicKeywords = [
    "projects",
    "portfolio",
    "work",
    "web development",
    "software development",
    "custom solutions",
    "technology projects",
    "digital transformation",
    "UI/UX design",
    "mobile development",
    "cloud solutions",
    "API development",
    "e-commerce solutions",
    "CRM development",
    "SaaS development",
    "portfolio websites",
    "analytics platforms",
    "social networks",
    "marketplace platforms",
    "professional projects",
    "tech consulting",
    "digital projects",
    // Add dynamic categories
    ...categories.map((cat) => cat.name),
    // Add dynamic tags
    ...tags.map((tag) => tag.name),
  ];

  // Dynamic project tags
  const dynamicProjectTags = [
    "Technology Projects",
    "Web Development",
    "Software Solutions",
    "Digital Projects",
    // Add top categories
    ...categories.slice(0, 5).map((cat) => cat.name),
    // Add top tags
    ...tags.slice(0, 5).map((tag) => tag.name),
  ].join(", ");

  return {
    title: "Work - Devure | Portfolio & Projects",
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
      title: "Work - Devure | Portfolio & Projects",
      description,
      url: `${currentDomain}/work`,
      siteName: "Devure",
      images: [
        {
          url: `${currentDomain}/work-og.jpg`,
          width: 1200,
          height: 630,
          alt: "Devure Work - Portfolio & Projects",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Work - Devure | Portfolio & Projects",
      description,
      images: [`${currentDomain}/work-og.jpg`],
      creator: "@devure",
      site: "@devure",
    },
    alternates: {
      canonical: `${canonicalDomain}/work`,
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
      "og:image:alt": "Devure Work - Portfolio & Projects",
      "article:section": "Portfolio & Projects",
      "article:tag": dynamicProjectTags,
    },
  };
}

export default async function WorkPage() {
  // Server-side data fetching for projects, categories, and tags
  const [projects, categories, tags] = await Promise.all([
    getAllProjects(),
    getAllProjectCategories(),
    getAllProjectTags(),
  ]);

  // Get current domain dynamically
  const currentDomain = getCurrentDomain();
  const canonicalDomain = getCanonicalDomain();

  // Enhanced structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Devure",
    description: "Professional technology projects and portfolio",
    url: `${currentDomain}/work`,
    logo: {
      "@type": "ImageObject",
      url: `${currentDomain}/logo.png`,
    },
    // Add projects to structured data
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Devure Projects",
      description: "Portfolio of professional technology projects",
      itemListElement: projects.map((project) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "CreativeWork",
          name: project.title,
          description: project.excerpt || project.description,
          url: `${canonicalDomain}/work/${project.slug}`,
          category: project.category,
          keywords: project.tags.join(", "),
        },
      })),
    },
    // Additional structured data for better SEO
    mainEntity: {
      "@type": "ItemList",
      name: "Portfolio Projects",
      description: "Complete list of projects and portfolio work",
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: project.title,
          description: project.excerpt || project.description,
          url: `${canonicalDomain}/work/${project.slug}`,
          category: project.category,
          keywords: project.tags.join(", "),
        },
      })),
    },
    // Project categories structured data
    additionalProperty: categories.map((category) => ({
      "@type": "PropertyValue",
      name: category.name,
      value: category.postCount,
      url: `${canonicalDomain}/work/category/${category.name
        .toLowerCase()
        .replace(/\s+/g, "-")}`,
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
          className="bg-foreground flex items-center justify-center text-4xl text-foreground px-8"
          data-scroll-section
          aria-label="Work Hero"
        >
          <Hero />
        </section>
        <section
          className="min-h-screen bg-background flex justify-center text-4xl text-background"
          data-scroll-section
          id="projects"
          aria-label="Projects Listing"
        >
          <ProjectsList
            projects={projects}
            categories={categories}
            tags={tags}
          />
        </section>
      </main>
    </>
  );
}
