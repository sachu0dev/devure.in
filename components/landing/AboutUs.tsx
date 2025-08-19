"use client";

import Image from "next/image";
import Link from "next/link";
import { AboutUs } from "@/types";
import { Figtree } from "next/font/google";
import { usePathname } from "next/navigation";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-figtree",
  display: "swap",
});

interface AboutUsProps {
  aboutUsContent: AboutUs | null;
}

export default function AboutUsSection({ aboutUsContent }: AboutUsProps) {
  const pathname = usePathname();
  const isAboutUsPage = pathname === "/about-us";

  if (!aboutUsContent || !aboutUsContent.isActive) {
    return null;
  }

  return (
    <div
      className={`w-full min-h-screen ${figtree.variable} px-3 md:px-6 pb-8 lg:pb-16 pt-[6rem] relative max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 items-start`}
    >
      {/* Left Column - Content */}
      <div className="px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 py-12 md:py-16 lg:py-0 lg:sticky lg:top-24">
        <div className="max-w-2xl">
          {/* Subtitle - Hidden on /about-us page */}
          {!isAboutUsPage && (
            <h6 className="text-[14px] sm:text-[16px] font-extrabold text-background/60 uppercase tracking-wider mb-6 font-figtree">
              {aboutUsContent.subtitle || "ABOUT"}
            </h6>
          )}

          {/* Main Title */}
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] xl:text-[5rem] 2xl:text-[6rem] font-black text-background leading-[0.9] mb-8 font-figtree">
            {aboutUsContent.title || "About Devure.in"}
          </h1>

          {/* Description */}
          <div className="space-y-6 mb-10">
            <p className="text-background/80 text-lg md:text-xl leading-relaxed font-figtree">
              {aboutUsContent.description ||
                "We are a passionate team of developers, designers, and innovators dedicated to creating exceptional digital experiences."}
            </p>
            {aboutUsContent.additionalDescription && (
              <p className="text-background/80 text-lg md:text-xl leading-relaxed font-figtree">
                {aboutUsContent.additionalDescription}
              </p>
            )}
          </div>

          {/* Learn More Button - Hidden on /about-us page */}
          {!isAboutUsPage && (
            <div className="pt-4">
              <Link href={aboutUsContent.learnMoreButton?.url || "/about-us"}>
                <button className="learn-more-btn inline-flex items-center justify-center gap-4 bg-[#ff9c94] text-background px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#ff8a80] hover:scale-105 transition-all duration-300 font-figtree shadow-lg hover:shadow-xl w-full sm:w-auto">
                  <span>
                    {aboutUsContent.learnMoreButton?.text || "Learn More"}
                  </span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Sticky Image */}
      <div className="hidden lg:block h-screen sticky top-0">
        <div className="w-full h-full relative">
          <Image
            src={aboutUsContent.imageUrl || "/images/about-us-hero.jpg"}
            alt={aboutUsContent.title || "About Us"}
            fill
            className="object-cover"
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-transparent"></div>
        </div>
      </div>

      {/* Mobile Image - Full Width Below Content */}
      <div className="lg:hidden w-full relative mt-8 aspect-[2/3]">
        <Image
          src={aboutUsContent.imageUrl || "/images/about-us-hero.jpg"}
          alt={aboutUsContent.title || "About Us"}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
    </div>
  );
}
