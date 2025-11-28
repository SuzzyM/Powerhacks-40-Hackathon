import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * CommunityContext
 * 
 * SECURITY: This context enforces anonymous, non-traceable usernames
 * for all forum posts. User identifiers are generated client-side and
 * are not linked to any persistent account or personal information.
 * 
 * In production, this should:
 * 1. Generate random, non-reversible identifiers
 * 2. Store identifiers only in session storage (not localStorage)
 * 3. Never log or transmit any identifying information
 * 4. Implement server-side validation to ensure no real names/emails
 *    are accepted in forum posts
 */
interface CommunityContextType {
  anonymousId: string;
  generateNewAnonymousId: () => void;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // SECURITY: Generate a random, non-traceable identifier
  // This should be regenerated per session and never stored persistently
  const generateAnonymousId = (): string => {
    // Generate a random identifier that cannot be traced back to the user
    const prefix = 'anon';
    const randomPart = Math.random().toString(36).substring(2, 10);
    const timestamp = Date.now().toString(36);
    return `${prefix}_${randomPart}_${timestamp}`;
  };

  const [anonymousId, setAnonymousId] = useState<string>(() => {
    // SECURITY: Only use sessionStorage, never localStorage
    // This ensures the ID is cleared when the browser session ends
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('safeharbor_anonymous_id');
      if (stored) {
        return stored;
      }
      const newId = generateAnonymousId();
      sessionStorage.setItem('safeharbor_anonymous_id', newId);
      return newId;
    }
    return generateAnonymousId();
  });

  const generateNewAnonymousId = () => {
    const newId = generateAnonymousId();
    setAnonymousId(newId);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('safeharbor_anonymous_id', newId);
    }
  };

  return (
    <CommunityContext.Provider value={{ anonymousId, generateNewAnonymousId }}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};

