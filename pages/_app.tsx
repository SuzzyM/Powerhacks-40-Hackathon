import type { AppProps } from 'next/app';
import { CommunityProvider } from '@/src/contexts/CommunityContext';
import '@/styles/globals.css';

import { UserProvider } from '@/src/contexts/UserContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <CommunityProvider>
        <Component {...pageProps} />
      </CommunityProvider>
    </UserProvider>
  );
}

