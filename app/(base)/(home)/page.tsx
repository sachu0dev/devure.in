import Home from "@/components/landing/Home";
import React from "react";
import Selected from "@/components/landing/Selected";
import { Metadata } from "next";
import { env } from "@/lib/env";
import Projects from "@/components/landing/Projects";
import Technologies from "@/components/landing/Technologies";
import Blogs from "@/components/landing/Blogs";
import { getBlogs } from "@/lib/api";

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

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  coverImage: string;
  author: {
    name: string;
    profileUrl: string;
    avatar?: string;
    bio?: string;
  };
  readTime: string;
  featured: boolean;
  excerpt?: string;
  wordCount?: number;
}

const page = async () => {
  // Fetch featured blogs on the server side
  let featuredBlogs: BlogPost[] = [];

  try {
    const blogResults = await getBlogs({ featured: true, limit: 3 });
    featuredBlogs = blogResults.posts || [];
  } catch (error) {
    console.error("Error fetching featured blogs:", error);
    featuredBlogs = [];
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
          <Home />
        </section>
        <section
          className="min-h-screen bg-background flex items-center justify-center text-4xl text-foreground"
          data-scroll-section
          aria-label="Selected Work"
        >
          <Selected />
        </section>
        <section
          className="min-h-screen bg-foreground flex items-center justify-center text-4xl text-background"
          data-scroll-section
          aria-label="Projects"
        >
          <Projects />
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
          aria-label="Contact"
        >
          <h1>Section 4</h1>
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
