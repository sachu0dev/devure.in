"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

interface ProjectActionsProps {
  liveUrl?: string;
  githubUrl?: string;
}

export default function ProjectActions({
  liveUrl,
  githubUrl,
}: ProjectActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {liveUrl && (
        <Button
          size="lg"
          className="bg-primary text-black font-bold hover:bg-primary/90"
          onClick={() => window.open(liveUrl, "_blank")}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View Live
        </Button>
      )}
      {githubUrl && (
        <Button
          variant="outline"
          size="lg"
          className="border-background text-background hover:bg-background hover:text-foreground"
          onClick={() => window.open(githubUrl, "_blank")}
        >
          <Github className="w-4 h-4 mr-2" />
          View Code
        </Button>
      )}
    </div>
  );
}
