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
    { src: 'https://placehold.co/500x700/618C70/FFFFFF/png', alt: 'Image 1',   rotation: -2,
        offsetX: 120,
        offsetY: 2, },
    { src: 'https://placehold.co/500x700/618C70/FFFFFF/png', alt: 'Image 2',  rotation: 0,
        offsetX: 0,
        offsetY: -2, },
    { src: 'https://placehold.co/500x700/618C70/FFFFFF/png', alt: 'Image 3',  rotation: 2,
        offsetX: -120,
        offsetY: 2, },
    { src: 'https://placehold.co/500x700/618C70/FFFFFF/png', alt: 'Image 4',  rotation: -5,
        offsetX: 100,
        offsetY: 5, },
    { src: 'https://placehold.co/500x700/618C70/FFFFFF/png', alt: 'Image 5',  rotation: 3,
        offsetX: -100,
        offsetY: -5, },
    { src: 'https://placehold.co/500x700/618C70/FFFFFF/png', alt: 'Image 6',  rotation: -1,
        offsetX: 50,
        offsetY: 10, },
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
        <div className="relative w-[500px] h-[700px]">
          {images.map((image, index) => {
            const isActive = index === currentIndex
            // Calculate stack position relative to current active image
            const stackPosition = (index - currentIndex + images.length) % images.length

            return (
              <motion.div
                key={index}
                initial={isActive ? {
                  opacity: 0,
                  x: image.offsetX + (image.offsetX > 0 ? -30 : 30),
                  y: image.offsetY + 30,
                  rotate: image.rotation,
                  scale: 0.8
                } : {}}
                animate={{
                  scale: isActive ? 1 : 0.9,
                  x: image.offsetX,
                  y: image.offsetY,
                  rotate: isActive ? 0 : image.rotation,
                  z: isActive ? 0 : -stackPosition * 15,
                  opacity: 1,
                }}
                exit={isActive ? {
                  opacity: 0,
                  x: image.offsetX + (image.offsetX > 0 ? 30 : -30),
                  y: image.offsetY + 30,
                  rotate: -image.rotation,
                  scale: 0.8
                } : {}}
                transition={{
                  duration: 0.6,
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
                      className="object-cover"
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
