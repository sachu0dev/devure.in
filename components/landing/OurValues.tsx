"use client";

import { motion } from "framer-motion";

const values = [
  {
    title: "GENUINE IMPACT",
    description:
      "Create solutions that solve real problems and deliver measurable value to users and businesses.",
    icon: "🎯",
    color: "from-[#a3d240] to-[#8bc34a]",
    delay: 0.1,
  },
  {
    title: "TECHNICAL EXCELLENCE",
    description:
      "Commit to clean code, scalable architecture, and industry best practices in every project.",
    icon: "⚡",
    color: "from-[#2d3a36] to-[#34495e]",
    delay: 0.2,
  },
  {
    title: "CONTINUOUS LEARNING",
    description:
      "Embrace new technologies and methodologies to stay at the forefront of development innovation.",
    icon: "🚀",
    color: "from-[#a3d240] to-[#4caf50]",
    delay: 0.3,
  },
  {
    title: "TRANSPARENT COLLABORATION",
    description:
      "Build trust through clear communication, honest feedback, and inclusive problem-solving.",
    icon: "🤝",
    color: "from-[#2d3a36] to-[#5d6d7e]",
    delay: 0.4,
  },
];

export default function OurValues() {
  return (
    <section className="min-h-screen bg-[#2d3a36] flex items-center py-20 px-6 md:px-12 lg:px-24">
      <div className="w-full max-w-7xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#f5f3f0] leading-tight mb-6">
            WHAT <span className="text-[#a3d240]">DRIVES US</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#a3d240] to-transparent mx-auto"></div>
        </motion.div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 1.0,
                delay: value.delay,
                ease: "easeOut",
              }}
              className="group"
            >
              <div className="relative h-full">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl border border-white/10 backdrop-blur-sm"></div>

                {/* Main Card */}
                <div className="relative h-full p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 shadow-2xl hover:shadow-[#a3d240]/20 transition-all duration-500">
                  {/* Icon */}
                  <div className="text-6xl mb-6 ">{value.icon}</div>

                  {/* Title */}
                  <h3 className="text-2xl lg:text-3xl font-bold text-[#f5f3f0] mb-4 group-hover:text-[#a3d240] transition-colors duration-300">
                    {value.title}
                  </h3>

                  {/* Description */}
                  <p className="text-lg text-[#f5f3f0]/80 leading-relaxed">
                    {value.description}
                  </p>

                  {/* Hover Effect Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#a3d240] to-transparent rounded-b-3xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-[#a3d240]/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-[#a3d240]/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Decorative Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center space-x-4 px-8 py-4 bg-gradient-to-r from-[#a3d240]/20 to-[#a3d240]/10 rounded-full border border-[#a3d240]/30">
            <div className="w-2 h-2 bg-[#a3d240] rounded-full animate-pulse"></div>
            <span className="text-[#f5f3f0] font-medium">
              Building the future, one line at a time
            </span>
            <div className="w-2 h-2 bg-[#a3d240] rounded-full animate-pulse"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
