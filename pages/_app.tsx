import type { AppProps } from 'next/app';
import { CommunityProvider } from '@/src/contexts/CommunityContext';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CommunityProvider>
      <Component {...pageProps} />
    </CommunityProvider>
  );
}

