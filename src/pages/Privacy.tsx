import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-emerald-700 to-red-500 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/profile">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-white/90">Last Updated: October 20, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Table of Contents */}
        <nav className="bg-card rounded-xl p-6 mb-8 border border-border print:hidden">
          <h2 className="text-xl font-bold text-foreground mb-4">Table of Contents</h2>
          <ol className="space-y-2 text-sm">
            {[
              { id: 'section-1', title: 'Information We Collect' },
              { id: 'section-2', title: 'How We Use Your Information' },
              { id: 'section-3', title: 'AI and Recipe Generation' },
              { id: 'section-4', title: 'Information Sharing' },
              { id: 'section-5', title: 'Data Security' },
              { id: 'section-6', title: 'Your Rights and Choices' },
              { id: 'section-7', title: "Children's Privacy" },
              { id: 'section-8', title: 'Data Retention' },
              { id: 'section-9', title: 'International Users' },
              { id: 'section-10', title: 'California Privacy Rights (CCPA)' },
              { id: 'section-11', title: 'Changes to This Policy' },
              { id: 'section-12', title: 'Contact Us' },
            ].map((item, index) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="text-primary hover:underline text-left"
                >
                  {index + 1}. {item.title}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-8">
          <p className="text-foreground leading-relaxed">
            QuickDish ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our web application.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section id="section-1" className="scroll-mt-4">
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Account Information</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground mb-4">
              <li>Email address</li>
              <li>Display name (optional)</li>
              <li>Password (encrypted)</li>
              <li>Profile preferences</li>
            </ul>
          <p className="text-sm text-muted-foreground mb-6">
            We require email verification for new accounts to help secure access.
          </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Usage Data</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground mb-4">
              <li>Recipes viewed, saved, and favorited</li>
              <li>Meal plans created and scheduled</li>
              <li>Shopping lists and items</li>
              <li>Pantry items and inventory</li>
              <li>Search queries and filters</li>
              <li>App interactions and features used</li>
              <li>Recipe ratings and notes</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Device Information</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground mb-4">
              <li>Device type and model</li>
              <li>Operating system version</li>
              <li>App version</li>
              <li>IP address (for security and analytics)</li>
              <li>Browser type and version (web app)</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Permissions and Sensors</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground mb-4">
              <li>Camera access (for barcode scanning - optional)</li>
              <li>Microphone access (for voice search - optional)</li>
              <li>Storage access (for saving PDFs and images - optional)</li>
            </ul>
            <p className="text-sm text-muted-foreground mb-6">
              All permissions are optional and only requested when you use specific features. You can deny or revoke permissions at any time in your device settings.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Premium Subscription Data</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground mb-4">
              <li>Payment information (processed by Stripe)</li>
              <li>Subscription status and billing history</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="scroll-mt-4">
            <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
            <p className="text-foreground mb-3">We use collected information to:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground mb-4">
              <li>Provide and maintain the app and its features</li>
              <li>Personalize your recipe recommendations and meal plans</li>
              <li>Process premium subscriptions and payments</li>
              <li>Verify your email and secure your account</li>
              <li>Improve app functionality and user experience</li>
              <li>Send service updates, notifications, and important account information</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Analyze usage patterns and trends (anonymized)</li>
              <li>Detect and prevent fraud, abuse, or security threats</li>
              <li>Comply with legal obligations and enforce our terms</li>
            </ul>
            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Legal Basis for Processing (GDPR)</h3>
            <p className="text-foreground mb-3">We process your data based on:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Contract</strong> - To provide the services you requested</li>
              <li><strong>Consent</strong> - For optional features like analytics and marketing</li>
              <li><strong>Legitimate Interest</strong> - For security, fraud prevention, and service improvement</li>
              <li><strong>Legal Obligation</strong> - To comply with applicable laws and regulations</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="scroll-mt-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">3. AI and Recipe Generation</h2>
          <p className="text-foreground mb-3">QuickDish uses AI services to generate custom recipes based on your preferences:</p>
          <ul className="list-disc pl-6 space-y-2 text-foreground mb-4">
            <li>AI recipe generation is powered by third-party AI services (processed via secure server-side functions)</li>
            <li>Your recipe prompts and preferences are sent to AI services to generate personalized recipes</li>
            <li>AI services do not use your data to train their models</li>
            <li>Generated recipes are saved to your account and can be deleted at any time</li>
            <li>AI chat conversations are processed in real-time and may be logged for service improvement</li>
            <li>You can delete all AI-generated content by deleting your account</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            AI-generated recipes are suggestions only and should not replace professional dietary or medical advice.
          </p>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="scroll-mt-4">
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Information Sharing</h2>
            <p className="text-foreground mb-4">We do not sell your personal information. We share data only with:</p>
            
            <h3 className="text-xl font-semibold text-foreground mb-3">Service Providers:</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground mb-4">
              <li><strong>Supabase</strong> - Database hosting, authentication, and user data storage</li>
              <li><strong>Stripe</strong> - Payment processing for premium subscriptions (we do not store your full payment card details)</li>
              <li><strong>AI Service Providers</strong> - Third-party AI services for recipe generation (processed server-side)</li>
              <li><strong>Instacart</strong> - Shopping list integrations and external links (when you choose to use Instacart features)</li>
              <li><strong>Vercel Analytics</strong> - App performance and usage analytics (anonymized data)</li>
            </ul>
            <p className="text-foreground mb-4">These providers are bound by confidentiality agreements and their own privacy policies. We only share data necessary for service provision.</p>

            <h3 className="text-xl font-semibold text-foreground mb-3">Legal Requirements:</h3>
            <p className="text-foreground">We may disclose information if required by law or to protect our rights.</p>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="scroll-mt-4">
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Data Security</h2>
            <p className="text-foreground mb-3">We implement security measures including:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground mb-4">
              <li>Encrypted data transmission (SSL/TLS)</li>
              <li>Secure password hashing</li>
              <li>Regular security audits</li>
              <li>Limited employee access to personal data</li>
            </ul>
            <p className="text-foreground">However, no method of transmission is 100% secure.</p>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="scroll-mt-4">
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Your Rights and Choices</h2>
            <p className="text-foreground mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground mb-4">
              <li><strong>Access</strong> - Request a copy of your personal data</li>
              <li><strong>Correction</strong> - Correct inaccurate or incomplete information</li>
              <li><strong>Deletion</strong> - Delete your account and all associated data (available in app settings)</li>
              <li><strong>Data Portability</strong> - Export your data in a machine-readable format</li>
              <li><strong>Objection</strong> - Object to processing of your data for certain purposes</li>
              <li><strong>Restriction</strong> - Request restriction of processing in certain circumstances</li>
              <li><strong>Opt-out</strong> - Opt-out of marketing emails and certain analytics</li>
              <li><strong>Withdraw Consent</strong> - Withdraw consent for data processing where applicable</li>
            </ul>
            <p className="text-foreground mb-4">
              To exercise these rights, contact us at{" "}
              <a href="mailto:info@quickdishco.com" className="text-primary hover:underline">
                info@quickdishco.com
              </a>
              {" "}or use the account deletion feature in the app.
            </p>
            <p className="text-sm text-muted-foreground">
              We will respond to your request within 30 days. Some requests may require verification of your identity.
            </p>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="scroll-mt-4">
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Children's Privacy</h2>
            <p className="text-foreground">
              QuickDish is not intended for children under 13. We do not knowingly collect data from children under 13. 
              If you believe we have collected such data, please contact us immediately.
            </p>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="scroll-mt-4">
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Data Retention</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground mb-4">
              <li>Account data: Retained while your account is active</li>
              <li>Deleted accounts: Data removed within 30 days of deletion request</li>
              <li>Backup data: May be retained for up to 90 days for disaster recovery</li>
              <li>Legal obligations: May require longer retention for tax, legal, or regulatory purposes</li>
              <li>Analytics data: Aggregated, anonymized data may be retained indefinitely</li>
            </ul>
            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Cookies and Local Storage</h3>
            <p className="text-foreground mb-3">We use cookies and local storage to:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground mb-4">
              <li>Maintain your login session</li>
              <li>Store your preferences and settings</li>
              <li>Remember your recent searches and activity</li>
              <li>Improve app performance and functionality</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              You can clear cookies and local storage through your browser or device settings, but this may affect app functionality.
            </p>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="scroll-mt-4">
            <h2 className="text-2xl font-bold text-foreground mb-4">9. International Users and Data Transfers</h2>
            <p className="text-foreground mb-3">
              QuickDish is based in the United States. Your data may be transferred to and processed in the United States 
              and other countries where our service providers operate.
            </p>
            <p className="text-foreground mb-3">
              By using our app, you consent to the transfer of your data to these locations. We ensure appropriate 
              safeguards are in place to protect your data in accordance with applicable privacy laws.
            </p>
            <p className="text-sm text-muted-foreground">
              For EU users: Data transfers are protected by Standard Contractual Clauses (SCCs) and other appropriate 
              safeguards as required by GDPR.
            </p>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="scroll-mt-4">
            <h2 className="text-2xl font-bold text-foreground mb-4">10. California Privacy Rights (CCPA)</h2>
            <p className="text-foreground">
              California residents have additional rights under CCPA, including the right to know what personal 
              information is collected and the right to deletion. Contact us to exercise these rights.
            </p>
          </section>

          {/* Section 11 */}
          <section id="section-11" className="scroll-mt-4">
            <h2 className="text-2xl font-bold text-foreground mb-4">11. Changes to This Policy</h2>
            <p className="text-foreground">
              We may update this Privacy Policy periodically. We will notify you of significant changes via email 
              or app notification. Continued use constitutes acceptance.
            </p>
          </section>

          {/* Section 12 */}
          <section id="section-12" className="scroll-mt-4">
            <h2 className="text-2xl font-bold text-foreground mb-4">12. Contact Us</h2>
            <p className="text-foreground mb-4">Questions about this Privacy Policy?</p>
            <div className="bg-card p-6 rounded-xl border border-border">
              <p className="text-foreground mb-2">
                <strong>Email:</strong>{" "}
                <a href="mailto:info@quickdishco.com" className="text-primary hover:underline">
                  info@quickdishco.com
                </a>
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border text-center print:hidden">
          <Link to="/profile">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
