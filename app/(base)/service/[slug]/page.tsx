import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/lib/api";
import { getAllServices } from "@/lib/services";
import { Metadata } from "next";
import Image from "next/image";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

// ISR: Revalidate every 6 hours
export const revalidate = 21600; // 6 hours in seconds

export async function generateStaticParams() {
  try {
    const services = await getAllServices();
    return services.map((service) => ({
      slug: service.slug as string,
    }));
  } catch (error) {
    console.warn("Failed to fetch services for static generation:", error);
    // Return empty array to prevent build failure
    // Pages will be generated on-demand instead
    return [];
  }
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const service = await getServiceBySlug(slug);

    if (!service) {
      return {
        title: "Service Not Found",
        description: "The requested service could not be found.",
      };
    }

    return {
      title: service.metaTitle || service.title,
      description:
        service.metaDescription ||
        service.excerpt ||
        `Learn more about ${service.title}`,
      openGraph: {
        title: service.metaTitle || service.title,
        description:
          service.metaDescription ||
          service.excerpt ||
          `Learn more about ${service.title}`,
        images: service.image ? [service.image] : [],
      },
    };
  } catch (error) {
    console.error("Error fetching service:", error);
    return {
      title: "Service Not Found",
      description: "The requested service could not be found.",
    };
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;

  try {
    const service = await getServiceBySlug(slug);

    if (!service) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  {service.serviceType}
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  {service.title}
                </h1>
                {service.excerpt && (
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {service.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-4">
                  {service.isFeatured && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      ⭐ Featured Service
                    </span>
                  )}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Order: {service.order}
                  </span>
                </div>
              </div>

              {/* Image */}
              {service.image && (
                <div className="relative w-full h-96">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover rounded-2xl shadow-2xl"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {service.content ? (
                <div
                  className="text-foreground"
                  dangerouslySetInnerHTML={{ __html: service.content }}
                />
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
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let&apos;s discuss how we can help bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Get in Touch
              </a>
              <a
                href="/services"
                className="inline-flex items-center px-8 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors"
              >
                View All Services
              </a>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error("Error fetching service:", error);
    notFound();
  }
}
