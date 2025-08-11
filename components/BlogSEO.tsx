import Head from "next/head";
import { BlogPost } from "@/types/blog";
import { env } from "@/lib/env";

interface BlogSEOProps {
  blog: BlogPost;
}

export const BlogSEO = ({ blog }: BlogSEOProps) => {
  const { frontmatter } = blog;
  const url = `${env.SITE_URL}/blog/${frontmatter.slug}`;

  return (
    <Head>
      <title>{frontmatter.title}</title>
      <meta name="description" content={frontmatter.description} />

      {/* Open Graph */}
      <meta property="og:title" content={frontmatter.title} />
      <meta property="og:description" content={frontmatter.description} />
      <meta property="og:image" content={frontmatter.ogImage} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={env.SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={frontmatter.title} />
      <meta name="twitter:description" content={frontmatter.description} />
      <meta name="twitter:image" content={frontmatter.ogImage} />

      {/* Canonical */}
      <link rel="canonical" href={url} />

      {/* Article specific meta */}
      <meta property="article:published_time" content={frontmatter.date} />
      <meta property="article:author" content={frontmatter.author.name} />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: frontmatter.title,
            description: frontmatter.description,
            image: frontmatter.ogImage,
            datePublished: frontmatter.date,
            dateModified: frontmatter.date,
            url,
            author: {
              "@type": "Person",
              name: frontmatter.author.name,
              url: frontmatter.author.profileUrl,
            },
            publisher: {
              "@type": "Organization",
              name: env.SITE_NAME,
              url: env.SITE_URL,
              logo: {
                "@type": "ImageObject",
                url: `${env.SITE_URL}/blog-og.jpg`,
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": url,
            },
          }),
        }}
      />
    </Head>
  );
};
