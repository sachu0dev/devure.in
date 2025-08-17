import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AboutUs } from "@/types";

interface AboutUsProps {
  aboutUsContent: AboutUs | null;
}

export default function AboutUsSection({ aboutUsContent }: AboutUsProps) {
  // Debug logging
  console.log("AboutUsSection received content:", aboutUsContent);

  if (!aboutUsContent || !aboutUsContent.isActive) {
    console.log("AboutUsSection: No content or not active, rendering null");
    return null;
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            {/* Always show subtitle - use default if empty */}
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              {aboutUsContent.subtitle || "ABOUT US"}
            </h3>
            <h2 className="text-4xl font-serif text-gray-900 leading-tight">
              {aboutUsContent.title || "About Devure.in"}
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-gray-600 leading-relaxed">
                {aboutUsContent.description ||
                  "We are a passionate team of developers, designers, and innovators dedicated to creating exceptional digital experiences."}
              </p>
              {aboutUsContent.additionalDescription && (
                <p className="text-lg text-gray-600 leading-relaxed">
                  {aboutUsContent.additionalDescription}
                </p>
              )}
            </div>
            <div>
              <Link href={aboutUsContent.learnMoreButton?.url || "/about"}>
                <Button
                  size="lg"
                  className="text-base px-8 py-3 bg-gray-800 hover:bg-gray-900"
                >
                  {aboutUsContent.learnMoreButton?.text || "Learn More"}
                </Button>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-[3/4] relative overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={aboutUsContent.imageUrl || "/images/about-us-hero.jpg"}
                alt={aboutUsContent.title || "About Us"}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
