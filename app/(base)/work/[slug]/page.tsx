import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjects } from "@/lib/projects";
import { getCurrentDomain, getCanonicalDomain } from "@/lib/utils";
import Image from "next/image";
import { Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProjectActions from "@/components/work/ProjectActions";
import ProjectCTA from "@/components/work/ProjectCTA";
import { SmoothCursorWrapper } from "@/components/ui/SmoothCursorWrapper";
import { BlogContent } from "@/components/BlogContent";

// ISR: Revalidate every 6 hours
export const revalidate = 21600; // 6 hours in seconds

// Generate static params for all projects
export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// Generate metadata for each project
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const currentDomain = getCurrentDomain();
  const canonicalDomain = getCanonicalDomain();

  return {
    title: `${project.title} - Devure | Portfolio Project`,
    description:
      project.metaDescription || project.excerpt || project.description,
    keywords: [
      project.title,
      project.category,
      ...project.tags,
      "portfolio",
      "project",
      "web development",
      "software development",
    ],
    authors: [{ name: "Devure Team" }],
    creator: "Devure Team",
    publisher: "Devure",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(currentDomain),
    openGraph: {
      title: `${project.title} - Devure | Portfolio Project`,
      description:
        project.metaDescription || project.excerpt || project.description,
      url: `${currentDomain}/work/${slug}`,
      siteName: "Devure",
      images: [
        {
          url: project.coverImage,
          width: 1200,
          height: 630,
          alt: `${project.title} - Portfolio Project`,
        },
      ],
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} - Devure | Portfolio Project`,
      description:
        project.metaDescription || project.excerpt || project.description,
      images: [project.coverImage],
      creator: "@devure",
      site: "@devure",
    },
    alternates: {
      canonical: `${canonicalDomain}/work/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const currentDomain = getCurrentDomain();
  const canonicalDomain = getCanonicalDomain();

  // Enhanced structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    image: project.coverImage,
    url: `${canonicalDomain}/work/${project.slug}`,
    author: {
      "@type": "Organization",
      name: "Devure",
      url: currentDomain,
    },
    publisher: {
      "@type": "Organization",
      name: "Devure",
      url: currentDomain,
    },
    datePublished: project.createdAt,
    dateModified: project.updatedAt,
    category: project.category,
    keywords: project.tags.join(", "),
    technologies: project.technologies,
    client: project.client,
    duration: project.duration,
    liveUrl: project.liveUrl,
    githubUrl: project.githubUrl,
  };

  return (
    <>
      {/* Enhanced Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <main>
        <SmoothCursorWrapper />

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-foreground">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Project Info */}
              <div className="space-y-6">
                {/* Category Badge */}
                <Badge variant="secondary" className="text-sm font-medium">
                  {project.category}
                </Badge>

                {/* Project Title */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-background leading-tight">
                  {project.title}
                </h1>

                {/* Project Description */}
                <p className="text-xl text-background/80 leading-relaxed">
                  {project.description}
                </p>

                {/* Project Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.client && (
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-background/60" />
                      <div>
                        <p className="text-sm text-background/60">Client</p>
                        <p className="font-medium text-background">
                          {project.client}
                        </p>
                      </div>
                    </div>
                  )}
                  {project.duration && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-background/60" />
                      <div>
                        <p className="text-sm text-background/60">Duration</p>
                        <p className="font-medium text-background">
                          {project.duration}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Project Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-background/20 text-background hover:bg-background/10"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* CTA Buttons */}
                <ProjectActions
                  liveUrl={project.liveUrl}
                  githubUrl={project.githubUrl}
                />
              </div>

              {/* Right Column - Project Image */}
              <div className="relative">
                <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {project.content ? (
                <BlogContent content={project.content} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    Content coming soon...
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <ProjectCTA />
      </main>
    </>
  );
}
