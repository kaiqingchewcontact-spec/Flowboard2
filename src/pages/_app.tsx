import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ClerkProvider } from '@clerk/nextjs';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      <div className="grain">
        <Component {...pageProps} />
      </div>
    </ClerkProvider>
  );
}
