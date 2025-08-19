import { NextRequest, NextResponse } from "next/server";
import type { ContactFormData } from "@/types/contact";
import { Resend } from "resend";
import ContactUserReceiptEmail from "@/emails/ContactUserReceipt";
import ContactAdminNoticeEmail from "@/emails/ContactAdminNotice";
import { render } from "@react-email/render";
import {
  validateContactForm,
  sanitizeContactData,
  validateRecaptcha,
  checkHoneypot,
} from "@/lib/contactValidation";
import dbConnect from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as Partial<ContactFormData> & {
      recaptchaToken?: string;
      honeypot?: string;
    };

    // Check honeypot first
    if (!checkHoneypot(payload.honeypot || "")) {
      console.log("Honeypot triggered - potential spam");
      return NextResponse.json({ ok: true }); // Don't reveal it's spam
    }

    // Validate reCAPTCHA
    if (!payload.recaptchaToken) {
      return NextResponse.json(
        { message: "reCAPTCHA verification required" },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA with Google
    const recaptchaValid = await validateRecaptcha(payload.recaptchaToken);
    if (!recaptchaValid) {
      return NextResponse.json(
        { message: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    // Server-side validation
    const validation = validateContactForm(payload);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    // Sanitize data
    const sanitizedData = sanitizeContactData(payload);

    // Connect to MongoDB
    await dbConnect();

    // Create contact record
    const contact = new Contact({
      ...sanitizedData,
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    await contact.save();

    // Send emails via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = "Devure <noreply@devure.in>";
    const adminEmail = "connnectdevure@gmail.com";

    const userHtml = await render(
      ContactUserReceiptEmail({ fullName: sanitizedData.fullName })
    );
    const adminHtml = await render(
      ContactAdminNoticeEmail({
        fullName: sanitizedData.fullName,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        website: sanitizedData.website,
        projectType: sanitizedData.projectType,
        serviceType: sanitizedData.serviceType,
        budget: sanitizedData.budget,
        timeline: sanitizedData.timeline,
        message: sanitizedData.message,
        requestedCall: sanitizedData.requestedCall,
      })
    );

    await Promise.all([
      resend.emails.send({
        from,
        to: sanitizedData.email,
        subject: "We received your message — Devure",
        html: userHtml,
      }),
      resend.emails.send({
        from,
        to: adminEmail,
        subject: sanitizedData.requestedCall
          ? "New callback request — Devure"
          : "New contact message — Devure",
        html: adminHtml,
      }),
    ]);

    return NextResponse.json({
      ok: true,
      message: "Contact submitted successfully",
    });
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
