"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import { Input } from "./input";
import { Mail, X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscriptionPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
  placeholder?: string;
  className?: string;
  variant?: "default" | "minimal";
}

export function SubscriptionPopover({
  isOpen,
  onClose,
  title = "Stay Updated",
  description = "Get notified when we publish something new. No spam — just quality content delivered to your inbox.",
  buttonText = "Subscribe Now",
  placeholder = "Enter your email...",
  className,
  variant = "default",
}: SubscriptionPopoverProps) {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    setError("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setEmail("");
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || "Subscription failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  if (variant === "minimal") {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed inset-0 z-50 flex items-center justify-center p-4",
              className
            )}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Popover */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="relative bg-background border border-border rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-full">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-xl">{title}</h3>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>

                {isSuccess ? (
                  <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-xl">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">
                      Successfully subscribed!
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <Input
                      type="email"
                      placeholder={placeholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    />

                    {error && (
                      <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                        {error}
                      </p>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubscribing}
                      className="w-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02]"
                    >
                      {isSubscribing ? "Subscribing..." : buttonText}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Default variant with expanded card animation
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.25 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.25 }}
          transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center p-4",
            className
          )}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Expanded Card */}
          <motion.div
            initial={{
              scale: 0.25,
              borderRadius: "50%",
              width: "64px",
              height: "64px",
            }}
            animate={{
              scale: 1,
              borderRadius: "24px",
              width: "320px",
              height: "280px",
            }}
            exit={{
              scale: 0.25,
              borderRadius: "50%",
              width: "64px",
              height: "64px",
            }}
            className="relative"
          >
            {/* Glow effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/10 rounded-3xl blur-xl"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="relative bg-background/95 backdrop-blur-md border border-border/30 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-full">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground text-xl">
                      {title}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={onClose}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-muted-foreground leading-relaxed"
                >
                  {description}
                </motion.p>

                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-xl"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">
                      Successfully subscribed!
                    </span>
                  </motion.div>
                ) : (
                  <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: 0.5 }}
                    onSubmit={handleSubscribe}
                    className="space-y-4"
                  >
                    <Input
                      type="email"
                      placeholder={placeholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background/50 border-border/30 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl py-3"
                      required
                    />

                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-600 bg-red-50 p-3 rounded-lg"
                      >
                        {error}
                      </motion.p>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubscribing}
                      className="w-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] rounded-xl py-3 shadow-lg hover:shadow-xl"
                    >
                      {isSubscribing ? "Subscribing..." : buttonText}
                    </Button>
                  </motion.form>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
