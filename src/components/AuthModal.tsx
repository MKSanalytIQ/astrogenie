import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signInAnonymously, User } from 'firebase/auth';
import { X, Lock, Sparkles, CheckCircle2, User as UserIcon, LogIn, ArrowRight } from 'lucide-react';
import { AstroGenieLogo } from './AstroGenieLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res?.user) {
        onAuthSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      console.warn('Google sign-in issue, trying fallback:', err?.message);
      // Fallback to anonymous guest sign-in if popup is blocked
      try {
        const anonRes = await signInAnonymously(auth);
        if (anonRes?.user) {
          onAuthSuccess(anonRes.user);
          onClose();
          return;
        }
      } catch (anonErr: any) {
        setErrorMsg('Sign-in failed. Please check popup permissions.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await signInAnonymously(auth);
      if (res?.user) {
        onAuthSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Guest sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0B0F19] border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl my-8 text-center space-y-6">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center">
          <AstroGenieLogo size="md" />
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider mb-2">
            <Lock className="w-3 h-3" />
            <span>Secure Astrological Vault</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-100">
            Sign In to AstroGenie
          </h2>
          <p className="text-xs text-stone-400">
            Save your Janam Kundli, chart your birth particulars, and receive confidential guidance from Acharya AstroGenie.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        <div className="space-y-3 pt-2">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-stone-100 text-stone-900 font-bold text-xs flex items-center justify-center gap-3 shadow-md transition disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Instant Guest / Seeker Demo */}
          <button
            onClick={handleGuestSignIn}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 font-semibold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <UserIcon className="w-4 h-4 text-amber-400" />
            <span>Instant Seeker Access (Guest Mode)</span>
          </button>
        </div>

        <div className="pt-2 text-[11px] text-stone-500 border-t border-stone-800/80">
          By signing in, your birth chart calculations adhere strictly to Brihat Parashara Hora Shastra & 100% confidential encryption.
        </div>

      </div>
    </div>
  );
};
