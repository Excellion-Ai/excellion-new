import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="text-muted-foreground text-sm mb-10">Last updated: March 19, 2026</p>

        <div className="space-y-8 text-muted-foreground text-sm leading-relaxed font-body">
          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Excellion platform ("Service"), you agree to be bound by these Terms of Service. If you do not agree, you may not use the Service. These terms apply to all users, including course creators, students, and visitors.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">2. Description of Service</h2>
            <p>
              Excellion is an AI-powered course building platform designed for fitness creators. We provide tools to generate course outlines, lesson plans, sales pages, and student portals. The Service is provided "as is" and may be updated or modified at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">3. Account Registration</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>You must provide accurate, complete information when creating an account.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You must be at least 16 years old to use the Service.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">4. Content Ownership</h2>
            <p className="mb-3">
              You retain ownership of all original content you create using Excellion, including course materials, text, images, and videos you upload. By using our AI generation tools:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>You own the AI-generated course content produced for your account.</li>
              <li>You grant Excellion a limited license to host, display, and distribute your content as necessary to operate the platform.</li>
              <li>You are responsible for ensuring your content does not infringe on third-party rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">5. Payments & Subscriptions</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Paid features are billed through Stripe. By subscribing, you authorize recurring charges.</li>
              <li>Prices are listed in USD and may change with 30 days' notice.</li>
              <li>Refunds are handled on a case-by-case basis. Contact us within 14 days of purchase for refund requests.</li>
              <li>Course creators are responsible for their own refund policies with their students.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">6. Prohibited Conduct</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Use the Service for any unlawful purpose or to promote illegal activities.</li>
              <li>Upload harmful, misleading, or plagiarized content.</li>
              <li>Attempt to gain unauthorized access to our systems or other users' accounts.</li>
              <li>Resell, redistribute, or white-label the Service without written permission.</li>
              <li>Use automated tools to scrape or extract data from the platform.</li>
              <li>Interfere with the proper functioning of the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">7. Course Sales & Creator Responsibilities</h2>
            <p className="mb-3">If you sell courses through Excellion:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>You are responsible for the accuracy and quality of your course content.</li>
              <li>You must comply with all applicable consumer protection laws.</li>
              <li>Excellion may take a platform fee on course sales as outlined in your pricing plan.</li>
              <li>You are responsible for any taxes applicable to your earnings.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Excellion shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising from your use of the Service. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">9. Termination</h2>
            <p>
              We may suspend or terminate your account at our discretion if you violate these Terms. You may delete your account at any time by contacting us. Upon termination, your right to use the Service ceases immediately, though we may retain certain data as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">10. Disclaimers</h2>
            <p>
              The Service is provided "as is" without warranties of any kind, express or implied. We do not guarantee that AI-generated content will be error-free, complete, or suitable for any particular purpose. You are responsible for reviewing and editing all generated content before publishing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Material changes will be communicated via email or a notice on the platform. Continued use of the Service after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Excellion operates, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-foreground mb-3">13. Contact Us</h2>
            <p>
              If you have questions about these Terms, please contact us at{" "}
              <a href="mailto:excellionai@gmail.com" className="text-primary hover:underline">excellionai@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
