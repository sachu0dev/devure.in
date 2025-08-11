"use client";

import { useEffect, useRef } from "react";

interface BlogContentProps {
  content: string;
}

export const BlogContent = ({ content }: BlogContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const preElements = contentRef.current.querySelectorAll("pre");

    preElements.forEach((pre) => {
      const code = pre.querySelector("code");
      const text = code ? code.textContent || "" : pre.textContent || "";

      if (!text.trim()) {
        pre.style.display = "none";
        return;
      }

      if (pre.querySelector(".copy-button")) return;

      // Create and style the copy button
      const copyButton = document.createElement("button");
      copyButton.className =
        "copy-button absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity h-8 px-2 text-xs bg-white/80 hover:bg-white text-gray-800 rounded-md border border-gray-300 hover:border-gray-400 shadow-md flex items-center justify-center";

      copyButton.innerHTML = `
        <svg class="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      `;

      pre.classList.add(
        "group",
        "relative",
        "bg-foreground",
        "text-background",
        "rounded-xl",
        "p-6",
        "my-6",
        "overflow-x-auto",
        "font-mono",
        "text-sm",
        "leading-relaxed",
        "shadow-lg",
        "border",
        "border-border"
      );

      copyButton.addEventListener("click", async () => {
        const code = pre.querySelector("code");
        const text = code ? code.textContent || "" : pre.textContent || "";

        try {
          await navigator.clipboard.writeText(text);

          // Show success icon
          copyButton.innerHTML = `
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 13l4 4L19 7" />
            </svg>
          `;

          setTimeout(() => {
            copyButton.innerHTML = `
              <svg class="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            `;
          }, 2000);
        } catch (err) {
          console.error("Failed to copy code:", err);
        }
      });

      pre.appendChild(copyButton);
    });

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
