import Hero from "@/components/blogs/Hero";
import Search from "@/components/blogs/Search";
import React from "react";

const page = () => {
  return (
    <>
      <section
        className=" bg-foreground flex items-center justify-center text-4xl text-foreground"
        data-scroll-section
      >
        <Hero />
      </section>
      <section
        className="min-h-screen bg-background flex  justify-center text-4xl text-background "
        data-scroll-section
        id="search"
      >
        <Search />
        {/* <Home /> */}
      </section>
    </>
  );
};

export default page;
