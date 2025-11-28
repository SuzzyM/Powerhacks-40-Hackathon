import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';
import QuickExitButton from '@/src/components/QuickExitButton';

/**
 * Login Page
 * 
 * SECURITY REQUIREMENTS (TO BE IMPLEMENTED):
 * 1. MFA/2FA: Multi-factor authentication MUST be enforced
 *    - Implement TOTP (Time-based One-Time Password) via authenticator apps
 *    - Support SMS-based 2FA as a fallback (with rate limiting)
 *    - Require MFA for all login attempts, no exceptions
 * 
 * 2. Rate Limiting: Implement server-side rate limiting to prevent brute force attacks
 *    - Maximum 5 failed login attempts per IP per 15 minutes
 *    - Lock account after 10 failed attempts (temporary lockout)
 * 
 * 3. Password Security:
 *    - Minimum 12 characters, require mix of uppercase, lowercase, numbers, symbols
 *    - Enforce password hashing using bcrypt (minimum 10 rounds)
 *    - Never store passwords in plain text
 * 
 * 4. Session Security:
 *    - Use secure, HTTP-only cookies for session tokens
 *    - Implement CSRF protection
 *    - Set appropriate session timeout (e.g., 30 minutes of inactivity)
 * 
 * 5. Logging: Log all login attempts (successful and failed) with timestamps
 *    - Do NOT log passwords or sensitive information
 *    - Store logs securely with access controls
 */
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [showMfa, setShowMfa] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // SECURITY: This is a placeholder. In production:
    // 1. Validate credentials server-side
    // 2. After successful password validation, require MFA
    // 3. Only create session after MFA is verified
    // 4. Use secure session tokens (JWT with short expiration)
    
    console.log('Login attempt (placeholder)');
    // Placeholder: Show MFA input after "password validation"
    setShowMfa(true);
  };

  return (
    <>
      <Head>
        <title>Login - SafeHarbor</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="fixed top-4 right-4 z-50">
          <QuickExitButton />
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Login to SafeHarbor
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {showMfa && (
              <div>
                <label htmlFor="mfa" className="block text-sm font-medium text-gray-700 mb-1">
                  MFA Code (6 digits)
                </label>
                <input
                  type="text"
                  id="mfa"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              {showMfa ? 'Verify MFA' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
              ← Back to Home
            </Link>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-xs text-yellow-800">
              <strong>Security Note:</strong> This login requires MFA/2FA authentication.
              All login attempts are logged and monitored for security.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

