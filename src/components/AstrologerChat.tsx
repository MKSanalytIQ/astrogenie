import React, { useState, useRef, useEffect } from 'react';
import { VedicKundli, ChatMessage, MembershipPlan } from '../types/astrology';
import { Send, Sparkles, Volume2, VolumeX, Shield, Crown, RefreshCw, Compass, Phone } from 'lucide-react';

interface AstrologerChatProps {
  activeKundli: VedicKundli;
  chatHistory: ChatMessage[];
  onSendMessage: (text: string, category: 'career' | 'business' | 'marriage' | 'health' | 'remedies' | 'general') => Promise<void>;
  isLoading: boolean;
  userPlan: MembershipPlan;
  onOpenPricingModal: () => void;
  onStartVoiceCall: () => void;
  prefillQuery?: string;
  onClearPrefillQuery?: () => void;
}

export const AstrologerChat: React.FC<AstrologerChatProps> = ({
  activeKundli,
  chatHistory,
  onSendMessage,
  isLoading,
  userPlan,
  onOpenPricingModal,
  onStartVoiceCall,
  prefillQuery,
  onClearPrefillQuery,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'career' | 'business' | 'marriage' | 'health' | 'remedies' | 'general'>('general');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle prefill query if passed from other views
  useEffect(() => {
    if (prefillQuery) {
      setInputText(prefillQuery);
      if (onClearPrefillQuery) onClearPrefillQuery();
    }
  }, [prefillQuery, onClearPrefillQuery]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const msg = inputText.trim();
    setInputText('');
    await onSendMessage(msg, selectedCategory);
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*#_~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const quickPrompts = [
    { text: 'When is a promotion or career breakthrough indicated in my chart?', category: 'career' as const },
    { text: 'Is this favorable timing to start a business or make big investments?', category: 'business' as const },
    { text: 'When is marriage indicated in my horoscope and what will my partner be like?', category: 'marriage' as const },
    { text: 'What is the most powerful gemstone and mantra for my current Dasha?', category: 'remedies' as const },
    { text: 'How is Saturn (Shani) or Rahu affecting my peace of mind right now?', category: 'health' as const },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
      
      {/* Left Sidebar: Acharya Identity & Chart Overview (4 cols) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Acharya Profile Card */}
        <div className="bg-stone-900/90 rounded-3xl border border-amber-500/30 p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center text-3xl shadow-lg border-2 border-amber-400/50">
                🕉️
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-stone-900 shadow-sm" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-stone-100">
                  Acharya AstroGenie
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                  VEDIC GURU
                </span>
              </div>
              <p className="text-xs text-amber-200/80 font-medium">
                Jyotish Shiromani & Counselor
              </p>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Online & Reading Your Kundli</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-stone-300 leading-relaxed">
            &ldquo;Greetings divine soul. I have your complete Janam Kundli open before me. Speak freely of your heart&apos;s dilemmas in career, marriage, finances, or family, and receive classical Vedic light and remedies.&rdquo;
          </p>

          {/* Quick Voice Call Trigger Banner */}
          <div className="mt-4 pt-4 border-t border-stone-800">
            <button
              onClick={onStartVoiceCall}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-stone-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Phone className="w-4 h-4 fill-stone-950" />
              <span>Start Live Voice Consultation (Call)</span>
              <span className="w-2 h-2 rounded-full bg-stone-950 animate-ping" />
            </button>
          </div>

          {/* Active Chart Parameters Pill */}
          <div className="mt-4 p-3 rounded-2xl bg-stone-950 border border-stone-800 text-xs space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Active Chart: {activeKundli.birthDetails.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-stone-300 text-[11px]">
              <div>Lagna: <strong className="text-amber-200">{activeKundli.ascendant.sign}</strong></div>
              <div>Moon: <strong className="text-amber-200">{activeKundli.moonSign.sign}</strong></div>
              <div>Sun: <strong className="text-amber-200">{activeKundli.sunSign.sign}</strong></div>
              <div>Dasha: <strong className="text-amber-200">{activeKundli.currentDasha.mahadasha}</strong></div>
            </div>
          </div>
        </div>

        {/* Membership Tier & Consultation Quota */}
        <div className="bg-stone-900/90 rounded-3xl border border-stone-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="font-serif text-sm font-bold text-stone-100">
                {userPlan.name}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              ACTIVE
            </span>
          </div>

          <div className="text-xs text-stone-400 space-y-1">
            <div className="flex justify-between">
              <span>Astrologer Consultations:</span>
              <strong className="text-amber-300">
                {userPlan.id === 'pro' || userPlan.id === 'annual' ? 'Unlimited 24/7' : '5 / Month'}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Kundli Milan (36 Gunas):</span>
              <strong className="text-stone-200">
                {userPlan.id === 'pro' || userPlan.id === 'annual' ? 'Unlimited' : '3 Matches'}
              </strong>
            </div>
          </div>

          <button
            onClick={onOpenPricingModal}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20 transition"
          >
            Upgrade Plan (Starts at ₹299)
          </button>
        </div>

        {/* Traditional Vedic Oath of Confidentiality */}
        <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 text-[11px] text-stone-400 flex items-start gap-3">
          <Shield className="w-4 h-4 text-amber-500/80 flex-shrink-0 mt-0.5" />
          <p>
            Your Janampatri and consultation dialogues are held in strict sacred confidence according to ancient Guru-Shishya tradition.
          </p>
        </div>

      </div>

      {/* Right Area: Interactive Dialogue Room (8 cols) */}
      <div className="lg:col-span-8 bg-stone-900/90 rounded-3xl border border-stone-800 shadow-xl flex flex-col h-[740px] overflow-hidden">
        
        {/* Chat Room Header */}
        <div className="px-6 py-4 border-b border-stone-800 bg-stone-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <h2 className="font-serif text-sm font-bold text-stone-100">
                Direct Consultation with Acharya AstroGenie
              </h2>
              <p className="text-[11px] text-stone-400">
                Grounding answers in your {activeKundli.ascendant.sign} Lagna & {activeKundli.currentDasha.mahadasha} Dasha
              </p>
            </div>
          </div>

          {/* Call Acharya Button & Category Filter Chips */}
          <div className="flex items-center gap-2">
            <button
              onClick={onStartVoiceCall}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-stone-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition"
            >
              <Phone className="w-3.5 h-3.5 fill-stone-950" />
              <span>Voice Call</span>
            </button>

            <div className="hidden xl:flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800 text-[11px]">
              {(['general', 'career', 'business', 'marriage', 'remedies'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 rounded-lg capitalize font-medium transition ${
                    selectedCategory === cat ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl">
                🕉️
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-100">
                Welcome, {activeKundli.birthDetails.name} Ji
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Acharya AstroGenie is ready with your {activeKundli.ascendant.sign} Lagna chart. Click any topic below or ask about career promotions, marriage compatibility, business ventures, or planetary remedies.
              </p>

              <div className="flex flex-col w-full gap-2 pt-2">
                {quickPrompts.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(q.text);
                      setSelectedCategory(q.category);
                    }}
                    className="p-3 rounded-2xl bg-stone-950/70 border border-stone-800 hover:border-amber-500/40 text-left text-xs text-stone-300 hover:text-amber-200 transition"
                  >
                    ✨ {q.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'astrologer' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-sm shadow flex-shrink-0 mt-1">
                    🕉️
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  <div
                    className={`rounded-2xl p-4 text-xs leading-relaxed shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-none'
                        : 'bg-stone-950 border border-stone-800 text-stone-200 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>

                    {/* Astrologer Suggested Vedic Upay Box */}
                    {msg.suggestedUpay && (
                      <div className="mt-3 pt-3 border-t border-stone-800/80 space-y-2 text-[11px] bg-stone-900/60 p-3 rounded-xl border border-amber-500/20 text-stone-300">
                        <div className="font-serif font-bold text-amber-300 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Acharya&apos;s Prescribed Upay (वैदिक उपाय)</span>
                        </div>
                        {msg.suggestedUpay.mantra && (
                          <div>
                            <span className="text-amber-400 font-semibold">Beej Mantra: </span>
                            <span className="font-serif text-amber-200">{msg.suggestedUpay.mantra}</span>
                          </div>
                        )}
                        {msg.suggestedUpay.gemstone && (
                          <div>
                            <span className="text-amber-400 font-semibold">Gemstone (रत्न): </span>
                            <span>{msg.suggestedUpay.gemstone}</span>
                          </div>
                        )}
                        {msg.suggestedUpay.charity && (
                          <div>
                            <span className="text-amber-400 font-semibold">Daan / Fasting: </span>
                            <span>{msg.suggestedUpay.charity}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Voice Read Button for Astrologer Message */}
                    {msg.sender === 'astrologer' && (
                      <div className="mt-2 pt-2 flex items-center justify-between text-[10px] text-stone-400">
                        <span className="font-mono">{msg.timestamp}</span>
                        <button
                          onClick={() => speakText(msg.text)}
                          className="flex items-center gap-1 hover:text-amber-300 transition"
                          title="Listen to Pandit ji speak"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen Voice</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="text-[10px] text-stone-500 text-right font-mono">
                      {msg.timestamp}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3.5 items-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-sm shadow flex-shrink-0">
                🕉️
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none bg-stone-950 border border-stone-800 text-xs text-amber-300 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Acharya AstroGenie is contemplating your Bhavas & planetary degrees...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 space-y-3">
          
          {/* Quick topic pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-stone-500 text-[10px] uppercase font-bold flex-shrink-0">Topics:</span>
            {[
              { label: 'Job Promotion', q: 'When is career promotion indicated in my chart?', cat: 'career' as const },
              { label: 'Marriage Timing', q: 'When is marriage indicated and what will my spouse be like?', cat: 'marriage' as const },
              { label: 'Wealth & Business', q: 'How is wealth accumulation and business in my horoscope?', cat: 'business' as const },
              { label: 'Shani / Rahu Upay', q: 'What remedies should I practice for Shani or Rahu peace?', cat: 'remedies' as const },
            ].map((chip, i) => (
              <button
                key={i}
                onClick={() => {
                  setInputText(chip.q);
                  setSelectedCategory(chip.cat);
                }}
                className="flex-shrink-0 px-2.5 py-1 rounded-full bg-stone-900 hover:bg-stone-800 text-[11px] text-stone-300 hover:text-amber-300 border border-stone-800 transition"
              >
                {chip.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Acharya about career, marriage timing, wealth, or Vedic remedies..."
              disabled={isLoading}
              className="flex-1 bg-stone-900 border border-stone-800 rounded-2xl px-4 py-3 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20 transition disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
