import { Resend } from "resend";
import BlogUpdateEmail from "@/emails/BlogUpdateEmail";
import Subscription from "@/models/Subscription";
import connectDB from "./mongodb";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface BlogUpdateData {
  title: string;
  excerpt: string;
  slug: string;
  image?: string;
  authorName?: string;
  publishDate: string;
}

export async function sendBlogUpdateEmails(blogData: BlogUpdateData) {
  try {
    await connectDB();

    const subscribers = await Subscription.find({
      isActive: true,
      "preferences.blogUpdates": true,
    });

    if (subscribers.length === 0) {
      console.log("No active subscribers found for blog updates");
      return { success: true, sentCount: 0 };
    }

    const blogUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://devure.in"}/blog/${blogData.slug}`;
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://devure.in"}/unsubscribe`;

    // Send emails in batches to avoid rate limiting
    const batchSize = 10;
    let sentCount = 0;
    let failedCount = 0;

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      const emailPromises = batch.map(async (subscriber) => {
        try {
          const { error } = await resend.emails.send({
            from: "Devure Blog <blog@devure.in>",
            to: subscriber.email,
            subject: `🚀 New Blog Post: ${blogData.title}`,
            react: BlogUpdateEmail({
              blogTitle: blogData.title,
              blogExcerpt: blogData.excerpt,
              blogUrl,
              blogImage: blogData.image,
              authorName: blogData.authorName,
              publishDate: blogData.publishDate,
              unsubscribeUrl: `${unsubscribeUrl}?email=${encodeURIComponent(subscriber.email)}`,
            }),
          });

          if (error) {
            console.error(
              `Failed to send email to ${subscriber.email}:`,
              error
            );
            failedCount++;
            return false;
          }

          // Update lastEmailSent timestamp
          await Subscription.findByIdAndUpdate(subscriber._id, {
            lastEmailSent: new Date(),
          });

          sentCount++;
          return true;
        } catch (error) {
          console.error(`Error sending email to ${subscriber.email}:`, error);
          failedCount++;
          return false;
        }
      });

      // Wait for batch to complete
      await Promise.all(emailPromises);

      // Add delay between batches to avoid rate limiting
      if (i + batchSize < subscribers.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log(
      `Blog update emails sent: ${sentCount} successful, ${failedCount} failed`
    );

    return {
      success: true,
      sentCount,
      failedCount,
      totalSubscribers: subscribers.length,
    };
  } catch (error) {
    console.error("Error sending blog update emails:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function sendWelcomeEmail(email: string) {
  try {
    const { error } = await resend.emails.send({
      from: "Devure <hello@devure.in>",
      to: email,
      subject: "Welcome to Devure Blog Updates! 🎉",
      react: BlogUpdateEmail({
        blogTitle: "Welcome to Our Community!",
        blogExcerpt:
          "Thank you for subscribing to our blog updates. We're excited to share our latest insights, tutorials, and industry knowledge with you.",
        blogUrl: "https://devure.in/blog",
        authorName: "Devure Team",
        publishDate: new Date().toLocaleDateString(),
      }),
    });

    if (error) {
      console.error("Failed to send welcome email:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
}
