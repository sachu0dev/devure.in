"use client";

import { motion } from "framer-motion";

export default function OurStory() {
  return (
    <section className="min-h-screen bg-[#f5f3f0] flex items-center py-20 px-6 md:px-12 lg:px-24">
      <div className="w-full max-w-7xl mx-auto">
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
              FROM CODE TO <span className="text-[#a3d240]">IMPACT</span>
            </motion.h2>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.0, delay: 0.5, ease: "easeOut" }}
              className="space-y-6"
            >
              <p className="text-lg md:text-xl text-[#2d3a36]/80 leading-relaxed">
                Devure began as a personal mission to bridge the gap between
                innovative ideas and practical digital solutions. What started
                as a curiosity-driven exploration of web technologies has
                evolved into a comprehensive platform where development
                expertise meets real-world impact.
              </p>
              <p className="text-lg md:text-xl text-[#2d3a36]/80 leading-relaxed">
                Every line of code written, every problem solved, and every
                project delivered has contributed to building this space where
                technical excellence isn&apos;t just a goal – it&apos;s a
                standard. Today, Devure stands as a testament to the power of
                continuous learning, strategic thinking, and the belief that
                great software can genuinely transform how we work and connect.
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column - Timeline Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
            className="relative"
          >
            {/* Timeline Container */}
            <div className="relative h-96 lg:h-[500px] w-full">
              {/* Main Timeline Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#a3d240] via-[#2d3a36] to-[#a3d240] transform -translate-x-1/2"></div>

              {/* Timeline Points */}
              <div className="absolute left-1/2 top-8 w-4 h-4 bg-[#a3d240] rounded-full transform -translate-x-1/2 shadow-lg animate-pulse"></div>
              <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-[#2d3a36] rounded-full transform -translate-x-1/2 shadow-lg"></div>
              <div className="absolute left-1/2 bottom-8 w-4 h-4 bg-[#a3d240] rounded-full transform -translate-x-1/2 shadow-lg animate-pulse"></div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-20 right-0 w-16 h-16 bg-[#a3d240]/20 rounded-full blur-sm"
              ></motion.div>
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute top-1/2 left-0 w-12 h-12 bg-[#2d3a36]/20 rounded-full blur-sm"
              ></motion.div>
              <motion.div
                animate={{ y: [-15, 15, -15] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
                className="absolute bottom-20 right-0 w-20 h-20 bg-[#a3d240]/15 rounded-full blur-sm"
              ></motion.div>

              {/* Code Snippet Visual */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-[#2d3a36]/10 backdrop-blur-sm rounded-2xl p-6 border border-[#a3d240]/20 shadow-xl">
                  <div className="flex space-x-2 mb-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="space-y-2 text-sm text-[#2d3a36]">
                    <div className="flex">
                      <span className="text-[#a3d240] mr-2">const</span>
                      <span>devure = {`{`}</span>
                    </div>
                    <div className="ml-4 text-[#a3d240]">mission:</div>
                    <div className="ml-4">
                      &quot;Transform ideas into impact&quot;
                    </div>
                    <div className="ml-4 text-[#a3d240]">expertise:</div>
                    <div className="ml-4">
                      &quot;Full-stack development&quot;
                    </div>
                    <div>{`}`}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
