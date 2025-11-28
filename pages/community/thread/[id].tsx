import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import QuickExitButton from '@/src/components/QuickExitButton';
import { useCommunity } from '@/src/contexts/CommunityContext';
import ForumPost from '@/src/components/ForumPost';

/**
 * Individual Thread View Page
 * 
 * SECURITY: This page displays a forum thread and its replies.
 * All author IDs are anonymized and non-traceable.
 * 
 * In production:
 * 1. Fetch thread data from /api/forum endpoint
 * 2. Validate thread ID server-side
 * 3. Sanitize all content before display
 * 4. Implement rate limiting on replies
 */
interface Reply {
  id: string;
  content: string;
  authorId: string; // SECURITY: Anonymized ID
  createdAt: string;
}

interface Thread {
  id: string;
  title: string;
  content: string;
  authorId: string; // SECURITY: Anonymized ID
  createdAt: string;
  replies: Reply[];
}

export default function ThreadView() {
  const router = useRouter();
  const { id } = router.query;
  const { anonymousId } = useCommunity();
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // SECURITY: Fetch from /api/forum?threadId=${id}
    const fetchThread = async () => {
      try {
        const response = await fetch(`/api/forum?threadId=${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch thread');
        }

        const data = await response.json();
        
        // Transform API response to Thread format
        const threadData: Thread = {
          id: data.id,
          title: data.title,
          content: data.content,
          authorId: data.authorId,
          createdAt: data.createdAt,
          replies: data.replies || [],
        };

        setThread(threadData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching thread:', err);
        setError('Failed to load thread');
        setLoading(false);
      }
    };

    fetchThread();
  }, [id]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!replyContent.trim() || replyContent.trim().length < 10) {
      setError('Reply must be at least 10 characters long');
      return;
    }

    // SECURITY: Check for identifying information
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
    
    if (emailPattern.test(replyContent) || phonePattern.test(replyContent)) {
      setError('Replies cannot contain email addresses or phone numbers');
      return;
    }

    setSubmitting(true);

    try {
      // SECURITY: In production, POST to /api/forum with threadId
      const response = await fetch('/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: replyContent.trim(),
          authorId: anonymousId,
          threadId: id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to post reply');
      }

      // Refresh thread to show new reply
      router.reload();
    } catch (err) {
      console.error('Error posting reply:', err);
      setError(err instanceof Error ? err.message : 'Failed to post reply. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading Thread - SafeHarbor Community</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center text-slate-100">
          <p>Loading thread...</p>
        </div>
      </>
    );
  }

  if (!thread) {
    return (
      <>
        <Head>
          <title>Thread Not Found - SafeHarbor Community</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50">
          <div className="fixed top-4 right-4 z-50">
            <QuickExitButton />
          </div>
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Thread Not Found</h1>
              <p className="text-slate-200 mb-6">The thread you&apos;re looking for doesn&apos;t exist or has been removed.</p>
              <Link
                href="/community"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-6 rounded-full transition-colors inline-block"
              >
                Back to Forum
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{thread.title} - SafeHarbor Community</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50">
        <div className="fixed top-4 right-4 z-50">
          <QuickExitButton />
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/community"
                className="text-xs font-medium text-emerald-200 hover:text-emerald-100"
              >
                ← Back to Forum
              </Link>
              <p className="text-[11px] text-slate-300">
                Please share only what feels safe. You are always posting as an anonymous contributor.
              </p>
            </div>

            {/* Thread Content */}
            <section className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-50">
                {thread.title}
              </h1>
              <ForumPost
                authorId={thread.authorId}
                createdAt={thread.createdAt}
                content={thread.content}
                isOriginalPost
              />

              {/* Replies Section */}
              <div className="mt-4 space-y-3">
                <h2 className="text-lg md:text-xl font-semibold text-slate-50">
                  Replies ({thread.replies.length})
                </h2>

                {thread.replies.length === 0 ? (
                  <p className="text-sm text-slate-300 text-center py-8">
                    No replies yet. If it feels okay, you can be the first to respond.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {thread.replies.map((reply) => (
                      <ForumPost
                        key={reply.id}
                        authorId={reply.authorId}
                        createdAt={reply.createdAt}
                        content={reply.content}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Reply Form */}
            <section className="bg-slate-900/85 border border-slate-700 rounded-xl shadow-md p-5 space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-slate-50">
                Post a Reply
              </h2>

              {error && (
                <div className="bg-rose-900/40 border border-rose-500/70 rounded-md p-3 text-xs text-rose-100">
                  {error}
                </div>
              )}

              {/* CONFIDENTIALITY NOTICE */}
              <div className="bg-amber-900/40 border border-amber-600/80 rounded-md p-3 text-xs text-amber-100">
                <p className="mb-1 font-semibold uppercase tracking-wide text-[11px]">
                  Confidentiality &amp; Anonymity
                </p>
                <p>
                  This forum is anonymous and your post will appear under a system-generated
                  pseudonym. Please avoid sharing any personally identifying information (names,
                  phone numbers, emails, exact locations, or usernames from other platforms).
                </p>
              </div>

              <form onSubmit={handleReply}>
                <div className="mb-3">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    required
                    minLength={10}
                    maxLength={2000}
                    rows={5}
                    className="w-full rounded-lg border border-slate-600 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="You can share what resonates with you, how you’ve handled similar situations, or offer gentle support..."
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    {replyContent.length}/2000 characters
                  </p>
                </div>

                <p className="text-[11px] text-slate-400 mb-3">
                  You are currently posting as an anonymous contributor with ID:{' '}
                  <code className="bg-slate-900/80 border border-slate-700 rounded px-2 py-0.5 text-[10px]">
                    {anonymousId}
                  </code>
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition-colors"
                >
                  {submitting ? 'Posting...' : 'Post Reply'}
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

