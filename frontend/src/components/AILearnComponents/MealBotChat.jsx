import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, CornerDownLeft } from 'lucide-react';
import apiClient from '../../services/apiClient';

const MealBotChat = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I am MealBot 🤖, your AI food rescue advisor. Ask me anything about food safety, shelf-life, Section 80G tax credits, or how MealBridge's smart matching works!",
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef(null);

  const promptSuggestions = [
    'Is cooked rice safe after 3 hours?',
    'How do 80G tax deductions work?',
    'What foods cannot be accepted?',
    'How does 15-min shelter cascade work?',
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await apiClient.post('/ai/mealbot', { message: textToSend });
      const botReply = res.data.reply || 'I am ready to help you with any food rescue guidelines.';

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.warn('Fallback response for MealBot:', err.message);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "Cooked food should strictly be consumed or refrigerated within 2 hours of preparation to prevent harmful bacterial proliferation. Keep hot food >60°C and cold food <5°C.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-warm-border shadow-card overflow-hidden flex flex-col h-[560px]">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 bg-warm border-b border-warm-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sage-500 text-white flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-extrabold text-base text-forest">MealBot AI</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-[11px] text-forest/60 font-medium">
              Powered by Food Safety & Rescue Intelligence
            </div>
          </div>
        </div>

        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sunburst-50 border border-sunburst-200 text-xs font-bold text-sunburst-700">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Instant AI Advice</span>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="p-3 bg-white border-b border-warm-border/60 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-[11px] font-bold text-forest/40 uppercase tracking-wider flex-shrink-0 pl-1">
          Quick:
        </span>
        {promptSuggestions.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full bg-sage-50 text-sage-800 hover:bg-sage-100 hover:text-forest text-[11px] font-semibold border border-sage-200 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={index}
              className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-xl bg-sage-500 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-forest text-white rounded-tr-none'
                    : 'bg-warm text-forest border border-warm-border rounded-tl-none'
                }`}
              >
                <div>{msg.text}</div>
                <div
                  className={`text-[10px] mt-1 text-right font-medium ${
                    isUser ? 'text-white/60' : 'text-forest/40'
                  }`}
                >
                  {msg.time}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-xl bg-sunburst-500 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-xl bg-sage-500 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-warm rounded-2xl px-4 py-3 border border-warm-border text-xs text-forest/60 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sage-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-sage-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-sage-500 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 sm:p-4 bg-warm/50 border-t border-warm-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about food shelf life, safety temperatures, or 80G tax rules..."
            className="flex-1 bg-white border border-warm-border rounded-2xl px-4 py-3 text-xs sm:text-sm text-forest placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="btn-sage p-3 rounded-2xl flex-shrink-0 disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MealBotChat;
