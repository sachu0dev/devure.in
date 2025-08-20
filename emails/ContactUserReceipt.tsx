import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
} from "@react-email/components";

interface Props {
  fullName: string;
}

export default function ContactUserReceiptEmail({ fullName }: Props) {
  return (
    <Html>
      <Head />
      <Preview>We received your message — Devure</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.brand}>Devure</Text>
          </Section>
          <Section>
            <Text style={styles.h1}>
              Thanks, {fullName.split(" ")[0] || "there"}!
            </Text>
            <Text style={styles.p}>
              We’ve received your message and will get back within 1–2 business
              days.
            </Text>
            <Text style={styles.p}>
              If you have more details to share, feel free to reply to{" "}
              <Link href="mailto:connnectdevure@gmail.com">
                connnectdevure@gmail.com
              </Link>
              email.
            </Text>
          </Section>
          <Section style={styles.footer}>
            <Text style={styles.small}>
              This email is sent from a no-reply address.
            </Text>
            <Text style={styles.small}>
              For any updates, reach us at{" "}
              <Link href="mailto:connnectdevure@gmail.com">
                connnectdevure@gmail.com
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#0f2a23",
    color: "#e6f1ed",
    fontFamily: "ui-sans-serif, system-ui",
  },
  container: { margin: "0 auto", padding: "32px 20px", maxWidth: "640px" },
  header: {
    paddingBottom: 16,
    borderBottom: "1px solid rgba(230,241,237,0.08)",
  },
  brand: { fontWeight: 900, fontSize: 20, letterSpacing: 1, color: "#e6f1ed" },
  h1: { fontSize: 24, fontWeight: 800, marginTop: 24, marginBottom: 8 },
  p: { fontSize: 14, lineHeight: "22px", color: "#cfe0da" },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTop: "1px solid rgba(230,241,237,0.08)",
  },
  small: { fontSize: 12, color: "#a8c2b9" },
} as const;
