import { SignIn } from '@clerk/nextjs';
import Head from 'next/head';

export default function SignInPage() {
  return (
    <>
      <Head>
        <title>Sign in — Flowboard</title>
      </Head>
      <div className="min-h-screen bg-flow-paper flex items-center justify-center px-6">
        <SignIn />
      </div>
    </>
  );
}
