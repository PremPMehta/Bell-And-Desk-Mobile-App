import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import styles from './style';

const CookiePolicy = () => {
  const openLink = url => Linking.openURL(url);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Title */}
        <Text style={styles.title}>
          COOKIE POLICY - Bell & Desk (Bellndesk.com)
        </Text>
        <Text style={styles.updated}>Last Updated: October 2025</Text>

        {/* Section 1 */}
        <Text style={styles.p}>
          Bell & Desk ("we," "our," or "us") uses cookies and similar
          technologies on our website and web applications (the "Platform") to
          ensure essential functionality, maintain security, and improve
          performance.
        </Text>

        <Text style={styles.p}>
          This Cookie Policy explains what cookies are, how we use them, and how
          users can manage or disable them if they choose.
        </Text>

        <Text style={styles.p}>
          Our operations are based in <Text style={styles.bold}>Panama</Text>,
          but as a <Text style={styles.bold}>global platform</Text>, we follow
          international best practices for privacy and data protection,
          including principles aligned with the{' '}
          <Text style={styles.bold}>EU GDPR</Text> and{' '}
          <Text style={styles.bold}>ePrivacy Directive</Text>.
        </Text>

        {/* Section Header */}
        <Text style={styles.h2}>1. What Are Cookies?</Text>

        <Text style={styles.p}>
          Cookies are small text files placed on your device when visiting a
          website.
        </Text>

        <Text style={styles.p}>
          They enable certain core features—such as keeping sessions active,
          balancing server load, or remembering minimal preferences.
        </Text>

        <Text style={styles.p}>Cookies can be:</Text>

        {/* List */}
        <View style={styles.ul}>
          <Text style={styles.li}>
            • <Text style={styles.bold}>Session cookies:</Text> deleted
            automatically when you close your browser.
          </Text>
          <Text style={styles.li}>
            • <Text style={styles.bold}>Persistent cookies:</Text> stored on
            your device for a defined period.
          </Text>
        </View>

        {/* Section 2 */}
        <Text style={styles.h2}>2. How We Use Cookies</Text>
        <Text style={styles.p}>
          Bell & Desk uses only{' '}
          <Text style={styles.bold}>
            technical and strictly necessary cookies
          </Text>{' '}
          required for the website and platform to operate correctly.
        </Text>

        <Text style={styles.p}>
          We do <Text style={styles.bold}>not</Text> use advertising cookies,
          tracking pixels, or third-party analytics tools.
        </Text>

        <Text style={styles.p}>Our current use of cookies is limited to:</Text>

        {/* List */}
        <View style={styles.ul}>
          <Text style={styles.li}>
            • Maintaining secure and stable user sessions.
          </Text>
          <Text style={styles.li}>
            • Enabling authentication and platform performance.
          </Text>
          <Text style={styles.li}>
            • Managing load distribution through AWS.
          </Text>
        </View>

        {/* Section 3 */}
        <Text style={styles.h2}>3. Categories of Cookies in Use</Text>

        <Text style={styles.h3}>(a) Strictly Necessary Cookies</Text>
        <Text style={styles.p}>
          These cookies are fundamental to the functioning of our services and
          cannot be disabled via on-site tools. They handle login
          authentication, load balancing, and maintaining consistent access.
        </Text>

        {/* Cookie Table */}
        <View style={styles.table}>
          <View style={styles.tableRowHeader}>
            <Text style={styles.tableHeader}>Cookie Type</Text>
            <Text style={styles.tableHeader}>Purpose</Text>
            <Text style={styles.tableHeader}>Provider</Text>
            <Text style={styles.tableHeader}>Retention</Text>
          </View>

          {/* Row 1 */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Session ID</Text>
            <Text style={styles.tableCell}>Maintains secure user session</Text>
            <Text style={styles.tableCell}>Bell & Desk</Text>
            <Text style={styles.tableCell}>Session</Text>
          </View>

          {/* Row 2 */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>AWS Load Balancer Cookie</Text>
            <Text style={styles.tableCell}>Ensures server stability</Text>
            <Text style={styles.tableCell}>AWS</Text>
            <Text style={styles.tableCell}>Session</Text>
          </View>

          {/* Row 3 */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>CSRF / Security{'\n'}Token</Text>
            <Text style={styles.tableCell}>
              Protects against unauthorized requests
            </Text>
            <Text style={styles.tableCell}>Bell & Desk</Text>
            <Text style={styles.tableCell}>Session</Text>
          </View>
        </View>

        {/* Functional Cookies */}
        <Text style={styles.h3}>(b) Functional & Preference Cookies</Text>
        <Text style={styles.p}>
          Bell & Desk may use minimal cookies to remember basic interface
          settings such as language or theme. These do not track user behavior
          or share data externally.
        </Text>

        {/* Note Box */}
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            <Text style={styles.bold}>Note:</Text> No cookie-consent banner is
            currently implemented because only strictly necessary cookies are in
            use. If we introduce non-essential cookies later, a visible consent
            mechanism will be added.
          </Text>
        </View>

        {/* Section 4 */}
        <Text style={styles.h2}>4. Third-Party Cookies and Data Sharing</Text>

        <Text style={styles.p}>
          Bell & Desk does not use any third-party tracking cookies.
        </Text>

        <Text style={styles.p}>
          Our only infrastructure provider,{' '}
          <Text style={styles.bold}>Amazon Web Services (AWS)</Text>, may set
          limited technical cookies used strictly for load balancing.
        </Text>

        <Text style={styles.p}>
          These cookies do <Text style={styles.bold}>not</Text> store personal
          information or identify users.
        </Text>

        {/* Section 5 */}
        <Text style={styles.h2}>5. Managing Cookies</Text>

        <Text style={styles.p}>
          You can manage or delete cookies at any time through your browser
          settings. Disabling essential cookies may limit certain platform
          functions.
        </Text>

        <Text style={styles.p}>Learn more for your browser:</Text>

        {/* Links */}
        <View style={styles.ul}>
          {[
            ['Google Chrome', 'https://support.google.com/chrome/answer/95647'],
            [
              'Firefox',
              'https://support.mozilla.org/en-US/kb/block-websites-storing-cookies-site-data-firefox',
            ],
            [
              'Safari',
              'https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac',
            ],
            [
              'Microsoft Edge',
              'https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09',
            ],
            [
              'Brave Browser',
              'https://support.brave.com/hc/en-us/articles/360050634911-How-Do-I-Manage-Cookies-In-Brave',
            ],
          ].map(([label, url], i) => (
            <TouchableOpacity key={i} onPress={() => openLink(url)}>
              <Text style={styles.link}>• {label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section 6 */}
        <Text style={styles.h2}>6. Updates to This Policy</Text>
        <Text style={styles.p}>
          We may update this Cookie Policy periodically to reflect technical,
          regulatory, or operational changes.
        </Text>

        {/* Section 7 */}
        <Text style={styles.h2}>7. Jurisdiction and Compliance</Text>
        <Text style={styles.p}>
          Bell & Desk operates under the laws of the{' '}
          <Text style={styles.bold}>Republic of Panama</Text>. We also follow
          globally recognized standards like{' '}
          <Text style={styles.bold}>GDPR</Text> where applicable.
        </Text>

        {/* Section 8 */}
        <Text style={styles.h2}>8. Contact Us</Text>
        <View style={styles.contactBox}>
          <Text style={styles.p}>
            <Text style={styles.bold}>Email:</Text>{' '}
            <Text
              style={styles.link}
              onPress={() =>
                openLink(
                  'mailto:Principal@bellndesk.com?subject=Cookie%20Policy%20Inquiry',
                )
              }
            >
              Principal@bellndesk.com
            </Text>
            {'\n'}
            <Text style={styles.bold}>Subject:</Text> "Cookie Policy Inquiry"
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default CookiePolicy;
