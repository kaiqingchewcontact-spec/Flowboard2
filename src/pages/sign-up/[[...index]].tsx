import { SignUp } from '@clerk/nextjs';
import Head from 'next/head';

export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>Sign up — Flowboard</title>
      </Head>
      <div className="min-h-screen bg-flow-paper flex items-center justify-center px-6">
        <SignUp />
      </div>
    </>
  );
}
