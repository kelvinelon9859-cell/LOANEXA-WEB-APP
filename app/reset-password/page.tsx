'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Session Guard State
  const [hasSession, setHasSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const hasExchanged = useRef(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const setupSession = async () => {
      // 1. Check if a session already exists
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setHasSession(true);
        setIsCheckingSession(false);
        return;
      }

      // 2. If no session, securely exchange the URL code
      if (code && !hasExchanged.current) {
        hasExchanged.current = true;
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
          setErrorMessage('Your link has expired or is invalid.');
        } else if (data.session) {
          setHasSession(true);
        }
      } else if (!code && !session) {
        setErrorMessage('No valid reset code found in the URL.');
      }
      
      setIsCheckingSession(false);
    };

    setupSession();
  }, [code, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setIsSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error updating password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = 'w-full bg-white px-4 py-3 rounded border border-slate-300 text-slate-900 text-base focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600';

  if (isCheckingSession) {
    return (
      <div className="w-full max-w-md mx-auto bg-white border border-slate-300 rounded-lg shadow-sm p-8 text-center text-slate-600 font-medium">
        Authenticating your secure link...
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="w-full max-w-md mx-auto bg-white border border-slate-300 rounded-lg shadow-sm p-8 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-4 mb-6">
          {errorMessage || 'Authentication failed.'}
        </div>
        <button
          onClick={() => router.push('/forgot-password')}
          className="text-blue-600 font-semibold hover:underline"
        >
          Request a new link
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-slate-300 rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Create New Password</h2>
      
      {isSuccess ? (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded p-4 text-center mt-6">
          <p className="font-semibold mb-1">Password Updated!</p>
          <p className="text-sm">Redirecting you to login...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm">{errorMessage}</div>
          )}
          <div>
            <label className="block text-xs uppercase font-semibold text-slate-700 tracking-wider mb-2">New Password</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputStyle} />
          </div>
          <div>
            <label className="block text-xs uppercase font-semibold text-slate-700 tracking-wider mb-2">Confirm Password</label>
            <input type="password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className={inputStyle} />
          </div>
          <button type="submit" disabled={isSubmitting || !password} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base py-3 px-4 rounded transition-colors disabled:opacity-50">
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6">
        <Suspense fallback={<div className="text-slate-500 font-semibold">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}