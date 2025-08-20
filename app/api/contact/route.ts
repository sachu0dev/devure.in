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
} from "@/lib/contactValidation";
import dbConnect from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as Partial<ContactFormData> & {
      recaptchaToken?: string;
    };

    if (
      process.env.RECAPTCHA_SECRET_KEY ||
      process.env.GOOGLE_RECAPTCHA_SECRET_KEY
    ) {
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
    } else {
      console.warn("reCAPTCHA not configured - skipping validation");
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
    const adminEmail = process.env.ADMIN_EMAIL || "connectdevure@gmail.com";
    const ccEmail = process.env.CC_EMAIL || "sushil.dev.in@gmail.com";

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

    // Send emails via Resend with better error handling
    console.log("Sending emails...");
    console.log("From:", from);
    console.log("To user:", sanitizedData.email);
    console.log("To admin:", adminEmail);
    console.log("CC to:", ccEmail);
    console.log("Admin email from env:", process.env.ADMIN_EMAIL);
    console.log("CC email from env:", process.env.CC_EMAIL);
    console.log("Resend API key configured:", !!process.env.RESEND_API_KEY);

    try {
      const userEmailResult = await resend.emails.send({
        from,
        to: sanitizedData.email,
        subject: "We received your message — Devure",
        html: userHtml,
      });
      console.log("User email sent successfully:", userEmailResult);

      const adminEmailResult = await resend.emails.send({
        from,
        to: adminEmail,
        cc: ccEmail,
        subject: sanitizedData.requestedCall
          ? "New callback request — Devure"
          : "New contact message — Devure",
        html: adminHtml,
      });
      console.log("Admin email sent successfully:", adminEmailResult);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Continue with the response even if emails fail
    }

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
