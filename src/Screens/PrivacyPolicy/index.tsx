import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import styles from './style';

const PrivacyPolicy = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.title}>Bell N Desk Privacy Policy</Text>
      <Text style={styles.date}>
        <Text style={styles.bold}>Effective:</Text> October 1, 2025
      </Text>

      <Text style={styles.p}>
        This Privacy Policy (“Privacy Policy”) explains our privacy practices
        for the activities described herein. Please read this Privacy Policy
        carefully to learn how we collect, use, share, and otherwise process
        information relating to individuals (“Personal Data”), and to learn
        about your rights and choices. This Privacy Policy is governed
        exclusively by the laws of the Republic of Panama, including Law 81 of
        2019 on Personal Data Protection and its implementing regulations (e.g.,
        Executive Decree No. 285 of 2021).
      </Text>

      <Text style={styles.p}>
        A reference to “Bell N Desk,” “we,” “us,” or the “Company” means Bell N
        Desk LLC and its relevant affiliates. The Services are operated by BBR
        Tek Inc., Panama City, Panama. All intellectual property in the Services
        is owned by BBR Tek Inc. and licensed to Bell N Desk LLC.
      </Text>

      {/* CONTENTS */}
      <Text style={styles.h2}>Contents</Text>
      {[
        '1. Responsible Entity',
        '2. Processing Activities Covered',
        '3. What Personal Data Do We Collect?',
        '4. What Device and Usage Data Do We Process?',
        '5. Purposes for Which We Process Personal Data',
        '6. Who Do We Share Personal Data With?',
        '7. International Transfer of Personal Data',
        '8. Children',
        '9. How Long Do We Keep Your Personal Data?',
        '10. Your Rights Relating to Your Personal Data',
        '11. How We Secure Your Personal Data',
        '12. Changes to This Privacy Policy',
        '13. Contact Us',
      ].map((item, i) => (
        <Text key={i} style={styles.listItem}>
          {'    ' + item}
        </Text>
      ))}

      {/* SECTION 1 */}
      <Text style={styles.h2}>1. Responsible Entity</Text>
      <Text style={styles.p}>
        Bell N Desk LLC is the controller of your Personal Data as described in
        this Privacy Policy, unless stated otherwise. Bell N Desk may also act
        as a data processor (encargado del tratamiento) on behalf of its
        customers. When acting as a processor, our customers are responsible for
        their own privacy practices.
      </Text>

      {/* SECTION 2 */}
      <Text style={styles.h2}>2. Processing Activities Covered</Text>
      <Text style={styles.p}>
        This Privacy Policy applies to the processing of Personal Data collected
        by us when you:
      </Text>
      <View style={styles.ul}>
        <Text style={styles.listItem}>
          • Visit our websites that display or link to this Privacy Policy;
        </Text>
        <Text style={styles.listItem}>
          • Visit our branded social media pages;
        </Text>
        <Text style={styles.listItem}>
          • Receive communications from us (including emails, calls, or texts);
        </Text>
        <Text style={styles.listItem}>
          • Use our software products, platforms, and services as an authorized
          user where we act as a controller;or
        </Text>
        <Text style={styles.listItem}>
          • Apply for employment opportunities with us
        </Text>
      </View>

      <Text style={styles.p}>
        Our websites and services may contain links to third-party websites.
        Those have their own privacy policies. Please review them separately.
      </Text>

      {/* SECTION 3 */}
      <Text style={styles.h2}>3. What Personal Data Do We Collect?</Text>
      <Text style={styles.p}>
        Depending on your interactions with us, we may collect identifiers,
        contact information, geolocation data, professional information, visual
        information, internet activity information, and inferences. For example:
      </Text>

      <View style={styles.ul}>
        <Text style={styles.listItem}>
          • Registration and support: name, company/school, address, phone,
          email/username, password;
        </Text>
        <Text style={styles.listItem}>
          • Interactions: device and usage information via
          cookies/pixels/beacons (see Section 4);
        </Text>
        <Text style={styles.listItem}>
          • Services usage: logs and telemetry associated with your account and
          device;
        </Text>
        <Text style={styles.listItem}>
          • Communications: call recordings (where permitted by law and with
          notice/consent as required);
        </Text>
        <Text style={styles.listItem}>
          • Voluntary submissions: forms, surveys, or feedback you provide.
        </Text>
      </View>
      <Text style={styles.p}>
        If you provide Personal Data about others, you represent you have
        authority and consent where required.
      </Text>

      {/* SECTION 4 */}
      <Text style={styles.h2}>
        4. What Device and Usage Data Do We Process?
      </Text>

      <Text style={styles.listItem}>
        1) Device and Usage Data We automatically collect certain information
        when you visit our websites or use our services, such as IP address,
        device identifiers, browser type, operating system, ISP or carrier,
        pages viewed, actions taken, referring URLs, date/time stamps, language
        preferences, and frequency of visits. We use this to secure and maintain
        the services, provide functionality, improve performance and user
        experience, review compliance, assess capacity, and detect/prevent
        fraud.
      </Text>
      <Text style={styles.listItem}>
        2) Cookies, Web Beacons and Other Tracking Technologies We use cookies
        and similar technologies to make our websites and services work
        properly, remember preferences, and measure usage. You can control
        cookies via your browser settings; disabling some cookies may affect
        site functionality. See our Cookie Policy for details.
      </Text>
      <Text style={styles.listItem}>3) Do-Not-Track Signals</Text>
      <Text style={styles.p}>
        We do not currently respond to Do Not Track (DNT) signals. Standards for
        DNT are not yet uniform across the industry
      </Text>

      {/* SECTION 5 */}
      <Text style={styles.h2}>
        5. Purposes for Which We Process Personal Data
      </Text>
      <Text style={styles.p}>
        We process Personal Data for: (a) providing and operating our websites,
        platforms, and services; (b) promoting the security and integrity of our
        services; (c) managing user registrations and accounts; (d) handling
        contact and support requests; (e) developing and improving our
        offerings; (f) assessing and improving user experience; (g) identifying
        customer opportunities; (h) training/quality (including call recordings
        where permitted); and (i) complying with legal obligations under
        Panamanian law.
      </Text>

      {/* SECTION 6 */}
      <Text style={styles.h2}>6. Who Do We Share Personal Data With?</Text>
      <Text style={styles.p}>
        We may share Personal Data with: (i) service providers who support our
        operations (hosting, support, analytics, communications, payments); (ii)
        professional advisers (lawyers, auditors, insurers) as needed; and (iii)
        third parties in connection with corporate transactions (merger,
        acquisition, reorganization), subject to Panamanian law. We may also
        share aggregated or de-identified data for legitimate business purposes.
      </Text>

      {/* SECTION 7 */}
      <Text style={styles.h2}>7. International Transfer of Personal Data</Text>
      <Text style={styles.p}>
        Your Personal Data may be transferred to and processed in countries
        outside Panama where our service providers operate. Where required by
        Panamanian law, we implement appropriate safeguards for cross-border
        transfers, such as contractual clauses, consent, or transfers to
        jurisdictions with comparable protection. By using the Services or
        providing information, you acknowledge such transfers as permitted by
        applicable law.
      </Text>

      {/* SECTION 8 */}
      <Text style={styles.h2}>8. Children</Text>
      <Text style={styles.p}>
        Our websites and services are not directed at children under 13, and we
        do not knowingly collect Personal Data from children under 13. If you
        believe a child has provided Personal Data, please contact us so we can
        delete it.
      </Text>

      {/* SECTION 9 */}
      <Text style={styles.h2}>9. How Long Do We Keep Your Personal Data?</Text>
      <Text style={styles.p}>
        We retain Personal Data as needed for the purposes described in this
        Policy and as required by law (including applicable statutes of
        limitation). We consider the amount, nature, and sensitivity of the
        data, the risk of harm, the purposes of processing, and legal
        requirements. When retention ends, we delete or anonymize the data; if
        full deletion is not technically feasible, we restrict processing.
      </Text>

      {/* SECTION 10 */}
      <Text style={styles.h2}>
        10. Your Rights Relating to Your Personal Data
      </Text>
      <Text style={styles.p}>
        1) Your Rights (Panama – Law 81/2019){'\n'}
        Under Panamanian law, you may have rights to: access; rectify/update;
        cancel/delete; oppose processing; and, where applicable, portability and
        information about processing. You may also withdraw consent where
        processing is based on consent, without affecting prior lawful
        processing.
      </Text>
      <Text style={styles.p}>
        2) Users in Other Jurisdictions{'\n'} Depending on where you reside, you
        may have additional rights under local laws. We will consider and
        respond to requests in accordance with applicable law.
      </Text>
      <Text style={styles.p}>
        3) How to Exercise Your Rights{'\n'} To exercise rights, contact us
        using the details in Section 13. We may need to verify your identity and
        request details necessary to process your request. We will respond
        within the timeframes established by Panamanian law.
      </Text>
      <Text style={styles.p}>
        4) Customer Data Processed as Processor{'\n'} Where we process Personal
        Data on behalf of a customer (as processor), please direct your request
        to that customer (the controller). If you contact us, please identify
        the relevant customer so we can notify them and assist in responding
        within a reasonable timeframe.
      </Text>

      {/* SECTION 11 */}
      <Text style={styles.h2}>11. How We Secure Your Personal Data</Text>
      <Text style={styles.p}>
        We implement technical and organizational measures designed to protect
        Personal Data, such as encryption in transit and at rest where
        appropriate, access controls, least-privilege practices, and
        confidentiality commitments. No method of transmission or storage is
        completely secure; we cannot guarantee absolute security.
      </Text>

      {/* SECTION 12 */}
      <Text style={styles.h2}>12. Changes to This Privacy Policy</Text>
      <Text style={styles.p}>
        We may update this Privacy Policy from time to time. If material changes
        occur, we may provide additional notice (e.g., by posting a notice in
        the Services or contacting you). Please review this Policy periodically
        for the latest information.
      </Text>

      {/* SECTION 13 */}
      <Text style={styles.h2}>13. Contact Us</Text>
      <Text style={styles.p}>
        If you have questions or wish to exercise your rights, contact us:
      </Text>
      <Text style={styles.p}>
        Bell N Desk LLC (Controller){'\n'}
        Operated by BBR Tek Inc.{'\n'}
        PH Oceania Business Plaza, Torre 1000, Piso 40, Oficina 40A{'\n'}
        Punta Pacifica, Panama City, Panama{'\n'}
        Email: principal@bellndesk.com
      </Text>
    </ScrollView>
  );
};

export default PrivacyPolicy;
