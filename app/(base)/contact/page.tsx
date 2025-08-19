import type { Metadata } from "next";
import ContactSection from "@/components/contact/ContactSection";

export const metadata: Metadata = {
  title: "Contact | Devure.in",
  description:
    "Get in touch to discuss your project, request a quote, or book a discovery call.",
};

export default function ContactPage() {
  return <ContactSection />;
}
