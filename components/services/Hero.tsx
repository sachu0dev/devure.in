"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronsDown, ArrowRight } from "lucide-react";
import type React from "react";
import { useState, useEffect } from "react";

interface ServicesHeader {
  _id: string;
  mainTitle: string;
  services: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface HeroProps {
  servicesHeader: ServicesHeader | null;
}

const Hero = ({ servicesHeader }: HeroProps) => {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  // Rotate through services every 3 seconds
  useEffect(() => {
    if (!servicesHeader?.services.length) return;

    const interval = setInterval(() => {
      setCurrentServiceIndex(
        (prev) => (prev + 1) % servicesHeader.services.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [servicesHeader?.services.length]);

  const defaultServices = [
    "Web Development",
    "Mobile Apps",
    "Custom Software",
    "UI/UX Design",
    "Cloud Solutions",
    "API Development",
  ];

  const services = servicesHeader?.services || defaultServices;
  const mainTitle = servicesHeader?.mainTitle || "Creating impact in";

  return (
    <div className="w-full max-w-[110rem] flex flex-col h-auto text-background px-3 md:px-6 pb-2 lg:pb-8 pt-[8rem] lg:pt-[12rem]">
      {/* Main Content */}
      <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
        {/* Left Side - Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex-1 text-center lg:text-left"
        >
          <div className="space-y-6">
            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-background leading-tight"
            >
              {mainTitle}
            </motion.h1>

            {/* Rotating Services */}
            <motion.div
              key={currentServiceIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="min-h-[4rem] md:min-h-[5rem] lg:min-h-[6rem] flex items-center justify-center lg:justify-start"
            >
              <span className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary">
                {services[currentServiceIndex]}
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="text-lg md:text-xl lg:text-2xl text-background/80 max-w-2xl mx-auto lg:mx-0"
            >
              We transform ideas into powerful digital solutions that drive
              business growth and user engagement.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="bg-primary text-black font-bold px-8 py-6 text-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 group"
                onClick={() => {
                  const element = document.getElementById("services");
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
              >
                Explore Services
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
                Get in Touch
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Visual Element */}
        <motion.div
          initial={{ opacity: 0, x: 60, y: 60 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          className="flex-1 flex justify-center lg:justify-end"
        >
          <div className="relative">
            {/* Animated background elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 border-2 border-primary/20 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 border-2 border-secondary/30 rounded-full"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-8 border-2 border-accent/40 rounded-full"
            />

            {/* Center icon or text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-6xl md:text-7xl lg:text-8xl text-primary/60"
              >
                ⚡
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.a
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.0, ease: "easeOut" }}
        className="mt-8 flex justify-center"
        href="#services"
        onClick={(e) => {
          e.preventDefault();
          const element = document.getElementById("services");
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
            Explore Services
          </span>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="text-primary"
          >
            <ChevronsDown className="w-6 h-6" />
          </motion.div>
        </div>
      </motion.a>
    </div>
  );
};

export default Hero;
