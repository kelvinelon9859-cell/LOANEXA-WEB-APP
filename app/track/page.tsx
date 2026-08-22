'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Search, 
  ShieldAlert, 
  ExternalLink, 
  DollarSign, 
  Percent, 
  Calendar, 
  ArrowRight, 
  Shield, 
  CheckCircle2, 
  Lock, 
  Building2, 
  Scale, 
  Fingerprint, 
  Loader2 
} from 'lucide-react';

interface TrackingResult {
  id: string;
  fullName: string;
  status: string;
  loanAmount: number;
  loanPurpose: string;
  externalVerifyLink?: string;
  createdAt: string;
}

function LoanexaLandingAndTrackContent() {
  const searchParams = useSearchParams();
  
  // Amortization Calculator State
  const [loanAmount, setLoanAmount] = useState<number>(5000);
  const [terms, setTerms] = useState<number>(12);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(439.56);
  const [totalInterest, setTotalInterest] = useState<number>(274.67);
  const [totalPayback, setTotalPayback] = useState<number>(5274.67);
  const apr = 9.99; // Fixed APR from screenshot

  // Application Tracking State
  const [appId, setAppId] = useState<string>('');
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [searched, setSearched] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Application Submission Mock/Simulation State
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', loanPurpose: 'Personal Business' });

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

  // Unified Application Tracking Ledger Hook
  const executeTrackLookup = useCallback(async (targetId: string) => {
    if (!targetId.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/applications?id=${targetId}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        setResult(null);
      }
    } catch (err) {
      console.error(err);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam) {
      setAppId(idParam);
      executeTrackLookup(idParam);
      const trackSection = document.getElementById('track');
      if (trackSection) trackSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, [searchParams, executeTrackLookup]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeTrackLookup(appId);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          loanAmount: loanAmount,
          loanPurpose: formData.loanPurpose,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setSubmitSuccess(data.id || 'LN-2026-SUCCESS');
        setFormData({ fullName: '', email: '', loanPurpose: 'Personal Business' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      <Header />

      {/* Hero Banner Matrix */}
      <section className="bg-white pt-20 pb-16 border-b border-slate-100">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-6">
            <Fingerprint className="w-3.5 h-3.5" />
            <span>US Manual Lending Network</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight mb-6">
            Secure Micro-Finance Loans For <br />
            <span className="text-emerald-600">America's Earners</span>
          </h1>
          
          <p className="text-slate-600 text-base max-w-2xl mx-auto leading-relaxed mb-8">
            Loanexa USA provides fast, manual-verify personal and business capital. We keep 
            our payment pipelines 100% offline to shield your real bank credentials from security risks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a 
              href="#calculator" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-3 rounded-lg transition-colors shadow-sm"
            >
              <span>Calculate Loan Terms</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href="#features" 
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-sm px-6 py-3 rounded-lg transition-colors"
            >
              How Manual Lending Works
            </a>
          </div>

          {/* System Compliance Badges Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            <div className="flex items-center justify-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" /> FDIC INSURED PARTNER
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-slate-400" /> EQUAL HOUSING LENDER
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" /> SEC-GRADE ISOLATION
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-400" /> ZERO CREDIT SCORE HGTS
            </div>
          </div>
        </div>
      </section>

      {/* Feature Operations Index */}
      <section id="features" className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-2">1. No Bank API Linking</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                We never ask for your bank routing usernames, passwords, or security answers. Your credentials stay secure and completely in your control.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Fingerprint className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-2">2. Manual ID Underwriting</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Submit your US Driver's License and the last 4 digits of your SSN. Our underwriting desk cross-references government databases manually for zero-vulnerability safety.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-2">3. Direct Offline ACH</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Once manually verified, an advisor contacts you directly. Cash is wired offline via manual ACH or check dispatch. Simple, proven, and incredibly safe.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Amortization Tool Section */}
      <section id="calculator" className="py-12 bg-slate-100 border-t border-b border-slate-200/60">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">USA Credit Amortization Tool</h2>
            <p className="text-slate-500 text-xs mt-1">
              Adjust the sliders to view your guaranteed terms. No banking login plugins, APIs, or credit report pulls are required to qualify.
            </p>
          </div>

          {/* Calculator Interface Block */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-teal-700 text-white p-4">
              <h3 className="text-base font-bold">Calculate Your Loan Terms</h3>
              <p className="text-teal-100 text-[11px]">Get instant, transparent terms with no impact on your credit score.</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Slider 1: Principal Amount */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Desired Loan Amount
                  </label>
                  <span className="text-xl font-black text-slate-900">${loanAmount.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="500" max="50000" step="500" 
                  value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-teal-700 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>$500</span>
                  <span>$25,000</span>
                  <span>$50,000</span>
                </div>
              </div>

              {/* Slider 2: Term Duration */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Repayment Terms
                  </label>
                  <span className="text-xl font-black text-slate-900">{terms} Months</span>
                </div>
                <input 
                  type="range" min="3" max="36" step="1" 
                  value={terms} onChange={(e) => setTerms(Number(e.target.value))}
                  className="w-full accent-teal-700 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>3 Mos</span>
                  <span>12 Mos</span>
                  <span>24 Mos</span>
                  <span>36 Mos</span>
                </div>
              </div>

              {/* Data Metrics Readout Deck */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Monthly Payment</span>
                  <p className="text-xl font-black text-teal-700">${monthlyPayment.toLocaleString()}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Estimated APR</span>
                  <p className="text-xl font-black text-slate-900">{apr}% <span className="text-xs text-emerald-500 font-bold">FIXED</span></p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Total Interest</span>
                  <p className="text-xl font-black text-slate-900">${totalInterest.toLocaleString()}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">Total Payback</span>
                  <p className="text-xl font-black text-slate-900">${totalPayback.toLocaleString()}</p>
                </div>
              </div>

              {/* Internal Hardened Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> No hidden origination fees</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Zero pre-payment penalties</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Simple manual ACH disbursement</span>
              </div>

              {/* Transaction Action Panel Trigger */}
              {!isApplying ? (
                <button 
                  onClick={() => setIsApplying(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3 px-4 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Apply For This Loan Now</span>
                </button>
              ) : (
                <form onSubmit={handleApplySubmit} className="pt-4 border-t border-slate-100 space-y-4">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Secure Transmission Information Ledger</h4>
                  
                  {submitSuccess ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-800 space-y-2">
                      <p className="font-bold">🎉 Application Document Dispatched Successfully!</p>
                      <p>Your secure reference tracking key is: <span className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300 font-black">{submitSuccess}</span></p>
                      <p className="text-slate-500">Copy this key identifier and paste it into the tracking engine workspace module below.</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-3 gap-3">
                      <input 
                        type="text" placeholder="Full Legal Name" required
                        value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="bg-slate-50 border border-slate-200 text-xs font-medium rounded-lg p-2.5 focus:outline-teal-700"
                      />
                      <input 
                        type="email" placeholder="Secure Email Identity" required
                        value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-slate-50 border border-slate-200 text-xs font-medium rounded-lg p-2.5 focus:outline-teal-700"
                      />
                      <button 
                        type="submit" disabled={submitting}
                        className="bg-teal-700 hover:bg-teal-600 disabled:bg-slate-400 text-white font-bold text-xs rounded-lg p-2.5 transition-colors flex items-center justify-center gap-1.5"
                      >
                        {submitting && <Loader2 className="w-3 h-3 animate-spin" />}
                        <span>Transmit Underwriting File</span>
                      </button>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Secure Tracking Sub-System Dashboard */}
      <section id="track" className="flex-grow max-w-2xl w-full mx-auto px-4 py-16">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 text-center mb-1">Track Application Status</h2>
        <p className="text-slate-500 text-xs font-mono text-center mb-6">Enter your formal token identifier (e.g., LN-2026-8941)</p>
        
        <form onSubmit={handleTrackSubmit} className="bg-white p-4 border border-slate-200 shadow-md rounded-xl flex space-x-2 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input 
              type="text" value={appId} onChange={(e) => setAppId(e.target.value)}
              placeholder="LN-2026-XXXX" required
              className="w-full bg-slate-50 pl-9 pr-4 py-2 rounded-lg border font-mono font-bold uppercase tracking-wider text-sm focus:outline-slate-800" 
            />
          </div>
          <button type="submit" className="bg-slate-900 text-white font-semibold text-sm px-5 py-2 rounded-lg hover:bg-slate-800 transition-colors">
            Lookup
          </button>
        </form>

        {loading && <p className="text-center font-mono text-xs text-slate-400 animate-pulse">Querying tracking ledger indexes...</p>}

        {searched && !loading && (
          result ? (
            <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">FILE REFERENCE</span>
                  <h2 className="text-lg font-mono font-black tracking-tight text-slate-900">{result.id}</h2>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">PIPELINE STATUS</span>
                  <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-xs uppercase tracking-wider font-mono font-bold mt-1">
                    {result.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Applicant</span>
                  <span className="font-semibold text-slate-800">{result.fullName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Requested Funds</span>
                  <span className="font-mono font-bold text-slate-900">${result.loanAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Dynamic Manual Verification Link UI Field */}
              {result.externalVerifyLink ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold text-emerald-800">Action Required: Manual ID Verification</p>
                  <p className="text-xs text-slate-600">Your underwriter has confirmed entry. Click below to fulfill verification:</p>
                  <a href={result.externalVerifyLink} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-1 text-xs font-mono font-bold text-emerald-700 hover:underline">
                    <span>Link to External Verification Protocol</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600">
                  <p className="font-semibold text-slate-700">Awaiting Operational Routing</p>
                  <p className="mt-1">Your underwriter is assigning your file to a secure off-grid identification terminal. Once assigned, your link will dynamically appear here.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs flex items-center space-x-2 font-mono">
              <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>Token reference match not found inside system tables. Verify format entry.</span>
            </div>
          )
        )}
      </section>

      <Footer />
    </div>
  );
}

export default function LoanexaLandingAndTrack() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-mono text-xs text-slate-400">Loading tracking system...</div>}>
      <LoanexaLandingAndTrackContent />
    </Suspense>
  );
}