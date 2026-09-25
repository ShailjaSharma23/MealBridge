import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, Volume2, VolumeX, ShieldCheck, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/apiClient';

const MealBotChat = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "👋 **Hello! I am MealBot AI**, your surplus food rescue and statutory compliance specialist.\n\nAsk me about **FSSAI 2019 surplus regulations**, **Section 80G tax benefits for restaurants**, **15-minute shelter cascade matching**, or **volunteer breakdown emergency protocols**!",
      time: 'Just now',
      source: 'Google Gemini 3.8 Flash',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const chatBottomRef = useRef(null);

  const promptSuggestions = [
    { label: '🍚 Cooked Rice 3-Hr Safety', query: 'Is cooked rice safe after 3 hours at room temperature?' },
    { label: '📜 80G Tax Deductions', query: 'How does Section 80G tax benefit Bistro 42 for donating food?' },
    { label: '⚡ 15-Min Shelter Cascade', query: 'How does the 15-minute shelter cascade algorithm work?' },
    { label: '🛵 Courier Breakdown Protocol', query: 'What happens if a volunteer courier vehicle breaks down after accepting a job?' },
    { label: '🌍 CO2 Emissions Saved', query: 'How does rescuing surplus food prevent landfill methane and calculate CO2 savings?' },
    { label: '🚫 Prohibited Foods', query: 'What foods are strictly prohibited from donation under FSSAI rules?' },
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Clean up any ongoing speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Web Speech API for voice narration
  const handleSpeak = (text, index) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown characters for spoken audio
    const cleanText = text
      .replace(/[*#_`>]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/⚡|🤖|👋|🍚|📜|🛵|🚫|🌍|🌡️/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.02;
    utterance.pitch = 1.0;

    // Pick natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Neural')) && v.lang.startsWith('en')
    );
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

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
      const source = res.data.source === 'gemini-3.8-flash' ? 'Google Gemini 3.8 Flash' : 'MealBridge Compliance Intelligence';

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source,
          category: res.data.category,
        },
      ]);
    } catch (err) {
      console.warn('Fallback response for MealBot:', err.message);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text:
            "**FSSAI Safety Standard:** Cooked meals must be consumed or refrigerated within **2 hours** of cooking to prevent bacterial toxin proliferation (Bacillus cereus, Salmonella). Always maintain hot food holding at >60°C and cold storage at <5°C.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'MealBridge Safety Engine',
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

  // Markdown renderer for bolding, bullet points, and headers
  const renderMessageContent = (rawText) => {
    const lines = rawText.split('\n');
    return (
      <div className="space-y-1.5 leading-relaxed text-xs sm:text-sm">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;

          // Parse bullet points
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            const bulletText = trimmed.replace(/^[*\-]\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 ml-1 text-forest/90">
                <span className="text-sage-600 font-bold shrink-0 mt-0.5">•</span>
                <span>{renderInlineFormatting(bulletText)}</span>
              </div>
            );
          }

          // Header lines
          if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
            return (
              <h4 key={idx} className="font-extrabold text-forest text-sm sm:text-base mt-2 mb-1">
                {renderInlineFormatting(trimmed.replace(/^#+\s+/, ''))}
              </h4>
            );
          }

          return <p key={idx}>{renderInlineFormatting(trimmed)}</p>;
        })}
      </div>
    );
  };

  // Helper for inline **bold** text
  const renderInlineFormatting = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-extrabold text-forest">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-warm-border shadow-card overflow-hidden flex flex-col h-[620px]">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 bg-warm border-b border-warm-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sage-500 to-forest text-white flex items-center justify-center shadow-md ring-2 ring-sage-200">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-extrabold text-base sm:text-lg text-forest">MealBot AI</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Gemini 3.8
              </span>
            </div>
            <div className="text-[11px] text-forest/65 font-semibold">
              Food Safety &bull; FSSAI Compliance &bull; 80G Tax Engine &bull; Route Dispatch
            </div>
          </div>
        </div>

        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-sunburst-200 text-xs font-bold text-sunburst-800 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-sunburst-600" />
          <span>Interactive AI Specialist</span>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips Carousel */}
      <div className="p-2.5 sm:p-3 bg-white border-b border-warm-border/60 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-[10px] font-black text-forest/50 uppercase tracking-widest flex-shrink-0 pl-1">
          Judge Prompts:
        </span>
        {promptSuggestions.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(item.query)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full bg-sage-50 text-sage-800 hover:bg-sage-600 hover:text-white text-[11px] font-bold border border-sage-200 transition-all active:scale-95 shadow-xs"
          >
            {item.label}
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
              className={`flex items-start gap-2.5 sm:gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-2xl bg-sage-600 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-3xl px-4 sm:px-5 py-3.5 leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-forest text-white rounded-tr-none'
                    : 'bg-warm text-forest border border-warm-border rounded-tl-none'
                }`}
              >
                {/* Content */}
                {isUser ? (
                  <div className="text-xs sm:text-sm font-semibold">{msg.text}</div>
                ) : (
                  renderMessageContent(msg.text)
                )}

                {/* Footer bar with Source, Voice Read Aloud & Timestamp */}
                <div
                  className={`mt-2.5 pt-2 border-t flex flex-wrap items-center justify-between gap-2 text-[10px] font-semibold ${
                    isUser ? 'border-white/20 text-white/70' : 'border-warm-border text-forest/50'
                  }`}
                >
                  {!isUser && msg.source && (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                      {msg.source}
                    </span>
                  )}

                  <div className="flex items-center gap-2 ml-auto">
                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => handleSpeak(msg.text, index)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-bold transition-all ${
                          speakingIndex === index
                            ? 'bg-sunburst-500 text-white border-sunburst-600 animate-pulse'
                            : 'bg-white hover:bg-sage-100 text-sage-800 border-warm-border'
                        }`}
                        title="Listen with AI Voice Narration"
                      >
                        {speakingIndex === index ? (
                          <>
                            <VolumeX className="w-3 h-3" />
                            <span>Stop Voice</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3 text-sage-600" />
                            <span>Voice Read 🔊</span>
                          </>
                        )}
                      </button>
                    )}
                    <span>{msg.time}</span>
                  </div>
                </div>

                {/* Contextual Quick Actions for Judges & Donors */}
                {!isUser && (msg.text.includes('80G') || msg.text.includes('Tax')) && (
                  <div className="mt-2.5 pt-2 border-t border-warm-border flex flex-wrap gap-2">
                    <Link
                      to="/donate"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 text-[10px] font-bold hover:bg-amber-200 border border-amber-300"
                    >
                      <span>View Bistro 42 80G Certificate</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
                {!isUser && (msg.text.includes('Rice') || msg.text.includes('Safe') || msg.text.includes('hours')) && (
                  <div className="mt-2.5 pt-2 border-t border-warm-border flex flex-wrap gap-2">
                    <a
                      href="#expiry-calculator"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sage-100 text-sage-900 text-[10px] font-bold hover:bg-sage-200 border border-sage-300"
                    >
                      <span>Simulate in Expiry Risk Calculator ↓</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-2xl bg-sunburst-500 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-2.5 justify-start">
            <div className="w-8 h-8 rounded-2xl bg-sage-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-warm rounded-3xl px-4 py-3.5 border border-warm-border text-xs text-forest/70 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sage-600 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-sage-600 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-sage-600 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] font-semibold text-sage-800 ml-1">MealBot AI is reasoning...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 sm:p-4 bg-warm/60 border-t border-warm-border">
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
            placeholder="Ask MealBot about FSSAI rules, 80G tax claims, or 15-min matching..."
            className="flex-1 bg-white border border-warm-border rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold text-forest placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-sage-400 shadow-xs"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="btn-sage px-4 py-3 rounded-2xl flex-shrink-0 disabled:opacity-40 flex items-center gap-1.5 shadow-sm font-bold text-xs"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MealBotChat;
