'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ApplicationDetail {
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
    ssn_last_four?: string;
  };
}

export default function ApplicationReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const applicationId = resolvedParams.id;
  const router = useRouter();

  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [codeInputValue, setCodeInputValue] = useState<string>('');

  const fetchApplication = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}`);
      if (res.ok) {
        const data = await res.json();
        setApplication(data);
        if (data.transaction_reference) {
          setCodeInputValue(data.transaction_reference);
        }
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to retrieve application file.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error occurred while contacting underwriting servers.');
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  const updateApplicationStatus = async (
    newStatus: 'approved' | 'rejected' | 'pending',
    customCode?: string
  ) => {
    setUpdating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload: { status: string; transaction_reference?: string } = {
        status: newStatus,
      };

      if (customCode !== undefined) {
        payload.transaction_reference = customCode.toUpperCase();
      }

      const res = await fetch(`/api/admin/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updatedData = await res.json();
        setApplication((prev) => (prev ? { ...prev, ...updatedData } : updatedData));
        setSuccessMessage(`Application status successfully updated to ${newStatus.toUpperCase()}.`);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to update status.');
      }
    } catch (err) {
      console.error(err);
      setError('A network error occurred while updating application status.');
    } finally {
      setUpdating(false);
    }
  };

  const statusClean = application?.status?.toLowerCase();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      <Header />

      {/* Top Navigation Bar */}
      <section className="bg-[#0A192F] text-white py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin"
                className="text-xs font-semibold uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-2 mb-2"
              >
                &larr; Back to Master Queue
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Underwriting Decision Desk
              </h1>
            </div>
            <div className="font-mono text-xs text-slate-400 bg-slate-800/80 px-3 py-2 rounded border border-slate-700">
              FILE ID: {applicationId}
            </div>
          </div>
        </div>
      </section>

      {/* Main Form Content */}
      <section className="py-12 bg-slate-50 flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="p-16 text-center text-slate-500 font-semibold animate-pulse bg-white border border-slate-300 rounded-lg">
              Fetching applicant file and financial profile...
            </div>
          ) : error && !application ? (
            <div className="bg-red-50 border-l-4 border-red-600 p-6 text-red-800 rounded shadow-sm">
              <h3 className="font-bold text-lg mb-1">File Error</h3>
              <p className="text-sm mb-4">{error}</p>
              <button
                onClick={() => router.push('/admin')}
                className="bg-red-700 text-white font-semibold text-xs px-4 py-2 rounded uppercase tracking-wider"
              >
                Return to Admin Queue
              </button>
            </div>
          ) : application ? (
            <div className="space-y-8">
              {/* Alert Readouts */}
              {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-600 p-4 text-green-800 text-sm font-semibold rounded">
                  {successMessage}
                </div>
              )}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-600 p-4 text-red-800 text-sm font-semibold rounded">
                  {error}
                </div>
              )}

              {/* Status Header Banner */}
              <div className="bg-white border border-slate-300 rounded-lg p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-1">
                    Current Application Status
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block px-4 py-1.5 border rounded text-sm font-bold uppercase tracking-wider ${
                        statusClean === 'approved'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : statusClean === 'rejected'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-yellow-50 text-yellow-800 border-yellow-200'
                      }`}
                    >
                      {application.status}
                    </span>
                    {application.transaction_reference && (
                      <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1 rounded">
                        CODE: {application.transaction_reference}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Underwriting Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    disabled={updating || statusClean === 'approved'}
                    onClick={() => updateApplicationStatus('approved', codeInputValue)}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Approve Application
                  </button>
                  <button
                    disabled={updating || statusClean === 'rejected'}
                    onClick={() => updateApplicationStatus('rejected')}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Reject Application
                  </button>
                  <button
                    disabled={updating || statusClean === 'pending'}
                    onClick={() => updateApplicationStatus('pending')}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 disabled:opacity-50 font-bold text-xs px-4 py-3 rounded uppercase tracking-wider transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Secure Transaction Code Management Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 mb-2">
                  Transaction & Verification Code Management
                </h2>
                <p className="text-xs text-blue-700 mb-4">
                  Assign or modify the transaction code attached to this borrower. Approving the user will save this code to their record.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={codeInputValue}
                    onChange={(e) => setCodeInputValue(e.target.value)}
                    placeholder="Enter Code (e.g. DISPATCH-8820)"
                    className="bg-white border border-blue-300 text-slate-900 text-sm font-mono font-semibold rounded px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 flex-grow uppercase"
                  />
                  <button
                    disabled={updating}
                    onClick={() =>
                      updateApplicationStatus(
                        (statusClean as 'approved' | 'rejected' | 'pending') || 'approved',
                        codeInputValue
                      )
                    }
                    className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-6 py-2.5 rounded uppercase tracking-wider transition-colors whitespace-nowrap"
                  >
                    Save & Attach Code
                  </button>
                </div>
              </div>

              {/* Data Grid Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Borrower Personal File */}
                <div className="bg-white border border-slate-300 rounded-lg p-6 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-3">
                    Borrower Personal Profile
                  </h2>
                  <dl className="space-y-4 text-sm">
                    <div>
                      <dt className="text-xs font-semibold text-slate-400 uppercase">Full Legal Name</dt>
                      <dd className="font-semibold text-slate-900 text-base">{application.users?.full_name || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-slate-400 uppercase">Email Address</dt>
                      <dd className="font-medium text-slate-700">{application.users?.email || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-slate-400 uppercase">Phone Number</dt>
                      <dd className="font-medium text-slate-700">{application.users?.phone || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-slate-400 uppercase">US State Location</dt>
                      <dd className="font-medium text-slate-700">{application.users?.state || 'N/A'}</dd>
                    </div>
                  </dl>
                </div>

                {/* Requested Loan Details */}
                <div className="bg-white border border-slate-300 rounded-lg p-6 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-3">
                    Financial & Loan Parameters
                  </h2>
                  <dl className="space-y-4 text-sm">
                    <div>
                      <dt className="text-xs font-semibold text-slate-400 uppercase">Requested Loan Amount</dt>
                      <dd className="font-mono font-bold text-2xl text-slate-900">
                        ${Number(application.loan_amount).toLocaleString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-slate-400 uppercase">Stated Annual Income</dt>
                      <dd className="font-mono font-bold text-slate-800">
                        ${Number(application.income).toLocaleString()} / yr
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-slate-400 uppercase">Requested Loan Term</dt>
                      <dd className="font-medium text-slate-700">{application.loan_term_months} Months</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-slate-400 uppercase">Loan Purpose</dt>
                      <dd className="font-medium text-slate-700">{application.loan_purpose}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-slate-400 uppercase">Application Date</dt>
                      <dd className="font-mono text-xs text-slate-500">
                        {new Date(application.created_at).toLocaleString()}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <Footer />
    </div>
  );
}



