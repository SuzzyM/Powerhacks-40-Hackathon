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

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50">
        {/* Quick Exit Button - Always visible */}
        <div className="fixed top-4 right-4 z-50">
          <QuickExitButton />
        </div>

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Hero Section with supportive imagery */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  A quieter corner of the internet,
                  <span className="block text-indigo-300">made for your safety.</span>
                </h1>
                <p className="text-base md:text-lg text-slate-200 mb-4">
                  SafeHarbor is a discreet space for people impacted by digital harm to find
                  community, resources, and confidential support.
                </p>
                <p className="text-sm text-slate-300 mb-6">
                  No public profiles. No search indexing. A focus on privacy, choice, and
                  small steps toward feeling safer online.
                </p>

                <div className="flex flex-wrap gap-3 mb-6">
                  <Link
                    href="/community"
                    className="inline-flex items-center justify-center rounded-full bg-indigo-500 hover:bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition-colors"
                  >
                    Enter Community Forum
                  </Link>
                  <Link
                    href="/self-care"
                    className="inline-flex items-center justify-center rounded-full border border-violet-300/60 bg-violet-500/10 px-5 py-2 text-sm font-semibold text-violet-100 hover:border-violet-200 hover:bg-violet-500/20 transition-colors"
                  >
                    Open Self-Care Space
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs md:text-sm text-slate-200">
                  <div className="flex items-start gap-2">
                    <span className="mt-[2px] text-emerald-300">●</span>
                    <p>No real names required in the community forum.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-[2px] text-emerald-300">●</span>
                    <p>AI chat proxied through a secure backend (no keys in the browser).</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-[2px] text-emerald-300">●</span>
                    <p>Journaling &amp; safety plans designed for end‑to‑end encryption.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-[2px] text-emerald-300">●</span>
                    <p>Quick Exit always visible in case you need to leave fast.</p>
                  </div>
                </div>
              </div>

              {/* Imagery related to survivors of digital harm */}
              <div className="space-y-4">
                <div
                  className="relative h-56 md:h-64 rounded-2xl overflow-hidden shadow-2xl bg-slate-900/80 border border-slate-700"
                  aria-label="Person using a laptop in a calm space, representing survivors finding support online"
                >
                  <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1181568/pexels-photo-1181568.jpeg')] bg-cover bg-center opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/40 to-transparent" />
                  <div className="relative h-full w-full flex flex-col justify-end p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-200 mb-1">
                      Survivors of digital harm
                    </p>
                    <p className="text-sm font-semibold text-slate-50 max-w-sm">
                      “I thought I was alone until I found stories from people who had been
                      through the same kind of online abuse.”
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="relative h-32 rounded-xl overflow-hidden shadow-lg bg-slate-900/80 border border-slate-700"
                    aria-label="Supportive hands and devices symbolizing community and tech safety"
                  >
                    <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1181352/pexels-photo-1181352.jpeg')] bg-cover bg-center opacity-70" />
                    <div className="absolute inset-0 bg-slate-900/40" />
                    <div className="relative h-full w-full flex items-end p-3">
                      <p className="text-xs font-medium text-slate-50">
                        Community &amp; tech-safety allies
                      </p>
                    </div>
                  </div>
                  <div
                    className="relative h-32 rounded-xl overflow-hidden shadow-lg bg-slate-900/80 border border-slate-700"
                    aria-label="Notebook and phone symbolizing planning and small steps"
                  >
                    <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3808904/pexels-photo-3808904.jpeg')] bg-cover bg-center opacity-70" />
                    <div className="absolute inset-0 bg-slate-900/40" />
                    <div className="relative h-full w-full flex items-end p-3">
                      <p className="text-xs font-medium text-slate-50">
                        Planning small, safe next steps
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Navigation Cards */}
            <section aria-label="Main areas of SafeHarbor">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/community">
                  <div className="bg-slate-900/70 border border-slate-700 rounded-xl shadow-md p-6 hover:shadow-xl hover:border-indigo-400/80 transition-all cursor-pointer">
                    <h2 className="text-2xl font-semibold text-slate-50 mb-2">
                      Community Forum
                    </h2>
                    <p className="text-slate-200 text-sm mb-3">
                      Anonymous discussions with others who understand digital harm, moderated
                      for safety.
                    </p>
                    <p className="text-xs text-slate-400">
                      No real names • Anonymized IDs • Trauma-aware moderation (design).
                    </p>
                  </div>
                </Link>

                <Link href="/resources">
                  <div className="bg-slate-900/70 border border-slate-700 rounded-xl shadow-md p-6 hover:shadow-xl hover:border-emerald-400/80 transition-all cursor-pointer">
                    <h2 className="text-2xl font-semibold text-slate-50 mb-2">
                      Resources
                    </h2>
                    <p className="text-slate-200 text-sm mb-3">
                      Hotlines, tech-safety specialists, digital forensics, cyber-law attorneys,
                      and local agencies.
                    </p>
                    <p className="text-xs text-slate-400">
                      Carefully organized so you can reach out when and how it feels right.
                    </p>
                  </div>
                </Link>

                <Link href="/chat">
                  <div className="bg-slate-900/70 border border-slate-700 rounded-xl shadow-md p-6 hover:shadow-xl hover:border-sky-400/80 transition-all cursor-pointer">
                    <h2 className="text-2xl font-semibold text-slate-50 mb-2">
                      AI Chat Support
                    </h2>
                    <p className="text-slate-200 text-sm mb-3">
                      A confidential space to ask questions, explore options, or practice what you
                      might say to others.
                    </p>
                    <p className="text-xs text-slate-400">
                      Proxied through a secure backend • No keys in the browser • Session-based
                      only.
                    </p>
                  </div>
                </Link>

                <Link href="/self-care">
                  <div className="bg-gradient-to-br from-purple-900/80 via-violet-800/80 to-indigo-900/80 border border-purple-400/70 rounded-xl shadow-md p-6 hover:shadow-2xl hover:border-purple-300 transition-all cursor-pointer">
                    <h2 className="text-2xl font-semibold text-slate-50 mb-2">
                      Journaling &amp; Safety Plan
                    </h2>
                    <p className="text-slate-100 text-sm mb-3">
                      A quieter space to write, map out coping strategies, and build a safety plan
                      that fits your life.
                    </p>
                    <p className="text-xs text-slate-200">
                      Designed for end‑to‑end encrypted storage of journal entries and plans.
                    </p>
                  </div>
                </Link>
              </div>
            </section>

            {/* Safety Notice */}
            <section className="bg-amber-900/40 border border-amber-600/80 rounded-lg p-4">
              <p className="text-xs md:text-sm text-amber-100">
                <strong>Safety Reminder:</strong> If you need to leave this site quickly, use the
                Quick Exit button in the top right corner. Consider clearing your browser history
                if it is safe to do so. Only use this site on devices and connections that feel as
                safe as possible for you.
              </p>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

