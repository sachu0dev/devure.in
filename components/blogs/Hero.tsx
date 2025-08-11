"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronsDown, Mail, Sparkles, X } from "lucide-react";
import type React from "react";
import { useState } from "react";

const Hero = () => {
  const [email, setEmail] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDesktopCardCollapsed, setIsDesktopCardCollapsed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribing:", email);
    setEmail("");
    setIsPopoverOpen(false);
  };

  const handleClose = () => {
    setEmail("");
    setIsPopoverOpen(false);
  };

  const handleDesktopCardToggle = () => {
    setIsDesktopCardCollapsed(!isDesktopCardCollapsed);
  };

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
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full max-w-md mx-auto bg-primary text-black font-bold hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] rounded-xl py-3 shadow-lg hover:shadow-xl"
                >
                  Stay Updated
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full max-w-md mx-auto bg-transparent border-none shadow-none p-0">
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-xl"></div>
                  <div className="relative bg-background/15 backdrop-blur-md border border-background/30 rounded-3xl p-8 shadow-2xl">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/20 rounded-full">
                            <Mail className="h-5 w-5 text-primary" />
                          </div>
                          <h3 className="font-bold text-background text-xl">
                            Stay Updated
                          </h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-background/60 hover:text-background"
                          onClick={handleClose}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-background/80 leading-relaxed">
                        Get notified when we publish something new. No spam —
                        just quality content delivered to your inbox.
                      </p>
                      <form onSubmit={handleSubscribe} className="space-y-4">
                        <Input
                          type="email"
                          placeholder="Enter your email..."
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-foreground/10 border-background/30 text-background placeholder:text-background/60 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl py-3"
                          required
                        />
                        <Button
                          type="submit"
                          className="w-full bg-primary text-black font-bold hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] rounded-xl py-3 shadow-lg hover:shadow-xl"
                        >
                          Subscribe Now
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
        <motion.div
          initial={{ opacity: 0, x: 60, y: 60 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.5, delay: 1, ease: "easeOut" }}
          className="absolute hidden lg:block bottom-8 right-4 lg:right-8 xl::right-12"
        >
          <AnimatePresence mode="wait">
            {isDesktopCardCollapsed ? (
              // Collapsed circular button
              <motion.div
                key="collapsed"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{
                  duration: 0.3,
                  ease: [0.4, 0.0, 0.2, 1],
                }}
                className="relative"
              >
                {/* Glow effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                />
                <Button
                  onClick={handleDesktopCardToggle}
                  className="relative w-16 h-16 bg-background/15 backdrop-blur-md border border-background/30 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 hover:bg-background/25"
                >
                  <Mail className="h-6 w-6 text-primary" />
                </Button>
              </motion.div>
            ) : (
              // Expanded subscribe form
              <motion.div
                key="expanded"
                initial={{
                  scale: 0.25,
                  borderRadius: "50%",
                  width: "64px",
                  height: "64px",
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  borderRadius: "24px",
                  width: "320px",
                  height: "280px",
                  opacity: 1,
                }}
                exit={{
                  scale: 0.25,
                  borderRadius: "50%",
                  width: "64px",
                  height: "64px",
                  opacity: 0,
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.4, 0.0, 0.2, 1],
                }}
                className="relative"
              >
                {/* Glow effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-primary/10 rounded-3xl blur-xl"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className="relative bg-background/15 backdrop-blur-md border border-background/30 rounded-3xl p-8 shadow-2xl overflow-hidden"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    className="space-y-6"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-full">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-bold text-background text-xl">
                          Stay Updated
                        </h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-background/60 hover:text-background"
                        onClick={handleDesktopCardToggle}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, delay: 0.4 }}
                      className="text-sm text-background/80 leading-relaxed"
                    >
                      Get notified when we publish something new. No spam — just
                      quality content delivered to your inbox.
                    </motion.p>
                    <motion.form
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: 0.5 }}
                      onSubmit={handleSubscribe}
                      className="space-y-4"
                    >
                      <Input
                        type="email"
                        placeholder="Enter your email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-foreground/10 border-background/30 text-background placeholder:text-background/60 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl py-3"
                        required
                      />
                      <Button
                        type="submit"
                        className="w-full bg-primary text-black font-bold hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] rounded-xl py-3 shadow-lg hover:shadow-xl"
                      >
                        Subscribe Now
                      </Button>
                    </motion.form>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
