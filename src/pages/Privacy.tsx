import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-10">Last updated: March 19, 2026</p>

        <div className="space-y-8 text-muted-foreground text-sm leading-relaxed font-body">
          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>
              Excellion ("we," "our," or "us") operates the Excellion platform at excellioncourses.lovable.app. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <p className="mb-3">We may collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><span className="text-foreground font-medium">Account Information:</span> Name, email address, and profile details when you create an account.</li>
              <li><span className="text-foreground font-medium">Payment Information:</span> Billing details processed securely through Stripe. We do not store your full credit card number.</li>
              <li><span className="text-foreground font-medium">Usage Data:</span> Pages visited, features used, course interactions, and device/browser information.</li>
              <li><span className="text-foreground font-medium">Content Data:</span> Course materials, prompts, and other content you create using our platform.</li>
              <li><span className="text-foreground font-medium">Communications:</span> Messages you send to us via email or contact forms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>To provide, operate, and maintain our platform and services.</li>
              <li>To process transactions and manage your account.</li>
              <li>To generate and deliver AI-powered course content.</li>
              <li>To communicate with you about updates, promotions, and support.</li>
              <li>To improve our platform, analyze usage trends, and develop new features.</li>
              <li>To detect, prevent, and address fraud or security issues.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">4. Sharing of Information</h2>
            <p className="mb-3">We do not sell your personal information. We may share data with:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><span className="text-foreground font-medium">Service Providers:</span> Third-party vendors (e.g., Stripe, Supabase) that help us operate the platform.</li>
              <li><span className="text-foreground font-medium">Legal Requirements:</span> When required by law or to protect our rights.</li>
              <li><span className="text-foreground font-medium">Business Transfers:</span> In connection with a merger, acquisition, or sale of assets.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information, including encryption in transit (TLS/SSL) and at rest. However, no method of electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">6. Your Rights</h2>
            <p className="mb-3">Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Access, correct, or delete your personal data.</li>
              <li>Withdraw consent for data processing.</li>
              <li>Request a copy of your data in a portable format.</li>
              <li>Opt out of marketing communications at any time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">7. Cookies</h2>
            <p>
              We use essential cookies to maintain your session and preferences. We may also use analytics cookies to understand how visitors interact with our platform. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">8. Third-Party Links</h2>
            <p>
              Our platform may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">9. Children's Privacy</h2>
            <p>
              Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on this page with a revised "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:excellionai@gmail.com" className="text-primary hover:underline">excellionai@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
