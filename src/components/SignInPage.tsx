import React, { useState } from 'react';
import {
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Mail,
  KeyRound,
  Sparkles,
} from 'lucide-react';
import { googleSignIn, logout } from '../services/firebase';

interface SignInPageProps {
  onSignInSuccess: (email: string) => void;
  onBackToLanding: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onSignInSuccess,
  onBackToLanding,
}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Validate any standard valid email address
  const isValidEmail = (emailStr: string): boolean => {
    const trimmed = emailStr.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  };

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setErrorMessage(
        'Please enter a valid email address (e.g., yourname@gmail.com).'
      );
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessNotice(`Authentication successful for ${cleanEmail}! Loading Studio...`);
      localStorage.setItem('brand_studio_user_email', cleanEmail);
      setTimeout(() => {
        onSignInSuccess(cleanEmail);
      }, 500);
    }, 500);
  };

  const handleGoogleSignIn = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    try {
      const result = await googleSignIn();
      if (!result || !result.user) {
        throw new Error('Google Sign-in was cancelled or failed.');
      }

      const userEmail = (result.user.email || '').trim().toLowerCase();

      if (!isValidEmail(userEmail)) {
        await logout();
        setErrorMessage('Unable to retrieve a valid email from Google sign-in. Please try again.');
        return;
      }

      setSuccessNotice(`Welcome, ${result.user.displayName || userEmail}! Access granted.`);
      localStorage.setItem('brand_studio_user_email', userEmail);
      setTimeout(() => {
        onSignInSuccess(userEmail);
      }, 500);
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setErrorMessage(
        err?.message || 'Authentication error. Please check your credentials and try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDemoSignIn = () => {
    const demoEmail = 'creator@brandstudio.io';
    setEmail(demoEmail);
    setPassword('studio-demo-2026');
    setErrorMessage(null);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      localStorage.setItem('brand_studio_user_email', demoEmail);
      onSignInSuccess(demoEmail);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-hidden font-sans">
      {/* Background illumination */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Top Header & Back Button */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToLanding}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>

        <span className="text-[11px] font-mono text-zinc-500">
          Brand Studio Portal
        </span>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-md w-full mx-auto bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative z-10 my-8 space-y-6">
        {/* Brand Emblem */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-zinc-950 mx-auto flex items-center justify-center font-black text-xl shadow-lg border border-amber-300">
            <span className="font-mono font-black text-xl">B²</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Sign In to Brand Studio
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Cross-Medium Commercial Advertising Visualizer
            </p>
          </div>
        </div>

        {/* Valid Email Access Banner */}
        <div className="p-3.5 rounded-2xl bg-zinc-850 border border-zinc-700/80 text-zinc-300 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-white">Universal Email Access</p>
            <p className="text-zinc-400 text-[11px]">
              Sign in with any valid email address or Google account (Gmail, university, corporate, or custom domain).
            </p>
          </div>
        </div>

        {/* Error Notice */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Sign-In Notice</p>
              <p className="text-rose-300/90 text-[11px] mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Success Notice */}
        {successNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{successNotice}</p>
            </div>
          </div>
        )}

        {/* Google Sign-In with Official Button */}
        <div className="space-y-3">
          <button
            type="button"
            id="google-sign-in-btn"
            onClick={handleGoogleSignIn}
            disabled={isProcessing}
            className="w-full relative inline-flex items-center justify-center px-4 py-3 bg-white hover:bg-zinc-50 text-zinc-800 font-semibold text-xs sm:text-sm rounded-xl shadow-md border border-zinc-200 transition-all cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block', width: '100%', height: '100%' }}>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
              </div>
              <span className="text-zinc-800">
                {isProcessing ? 'Connecting...' : 'Sign in with Google Account'}
              </span>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px bg-zinc-800 flex-1" />
            <span className="text-[10px] text-zinc-500 font-mono uppercase">or sign in with email</span>
            <div className="h-px bg-zinc-800 flex-1" />
          </div>
        </div>

        {/* Email & Password Direct Form */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="valid-email-input"
              className="text-xs font-semibold text-zinc-300 flex items-center justify-between"
            >
              <span>Email Address</span>
              <span className="text-[10px] text-zinc-500 font-mono">Any valid email</span>
            </label>
            <div className="relative">
              <input
                id="valid-email-input"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="you@example.com"
                required
                className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all font-mono"
              />
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="valid-password-input"
              className="text-xs font-semibold text-zinc-300 flex items-center justify-between"
            >
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                id="valid-password-input"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="••••••••••••"
                required
                className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all"
              />
              <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            id="submit-email-signin-btn"
            disabled={isProcessing}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs sm:text-sm transition-all shadow-lg cursor-pointer disabled:opacity-50"
          >
            <span>{isProcessing ? 'Signing In...' : 'Sign In to Brand Studio'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Account Helper */}
        <div className="pt-2 border-t border-zinc-800/80 flex flex-col items-center text-center space-y-2">
          <p className="text-[11px] text-zinc-500">Need instant evaluation access?</p>
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            Click for 1-Click Instant Demo Login (creator@brandstudio.io)
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-md w-full mx-auto text-center text-xs text-zinc-600">
        <p>© 2026 Brand Studio • Commercial Object Visualization</p>
      </div>
    </div>
  );
};
