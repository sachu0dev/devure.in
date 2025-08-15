"use client";

import Link from "next/link";
import React from "react";
import ImageStack from "./ImageStack";
import { motion } from "framer-motion";
import { env } from "@/lib/env";

interface HeroContent {
  title1: string;
  title2: string;
  description: string;
  images: Array<{
    url: string;
    alt: string;
    order: number;
  }>;
  links: Array<{
    name: string;
    url: string;
    order: number;
  }>;
}

const textContainerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.13,
    },
  },
};

const textBounceVariants = {
  initial: { x: -120, y: 0, scale: 1.03, opacity: 0 },
  animate: {
    x: 0,
    y: [0, 8, -4, 2, 0],
    scale: [1.03, 1, 0.995, 1.01, 1],
    opacity: 1,
    transition: {
      x: { stiffness: 80, damping: 18, duration: 0.7 },
      y: { stiffness: 300, damping: 18, duration: 1.1 },
      scale: { duration: 1.1 },
      opacity: { duration: 0.3 },
    },
  },
};

const rightFadeVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.8 },
  },
};

interface HomeProps {
  heroContent?: HeroContent;
}

const Home = ({ heroContent }: HomeProps) => {
  // Use heroContent if provided, otherwise fall back to defaults
  const title1 = heroContent?.title1 || "GENUINE.";
  const title2 = heroContent?.title2 || "IMPACT.";
  const description =
    heroContent?.description ||
    `At ${env.SITE_NAME}, we help businesses build, launch, and scale custom web applications — blending design, development, and technical expertise to deliver solutions that work and grow with you.`;
  const links = heroContent?.links || [
    { name: "Portfolio", url: "https://devbysushil.com", order: 0 },
    { name: "Github", url: "https://github.com/sachu0dev", order: 1 },
    { name: "Twitter", url: "https://x.com/sachu0dev", order: 2 },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/sachu0dev",
      order: 3,
    },
  ];

  return (
    <div className="w-full max-w-[110rem] flex flex-col lg:flex-row h-auto text-background px-3 md:px-6 pb-8 lg:pb-16 pt-[8rem]">
      <div className="w-full lg:w-[50%] flex flex-col justify-between mb-8 lg:mb-0">
        <motion.div
          className="text-[72px] md:text-[90px] lg:text-[100px] xl:text-[140px] font-[900] mb-6 lg:mb-10 leading-[1.05] flex flex-col"
          variants={textContainerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.h1
            variants={textBounceVariants}
            style={{ willChange: "transform, opacity" }}
          >
            {title1}
          </motion.h1>
          <motion.h1
            variants={textBounceVariants}
            style={{ willChange: "transform, opacity" }}
          >
            {title2}
          </motion.h1>
        </motion.div>
        <motion.div
          variants={rightFadeVariants}
          initial="initial"
          animate="animate"
          className="text-base sm:text-lg md:text-xl lg:text-2xl font-[400] flex flex-col justify-between w-full md:w-[90%] lg:w-[85%] xl:w-[70%]"
        >
          <p className="mb-6">{description}</p>
          <div className="flex flex-col text-xs sm:text-sm text-[#618C70] font-bold uppercase">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                className="hover:text-background transition-colors duration-300"
                target="_blank"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
      <motion.div
        className="w-full lg:w-[50%] flex-1 flex items-center justify-center"
        variants={rightFadeVariants}
        initial="initial"
        animate="animate"
      >
        <ImageStack heroImages={heroContent?.images} />
      </motion.div>
    </div>
  );
};

export default Home;
