import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service — Flowboard</title>
      </Head>

      <div className="min-h-screen bg-flow-paper">
        {/* Nav */}
        <header className="px-6 py-5 flex items-center justify-between max-w-3xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-flow-ink rounded-lg flex items-center justify-center">
              <span className="text-flow-paper font-display text-sm font-bold">F</span>
            </div>
            <span className="font-display text-lg text-flow-ink">Flowboard</span>
          </Link>
          <Link href="/" className="btn-secondary text-xs">
            <ArrowLeft size={12} />
            Back
          </Link>
        </header>

        {/* Content */}
        <main className="max-w-3xl mx-auto px-6 py-12">
          <h1 className="font-display text-4xl text-flow-ink mb-2">Terms of Service</h1>
          <p className="text-sm text-flow-muted mb-10">Last updated: March 2026</p>

          <div className="space-y-8 text-sm text-flow-ink/80 leading-relaxed">

            <section>
              <h2 className="font-display text-xl text-flow-ink mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Flowboard, you agree to be bound by these Terms of Service.
                If you do not agree to these terms, you may not use our services. Flowboard reserves
                the right to update these terms at any time, and continued use of the platform
                constitutes acceptance of any changes.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-flow-ink mb-3">2. Description of Service</h2>
              <p>
                Flowboard is a content publication platform that allows creators to build visual,
                card-based content boards. Users can create boards, add content cards (articles,
                short posts, quotes, links, and images), customize their board appearance, and
                share their boards publicly via a unique URL.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-flow-ink mb-3">3. Account Registration</h2>
              <p>
                To use Flowboard, you must create an account using a valid email address. You are
                responsible for maintaining the confidentiality of your account credentials and for
                all activities that occur under your account. You must be at least 13 years old to
                create an account.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-flow-ink mb-3">4. User Content</h2>
              <p>
                You retain ownership of all content you create and publish on Flowboard. By
                publishing content on the platform, you grant Flowboard a non-exclusive,
                worldwide license to display, distribute, and promote your content as part of the
                service. You are solely responsible for the content you publish and must ensure it
                does not violate any applicable laws or third-party rights.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-flow-ink mb-3">5. Prohibited Content</h2>
              <p>You may not use Flowboard to publish content that:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Is illegal, harmful, threatening, abusive, or harassing</li>
                <li>Infringes on intellectual property rights of others</li>
                <li>Contains malware, spam, or phishing attempts</li>
                <li>Promotes violence, discrimination, or hate speech</li>
                <li>Contains sexually explicit material involving minors</li>
                <li>Impersonates any person or entity</li>
              </ul>
              <p className="mt-2">
                Flowboard reserves the right to remove any content that violates these terms
                and to suspend or terminate accounts that repeatedly violate these guidelines.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-flow-ink mb-3">6. Subscription and Payments</h2>
              <p>
                Flowboard offers free and paid subscription tiers. Paid subscriptions are billed
                monthly through Stripe. You may cancel your subscription at any time, and your
                access to paid features will continue until the end of your current billing period.
                Refunds are handled on a case-by-case basis.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-flow-ink mb-3">7. Privacy</h2>
              <p>
                Your privacy is important to us. We collect and process personal data as described
                in our Privacy Policy. By using Flowboard, you consent to the collection and use
                of your information as outlined in that policy. We do not sell your personal data
                to third parties.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-flow-ink mb-3">8. Intellectual Property</h2>
              <p>
                The Flowboard platform, including its design, code, branding, and documentation,
                is owned by Flowboard and protected by intellectual property laws. You may not
                copy, modify, distribute, or reverse-engineer any part of the platform without
                explicit permission.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-flow-ink mb-3">9. Limitation of Liability</h2>
              <p>
                Flowboard is provided on an &quot;as is&quot; and &quot;as available&quot; basis.
                We make no warranties, expressed or implied, regarding the reliability, accuracy,
                or availability of the service. In no event shall Flowboard be liable for any
                indirect, incidental, special, or consequential damages arising from your use of
                the platform.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-flow-ink mb-3">10. Termination</h2>
              <p>
                Flowboard reserves the right to suspend or terminate your account at any time for
                violation of these terms or for any other reason at our discretion. Upon
                termination, your right to use the service will immediately cease. You may also
                delete your account at any time through the settings page.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-flow-ink mb-3">11. Contact</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at{' '}
                <a href="mailto:hello@flowboard.co" className="text-flow-accent hover:underline">
                  hello@flowboard.co
                </a>
              </p>
            </section>

          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-8 border-t border-flow-border text-center">
          <p className="text-xs text-flow-muted">
            Built with intention. Powered by Flowboard.
          </p>
        </footer>
      </div>
    </>
  );
}

