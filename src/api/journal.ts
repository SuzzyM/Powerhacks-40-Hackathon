import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../utils/supabase';

type JournalPayload =
  | {
    type: 'journal';
    content: string; // In production, this should be ciphertext
  }
  | {
    type: 'safety-plan';
    plan: unknown; // In production, this should be ciphertext
  };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // SECURITY: Require authentication here (e.g., check session or JWT)
  // For now, we'll assume the client sends a user_id in headers or body for this demo
  // In a real app, use supabase.auth.getUser() with the access token

  // Mock user ID for demo purposes if not provided
  const userId = req.headers['x-user-id'] as string || '00000000-0000-0000-0000-000000000000';

  if (req.method === 'POST') {
    const body = req.body as JournalPayload;

    if (!body || body.type !== 'journal') {
      return res.status(400).json({ error: 'Invalid payload type for POST' });
    }

    if (!body.content) {
      return res.status(400).json({ error: 'Journal content is required' });
    }

    // In a real app, 'content' would be ciphertext.
    // We'll store it as is for now, but the schema expects ciphertext/iv.
    // We'll mock the IV.

    const { data, error } = await supabase
      .from('journal_entries')
      .insert([
        {
          user_id: userId,
          ciphertext: body.content, // Storing plaintext as ciphertext for demo
          iv: 'mock_iv',
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      id: data.id,
      message: 'Journal entry stored.',
      createdAt: data.created_at,
    });
  }

  if (req.method === 'GET') {
    const { type } = req.query;

    if (type === 'safety-plan') {
      const { data, error } = await supabase
        .from('safety_plans')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        type: 'safety-plan',
        plan: data ? data.ciphertext : null, // Returning "ciphertext" as plan
        message: 'Safety plan retrieved.',
      });
    }

    // Get Journal Entries
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      type: 'journal',
      entries: data || [],
      message: 'Journal entries retrieved.',
    });
  }

  if (req.method === 'PUT') {
    const body = req.body as JournalPayload;

    if (!body || body.type !== 'safety-plan') {
      return res.status(400).json({ error: 'Invalid payload type for PUT' });
    }

    // Upsert Safety Plan
    const { data, error } = await supabase
      .from('safety_plans')
      .upsert([
        {
          user_id: userId,
          ciphertext: JSON.stringify(body.plan), // Storing plan as string
          iv: 'mock_iv',
          updated_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      message: 'Safety plan stored.',
      updatedAt: data.updated_at,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
