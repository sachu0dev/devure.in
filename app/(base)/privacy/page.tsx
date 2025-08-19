import React from "react";
import { Figtree } from "next/font/google";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-figtree",
  display: "swap",
});

export default function PrivacyPolicy() {
  return (
    <div className={`min-h-screen bg-foreground ${figtree.variable}`}>
      <div className="pt-[9rem] px-3 md:px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-background mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-background/80 text-lg mb-6">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-background mb-4">
                Information We Collect
              </h2>
              <p className="text-background/80 mb-4">
                We collect information you provide directly to us, such as when
                you:
              </p>
              <ul className="text-background/80 list-disc pl-6 space-y-2">
                <li>Fill out our contact form</li>
                <li>Request a callback</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us for support</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-background mb-4">
                How We Use Your Information
              </h2>
              <p className="text-background/80 mb-4">
                We use the information we collect to:
              </p>
              <ul className="text-background/80 list-disc pl-6 space-y-2">
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send you requested information about our services</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-background mb-4">
                Information Sharing
              </h2>
              <p className="text-background/80">
                We do not sell, trade, or otherwise transfer your personal
                information to third parties without your consent, except as
                described in this policy or as required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-background mb-4">
                Data Security
              </h2>
              <p className="text-background/80">
                We implement appropriate security measures to protect your
                personal information against unauthorized access, alteration,
                disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-background mb-4">
                Your Rights
              </h2>
              <p className="text-background/80 mb-4">You have the right to:</p>
              <ul className="text-background/80 list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-background mb-4">
                Contact Us
              </h2>
              <p className="text-background/80">
                If you have any questions about this Privacy Policy, please
                contact us at{" "}
                <a
                  href="mailto:connectdevure@gmail.com"
                  className="text-primary hover:underline"
                >
                  connectdevure@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
