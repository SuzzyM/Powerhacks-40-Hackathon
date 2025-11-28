import React from 'react';
import AnonymousBadge from '@/src/components/AnonymousBadge';
import { generatePseudonym } from '@/src/utils/pseudonym';

interface ForumPostProps {
  authorId: string;
  createdAt: string;
  content: string;
  isOriginalPost?: boolean;
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} min${diffMin === 1 ? '' : 's'} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
  return date.toLocaleString();
}

/**
 * ForumPost
 *
 * Renders a single post within a thread with:
 * - Soft background/border
 * - Anonymous badge
 * - Relative timestamp
 * - Moderation tool placeholders (report/block)
 */
const ForumPost: React.FC<ForumPostProps> = ({
  authorId,
  createdAt,
  content,
  isOriginalPost = false,
}) => {
  const pseudonym = generatePseudonym(authorId);
  const relative = formatRelativeTime(createdAt);

  return (
    <article
      className={`rounded-xl border px-4 py-3 md:px-5 md:py-4 shadow-sm ${
        isOriginalPost
          ? 'border-indigo-400/70 bg-slate-900/80'
          : 'border-slate-700 bg-slate-900/70'
      }`}
    >
      <header className="mb-2 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <AnonymousBadge pseudonym={pseudonym} />
          <p className="text-[11px] md:text-xs text-slate-300">
            Posted {relative}
          </p>
        </div>

        {/* Moderation tools (placeholders) */}
        <div className="flex items-center gap-2 text-slate-400">
          {/* SECURITY: These are placeholders – in production they should trigger
              a secure report/block workflow with rate limiting and audit logging. */}
          <button
            type="button"
            className="rounded-full px-2 py-1 text-[10px] md:text-xs border border-slate-600 hover:border-amber-400 hover:text-amber-200 transition-colors"
            aria-label="Report this post (placeholder)"
          >
            Report
          </button>
          <button
            type="button"
            className="rounded-full px-2 py-1 text-[10px] md:text-xs border border-slate-600 hover:border-rose-400 hover:text-rose-200 transition-colors"
            aria-label="Block this anonymous contributor (placeholder)"
          >
            Block
          </button>
        </div>
      </header>

      <div className="text-sm md:text-base text-slate-100 whitespace-pre-wrap">
        {content}
      </div>
    </article>
  );
};

export default ForumPost;


