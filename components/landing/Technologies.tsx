"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { motion, useInView } from "framer-motion";
import { Tooltip } from "../../components/ui/tooltip";
import Image from "next/image";

const TECHNOLOGY_ICONS: Record<string, string> = {
  // Frontend
  "React.js": "/assets/svg/react.svg",
  "Next.js": "/assets/svg/nextjs.svg",
  TypeScript: "/assets/svg/typescript.svg",
  Redux: "/assets/svg/redux.svg",
  Sass: "/assets/svg/sass.svg",
  OAuth: "/assets/svg/auth0.svg",

  // Backend
  NodeJS: "/assets/svg/nodejs-icon.svg",
  ExpressJS: "/assets/svg/express.svg",
  Hono: "/assets/svg/hono.svg",
  MongoDB: "/assets/svg/mongodb.svg",
  PostgreSQL: "/assets/svg/postgresql.svg",
  DynamoDB: "/assets/svg/aws-dynamodb.svg",
  JWT: "/assets/svg/jwt.svg",
  Socket: "/assets/svg/socket.io.svg",

  // DevOps & Cloud
  AWS: "/assets/svg/aws.svg",
  Lambda: "/assets/svg/aws-lambda.svg",
  S3: "/assets/svg/aws-s3.svg",
  EC2: "/assets/svg/aws-ec2.svg",
  GitHub: "/assets/svg/github.svg",
  Git: "/assets/svg/git.svg",
  Docker: "/assets/svg/docker.svg",
  Nginx: "/assets/svg/nginx.svg",

  // Languages
  JavaScript: "/assets/svg/javascript.svg",
  Java: "/assets/svg/java.svg",
  HTML5: "/assets/svg/html-5.svg",
  CSS3: "/assets/svg/css-3.svg",
  JSON: "/assets/svg/json.svg",
  Serverless: "/assets/svg/serverless.svg",
  Kafka: "/assets/svg/kafka.svg",
};

// Helper function to check if icon exists
const hasIcon = (techName: string) => {
  return TECHNOLOGY_ICONS[techName] && TECHNOLOGY_ICONS[techName] !== "";
};

// Extract technology names from the icon mapping
const TECHNOLOGIES = Object.keys(TECHNOLOGY_ICONS);

const REASONS = [
  "modern",
  "reliable",
  "scalable",
  "fast",
  "secure",
  "efficient",
  "powerful",
  "flexible",
  "proven",
];

const Technologies = () => {
  const [current, setCurrent] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });

  const cardsPerPage = 9;
  const totalPages = Math.ceil(TECHNOLOGIES.length / cardsPerPage);
  const startIndex = currentPage * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentTechnologies = TECHNOLOGIES.slice(startIndex, endIndex);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Auto-cycle through reasons
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
                if (isMounted) {
                  setCurrent((prev) => (prev + 1) % REASONS.length);
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

  // Auto-cycle through pages
  useEffect(() => {
    const pageInterval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 7500); // Change page every 7.5 seconds (increased by 50% from 5 seconds)

    return () => clearInterval(pageInterval);
  }, [totalPages]);

  return (
    <div className="w-full  flex flex-col items-center px-3 md:px-6 pb-8 lg:pb-16 pt-[6rem]">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-left mb-12 lg:mb-20 w-full"
      >
        <h6 className="text-[14px] sm:text-[16px] font-extrabold text-foreground/80 uppercase tracking-wider mb-4 font-figtree">
          Our Technogoies
        </h6>
        <div className="flex flex-wrap items-start gap-4 max-w-6xl">
          <h1 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[5rem] font-bold text-foreground leading-[1.1]">
            WE USE THESE
            <br />
            TECHNOLOGIES BECAUSE THEY ARE
            <div className="inline-block bg-[#cce560] text-[#242424] font-bold rounded-2xl auto px-4 py-2  justify-center items-center overflow-hidden relative ml-4">
              <span
                ref={textRef}
                className="block w-full text-center text-[1.5rem] md:text-[2.5rem] lg:text-[3rem] xl:text-[4rem] font-bold uppercase tracking-wide"
                style={{ pointerEvents: "none" }}
              >
                &ldquo;{REASONS[current]}&rdquo;
              </span>
            </div>
          </h1>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Section - Technology Grid */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, x: -100 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Technology Grid */}
            <div className="grid grid-cols-3 gap-4">
              {currentTechnologies.map((tech, index) => (
                <motion.div
                  key={`${tech}-${currentPage}`}
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 1,
                    delay: (index % 3) * 0.1,
                    ease: "easeOut",
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  }}
                  className="bg-background border-2 border-border-primary rounded-lg p-4 h-24 flex flex-col justify-center items-center text-center hover:border-[#cce560] transition-colors duration-300 hover:scale-105 transform"
                >
                  {/* Show icon if available, otherwise show text */}
                  {hasIcon(tech) ? (
                    <Tooltip content={tech}>
                      <Image
                        src={TECHNOLOGY_ICONS[tech]}
                        alt={tech}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-contain"
                      />
                    </Tooltip>
                  ) : (
                    <span className="text-foreground font-bold text-xs md:text-sm font-playwrite-australia-qld">
                      {tech}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-between items-center mt-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevPage}
                className="w-12 h-12 bg-[#ff9c94] rounded-full flex items-center justify-center text-white hover:bg-[#ff9c94]/80 transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </motion.button>

              {/* Page Indicator */}
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      i === currentPage ? "bg-[#cce560]" : "bg-gray-400"
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextPage}
                className="w-12 h-12 bg-[#cce560] rounded-full flex items-center justify-center text-white hover:bg-[#cce560]/80 transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>
            </div>
          </motion.div>

          {/* Right Section - Message Card */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={
              inView
                ? { scale: 1.04, rotate: 1, opacity: 1, x: 0 }
                : { opacity: 1, x: 0 }
            }
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            whileHover={{ scale: 1, rotate: 1.5 }}
            className="bg-[#cce0d9] rounded-2xl p-8 lg:p-10 text-[#242424] relative"
          >
            {/* Quote Mark */}
            <div className="text-6xl font-bold text-[#242424]/20 mb-1">
              &ldquo;
            </div>

            {/* Main Message */}
            <p className="text-lg md:text-xl lg:text-2xl font-medium leading-relaxed mb-8">
              We carefully select each technology in our stack based on its
              proven track record, community support, and ability to deliver
              exceptional user experiences. Our choices ensure that every
              project we build is not just functional, but future-proof and
              scalable.
            </p>

            {/* Attribution */}
            <div className="mb-8">
              <p className="font-semibold text-lg">Devure Creator</p>
              <p className="text-[#242424]/70">Sushil Kumar</p>
            </div>

            {/* Technology Logo */}
            <div className="absolute bottom-6 right-6 text-[#242424] font-bold text-sm">
              #Fullstack Web Development
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Technologies;
