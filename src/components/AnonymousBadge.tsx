import React from 'react';

/**
 * AnonymousBadge
 *
 * Small, reusable badge to reinforce that all contributors are anonymous.
 * Can optionally display a soft pseudonym to help with readability.
 */
interface AnonymousBadgeProps {
  pseudonym?: string;
  className?: string;
}

const AnonymousBadge: React.FC<AnonymousBadgeProps> = ({ pseudonym, className }) => {
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-slate-500/70 bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-100 ${className || ''}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
      <span>Anonymous Contributor</span>
      {pseudonym && (
        <span className="text-[10px] text-slate-300 normal-case">
          • {pseudonym}
        </span>
      )}
    </div>
  );
};

export default AnonymousBadge;


