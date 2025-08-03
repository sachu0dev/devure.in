import { Metadata } from "next";
import { getAllBlogs, getAllCategories } from "@/lib/blog";
import Hero from "@/components/blogs/Hero";
import Search from "@/components/blogs/Search";

export const metadata: Metadata = {
  title: "Blog - Devure",
  description:
    "Explore insights, tutorials, and deep dives into technology on the Devure blog.",
  openGraph: {
    title: "Blog - Devure",
    description:
      "Explore insights, tutorials, and deep dives into technology on the Devure blog.",
    type: "website",
  },
};

export default async function BlogPage() {
  // Server-side data fetching
  const [blogs, categories] = await Promise.all([
    getAllBlogs(),
    getAllCategories(),
  ]);

  return (
    <>
      <section
        className="bg-foreground flex items-center justify-center text-4xl text-foreground"
        data-scroll-section
      >
        <Hero />
      </section>
      <section
        className="min-h-screen bg-background flex justify-center text-4xl text-background"
        data-scroll-section
        id="search"
      >
        <Search blogs={blogs} categories={categories} />
      </section>
    </>
  );
}
