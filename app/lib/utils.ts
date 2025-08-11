import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the current domain dynamically for SEO and URL generation
 * Supports multiple domain formats: https://devure.in, http://devure.in, https://www.devure.in
 */
export function getCurrentDomain(): string {
  // Check if we're in the browser
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Check environment variables first
  const envDomain = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (envDomain) {
    // Ensure the domain has a protocol
    if (envDomain.startsWith("http://") || envDomain.startsWith("https://")) {
      return envDomain;
    }
    // Add https:// if no protocol is specified
    return `https://${envDomain}`;
  }

  // Fallback to default domain
  return "https://devure.in";
}

/**
 * Get the current domain without protocol (e.g., "devure.in" or "www.devure.in")
 */
export function getCurrentDomainWithoutProtocol(): string {
  const domain = getCurrentDomain();
  return domain.replace(/^https?:\/\//, "");
}

/**
 * Get the canonical domain (always use https://devure.in for canonical URLs)
 */
export function getCanonicalDomain(): string {
  return "https://devure.in";
}

/**
 * Check if the current domain is the canonical domain
 */
export function isCanonicalDomain(): boolean {
  const currentDomain = getCurrentDomain();
  const canonicalDomain = getCanonicalDomain();
  return (
    currentDomain === canonicalDomain ||
    currentDomain.replace(/^https?:\/\//, "") ===
      canonicalDomain.replace(/^https?:\/\//, "")
  );
}
