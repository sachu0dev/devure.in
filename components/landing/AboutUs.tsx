import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AboutUs } from "@/types";

interface AboutUsProps {
  aboutUsContent: AboutUs | null;
}

export default function AboutUsSection({ aboutUsContent }: AboutUsProps) {
  if (!aboutUsContent || !aboutUsContent.isActive) {
    return null;
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              {aboutUsContent.title}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {aboutUsContent.description}
            </p>
            <div>
              <Link href={aboutUsContent.learnMoreButton.url}>
                <Button size="lg" className="text-base px-8 py-3">
                  {aboutUsContent.learnMoreButton.text}
                </Button>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-square relative overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={aboutUsContent.imageUrl}
                alt={aboutUsContent.title}
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
