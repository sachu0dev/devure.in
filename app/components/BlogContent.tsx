"use client";

import { useEffect, useRef } from "react";

interface BlogContentProps {
  content: string;
}

export const BlogContent = ({ content }: BlogContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Find all pre elements and add copy buttons
    const preElements = contentRef.current.querySelectorAll("pre");

    preElements.forEach((pre) => {
      // Check if copy button already exists
      if (pre.querySelector(".copy-button")) return;

      // Create copy button
      const copyButton = document.createElement("button");
      copyButton.className =
        "copy-button absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-foreground/20 hover:bg-foreground/30 text-background hover:text-background z-10 rounded px-2 py-1 text-xs";
      copyButton.innerHTML = `
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
      `;

      // Add group class to pre element
      pre.classList.add("group", "relative");

      // Add copy functionality
      copyButton.addEventListener("click", async () => {
        const code = pre.querySelector("code");
        const text = code ? code.textContent || "" : pre.textContent || "";

        try {
          await navigator.clipboard.writeText(text);

          // Show success state
          copyButton.innerHTML = `
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          `;

          setTimeout(() => {
            copyButton.innerHTML = `
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            `;
          }, 2000);
        } catch (err) {
          console.error("Failed to copy code:", err);
        }
      });

      pre.appendChild(copyButton);
    });

    // Cleanup function
    return () => {
      const copyButtons = contentRef.current?.querySelectorAll(".copy-button");
      copyButtons?.forEach((button) => button.remove());
    };
  }, [content]);

  return (
    <div className="blog-content" ref={contentRef}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};
