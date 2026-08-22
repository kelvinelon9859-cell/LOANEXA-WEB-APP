
'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface TrackingResult {
  id: string;
  fullName: string;
  status: string;
  loanAmount: number;
  loanPurpose?: string;
  externalVerifyLink?: string;
  createdAt?: string;
}

// Client-side PII Masker (e.g., "John Doe" -> "John D.")
function maskName(name?: string): string {
  if (!name) return 'Applicant';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

function LandingAndTrackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Amortization Calculator State
  const [loanAmount, setLoanAmount] = useState<number>(5000);
  const [terms, setTerms] = useState<number>(12);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(439.56);
  const [totalInterest, setTotalInterest] = useState<number>(274.67);
  const [totalPayback, setTotalPayback] = useState<number>(5274.67);
  const apr = 9.99; // Fixed APR

  // Application Tracking State
  const [appId, setAppId] = useState<string>('');
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [searched, setSearched] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Live Financial Calculation Formula Engine
  useEffect(() => {
    const monthlyRate = (apr / 100) / 12;
    const payment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, terms)) / (Math.pow(1 + monthlyRate, terms) - 1);
    
    if (!isNaN(payment) && isFinite(payment)) {
      const calculatedTotalPayback = payment * terms;
      const calculatedTotalInterest = calculatedTotalPayback - loanAmount;
      
      setMonthlyPayment(Number(payment.toFixed(2)));
      setTotalInterest(Number(calculatedTotalInterest.toFixed(2)));
      setTotalPayback(Number(calculatedTotalPayback.toFixed(2)));
    }
  }, [loanAmount, terms]);

  // Unified Application Tracking Lookup Engine
  const executeTrackLookup = useCallback(async (targetId: string) => {
    const cleanId = targetId.trim();
    if (!cleanId) return;

    setLoading(true);
    setSearched(true);
    setResult(null);

    try {
      const res = await fetch(`/api/applications?id=${encodeURIComponent(cleanId)}`);
      
      if (res.ok) {
        const rawData = await res.json();
        
        // Normalize backend response fields and sanitize full names
        const rawName = rawData.fullName || rawData.users?.full_name || rawData.full_name || '';
        
        const sanitizedResult: TrackingResult = {
          id: rawData.id || cleanId,
          fullName: maskName(rawName),
          status: (rawData.status || 'PENDING').toUpperCase(),
          loanAmount: rawData.loanAmount ?? rawData.loan_amount ?? 0,
          loanPurpose: rawData.loanPurpose || rawData.loan_purpose || 'Personal',
          externalVerifyLink: rawData.externalVerifyLink || rawData.external_verify_link,
          createdAt: rawData.createdAt || rawData.created_at,
        };

        setResult(sanitizedResult);
      } else {
        setResult(null);
      }
    } catch (err) {
      console.error('Tracking Lookup Error:', err);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam) {
      const sanitizedParam = idParam.trim();
      setAppId(sanitizedParam);
      executeTrackLookup(sanitizedParam);
      const trackSection = document.getElementById('track');
      if (trackSection) trackSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, [searchParams, executeTrackLookup]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeTrackLookup(appId);
  };

  const handleApplyRedirect = () => {
    router.push(`/apply?amount=${loanAmount}&terms=${terms}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      <Header />

      {/* Hero Banner Matrix */}
      <section className="bg-[#0A192F] text-white pt-24 pb-20 border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-300 font-semibold tracking-widest uppercase text-sm mb-4">
            US Manual Lending Network
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
            Secure Personal Lending for <br />
            America's Workforce
          </h1>
          
          <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
            Loanexa USA provides fast, manual-verify capital. We keep our payment pipelines 100% offline to shield your real bank credentials from modern security risks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a 
              href="#calculator" 
              className="w-full sm:w-auto inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base px-8 py-4 rounded transition-colors"
            >
              Calculate Loan Terms
            </a>
            <a 
              href="#features" 
              className="w-full sm:w-auto inline-block bg-transparent hover:bg-[#112240] text-white border border-slate-500 font-semibold text-base px-8 py-4 rounded transition-colors"
            >
              How It Works
            </a>
          </div>

          {/* System Compliance Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-8 border-t border-[#112240] text-xs font-semibold tracking-wider text-slate-400 uppercase">
            <span>FDIC Insured Partners</span>
            <span>Equal Housing Lender</span>
            <span>SEC-Grade Isolation</span>
            <span>Zero Credit Score Hits</span>
          </div>
        </div>
      </section>

      {/* Feature Operations Index */}
      <section id="features" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">A Safer Way to Borrow</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">Our manual underwriting process protects your sensitive digital data by relying on traditional, offline verification methods.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 border-t border-slate-200 pt-12">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 border-l-4 border-blue-600 pl-4">1. No Bank Linking</h3>
              <p className="text-slate-600 text-base leading-relaxed pl-5">
                We never ask for your bank routing usernames, passwords, or security answers. Your credentials stay secure and completely in your control.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 border-l-4 border-blue-600 pl-4">2. Manual Underwriting</h3>
              <p className="text-slate-600 text-base leading-relaxed pl-5">
                Submit your US Driver's License and the last 4 digits of your SSN. Our underwriting desk cross-references government databases manually.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 border-l-4 border-blue-600 pl-4">3. Direct Offline ACH</h3>
              <p className="text-slate-600 text-base leading-relaxed pl-5">
                Once verified, an advisor contacts you directly. Cash is wired offline via manual ACH or check dispatch. Simple, proven, and incredibly safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Amortization Tool Section */}
      <section id="calculator" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Loan Calculator</h2>
            <p className="text-slate-600 mt-2">
              Adjust the sliders to view your guaranteed terms. No banking login plugins, APIs, or credit report pulls are required to qualify.
            </p>
          </div>

          {/* Calculator Interface Block */}
          <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-slate-100 border-b border-slate-300 px-8 py-5">
              <h3 className="text-lg font-semibold text-slate-900">Customize Your Request</h3>
            </div>

            <div className="p-8 space-y-10">
              {/* Slider 1: Principal Amount */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-sm font-semibold text-slate-700">
                    Desired Loan Amount
                  </label>
                  <span className="text-3xl font-bold text-slate-900">
                    ${loanAmount.toLocaleString()}
                  </span>
                </div>
                <input 
                  type="range" min="500" max="50000" step="500" 
                  value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-sm text-slate-500 mt-3">
                  <span>$500</span>
                  <span>$50,000</span>
                </div>
              </div>

              {/* Slider 2: Term Duration */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-sm font-semibold text-slate-700">
                    Repayment Term
                  </label>
                  <span className="text-3xl font-bold text-slate-900">
                    {terms} Months
                  </span>
                </div>
                <input 
                  type="range" min="3" max="36" step="1" 
                  value={terms} onChange={(e) => setTerms(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-sm text-slate-500 mt-3">
                  <span>3 Months</span>
                  <span>36 Months</span>
                </div>
              </div>

              {/* Data Metrics Readout Deck */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-slate-200">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 block mb-1">Monthly Payment</span>
                  <p className="text-2xl font-bold text-blue-700">${monthlyPayment.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 block mb-1">Fixed APR</span>
                  <p className="text-2xl font-bold text-slate-900">{apr}%</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 block mb-1">Total Interest</span>
                  <p className="text-2xl font-bold text-slate-900">${totalInterest.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 block mb-1">Total Payback</span>
                  <p className="text-2xl font-bold text-slate-900">${totalPayback.toLocaleString()}</p>
                </div>
              </div>

              {/* Direct Route Action Trigger */}
              <div className="pt-6">
                <button 
                  onClick={handleApplyRedirect}
                  className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white font-semibold text-base py-4 px-10 rounded transition-colors"
                >
                  Apply For This Loan
                </button>
                <p className="text-sm text-slate-500 mt-4">
                  * No hidden origination fees. Zero pre-payment penalties. Simple manual ACH disbursement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secure Tracking Sub-System Dashboard */}
      <section id="track" className="py-20 bg-white border-t border-slate-200 flex-grow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Track Application Status</h2>
            <p className="text-slate-600">Enter your formal token identifier (e.g., LN-2026-8941) to check the status of your manual review.</p>
          </div>
          
          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-4 mb-12">
            <input 
              type="text" 
              value={appId} 
              onChange={(e) => setAppId(e.target.value)}
              placeholder="Application ID" 
              required
              className="flex-grow bg-white px-5 py-4 rounded border border-slate-300 font-mono text-base focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 uppercase" 
            />
            <button 
              type="submit" 
              className="bg-slate-900 text-white font-semibold text-base px-10 py-4 rounded hover:bg-slate-800 transition-colors"
            >
              Lookup File
            </button>
          </form>

          {loading && <p className="text-center font-semibold text-slate-500">Querying records...</p>}

          {searched && !loading && (
            result ? (
              <div className="border border-slate-300 rounded shadow-sm overflow-hidden bg-white">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">File Reference</span>
                    <h2 className="text-lg font-mono font-bold text-slate-900">{result.id}</h2>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider mb-1">Status</span>
                    <span className={`inline-block px-3 py-1 border rounded text-sm font-semibold uppercase ${
                      result.status === 'APPROVED' 
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : result.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}>
                      {result.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 border-b border-slate-200 pb-8">
                    <div>
                      <span className="text-sm font-semibold text-slate-500 block mb-1">Primary Applicant</span>
                      <span className="text-lg text-slate-900">{result.fullName}</span>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-500 block mb-1">Requested Funds</span>
                      <span className="text-lg font-mono text-slate-900">${result.loanAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Dynamic Manual Verification Link UI Field */}
                  {result.externalVerifyLink ? (
                    <div className="bg-blue-50 border-l-4 border-blue-600 p-5">
                      <h4 className="text-base font-bold text-blue-900 mb-2">Action Required: Manual ID Verification</h4>
                      <p className="text-sm text-blue-800 mb-4">Your underwriter has confirmed your entry. Please proceed to the external verification portal to complete your file.</p>
                      <a 
                        href={result.externalVerifyLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-block bg-blue-600 text-white font-semibold text-sm px-6 py-3 rounded hover:bg-blue-700 transition-colors"
                      >
                        Complete External Verification &rarr;
                      </a>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded p-5">
                      <h4 className="font-semibold text-slate-900 mb-2">Awaiting Operational Routing</h4>
                      <p className="text-sm text-slate-600">Your underwriter is assigning your file to a secure off-grid identification terminal. Once assigned, your verification instructions will appear here.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border-l-4 border-red-600 p-5 text-red-800">
                <p className="font-semibold">Record Not Found</p>
                <p className="text-sm mt-1">We could not locate an application with that token identifier. Please verify your format and try again.</p>
              </div>
            )
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function LoanexaLandingAndTrack() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-semibold text-slate-500">Loading Page...</div>}>
      <LandingAndTrackContent />
    </Suspense>
  );
}