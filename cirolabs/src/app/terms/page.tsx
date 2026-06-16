import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "CiroLabs terms of service.",
};

export default function TermsPage() {
  return (
    <div className="pt-24 pb-20">
      <article className="max-w-3xl mx-auto px-4 md:px-6 prose prose-sm prose-neutral dark:prose-invert">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground no-underline">
          &larr; Back to home
        </Link>

        <h1 className="font-display">Terms of Service</h1>
        <p className="text-muted-foreground text-sm">Last updated: June 16, 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using CiroLabs (the &quot;Service&quot;), you agree to be bound by these
          Terms of Service. The Service is operated by CiroStack (&quot;we&quot;, &quot;us&quot;).
        </p>

        <h2>2. Account Registration</h2>
        <p>
          You must provide accurate information when creating an account. You are responsible for
          maintaining the security of your account credentials.
        </p>

        <h2>3. Purchases and Subscriptions</h2>
        <p>
          Course purchases grant lifetime access to the purchased course content. Subscriptions
          grant access for the duration of the active subscription period. Refunds are available
          within 7 days of purchase if less than 30% of the course has been completed.
        </p>

        <h2>4. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Share your account credentials with others</li>
          <li>Redistribute or resell course content</li>
          <li>Use automated tools to scrape or download content</li>
          <li>Interfere with the operation of the platform</li>
        </ul>

        <h2>5. Intellectual Property</h2>
        <p>
          All course content, including videos, code, prompts, and written materials, is owned
          by CiroStack or its instructors. Code you write in exercises and capstone projects
          belongs to you.
        </p>

        <h2>6. Talent Pipeline</h2>
        <p>
          Participation in the CiroStack talent pipeline is optional and based on capstone
          project quality. Being flagged for the pipeline does not guarantee employment.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          CiroLabs is provided &quot;as is.&quot; We are not liable for any damages arising from
          your use of the Service beyond the amount you have paid us in the last 12 months.
        </p>

        <h2>8. Changes to Terms</h2>
        <p>
          We may update these terms. Continued use of the Service after changes constitutes
          acceptance. Material changes will be communicated via email.
        </p>

        <h2>9. Contact</h2>
        <p>
          Questions? Email <a href="mailto:legal@cirostack.com">legal@cirostack.com</a>.
        </p>
      </article>
    </div>
  );
}
