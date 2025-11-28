import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import styles from './style';

const H1 = ({ children }) => <Text style={styles.h1}>{children}</Text>;
const H2 = ({ children }) => <Text style={styles.h2}>{children}</Text>;
const H3 = ({ children }) => <Text style={styles.h3}>{children}</Text>;
const P = ({ children }) => <Text style={styles.p}>{children}</Text>;
const Strong = ({ children }) => <Text style={styles.strong}>{children}</Text>;
const UL = ({ children }) => <View style={styles.ul}>{children}</View>;
const BR = () => <Text>{'\n'}</Text>;
const LI = ({ children }) => (
  <View style={styles.liRow}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.li}>{children}</Text>
  </View>
);

// Note: Please check all points with web version

const TermsAndConditions = () => {
  return (
    <ScrollView style={styles.wrapper}>
      <View style={styles.container}>
        <H1>Bell N Desk Terms and Conditions</H1>
        <Text style={styles.dateText}>
          <Strong>Effective:</Strong> October 1, 2025
        </Text>

        <P>
          PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY. THESE TERMS AND
          CONDITIONS (“Agreement”) CONSTITUTE A LEGAL AGREEMENT BETWEEN YOU AND
          BELL N DESK LLC.
        </P>

        <P>
          SECTION 16 CONTAINS AN ARBITRATION AGREEMENT THAT, WITH LIMITED
          EXCEPTIONS, REQUIRES DISPUTES TO BE RESOLVED BY BINDING, INDIVIDUAL
          ARBITRATION AND WAIVES ANY RIGHT TO PURSUE CLAIMS IN COURT. PLEASE
          REVIEW SECTION 16 FOR DETAILS AND OPT-OUT INSTRUCTIONS.
        </P>

        {/* --------------------- SECTION 1 --------------------- */}
        <H2>1. Purpose</H2>
        <P>
          Bell N Desk LLC (“Bell N Desk,” “we,” “us,” or “our”) provides a
          platform for communities to share educational content and course
          materials (the “Services”). The Services are operated by BBR Tek Inc.,
          Panama City, Panama (“BBR Tek”). All intellectual property in the
          Services is owned by BBR Tek Inc. and licensed to Bell N Desk LLC. By
          using the Services, you agree to be bound by this Agreement. While we
          work to enforce these terms, we cannot guarantee other users’
          compliance and cannot accept liability for their failure to do so.
        </P>

        {/* --------------------- SECTION 2 --------------------- */}
        <H2>2. Eligibility</H2>
        <P>
          By accessing or using the Services, or indicating acceptance (e.g.,
          clicking a button), you represent that: (i) you have read, understand,
          and agree to this Agreement (including future changes posted through
          the Services); (ii) you are 13 or older; (iii) you have authority to
          enter this Agreement personally or for your organization; and (iv) you
          will comply with the laws of the Republic of Panama applicable to your
          use of the Services. If you do not agree, do not use the Services.
        </P>

        {/* --------------------- SECTION 3 --------------------- */}
        <H2>3. Access</H2>
        <H3>License</H3>
        <P>
          License. We grant you a revocable, conditional license to access/use
          the Services per this Agreement and may modify, suspend, or terminate
          access at any time.
        </P>

        <P>Members vs. Admins:</P>

        <UL>
          <LI>
            <Strong>Members:</Strong> For personal, non-commercial use
            only[cite: 19].
          </LI>
          <LI>
            <Strong>Creators/Admins:</Strong> You act for yourself or your
            organization and have the necessary rights to do so[cite: 20].
          </LI>
        </UL>

        <P>Non-transferable. Access rights aren’t transferable.</P>
        <P>
          Security. Keep your password confidential and notify us promptly of
          any breach.
        </P>

        {/* --------------------- SECTION 4 --------------------- */}
        <H2>4. Acceptable Use Policy</H2>
        <P>
          You agree that you will: use the Services only for lawful purposes and
          not send/store unlawful material; not cause nuisance, annoyance, or
          inconvenience; not use the Services or any content for unsolicited
          commercial solicitations to Users; not violate the publicity or
          privacy rights of others; not copy, reproduce, distribute, publicly
          display, or create derivative works from Service content except as
          expressly permitted; not create/compile any database, collection, or
          directory from Service content (except for personal, non-commercial
          use); provide accurate information to us; not damage, disable,
          overburden, or impair our servers/networks; not attempt unauthorized
          access; not deep-link, scrape, crawl, or use automated tools to
          access, copy, or monitor the Services; report errors, bugs,
          unauthorized access methods, or IP issues; not impersonate others, act
          without authorization, or create multiple accounts; ensure User
          Content does not solicit information from or exploit minors and
          complies with e‑advertising and consumer protection standards of
          Panama; ensure files are not excessively large (as we determine); and
          ensure your User Content and its use do not infringe third‑party
          rights and that you comply with third‑party licenses.
        </P>

        {/* --------------------- SECTION 5 --------------------- */}
        <H2>5. Information on our Services</H2>
        <P>
          We strive for accuracy but do not guarantee completeness, adequacy, or
          suitability and disclaim liability for errors/omissions. Any reliance
          is at your own risk. Third‑party links or contact details do not
          constitute endorsement, approval, or affiliation.
        </P>

        {/* --------------------- SECTION 6 --------------------- */}
        <H2>6. Payment Terms for Group Admins</H2>
        <P>
          On‑Time Payment. You authorize us (or our processors) to charge
          subscription and other applicable fees (“Subscription Fees”) in
          advance for each term. Fees are non‑refundable, begin on the first day
          of each term, and may change with 30 days’ email notice. Additional
          Services may carry additional fees. Failure to pay may lead to
          suspension/termination. Fees are in U.S. Dollars (USD), exclusive of
          taxes, which you must pay.
        </P>

        <P>
          Payment Methods. You agree to our Privacy Policy when providing
          payment details. We may use third‑party processors; their terms apply
          in addition to this Agreement.
        </P>

        <P>
          Subscription Term; Auto‑Renewal. Subscriptions renew automatically for
          successive terms (e.g., monthly/annual) unless canceled under these
          Terms.
        </P>
        <P>
          Cancellation. Either party may cancel at any time. Fees through the
          end of the current billing cycle remain payable; no prorated refunds
          unless expressly stated. On cancellation, Admin retains access through
          the end of the billing period; thereafter the group may be archived
          read‑only.
        </P>

        <P>How to Cancel:</P>
        <UL>
          <LI>In-app: Settings → Billing → Cancel Subscription</LI>
          <LI>Email: principal@bellndesk.com</LI>
        </UL>

        <P>
          If we believe you violated these Terms, we may terminate immediately
          without refund and pursue available remedies.
        </P>

        <P>
          Account Discrepancies. Email principal@bellndesk.com concerning
          billing questions. If unresolved within 15 business days, write to:
          BBR Tek Inc. (Operator of Bell N Desk) PH Oceania Business Plaza,
          Torre 1000, Piso 40, Oficina 40A Punta Pacifica, Panama City, Panama
          Disputes must be raised within 90 days of when reasonably
          discoverable.
        </P>

        <P>Admin/Member Transactions.</P>

        <UL>
          <LI>
            Transactions between Admins and Members are governed by the
            transaction terms between them. We facilitate the platform but are
            not a party to those contracts.
          </LI>
          <LI>Upon confirmation, Admin must perform (e.g., provide access).</LI>
        </UL>

        <P>Payouts to Admins.</P>

        <UL>
          <LI>
            Member payments are processed by third‑party providers (e.g., Stripe
            or equivalents). Admin earnings appear in the Admin account and
            become available for withdrawal once shown.
          </LI>
          <LI>
            Minimum payout thresholds may apply; earnings are in USD.Your bank
            may charge conversion/transfer fees.
          </LI>
          <LI>
            Chargebacks/refunds may be deducted from Admin earnings. We do not
            store payout-provider credentials except as required for direct
            transfers.
          </LI>
        </UL>

        <P>
          Withholding/Forfeiture. We may withhold or forfeit Admin earnings
          pending investigation or for serious/repeated breaches, suspected
          unlawful/fraudulent activity, or liens, and may set off losses.
        </P>

        {/* --------------------- SECTION 7 --------------------- */}
        <H2>7. Refunds and Cancellations (Panama Electronic Commerce Law)</H2>
        <P>
          All payments made to Bell N Desk are processed electronically through
          authorized third‑party platforms. Due to the digital and
          immediate‑access nature of the Services, all payments are final and
          non‑refundable once access to the platform or content has been
          granted. Refunds apply only to verified duplicate charges or
          exceptional cases at our discretion. We monitor availability but do
          not guarantee uninterrupted service, as parts of the platform depend
          on external providers and internet connectivity. Payment‑related
          inquiries must be submitted to principal@bellndesk.com. We may deny
          refund requests that do not meet these criteria. This policy aligns
          with the principles of the Electronic Commerce Law of the Republic of
          Panama (Law 51 of 2008) and related consumer protection standards.
          Subscriptions renew automatically unless canceled before the next
          billing cycle.
        </P>

        {/* --------------------- SECTION 8 --------------------- */}
        <H2>8. User Submissions and Content</H2>
        <P>
          Users and creators are solely responsible for all content they upload,
          share, transmit, or record through Bell N Desk. Bell N Desk and its
          affiliates assume no liability for opinions, educational materials,
          recommendations, or other expressions shared by users. We may suspend
          or remove content that violates law or our policies. License. You
          retain ownership of your content but grant Bell N Desk a perpetual,
          irrevocable, transferable, fully‑paid, royalty‑free, non‑exclusive,
          worldwide, sublicensable license to use, display, publish, modify,
          create derivative works of, distribute, perform, translate, and
          otherwise exploit such content to operate and improve the Services and
          our business, except as required by applicable law.
        </P>

        <P>
          Feedback. You grant us the same license for feedback/suggestions you
          submit.
        </P>

        {/* --------------------- SECTION 9 --------------------- */}
        <H2>9. Streaming and Live Sessions</H2>
        <P>
          Bell N Desk offers live activities, virtual classes, broadcasts,
          seminars, and interactive spaces (“Streams”), accessible to viewers
          and creators.
        </P>
        <UL>
          <LI>
            9.1 Content Responsibility. All content shared during a Stream is
            the sole responsibility of the user/creator who produces it. Bell N
            Desk is not liable for opinions, interpretations, comments, errors,
            or consequences derived from Stream content.
          </LI>
          <LI>
            9.2 Freedom of Expression and Boundaries. We support freedom of
            expression and cultural diversity. However, users must not produce
            or share material that: (a) incites violence, hatred,
            discrimination, harassment, or defamation; (b) promotes crimes,
            fraud, or any illegal activity; or (c) violates the dignity or
            rights of others.
          </LI>
          <LI>
            9.3 Reactions and Offenses. If a user disagrees with or is offended
            by content, the platform is not responsible for such perceptions or
            any moral, emotional, or reputational harm. Users may exit, report
            content, or use reporting tools.
          </LI>
          <LI>
            9.4 Moderation and Auditing. Bell N Desk may record, archive, and
            audit any live broadcast for security, compliance, or investigative
            purposes, and may remove, restrict, or suspend content, broadcasts,
            or accounts that violate these Terms without prior notice.
          </LI>
          <LI>
            9.5 Creator Authorization. By going live or sharing real‑time
            content, the user authorizes Bell N Desk to record and store such
            material on our servers or authorized providers and to use excerpts
            for technical support, internal training, or promotional purposes,
            subject to applicable law and our Privacy Policy.
          </LI>
          <LI>
            9.6 Liability Waiver. Users and creators release Bell N Desk, its
            directors, employees, affiliates, and partners from claims related
            to Stream content, including moral, emotional, or reputational
            damages; disputes between users or third parties; and
            misinterpretations, omissions, or consequences arising from
            expressions made during Streams.
          </LI>
        </UL>

        {/* --------------------- SECTION 10 --------------------- */}
        <H2>10. Good-Samaritan Content Policy & Complaint Procedures</H2>
        <P>
          We do not tolerate intellectual‑property infringement or unlawful
          material. If you believe your rights have been violated, notify us at
          principal@bellndesk.com with sufficient detail to locate and assess
          the material. We may investigate and remove content at any time, with
          or without notice, in our sole discretion.
        </P>

        {/* --------------------- SECTION 11 --------------------- */}
        <H2>11. Intellectual Property Ownership</H2>
        <P>
          All intellectual property in and to the Services (including software,
          features, designs, trademarks, content, and data compilations) is
          owned by BBR Tek Inc. and licensed to Bell N Desk LLC. This Agreement
          does not transfer ownership. Our names and logos are trademarks; no
          license is granted beyond what is necessary to use the Services.
        </P>

        {/* --------------------- SECTION 12 --------------------- */}
        <H2>12. Copyright Policy (Panama)</H2>
        <P>
          If you believe content infringes your rights under Panamanian law,
          contact principal@bellndesk.com with details sufficient to locate the
          material and substantiate your claim. If we remove material, we will
          notify the uploader. If the uploader provides a substantiated
          counter‑notice under Panamanian law, we may restore the content unless
          we receive notice of legal proceedings in Panama within a reasonable
          period.
        </P>

        {/* --------------------- SECTION 13 --------------------- */}
        <H2>13. Privacy and Data Protection</H2>
        <P>
          Bell N Desk complies with Panama’s Law 81 of 2019 on Personal Data
          Protection and, when applicable, GDPR and CCPA principles. Users may
          request access, correction, or deletion of their data by emailing
          principal@bellndesk.com. We may use anonymized data analytics to
          improve service quality and security, consistent with our Privacy
          Policy.
        </P>

        {/* --------------------- SECTION 14 --------------------- */}
        <H2>14. Third-Party Interactions</H2>
        <P>
          The Services may link to or display third‑party sites/ads. We do not
          control or endorse them and are not responsible for their content or
          policies. Use them at your own risk and review their terms and privacy
          policies.
        </P>

        {/* --------------------- SECTION 15 --------------------- */}
        <H2>15. Indemnification and Hold Harmless</H2>
        <P>
          You agree to indemnify, defend, and hold harmless Bell N Desk LLC, BBR
          Tek Inc., and their officers, directors, employees, agents, and
          affiliates from any losses, claims, damages, costs, and expenses
          (including reasonable attorneys’ fees) arising out of: (a) your User
          Content or Streams; (b) misuse of the Services; (c) violation of this
          Agreement; or (d) violation of law. Bell N Desk provides the Services
          “as is” without guarantees of specific outcomes. You release Bell N
          Desk, its directors, and affiliates from responsibility for losses,
          damages, or consequences resulting from use of the platform, including
          content generated by other users, to the fullest extent permitted by
          Panamanian law. This section survives termination.
        </P>

        {/* --------------------- SECTION 16 --------------------- */}
        <H2>16. Dispute Resolution (Arbitration – Panama Only)</H2>
        <P>
          Amicable Resolution. Before any formal arbitration, the parties will
          attempt an amicable resolution via digital communication within 30
          days after written notice to principal@bellndesk.com describing the
          claim. Notices sent to the user’s registered email shall have full
          legal validity for these purposes.
        </P>

        <P>
          Scope & Governing Law. Any dispute, controversy, or claim arising out
          of or relating to this Agreement, the Services, or your relationship
          with us shall be resolved exclusively by binding arbitration seated in
          Panama City, Republic of Panama, in accordance with the laws of the
          Republic of Panama.
        </P>

        <P>
          Rules, Institution, and Language. The arbitration shall be
          administered by the Centro de Conciliación y Arbitraje de Panamá
          (CeCAP), or another recognized Panamanian arbitral institution agreed
          by the parties, under its rules then in force. The language of the
          arbitration will be Spanish or English, as agreed by the parties.
        </P>

        <P>
          Tribunal Powers & Award. The tribunal shall have authority to
          determine its own jurisdiction and to grant any remedy available under
          Panamanian law. The award shall be final and binding and may be
          enforced by the competent courts of Panama.
        </P>
        <P>
          Individual Proceedings; No Aggregation. Claims must be brought
          individually and not as part of any collective, class, or
          representative proceeding. Consolidation or joinder requires the
          tribunal’s approval.
        </P>

        <P>
          Opt‑Out. You may opt out of this arbitration agreement by emailing
          principal@bellndesk.com within 30 days of first accepting this
          Agreement with your full name, address, account email (if any), and a
          clear statement that you opt out of arbitration. If you opt out,
          Section 17 applies.
        </P>

        <P>
          Costs. Arbitration costs and fees shall be allocated by the tribunal
          in accordance with Panamanian law and the applicable institutional
          rules. We may, at our discretion, advance certain administrative fees
          subject to later allocation by the tribunal.
        </P>

        {/* --------------------- SECTION 17 --------------------- */}
        <H2>17. Exclusive Venue (Panama Courts)</H2>
        <P>
          To the extent any dispute is permitted to be litigated in court (for
          example, following a valid arbitration opt‑out or where arbitration is
          not available), the matter shall be heard exclusively in the competent
          courts of Panama City, Republic of Panama. The parties irrevocably
          submit to such jurisdiction and venue.
        </P>

        {/* --------------------- SECTION 18 --------------------- */}
        <H2>18. Termination</H2>
        <P>
          We may modify/discontinue the Services or suspend/terminate your
          access for any reason, with or without notice. This Agreement survives
          termination to the extent necessary to give effect to surviving
          provisions.
        </P>

        {/* --------------------- SECTION 19 --------------------- */}
        <H2>19. General</H2>
        <P>
          No Partnership. No joint venture, partnership, employment, or agency
          relationship is created by this Agreement.
        </P>

        <P>
          Choice of Law. This Agreement is governed exclusively by the laws of
          the Republic of Panama, without regard to conflicts‑of‑law principles.
        </P>

        <P>
          Severability. If any provision is invalid, the remainder remains in
          force.
        </P>

        <P>
          Electronic Communications and Notices. You consent to receive
          electronic communications from us. Notices sent to your registered
          email have full legal validity.
        </P>

        <P>
          Entire Agreement. This is the complete agreement regarding the
          Services and supersedes prior agreements on the subject.
        </P>

        <P>
          Use of AI and Automated Tools. Bell N Desk may incorporate AI,
          automation, or recommendation algorithms to improve content delivery,
          moderation, and user experience. Users acknowledge that decisions,
          suggestions, or moderation actions made by automated systems are not
          personal judgments and cannot be construed as discrimination,
          defamation, or targeted action. Bell N Desk assumes no liability for
          perceptions, omissions, or interpretations derived from automated
          processing or AI outputs, consistent with applicable Panamanian law.
        </P>

        {/* --------------------- SECTION 20 --------------------- */}
        <H2>20. Contact Information</H2>
        <P>
          Bell N Desk LLC (Platform)
          <BR />
          BBR Tek Inc. (Operator & IP Owner)
          <BR />
          PH Oceania Business Plaza, Torre 1000, Piso 40, Oficina 40A
          <BR />
          Punta Pacifica, Panama City, Panama
          <BR />
          Email: principal@bellndesk.com
        </P>
      </View>
    </ScrollView>
  );
};

export default TermsAndConditions;
