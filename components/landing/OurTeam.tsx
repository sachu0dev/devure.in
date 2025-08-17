"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import Image from "next/image";

const skills = [
  "JavaScript",
  "TypeScript",
  "React.js",
  "Next.js",
  "Node.js",
  "Socket.IO",
  "Kafka",
  "AWS",
  "MongoDB",
  "PostgreSQL",
];

const expertise = [
  "Full-stack JavaScript/TypeScript development",
  "Real-time applications with Socket.IO and Kafka",
  "Cloud deployment and serverless architecture",
  "Database design and optimization",
  "API development and third-party integrations",
];

export default function OurTeam() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <section className="min-h-screen bg-[#f5f3f0] flex items-center py-20 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Background Geometric Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#a3d240]/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#2d3a36]/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#a3d240]/5 rounded-full blur-lg"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-[#2d3a36]/5 rounded-full blur-lg"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-[#2d3a36] leading-tight"
            >
              THE MINDS <span className="text-[#a3d240]">BEHIND</span> THE CODE
            </motion.h2>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.0, delay: 0.5, ease: "easeOut" }}
              className="space-y-6"
            >
              <p className="text-lg md:text-xl text-[#2d3a36]/80 leading-relaxed">
                Fullstack developer specializing in modern web technologies with
                expertise in JavaScript, TypeScript, React.js, Next.js, and
                Node.js. Passionate about building scalable SaaS platforms,
                real-time applications, and automation tools that solve genuine
                business problems.
              </p>
              <p className="text-lg md:text-xl text-[#2d3a36]/80 leading-relaxed">
                With deep knowledge in both frontend and backend development, I
                focus on creating seamless user experiences backed by robust,
                efficient architectures.
              </p>
            </motion.div>

            {/* Core Expertise */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.0, delay: 0.7, ease: "easeOut" }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-bold text-[#2d3a36]">
                Core Expertise
              </h3>
              <div className="space-y-2">
                {expertise.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.8,
                      delay: 1.0 + index * 0.1,
                      ease: "easeOut",
                    }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-[#a3d240] rounded-full"></div>
                    <span className="text-[#2d3a36]/80">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Flip Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative w-full h-auto perspective-1000">
              {/* Flip Card Container */}
              <div
                className={`relative w-full transition-transform duration-700 transform-style-preserve-3d ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
              >
                {/* Front Side - Profile Card */}
                <div className="w-full backface-hidden">
                  <div className="bg-gradient-to-br from-[#2d3a36] to-[#34495e] rounded-3xl p-8 lg:p-10 shadow-2xl border border-[#a3d240]/20 overflow-hidden">
                    {/* Profile Header */}
                    <div className="text-center mb-8">
                      <div className="relative w-32 h-32 mx-auto mb-6">
                        <Avatar className="w-32 h-32 border-4 border-[#a3d240] shadow-lg">
                          <AvatarImage
                            src="https://devure.s3.ap-south-1.amazonaws.com/images/assets/1755414152131-b5vy9hr6ju.JPG"
                            alt="Sushil Kumar"
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-[#2d3a36] text-[#a3d240] text-4xl font-bold">
                            SK
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <h3 className="text-3xl font-bold text-[#f5f3f0] mb-2">
                        Sushil Kumar
                      </h3>
                      <p className="text-xl text-[#a3d240] font-semibold">
                        Lead Developer & Founder
                      </p>
                    </div>

                    {/* Skills Tags */}
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-[#f5f3f0] mb-4">
                        Technical Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                              duration: 0.6,
                              delay: 1.2 + index * 0.05,
                              ease: "easeOut",
                            }}
                            whileHover={{ scale: 1.05 }}
                            className="px-3 py-1 bg-[#a3d240]/20 text-[#a3d240] rounded-full text-sm font-medium border border-[#a3d240]/30 hover:bg-[#a3d240]/30 transition-colors duration-300"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center space-x-3 text-[#f5f3f0]/80">
                        <div className="w-5 h-5 bg-[#a3d240] rounded-full"></div>
                        <span>Available for new opportunities</span>
                      </div>
                      <div className="flex items-center space-x-3 text-[#f5f3f0]/80">
                        <div className="w-5 h-5 bg-[#a3d240] rounded-full"></div>
                        <span>Open to collaboration</span>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-[#f5f3f0] mb-4">
                        Connect
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        <a
                          href="https://github.com/your-github"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-[#a3d240]/20 text-[#a3d240] rounded-lg text-sm font-medium border border-[#a3d240]/30 hover:bg-[#a3d240]/30 transition-colors duration-300"
                        >
                          GitHub
                        </a>
                        <a
                          href="https://linkedin.com/in/your-linkedin"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-[#a3d240]/20 text-[#a3d240] rounded-lg text-sm font-medium border border-[#a3d240]/30 hover:bg-[#a3d240]/30 transition-colors duration-300"
                        >
                          LinkedIn
                        </a>
                        <a
                          href="https://twitter.com/devure"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-[#a3d240]/20 text-[#a3d240] rounded-lg text-sm font-medium border border-[#a3d240]/30 hover:bg-[#a3d240]/30 transition-colors duration-300"
                        >
                          Twitter
                        </a>
                      </div>
                    </div>

                    {/* Other Projects */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-[#f5f3f0] mb-4">
                        Other Projects
                      </h4>
                      <div className="space-y-2">
                        <a
                          href="https://pgconnect.site"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-[#f5f3f0]/80 hover:text-[#a3d240] transition-colors text-sm"
                        >
                          • PGConnect.site
                        </a>
                        <a
                          href="https://devbysushil.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-[#f5f3f0]/80 hover:text-[#a3d240] transition-colors text-sm"
                        >
                          • DevBySushil.com
                        </a>
                        <a
                          href="mailto:hello@devure.in"
                          className="block text-[#f5f3f0]/80 hover:text-[#a3d240] transition-colors text-sm"
                        >
                          • hello@devure.in
                        </a>
                      </div>
                    </div>

                    {/* Flip Button */}
                    <div className="text-center">
                      <button
                        onClick={handleFlip}
                        className="inline-flex items-center gap-3 bg-[#a3d240] text-[#2d3a36] px-6 py-3 rounded-xl font-bold text-base hover:bg-[#8bc34a] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <span>
                          {isFlipped ? "Back to Profile" : "Get to Know Me"}
                        </span>
                        <svg
                          className={`w-4 h-4 transition-transform duration-300 ${
                            isFlipped ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-3 h-3 bg-[#a3d240]/40 rounded-full"></div>
                    <div className="absolute bottom-4 left-4 w-2 h-2 bg-[#a3d240]/30 rounded-full"></div>
                    <div className="absolute top-1/2 right-0 w-1 h-16 bg-gradient-to-b from-transparent via-[#a3d240]/20 to-transparent"></div>
                  </div>
                </div>

                {/* Back Side - Image with Description */}
                <div className="absolute inset-0 w-full backface-hidden rotate-y-180">
                  <div className="relative w-full h-full rounded-3xl shadow-2xl overflow-hidden">
                    {/* Background Image */}
                    <Image
                      src="https://devure.s3.ap-south-1.amazonaws.com/images/assets/1755414152131-b5vy9hr6ju.JPG"
                      alt="Sushil Kumar - Full Stack Developer"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // Fallback to gradient background if image fails to load
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = "none";
                        const fallback =
                          target.nextElementSibling as HTMLElement;
                        if (fallback) {
                          fallback.style.display = "block";
                        }
                      }}
                    />

                    {/* Fallback Gradient Background */}
                    <div
                      className="hidden w-full h-full bg-gradient-to-br from-[#a3d240] to-[#8bc34a]"
                      style={{ minHeight: "600px" }}
                    ></div>

                    {/* Description Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2d3a36]/90 via-[#2d3a36]/50 to-transparent flex flex-col justify-end p-8 lg:p-10">
                      <div className="space-y-4 text-center">
                        <h3 className="text-3xl font-bold text-[#f5f3f0]">
                          Beyond the Code
                        </h3>
                        <p className="text-[#f5f3f0]/90 text-lg leading-relaxed max-w-2xl mx-auto">
                          When I&apos;m not crafting digital solutions,
                          you&apos;ll find me exploring new places on my bike,
                          discovering music from different cultures around the
                          world, and embarking on adventures that fuel my
                          creativity. I believe that experiencing diverse
                          perspectives through travel and music helps me bring
                          fresh, innovative approaches to every project.
                        </p>
                        <p className="text-[#f5f3f0]/90 text-lg leading-relaxed max-w-2xl mx-auto">
                          Based in India, I&apos;m passionate about building
                          solutions that make a real impact and helping
                          businesses grow through innovative technology.
                          Let&apos;s connect over shared interests and create
                          something amazing together.
                        </p>

                        {/* Flip Back Button */}
                        <div className="pt-4">
                          <button
                            onClick={handleFlip}
                            className="inline-flex items-center gap-3 bg-[#a3d240] text-[#2d3a36] px-6 py-3 rounded-xl font-bold text-base hover:bg-[#8bc34a] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            <span>Back to Profile</span>
                            <svg
                              className="w-4 h-4 transition-transform duration-300 rotate-180"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4 w-8 h-8 bg-[#a3d240]/20 rounded-full blur-sm"
              ></motion.div>
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#2d3a36]/20 rounded-full blur-sm"
              ></motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Custom CSS for flip card effect */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
  );
}
