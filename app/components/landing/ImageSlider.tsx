"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-8">
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                The first rule of Apple club is that you boast about Apple club.
              </span>{" "}
              Keep a journal, quickly jot down a grocery list, and take amazing
              class notes. Want to convert those notes to text? No problem.
              Langotiya jeetu ka mara hua yaar is ready to capture every
              thought.
            </p>
            <img
              src="https://assets.aceternity.com/macbook.png"
              alt="Macbook mockup from Aceternity UI"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
            />
          </div>
        );
      })}
    </>
  );
};

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
