"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (typeof children === "string") {
      await navigator.clipboard.writeText(children);
    } else if (
      children &&
      typeof children === "object" &&
      "props" in children
    ) {
      // Extract text content from React elements
      const textContent = extractTextContent(children);
      await navigator.clipboard.writeText(textContent);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const extractTextContent = (element: React.ReactNode): string => {
    if (typeof element === "string") return element;
    if (typeof element === "number") return element.toString();
    if (Array.isArray(element)) return element.map(extractTextContent).join("");
    if (element && typeof element === "object" && "props" in element) {
      const reactElement = element as { props: { children?: React.ReactNode } };
      if (reactElement.props.children) {
        return extractTextContent(reactElement.props.children);
      }
    }
    return "";
  };

  return (
    <div className="relative group">
      <Button
        onClick={copyToClipboard}
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-foreground/20 hover:bg-foreground/30 text-background hover:text-background z-10"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
      <pre className={className}>{children}</pre>
    </div>
  );
}
