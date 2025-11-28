import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import QuickExitButton from '@/src/components/QuickExitButton';
import { useCommunity } from '@/src/contexts/CommunityContext';

/**
 * New Thread Creation Page
 * 
 * SECURITY: This page allows users to create new forum threads.
 * All posts must use anonymized IDs from CommunityContext.
 * 
 * In production:
 * 1. Validate and sanitize all inputs server-side
 * 2. Reject posts containing identifying information
 * 3. Implement rate limiting (max 5 posts per hour)
 * 4. Store posts with only anonymous IDs
 */
export default function NewThread() {
  const router = useRouter();
  const { anonymousId } = useCommunity();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // SECURITY: Validate inputs
    if (!title.trim() || title.trim().length < 3) {
      setError('Title must be at least 3 characters long');
      return;
    }

    if (!content.trim() || content.trim().length < 10) {
      setError('Content must be at least 10 characters long');
      return;
    }

    // SECURITY: Check for identifying information
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
    
    if (emailPattern.test(title) || emailPattern.test(content)) {
      setError('Posts cannot contain email addresses');
      return;
    }

    if (phonePattern.test(title) || phonePattern.test(content)) {
      setError('Posts cannot contain phone numbers');
      return;
    }

    setSubmitting(true);

    try {
      // SECURITY: In production, this would call /api/forum with POST
      const response = await fetch('/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          authorId: anonymousId, // SECURITY: Use anonymized ID
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create thread');
      }

      const data = await response.json();
      
      // Redirect to the new thread
      router.push(`/community/thread/${data.id}`);
    } catch (err) {
      console.error('Error creating thread:', err);
      setError(err instanceof Error ? err.message : 'Failed to create thread. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>New Thread - SafeHarbor Community</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="fixed top-4 right-4 z-50">
          <QuickExitButton />
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <Link
                href="/community"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Back to Forum
              </Link>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Create New Thread
            </h1>

            {/* Security Notice */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-6">
              <p className="text-sm text-blue-800">
                <strong>Privacy:</strong> Your post will be anonymous. Your ID: <code className="bg-blue-100 px-1 rounded">{anonymousId}</code>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded mb-6">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Thread Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  minLength={3}
                  maxLength={200}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter thread title..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {title.length}/200 characters
                </p>
              </div>

              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your post content here..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {content.length}/5000 characters
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Security Reminder:</strong> Do not include any personal information, 
                  email addresses, phone numbers, or identifying details in your post.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-md transition-colors"
                >
                  {submitting ? 'Creating...' : 'Create Thread'}
                </button>
                <Link
                  href="/community"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-md transition-colors text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

