"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface ImageProps {
  src: string
  alt: string
  rotation: number
  offsetX: number
  offsetY: number
}


const images: ImageProps[] = [
    { src: 'https://placehold.co/600x400/000000/FFFFFF/png', alt: 'Image 1',   rotation: -2,
        offsetX: 120,
        offsetY: 2, }, // Replace with your actual image paths
    { src: 'https://placehold.co/600x400/000000/FFFFFF/png', alt: 'Image 2',  rotation: 0,
        offsetX: 0,
        offsetY: -2, },
    { src: 'https://placehold.co/600x400/000000/FFFFFF/png', alt: 'Image 3',  rotation: 2,
        offsetX: -120,
        offsetY: 2, },
  ];
  

export default function ImageStack() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
  

      <div className="flex-1 flex justify-center items-center">
        <div className="relative w-96 h-120">
          {images.map((image, index) => {
            const isActive = index === currentIndex
            // Calculate stack position relative to current active image
            const stackPosition = (index - currentIndex + images.length) % images.length

            return (
              <motion.div
                key={index}
                animate={{
                  scale: isActive ? 1 : 0.85 - stackPosition * 0.03,
                  x: image.offsetX + (isActive ? 0 : stackPosition * 3),
                  y: image.offsetY + (isActive ? 0 : stackPosition * 5),
                  rotate: image.rotation, // Keep original rotation always
                  z: isActive ? 0 : -stackPosition * 15,
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="absolute inset-0 rounded-3xl overflow-hidden"
                style={{
                  transformStyle: "preserve-3d",
                  zIndex: isActive ? 40 : 30 - stackPosition,
                }}
              >
                <div className="relative w-full h-full">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full h-full">
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      fill
                      className="object-cover  rounded-3xl overflow-hidden"
                      sizes="(max-width: 768px) 100vw, 320px"
                    />

                    {/* Overlay for non-active images */}
                    {!isActive && (
                      <motion.div
                        animate={{ opacity: 0.6 }}
                        className="absolute inset-0 bg-black"
                      />
                    )}                   
                  </div>
                </div>
              </motion.div>
            )
          })}

          {/* Navigation indicators */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
  )
}
