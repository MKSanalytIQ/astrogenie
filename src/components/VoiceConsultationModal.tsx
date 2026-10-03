import React, { useState, useEffect, useRef } from 'react';
import { VedicKundli, ChatMessage } from '../types/astrology';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Sparkles, Shield, User, RefreshCw, MessageSquare } from 'lucide-react';

interface VoiceConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeKundli: VedicKundli;
  onSendMessage: (text: string, category: 'career' | 'business' | 'marriage' | 'health' | 'remedies' | 'general') => Promise<void>;
  chatHistory: ChatMessage[];
  language?: string;
}

export const VoiceConsultationModal: React.FC<VoiceConsultationModalProps> = ({
  isOpen,
  onClose,
  activeKundli,
  onSendMessage,
  chatHistory,
  language = 'en',
}) => {
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'speaking' | 'listening' | 'processing'>('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [lastAstrologerSpeech, setLastAstrologerSpeech] = useState('');
  const [recognitionError, setRecognitionError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Initialize Speech Recognition & Call Flow
  useEffect(() => {
    if (!isOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      return;
    }

    setCallStatus('connecting');
    setCallDuration(0);
    setCurrentTranscript('');
    setRecognitionError(null);

    // Simulated 1.5s call connection delay for realism
    const connectTimeout = setTimeout(() => {
      setCallStatus('connected');
      
      // Start call timer
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      // Acharya speaks opening greeting
      const greeting = `Pranam ${activeKundli.birthDetails.name} Ji. Acharya AstroGenie here. I have your ${activeKundli.ascendant.sign} Lagna chart open before me, running ${activeKundli.currentDasha.mahadasha} Mahadasha. Speak freely, what guidance do you seek today?`;
      speakAcharyaVoice(greeting);
    }, 1500);

    return () => {
      clearTimeout(connectTimeout);
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [isOpen, activeKundli]);

  // Speech Recognition Setup
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecognitionError('Speech recognition is not supported in this browser. You can click any topic below.');
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

    recognition.onstart = () => {
      setCallStatus('listening');
      setCurrentTranscript('');
      setRecognitionError(null);
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setCurrentTranscript(final || interim);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        setCallStatus('connected');
      } else {
        setRecognitionError(`Mic notice: ${event.error}. You can also click a quick prompt.`);
        setCallStatus('connected');
      }
    };

    recognition.onend = () => {
      if (currentTranscript.trim()) {
        handleUserSpokenQuestion(currentTranscript.trim());
      } else {
        setCallStatus('connected');
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      console.warn('Recognition start err:', e);
    }
  };

  // Process user spoken question and get Acharya reply
  const handleUserSpokenQuestion = async (question: string) => {
    if (!question.trim()) return;
    setCallStatus('processing');
    setCurrentTranscript(question);

    try {
      const res = await fetch('/api/astrologer-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          activeKundli,
          chatHistory: chatHistory.slice(-4),
          category: 'general',
          language,
        }),
      });

      const data = await res.json();
      const reply = data?.reply || `Based on your ${activeKundli.ascendant.sign} Lagna, benefic influences are shielding you. Maintain patience and chant Om Namah Shivaya.`;

      // Log to chat history in parent
      await onSendMessage(question, 'general');

      speakAcharyaVoice(reply);
    } catch (err) {
      const fallbackReply = `Namaste ${activeKundli.birthDetails.name}. The planetary transits favor disciplined effort. Concentrate on your primary duties and practice Surya Arghya in the morning.`;
      speakAcharyaVoice(fallbackReply);
    }
  };

  // Synthesize Acharya's voice
  const speakAcharyaVoice = (text: string) => {
    setLastAstrologerSpeech(text);
    if (!('speechSynthesis' in window) || !isSpeakerOn) {
      setCallStatus('connected');
      return;
    }

    window.speechSynthesis.cancel();
    setCallStatus('speaking');

    const clean = text.replace(/[*#_~]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.95;
    utterance.pitch = 0.95;

    // Try finding an Indian English or Hindi voice
    const voices = window.speechSynthesis.getVoices();
    const indVoice = voices.find((v) => v.lang.includes('IN') || v.name.includes('India') || v.lang.includes('hi'));
    if (indVoice) utterance.voice = indVoice;

    utterance.onend = () => {
      setCallStatus('connected');
    };
    utterance.onerror = () => {
      setCallStatus('connected');
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleEndCall = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (recognitionRef.current) recognitionRef.current.stop();
    onClose();
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#0F172A] via-[#090D1A] to-[#05070D] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl flex flex-col items-center justify-between min-h-[580px] overflow-hidden">
        
        {/* Subtle Cosmic Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header & Status */}
        <div className="text-center space-y-2 relative z-10 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold text-amber-300 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Vedic Live Voice Session</span>
          </div>

          <h2 className="font-serif text-2xl font-bold text-stone-100 flex items-center justify-center gap-2">
            <span>Acharya AstroGenie</span>
          </h2>
          <p className="text-xs text-stone-400">
            Senior Vedic Jyotish Acharya • Lahiri Ayanamsha Consecrated
          </p>

          <div className="font-mono text-sm font-bold text-amber-300">
            {callStatus === 'connecting' ? 'Connecting to Varanasi Temple...' : formatTimer(callDuration)}
          </div>
        </div>

        {/* Center: Glowing Vedic Waveform Visualizer & Portrait */}
        <div className="relative my-6 flex flex-col items-center justify-center">
          
          {/* Animated Waveform Aura Rings */}
          <div className={`absolute w-44 h-44 rounded-full border-2 transition-all duration-700 ${
            callStatus === 'speaking'
              ? 'border-amber-400/60 scale-125 animate-pulse'
              : callStatus === 'listening'
              ? 'border-emerald-400/60 scale-125 animate-pulse'
              : 'border-amber-500/20 scale-100'
          }`} />

          <div className={`absolute w-56 h-56 rounded-full border transition-all duration-1000 ${
            callStatus === 'speaking'
              ? 'border-amber-400/30 scale-125 animate-ping'
              : callStatus === 'listening'
              ? 'border-emerald-400/30 scale-125 animate-ping'
              : 'border-transparent'
          }`} />

          {/* Acharya Avatar */}
          <div className="relative z-10 w-32 h-32 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-400 p-1 shadow-2xl">
            <div className="w-full h-full rounded-full bg-stone-950 flex flex-col items-center justify-center overflow-hidden border-2 border-stone-900">
              <span className="text-4xl">🕉️</span>
              <span className="text-[10px] uppercase font-bold text-amber-300 mt-1 tracking-wider">Acharya</span>
            </div>
          </div>

          {/* Status Label Pill */}
          <div className="mt-4 px-4 py-1 rounded-full bg-stone-900/90 border border-stone-800 text-xs font-semibold flex items-center gap-2 shadow-inner">
            {callStatus === 'connecting' && <span className="text-amber-400 animate-pulse">Dialing Acharya...</span>}
            {callStatus === 'connected' && <span className="text-emerald-400">Call Connected • Tap Mic to Speak</span>}
            {callStatus === 'listening' && <span className="text-emerald-300 animate-pulse">Listening to your voice...</span>}
            {callStatus === 'processing' && (
              <span className="text-amber-300 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Reading Planetary Matrix...</span>
              </span>
            )}
            {callStatus === 'speaking' && <span className="text-amber-300 animate-pulse">Acharya is speaking...</span>}
          </div>
        </div>

        {/* Live Speech Subtitle Display */}
        <div className="w-full max-h-24 overflow-y-auto p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs text-center text-stone-300 italic min-h-[64px] flex items-center justify-center">
          {callStatus === 'listening' && (currentTranscript || 'Listening... Speak your dilemma clearly.')}
          {callStatus === 'speaking' && (lastAstrologerSpeech.slice(0, 160) + (lastAstrologerSpeech.length > 160 ? '...' : ''))}
          {callStatus === 'connected' && 'Tap the green microphone button below to ask your question.'}
          {callStatus === 'processing' && 'Synthesizing Parashara astrological verdict...'}
        </div>

        {recognitionError && (
          <div className="text-[11px] text-rose-300 bg-rose-500/10 px-3 py-1 rounded-xl mt-2">
            {recognitionError}
          </div>
        )}

        {/* Quick Voice Prompt Buttons */}
        <div className="w-full mt-3 space-y-1">
          <div className="text-[10px] uppercase font-bold text-stone-500 text-center">Quick Verbal Questions:</div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {[
              'When will my career promote?',
              'What about marriage timing?',
              'Suggest a powerful gemstone',
              'Remedy for Saturn / Rahu',
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleUserSpokenQuestion(prompt)}
                disabled={callStatus === 'processing' || callStatus === 'speaking'}
                className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-[10px] text-amber-200 border border-stone-800 hover:border-amber-500/40 transition disabled:opacity-40"
              >
                &ldquo;{prompt}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* In-Call Controls Bottom Bar */}
        <div className="w-full pt-4 mt-2 border-t border-stone-800/80 flex items-center justify-around relative z-10">
          
          {/* Mute Mic */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-full border transition ${
              isMuted ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Large Push-To-Speak Mic Button */}
          <button
            onClick={startListening}
            disabled={callStatus === 'speaking' || callStatus === 'processing' || isMuted}
            className={`p-4 rounded-full shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center ${
              callStatus === 'listening'
                ? 'bg-emerald-500 text-stone-950 animate-pulse shadow-emerald-500/50'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-amber-500/30'
            } disabled:opacity-50`}
            title="Tap to Speak to Acharya"
          >
            <Mic className="w-6 h-6 font-bold" />
          </button>

          {/* Speaker Mute/Unmute */}
          <button
            onClick={() => {
              if (isSpeakerOn && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              setIsSpeakerOn(!isSpeakerOn);
            }}
            className={`p-3 rounded-full border transition ${
              !isSpeakerOn ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white'
            }`}
            title={isSpeakerOn ? 'Mute Speaker' : 'Turn On Speaker'}
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            className="p-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition hover:scale-105 active:scale-95"
            title="End Consultation Call"
          >
            <PhoneOff className="w-5 h-5" />
          </button>

        </div>

      </div>
    </div>
  );
};
