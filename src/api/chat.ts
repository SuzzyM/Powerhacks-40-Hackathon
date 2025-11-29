import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Initialize OpenAI Client
// SECURITY: The API key is read from the server-side environment variable.
// It is never exposed to the client.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // SECURITY: Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  // SECURITY: Validate input
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid message' });
  }

  // SECURITY: Validate message length
  if (message.length > 2000) {
    return res.status(400).json({ error: 'Message too long' });
  }

  // SECURITY: Content filtering - detect suspicious patterns
  const suspiciousPatterns = [
    /api[_-]?key/i,
    /system[_-]?prompt/i,
    /show[_-]?me[_-]?your[_-]?instructions/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(message)) {
      // SECURITY: Log suspicious attempt (but not the message content)
      console.warn('Suspicious content detected in chat request');
      return res.status(400).json({
        error: 'Your message contains content that cannot be processed.',
      });
    }
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or 'gpt-4' if available and desired
      messages: [
        {
          role: 'system',
          content: `You are a confidential, empathetic, and supportive assistant for SafeHarbor, a platform for survivors of digital harm. 
          Your goal is to provide emotional support, practical advice, and resources. 
          
          Guidelines:
          1. Prioritize safety. If a user seems to be in immediate danger, encourage them to contact local emergency services.
          2. Be empathetic and non-judgmental. Validate their feelings.
          3. Maintain confidentiality. Do not ask for PII (Personally Identifiable Information).
          4. Provide practical steps for digital safety (e.g., blocking, reporting, evidence collection) when asked.
          5. Keep responses concise and readable.`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    // SECURITY: Only log metadata for monitoring
    console.log('Chat request processed successfully');

    return res.status(200).json({
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Chat API error:', error);

    // Fallback for quota limits (common in hackathons/demos)
    if (error?.status === 429 || error?.code === 'insufficient_quota') {
      console.warn('OpenAI quota exceeded. Returning mock response.');
      return res.status(200).json({
        response: "I'm currently operating in offline mode due to high traffic. (Mock Response: I hear you, and I'm here to support you. Please tell me more about what you're going through.)",
        timestamp: new Date().toISOString(),
      });
    }

    // Handle specific OpenAI errors if needed, otherwise generic error
    return res.status(500).json({
      error: 'Unable to process your request. Please try again later.',
    });
  }
}
