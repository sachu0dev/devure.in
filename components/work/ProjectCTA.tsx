"use client";

import { Button } from "@/components/ui/button";

export default function ProjectCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-foreground">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-background mb-6">
          Ready to start your project?
        </h2>
        <p className="text-xl text-background/80 mb-8">
          Let&apos;s discuss how we can help bring your vision to life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-primary text-black font-bold hover:bg-primary/90"
            onClick={() => (window.location.href = "/contact")}
          >
            Get in Touch
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-background font-bold text-foreground hover:bg-background/80 hover:text-foreground"
            onClick={() => (window.location.href = "/work")}
          >
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
}
