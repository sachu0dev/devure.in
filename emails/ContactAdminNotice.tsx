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
  email: string;
  phone?: string;
  website?: string;
  projectType: string;
  serviceType: string;
  budget: string;
  timeline: string;
  message: string;
  requestedCall?: boolean;
}

export default function ContactAdminNoticeEmail(props: Props) {
  const {
    fullName,
    email,
    phone,
    website,
    projectType,
    serviceType,
    budget,
    timeline,
    message,
    requestedCall,
  } = props;

  return (
    <Html>
      <Head />
      <Preview>
        New contact submission —{" "}
        {requestedCall ? "Requested Callback" : "Message"}
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.brand}>Devure</Text>
          </Section>
          <Section>
            <Text style={styles.h1}>
              {requestedCall ? "Requested Callback" : "New Contact Message"}
            </Text>
            <Text style={styles.p}>Name: {fullName}</Text>
            <Text style={styles.p}>Email: {email}</Text>
            {phone ? <Text style={styles.p}>Phone: {phone}</Text> : null}
            {website ? (
              <Text style={styles.p}>
                Website: <Link href={website}>{website}</Link>
              </Text>
            ) : null}
            <Text style={styles.p}>Project type: {projectType}</Text>
            <Text style={styles.p}>Service type: {serviceType}</Text>
            <Text style={styles.p}>Budget: {budget}</Text>
            <Text style={styles.p}>Timeline: {timeline}</Text>
            <Text style={{ ...styles.p, whiteSpace: "pre-wrap" }}>
              Message: {message}
            </Text>
          </Section>
          <Section style={styles.footer}>
            <Text style={styles.small}>
              Submission type:{" "}
              {requestedCall ? "Request a call" : "Normal submission"}
            </Text>
            <Text style={styles.small}>
              Reply directly to the user or schedule a call.
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
  container: { margin: "0 auto", padding: "32px 20px", maxWidth: "720px" },
  header: {
    paddingBottom: 16,
    borderBottom: "1px solid rgba(230,241,237,0.08)",
  },
  brand: { fontWeight: 900, fontSize: 20, letterSpacing: 1, color: "#e6f1ed" },
  h1: { fontSize: 22, fontWeight: 800, marginTop: 24, marginBottom: 8 },
  p: { fontSize: 14, lineHeight: "22px", color: "#cfe0da" },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTop: "1px solid rgba(230,241,237,0.08)",
  },
  small: { fontSize: 12, color: "#a8c2b9" },
} as const;
