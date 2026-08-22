'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Open_Sans } from 'next/font/google';
import { Shield, Clock, CheckCircle, FileText, ArrowRight, LogOut, DollarSign, Fingerprint } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import Header from '@/components/Header'; // <-- Added missing import

const openSans = Open_Sans({ subsets: ['latin'] });

type AppStatus = 'incomplete' | 'pending' | 'approved' | 'rejected' | 'funded';

interface ApplicationData {
  id: string;
  loan_amount: number;
  loan_purpose: string;
  status: AppStatus;
}

export default function StatusPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<AppStatus>('incomplete');
  
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [appData, setAppData] = useState<ApplicationData | null>(null);

  // Initialize Supabase client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 1. Get the securely authenticated user from the SSR cookie session
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          router.push('/login');
          return;
        }

        setUserEmail(user.email || '');

        // 2. Fetch the user's DB profile AND their application via Foreign Key relation
        const { data: dbUser, error: dbError } = await supabase
          .from('users')
          .select(`
            full_name,
            applications (
              id,
              loan_amount,
              loan_purpose,
              status
            )
          `)
          .eq('email', user.email)
          .single();

        if (dbError) {
          console.error("Database fetch error:", dbError);
          setLoading(false);
          return;
        }

        if (dbUser?.full_name) {
          setUserName(dbUser.full_name);
        }

        // 3. Determine status based on returned applications
        const applications = dbUser?.applications as any[];
        
        if (applications && applications.length > 0) {
          // Assuming we take the most recent application
          const latestApp = applications[0]; 
          setAppData(latestApp);
          setStatus(latestApp.status as AppStatus);
        } else {
          // If the array is empty, they just signed up but haven't finished the form
          setStatus('incomplete');
        }

      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const statusConfig: Record<string, any> = {
    incomplete: {
      icon: <FileText className="h-8 w-8 text-amber-500" />,
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      title: 'Application Incomplete',
      desc: 'You have created an account but have not submitted your loan application yet.',
      actionText: 'Continue Application',
      actionRoute: '/apply'
    },
    pending: {
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      title: 'Under Review',
      desc: 'Your application has been received and is currently being reviewed by our underwriting team.',
      actionText: 'Update Documents',
      actionRoute: '#'
    },
    approved: {
      icon: <CheckCircle className="h-8 w-8 text-emerald-500" />,
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      title: 'Loan Approved',
      desc: 'Congratulations! Your loan has been approved. Please review your terms and sign the final agreement.',
      actionText: 'Review Loan Terms',
      actionRoute: '#'
    }
  };

  // Fallback to 'pending' config if status doesn't exactly match (e.g., 'rejected', 'funded')
  const currentConfig = statusConfig[status] || statusConfig['pending'];

  return (
    <div className={`min-h-screen flex flex-col antialiased bg-slate-50 ${openSans.className}`}>
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto p-4 sm:p-8 mt-4 sm:mt-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome back{userName ? `, ${userName.split(' ')[0]}` : ''}
            </h1>
            {loading ? (
              <div className="h-4 w-48 bg-slate-200 rounded animate-pulse mt-2"></div>
            ) : (
              <p className="text-sm text-slate-500 font-medium mt-1">Logged in as {userEmail}</p>
            )}
          </div>
          <button 
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm w-fit"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Status Card (Spans 2 columns on desktop) */}
          <div className="md:col-span-2">
            {loading ? (
              <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-8 animate-pulse h-full">
                <div className="h-16 w-16 bg-slate-200 rounded-2xl mb-6"></div>
                <div className="h-6 w-1/3 bg-slate-200 rounded mb-4"></div>
                <div className="h-4 w-2/3 bg-slate-200 rounded mb-8"></div>
                <div className="h-12 w-48 bg-slate-200 rounded-xl"></div>
              </div>
            ) : (
              <div className={`w-full h-full bg-white border-2 ${currentConfig.border} rounded-2xl shadow-sm p-8 relative overflow-hidden transition-all`}>
                <div className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl ${currentConfig.bg} shadow-sm border ${currentConfig.border} mb-6`}>
                  {currentConfig.icon}
                </div>
                
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  {currentConfig.title}
                </h2>
                <p className="text-slate-600 mb-8 max-w-xl leading-relaxed">
                  {currentConfig.desc}
                </p>

                <button
                  onClick={() => router.push(currentConfig.actionRoute)}
                  className="bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md w-full sm:w-auto"
                >
                  {currentConfig.actionText}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Context Sidebar Card */}
          <div className="md:col-span-1">
            <div className="w-full h-full bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">
                Application Details
              </h3>

              {loading ? (
                <div className="space-y-6 animate-pulse">
                  <div>
                    <div className="h-3 w-24 bg-slate-200 rounded mb-2"></div>
                    <div className="h-5 w-32 bg-slate-200 rounded"></div>
                  </div>
                  <div>
                    <div className="h-3 w-24 bg-slate-200 rounded mb-2"></div>
                    <div className="h-5 w-32 bg-slate-200 rounded"></div>
                  </div>
                </div>
              ) : appData ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-xs font-semibold">Requested Amount</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">
                      ${Number(appData.loan_amount).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <Fingerprint className="h-4 w-4" />
                      <span className="text-xs font-semibold">Application ID</span>
                    </div>
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {appData.id}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 block mb-1">Purpose</span>
                    <p className="text-sm font-medium text-slate-900 capitalize">
                      {appData.loan_purpose.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-500 font-medium">No active application found.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}