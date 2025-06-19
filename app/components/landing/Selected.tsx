"use client"

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { AppleCardsCarouselDemo } from './ImageSlider';
import { motion, useInView } from 'framer-motion';

const PROJECTS = [
  'CRM',
  'Chat Apps',
  'E-commerce',
  'SaaS',
  'Portfolio',
  'Analytics',
  'Social Network',
  'API Platform',
  'Blog/CMS',
  'Marketplace',
];

const Selected = () => {
  const [current, setCurrent] = useState(0);
  const textRef = useRef<HTMLSpanElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const inView = useInView(carouselRef, { once: true, margin: '-100px' });

  useEffect(() => {
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
        ease: 'power2.inOut',
        onComplete: () => {
          // Hold in center
          setTimeout(() => {
            // Slide up and out
            gsap.to(textNode, {
              y: -80,
              duration: 0.5,
              ease: 'power2.inOut',
              onComplete: () => {
                if (isMounted) {
                  setCurrent((prev) => (prev + 1) % PROJECTS.length);
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
  }, [current]);

  return (
    <div className="w-full max-w-[110rem] flex flex-col items-center px-3 md:px-6 pb-8 lg:pb-16 pt-[6rem]">
      <h6 className="text-[14px] sm:text-[16px] text-center font-extrabold text-text pt-12 sm:pt-[8rem] pb-2 sm:pb-4">
        SELECTED PROJECTS
      </h6>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center w-full">
        <h1 className="text-text font-bold text-[2.2rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[6rem] text-center md:text-left leading-[1.1]">
          Creating impact in
        </h1>
        <div
          className="bg-[#cce560] text-[#242424] font-bold rounded-2xl h-[48px] sm:h-[64px] md:h-[80px] w-[200px] sm:w-[260px] md:w-[350px] flex justify-center items-center will-change-transform overflow-hidden relative mt-2 md:mt-0"
        >
          <span
            ref={textRef}
            className="block absolute left-0 right-0 w-full text-center text-[1.1rem] sm:text-[1.5rem] md:text-[2rem]"
            style={{ pointerEvents: "none" }}
          >
            {PROJECTS[current]}
          </span>
        </div>
      </div>
      <div className="w-full mt-8 sm:mt-12" style={{ overflowX: "hidden" }}>
        <motion.div
          ref={carouselRef}
          className="w-full overflow-hidden"
          initial={{ opacity: 1, x: 1000 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.4, ease: "easeOut" }}
        >
          <AppleCardsCarouselDemo />
        </motion.div>
      </div>
    </div>
  );
};

export default Selected;