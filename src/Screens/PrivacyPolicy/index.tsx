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
          • Visit our websites that link to this Policy
        </Text>
        <Text style={styles.listItem}>• Visit our social media pages</Text>
        <Text style={styles.listItem}>• Receive communications from us</Text>
        <Text style={styles.listItem}>• Use our software and services</Text>
        <Text style={styles.listItem}>• Apply for employment with us</Text>
      </View>

      <Text style={styles.p}>
        Our websites and services may contain links to third-party websites.
        Those have their own privacy policies.
      </Text>

      {/* SECTION 3 */}
      <Text style={styles.h2}>3. What Personal Data Do We Collect?</Text>
      <Text style={styles.p}>
        Depending on your interactions with us, we may collect identifiers,
        contact information, geolocation data, professional information, visual
        information, internet activity information, and inferences.
      </Text>

      <View style={styles.ul}>
        <Text style={styles.listItem}>
          • Registration: name, company, email, phone
        </Text>
        <Text style={styles.listItem}>• Interactions: device/usage data</Text>
        <Text style={styles.listItem}>• Logs & telemetry</Text>
        <Text style={styles.listItem}>
          • Communications (calls where permitted)
        </Text>
        <Text style={styles.listItem}>• Voluntary submissions via forms</Text>
      </View>

      {/* SECTION 4 */}
      <Text style={styles.h2}>
        4. What Device and Usage Data Do We Process?
      </Text>

      <Text style={styles.listItem}>
        1) Automatically collected device data
      </Text>
      <Text style={styles.listItem}>
        2) Cookies, Web Beacons, and similar tech
      </Text>
      <Text style={styles.listItem}>
        3) Do-Not-Track signals (not supported)
      </Text>

      {/* SECTION 5 */}
      <Text style={styles.h2}>
        5. Purposes for Which We Process Personal Data
      </Text>
      <Text style={styles.p}>
        We process Personal Data to operate our services, secure our systems,
        manage users, provide support, improve offerings, and comply with
        Panamanian law.
      </Text>

      {/* SECTION 6 */}
      <Text style={styles.h2}>6. Who Do We Share Personal Data With?</Text>
      <Text style={styles.p}>
        We may share Personal Data with service providers, advisors, and parties
        involved in corporate transactions, as well as aggregated or
        de-identified data.
      </Text>

      {/* SECTION 7 */}
      <Text style={styles.h2}>7. International Transfer of Personal Data</Text>
      <Text style={styles.p}>
        Your data may be transferred to countries outside Panama where our
        service providers operate, subject to legal safeguards.
      </Text>

      {/* SECTION 8 */}
      <Text style={styles.h2}>8. Children</Text>
      <Text style={styles.p}>
        We do not knowingly collect data from children under 13.
      </Text>

      {/* SECTION 9 */}
      <Text style={styles.h2}>9. How Long Do We Keep Your Personal Data?</Text>
      <Text style={styles.p}>
        Data is retained as needed and deleted or anonymized afterwards.
      </Text>

      {/* SECTION 10 */}
      <Text style={styles.h2}>
        10. Your Rights Relating to Your Personal Data
      </Text>
      <Text style={styles.p}>
        Under Panamanian law, you may request access, correction, deletion,
        opposition, portability, or revoke consent.
      </Text>

      {/* SECTION 11 */}
      <Text style={styles.h2}>11. How We Secure Your Personal Data</Text>
      <Text style={styles.p}>
        We implement organizational and technical safeguards, including
        encryption and access controls.
      </Text>

      {/* SECTION 12 */}
      <Text style={styles.h2}>12. Changes to This Privacy Policy</Text>
      <Text style={styles.p}>
        We may update this Privacy Policy periodically and notify you of
        material changes.
      </Text>

      {/* SECTION 13 */}
      <Text style={styles.h2}>13. Contact Us</Text>
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
