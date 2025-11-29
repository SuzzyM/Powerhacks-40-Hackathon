import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini Client
// SECURITY: The API key is read from the server-side environment variable.
// It is never exposed to the client.
// We check GEMINI_API_KEY first, then fallback to OPENAI_API_KEY as the user mentioned they swapped it there.
const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey || '');

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

  if (!apiKey) {
    console.error('Missing API Key for Gemini');
    return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
  }

  try {
    // For text-only input, use the gemini-2.0-flash model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const systemPrompt = `You are a confidential, empathetic, and supportive assistant for SafeHarbor, a platform for survivors of digital harm. 
    Your goal is to provide emotional support, practical advice, and resources. 
    
    Guidelines:
    1. Prioritize safety. If a user seems to be in immediate danger, encourage them to contact local emergency services.
    2. Be empathetic and non-judgmental. Validate their feelings.
    3. Maintain confidentiality. Do not ask for PII (Personally Identifiable Information).
    4. Provide practical steps for digital safety (e.g., blocking, reporting, evidence collection) when asked.
    5. Keep responses concise and readable.`;

    // Gemini Pro doesn't have a strict "system" role in the same way as GPT-4 in the basic API,
    // but we can prepend instructions or use the chat history.
    // We'll prepend the system prompt to the user message for this stateless implementation.

    const prompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // SECURITY: Only log metadata for monitoring
    console.log('Chat request processed successfully');

    return res.status(200).json({
      response: text,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Chat API error:', error);

    // Fallback for quota limits or other errors
    // Gemini errors might look different, but we'll catch generic ones too.
    if (error?.message?.includes('429') || error?.status === 429) {
      console.warn('Gemini quota exceeded. Returning mock response.');
      return res.status(200).json({
        response: "I'm currently operating in offline mode due to high traffic. (Mock Response: I hear you, and I'm here to support you. Please tell me more about what you're going through.)",
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(500).json({
      error: `Unable to process your request: ${error.message || error.toString()}`,
    });
  }
}
