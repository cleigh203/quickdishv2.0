import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Button variant="ghost" onClick={() => navigate('/discover')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>

        {/* Content */}
        <div className="bg-card rounded-lg p-6 md:p-10 shadow-sm">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-1">
            <strong>Last Updated:</strong> October 20, 2025
          </p>
          <p className="text-muted-foreground mb-8">
            <strong>Effective Date:</strong> October 7, 2025
          </p>

          <p className="mb-8 text-foreground/90">
            Welcome to QuickDish! These Terms of Service ("Terms") govern your use of the QuickDish mobile application ("App"). By using QuickDish, you agree to these Terms.
          </p>

          {/* Table of Contents */}
          <nav className="bg-muted/50 rounded-lg p-6 mb-8 print:hidden">
            <h2 className="font-semibold mb-3">Table of Contents</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="#acceptance" className="text-primary hover:underline">1. Acceptance of Terms</a></li>
              <li><a href="#eligibility" className="text-primary hover:underline">2. Eligibility</a></li>
              <li><a href="#accounts" className="text-primary hover:underline">3. User Accounts</a></li>
              <li><a href="#use" className="text-primary hover:underline">4. Acceptable Use</a></li>
              <li><a href="#content" className="text-primary hover:underline">5. Content and Intellectual Property</a></li>
              <li><a href="#recipes" className="text-primary hover:underline">6. Recipe Disclaimers</a></li>
              <li><a href="#ai" className="text-primary hover:underline">7. AI Chat Disclaimer</a></li>
              <li><a href="#liability" className="text-primary hover:underline">8. Limitation of Liability</a></li>
              <li><a href="#indemnification" className="text-primary hover:underline">9. Indemnification</a></li>
              <li><a href="#changes" className="text-primary hover:underline">10. Changes to Service</a></li>
              <li><a href="#third-party" className="text-primary hover:underline">11. Third-Party Services</a></li>
              <li><a href="#disputes" className="text-primary hover:underline">12. Dispute Resolution</a></li>
              <li><a href="#misc" className="text-primary hover:underline">13. Miscellaneous</a></li>
              <li><a href="#contact" className="text-primary hover:underline">14. Contact Information</a></li>
            </ul>
          </nav>

          {/* Sections */}
          <section id="acceptance" className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-foreground/90">
              By creating an account or using QuickDish, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, do not use the App.
            </p>
          </section>

          <section id="eligibility" className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">2. Eligibility</h2>
            <p className="text-foreground/90">
              You must be at least 13 years old to use QuickDish. By using the App, you represent that you meet this requirement.
            </p>
          </section>

          <section id="accounts" className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
            
            <h3 className="text-xl font-medium mt-4 mb-2">Account Creation</h3>
            <ul className="list-disc list-inside space-y-1 text-foreground/90 mb-4">
              <li>Provide accurate, current information</li>
              <li>Maintain one account per person</li>
              <li>Keep your password secure and confidential</li>
              <li>You are responsible for all account activity</li>
            </ul>

            <h3 className="text-xl font-medium mt-4 mb-2">Account Termination</h3>
            <ul className="list-disc list-inside space-y-1 text-foreground/90">
              <li>You may delete your account at any time</li>
              <li>We may suspend or terminate accounts for violations</li>
              <li>Deleted account data is removed within 30 days</li>
            </ul>
          </section>

          <section id="use" className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">4. Acceptable Use</h2>
            <p className="mb-3 text-foreground/90">You agree NOT to:</p>
            <ul className="list-disc list-inside space-y-1 text-foreground/90">
              <li>Share account credentials with others</li>
              <li>Use the App for illegal purposes</li>
              <li>Abuse or spam AI chat features</li>
              <li>Scrape, copy, or redistribute recipe content in bulk</li>
              <li>Reverse engineer or modify the App</li>
              <li>Impersonate others or create fake accounts</li>
              <li>Upload harmful code or viruses</li>
              <li>Harass other users or our support team</li>
            </ul>
          </section>

          <section id="content" className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">5. Content and Intellectual Property</h2>
            
            <h3 className="text-xl font-medium mt-4 mb-2">Our Content</h3>
            <ul className="list-disc list-inside space-y-1 text-foreground/90 mb-4">
              <li>Recipes, images, and app design are owned by QuickDish or licensed</li>
              <li>Provided for personal, non-commercial use</li>
              <li>You may not republish or sell our recipes commercially</li>
            </ul>

            <h3 className="text-xl font-medium mt-4 mb-2">Your Content</h3>
            <ul className="list-disc list-inside space-y-1 text-foreground/90 mb-4">
              <li>User-generated content (notes, lists, ratings) remains yours</li>
              <li>You grant us license to store and display your content within the App</li>
              <li>We may remove inappropriate content at our discretion</li>
            </ul>

            <h3 className="text-xl font-medium mt-4 mb-2">AI-Generated Content</h3>
            <ul className="list-disc list-inside space-y-1 text-foreground/90">
              <li>AI recipe suggestions are generated by third-party AI services (processed securely server-side)</li>
              <li>AI responses are for informational purposes only</li>
              <li>We do not guarantee accuracy of AI-generated content</li>
              <li>AI-generated recipes should be reviewed and adjusted based on your dietary needs and preferences</li>
            </ul>
          </section>

          <section id="recipes" className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">6. Recipe Disclaimers</h2>
            
            <h3 className="text-xl font-medium mt-4 mb-2">Food Safety</h3>
            <ul className="list-disc list-inside space-y-1 text-foreground/90 mb-4">
              <li>Follow proper food safety guidelines</li>
              <li>Cook foods to safe internal temperatures</li>
              <li>Be aware of food allergies and dietary restrictions</li>
            </ul>

            <h3 className="text-xl font-medium mt-4 mb-2">Nutritional Information</h3>
            <ul className="list-disc list-inside space-y-1 text-foreground/90 mb-4">
              <li>Nutritional data is approximate</li>
              <li>Based on standard ingredient measurements</li>
              <li>Consult healthcare providers for dietary advice</li>
            </ul>

            <h3 className="text-xl font-medium mt-4 mb-2">Not Professional Advice</h3>
            <ul className="list-disc list-inside space-y-1 text-foreground/90">
              <li>Recipes are suggestions, not medical or nutritional advice</li>
              <li>We are not responsible for allergic reactions or foodborne illness</li>
              <li>Always check ingredient labels for allergens</li>
            </ul>
          </section>

          <section id="ai" className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">7. AI Chat Disclaimer</h2>
            <ul className="list-disc list-inside space-y-1 text-foreground/90">
              <li>AI responses are generated automatically</li>
              <li>May contain errors or inaccuracies</li>
              <li>Should not replace professional culinary or dietary advice</li>
              <li>We are not liable for decisions based on AI suggestions</li>
            </ul>
          </section>

          <section id="liability" className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">8. Limitation of Liability</h2>
            <p className="mb-3 font-medium text-foreground/90">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
            <ul className="list-disc list-inside space-y-1 text-foreground/90">
              <li>QuickDish is provided "AS IS" without warranties</li>
              <li>We are not liable for any damages arising from use of the App</li>
              <li>This includes but is not limited to: cooking mishaps, allergic reactions, food waste, or any other damages</li>
              <li>Our total liability shall not exceed the amount you paid us in the past 12 months</li>
            </ul>
          </section>

          <section id="indemnification" className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">9. Indemnification</h2>
            <p className="text-foreground/90">
              You agree to indemnify and hold QuickDish harmless from claims arising from your use of the App or violation of these Terms.
            </p>
          </section>

          <section id="changes" className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">10. Changes to Service</h2>
            <p className="mb-3 text-foreground/90">We reserve the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-foreground/90">
              <li>Modify or discontinue features</li>
              <li>Change pricing with 30 days notice</li>
              <li>Update these Terms (you'll be notified)</li>
              <li>Suspend service for maintenance</li>
            </ul>
          </section>

          <section id="third-party" className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">11. Third-Party Services</h2>
            <p className="mb-3 text-foreground/90">QuickDish integrates with:</p>
            <ul className="list-disc list-inside space-y-1 text-foreground/90 mb-3">
              <li>Supabase (database hosting, authentication, storage)</li>
              <li>Stripe (payment processing)</li>
              <li>AI Service Providers (recipe generation - processed server-side)</li>
              <li>Instacart (shopping list integrations and external links - optional)</li>
              <li>Vercel Analytics (usage analytics - anonymized)</li>
            </ul>
            <p className="text-foreground/90">
              Use of these services is subject to their own terms.
            </p>
          </section>

          <section id="disputes" className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">12. Dispute Resolution</h2>
            
            <h3 className="text-xl font-medium mt-4 mb-2">Governing Law</h3>
            <p className="text-foreground/90 mb-4">
              These Terms are governed by the laws of the United States. For disputes involving EU users, 
              applicable EU consumer protection laws may also apply.
            </p>

            <h3 className="text-xl font-medium mt-4 mb-2">Arbitration</h3>
            <p className="text-foreground/90 mb-4">
              Disputes shall be resolved through binding arbitration, not in court (except small claims).
            </p>

            <h3 className="text-xl font-medium mt-4 mb-2">Class Action Waiver</h3>
            <p className="text-foreground/90">
              You agree to resolve disputes individually, not as a class action.
            </p>
          </section>

          <section id="misc" className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">13. Miscellaneous</h2>
            <ul className="list-disc list-inside space-y-1 text-foreground/90">
              <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement</li>
              <li><strong>Severability:</strong> Invalid provisions do not affect remaining Terms</li>
              <li><strong>No Waiver:</strong> Our failure to enforce doesn't waive our rights</li>
              <li><strong>Assignment:</strong> We may assign these Terms; you may not</li>
            </ul>
          </section>

          <section id="contact" className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">14. Contact Information</h2>
            <p className="mb-3 text-foreground/90">Questions about these Terms?</p>
            <p className="text-foreground/90 mb-2">
              <strong>Email:</strong> info@quickdishco.com
            </p>
          </section>

          <div className="border-t pt-6 mt-8">
            <p className="text-sm text-muted-foreground italic">
              By using QuickDish, you acknowledge that you have read, understood, and agree to these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
