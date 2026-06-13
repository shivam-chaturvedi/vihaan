import { useEffect, useRef, useState } from 'react';
import { Loader2, MessageCircle, Send, Sprout, X } from 'lucide-react';
import { useSensorData } from '../hooks/useSensorData';
import { buildSensorContext, ChatMessage, chatWithGemini } from '../utils/geminiChat';

const WELCOME_TEXT =
  'नमस्ते! 🌱 मैं प्रज्ञा सहायक हूँ। मखाना खेती, पानी-मिट्टी की रीडिंग, खाद, सिंचाई या तालाब से जुड़ा कोई भी सवाल पूछें।';

const SUGGESTIONS = [
  'मेरे पानी का pH ठीक है?',
  'मखाना के लिए तालाब कैसे तैयार करें?',
  'अभी कौन सी खाद डालनी चाहिए?',
];

interface DisplayMessage extends ChatMessage {
  id: number;
}

export function Chatbot() {
  const { latestLiveReading, latestReading } = useSensorData();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([
    { id: 0, role: 'model', text: WELCOME_TEXT },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) {
      return;
    }

    setError(null);
    const userMessage: DisplayMessage = { id: idRef.current++, role: 'user', text: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    // Gemini requires the history to start with a user turn — drop the leading welcome.
    const firstUserIndex = nextMessages.findIndex((m) => m.role === 'user');
    const history: ChatMessage[] = nextMessages
      .slice(firstUserIndex)
      .map(({ role, text: messageText }) => ({ role, text: messageText }));

    const sensorContext = buildSensorContext(latestLiveReading ?? latestReading);

    try {
      const reply = await chatWithGemini(history, sensorContext);
      setMessages((prev) => [...prev, { id: idRef.current++, role: 'model', text: reply }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'जवाब नहीं मिल सका';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-700"
          aria-label="सहायक खोलें"
        >
          <MessageCircle className="h-5 w-5" />
          सहायक से पूछें
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[min(560px,calc(100vh-2.5rem))] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-stone-200 bg-stone-50 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
                <Sprout className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900">प्रज्ञा सहायक</p>
                <p className="text-xs text-stone-500">Gemini से संचालित</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-stone-500 transition-colors hover:bg-stone-200 hover:text-stone-900"
              aria-label="बंद करें"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
                    message.role === 'user'
                      ? 'rounded-br-sm bg-emerald-600 text-white'
                      : 'rounded-bl-sm bg-stone-100 text-stone-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-sm bg-stone-100 px-3.5 py-2.5 text-sm text-stone-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  सोच रहा हूँ...
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {error}
              </div>
            )}

            {/* Suggestions (only before first question) */}
            {messages.length === 1 && !loading && (
              <div className="space-y-2 pt-1">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => void sendMessage(suggestion)}
                    className="block w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-left text-sm text-stone-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-stone-200 p-3">
            <div className="flex items-end gap-2 rounded-xl border border-stone-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="अपना सवाल लिखें..."
                className="max-h-28 flex-1 resize-none bg-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:bg-stone-200 disabled:text-stone-400"
                aria-label="भेजें"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 px-1 text-[11px] text-stone-400">
              यह खेत-स्तर सलाह है, प्रयोगशाला रिपोर्ट नहीं।
            </p>
          </form>
        </div>
      )}
    </>
  );
}
