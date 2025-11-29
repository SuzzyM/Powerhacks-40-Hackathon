import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../utils/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { threadId, page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum - 1;

    if (threadId) {
      // Fetch single thread
      const { data: thread, error: threadError } = await supabase
        .from('forum_threads')
        .select('*')
        .eq('id', threadId)
        .single();

      if (threadError) {
        return res.status(500).json({ error: threadError.message });
      }

      // Fetch replies
      const { data: replies, error: repliesError } = await supabase
        .from('forum_posts')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (repliesError) {
        return res.status(500).json({ error: repliesError.message });
      }

      return res.status(200).json({
        ...thread,
        replies: replies || [],
      });
    }

    // Fetch list of threads
    const { data: threads, error, count } = await supabase
      .from('forum_threads')
      .select('*', { count: 'exact' })
      .order('last_activity', { ascending: false })
      .range(start, end);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      threads: threads || [],
      page: pageNum,
      totalPages: count ? Math.ceil(count / limitNum) : 1,
    });
  }

  if (req.method === 'POST') {
    const { title, content, authorId, threadId } = req.body;

    if (!authorId || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Basic content validation (keep existing logic)
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    if (emailPattern.test(content)) {
      return res.status(400).json({ error: 'Content cannot contain email addresses' });
    }

    if (threadId) {
      // Create Reply
      const { data, error } = await supabase
        .from('forum_posts')
        .insert([
          { thread_id: threadId, content, author_id: authorId }
        ])
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // Update thread last_activity
      await supabase
        .from('forum_threads')
        .update({ last_activity: new Date().toISOString() })
        .eq('id', threadId);

      return res.status(201).json(data);
    } else {
      // Create Thread
      if (!title) {
        return res.status(400).json({ error: 'Title is required for new threads' });
      }

      const { data: thread, error: threadError } = await supabase
        .from('forum_threads')
        .insert([
          { title, author_id: authorId }
        ])
        .select()
        .single();

      if (threadError) {
        return res.status(500).json({ error: threadError.message });
      }

      // Create initial post
      const { error: postError } = await supabase
        .from('forum_posts')
        .insert([
          { thread_id: thread.id, content, author_id: authorId }
        ]);

      if (postError) {
        return res.status(500).json({ error: postError.message });
      }

      return res.status(201).json(thread);
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
