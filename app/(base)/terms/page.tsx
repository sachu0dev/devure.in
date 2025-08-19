import React from "react";
import { Figtree } from "next/font/google";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-figtree",
  display: "swap",
});

export default function TermsOfService() {
  return (
    <div className={`min-h-screen bg-foreground ${figtree.variable}`}>
      <div className="pt-[9rem] px-3 md:px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-background mb-8">
            Terms of Service
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
                Acceptance of Terms
              </h2>
              <p className="text-background/80">
                By accessing and using Devure.in, you accept and agree to be
                bound by the terms and provision of this agreement. If you do
                not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-background mb-4">
                Services
              </h2>
              <p className="text-background/80 mb-4">
                Devure.in provides web development, design, and consulting
                services including:
              </p>
              <ul className="text-background/80 list-disc pl-6 space-y-2">
                <li>Web application development</li>
                <li>UI/UX design services</li>
                <li>E-commerce solutions</li>
                <li>API integration services</li>
                <li>SEO optimization</li>
                <li>Technical consulting</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-background mb-4">
                Project Terms
              </h2>
              <p className="text-background/80 mb-4">
                For all projects, we agree to:
              </p>
              <ul className="text-background/80 list-disc pl-6 space-y-2">
                <li>Provide detailed project proposals and timelines</li>
                <li>Maintain regular communication throughout development</li>
                <li>Deliver work according to agreed specifications</li>
                <li>
                  Provide post-launch support as outlined in project agreements
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-background mb-4">
                Payment Terms
              </h2>
              <p className="text-background/80">
                Payment terms will be specified in individual project
                agreements. Typically, we require a deposit to begin work, with
                remaining payments due upon project milestones or completion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-background mb-4">
                Intellectual Property
              </h2>
              <p className="text-background/80">
                Upon full payment, clients receive full rights to the final
                deliverables. We retain the right to showcase completed work in
                our portfolio and marketing materials.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-background mb-4">
                Limitation of Liability
              </h2>
              <p className="text-background/80">
                Devure.in shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages resulting from your
                use of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-background mb-4">
                Changes to Terms
              </h2>
              <p className="text-background/80">
                We reserve the right to modify these terms at any time. Changes
                will be effective immediately upon posting to the website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-background mb-4">
                Contact Information
              </h2>
              <p className="text-background/80">
                If you have any questions about these Terms of Service, please
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
