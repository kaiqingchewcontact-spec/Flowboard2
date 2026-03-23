import Head from 'next/head';
import Link from 'next/link';
import { blogPosts } from '@/lib/blog';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function BlogIndex() {
  return (
    <>
      <Head>
        <title>Blog — Flowboard</title>
        <meta
          name="description"
          content="Tips, guides, and insights for creators building their audience with visual content boards. Learn how to organise, publish, and grow."
        />
      </Head>

      <div style={{ backgroundColor: 'var(--flow-paper)', color: 'var(--flow-ink)', minHeight: '100vh' }}>
        {/* Nav */}
        <header style={{
          padding: '16px 24px', maxWidth: '1200px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
            <div style={{
              width: '28px', height: '28px', backgroundColor: 'var(--flow-ink)',
              borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'var(--flow-paper)', fontFamily: '"DM Serif Display"', fontSize: '12px', fontWeight: 'bold' }}>F</span>
            </div>
            <span style={{ fontFamily: '"DM Serif Display"', fontSize: '16px' }}>Flowboard</span>
          </Link>
          <Link href="/sign-up" className="btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}>
            Get started <ArrowRight size={13} />
          </Link>
        </header>

        {/* Blog header */}
        <section style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 24px 40px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: '"DM Serif Display"', fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: '1.1', marginBottom: '12px' }}>
            Blog
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--flow-muted)', maxWidth: '480px', margin: '0 auto', lineHeight: '1.6' }}>
            Ideas, guides, and strategies for creators who take their content seriously.
          </p>
        </section>

        {/* Posts list */}
        <section style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: 'var(--flow-border)', borderRadius: '12px', overflow: 'hidden' }}>
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{
                  display: 'block', padding: '24px', backgroundColor: 'var(--flow-surface)',
                  textDecoration: 'none', color: 'inherit', transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--flow-warm)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--flow-surface)')}
              >
                <span style={{
                  fontSize: '9px', fontWeight: '600', textTransform: 'uppercase',
                  letterSpacing: '0.08em', color: 'var(--flow-accent)', display: 'block', marginBottom: '6px',
                }}>
                  {post.stage}
                </span>
                <h2 style={{
                  fontFamily: '"DM Serif Display"', fontSize: '20px', lineHeight: '1.3', marginBottom: '6px',
                }}>
                  {post.title}
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--flow-muted)', lineHeight: '1.5' }}>
                  {post.meta}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid var(--flow-border)', padding: '28px 24px' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '12px', color: 'var(--flow-muted)' }}>&copy; 2026 Flowboard</span>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Link href="/" style={{ fontSize: '12px', color: 'var(--flow-muted)', textDecoration: 'none' }}>Home</Link>
              <Link href="/terms" style={{ fontSize: '12px', color: 'var(--flow-muted)', textDecoration: 'none' }}>Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
