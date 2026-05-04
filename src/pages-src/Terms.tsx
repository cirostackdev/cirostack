"use client";

import { FileText } from "lucide-react";
import Layout from "@/components/Layout";
import { SEO } from "@/components/SEO";
import PageHero from "@/components/PageHero";
import heroGeneric from "@/assets/hero-generic.jpg";

const Terms = () => (
  <Layout>
    <SEO
      title="Terms of Service"
      description="The terms and conditions that govern the use of CiroStack's website and software development services."
      url="/terms"
    />
    <PageHero
      icon={FileText}
      title="Terms of Service"
      description="The terms and conditions that govern the use of our website and services."
      image={heroGeneric}
      ctaText="Contact Us"
      ctaLink="/contact"
    />
    <section className="section-padding">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <p className="text-sm">Effective Date: May 4, 2026 &nbsp;|&nbsp; Last Updated: May 4, 2026</p>

          {/* ------------------------------------------------------------------ */}
          {/* 1. INTRODUCTION & ACCEPTANCE */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">1. Introduction &amp; Acceptance of Terms</h2>
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;Client,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo;) and <strong>CiroStack</strong> (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), a software development agency operated by Jessy Onah.
            </p>
            <p>
              By accessing or using our website at <a href="https://cirostack.com" className="text-primary hover:underline">cirostack.com</a> (the &ldquo;Site&rdquo;) or engaging us for any services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>, which is incorporated herein by reference.
            </p>
            <p>
              If you are entering into these Terms on behalf of a company or other legal entity, you represent that you have the authority to bind such entity to these Terms. If you do not agree to these Terms, you must not access the Site or use our services.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 2. DEFINITIONS */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">2. Definitions</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>&ldquo;Services&rdquo;</strong> means the software development, design, consulting, maintenance, and related professional services provided by CiroStack, including but not limited to: custom website design and development, web and mobile application development, AI automation solutions, UI/UX design, cloud consulting, software maintenance, and technical support.</li>
              <li><strong>&ldquo;Project Agreement&rdquo;</strong> (also referred to as a &ldquo;Statement of Work&rdquo; or &ldquo;SOW&rdquo;) means a written document executed by both parties that specifies the scope, deliverables, timeline, milestones, pricing, and other terms particular to a specific engagement.</li>
              <li><strong>&ldquo;Deliverables&rdquo;</strong> means all work product, including source code, designs, documentation, and other materials created by CiroStack in the course of performing the Services under a Project Agreement.</li>
              <li><strong>&ldquo;Confidential Information&rdquo;</strong> means any non-public information disclosed by either party to the other, whether in writing, orally, or by inspection, including but not limited to business plans, technical data, trade secrets, customer lists, pricing, and financial information.</li>
              <li><strong>&ldquo;Intellectual Property&rdquo;</strong> means all patents, copyrights, trademarks, trade secrets, and other intellectual property rights in any jurisdiction.</li>
            </ul>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 3. SERVICES */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">3. Description of Services</h2>
            <p>
              CiroStack provides professional software development services across five service phases: <strong>Ideate</strong>, <strong>Build</strong>, <strong>Improve</strong>, <strong>Operate</strong>, and <strong>Scale</strong>. Our services include, but are not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Custom website design and development</li>
              <li>Web application development</li>
              <li>Mobile application development (iOS and Android)</li>
              <li>AI and machine learning automation solutions</li>
              <li>UI/UX design and research</li>
              <li>Cloud infrastructure consulting and deployment</li>
              <li>Software maintenance, support, and managed operations</li>
              <li>Technical consulting and architecture review</li>
              <li>Quality assurance and testing</li>
            </ul>
            <p>
              The specific scope, deliverables, and terms for each engagement are defined in individual Project Agreements. These Terms apply to all Services unless expressly modified in a signed Project Agreement, in which case the Project Agreement shall prevail to the extent of the conflict.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 4. PROJECT AGREEMENTS */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">4. Project Agreements &amp; Scope of Work</h2>
            <p>
              Each project is governed by a separate Project Agreement that must be agreed upon in writing (including via email or electronic signature) by both parties before work commences. Each Project Agreement shall include, at minimum:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>A description of the Services to be performed</li>
              <li>Detailed scope and deliverables</li>
              <li>Project timeline and milestones</li>
              <li>Pricing and payment schedule</li>
              <li>Acceptance criteria for deliverables</li>
              <li>Any special terms or conditions</li>
            </ul>
            <p>
              <strong>Change Requests:</strong> Any changes to the scope of work after a Project Agreement is signed must be documented in a written change order signed by both parties. Change orders may affect the timeline, pricing, or both. CiroStack is not obligated to perform work outside the agreed scope without a signed change order.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 5. PRICING & PAYMENT */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">5. Pricing &amp; Payment Terms</h2>
            <p>
              <strong>5.1 Fixed-Price Model:</strong> Unless otherwise specified in a Project Agreement, all engagements are fixed-price. The total project fee is agreed upon in the Project Agreement and covers all work within the defined scope. There are no hourly charges or surprise invoices for in-scope work.
            </p>
            <p>
              <strong>5.2 Payment Schedule:</strong> Payment terms are specified in each Project Agreement. Typical payment schedules include an upfront deposit (commonly 30&ndash;50% of the total project fee) with milestone-based payments for the remainder. Specific percentages and milestones are defined per project.
            </p>
            <p>
              <strong>5.3 Invoicing:</strong> CiroStack will issue invoices in accordance with the payment schedule set forth in the applicable Project Agreement. All invoices are due and payable within fourteen (14) days of the invoice date, unless otherwise agreed in writing.
            </p>
            <p>
              <strong>5.4 Late Payments:</strong> Payments not received within fourteen (14) days of the due date shall incur a late fee of 1.5% per month (or the maximum rate permitted by applicable law, whichever is lower) on the outstanding balance. CiroStack reserves the right to suspend work on any project for which payment is overdue by more than thirty (30) days.
            </p>
            <p>
              <strong>5.5 Taxes:</strong> All fees are exclusive of applicable taxes. The Client is responsible for all sales, use, VAT, withholding, or other taxes imposed by any governmental authority on the transactions contemplated by these Terms, excluding taxes based on CiroStack&rsquo;s income.
            </p>
            <p>
              <strong>5.6 Refunds:</strong> Deposit payments are non-refundable once work has commenced, except as expressly provided in the applicable Project Agreement or as required by law. In the event of project cancellation by the Client after work has begun, CiroStack shall be entitled to retain compensation for all work completed up to the date of cancellation.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 6. INTELLECTUAL PROPERTY */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">6. Intellectual Property Rights</h2>
            <p>
              <strong>6.1 Assignment of Custom Work:</strong> Upon receipt of full and final payment for a project, CiroStack assigns to the Client all right, title, and interest in and to the Deliverables created specifically for that project, including all Intellectual Property rights therein. This assignment is effective only upon full payment.
            </p>
            <p>
              <strong>6.2 Pre-Existing Materials:</strong> CiroStack retains all rights to any pre-existing code, libraries, frameworks, tools, methodologies, and know-how (&ldquo;Pre-Existing Materials&rdquo;) that are used in or incorporated into the Deliverables. The Client is granted a perpetual, non-exclusive, royalty-free, worldwide license to use such Pre-Existing Materials solely as incorporated in the Deliverables.
            </p>
            <p>
              <strong>6.3 Open-Source Components:</strong> The Deliverables may incorporate open-source software components, which are subject to their respective open-source licenses. CiroStack will identify any open-source components included in the Deliverables upon request. The Client agrees to comply with all applicable open-source license terms.
            </p>
            <p>
              <strong>6.4 Third-Party Materials:</strong> Where the Deliverables include third-party software, fonts, images, APIs, or other licensed materials, the Client&rsquo;s use of such materials is subject to the applicable third-party license terms. CiroStack will use commercially reasonable efforts to notify the Client of any third-party license requirements.
            </p>
            <p>
              <strong>6.5 Portfolio &amp; Reference Rights:</strong> CiroStack retains the right to display and reference the Deliverables (including screenshots, descriptions, and general project information) in its portfolio, case studies, marketing materials, and website for promotional purposes, unless the Client provides written notice to the contrary prior to the commencement of the project.
            </p>
            <p>
              <strong>6.6 Client Materials:</strong> The Client retains all ownership rights to any materials, data, content, trademarks, and other assets provided to CiroStack for use in the project (&ldquo;Client Materials&rdquo;). The Client grants CiroStack a limited, non-exclusive license to use the Client Materials solely for the purpose of performing the Services.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 7. CLIENT RESPONSIBILITIES */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">7. Client Responsibilities</h2>
            <p>The Client agrees to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide timely access to all information, materials, systems, credentials, and resources reasonably necessary for CiroStack to perform the Services.</li>
              <li>Designate a primary point of contact who has authority to make decisions and provide approvals on behalf of the Client.</li>
              <li>Review and provide feedback on deliverables within the timeframes specified in the Project Agreement. Failure to respond within the agreed timeframe may result in deemed acceptance of the deliverable and/or project delays.</li>
              <li>Ensure that all Client Materials provided to CiroStack do not infringe upon the intellectual property rights, privacy rights, or other rights of any third party.</li>
              <li>Make payments in accordance with the agreed payment schedule.</li>
              <li>Obtain and maintain all necessary licenses, permissions, and consents required for the operation of the Deliverables in the Client&rsquo;s business environment.</li>
            </ul>
            <p>
              Delays caused by the Client&rsquo;s failure to fulfil these responsibilities may result in corresponding extensions to project timelines and, where applicable, additional charges as documented in a change order.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 8. ACCEPTANCE & DELIVERY */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">8. Delivery &amp; Acceptance</h2>
            <p>
              <strong>8.1 Delivery:</strong> CiroStack will deliver the Deliverables in accordance with the timeline and milestones set forth in the applicable Project Agreement. Delivery timelines are estimates unless expressly stated as firm deadlines.
            </p>
            <p>
              <strong>8.2 Acceptance Period:</strong> Upon delivery of each milestone or final deliverable, the Client shall have a review period of seven (7) business days (or such other period as specified in the Project Agreement) to review the deliverable and either accept it or provide written notice of specific deficiencies (&ldquo;Acceptance Period&rdquo;).
            </p>
            <p>
              <strong>8.3 Deemed Acceptance:</strong> If the Client does not provide written notice of deficiencies within the Acceptance Period, the deliverable shall be deemed accepted.
            </p>
            <p>
              <strong>8.4 Deficiency Correction:</strong> If the Client identifies deficiencies within the Acceptance Period, CiroStack will use commercially reasonable efforts to correct such deficiencies at no additional charge, provided the deficiencies relate to non-conformance with the specifications set forth in the Project Agreement.
            </p>
            <p>
              <strong>8.5 Revision Rounds:</strong> Unless otherwise specified in the Project Agreement, each milestone includes up to two (2) rounds of revisions for design deliverables and one (1) round of bug fixes for development deliverables. Additional revision rounds may be subject to change order fees.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 9. CONFIDENTIALITY */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">9. Confidentiality</h2>
            <p>
              <strong>9.1 Obligations:</strong> Each party agrees to hold the other party&rsquo;s Confidential Information in strict confidence and not to disclose such information to any third party except as necessary to perform its obligations under these Terms, and only to employees, contractors, or agents who are bound by confidentiality obligations at least as protective as those set forth herein.
            </p>
            <p>
              <strong>9.2 Exceptions:</strong> Confidential Information does not include information that: (a) is or becomes publicly available through no fault of the receiving party; (b) was known to the receiving party prior to disclosure; (c) is independently developed by the receiving party without use of or reference to the Confidential Information; or (d) is rightfully obtained from a third party without restriction on disclosure.
            </p>
            <p>
              <strong>9.3 Required Disclosure:</strong> A receiving party may disclose Confidential Information to the extent required by law, regulation, or court order, provided that the receiving party gives the disclosing party prompt written notice (where legally permitted) to allow the disclosing party to seek a protective order.
            </p>
            <p>
              <strong>9.4 Duration:</strong> The confidentiality obligations under this section shall survive the termination or expiration of these Terms for a period of three (3) years, except with respect to trade secrets, which shall be protected for as long as they remain trade secrets under applicable law.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 10. WARRANTIES & DISCLAIMERS */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">10. Warranties &amp; Disclaimers</h2>
            <p>
              <strong>10.1 CiroStack Warranties:</strong> CiroStack warrants that: (a) the Services will be performed in a professional and workmanlike manner consistent with generally accepted industry standards; (b) the Deliverables will substantially conform to the specifications set forth in the applicable Project Agreement for a period of thirty (30) days following acceptance (&ldquo;Warranty Period&rdquo;); and (c) to CiroStack&rsquo;s knowledge, the Deliverables will not infringe upon the intellectual property rights of any third party.
            </p>
            <p>
              <strong>10.2 Warranty Remedy:</strong> During the Warranty Period, CiroStack will correct any material defects in the Deliverables at no additional charge, provided the Client reports such defects in writing.
            </p>
            <p>
              <strong>10.3 Client Warranties:</strong> The Client warrants that: (a) it has the authority to enter into these Terms; (b) the Client Materials do not infringe upon the rights of any third party; and (c) any information provided to CiroStack is accurate and complete.
            </p>
            <p>
              <strong>10.4 Disclaimer:</strong> EXCEPT AS EXPRESSLY SET FORTH IN THIS SECTION, THE SERVICES AND DELIVERABLES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE.&rdquo; CIROSTACK DISCLAIMS ALL OTHER WARRANTIES, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. CIROSTACK DOES NOT WARRANT THAT THE DELIVERABLES WILL BE ERROR-FREE, UNINTERRUPTED, OR FREE OF HARMFUL COMPONENTS.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 11. LIMITATION OF LIABILITY */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">11. Limitation of Liability</h2>
            <p>
              <strong>11.1 Exclusion of Consequential Damages:</strong> TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL EITHER PARTY BE LIABLE TO THE OTHER FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, REVENUE, GOODWILL, DATA, OR BUSINESS OPPORTUNITIES, ARISING OUT OF OR RELATED TO THESE TERMS, REGARDLESS OF THE THEORY OF LIABILITY (CONTRACT, TORT, STRICT LIABILITY, OR OTHERWISE), EVEN IF THE PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p>
              <strong>11.2 Cap on Liability:</strong> TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE TOTAL CUMULATIVE LIABILITY OF CIROSTACK FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS OR ANY PROJECT AGREEMENT SHALL NOT EXCEED THE TOTAL FEES ACTUALLY PAID BY THE CLIENT TO CIROSTACK UNDER THE APPLICABLE PROJECT AGREEMENT DURING THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM.
            </p>
            <p>
              <strong>11.3 Exceptions:</strong> The limitations in this section shall not apply to: (a) either party&rsquo;s breach of confidentiality obligations; (b) either party&rsquo;s indemnification obligations; (c) CiroStack&rsquo;s IP infringement; or (d) liability that cannot be limited or excluded under applicable law.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 12. INDEMNIFICATION */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">12. Indemnification</h2>
            <p>
              <strong>12.1 By CiroStack:</strong> CiroStack shall indemnify, defend, and hold harmless the Client from and against any third-party claims, damages, losses, and expenses (including reasonable legal fees) arising from: (a) CiroStack&rsquo;s breach of these Terms; or (b) any claim that the Deliverables (excluding Client Materials and third-party components) infringe upon the intellectual property rights of a third party.
            </p>
            <p>
              <strong>12.2 By Client:</strong> The Client shall indemnify, defend, and hold harmless CiroStack from and against any third-party claims, damages, losses, and expenses (including reasonable legal fees) arising from: (a) the Client&rsquo;s breach of these Terms; (b) any claim that the Client Materials infringe upon the rights of a third party; (c) the Client&rsquo;s use of the Deliverables in a manner not contemplated by the Project Agreement; or (d) the Client&rsquo;s violation of any applicable law or regulation.
            </p>
            <p>
              <strong>12.3 Procedure:</strong> The indemnified party shall promptly notify the indemnifying party of any claim, cooperate in the defence of the claim, and allow the indemnifying party reasonable control over the defence and settlement, provided that no settlement shall require the indemnified party to admit liability or pay money without its prior written consent.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 13. TERMINATION */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">13. Termination</h2>
            <p>
              <strong>13.1 Termination for Convenience:</strong> Either party may terminate a Project Agreement by providing thirty (30) days&rsquo; written notice to the other party. In such event, the Client shall pay CiroStack for all Services rendered and expenses incurred up to the effective date of termination.
            </p>
            <p>
              <strong>13.2 Termination for Cause:</strong> Either party may terminate these Terms or any Project Agreement immediately upon written notice if the other party: (a) commits a material breach and fails to cure such breach within fifteen (15) days of receiving written notice; (b) becomes insolvent, files for bankruptcy, or ceases to operate in the ordinary course of business; or (c) engages in conduct that is unlawful or fraudulent.
            </p>
            <p>
              <strong>13.3 Effect of Termination:</strong> Upon termination: (a) CiroStack shall deliver to the Client all completed and in-progress Deliverables for which payment has been received; (b) the Client shall pay all outstanding fees for work completed through the termination date; (c) each party shall return or destroy the other party&rsquo;s Confidential Information; and (d) Sections 6, 9, 10, 11, 12, 14, and 17 shall survive termination.
            </p>
            <p>
              <strong>13.4 IP on Termination:</strong> Intellectual property rights in Deliverables shall transfer to the Client only for work that has been fully paid for as of the termination date. CiroStack retains all rights to unpaid Deliverables until full payment is received.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 14. DISPUTE RESOLUTION */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">14. Dispute Resolution</h2>
            <p>
              <strong>14.1 Negotiation:</strong> In the event of any dispute, controversy, or claim arising out of or relating to these Terms, the parties shall first attempt to resolve the dispute through good-faith negotiation. Either party may initiate negotiations by providing written notice to the other party describing the dispute.
            </p>
            <p>
              <strong>14.2 Mediation:</strong> If the dispute is not resolved through negotiation within thirty (30) days, either party may refer the dispute to mediation administered by a mutually agreed-upon mediator. The costs of mediation shall be shared equally by both parties.
            </p>
            <p>
              <strong>14.3 Arbitration:</strong> If mediation is unsuccessful within sixty (60) days, or if the parties cannot agree on a mediator, either party may submit the dispute to binding arbitration. The arbitration shall be conducted by a single arbitrator in accordance with the rules of a recognized arbitration institution agreed upon by the parties. The arbitrator&rsquo;s decision shall be final and binding and may be entered as a judgment in any court of competent jurisdiction.
            </p>
            <p>
              <strong>14.4 Injunctive Relief:</strong> Nothing in this section shall prevent either party from seeking injunctive or other equitable relief in a court of competent jurisdiction to prevent irreparable harm, including but not limited to breaches of confidentiality or intellectual property rights.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 15. FORCE MAJEURE */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">15. Force Majeure</h2>
            <p>
              Neither party shall be liable for any failure or delay in performing its obligations under these Terms (other than payment obligations) to the extent that such failure or delay results from circumstances beyond the party&rsquo;s reasonable control, including but not limited to: acts of God, natural disasters, pandemic or epidemic, war, terrorism, civil unrest, government actions or orders, strikes or labour disputes, power or internet outages, cyberattacks, or failures of third-party service providers.
            </p>
            <p>
              The affected party shall give prompt written notice to the other party and use commercially reasonable efforts to mitigate the impact of the force majeure event. If the force majeure event continues for more than sixty (60) days, either party may terminate the affected Project Agreement without liability.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 16. USE OF WEBSITE */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">16. Website Use</h2>
            <p>
              <strong>16.1 Permitted Use:</strong> The Site is provided for informational purposes and to facilitate engagement with CiroStack&rsquo;s Services. You may browse, download, and print content from the Site for your personal, non-commercial use, provided you do not modify or delete any copyright, trademark, or other proprietary notices.
            </p>
            <p>
              <strong>16.2 Prohibited Conduct:</strong> You agree not to: (a) use the Site for any unlawful purpose; (b) attempt to gain unauthorized access to any portion of the Site or any systems or networks connected to the Site; (c) use any automated means (bots, scrapers, crawlers) to access, collect, or extract data from the Site except with our prior written consent or as permitted by our robots.txt file; (d) transmit any viruses, malware, or other harmful code; (e) interfere with or disrupt the Site&rsquo;s operation or the servers or networks hosting the Site; or (f) impersonate any person or entity.
            </p>
            <p>
              <strong>16.3 Availability:</strong> We strive to keep the Site available at all times but do not guarantee uninterrupted access. The Site may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control. We shall not be liable for any loss or damage arising from Site unavailability.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 17. GOVERNING LAW */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">17. Governing Law &amp; Jurisdiction</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of laws principles. Subject to the dispute resolution provisions in Section 14, the parties submit to the exclusive jurisdiction of the courts located in Lagos, Nigeria for any disputes arising out of or relating to these Terms that are not resolved through arbitration.
            </p>
            <p>
              For Clients located in the European Union, nothing in these Terms affects your rights under mandatory consumer protection laws of your country of residence.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 18. INDEPENDENT CONTRACTOR */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">18. Independent Contractor</h2>
            <p>
              CiroStack is an independent contractor and nothing in these Terms shall be construed to create a partnership, joint venture, agency, or employment relationship between CiroStack and the Client. Neither party has the authority to bind the other or to incur any obligation on the other&rsquo;s behalf.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 19. NON-SOLICITATION */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">19. Non-Solicitation</h2>
            <p>
              During the term of any Project Agreement and for a period of twelve (12) months following its termination or expiration, neither party shall directly solicit or hire any employee or contractor of the other party who was involved in the performance of the Services, without the other party&rsquo;s prior written consent. This restriction does not apply to general employment advertisements or unsolicited applications.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 20. GENERAL PROVISIONS */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">20. General Provisions</h2>
            <p>
              <strong>20.1 Entire Agreement:</strong> These Terms, together with the Privacy Policy and any executed Project Agreements, constitute the entire agreement between the parties with respect to the subject matter hereof and supersede all prior or contemporaneous communications, proposals, and agreements, whether oral or written.
            </p>
            <p>
              <strong>20.2 Severability:</strong> If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be modified to the minimum extent necessary to make it valid and enforceable, or if modification is not possible, severed from these Terms. The remaining provisions shall continue in full force and effect.
            </p>
            <p>
              <strong>20.3 Waiver:</strong> The failure of either party to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision. A waiver of any term shall be effective only if in writing and signed by the waiving party.
            </p>
            <p>
              <strong>20.4 Assignment:</strong> The Client may not assign or transfer these Terms or any rights hereunder without CiroStack&rsquo;s prior written consent. CiroStack may assign these Terms to an affiliate or in connection with a merger, acquisition, or sale of all or substantially all of its assets, provided the assignee assumes all obligations under these Terms.
            </p>
            <p>
              <strong>20.5 Notices:</strong> All notices required or permitted under these Terms shall be in writing and shall be deemed given when: (a) delivered personally; (b) sent by email with confirmed receipt; or (c) sent by registered or certified mail, return receipt requested, to the addresses specified in the applicable Project Agreement or to the contact information below.
            </p>
            <p>
              <strong>20.6 Headings:</strong> The section headings in these Terms are for convenience of reference only and shall not affect the interpretation of these Terms.
            </p>
            <p>
              <strong>20.7 Third-Party Rights:</strong> These Terms do not confer any rights or remedies upon any person or entity other than the parties hereto and their respective successors and permitted assigns.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 21. CHANGES TO TERMS */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">21. Changes to These Terms</h2>
            <p>
              CiroStack reserves the right to modify these Terms at any time. We will notify users of material changes by updating the &ldquo;Last Updated&rdquo; date at the top of this page and, where practicable, by providing notice through the Site. Changes take effect immediately upon posting unless otherwise stated. Your continued use of the Site or Services after such changes constitutes your acceptance of the revised Terms.
            </p>
            <p>
              For active Project Agreements, changes to these Terms shall not retroactively alter the terms of existing Project Agreements without the written consent of both parties.
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 22. CONTACT */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">22. Contact Information</h2>
            <p>For questions, concerns, or notices regarding these Terms, please contact us at:</p>
            <div className="bg-muted/50 rounded-lg p-4 space-y-1">
              <p className="font-semibold text-foreground">CiroStack</p>
              <p>Jessy Onah, Founder</p>
              <p>Email: <a href="mailto:contact@cirostack.com" className="text-primary hover:underline">contact@cirostack.com</a></p>
              <p>Website: <a href="https://cirostack.com" className="text-primary hover:underline">cirostack.com</a></p>
            </div>
          </div>

        </div>
      </div>
    </section>
  </Layout>
);

export default Terms;
