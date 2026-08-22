'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ApplicationItem {
  id: string;
  loan_amount: number;
  loan_purpose: string;
  loan_term_months: number;
  income: number;
  status: string;
  created_at: string;
  transaction_reference?: string;
  users: {
    full_name: string;
    email: string;
    phone: string;
    state: string;
  };
}

function AdminPanelContent() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dispatch Code States
  const [dispatchAppId, setDispatchAppId] = useState<string>('');
  const [dispatchCode, setDispatchCode] = useState<string>('');
  const [isDispatching, setIsDispatching] = useState<boolean>(false);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/applications');
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to fetch application records.');
      }
    } catch (err) {
      console.error(err);
      setError('A network error occurred while connecting to the underwriting database.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Handler for sending a code to a qualified applicant
  const handleDispatchCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchAppId || !dispatchCode.trim()) return;

    setIsDispatching(true);
    try {
      // Reusing the PATCH endpoint to attach the code to the transaction_reference column
      const res = await fetch(`/api/admin/applications/${dispatchAppId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'approved', // Ensure status remains approved
          transaction_reference: dispatchCode.toUpperCase() 
        }),
      });

      if (res.ok) {
        alert(`Code ${dispatchCode.toUpperCase()} successfully dispatched to application ${dispatchAppId}!`);
        setDispatchCode('');
        setDispatchAppId('');
        fetchApplications(); // Refresh list to reflect updates
      } else {
        const errData = await res.json();
        alert(`Failed to dispatch code: ${errData.error}`);
      }
    } catch (err) {
      console.error('Dispatch error:', err);
      alert('A network error occurred while sending the code.');
    } finally {
      setIsDispatching(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const q = searchQuery.toLowerCase();
    return (
      app.id?.toLowerCase().includes(q) ||
      app.users?.full_name?.toLowerCase().includes(q) ||
      app.users?.email?.toLowerCase().includes(q) ||
      app.status?.toLowerCase().includes(q) ||
      app.transaction_reference?.toLowerCase().includes(q)
    );
  });

  // Filter only applications that have been approved for the dropdown
  const qualifiedApps = applications.filter(app => app.status?.toLowerCase() === 'approved');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      <Header />

      {/* Hero Banner Matrix */}
      <section className="bg-[#0A192F] text-white pt-20 pb-16 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-blue-300 font-semibold tracking-widest uppercase text-sm mb-2">
                US Underwriting Operations
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Underwriter Admin Panel
              </h1>
              <p className="text-slate-300 text-base mt-2 max-w-2xl">
                Direct manual verification queue. Manage incoming borrower applications, evaluate underwriting parameters, and issue decision responses.
              </p>
            </div>
            <div>
              <button
                onClick={fetchApplications}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded transition-colors"
              >
                Refresh Queue
              </button>
            </div>
          </div>

          {/* System Compliance Row */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 pt-8 mt-8 border-t border-[#112240] text-xs font-semibold tracking-wider text-slate-400 uppercase">
            <span>Total Records: {applications.length}</span>
            <span>Manual Review Desk</span>
            <span>SEC-Grade Isolation</span>
            <span>Strict Offline ACH Dispatch</span>
          </div>
        </div>
      </section>

      {/* Applications Ledger Table */}
      <section className="py-12 bg-slate-50 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Controls & Search Input */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="w-full sm:w-96">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, name, email, or status..."
                className="w-full bg-white px-4 py-3 rounded border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Showing {filteredApplications.length} of {applications.length} Files
            </p>
          </div>

          {/* Qualified Code Dispatch Bar */}
          <div className="bg-white border border-blue-200 shadow-sm rounded-lg p-5 mb-8">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider">Dispatch Secure Code to Qualified Applicant</h3>
              <p className="text-xs text-slate-500 mt-1">Select an approved applicant to attach and send a transaction or verification code.</p>
            </div>
            <form onSubmit={handleDispatchCode} className="flex flex-col sm:flex-row gap-4">
              <select 
                value={dispatchAppId} 
                onChange={(e) => setDispatchAppId(e.target.value)}
                required
                className="flex-1 bg-slate-50 px-4 py-3 rounded border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
              >
                <option value="" disabled>Select Qualified Application...</option>
                {qualifiedApps.map(app => (
                  <option key={app.id} value={app.id}>
                    {app.id} — {app.users?.full_name} (${Number(app.loan_amount).toLocaleString()})
                  </option>
                ))}
              </select>
              <input 
                type="text" 
                value={dispatchCode}
                onChange={(e) => setDispatchCode(e.target.value)}
                placeholder="Enter Code (e.g., TXN-9982)..."
                required
                className="flex-1 bg-slate-50 px-4 py-3 rounded border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 uppercase font-mono"
              />
              <button 
                type="submit"
                disabled={isDispatching || qualifiedApps.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-8 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isDispatching ? 'Sending...' : 'Send Code'}
              </button>
            </form>
          </div>

          {/* Error Readout */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-600 p-4 text-red-800 text-sm font-semibold rounded">
              {error}
            </div>
          )}

          {/* Table Card Block */}
          <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-500 font-semibold animate-pulse">
                Querying database records...
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <p className="font-semibold text-slate-700 text-lg mb-1">No Applications Located</p>
                <p className="text-sm">There are no records matching your filter parameters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 uppercase text-xs font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Application ID</th>
                      <th className="px-6 py-4">Applicant</th>
                      <th className="px-6 py-4">Requested Funds</th>
                      <th className="px-6 py-4">Status & Code</th>
                      <th className="px-6 py-4">Submission Date</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredApplications.map((app) => {
                      const statusClean = app.status?.toLowerCase();
                      return (
                        <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-slate-900">
                            {app.id}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-900">
                              {app.users?.full_name || 'N/A'}
                            </div>
                            <div className="text-xs text-slate-500">{app.users?.email || 'N/A'}</div>
                            <div className="text-xs text-slate-400">{app.users?.state}</div>
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-slate-900">
                            ${Number(app.loan_amount).toLocaleString()}
                            <div className="text-xs text-slate-500 font-sans font-normal mt-1">{app.loan_purpose}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-3 py-1 border rounded text-xs font-bold uppercase tracking-wider ${
                                statusClean === 'approved'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : statusClean === 'rejected'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : 'bg-yellow-50 text-yellow-800 border-yellow-200'
                              }`}
                            >
                              {app.status}
                            </span>
                            {app.transaction_reference && (
                              <div className="mt-2 text-xs font-mono font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded px-2 py-1 inline-block">
                                {app.transaction_reference}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                            {app.created_at
                              ? new Date(app.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              href={`/admin/applications/${app.id}`}
                              className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded transition-colors uppercase tracking-wider"
                            >
                              Review File &rarr;
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center font-semibold text-slate-500">
          Loading Underwriter Panel...
        </div>
      }
    >
      <AdminPanelContent />
    </Suspense>
  );
}