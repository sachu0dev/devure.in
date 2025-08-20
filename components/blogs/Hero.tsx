"use client";
import { motion } from "framer-motion";
import { ChevronsDown, Sparkles } from "lucide-react";
import type React from "react";
import { BlogSubscriptionTrigger } from "@/components/ui/blog-subscription-trigger";

const Hero = () => {
  return (
    <div className="w-full max-w-[110rem] flex flex-col h-auto text-background px-3 md:px-6 pb-2 lg:pb-8 pt-[8rem]">
      <div className="relative w-fullmx-auto px-4 md:px-8">
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="absolute -top-8 left-8 lg:left-16"
          >
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
            className="absolute -top-4 right-12 lg:right-24"
          >
            <Sparkles className="w-5 h-5 text-primary/60 animate-pulse" />
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-6 mb-8"
          >
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight"
            >
              <span className=" text-accent-foreground  ">
                At Devure, we go beyond building software
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="text-xl md:text-2xl text-background/90 font-medium leading-relaxed max-w-4xl mx-auto"
            >
              we share the ideas, insights, and experiments that shape our work.
            </motion.p>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              className="space-y-4 text-lg text-background/75 leading-relaxed max-w-3xl mx-auto"
            >
              <p>
                This blog is where we talk about what we learn, what we build,
                and how we think.
              </p>
              <p>
                From engineering deep dives to behind-the-scenes of real
                projects — our posts are a window into how we approach tech,
                creatively and practically.
              </p>
            </motion.div>
          </motion.div>

          {/* Mobile Subscribe Button - Above Explore Blogs */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="lg:hidden mt-8"
          >
            <BlogSubscriptionTrigger />
          </motion.div>

          {/* Enhanced Explore Blogs Text with Bouncing Arrow */}
          <motion.a
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.0, ease: "easeOut" }}
            className="mt-8"
            href="#search"
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById("search");
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
                Explore Blogs
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
      </div>
    </div>
  );
};

export default Hero;
