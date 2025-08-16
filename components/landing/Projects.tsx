"use client";
import { useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { IconArrowRight } from "@tabler/icons-react";
import { Figtree } from "next/font/google";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-figtree",
  display: "swap",
});

// Import types from organized type files
import { Project } from "@/types";

interface ProjectsProps {
  projects: Project[];
}

// Abstract graphic patterns - will be repeated if more than 4 projects
const ABSTRACT_PATTERNS = [
  // Pattern 1: Circular rings with rotating elements
  {
    render: (color: string) => (
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
            className="absolute top-8 right-8 w-8 h-8 rounded-lg transform rotate-45"
            style={{ backgroundColor: color }}
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
            className="absolute bottom-16 left-12 w-6 h-6 rounded-lg transform rotate-45"
            style={{ backgroundColor: `${color}60` }}
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
            className="absolute top-20 left-20 w-4 h-4 rounded-lg transform rotate-45"
            style={{ backgroundColor: `${color}40` }}
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
    ),
  },
  // Pattern 2: Grid pattern with animated bars
  {
    render: (color: string) => (
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
            className="absolute bottom-8 right-8 w-8 h-32 rounded-t-lg"
            style={{ backgroundColor: `${color}20` }}
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
            className="absolute bottom-36 right-8 w-8 h-8 rounded-lg transform rotate-45"
            style={{ backgroundColor: color }}
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
    ),
  },
  // Pattern 3: Geometric shapes with rotation
  {
    render: (color: string) => (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-64 h-64">
          <motion.div
            className="absolute top-8 left-8 w-16 h-16 rounded-lg transform rotate-45"
            style={{ backgroundColor: color }}
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
            className="absolute top-16 right-16 w-12 h-12 rounded-full"
            style={{ backgroundColor: `${color}60` }}
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
            className="absolute bottom-20 left-20 w-8 h-8 transform rotate-45"
            style={{ backgroundColor: `${color}40` }}
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
            className="absolute bottom-8 right-20 w-10 h-10 rounded-lg"
            style={{ backgroundColor: `${color}80` }}
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
    ),
  },
  // Pattern 4: Bar chart style with animated heights
  {
    render: (color: string) => (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-64 h-64">
          <motion.div
            className="absolute bottom-8 left-8 w-12 h-24 rounded-t-lg"
            style={{ backgroundColor: `${color}40` }}
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
            className="absolute bottom-8 left-24 w-12 h-32 rounded-t-lg"
            style={{ backgroundColor: `${color}60` }}
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
            className="absolute bottom-8 left-40 w-12 h-16 rounded-t-lg"
            style={{ backgroundColor: `${color}80` }}
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
            className="absolute bottom-8 left-56 w-12 h-28 rounded-t-lg"
            style={{ backgroundColor: color }}
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
            className="absolute top-12 right-12 w-10 h-10 rounded-lg transform rotate-45"
            style={{ backgroundColor: color }}
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
    ),
  },
];

const Projects = ({ projects = [] }: ProjectsProps) => {
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ensure projects is always an array and only show first 4 projects
  const displayProjects = useMemo(() => {
    return Array.isArray(projects) ? projects.slice(0, 4) : [];
  }, [projects]);

  useEffect(() => {
    if (displayProjects.length === 0) return;

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
        start: "bottom center", // Start fading when bottom crosses center
        end: "bottom 20%", // End when bottom reaches 20% down
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
  }, [displayProjects]);

  // Generate colors for projects
  const generateProjectColor = (index: number) => {
    const colors = ["#cce560", "#ff9c94", "#b0d939", "#618c70"];
    return colors[index % colors.length];
  };

  if (displayProjects.length === 0) {
    return (
      <div className="w-full flex flex-col items-center md:pb-8 lg:pb-16">
        <div className="text-center py-20">
          <div className="text-background text-lg">No projects available</div>
        </div>
      </div>
    );
  }

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
        {displayProjects.map((project, index) => {
          const color = generateProjectColor(index);
          const patternIndex = index % ABSTRACT_PATTERNS.length;
          const pattern = ABSTRACT_PATTERNS[patternIndex];

          return (
            <div
              key={project._id}
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
                    {project.excerpt || project.description}
                  </p>

                  {/* Project Tags - Use technologies if available, otherwise tags */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {(project.technologies && project.technologies.length > 0
                      ? project.technologies
                      : project.tags || []
                    )
                      .slice(0, 6)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="tag px-4 py-2 rounded-full border border-background/30 bg-transparent text-background text-sm font-medium hover:bg-background/10 transition-colors duration-300 font-figtree"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>

                  {/* Learn More Button */}
                  <Link href={`/work/${project.slug}`}>
                    <button className="learn-more-btn inline-flex items-center gap-3 bg-[#ff9c94] text-background px-6 py-3 rounded-xl font-semibold text-base hover:bg-[#ff8a80] transition-all duration-300 font-figtree">
                      <span>Learn more</span>
                      <IconArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>

                {/* Right Column - Abstract Graphic */}
                <div className="card-graphic relative flex justify-center items-center pt-12">
                  <div className="relative w-full aspect-[2/1]">
                    {/* Abstract Graphic Container */}
                    <div className="w-full h-full bg-background/10 rounded-3xl border border-background/20 relative overflow-hidden">
                      {/* Render the appropriate abstract pattern */}
                      {pattern.render(color)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
