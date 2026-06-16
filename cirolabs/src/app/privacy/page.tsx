import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "CiroLabs privacy policy — how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-20">
      <article className="max-w-3xl mx-auto px-4 md:px-6 prose prose-sm prose-neutral dark:prose-invert">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground no-underline">
          &larr; Back to home
        </Link>

        <h1 className="font-display">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm">Last updated: June 16, 2026</p>

        <h2>1. Information We Collect</h2>
        <p>
          When you join the CiroLabs waitlist, we collect your email address. When you use the app,
          we collect account information (name, email), learning progress data, and payment
          information processed through our payment providers.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Send you launch updates and product announcements</li>
          <li>Provide and improve the CiroLabs learning experience</li>
          <li>Process payments and manage subscriptions</li>
          <li>Track learning progress and award XP/certificates</li>
        </ul>

        <h2>3. Data Sharing</h2>
        <p>
          We do not sell your personal data. We share data only with service providers necessary
          to operate the platform (payment processors, email services, hosting).
        </p>

        <h2>4. Data Storage</h2>
        <p>
          Your data is stored securely on servers within the United States. We use industry-standard
          encryption in transit and at rest.
        </p>

        <h2>5. Your Rights</h2>
        <p>
          You can request deletion of your account and all associated data at any time by contacting
          us at <a href="mailto:privacy@cirostack.com">privacy@cirostack.com</a>.
        </p>

        <h2>6. Contact</h2>
        <p>
          Questions about this policy? Email{" "}
          <a href="mailto:privacy@cirostack.com">privacy@cirostack.com</a>.
        </p>
      </article>
    </div>
  );
}
