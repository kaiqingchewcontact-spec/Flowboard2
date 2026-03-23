import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { blogPosts, BlogPost } from '@/lib/blog';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  post: BlogPost;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = blogPosts.map((p) => ({ params: { slug: p.slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const post = blogPosts.find((p) => p.slug === params?.slug);
  if (!post) return { notFound: true };
  return { props: { post } };
};

function renderBody(body: string) {
  // Split by double newline into paragraphs, handle bold markdown
  const paragraphs = body.split('\n\n').filter((p) => p.trim());

  return paragraphs.map((para, i) => {
    const trimmed = para.trim();

    // Bold heading (starts with **)
    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      const text = trimmed.replace(/\*\*/g, '');
      return (
        <h2 key={i} style={{
          fontFamily: '"DM Serif Display"', fontSize: '22px', lineHeight: '1.3',
          marginTop: '40px', marginBottom: '8px',
        }}>
          {text}
        </h2>
      );
    }

    // Paragraph with inline bold
    const parts = trimmed.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={i} style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--flow-ink)', marginBottom: '16px' }}>
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j}>{part.replace(/\*\*/g, '')}</strong>;
          }
          return <span key={j}>{part}</span>;
        })}
      </p>
    );
  });
}

export default function BlogPostPage({ post }: Props) {
  return (
    <>
      <Head>
        <title>{post.title} — Flowboard Blog</title>
        <meta name="description" content={post.meta} />
        <meta name="keywords" content={post.keyword} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.meta} />
        <meta property="og:type" content="article" />
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

        {/* Article */}
        <article style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 24px 80px' }}>
          <Link href="/blog" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', color: 'var(--flow-muted)', textDecoration: 'none', marginBottom: '32px',
          }}>
            <ArrowLeft size={14} />
            All posts
          </Link>

          <span style={{
            display: 'block', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase',
            letterSpacing: '0.08em', color: 'var(--flow-accent)', marginBottom: '12px',
          }}>
            {post.stage}
          </span>

          <h1 style={{
            fontFamily: '"DM Serif Display"', fontSize: 'clamp(28px, 5vw, 40px)',
            lineHeight: '1.15', marginBottom: '16px',
          }}>
            {post.title}
          </h1>

          <p style={{
            fontSize: '17px', color: 'var(--flow-muted)', lineHeight: '1.6', marginBottom: '40px',
            borderBottom: '1px solid var(--flow-border)', paddingBottom: '32px',
          }}>
            {post.meta}
          </p>

          <div>{renderBody(post.body)}</div>

          {/* CTA */}
          <div style={{
            marginTop: '48px', padding: '32px', backgroundColor: 'var(--flow-warm)',
            borderRadius: '12px', textAlign: 'center',
          }}>
            <h3 style={{ fontFamily: '"DM Serif Display"', fontSize: '22px', marginBottom: '8px' }}>
              Ready to build your board?
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--flow-muted)', marginBottom: '20px' }}>
              Start free. No credit card required.
            </p>
            <Link href="/sign-up" className="btn-accent" style={{ padding: '12px 32px', fontSize: '14px' }}>
              Create your Flowboard <ArrowRight size={14} />
            </Link>
          </div>
        </article>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid var(--flow-border)', padding: '28px 24px' }}>
          <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '12px', color: 'var(--flow-muted)' }}>&copy; 2026 Flowboard</span>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Link href="/" style={{ fontSize: '12px', color: 'var(--flow-muted)', textDecoration: 'none' }}>Home</Link>
              <Link href="/blog" style={{ fontSize: '12px', color: 'var(--flow-muted)', textDecoration: 'none' }}>Blog</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
