"use client";

import { useState, useRef } from "react";
import { Figtree } from "next/font/google";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ContactFormData,
  ContactProjectType,
  ContactServiceType,
} from "@/types/contact";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-figtree",
  display: "swap",
});

const defaultForm: ContactFormData = {
  fullName: "",
  email: "",
  phone: "",
  website: "",
  projectType: "new_project",
  serviceType: "web_app",
  budget: "",
  timeline: "",
  message: "",
  requestedCall: false,
};

export default function ContactSection() {
  const [form, setForm] = useState<ContactFormData>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<null | { ok: boolean; message: string }>(
    null
  );
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  function update<K extends keyof ContactFormData>(
    key: K,
    value: ContactFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    }
  }

  function validateForm(): boolean {
    const errors: Record<string, string> = {};
    console.log("Validating form:", {
      form,
      recaptchaToken,
      hasRecaptchaKey: !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    });

    if (!form.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!form.message.trim()) {
      errors.message = "Message is required";
    }

    if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && !recaptchaToken) {
      errors.recaptcha = "Please complete the reCAPTCHA";
    }

    console.log("Validation errors:", errors);
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Form submitted!", { form, recaptchaToken });

    if (!validateForm()) {
      console.log("Validation failed:", fieldErrors);
      return;
    }

    console.log("Validation passed, submitting form...");
    setIsSubmitting(true);
    setStatus(null);

    try {
      const requestBody = {
        ...form,
        recaptchaToken,
      };
      console.log("Sending request to API:", requestBody);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.errors) {
          setFieldErrors(data.errors);
          throw new Error("Please fix the validation errors");
        }
        throw new Error(data?.message || "Something went wrong");
      }

      setStatus({
        ok: true,
        message: form.requestedCall
          ? "Thanks! Your message was sent and we'll call you soon."
          : "Thanks! Your message was sent.",
      });
      setForm(defaultForm);
      setRecaptchaToken(null);
      recaptchaRef.current?.reset();
      setFieldErrors({});
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to send message";
      setStatus({
        ok: false,
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleRecaptchaChange(token: string | null) {
    setRecaptchaToken(token);
    if (fieldErrors.recaptcha) {
      setFieldErrors((prev) => ({ ...prev, recaptcha: "" }));
    }
  }

  return (
    <section
      className={`w-full min-h-screen bg-foreground ${figtree.variable} pt-[9rem] px-3 md:px-6 pb-16`}
    >
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Intro and contact details */}
        <div className="lg:col-span-2 px-2 sm:px-4 md:px-6">
          <h1 className="font-black font-figtree text-background leading-[0.9] mb-4 text-[2rem] sm:text-[2.5rem] md:text-[3rem]">
            Let&apos;s build something great
          </h1>
          <p className="text-background/80 font-figtree text-base md:text-lg mb-8">
            Tell us about your project, timeline, and goals. We&apos;ll get back
            within 1–2 business days.
          </p>

          <div className="space-y-4">
            <div className="bg-background/5 rounded-2xl p-4 md:p-5">
              <p className="text-sm text-background/60 font-figtree">Email</p>
              <Link
                href="mailto:connectdevure@gmail.com"
                className="font-semibold font-figtree text-background hover:underline"
              >
                connectdevure@gmail.com
              </Link>
            </div>
            <div className="bg-background/5 rounded-2xl p-4 md:p-5">
              <p className="text-sm text-background/60 font-figtree mb-2">
                Need immediate assistance?
              </p>
              <p className="font-semibold text-background font-figtree">
                Use the form to request a callback - we&apos;ll get back to you
                within 1-2 business days
              </p>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-3 px-2 sm:px-4 md:px-6">
          <Card className="bg-transparent border-background/10">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-background/70 font-figtree">
                      Full name
                    </Label>
                    <Input
                      required
                      value={form.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                      placeholder="John Doe"
                      className={`bg-background/5 border-background/10 text-background placeholder:text-background/40 ${
                        fieldErrors.fullName ? "border-red-500" : ""
                      }`}
                    />
                    {fieldErrors.fullName && (
                      <span className="text-red-500 text-sm">
                        {fieldErrors.fullName}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-background/70 font-figtree">
                      Email
                    </Label>
                    <Input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@company.com"
                      className={`bg-background/5 border-background/10 text-background placeholder:text-background/40 ${
                        fieldErrors.email ? "border-red-500" : ""
                      }`}
                    />
                    {fieldErrors.email && (
                      <span className="text-red-500 text-sm">
                        {fieldErrors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-background/70 font-figtree">
                      Phone (optional)
                    </Label>
                    <Input
                      type="tel"
                      value={form.phone || ""}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+91 98765 43210"
                      className={`bg-background/5 border-background/10 text-background placeholder:text-background/40 ${
                        fieldErrors.phone ? "border-red-500" : ""
                      }`}
                    />
                    {fieldErrors.phone && (
                      <span className="text-red-500 text-sm">
                        {fieldErrors.phone}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-background/70 font-figtree">
                      Website (optional)
                    </Label>
                    <Input
                      type="url"
                      value={form.website || ""}
                      onChange={(e) => update("website", e.target.value)}
                      placeholder="https://example.com"
                      className={`bg-background/5 border-background/10 text-background placeholder:text-background/40 ${
                        fieldErrors.website ? "border-red-500" : ""
                      }`}
                    />
                    {fieldErrors.website && (
                      <span className="text-red-500 text-sm">
                        {fieldErrors.website}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-background/70 font-figtree">
                      Project type
                    </Label>
                    <Select
                      value={form.projectType}
                      onValueChange={(v) =>
                        update("projectType", v as ContactProjectType)
                      }
                    >
                      <SelectTrigger className="w-full bg-background/5 border-background/10 text-background">
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new_project">New project</SelectItem>
                        <SelectItem value="redesign">Redesign</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="consultation">
                          Consultation
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldErrors.projectType && (
                      <span className="text-red-500 text-sm">
                        {fieldErrors.projectType}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-background/70 font-figtree">
                      Service type
                    </Label>
                    <Select
                      value={form.serviceType}
                      onValueChange={(v) =>
                        update("serviceType", v as ContactServiceType)
                      }
                    >
                      <SelectTrigger className="w-full bg-background/5 border-background/10 text-background">
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web_app">Web application</SelectItem>
                        <SelectItem value="landing_page">
                          Landing page
                        </SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="mobile_app">Mobile app</SelectItem>
                        <SelectItem value="ui_ux">UI/UX Design</SelectItem>
                        <SelectItem value="api_integration">
                          API Integration
                        </SelectItem>
                        <SelectItem value="seo">SEO</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldErrors.serviceType && (
                      <span className="text-red-500 text-sm">
                        {fieldErrors.serviceType}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-background/70 font-figtree">
                      Budget
                    </Label>
                    <Input
                      placeholder="e.g. $3k – $10k"
                      value={form.budget}
                      onChange={(e) => update("budget", e.target.value)}
                      className={`bg-background/5 border-background/10 text-background placeholder:text-background/40 ${
                        fieldErrors.budget ? "border-red-500" : ""
                      }`}
                    />
                    {fieldErrors.budget && (
                      <span className="text-red-500 text-sm">
                        {fieldErrors.budget}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-background/70 font-figtree">
                      Timeline
                    </Label>
                    <Input
                      placeholder="e.g. 4–8 weeks"
                      value={form.timeline}
                      onChange={(e) => update("timeline", e.target.value)}
                      className={`bg-background/5 border-background/10 text-background placeholder:text-background/40 ${
                        fieldErrors.timeline ? "border-red-500" : ""
                      }`}
                    />
                    {fieldErrors.timeline && (
                      <span className="text-red-500 text-sm">
                        {fieldErrors.timeline}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-background/70 font-figtree">
                    Message
                  </Label>
                  <Textarea
                    required
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    rows={6}
                    placeholder="Share project goals, scope, links, or anything else we should know."
                    className={`bg-background/5 border-background/10 text-background placeholder:text-background/40 ${
                      fieldErrors.message ? "border-red-500" : ""
                    }`}
                  />
                  {fieldErrors.message && (
                    <span className="text-red-500 text-sm">
                      {fieldErrors.message}
                    </span>
                  )}
                </div>

                {/* reCAPTCHA */}
                {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
                  <div className="flex flex-col gap-2">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                      onChange={handleRecaptchaChange}
                      theme="dark"
                    />
                    {fieldErrors.recaptcha && (
                      <span className="text-red-500 text-sm">
                        {fieldErrors.recaptcha}
                      </span>
                    )}
                  </div>
                )}

                {status && (
                  <div
                    className={`p-4 rounded-xl font-figtree text-center ${
                      status.ok
                        ? "bg-green-500/10 border border-green-500/20 text-green-600"
                        : "bg-red-500/10 border border-red-500/20 text-red-600"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {status.ok ? (
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                      <span className="font-semibold">
                        {status.ok ? "Success!" : "Error"}
                      </span>
                    </div>
                    <p className="text-sm">{status.message}</p>
                  </div>
                )}

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-3 bg-[#ff9c94] text-background px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#ff8a80] transition-colors font-figtree w-full disabled:opacity-70"
                    onClick={() => update("requestedCall", false)}
                  >
                    {isSubmitting ? "Sending..." : "Send message"}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-3 bg-transparent border-2 border-[#ff9c94] text-background px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#ff9c94]/10 transition-colors font-figtree w-full disabled:opacity-70"
                    onClick={() => update("requestedCall", true)}
                  >
                    {isSubmitting ? "Requesting..." : "Submit & request a call"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
