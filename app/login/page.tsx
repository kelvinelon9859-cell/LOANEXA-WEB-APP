// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Open_Sans } from 'next/font/google';
// import { Shield, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
// import Header from '@/components/Header';
// // import Footer from '@/components/Footer';

// // Initialize Open Sans
// const openSans = Open_Sans({ subsets: ['latin'] });

// export default function UserLoginPage() {
//   const router = useRouter();
  
//   const [view, setView] = useState<'login' | 'signup'>('login');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setStatus('loading');
//     setErrorMessage('');

//     try {
//       const endpoint = view === 'login' ? '/api/auth/login' : '/api/auth/signup';
      
//       const res = await fetch(endpoint, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           email: email.trim(),
//           password: password
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         if (data.error?.includes('already registered')) {
//           throw new Error('An application with this email already exists. Please select "Check Status" to log in.');
//         }
//         if (data.error?.includes('Invalid login')) {
//           throw new Error('Invalid email or password. If you are new, select "New Application" to sign up.');
//         }
//         throw new Error(data.error || `Failed to ${view === 'login' ? 'log in' : 'sign up'}.`);
//       }

//       if (view === 'signup') {
//         router.push('/apply'); 
//       } else {
//         router.push('/status'); 
//       }
      
//     } catch (err: any) {
//       console.error('Auth error:', err);
//       setStatus('error');
//       setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
//     }
//   };

//   return (
//     <div className={`min-h-screen flex flex-col antialiased bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-slate-100 to-slate-200 ${openSans.className}`}>
//       <Header />

//       <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
//         <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 relative overflow-hidden">
          
//           {/* Subtle top accent line */}
//           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
          
//           {/* Brand Element */}
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-emerald-50/80 shadow-sm border border-emerald-100 mb-5">
//               <Shield className="h-7 w-7 text-emerald-600" />
//             </div>
//             <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
//               Loanexa Portal
//             </h1>
//             <p className="text-sm text-slate-500 font-medium">
//               Secure access to your lending dashboard
//             </p>
//           </div>

//           {/* Segmented Control Tabs */}
//           <div className="flex bg-slate-100/80 p-1.5 rounded-xl mb-8 shadow-inner">
//             <button 
//               type="button"
//               onClick={() => { setView('login'); setErrorMessage(''); }}
//               className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
//                 view === 'login' 
//                   ? 'bg-white shadow-sm text-emerald-700 ring-1 ring-slate-900/5' 
//                   : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
//               }`}
//             >
//               Check Status
//             </button>
//             <button 
//               type="button"
//               onClick={() => { setView('signup'); setErrorMessage(''); }}
//               className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
//                 view === 'signup' 
//                   ? 'bg-white shadow-sm text-emerald-700 ring-1 ring-slate-900/5' 
//                   : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
//               }`}
//             >
//               New Application
//             </button>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="space-y-1.5">
//               <label htmlFor="email" className="block text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
//                 Email Address
//               </label>
//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
//                   <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
//                 </div>
//                 <input
//                   id="email"
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="name@example.com"
//                   className="w-full bg-slate-50/50 pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-base focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-medium placeholder:text-slate-400 transition-all duration-200"
//                 />
//               </div>
//             </div>

//             <div className="space-y-1.5">
//               <label htmlFor="password" className="block text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
//                 Password
//               </label>
//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
//                 </div>
//                 <input
//                   id="password"
//                   type="password"
//                   required
//                   minLength={6}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••"
//                   className="w-full bg-slate-50/50 pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-base focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-medium placeholder:text-slate-400 transition-all duration-200"
//                 />
//               </div>
//             </div>

//             {status === 'error' && (
//               <div className="flex items-start gap-3 p-3.5 bg-red-50/80 border border-red-100 rounded-xl text-red-700 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-200">
//                 <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
//                 <p>{errorMessage}</p>
//               </div>
//             )}

//             <div className="pt-2">
//               <button
//                 type="submit"
//                 disabled={status === 'loading' || !email || !password}
//                 className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 disabled:cursor-not-allowed text-white font-bold text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-emerald-600/20"
//               >
//                 {status === 'loading' 
//                   ? 'Processing securely...' 
//                   : (view === 'login' ? 'Access Dashboard' : 'Start Application')}
//                 {status !== 'loading' && <ArrowRight className="h-4 w-4" />}
//               </button>
//             </div>
//           </form>

//         </div>
//       </main>

//       {/* <Footer /> */}
//     </div>
//   );
// }








'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Open_Sans } from 'next/font/google';
import { Shield, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import Header from '@/components/Header';
// import Footer from '@/components/Footer';

// Initialize Open Sans
const openSans = Open_Sans({ subsets: ['latin'] });

export default function UserLoginPage() {
  const router = useRouter();
  
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const endpoint = view === 'login' ? '/api/auth/login' : '/api/auth/signup';
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim(),
          password: password
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error?.includes('already registered')) {
          throw new Error('An application with this email already exists. Please select "Check Status" to log in.');
        }
        if (data.error?.includes('Invalid login')) {
          throw new Error('Invalid email or password. If you are new, select "New Application" to sign up.');
        }
        throw new Error(data.error || `Failed to ${view === 'login' ? 'log in' : 'sign up'}.`);
      }

      if (view === 'signup') {
        router.push('/apply'); 
      } else {
        router.push('/status'); 
      }
      
    } catch (err: any) {
      console.error('Auth error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      
    } catch (err: any) {
      console.error('Google Auth error:', err);
      setStatus('error');
      setErrorMessage('Failed to initialize Google login. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      setStatus('error');
      setErrorMessage('Please enter your email address to reset your password.');
      return;
    }
    
    // Navigate to your password reset flow, passing the email if provided
    router.push(`/forgot-password?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className={`min-h-screen flex flex-col antialiased bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-slate-100 to-slate-200 ${openSans.className}`}>
      <Header />

      <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 relative overflow-hidden">
          
          {/* Subtle top accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
          
          {/* Brand Element */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-emerald-50/80 shadow-sm border border-emerald-100 mb-5">
              <Shield className="h-7 w-7 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
              Loanexa Portal
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Secure access to your lending dashboard
            </p>
          </div>

          {/* Segmented Control Tabs */}
          <div className="flex bg-slate-100/80 p-1.5 rounded-xl mb-8 shadow-inner">
            <button 
              type="button"
              onClick={() => { setView('login'); setErrorMessage(''); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                view === 'login' 
                  ? 'bg-white shadow-sm text-emerald-700 ring-1 ring-slate-900/5' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              Check Status
            </button>
            <button 
              type="button"
              onClick={() => { setView('signup'); setErrorMessage(''); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                view === 'signup' 
                  ? 'bg-white shadow-sm text-emerald-700 ring-1 ring-slate-900/5' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              New Application
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50/50 pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-base focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-medium placeholder:text-slate-400 transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50/50 pl-11 pr-12 py-3 rounded-xl border border-slate-200 text-slate-900 text-base focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-medium placeholder:text-slate-400 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-emerald-500 focus:outline-none transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              {/* Forgot Password Link (Only in Login View) */}
              {view === 'login' && (
                <div className="flex justify-end mt-1">
                  <button 
                    type="button" 
                    onClick={handleForgotPassword}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 transition-colors focus:outline-none"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            {status === 'error' && (
              <div className="flex items-start gap-3 p-3.5 bg-red-50/80 border border-red-100 rounded-xl text-red-700 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={status === 'loading' || !email || !password}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 disabled:cursor-not-allowed text-white font-bold text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-emerald-600/20"
              >
                {status === 'loading' 
                  ? 'Processing securely...' 
                  : (view === 'login' ? 'Access Dashboard' : 'Start Application')}
                {status !== 'loading' && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </form>

          {/* Social / Third-Party Logins */}
          <div className="mt-7">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-slate-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-[0.98] font-bold text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-sm"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}