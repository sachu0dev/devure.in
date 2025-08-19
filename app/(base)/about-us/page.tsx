import { Metadata } from "next";
import { env } from "@/lib/env";
import { getAboutUsContent } from "@/lib/api";
import AboutUsSection from "@/components/landing/AboutUs";
import OurStory from "@/components/landing/OurStory";
import OurValues from "@/components/landing/OurValues";
import OurTeam from "@/components/landing/OurTeam";
import Script from "next/script";

export const revalidate = 21600; // 6 hours in seconds

export const metadata: Metadata = {
  title: "Sushil Kumar - Full Stack Developer & Creator | Devure.in",
  description:
    "Sushil Kumar is a passionate Full Stack Developer and Creator of Devure.in, specializing in JavaScript, TypeScript, React.js, Next.js, and Node.js. Expert in real-time applications, cloud architecture, and scalable SaaS platforms. View portfolio, projects, and connect.",
  keywords: [
    "Sushil Kumar",
    "Full Stack Developer",
    "JavaScript Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "TypeScript Developer",
    "Web Developer India",
    "SaaS Developer",
    "Real-time Applications",
    "Cloud Architecture",
    "Socket.IO Developer",
    "Kafka Developer",
    "MongoDB Developer",
    "PostgreSQL Developer",
    "AWS Developer",
    "Devure.in",
    "pgconnect.site",
    "devbysushil.com",
    "Portfolio",
    "Web Development Services",
    "Custom Software Development",
    "API Development",
    "Database Design",
    "Serverless Architecture",
  ].join(", "),
  authors: [{ name: "Sushil Kumar", url: "https://devure.in" }],
  creator: "Sushil Kumar",
  publisher: "Devure.in",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(env.SITE_URL),
  openGraph: {
    title: "Sushil Kumar - Full Stack Developer & Creator | Devure.in",
    description:
      "Meet Sushil Kumar, a passionate Full Stack Developer and Creator of Devure.in. Expert in modern web technologies, real-time applications, and scalable SaaS platforms. View portfolio and connect.",
    url: `${env.SITE_URL}/about-us`,
    siteName: "Devure.in",
    images: [
      {
        url: `${env.SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Sushil Kumar - Full Stack Developer and Creator of Devure.in",
      },
    ],
    locale: "en_US",
    type: "profile",
    firstName: "Sushil",
    lastName: "Kumar",
    username: "devure",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sushil Kumar - Full Stack Developer & Creator | Devure.in",
    description:
      "Meet Sushil Kumar, a passionate Full Stack Developer and Creator of Devure.in. Expert in modern web technologies and scalable SaaS platforms.",
    images: [`${env.SITE_URL}/og-image.jpg`],
    creator: "@sachu0dev",
    site: "@devure",
  },
  alternates: {
    canonical: `${env.SITE_URL}/about-us`,
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
};

export default async function AboutPage() {
  let aboutUsContent = null;

  try {
    aboutUsContent = await getAboutUsContent();
  } catch (error) {
    console.error("Error fetching About Us content:", error);
  }

  // Structured Data for Personal Branding
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sushil Kumar",
    alternateName: ["Devure", "DevBySushil"],
    jobTitle: "Full Stack Developer & Creator",
    worksFor: {
      "@type": "Organization",
      name: "Devure.in",
      url: "https://devure.in",
    },
    description:
      "Full Stack Developer specializing in JavaScript, TypeScript, React.js, Next.js, and Node.js. Expert in real-time applications, cloud architecture, and scalable SaaS platforms.",
    url: "https://devure.in",
    sameAs: [
      "https://github.com/sachu0dev", // Add your GitHub
      "https://www.linkedin.com/in/sachu0dev", // Add your LinkedIn
      "https://x.com/sachu0dev", // Add your Twitter
      "https://devbysushil.com",
      "https://pgconnect.site",
    ],
    knowsAbout: [
      "JavaScript",
      "TypeScript",
      "React.js",
      "Next.js",
      "Node.js",
      "Socket.IO",
      "Kafka",
      "MongoDB",
      "PostgreSQL",
      "AWS",
      "Cloud Architecture",
      "SaaS Development",
      "Real-time Applications",
      "API Development",
      "Database Design",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Full Stack Developer",
      description: "Developing scalable web applications and SaaS platforms",
    },
    alumniOf: {
      "@type": "Organization",
      name: "Self-taught Developer",
    },
    knowsLanguage: ["English", "Hindi"],
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    image: `${env.SITE_URL}/profile.png`,
    email: "sushil.dev.in@gmail.com", // Add your email if public
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main>
        {/* Hero Section - Same as landing page About Us section */}
        <section
          className="min-h-screen bg-foreground flex items-center justify-center text-4xl text-background pt-18"
          data-scroll-section
          aria-label="About Us Hero"
        >
          <AboutUsSection aboutUsContent={aboutUsContent} />
        </section>

        {/* Our Story Section */}
        <OurStory />

        {/* Our Values Section */}
        <OurValues />

        {/* Our Team Section */}
        <OurTeam />
      </main>
    </>
  );
}
