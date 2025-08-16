import React from "react";
import { Github, Linkedin, Twitter, Instagram } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FooterContent } from "@/types/blog";

interface FooterProps {
  footerContent?: FooterContent;
}

const Footer = ({ footerContent }: FooterProps) => {
  // Default values if no footer content is provided
  const title = footerContent?.title || "Devure.in";
  const description =
    footerContent?.description ||
    "Building modern, scalable web applications with cutting-edge technologies. Let's turn your ideas into reality.";

  const navigationLinks = footerContent?.quickLinks || [
    { name: "Home", url: "/", order: 0 },
    { name: "Blogs", url: "/blog", order: 1 },
    { name: "Work", url: "/work", order: 2 },
    { name: "Services", url: "/service", order: 3 },
    { name: "About", url: "/about", order: 4 },
    { name: "Contact", url: "/contact", order: 5 },
  ];

  const servicesLinks = footerContent?.servicesLinks || [
    {
      name: "Web Applications",
      url: "/service/modern-scalable-web-apps",
      order: 0,
    },
    {
      name: "SaaS Platforms",
      url: "/service/saas-platforms-robust-infrastructure",
      order: 1,
    },
    {
      name: "Custom Solutions",
      url: "/service/productivity-tools-custom-solutions",
      order: 2,
    },
  ];

  const socialLinksData = footerContent?.socialLinks || [
    { name: "GitHub", url: "https://github.com", icon: "Github", order: 0 },
    {
      name: "LinkedIn",
      url: "https://linkedin.com",
      icon: "Linkedin",
      order: 1,
    },
    { name: "Twitter", url: "https://twitter.com", icon: "Twitter", order: 2 },
    {
      name: "Instagram",
      url: "https://instagram.com",
      icon: "Instagram",
      order: 3,
    },
  ];

  // Map icon names to actual icon components
  const iconMap: {
    [key: string]: React.ComponentType<{ className?: string }>;
  } = {
    Github,
    Linkedin,
    Twitter,
    Instagram,
  };

  return (
    <footer className="bg-foreground border-t border-border/50 ">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#cce561]">{title}</h3>
            <p className="text-background text-sm leading-relaxed">
              {description}
            </p>
            <Link href="/contact">
              <Button variant="outline" className="w-full">
                Subscribe to Updates
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-[#cce561]">Quick Links</h4>
            <nav className="space-y-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.url}
                  className="block text-sm text-background transition-colors hover:text-primary"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-[#cce561]">Services</h4>
            <nav className="space-y-2">
              {servicesLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.url}
                  className="block text-sm text-background transition-colors hover:text-primary"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="font-semibold text-[#cce561]">Let&apos;s Connect</h4>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Let&apos;s Talk
            </Button>

            <div className="space-y-3">
              <h5 className="text-sm font-medium text-[#cce561]">Follow Us</h5>
              <div className="flex space-x-3">
                {socialLinksData.map((social) => {
                  const Icon = iconMap[social.icon];
                  if (!Icon) return null;
                  return (
                    <Link
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white text-background hover:bg-muted/80 transition-colors group"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-background">
              © 2024 Devure.in. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-background">
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
