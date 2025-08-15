"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

interface Service {
  _id: string;
  serviceType: string;
  title: string;
  slug: string;
  image: string;
  excerpt?: string;
  isFeatured: boolean;
  order: number;
}

interface AppleCardsCarouselDemoProps {
  services?: Service[];
}

export function AppleCardsCarouselDemo({
  services,
}: AppleCardsCarouselDemoProps) {
  // Use services from props if available, otherwise fallback to hardcoded data
  const displayData =
    services && services.length > 0
      ? services.map((service) => ({
          category: service.serviceType,
          title: service.title,
          src: service.image,
          slug: service.slug,
        }))
      : data;

  const cards = displayData.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-8">
      <Carousel items={cards} />
    </div>
  );
}

const data = [
  {
    category: "Web Development",
    title: "Modern, scalable web apps for your business.",
    src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    category: "SaaS Platforms",
    title: "Launch your SaaS idea with robust infrastructure.",
    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    category: "Productivity Tools",
    title: "Boost productivity with custom solutions.",
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
  },
  {
    category: "Analytics",
    title: "Gain insights with real-time analytics dashboards.",
    src: "https://wallpapercave.com/wp/wp9684460.jpg",
  },
  {
    category: "Social Platforms",
    title: "Connect communities with engaging social apps.",
    src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=1200&auto=format&fit=crop",
  },
  {
    category: "Project Management",
    title: "Organize your workflow with smart project management tools.",
    src: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop",
  },
  {
    category: "API Platforms",
    title: "Build and scale powerful APIs for your products.",
    src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=1200&auto=format&fit=crop",
  },
  {
    category: "Portfolio",
    title: "Showcase your work with a stunning portfolio site.",
    src: "https://wallpapercave.com/wp/wp13039398.jpg",
  },
  {
    category: "E-commerce",
    title: "Grow your business with a custom e-commerce platform.",
    src: "https://wallpapercave.com/wp/wp3537545.jpg",
  },
];
