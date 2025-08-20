import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface BlogUpdateEmailProps {
  blogTitle: string;
  blogExcerpt: string;
  blogUrl: string;
  blogImage?: string;
  authorName?: string;
  publishDate: string;
  unsubscribeUrl?: string;
}

export default function BlogUpdateEmail({
  blogTitle,
  blogExcerpt,
  blogUrl,
  blogImage,
  authorName = "Devure Team",
  publishDate,
  unsubscribeUrl,
}: BlogUpdateEmailProps) {
  const previewText = `New blog post: ${blogTitle}`;

  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>{previewText}</Preview>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-8 px-4">
            {/* Header */}
            <Section className="text-center mb-8">
              <Heading className="text-3xl font-bold text-gray-900 mb-2">
                🚀 New Blog Post Alert!
              </Heading>
              <Text className="text-gray-600 text-lg">
                We just published something new that you might love
              </Text>
            </Section>

            {/* Blog Post Card */}
            <Section className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-lg">
              {blogImage && (
                <Img
                  src={blogImage}
                  alt={blogTitle}
                  className="w-full h-48 object-cover rounded-xl mb-6"
                />
              )}

              <Heading className="text-2xl font-bold text-gray-900 mb-4">
                {blogTitle}
              </Heading>

              <Text className="text-gray-700 text-base leading-relaxed mb-6">
                {blogExcerpt}
              </Text>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {authorName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <Text className="text-gray-900 font-medium">
                      {authorName}
                    </Text>
                    <Text className="text-gray-500 text-sm">{publishDate}</Text>
                  </div>
                </div>
              </div>

              <Link
                href={blogUrl}
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-center"
              >
                Read Full Article →
              </Link>
            </Section>

            {/* Additional Content */}
            <Section className="text-center mb-8">
              <Text className="text-gray-600 mb-4">
                Want to explore more of our content?
              </Text>
              <Link
                href="https://devure.in/blog"
                className="text-blue-600 font-medium"
              >
                Visit our blog →
              </Link>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-8 text-center">
              <Text className="text-gray-500 text-sm mb-4">
                You&apos;re receiving this email because you subscribed to our
                blog updates.
              </Text>

              {unsubscribeUrl && (
                <Link
                  href={unsubscribeUrl}
                  className="text-gray-500 text-sm underline"
                >
                  Unsubscribe
                </Link>
              )}

              <Text className="text-gray-500 text-sm mt-4">
                © 2024 Devure. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
