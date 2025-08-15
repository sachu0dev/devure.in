"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { AppleCardsCarouselDemo } from "./ImageSlider";
import { motion, useInView } from "framer-motion";

interface ServicesHeader {
  mainTitle: string;
  services: string[];
}

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

interface SelectedProps {
  servicesHeader: ServicesHeader | null;
  services: Service[];
}

const Selected = ({ servicesHeader, services }: SelectedProps) => {
  const [current, setCurrent] = useState(0);
  const textRef = useRef<HTMLSpanElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const inView = useInView(carouselRef, { once: true, margin: "-100px" });

  // Use services from props or fallback to header services
  const rotatingServices = servicesHeader?.services || [];
  const featuredServices =
    services?.filter((service) => service.isFeatured) || [];

  useEffect(() => {
    // Safety check: if no rotating services, don't animate
    if (rotatingServices.length === 0) return;

    let isMounted = true;
    const textNode = textRef.current;
    const animate = () => {
      if (!textNode) return;
      // Start from below
      gsap.set(textNode, { y: 80 });
      // Slide in from bottom
      gsap.to(textNode, {
        y: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          // Hold in center
          setTimeout(() => {
            // Slide up and out
            gsap.to(textNode, {
              y: -80,
              duration: 0.5,
              ease: "power2.inOut",
              onComplete: () => {
                if (isMounted && rotatingServices.length > 0) {
                  setCurrent((prev) => (prev + 1) % rotatingServices.length);
                }
              },
            });
          }, 1700);
        },
      });
    };
    animate();
    return () => {
      isMounted = false;
      gsap.killTweensOf(textNode);
    };
  }, [current, rotatingServices.length]);

  return (
    <div className="w-full flex flex-col items-center px-3 md:px-6 pb-8 lg:pb-16 pt-[6rem]">
      <h6 className="text-[14px] sm:text-[16px] text-center font-extrabold text-text pt-12 sm:pt-[8rem] pb-2 sm:pb-4">
        SELECTED SERVICES
      </h6>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center ">
        <h1
          ref={carouselRef}
          className="text-text font-bold text-[2.2rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[6rem] text-center md:text-left lg:text-center  leading-[1.1]"
        >
          {servicesHeader?.mainTitle || "Creating impact in"}
        </h1>
        <div className="bg-[#cce560] text-[#242424] font-bold rounded-2xl h-[48px] sm:h-[64px] md:h-[80px] w-[200px] sm:w-[260px] md:w-[350px] flex justify-center items-center will-change-transform overflow-hidden relative mt-2 md:mt-0">
          <span
            ref={textRef}
            className="block absolute left-0 right-0 w-full text-center text-[1.1rem] sm:text-[1.5rem] md:text-[2rem]"
            style={{ pointerEvents: "none" }}
          >
            {rotatingServices.length > 0
              ? rotatingServices[current]
              : "Services"}
          </span>
        </div>
      </div>
      <div className="w-full mt-8 sm:mt-12" style={{ overflowX: "hidden" }}>
        <motion.div
          className="w-full overflow-hidden"
          initial={{ opacity: 1, x: 1000 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.4, ease: "easeOut" }}
        >
          <AppleCardsCarouselDemo services={featuredServices} />
        </motion.div>
      </div>
    </div>
  );
};

export default Selected;
