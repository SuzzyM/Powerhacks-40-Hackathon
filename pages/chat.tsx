import Head from 'next/head';
import { useState, useRef, useEffect } from 'react';
import QuickExitButton from '@/src/components/QuickExitButton';

/**
 * AI Chatbot Page
 * 
 * SECURITY REQUIREMENTS:
 * 1. AI API Key Security: All requests MUST be proxied through server-side API
 *    - Frontend must NEVER directly call LLM APIs
 *    - API keys must be stored in environment variables (never in client code)
 *    - Use /api/chat endpoint to proxy requests
 * 
 * 2. Data Minimization: Chat history is session-based only
 *    - Store messages only in component state (not localStorage)
 *    - Clear chat history when user closes browser/tab
 *    - Never link chat history to user accounts or persistent identifiers
 *    - Optionally: Allow user to explicitly clear chat history
 * 
 * 3. Content Filtering: Implement server-side content filtering
 *    - Filter out any attempts to extract API keys or system prompts
 *    - Log suspicious patterns (but not message content)
 * 
 * 4. Rate Limiting: Implement rate limiting on /api/chat endpoint
 *    - Maximum 20 requests per user per minute
 *    - Prevent abuse and cost overruns
 */
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // SECURITY: Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // SECURITY: All AI requests must go through server-side proxy
      // The /api/chat endpoint handles the actual LLM API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          // SECURITY: Do NOT send any identifying information
          // Only send the current message, not full chat history
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I apologize, but I encountered an error.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error.message || 'I apologize, but I am unable to respond at this time.'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    // SECURITY: Clear all chat history (session-based only)
    if (confirm('Are you sure you want to clear all chat history?')) {
      setMessages([]);
    }
  };

  return (
    <>
      <Head>
        <title>AI Chat Support - SafeHarbor</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        <div className="fixed top-4 right-4 z-50">
          <QuickExitButton />
        </div>

        <div className="container mx-auto px-4 py-16 flex-1 flex flex-col max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900">
              AI Chat Support
            </h1>
            <button
              onClick={handleClearChat}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Clear Chat
            </button>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-6">
            <p className="text-sm text-blue-800">
              <strong>Confidentiality:</strong> This chat is session-based and not permanently stored.
              Your conversations are private and anonymous.
            </p>
          </div>

          {/* Messages Container */}
          <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col p-6 mb-4 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <p>Start a conversation by typing a message below.</p>
                  <p className="text-sm mt-2">
                    All conversations are confidential and session-based.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                        }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs mt-2 opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 rounded-lg p-4">
                    <p className="text-gray-600">Thinking...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-md transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

