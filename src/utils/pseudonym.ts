/**
 * Pseudonym utilities for anonymous forum authors.
 *
 * SECURITY:
 * - These pseudonyms are generated from anonymous, non-traceable IDs
 *   provided by CommunityContext or the backend.
 * - They MUST NEVER be generated from real names, emails, or any
 *   identifying information.
 */

const ADJECTIVES = [
  'Brave',
  'Calm',
  'Quiet',
  'Gentle',
  'Kind',
  'Steady',
  'Hopeful',
  'Bright',
  'Caring',
  'Soft',
];

const NOUNS = [
  'Harbor',
  'Star',
  'River',
  'Willow',
  'Lantern',
  'Sky',
  'Anchor',
  'Horizon',
  'Oak',
  'Ember',
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * generatePseudonym
 *
 * Deterministically generates a soft, non-identifying pseudonym based on an
 * anonymous ID. This helps reinforce anonymity while making conversations
 * easier to follow than raw IDs.
 */
export function generatePseudonym(anonymousId: string): string {
  const hash = hashString(anonymousId || 'anon');
  const adjective = ADJECTIVES[hash % ADJECTIVES.length];
  const noun = NOUNS[(hash >> 8) % NOUNS.length];
  const number = (hash % 900) + 100; // 100–999
  return `${adjective}${noun}-${number}`;
}


