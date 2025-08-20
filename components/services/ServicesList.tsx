"use client";
import React, { useState, useMemo } from "react";
import { Search as SearchIcon, ArrowRight, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { env } from "@/lib/env";

interface Service {
  _id: string;
  serviceType: string;
  title: string;
  slug: string;
  image: string;
  content: string;
  excerpt?: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

interface ServicesListProps {
  services: Service[];
}

const ServicesList = ({ services }: ServicesListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter services based on search query
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return services;

    const query = searchQuery.toLowerCase();
    return services.filter(
      (service) =>
        service.title.toLowerCase().includes(query) ||
        service.serviceType.toLowerCase().includes(query) ||
        service.excerpt?.toLowerCase().includes(query) ||
        service.content.toLowerCase().includes(query)
    );
  }, [services, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full max-w-[110rem] flex flex-col h-auto text-background px-3 md:px-6 pb-8 lg:pb-16 pt-6">
      {/* Top Section - Text and Search */}
      <div className="w-full flex flex-col lg:flex-row gap-6 mb-8">
        {/* Left Side - Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1"
        >
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Our Professional Services
            </h2>
            <p className="text-foreground/80 text-lg">
              Discover our comprehensive range of technology solutions designed
              to transform your business
            </p>
          </div>
        </motion.div>

        {/* Right Side - Search */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:w-80"
        >
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-4 w-4 text-foreground/60 group-focus-within:text-primary transition-colors duration-200" />
              </div>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services..."
                className="pl-10 pr-20 bg-background border-foreground/10 text-foreground placeholder:text-foreground/50 focus:border-secondary"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <button
                  type="submit"
                  className="bg-primary text-black font-bold px-3 py-1.5 rounded-md hover:bg-primary/90 transition-all duration-200 flex items-center gap-1 text-xs"
                >
                  Search
                  <span className="text-sm">→</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Services Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
      >
        <AnimatePresence mode="wait">
          {filteredServices.map((service) => (
            <motion.div
              key={service._id}
              variants={cardVariants}
              layout
              className="group"
            >
              <Link href={`/services/${service.slug}`}>
                <Card className="h-full bg-background/50 backdrop-blur-sm border-foreground/10 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 group-hover:scale-[1.02] cursor-pointer overflow-hidden">
                  <CardHeader className="p-0">
                    {/* Service Image */}
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={service.image || env.PLACEHOLDER_IMAGE_URL}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Featured Badge */}
                      {service.isFeatured && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-primary text-black font-bold flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Featured
                          </Badge>
                        </div>
                      )}

                      {/* Service Type Badge */}
                      <div className="absolute bottom-3 left-3">
                        <Badge
                          variant="secondary"
                          className="bg-background/80 text-foreground font-medium"
                        >
                          {service.serviceType}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <CardTitle className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {service.title}
                    </CardTitle>

                    {service.excerpt && (
                      <p className="text-foreground/70 text-sm mb-4 line-clamp-3">
                        {service.excerpt}
                      </p>
                    )}

                    {/* Read More Button */}
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-semibold text-sm group-hover:text-primary/80 transition-colors duration-300">
                        Learn More
                      </span>
                      <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* No Results Message */}
      {filteredServices.length === 0 && searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <p className="text-foreground/60 text-lg mb-4">
            No services found matching your search
          </p>
          <Button
            variant="outline"
            onClick={() => setSearchQuery("")}
            className="border-foreground/20 text-foreground hover:bg-foreground hover:text-background"
          >
            Clear Search
          </Button>
        </motion.div>
      )}

      {/* Get in Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center py-12 border-t border-foreground/10"
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">
            Ready to Get Started?
          </h3>
          <p className="text-foreground/70 text-lg">
            Let&apos;s discuss how our services can help transform your business
            and achieve your goals.
          </p>
          <Button
            size="lg"
            className="bg-primary text-black font-bold px-8 py-6 text-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 group"
            onClick={() => {
              window.location.href = "/contact";
            }}
          >
            Get in Contact
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ServicesList;
