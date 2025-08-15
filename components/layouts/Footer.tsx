import React from "react";
import { Github, Linkedin, Twitter, Instagram } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "Blogs", href: "/blog" },
    { name: "Work", href: "/work" },
    { name: "Services", href: "/service" },
    { name: "Experience", href: "/experience" },
    { name: "Contact", href: "/contact" },
  ];

  const socialLinks = [
    { name: "GitHub", href: "https://github.com", icon: Github },
    { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
    { name: "Twitter", href: "https://twitter.com", icon: Twitter },
    { name: "Instagram", href: "https://instagram.com", icon: Instagram },
  ];

  return (
    <footer className="bg-foreground border-t border-border/50 ">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#cce561]">Devure.in</h3>
            <p className="text-background text-sm leading-relaxed">
              Building modern, scalable web applications with cutting-edge
              technologies. Let&apos;s turn your ideas into reality.
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
                  href={link.href}
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
              <Link
                href="/service/modern-scalable-web-apps"
                className="block text-sm text-background transition-colors hover:text-primary"
              >
                Web Applications
              </Link>
              <Link
                href="/service/saas-platforms-robust-infrastructure"
                className="block text-sm text-background transition-colors hover:text-primary"
              >
                SaaS Platforms
              </Link>
              <Link
                href="/service/productivity-tools-custom-solutions"
                className="block text-sm text-background transition-colors hover:text-primary"
              >
                Custom Solutions
              </Link>
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
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors group"
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
