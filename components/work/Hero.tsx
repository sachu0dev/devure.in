"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronsDown, ArrowRight } from "lucide-react";
import type React from "react";

const Hero = () => {
  return (
    <div className="w-full max-w-[110rem] flex flex-col h-auto text-background px-3 md:px-6 pb-2 lg:pb-8 pt-[8rem] lg:pt-[12rem]">
      {/* Main Content */}
      <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
        {/* Left Side - Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-center lg:text-left"
        >
          <div className="space-y-6">
            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-background leading-tight"
            >
              Our Portfolio
            </motion.h1>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="min-h-[4rem] md:min-h-[5rem] lg:min-h-[6rem] flex items-center justify-center lg:justify-start"
            >
              <span className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary">
                of Innovation
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="text-lg md:text-xl lg:text-2xl text-background/80 max-w-2xl mx-auto lg:mx-0"
            >
              Discover our collection of cutting-edge projects that showcase our
              expertise in creating impactful digital solutions.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="bg-primary text-black font-bold px-8 py-6 text-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 group"
                onClick={() => {
                  const element = document.getElementById("projects");
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
              >
                View Projects
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-background text-foreground font-bold px-8 py-6 text-lg hover:bg-background hover:text-foreground transition-all duration-300 hover:scale-105"
                onClick={() => {
                  window.location.href = "/contact";
                }}
              >
                Start Your Project
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Visual Element */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="flex-1 flex justify-center lg:justify-end"
        >
          <div className="relative">
            {/* Modern abstract visual element */}
            <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 relative">
              {/* Outer ring */}
              <div className="absolute inset-0 border-2 border-primary/20 rounded-full"></div>

              {/* Inner geometric shapes */}
              <div className="absolute inset-8 flex items-center justify-center">
                <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
                  {/* Central hexagon */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 clip-path-hexagon transform rotate-45"></div>

                  {/* Floating elements */}
                  <div className="absolute -top-2 -left-2 w-4 h-4 bg-secondary/40 rounded-full"></div>
                  <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-accent/50 rounded-full"></div>
                  <div className="absolute top-1/2 -right-3 w-2 h-2 bg-primary/60 rounded-full"></div>
                  <div className="absolute top-1/2 -left-3 w-2 h-2 bg-secondary/60 rounded-full"></div>

                  {/* Central dot */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-primary/80 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary/40 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-primary/40 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-primary/40 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-primary/40 rounded-br-lg"></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.a
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
        className="mt-8 flex justify-center"
        href="#projects"
        onClick={(e) => {
          e.preventDefault();
          const element = document.getElementById("projects");
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }}
      >
        <div className="group cursor-pointer inline-flex flex-col items-center gap-3 hover:scale-105 transition-transform duration-300">
          <span className="text-2xl md:text-3xl font-bold text-background hover:text-primary/90 transition-colors duration-300">
            Explore Projects
          </span>
          <div className="text-primary">
            <ChevronsDown className="w-6 h-6" />
          </div>
        </div>
      </motion.a>
    </div>
  );
};

export default Hero;
