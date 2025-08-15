import { Metadata } from "next";
import { getAllServices, getServicesHeader } from "@/lib/services";
import Hero from "@/components/services/Hero";
import ServicesList from "@/components/services/ServicesList";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { getCurrentDomain, getCanonicalDomain } from "@/lib/utils";

// ISR: Revalidate every 6 hours
export const revalidate = 21600; // 6 hours in seconds

// Generate metadata dynamically
export async function generateMetadata(): Promise<Metadata> {
  // Fetch data for metadata generation
  const services = await getAllServices();

  // Get current domain dynamically
  const currentDomain = getCurrentDomain();
  const canonicalDomain = getCanonicalDomain();

  // Find the latest featured service
  const latestFeaturedService = services
    .filter((service) => service.isFeatured)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

  // Create dynamic description
  const description = latestFeaturedService
    ? `Explore our comprehensive range of professional services at Devure. From ${latestFeaturedService.serviceType} to custom solutions, we deliver excellence in every project. Latest featured: "${latestFeaturedService.title}".`
    : "Explore our comprehensive range of professional services at Devure. From web development to custom software solutions, we deliver excellence in every project.";

  const dynamicKeywords = [
    "services",
    "web development",
    "software development",
    "custom solutions",
    "technology services",
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
    "professional services",
    "tech consulting",
    "digital services",
    // Add dynamic service types
    ...services.map((service) => service.serviceType),
  ];

  // Dynamic service tags
  const dynamicServiceTags = [
    "Technology Services",
    "Web Development",
    "Software Solutions",
    "Digital Services",
    // Add top service types
    ...services.slice(0, 5).map((service) => service.serviceType),
  ].join(", ");

  return {
    title: "Services - Devure | Professional Technology Solutions",
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
      title: "Services - Devure | Professional Technology Solutions",
      description,
      url: `${currentDomain}/service`,
      siteName: "Devure",
      images: [
        {
          url: `${currentDomain}/services-og.jpg`,
          width: 1200,
          height: 630,
          alt: "Devure Services - Professional Technology Solutions",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Services - Devure | Professional Technology Solutions",
      description,
      images: [`${currentDomain}/services-og.jpg`],
      creator: "@devure",
      site: "@devure",
    },
    alternates: {
      canonical: `${canonicalDomain}/service`,
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
      "og:image:alt": "Devure Services - Professional Technology Solutions",
      "article:section": "Professional Services",
      "article:tag": dynamicServiceTags,
    },
  };
}

export default async function ServicesPage() {
  // Server-side data fetching for services and header
  const [services, servicesHeader] = await Promise.all([
    getAllServices(),
    getServicesHeader(),
  ]);

  // Get current domain dynamically
  const currentDomain = getCurrentDomain();
  const canonicalDomain = getCanonicalDomain();

  // Enhanced structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Devure",
    description:
      "Professional technology services and custom software solutions",
    url: `${currentDomain}/service`,
    logo: {
      "@type": "ImageObject",
      url: `${currentDomain}/logo.png`,
    },
    serviceType: services.map((service) => service.serviceType),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Devure Services",
      description: "Comprehensive range of professional technology services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.excerpt || `${service.serviceType} service`,
          url: `${canonicalDomain}/services/${service.slug}`,
          serviceType: service.serviceType,
        },
      })),
    },
    // Additional structured data for better SEO
    mainEntity: {
      "@type": "ItemList",
      name: "Available Services",
      description: "Complete list of professional services offered by Devure",
      numberOfItems: services.length,
      itemListElement: services.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Service",
          name: service.title,
          description: service.excerpt || `${service.serviceType} service`,
          url: `${canonicalDomain}/services/${service.slug}`,
          serviceType: service.serviceType,
        },
      })),
    },
    // Service categories structured data
    additionalProperty: services.map((service) => ({
      "@type": "PropertyValue",
      name: service.serviceType,
      value: service.title,
      url: `${canonicalDomain}/services/${service.slug}`,
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
        <SmoothCursor />

        <section
          className="bg-foreground flex items-center justify-center text-4xl text-foreground"
          data-scroll-section
          aria-label="Services Hero"
        >
          <Hero servicesHeader={servicesHeader} />
        </section>
        <section
          className="min-h-screen bg-background flex justify-center text-4xl text-background"
          data-scroll-section
          id="services"
          aria-label="Services Listing"
        >
          <ServicesList services={services} />
        </section>
      </main>
    </>
  );
}
