import Head from 'next/head';
import { useState } from 'react';
import QuickExitButton from '@/src/components/QuickExitButton';

/**
 * Self-Care Page (Journaling & Safety Plan)
 *
 * DESCRIPTION:
 * A highly private, authenticated page dedicated to emotional support and planning.
 *
 * SECURITY:
 * - This page SHOULD be protected by authentication and authorization middleware
 *   (e.g., require a logged-in user session before rendering).
 * - Journal data and safety plans are extremely sensitive.
 * - Journal entries and safety plans MUST be end-to-end encrypted (E2E) between
 *   the user's device and the database. The server should only store ciphertext,
 *   not readable/plaintext content.
 * - Encryption keys SHOULD be derived and managed client-side (e.g., per-user keys),
 *   and NEVER logged or sent to analytics.
 */

interface SafetyPlan {
  internalCoping: string;
  trustedContacts: string;
  distractionActivities: string;
  professionalContacts: string;
}

export default function SelfCare() {
  const [journalEntry, setJournalEntry] = useState('');
  const [savingJournal, setSavingJournal] = useState(false);
  const [journalStatus, setJournalStatus] = useState<string | null>(null);

  const [safetyPlan, setSafetyPlan] = useState<SafetyPlan>({
    internalCoping: '',
    trustedContacts: '',
    distractionActivities: '',
    professionalContacts: '',
  });
  const [savingPlan, setSavingPlan] = useState(false);
  const [planStatus, setPlanStatus] = useState<string | null>(null);

  /**
   * SECURITY NOTE (E2E ENCRYPTION – JOURNALING):
   * Before sending the journalEntry to the backend, the client MUST:
   * - Encrypt the content using a per-user or per-session encryption key.
   * - Only send ciphertext + necessary metadata (e.g., IV, salt) to /api/journal.
   * - Never send raw plaintext journal entries over the network.
   *
   * Placeholder below assumes plaintext for demo purposes ONLY.
   */
  const handleSaveJournal = async () => {
    if (!journalEntry.trim()) {
      setJournalStatus('Journal entry cannot be empty.');
      return;
    }

    setSavingJournal(true);
    setJournalStatus(null);

    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'journal',
          // TODO: Encrypt this content client-side before sending.
          // ciphertext: encrypt(journalEntry, userKey)
          content: journalEntry.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save journal entry.');
      }

      setJournalStatus('Journal entry saved securely (placeholder).');
      // Optionally clear after save
      // setJournalEntry('');
    } catch (error) {
      console.error('Error saving journal entry:', error);
      setJournalStatus('Unable to save entry right now. Please try again later.');
    } finally {
      setSavingJournal(false);
    }
  };

  /**
   * SECURITY NOTE (E2E ENCRYPTION – SAFETY PLAN):
   * The safety plan contains highly sensitive data (contacts, strategies).
   * - MUST be encrypted end-to-end before being sent to /api/journal.
   * - Server stores only encrypted blobs and minimal metadata.
   */
  const handleSaveSafetyPlan = async () => {
    setSavingPlan(true);
    setPlanStatus(null);

    try {
      const response = await fetch('/api/journal', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'safety-plan',
          // TODO: Encrypt this structure client-side before sending.
          // ciphertext: encrypt(JSON.stringify(safetyPlan), userKey)
          plan: safetyPlan,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save safety plan.');
      }

      setPlanStatus('Safety plan saved securely (placeholder).');
    } catch (error) {
      console.error('Error saving safety plan:', error);
      setPlanStatus('Unable to save safety plan right now. Please try again later.');
    } finally {
      setSavingPlan(false);
    }
  };

  const handleSafetyPlanChange = (field: keyof SafetyPlan, value: string) => {
    setSafetyPlan((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Head>
        <title>Self-Care: Journaling & Safety Plan - SafeHarbor</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50">
        <div className="fixed top-4 right-4 z-50">
          <QuickExitButton />
        </div>

        <div className="container mx-auto px-4 py-16 max-w-5xl">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Self-Care: Journaling & Safety Plan
            </h1>
            <p className="text-slate-200 max-w-2xl">
              This is a private space for you to reflect, process what&apos;s happening,
              and build a safety plan that feels right for you.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Journaling Section */}
            <section className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-2">Daily Journal</h2>
              <p className="text-sm text-slate-200 mb-4">
                Write freely about what you&apos;re feeling, noticing, or planning. This space
                is for you.
              </p>

              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-900/60 text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                placeholder="You can write about what happened today, what you're worried about, or any small steps you took to stay safe..."
              />
              <p className="mt-1 text-xs text-slate-400">
                {journalEntry.length} characters
              </p>

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveJournal}
                  disabled={savingJournal}
                  className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
                >
                  {savingJournal ? 'Saving...' : 'Save Journal Entry'}
                </button>
                {journalStatus && (
                  <p className="text-xs text-slate-200">{journalStatus}</p>
                )}
              </div>

              <div className="mt-4 bg-slate-900/60 border border-slate-700 rounded-lg p-3">
                <p className="text-xs text-slate-300">
                  <strong>Security Note:</strong> In the full implementation, your journal
                  entries will be end-to-end encrypted on your device before being stored,
                  so that only you (and not even the server) can read them.
                </p>
              </div>
            </section>

            {/* Safety Plan Section */}
            <section className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-2">My Safety Plan</h2>
              <p className="text-sm text-slate-200 mb-4">
                You can use this space to outline what helps you cope, who you can reach out
                to, and what you can do if things feel unsafe.
              </p>

              <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Internal Coping Strategies
                  </label>
                  <p className="text-xs text-slate-300 mb-1">
                    Examples: breathing exercises, grounding techniques, mantras, music,
                    journaling, movement.
                  </p>
                  <textarea
                    value={safetyPlan.internalCoping}
                    onChange={(e) =>
                      handleSafetyPlanChange('internalCoping', e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-900/60 text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                    placeholder="- 5–4–3–2–1 grounding\n- Box breathing\n- Remind myself: “I deserve to be safe.”"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Trusted Contacts
                  </label>
                  <p className="text-xs text-slate-300 mb-1">
                    People you can contact when you need support (first name &amp; safe
                    contact method).
                  </p>
                  <textarea
                    value={safetyPlan.trustedContacts}
                    onChange={(e) =>
                      handleSafetyPlanChange('trustedContacts', e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-900/60 text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                    placeholder="- A. (friend) – text only\n- B. (family) – call in daytime\n- C. (neighbor) – safe to visit"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Distraction / Safe Activities
                  </label>
                  <p className="text-xs text-slate-300 mb-1">
                    Places you can go or things you can do that feel safer or more calming.
                  </p>
                  <textarea
                    value={safetyPlan.distractionActivities}
                    onChange={(e) =>
                      handleSafetyPlanChange('distractionActivities', e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-900/60 text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                    placeholder="- Walk in a public park\n- Sit in a café or library\n- Watch a comfort show\n- Journal or draw"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Professional & Crisis Contacts
                  </label>
                  <p className="text-xs text-slate-300 mb-1">
                    Hotlines, therapists, advocates, or other professionals who can help.
                    (Only include what feels safe to store.)
                  </p>
                  <textarea
                    value={safetyPlan.professionalContacts}
                    onChange={(e) =>
                      handleSafetyPlanChange('professionalContacts', e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-900/60 text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                    placeholder="- Local DV hotline: ...\n- Therapist: ...\n- National crisis line: ..."
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveSafetyPlan}
                  disabled={savingPlan}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
                >
                  {savingPlan ? 'Saving...' : 'Save Safety Plan'}
                </button>
                {planStatus && (
                  <p className="text-xs text-slate-200">{planStatus}</p>
                )}
              </div>

              <div className="mt-4 bg-slate-900/60 border border-slate-700 rounded-lg p-3">
                <p className="text-xs text-slate-300">
                  <strong>Security Note:</strong> Your safety plan is sensitive. In the full
                  implementation, it will be stored only as encrypted data, with keys
                  controlled from your side, and access tightly limited.
                </p>
              </div>
            </section>
          </div>

          <div className="mt-8 bg-amber-900/50 border border-amber-700 rounded-lg p-4 text-sm text-amber-100">
            <p>
              <strong>Reminder:</strong> If you are in immediate danger, please contact local
              emergency services or a trusted hotline in your area. This page is meant to
              support your planning and reflection, but it cannot respond to real-time
              emergencies.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}


