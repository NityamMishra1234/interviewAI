// emails/VerificationEmail.tsx
import {
  Html,
  Head,
  Preview,
  Section,
  Row,
  Heading,
  Text,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <title>InterviewAI | Verification Code</title>
      </Head>
      <Preview>Your InterviewAI verification code</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hi {username},</Heading>
        </Row>
        <Row>
          <Text>
            Please use the following OTP to verify your email and complete your registration:
          </Text>
        </Row>
        <Row>
          <Text style={{ fontWeight: 'bold', fontSize: '20px' }}>{otp}</Text>
        </Row>
      </Section>
    </Html>
  );
}
