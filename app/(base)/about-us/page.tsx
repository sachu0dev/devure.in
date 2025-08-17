import { Metadata } from "next";
import { env } from "@/lib/env";
import { getAboutUsContent } from "@/lib/api";
import AboutUsSection from "@/components/landing/AboutUs";

export const revalidate = 21600; // 6 hours in seconds

export const metadata: Metadata = {
  title: `About Us - ${env.SITE_NAME}`,
  description:
    "Learn more about Devure, a passionate team of developers, designers, and innovators dedicated to creating exceptional digital experiences.",
  keywords:
    "about us, web development team, software developers, digital innovation, custom solutions, Devure team",
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
    title: `About Us - ${env.SITE_NAME}`,
    description:
      "Learn more about Devure, a passionate team of developers, designers, and innovators dedicated to creating exceptional digital experiences.",
    url: `${env.SITE_URL}/about`,
    siteName: env.SITE_NAME,
    images: [
      {
        url: `${env.SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "About Devure - Our Team and Mission",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `About Us - ${env.SITE_NAME}`,
    description:
      "Learn more about Devure, a passionate team of developers, designers, and innovators dedicated to creating exceptional digital experiences.",
    images: [`${env.SITE_URL}/og-image.jpg`],
    creator: "@devure",
    site: "@devure",
  },
  alternates: {
    canonical: `${env.SITE_URL}/about`,
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

  return (
    <>
      <main>
        {/* Hero Section - Same as landing page About Us section */}
        <section
          className="min-h-screen bg-foreground flex items-center justify-center text-4xl text-background"
          data-scroll-section
          aria-label="About Us Hero"
        >
          <AboutUsSection aboutUsContent={aboutUsContent} />
        </section>

        {/* Additional sections will be added here later */}
        <section
          className="min-h-screen bg-background flex items-center justify-center text-4xl text-foreground"
          data-scroll-section
          aria-label="Our Story"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Our Story</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              This section will contain more detailed information about our
              company, mission, values, and team. Content will be developed and
              added here.
            </p>
          </div>
        </section>

        <section
          className="min-h-screen bg-foreground flex items-center justify-center text-4xl text-background"
          data-scroll-section
          aria-label="Our Values"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              This section will showcase our core values, principles, and what
              drives us to deliver exceptional results. Content will be
              developed and added here.
            </p>
          </div>
        </section>

        <section
          className="min-h-screen bg-background flex items-center justify-center text-4xl text-foreground"
          data-scroll-section
          aria-label="Our Team"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              This section will introduce our team members, their expertise, and
              contributions. Content will be developed and added here.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
