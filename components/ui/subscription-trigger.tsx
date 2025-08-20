"use client";

import { useState } from "react";
import { Button } from "./button";
import { SubscriptionPopover } from "./subscription-popover";

interface SubscriptionTriggerProps {
  className?: string;
  variant?: "default" | "outline";
  children?: React.ReactNode;
}

export function SubscriptionTrigger({
  className,
  variant = "outline",
  children = "Subscribe to Updates",
}: SubscriptionTriggerProps) {
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        className={className}
        onClick={() => setIsSubscriptionOpen(true)}
      >
        {children}
      </Button>

      <SubscriptionPopover
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        title="Stay Updated with Devure"
        description="Get notified when we publish new blog posts, share insights, and release updates. No spam — just quality content delivered to your inbox."
        buttonText="Subscribe Now"
        variant="minimal"
      />
    </>
  );
}
