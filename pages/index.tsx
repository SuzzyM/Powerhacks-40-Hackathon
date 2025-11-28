import Head from 'next/head';
import Link from 'next/link';
import QuickExitButton from '@/src/components/QuickExitButton';

/**
 * Homepage
 * 
 * SECURITY: This page is designed to be discreet and focus on safety.
 * The Quick Exit button is prominently displayed for immediate access.
 */
export default function Home() {
  return (
    <>
      <Head>
        <title>SafeHarbor - Safety and Support</title>
        <meta name="description" content="SafeHarbor - A safe space for community, resources, and support" />
        {/* SECURITY: Additional no-index meta tag */}
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Quick Exit Button - Always visible */}
        <div className="fixed top-4 right-4 z-50">
          <QuickExitButton />
        </div>

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to SafeHarbor
            </h1>
            <p className="text-xl text-gray-700 mb-12">
              A safe space for community, resources, and confidential support
            </p>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <Link href="/community">
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Community Forum
                  </h2>
                  <p className="text-gray-600">
                    Connect with others in a safe, anonymous space
                  </p>
                </div>
              </Link>

              <Link href="/resources">
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Resources
                  </h2>
                  <p className="text-gray-600">
                    Find local and national support resources
                  </p>
                </div>
              </Link>

              <Link href="/chat">
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    AI Chat Support
                  </h2>
                  <p className="text-gray-600">
                    Confidential AI-powered assistance
                  </p>
                </div>
              </Link>

              <Link href="/sos">
                <div className="bg-red-50 border-2 border-red-300 rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer">
                  <h2 className="text-2xl font-semibold text-red-800 mb-2">
                    Emergency SOS
                  </h2>
                  <p className="text-red-600">
                    Immediate emergency assistance
                  </p>
                </div>
              </Link>
            </div>

            {/* Safety Notice */}
            <div className="mt-12 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Safety Reminder:</strong> If you need to leave this site quickly,
                use the Quick Exit button in the top right corner.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

