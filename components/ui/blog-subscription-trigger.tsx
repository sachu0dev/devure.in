"use client";

import { useState } from "react";
import { Button } from "./button";

import { AnimatePresence, motion } from "framer-motion";
import { Mail, X } from "lucide-react";
import { SubscriptionPopover } from "./subscription-popover";

export function BlogSubscriptionTrigger() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDesktopCardCollapsed, setIsDesktopCardCollapsed] = useState(false);

  const handleClose = () => {
    setIsPopoverOpen(false);
  };

  const handleDesktopCardToggle = () => {
    setIsDesktopCardCollapsed(!isDesktopCardCollapsed);
  };

  return (
    <>
      {/* Mobile Subscribe Button */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
        className="lg:hidden mt-8"
      >
        <Button
          variant="outline"
          className="w-full max-w-md mx-auto bg-primary text-black font-bold hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] rounded-xl py-3 shadow-lg hover:shadow-xl"
          onClick={() => setIsPopoverOpen(true)}
        >
          Stay Updated
        </Button>
      </motion.div>

      {/* Desktop Subscription Card */}
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

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: 0.5 }}
                    className="space-y-4"
                  >
                    <Button
                      onClick={() => setIsPopoverOpen(true)}
                      className="w-full bg-primary text-black font-bold hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] rounded-xl py-3 shadow-lg hover:shadow-xl"
                    >
                      Subscribe Now
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Subscription Popover for Mobile */}
      <SubscriptionPopover
        isOpen={isPopoverOpen}
        onClose={handleClose}
        title="Stay Updated with Devure"
        description="Get notified when we publish new blog posts, share insights, and release updates. No spam — just quality content delivered to your inbox."
        buttonText="Subscribe Now"
        variant="minimal"
      />
    </>
  );
}
