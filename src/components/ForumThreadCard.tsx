import Link from 'next/link';
import React from 'react';
import AnonymousBadge from '@/src/components/AnonymousBadge';
import { generatePseudonym } from '@/src/utils/pseudonym';

interface ForumThreadCardProps {
  id: string;
  title: string;
  authorId: string;
  createdAt: string;
  replyCount: number;
  snippet?: string;
  lastActivity?: string;
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
  return date.toLocaleDateString();
}

/**
 * ForumThreadCard
 *
 * Softly-styled card representing a single thread in the forum list.
 * Emphasizes anonymity and calm visual hierarchy.
 */
const ForumThreadCard: React.FC<ForumThreadCardProps> = ({
  id,
  title,
  authorId,
  createdAt,
  replyCount,
  snippet,
  lastActivity,
}) => {
  const pseudonym = generatePseudonym(authorId);
  const relative = formatRelativeTime(lastActivity || createdAt);

  return (
    <Link href={`/community/thread/${id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-xl">
      <article className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 md:px-5 md:py-4 shadow-sm hover:shadow-md hover:border-indigo-400/80 transition-all">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-sm md:text-base font-semibold text-slate-50 mb-1 line-clamp-2">
              {title}
            </h2>
            {snippet && (
              <p className="text-xs md:text-sm text-slate-300 line-clamp-1">
                {snippet}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] md:text-xs text-slate-300">
              <AnonymousBadge pseudonym={pseudonym} />
              <span className="text-slate-400">•</span>
              <span>{relative}</span>
              <span className="text-slate-400">•</span>
              <span>{replyCount} repl{replyCount === 1 ? 'y' : 'ies'}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ForumThreadCard;


