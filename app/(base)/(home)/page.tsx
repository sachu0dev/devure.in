import Home from "@/components/landing/Home";
import React from "react";
import Selected from "@/components/landing/Selected";
import { Metadata } from "next";
import { env } from "@/lib/env";
import Projects from "@/components/landing/Projects";
import Technologies from "@/components/landing/Technologies";
import Blogs from "@/components/landing/Blogs";
import AboutUsSection from "@/components/landing/AboutUs";
import {
  getBlogs,
  getHeroContent,
  getServices,
  getServicesHeader,
  getProjects,
  getAboutUsContent,
} from "@/lib/api";

export const revalidate = 21600; // 6 hours in seconds

export const metadata: Metadata = {
  title: `${env.SITE_NAME} - Modern Web Development & Design Solutions`,
  description:
    "Devure is a leading web development agency specializing in modern, scalable web applications, custom software solutions, and innovative digital experiences. We help businesses transform their digital presence with cutting-edge technology.",
  keywords:
    "web development, software development, custom applications, React, Next.js, TypeScript, UI/UX design, digital transformation, modern web solutions",
  authors: [{ name: "Sushil Kumar" }],
  creator: "Sushil kumar",
  publisher: env.SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(env.SITE_URL),
  openGraph: {
    title: `${env.SITE_NAME} - Modern Web Development & Design Solutions`,
    description:
      "Transform your digital presence with our cutting-edge web development and design solutions. We specialize in modern, scalable applications that drive business growth.",
    url: env.SITE_URL,
    siteName: env.SITE_NAME,
    images: [
      {
        url: `${env.SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Devure - Modern Web Development & Design Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${env.SITE_NAME} - Modern Web Development & Design Solutions`,
    description:
      "Transform your digital presence with our cutting-edge web development and design solutions.",
    images: [`${env.SITE_URL}/og-image.jpg`],
    creator: "@devure",
    site: "@devure",
  },
  alternates: {
    canonical: env.SITE_URL,
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
    "og:image:alt": "Devure - Modern Web Development & Design Solutions",
  },
};

// Import types from organized type files
import {
  BlogPostSummary,
  Project,
  Service,
  ServicesHeader,
  AboutUs,
} from "@/types";

const page = async () => {
  // Fetch featured blogs, hero content, services data, and projects on the server side
  let featuredBlogs: BlogPostSummary[] = [];
  let heroContent = null;
  let services: Service[] = [];
  let servicesHeader: ServicesHeader | null = null;
  let projects: Project[] = [];
  let aboutUsContent = null;

  try {
    const [
      blogResults,
      heroData,
      servicesData,
      headerData,
      projectsData,
      aboutUsData,
    ] = await Promise.all([
      getBlogs({ featured: true, limit: 3 }),
      getHeroContent().catch(() => null),
      getServices().catch(() => []),
      getServicesHeader().catch(() => null),
      getProjects().catch(() => []),
      getAboutUsContent().catch((error) => {
        console.error("Error fetching AboutUs content:", error);
        return {
          _id: "fallback",
          subtitle: "ABOUT US",
          title: "About Devure.in",
          description:
            "We are a passionate team of developers, designers, and innovators dedicated to creating exceptional digital experiences.",
          additionalDescription:
            "Our commitment to excellence extends beyond just coding. We believe in building lasting partnerships with our clients.",
          learnMoreButton: {
            text: "Learn More",
            url: "/about",
          },
          imageUrl: "/images/about-us-hero.jpg",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as AboutUs;
      }), // Don't fail if about us content is missing
    ]);
    featuredBlogs = blogResults.posts || [];
    heroContent = heroData;
    services = servicesData || [];
    servicesHeader = headerData;
    projects = projectsData || [];
    aboutUsContent = aboutUsData;
  } catch (error) {
    console.error("Error fetching data:", error);
    featuredBlogs = [];
    heroContent = null;
    services = [];
    servicesHeader = null;
    projects = [];
    aboutUsContent = null;
  }

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: env.SITE_NAME,
    url: env.SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${env.SITE_URL}/og-image.jpg`,
    },
    description:
      "Devure is a leading web development agency specializing in modern, scalable web applications, custom software solutions, and innovative digital experiences.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "sushil.dev.in@gmail.com",
    },
    sameAs: [
      "https://x.com/sachu0dev",
      "https://www.linkedin.com/in/sachu0dev",
      "https://github.com/sachu0dev",
      "https://www.devbysushil.com",
    ],
    serviceType: [
      "Web Development",
      "Software Development",
      "UI/UX Design",
      "Digital Transformation",
      "Custom Applications",
    ],
    areaServed: "Worldwide",
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
          className="min-h-screen bg-foreground flex justify-center text-4xl text-background"
          data-scroll-section
          aria-label="Hero Section"
        >
          <Home heroContent={heroContent || undefined} />
        </section>
        <section
          className="min-h-screen bg-background flex items-center justify-center text-4xl text-foreground"
          data-scroll-section
          aria-label="Selected Work"
        >
          <Selected servicesHeader={servicesHeader} services={services} />
        </section>
        <section
          className="min-h-screen bg-foreground flex items-center justify-center text-4xl text-background"
          data-scroll-section
          aria-label="Projects"
        >
          <Projects projects={projects} />
        </section>
        <section
          className="min-h-screen bg-background flex items-center justify-center text-4xl text-foreground"
          data-scroll-section
          aria-label="Technologies"
        >
          <Technologies />
        </section>
        <section
          className="min-h-screen bg-foreground flex items-center justify-center text-4xl text-background"
          data-scroll-section
          aria-label="About Us"
        >
          <AboutUsSection aboutUsContent={aboutUsContent} />
        </section>
        <section
          className="min-h-screen bg-background flex items-center justify-center text-4xl text-foreground"
          data-scroll-section
          aria-label="Blogs"
        >
          <Blogs featuredBlogs={featuredBlogs} />
        </section>
      </main>
    </>
  );
};

export default page;
