"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { env } from "@/lib/env";

interface ImageProps {
  src: string;
  alt: string;
  rotation: number;
  offsetX: number;
  offsetY: number;
}

const placeholderImageUrl = env.PLACEHOLDER_IMAGE_URL;

const images: ImageProps[] = [
  {
    src: placeholderImageUrl,
    alt: "Image 1",
    rotation: -2,
    offsetX: 120,
    offsetY: 2,
  },
  {
    src: placeholderImageUrl,
    alt: "Image 2",
    rotation: 0,
    offsetX: 0,
    offsetY: -2,
  },
  {
    src: placeholderImageUrl,
    alt: "Image 3",
    rotation: 2,
    offsetX: -120,
    offsetY: 2,
  },
  {
    src: placeholderImageUrl,
    alt: "Image 4",
    rotation: -5,
    offsetX: 100,
    offsetY: 5,
  },
  {
    src: placeholderImageUrl,
    alt: "Image 5",
    rotation: 3,
    offsetX: -100,
    offsetY: -5,
  },
  {
    src: placeholderImageUrl,
    alt: "Image 6",
    rotation: -1,
    offsetX: 50,
    offsetY: 10,
  },
];

interface ImageStackProps {
  heroImages?: Array<{
    url: string;
    alt: string;
    order: number;
  }>;
}

export default function ImageStack({ heroImages }: ImageStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use hero images if provided, otherwise fall back to placeholder images
  const displayImages =
    heroImages && heroImages.length > 0
      ? heroImages.map((img, index) => ({
          src: img.url,
          alt: img.alt || `Image ${index + 1}`,
          rotation: [-2, 0, 2, -5, 3, -1][index % 6],
          offsetX: [120, 0, -120, 100, -100, 50][index % 6],
          offsetY: [2, -2, 2, 5, -5, 10][index % 6],
        }))
      : images;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [displayImages.length]);

  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="relative aspect-[5/7] w-[200px] sm:w-[260px] md:w-[320px] lg:w-[380px] xl:w-[500px]">
        {displayImages.map((image, index) => {
          const isActive = index === currentIndex;
          const stackPosition =
            (index - currentIndex + images.length) % images.length;

          return (
            <motion.div
              key={index}
              initial={
                isActive
                  ? {
                      opacity: 0,
                      x: image.offsetX * 0.35 + (image.offsetX > 0 ? -20 : 20),
                      y: image.offsetY * 0.35 + 20,
                      rotate: image.rotation,
                      scale: 0.8,
                    }
                  : {}
              }
              animate={{
                scale: isActive ? 1 : 0.9,
                x: image.offsetX * 0.35,
                y: image.offsetY * 0.35,
                rotate: isActive ? 0 : image.rotation,
                z: isActive ? 0 : -stackPosition * 15,
                opacity: 1,
              }}
              exit={
                isActive
                  ? {
                      opacity: 0,
                      x: image.offsetX * 0.35 + (image.offsetX > 0 ? 20 : -20),
                      y: image.offsetY * 0.35 + 20,
                      rotate: -image.rotation,
                      scale: 0.8,
                    }
                  : {}
              }
              transition={{
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="absolute inset-0 rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden"
              style={{
                transformStyle: "preserve-3d",
                zIndex: isActive ? 40 : 30 - stackPosition,
              }}
            >
              <div className="relative w-full h-full">
                <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-md md:shadow-xl lg:shadow-2xl w-full h-full">
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {!isActive && (
                    <motion.div
                      animate={{ opacity: 0.6 }}
                      className="absolute inset-0 bg-black"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {displayImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white w-6"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
