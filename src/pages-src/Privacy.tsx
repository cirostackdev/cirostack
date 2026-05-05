"use client";

import { Shield } from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";
import heroGeneric from "@/assets/hero-generic.jpg";

const Privacy = () => (
  <Layout>
    <SEO
      title="Privacy Policy"
      description="Learn how CiroStack collects, uses, and protects your personal information and data."
      url="/privacy"
    />
    <PageHero
      icon={Shield}
      title="Privacy Policy"
      description="How we collect, use, and protect your personal information."
      image={heroGeneric}
      ctaText="Contact Us"
      ctaLink="/contact"
    />
    <section className="section-padding">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <p className="text-sm">Effective Date: May 4, 2026 &nbsp;|&nbsp; Last Updated: May 4, 2026</p>

          {/* ------------------------------------------------------------------ */}
          {/* 1. INTRODUCTION */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">1. Introduction</h2>
            <p>
              <strong>CiroStack</strong> (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), operated by Jessy Onah, is committed to protecting the privacy and security of your personal information. This Privacy Policy (&ldquo;Policy&rdquo;) describes how we collect, use, disclose, store, and protect information when you:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Visit our website at <a href="https://cirostack.com" className="text-primary hover:underline">cirostack.com</a> (the &ldquo;Site&rdquo;)</li>
              <li>Engage with us through contact forms, email, phone, WhatsApp, or social media</li>
              <li>Use our software development services</li>
              <li>Subscribe to our newsletter or marketing communications</li>
            </ul>
            <p>
              This Policy should be read together with our <a href="/terms" className="text-primary hover:underline">Terms of Service</a>. By accessing the Site or providing us with your information, you acknowledge that you have read and understood this Policy. If you do not agree with our practices, please do not use the Site or provide us with your information.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 2. INFORMATION WE COLLECT */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">2. Information We Collect</h2>

            <h3 className="text-lg font-display font-medium text-foreground">2.1 Information You Provide Directly</h3>
            <p>We collect information that you voluntarily provide to us, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Contact Information:</strong> Name, email address, phone number, company name, job title, and physical address when you fill out a contact form, request a quote, or initiate a project inquiry.</li>
              <li><strong>Project Information:</strong> Business requirements, technical specifications, project briefs, design assets, content, credentials, and other materials you provide in the course of a project engagement.</li>
              <li><strong>Communication Data:</strong> The content of emails, WhatsApp messages, chat conversations, and other communications you send to us.</li>
              <li><strong>Payment Information:</strong> Billing address, payment method details, and transaction history. Note: We do not directly store credit card numbers or bank account details; payment processing is handled by third-party payment processors.</li>
              <li><strong>Newsletter &amp; Marketing:</strong> Your email address and communication preferences when you subscribe to our newsletter or opt in to marketing communications.</li>
              <li><strong>Feedback &amp; Surveys:</strong> Responses to surveys, testimonials, reviews, and feedback you provide.</li>
            </ul>

            <h3 className="text-lg font-display font-medium text-foreground">2.2 Information Collected Automatically</h3>
            <p>When you visit our Site, we may automatically collect certain technical and usage information, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Device Information:</strong> Browser type and version, operating system, device type (desktop, mobile, tablet), screen resolution, and device identifiers.</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent on pages, click patterns, referring/exit pages, navigation paths, and interaction with Site features.</li>
              <li><strong>Network Information:</strong> IP address, approximate geographic location (city/country level, derived from IP), internet service provider, and connection type.</li>
              <li><strong>Cookies &amp; Similar Technologies:</strong> Data collected through cookies, web beacons, pixels, and similar tracking technologies (see Section 8 for details).</li>
            </ul>

            <h3 className="text-lg font-display font-medium text-foreground">2.3 Information from Third Parties</h3>
            <p>We may receive information about you from third-party sources, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Analytics Providers:</strong> Aggregated website usage data from analytics services.</li>
              <li><strong>Social Media:</strong> Publicly available information from social media profiles if you interact with our social media accounts.</li>
              <li><strong>Referrals:</strong> Your name and contact information from business partners, existing clients, or professional networks who refer you to us.</li>
            </ul>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 3. HOW WE USE YOUR INFORMATION */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">3. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>

            <h3 className="text-lg font-display font-medium text-foreground">3.1 Service Delivery</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>To respond to your inquiries and provide project quotes</li>
              <li>To perform our software development and consulting services</li>
              <li>To communicate project updates, milestones, and deliverables</li>
              <li>To process payments and manage billing</li>
              <li>To provide post-project support and maintenance</li>
            </ul>

            <h3 className="text-lg font-display font-medium text-foreground">3.2 Site Operation &amp; Improvement</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>To operate, maintain, and improve the Site</li>
              <li>To analyse usage patterns and optimize user experience</li>
              <li>To diagnose technical problems and ensure Site security</li>
              <li>To personalize your experience on the Site</li>
            </ul>

            <h3 className="text-lg font-display font-medium text-foreground">3.3 Communication</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>To send you service-related notices (e.g., project updates, invoices, security alerts)</li>
              <li>To send marketing communications, newsletters, and promotional materials (only with your consent or where permitted by law)</li>
              <li>To respond to your comments, questions, and requests</li>
            </ul>

            <h3 className="text-lg font-display font-medium text-foreground">3.4 Legal &amp; Compliance</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>To comply with applicable laws, regulations, and legal processes</li>
              <li>To enforce our Terms of Service and other agreements</li>
              <li>To protect the rights, property, and safety of CiroStack, our clients, and others</li>
              <li>To detect, prevent, and address fraud, security issues, or technical problems</li>
            </ul>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 4. LEGAL BASIS FOR PROCESSING */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">4. Legal Basis for Processing (GDPR &amp; NDPR)</h2>
            <p>
              If you are located in the European Economic Area (EEA), the United Kingdom (UK), or Nigeria, we process your personal data under the following legal bases as required by the General Data Protection Regulation (GDPR), UK GDPR, and the Nigeria Data Protection Regulation (NDPR):
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Contractual Necessity:</strong> Processing necessary for the performance of a contract with you or to take steps at your request before entering into a contract (e.g., providing Services, processing payments).</li>
              <li><strong>Consent:</strong> Where you have given clear consent for us to process your personal data for a specific purpose (e.g., marketing communications, newsletter subscriptions). You may withdraw your consent at any time.</li>
              <li><strong>Legitimate Interests:</strong> Processing necessary for our legitimate business interests, provided these interests are not overridden by your rights and freedoms (e.g., improving our Site, fraud prevention, business analytics).</li>
              <li><strong>Legal Obligation:</strong> Processing necessary to comply with a legal obligation to which we are subject (e.g., tax reporting, responding to lawful data access requests).</li>
            </ul>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 5. DATA SHARING & DISCLOSURE */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">5. Data Sharing &amp; Disclosure</h2>
            <p>
              <strong>We do not sell, rent, or trade your personal information to third parties for their marketing purposes.</strong> We may share your information only in the following circumstances:
            </p>

            <h3 className="text-lg font-display font-medium text-foreground">5.1 Service Providers</h3>
            <p>
              We may share your information with trusted third-party service providers who perform services on our behalf, including:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Cloud hosting and infrastructure providers</li>
              <li>Payment processors</li>
              <li>Email delivery services</li>
              <li>Analytics providers</li>
              <li>Customer relationship management (CRM) tools</li>
              <li>Communication platforms (e.g., WhatsApp Business API)</li>
            </ul>
            <p>
              These providers are contractually obligated to use your information only for the purposes for which we disclose it to them and are required to maintain the confidentiality and security of your data.
            </p>

            <h3 className="text-lg font-display font-medium text-foreground">5.2 Contractors &amp; Collaborators</h3>
            <p>
              In the course of delivering Services, we may share project-related information with contractors, freelancers, or partner agencies who are engaged to assist with your project. All such parties are bound by confidentiality agreements.
            </p>

            <h3 className="text-lg font-display font-medium text-foreground">5.3 Legal Requirements</h3>
            <p>
              We may disclose your information if required to do so by law, regulation, legal process, or governmental request, or where we believe disclosure is necessary to: (a) comply with applicable law or a court order; (b) protect the rights, property, or safety of CiroStack, our clients, or the public; (c) detect, prevent, or address fraud, security issues, or technical problems; or (d) enforce our Terms of Service.
            </p>

            <h3 className="text-lg font-display font-medium text-foreground">5.4 Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, reorganization, or sale of all or a portion of our assets, your information may be transferred as part of that transaction. We will notify you of any such change and any choices you may have regarding your information.
            </p>

            <h3 className="text-lg font-display font-medium text-foreground">5.5 With Your Consent</h3>
            <p>
              We may share your information for other purposes with your explicit consent.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 6. DATA RETENTION */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">6. Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to fulfil the purposes for which it was collected, including to satisfy any legal, accounting, or reporting requirements. Specific retention periods are as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Client project data:</strong> Retained for the duration of the project engagement and for five (5) years after project completion, to support warranty obligations, potential disputes, and ongoing client relationships.</li>
              <li><strong>Contact and inquiry data:</strong> Retained for two (2) years from the date of last interaction if no project engagement follows.</li>
              <li><strong>Payment and billing records:</strong> Retained for seven (7) years as required by applicable tax and accounting laws.</li>
              <li><strong>Marketing and newsletter data:</strong> Retained until you unsubscribe or request deletion.</li>
              <li><strong>Website analytics data:</strong> Retained in anonymized or aggregated form for up to twenty-six (26) months.</li>
            </ul>
            <p>
              When personal information is no longer needed, we will securely delete or anonymize it. Anonymized data that can no longer be associated with an individual may be retained indefinitely for statistical and analytical purposes.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 7. DATA SECURITY */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">7. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Encryption of data in transit using TLS/SSL protocols</li>
              <li>Encryption of sensitive data at rest</li>
              <li>Access controls and authentication requirements for systems containing personal data</li>
              <li>Regular security assessments and vulnerability testing</li>
              <li>Confidentiality agreements with all employees, contractors, and service providers who access personal data</li>
              <li>Secure disposal of data when no longer needed</li>
            </ul>
            <p>
              While we take reasonable precautions to protect your information, no method of transmission over the Internet or method of electronic storage is 100% secure. We cannot guarantee absolute security. If you have reason to believe that your interaction with us is no longer secure, please contact us immediately.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 8. COOKIES & TRACKING TECHNOLOGIES */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">8. Cookies &amp; Tracking Technologies</h2>
            <p>
              Our Site may use cookies and similar tracking technologies to enhance your experience and collect information about how the Site is used.
            </p>

            <h3 className="text-lg font-display font-medium text-foreground">8.1 Types of Cookies We Use</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Strictly Necessary Cookies:</strong> Essential for the Site to function properly. These cookies enable core functionalities such as page navigation and access to secure areas. The Site cannot function properly without these cookies, and they cannot be disabled.</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with the Site by collecting and reporting information anonymously. This helps us improve the Site&rsquo;s structure and content.</li>
              <li><strong>Functional Cookies:</strong> Enable enhanced functionality and personalization, such as remembering your preferences (e.g., language, region) and providing more relevant features.</li>
              <li><strong>Marketing Cookies:</strong> Used to track visitors across websites to display relevant advertisements. These are only set with your consent.</li>
            </ul>

            <h3 className="text-lg font-display font-medium text-foreground">8.2 Managing Cookies</h3>
            <p>
              You can control and manage cookies through your browser settings. Most browsers allow you to refuse or delete cookies. Please note that disabling cookies may affect the functionality of certain parts of the Site. For more information on managing cookies, visit your browser&rsquo;s help documentation.
            </p>

            <h3 className="text-lg font-display font-medium text-foreground">8.3 Do Not Track</h3>
            <p>
              Some browsers offer a &ldquo;Do Not Track&rdquo; (&ldquo;DNT&rdquo;) signal. There is currently no industry standard for recognizing or honouring DNT signals. At this time, we do not respond to DNT signals. If a standard is established in the future, we will revisit this practice.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 9. YOUR RIGHTS */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">9. Your Privacy Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information under applicable data protection laws, including the GDPR, UK GDPR, NDPR, CCPA/CPRA, and other applicable legislation.
            </p>

            <h3 className="text-lg font-display font-medium text-foreground">9.1 Rights Under GDPR, UK GDPR &amp; NDPR</h3>
            <p>If you are located in the EEA, UK, or Nigeria, you have the following rights:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Right of Access:</strong> You have the right to request a copy of the personal data we hold about you.</li>
              <li><strong>Right to Rectification:</strong> You have the right to request correction of inaccurate or incomplete personal data.</li>
              <li><strong>Right to Erasure (&ldquo;Right to Be Forgotten&rdquo;):</strong> You have the right to request deletion of your personal data in certain circumstances, such as when the data is no longer necessary for the purpose it was collected.</li>
              <li><strong>Right to Restriction of Processing:</strong> You have the right to request that we restrict the processing of your personal data in certain circumstances.</li>
              <li><strong>Right to Data Portability:</strong> You have the right to receive your personal data in a structured, commonly used, and machine-readable format and to transmit that data to another controller.</li>
              <li><strong>Right to Object:</strong> You have the right to object to the processing of your personal data based on legitimate interests or for direct marketing purposes.</li>
              <li><strong>Right to Withdraw Consent:</strong> Where processing is based on consent, you have the right to withdraw your consent at any time without affecting the lawfulness of processing carried out prior to withdrawal.</li>
              <li><strong>Right to Lodge a Complaint:</strong> You have the right to lodge a complaint with a supervisory authority. In Nigeria, this is the National Information Technology Development Agency (NITDA).</li>
            </ul>

            <h3 className="text-lg font-display font-medium text-foreground">9.2 Rights Under CCPA/CPRA (California Residents)</h3>
            <p>If you are a California resident, you have the following rights under the California Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA):</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Right to Know:</strong> You have the right to request information about the categories and specific pieces of personal information we have collected, the categories of sources, the business purposes for collection, and the categories of third parties with whom we share personal information.</li>
              <li><strong>Right to Delete:</strong> You have the right to request deletion of your personal information, subject to certain exceptions.</li>
              <li><strong>Right to Correct:</strong> You have the right to request correction of inaccurate personal information.</li>
              <li><strong>Right to Opt-Out of Sale/Sharing:</strong> We do not sell or share your personal information for cross-context behavioral advertising. If this practice changes, we will provide a &ldquo;Do Not Sell or Share My Personal Information&rdquo; link.</li>
              <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising any of your privacy rights.</li>
            </ul>

            <h3 className="text-lg font-display font-medium text-foreground">9.3 Exercising Your Rights</h3>
            <p>
              To exercise any of the above rights, please contact us using the information provided in Section 14 below. We will respond to your request within the timeframe required by applicable law (typically 30 days for GDPR/NDPR and 45 days for CCPA/CPRA). We may need to verify your identity before processing your request.
            </p>
            <p>
              If you have authorized an agent to submit a request on your behalf, we may require the agent to demonstrate that they have been validly authorized to act on your behalf.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 10. INTERNATIONAL DATA TRANSFERS */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">10. International Data Transfers</h2>
            <p>
              CiroStack operates primarily from Nigeria and may process data in, or transfer data to, other countries where our service providers are located. If you are located outside Nigeria, please be aware that your information may be transferred to, stored, and processed in Nigeria or other jurisdictions that may have different data protection laws than your country of residence.
            </p>
            <p>
              Where we transfer personal data from the EEA or UK to a country that has not been deemed to provide an adequate level of data protection, we will implement appropriate safeguards as required by applicable law, such as:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Standard Contractual Clauses (SCCs) approved by the European Commission or the UK Information Commissioner&rsquo;s Office</li>
              <li>Binding Corporate Rules (where applicable)</li>
              <li>Your explicit consent to the transfer, after being informed of the possible risks</li>
            </ul>
            <p>
              You may request a copy of the safeguards in place by contacting us using the information in Section 14.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 11. CHILDREN'S PRIVACY */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">11. Children&rsquo;s Privacy</h2>
            <p>
              Our Site and Services are not directed to individuals under the age of sixteen (16), or under the age of thirteen (13) in jurisdictions where that threshold applies (such as the United States under COPPA). We do not knowingly collect personal information from children.
            </p>
            <p>
              If we become aware that we have collected personal information from a child without appropriate parental consent, we will take steps to delete such information promptly. If you believe that we have inadvertently collected information from a child, please contact us immediately using the information in Section 14.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 12. THIRD-PARTY LINKS & SERVICES */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">12. Third-Party Links &amp; Services</h2>
            <p>
              Our Site may contain links to third-party websites, services, or applications (e.g., social media profiles, partner websites, payment platforms). This Privacy Policy does not apply to those third-party services. We encourage you to read the privacy policies of any third-party services you visit or use.
            </p>
            <p>
              We are not responsible for the privacy practices, content, or security of any third-party websites or services linked from our Site. The inclusion of a link does not imply our endorsement of the linked site.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 13. CHANGES TO THIS POLICY */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">13. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or for other operational, legal, or regulatory reasons. When we make material changes, we will:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Update the &ldquo;Last Updated&rdquo; date at the top of this Policy</li>
              <li>Post the updated Policy on the Site</li>
              <li>Where required by law or where changes are significant, provide additional notice (e.g., a prominent notice on the Site or an email notification)</li>
            </ul>
            <p>
              We encourage you to review this Policy periodically. Your continued use of the Site or Services after the posting of changes constitutes your acceptance of the updated Policy. If you do not agree with the changes, you should stop using the Site and contact us to request deletion of your data.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 14. CONTACT INFORMATION */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">14. Contact Information &amp; Data Controller</h2>
            <p>
              CiroStack is the data controller responsible for your personal information. For any questions, concerns, or requests regarding this Privacy Policy or the handling of your personal data, please contact us at:
            </p>
            <div className="bg-muted/50 rounded-lg p-4 space-y-1">
              <p className="font-semibold text-foreground">CiroStack - Data Protection</p>
              <p>Jessy Onah, Founder &amp; Data Controller</p>
              <p>Email: <a href="mailto:contact@cirostack.com" className="text-primary hover:underline">contact@cirostack.com</a></p>
              <p>Website: <a href="https://cirostack.com" className="text-primary hover:underline">cirostack.com</a></p>
            </div>
            <p>
              We will endeavour to respond to all legitimate requests within thirty (30) days. In certain circumstances, it may take us longer if your request is particularly complex or you have made multiple requests, in which case we will notify you and keep you updated on progress.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 15. SUPPLEMENTAL NOTICE FOR SPECIFIC JURISDICTIONS */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">15. Supplemental Notices for Specific Jurisdictions</h2>

            <h3 className="text-lg font-display font-medium text-foreground">15.1 Nigeria (NDPR/NDPA)</h3>
            <p>
              This Policy complies with the Nigeria Data Protection Regulation (NDPR) 2019 and the Nigeria Data Protection Act (NDPA) 2023. As a data controller, CiroStack processes personal data in accordance with the principles of lawfulness, fairness, transparency, purpose limitation, data minimization, accuracy, storage limitation, integrity, confidentiality, and accountability. Nigerian data subjects may exercise their rights under the NDPR/NDPA by contacting us at the details above or by filing a complaint with NITDA.
            </p>

            <h3 className="text-lg font-display font-medium text-foreground">15.2 European Economic Area &amp; United Kingdom</h3>
            <p>
              If you are in the EEA or UK, you have the right to lodge a complaint with your local data protection supervisory authority if you believe we have not complied with applicable data protection laws. A list of EEA supervisory authorities is available at <span className="text-primary">ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm</span>. For the UK, you may contact the Information Commissioner&rsquo;s Office (ICO) at <span className="text-primary">ico.org.uk</span>.
            </p>

            <h3 className="text-lg font-display font-medium text-foreground">15.3 California, USA</h3>
            <p>
              Under the CCPA/CPRA, California residents are entitled to the disclosures set forth in Section 9.2. In the preceding twelve (12) months, we have collected the categories of personal information described in Section 2 for the business purposes described in Section 3. We have not sold personal information. For the &ldquo;right to know&rdquo; or &ldquo;right to delete,&rdquo; contact us at the details in Section 14.
            </p>

            <h3 className="text-lg font-display font-medium text-foreground">15.4 Other Jurisdictions</h3>
            <p>
              If you are located in a jurisdiction with specific data protection requirements not addressed above (e.g., Brazil&rsquo;s LGPD, South Africa&rsquo;s POPIA, Canada&rsquo;s PIPEDA), we will comply with the applicable local requirements to the extent they apply to our processing of your data. Please contact us if you have jurisdiction-specific questions or requests.
            </p>
          </div>

        </div>
      </div>
    </section>
  </Layout>
);

export default Privacy;
