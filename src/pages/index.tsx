import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { ArrowRight, Layers, Palette, Lock } from 'lucide-react';

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <>
      <Head>
        <title>Flowboard — Visual content boards for creators</title>
        <meta
          name="description"
          content="Create beautiful, card-based content boards. Publish articles, thoughts, and links in one curated space."
        />
      </Head>

      <div className="min-h-screen bg-flow-paper flex flex-col">
        {/* Nav */}
        <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-flow-ink rounded-lg flex items-center justify-center">
              <span className="text-flow-paper font-display text-sm font-bold">F</span>
            </div>
            <span className="font-display text-lg text-flow-ink">Flowboard</span>
          </div>
          <Link
            href={isSignedIn ? '/dashboard' : '/sign-up'}
            className="btn-primary"
          >
            {isSignedIn ? 'Dashboard' : 'Get started'}
            <ArrowRight size={15} />
          </Link>
        </header>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-3xl mx-auto -mt-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-flow-accent/10 text-flow-accent 
                          text-xs font-semibold uppercase tracking-wider rounded-full mb-8">
            Now in beta
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-flow-ink leading-[1.05] mb-6">
            Your content,
            <br />
            <span className="italic text-flow-accent">one board.</span>
          </h1>

          <p className="text-lg text-flow-muted max-w-xl mb-10 leading-relaxed">
            Flowboard turns your ideas into a beautiful, card-based publication.
            Articles, quotes, links, and visuals — curated and shareable
            from a single page.
          </p>

          <div className="flex items-center gap-4">
            <Link href={isSignedIn ? '/dashboard' : '/sign-up'} className="btn-accent">
              Create your board
              <ArrowRight size={15} />
            </Link>
            <Link href="#features" className="btn-secondary">
              See how it works
            </Link>
          </div>
        </main>

        {/* Features */}
        <section id="features" className="max-w-5xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Layers,
                title: 'Mixed-format cards',
                desc: 'Articles, short posts, quotes, links, and images — all on one board with a unified layout.',
              },
              {
                icon: Palette,
                title: 'Your brand, your way',
                desc: 'Custom colors, typography, and layout. Make it yours without touching code.',
              },
              {
                icon: Lock,
                title: 'Freemium built in',
                desc: 'Tag cards as free or premium. Build your audience with open content, monetize with depth.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-base p-6">
                <div className="w-10 h-10 rounded-lg bg-flow-warm flex items-center justify-center mb-4">
                  <Icon size={20} className="text-flow-accent" />
                </div>
                <h3 className="font-display text-lg text-flow-ink mb-2">{title}</h3>
                <p className="text-sm text-flow-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-8 border-t border-flow-border text-center">
        <p className="text-xs text-flow-muted">
          Built with intention. Powered by Flowboard.
          {' · '}
          <a href="/terms" className="hover:text-flow-ink transition-colors underline">Terms of Service</a>
        </p>
        </footer>
      </div>
    </>
  );
}
