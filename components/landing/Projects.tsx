"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { IconArrowRight } from "@tabler/icons-react";
import { Figtree } from "next/font/google";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-figtree",
  display: "swap",
});

interface Project {
  title: string;
  description: string;
  tags: string[];
  color: string;
}

const PROJECTS: Project[] = [
  {
    title: "PGConnect",
    description:
      "A comprehensive SaaS platform connecting users with PG owners across India. Features include callback requests, real-time chat functionality using Socket.IO, secure OAuth-based authentication, and seamless location-based search powered by Google Maps API for accurate PG discovery.",
    tags: [
      "Next.js",
      "Google Maps API",
      "PostgreSQL",
      "Socket.IO",
      "OAuth",
      "Resend",
    ],
    color: "#cce560",
  },
  {
    title: "Atlantic Cars",
    description:
      "A sophisticated multilingual car selling platform with advanced bidding support and mobile-first responsive design. Built with internationalization (i18n), optimized SEO, and server-side rendering for exceptional performance and user experience.",
    tags: ["Next.js", "TypeScript", "Shadcn", "i18n", "SSR", "SEO"],
    color: "#ff9c94",
  },
  {
    title: "Rebelion",
    description:
      "An innovative fantasy gaming application where users create teams using Bitcoin and compete for real rewards. Features include gameweeks, comprehensive leaderboards, user history tracking, and a complete admin panel for seamless platform management.",
    tags: ["Next.js", "Node.js", "MongoDB", "Tailwind CSS", "Admin Panel"],
    color: "#b0d939",
  },
  {
    title: "Kabutar",
    description:
      "A high-performance real-time chat application designed for thousands of concurrent users. Features include secure multimedia sharing via Cloudinary, optimized frontend performance using Redux Toolkit and RTK Query, and scalable infrastructure built with modern web technologies.",
    tags: [
      "React",
      "Node.js",
      "Express",
      "Socket.IO",
      "Cloudinary",
      "Redux Toolkit",
    ],
    color: "#618c70",
  },
];

const Projects = () => {
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = projectRefs.current.filter(Boolean);
    if (cards.length === 0) return;

    // Clear existing ScrollTriggers
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Set initial states - first card expanded, others collapsed
    cards.forEach((card, index) => {
      if (!card) return;

      const content = card.querySelector(".card-content");
      const graphic = card.querySelector(".card-graphic");

      if (index === 0) {
        // First card fully expanded
        gsap.set(card, {
          height: "auto",
          opacity: 1,
        });
        gsap.set([content, graphic], {
          opacity: 1,
          y: 0,
        });
      } else {
        // Other cards collapsed
        gsap.set(card, {
          height: 150,
          opacity: 0.5,
        });
        gsap.set([content, graphic], {
          opacity: 0,
          y: 50,
        });
      }
    });

    // Create scroll triggers for each card transition
    cards.forEach((card, index) => {
      if (index === cards.length - 1) return; // Skip last card
      if (!card) return;

      const nextCard = cards[index + 1];
      if (!nextCard) return;

      ScrollTrigger.create({
        trigger: card,
        start: "top center",
        end: "bottom center",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // Current card (collapsing)
          const currentContent = card.querySelector(".card-content");
          const currentGraphic = card.querySelector(".card-graphic");

          gsap.to(card, {
            height: gsap.utils.interpolate(450, 150, progress),
            opacity: gsap.utils.interpolate(1, 0.5, progress),
            duration: 0.1,
            ease: "none",
          });

          gsap.to([currentContent, currentGraphic], {
            opacity: gsap.utils.interpolate(1, 0, progress),
            y: gsap.utils.interpolate(0, 50, progress),
            duration: 0.1,
            ease: "none",
          });

          // Next card (expanding)
          const nextContent = nextCard.querySelector(".card-content");
          const nextGraphic = nextCard.querySelector(".card-graphic");

          gsap.to(nextCard, {
            height: gsap.utils.interpolate(150, 450, progress),
            opacity: gsap.utils.interpolate(0.5, 1, progress),
            duration: 0.1,
            ease: "none",
          });

          gsap.to([nextContent, nextGraphic], {
            opacity: gsap.utils.interpolate(0, 1, progress),
            y: gsap.utils.interpolate(50, 0, progress),
            duration: 0.1,
            ease: "none",
          });
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div
      className={`w-full flex flex-col items-center md:pb-8 lg:pb-16 ${figtree.variable}`}
      ref={containerRef}
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-left mb-12 lg:mb-20 w-full px-3 md:px-18 pt-[6rem]"
      >
        <h6 className="text-[14px] sm:text-[16px] font-extrabold text-background/80 uppercase tracking-wider mb-4 font-figtree">
          Our Work
        </h6>
        <h1 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[5rem] font-bold text-background leading-[1.1] max-w-5xl font-figtree">
          Delivering <span className="text-[#cce560]">genuine impact</span>{" "}
          across different projects
        </h1>
      </motion.div>

      {/* Projects Grid - Sequential Animation */}
      <div className="w-full space-y-0">
        {PROJECTS.map((project, index) => (
          <div
            key={project.title}
            ref={(el) => {
              projectRefs.current[index] = el;
            }}
            className="w-full border-t-1 border-[#38564e] px-3 md:px-18 py-8 overflow-hidden"
            style={{ minHeight: "450px" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left Column - Text Content */}
              <div className="card-content space-y-4">
                {/* Project Title */}
                <div className="flex items-start gap-4 mb-4">
                  <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-background leading-tight font-figtree">
                    {project.title}
                  </h2>
                </div>

                {/* Project Description */}
                <p className="text-background text-base lg:text-lg leading-relaxed font-figtree mb-6">
                  {project.description}
                </p>

                {/* Project Tags */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="tag px-4 py-2 rounded-full border border-background/30 bg-transparent text-background text-sm font-medium hover:bg-background/10 transition-colors duration-300 font-figtree"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Learn More Button */}
                <button className="learn-more-btn inline-flex items-center gap-3 bg-[#ff9c94] text-background px-6 py-3 rounded-xl font-semibold text-base hover:bg-[#ff8a80] transition-all duration-300 font-figtree">
                  <span>Learn more</span>
                  <IconArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Right Column - Abstract Graphic */}
              <div className="card-graphic relative flex justify-center items-center pt-12">
                <div className="relative w-full aspect-[2/1]">
                  {/* Abstract Graphic Container */}
                  <div className="w-full h-full bg-background/10 rounded-3xl border border-background/20 relative overflow-hidden">
                    {/* Abstract Pattern - Different for each project */}
                    {index === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-64 h-64">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute inset-0 border border-background/20 rounded-full"
                              style={{
                                top: `${i * 20}px`,
                                left: `${i * 20}px`,
                                right: `${i * 20}px`,
                                bottom: `${i * 20}px`,
                              }}
                              animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.6, 0.3],
                              }}
                              transition={{
                                duration: 3 + i * 0.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                          <motion.div
                            className="absolute top-8 right-8 w-8 h-8 bg-[#cce560] rounded-lg transform rotate-45"
                            animate={{
                              rotate: [45, 405, 45],
                              scale: [1, 1.2, 1],
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          <motion.div
                            className="absolute bottom-16 left-12 w-6 h-6 bg-[#cce560]/60 rounded-lg transform rotate-45"
                            animate={{
                              y: [0, -10, 0],
                              rotate: [45, 225, 45],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 1,
                            }}
                          />
                          <motion.div
                            className="absolute top-20 left-20 w-4 h-4 bg-[#cce560]/40 rounded-lg transform rotate-45"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.4, 1, 0.4],
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.5,
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {index === 1 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-64 h-64">
                          <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1">
                            {[...Array(64)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-full h-full border border-background/10"
                                animate={{
                                  opacity: [0.1, 0.3, 0.1],
                                }}
                                transition={{
                                  duration: 2 + Math.random() * 2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: Math.random() * 2,
                                }}
                              />
                            ))}
                          </div>
                          <motion.div
                            className="absolute bottom-8 right-8 w-8 h-32 bg-background/20 rounded-t-lg"
                            animate={{
                              height: [128, 160, 128],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          <motion.div
                            className="absolute bottom-36 right-8 w-8 h-8 bg-[#ff9c94] rounded-lg transform rotate-45"
                            animate={{
                              rotate: [45, 405, 45],
                              scale: [1, 1.3, 1],
                              y: [0, -5, 0],
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {index === 2 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-64 h-64">
                          <motion.div
                            className="absolute top-8 left-8 w-16 h-16 bg-[#b0d939] rounded-lg transform rotate-45"
                            animate={{
                              rotate: [45, 405, 45],
                              scale: [1, 1.2, 1],
                            }}
                            transition={{
                              duration: 5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          <motion.div
                            className="absolute top-16 right-16 w-12 h-12 bg-[#b0d939]/60 rounded-full"
                            animate={{
                              scale: [1, 1.4, 1],
                              opacity: [0.6, 1, 0.6],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 1,
                            }}
                          />
                          <motion.div
                            className="absolute bottom-20 left-20 w-8 h-8 bg-[#b0d939]/40 transform rotate-45"
                            animate={{
                              rotate: [45, 225, 45],
                              y: [0, -8, 0],
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.5,
                            }}
                          />
                          <motion.div
                            className="absolute bottom-8 right-20 w-10 h-10 bg-[#b0d939]/80 rounded-lg"
                            animate={{
                              scale: [1, 1.3, 1],
                              rotate: [0, 180, 0],
                            }}
                            transition={{
                              duration: 6,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 2,
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {index === 3 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-64 h-64">
                          <motion.div
                            className="absolute bottom-8 left-8 w-12 h-24 bg-[#618c70]/40 rounded-t-lg"
                            animate={{
                              height: [96, 120, 96],
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          <motion.div
                            className="absolute bottom-8 left-24 w-12 h-32 bg-[#618c70]/60 rounded-t-lg"
                            animate={{
                              height: [128, 160, 128],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.5,
                            }}
                          />
                          <motion.div
                            className="absolute bottom-8 left-40 w-12 h-16 bg-[#618c70]/80 rounded-t-lg"
                            animate={{
                              height: [64, 80, 64],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 1,
                            }}
                          />
                          <motion.div
                            className="absolute bottom-8 left-56 w-12 h-28 bg-[#618c70] rounded-t-lg"
                            animate={{
                              height: [112, 140, 112],
                            }}
                            transition={{
                              duration: 3.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 1.5,
                            }}
                          />
                          <motion.div
                            className="absolute top-12 right-12 w-10 h-10 bg-[#618c70] rounded-lg transform rotate-45"
                            animate={{
                              rotate: [45, 405, 45],
                              scale: [1, 1.2, 1],
                              y: [0, -3, 0],
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className=" text-center px-3 md:px-18"
      >
        <div className="inline-flex items-center gap-3 bg-[#cce560] text-[#242424] px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-[#b8d939] transition-colors duration-300 cursor-pointer group font-figtree">
          <span>Start your project</span>
          <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
        <p className="text-background/60 mt-4 text-base font-figtree">
          Ready to build something amazing? Let&apos;s discuss your project.
        </p>
      </motion.div>
    </div>
  );
};

export default Projects;
