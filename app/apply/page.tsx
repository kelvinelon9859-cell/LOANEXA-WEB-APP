// 'use client';

// import React, { useState, useEffect, Suspense } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';

// interface StateOption {
//   state_code: string;
//   state_name: string;
// }

// function ApplicationFormContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [currentStep, setCurrentStep] = useState<number>(1);
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const [submittedId, setSubmittedId] = useState<string | null>(null);

//   const [usStates, setUsStates] = useState<StateOption[]>([]);
//   const [isLoadingStates, setIsLoadingStates] = useState<boolean>(true);

//   // 1. ADDED: State to track email validation errors
//   const [emailError, setEmailError] = useState<string | null>(null);

//   const [formData, setFormData] = useState({
//     fullName: '',
//     dob: '',
//     email: '',
//     phone: '',
//     streetAddress: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     employmentStatus: 'Full-Time',
//     employerName: '',
//     annualIncome: '',
//     loanPurpose: 'Debt Consolidation',
//     ssnLast4: '',
//     dlState: '',
//     driverLicenseNumber: '',
//     loanAmount: '5000',
//     loanTerm: '12',
//   });

//   // Load calculation parameters from homepage if present
//   useEffect(() => {
//     const amountParam = searchParams.get('amount');
//     const termsParam = searchParams.get('terms');

//     if (amountParam || termsParam) {
//       setFormData((prev) => ({
//         ...prev,
//         loanAmount: amountParam || prev.loanAmount,
//         loanTerm: termsParam || prev.loanTerm,
//       }));
//     }
//   }, [searchParams]);

//   // Fetch US States Catalog
//   useEffect(() => {
//     async function fetchDbStates() {
//       try {
//         const res = await fetch('/api/states');
//         if (res.ok) {
//           const data = await res.json();
//           if (Array.isArray(data)) {
//             setUsStates(data);
//           } else if (data.rows && Array.isArray(data.rows)) {
//             setUsStates(data.rows);
//           }
//         }
//       } catch (err) {
//         console.error('Error fetching states catalog:', err);
//       } finally {
//         setIsLoadingStates(false);
//       }
//     }
//     fetchDbStates();
//   }, []);

//   const updateField = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   // 2. ADDED: Email validation helper function
//   const validateEmail = (email: string) => {
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!email) return 'Email address is required.';
//     if (!emailRegex.test(email)) return 'Please enter a valid email address (e.g. name@domain.com).';
//     return null;
//   };

//   const handleNext = (e: React.FormEvent) => {
//     e.preventDefault();

//     // 3. ADDED: Block moving past Step 1 if the email is invalid
//     if (currentStep === 1) {
//       const error = validateEmail(formData.email);
//       if (error) {
//         setEmailError(error);
//         return; 
//       }
//     }

//     if (currentStep < 5) {
//       setCurrentStep((prev) => prev + 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep((prev) => prev - 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     try {
//       const payload = {
//         fullName: formData.fullName.trim() || null,
//         dob: formData.dob && formData.dob.trim() !== '' ? formData.dob : null,
//         email: formData.email.trim() || null,
//         phone: formData.phone.trim() || null,
//         streetAddress: formData.streetAddress.trim() || null,
//         city: formData.city.trim() || null,
//         state: formData.state || null,
//         zipCode: formData.zipCode.trim() || null,
//         employmentStatus: formData.employmentStatus || null,
//         employerName: formData.employerName.trim() || null,
//         annualIncome:
//           formData.annualIncome && !isNaN(Number(formData.annualIncome))
//             ? Number(formData.annualIncome)
//             : null,
//         loanPurpose: formData.loanPurpose || null,
//         ssnLast4: formData.ssnLast4 ? formData.ssnLast4.trim() : null,
//         dlState: formData.dlState || null,
//         driverLicenseNumber: formData.driverLicenseNumber.trim() || null,
//         loanAmount: formData.loanAmount ? Number(formData.loanAmount) : 5000,
//         loanTerm: formData.loanTerm ? parseInt(formData.loanTerm, 10) : 12,
//       };

//       const res = await fetch('/api/apply', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (res.ok && (data.id || data.success || data.applicationId)) {
//         setSubmittedId(
//           data.id ||
//             data.applicationId ||
//             'LN-2026-' + Math.floor(1000 + Math.random() * 9000)
//         );
//       } else {
//         console.error('API Error Response:', data);
//         alert(data.error || 'Database submission failed. Please try again.');
//       }
//     } catch (err) {
//       console.error('Submission network error:', err);
//       alert('Network transmission error. Please check your connection.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const steps = [
//     { id: 1, label: 'Personal' },
//     { id: 2, label: 'Address' },
//     { id: 3, label: 'Employment' },
//     { id: 4, label: 'Verification' },
//     { id: 5, label: 'Review' },
//   ];

//   const inputStyle =
//     'w-full bg-white px-4 py-3 rounded border border-slate-300 text-slate-900 text-base focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600';
//   const labelStyle =
//     'block text-xs uppercase font-semibold text-slate-700 tracking-wider mb-2';

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
//       <Header />

//       {/* Hero Banner Matrix */}
//       <section className="bg-[#0A192F] text-white pt-16 pb-12 border-b border-slate-200">
//         <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
//           <p className="text-blue-300 font-semibold tracking-widest uppercase text-sm mb-3">
//             Secure Application Portal
//           </p>
//           <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
//             Personal Loan Application
//           </h1>
//           <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
//             All submitted credentials are strictly encrypted and processed via manual offline underwriting to safeguard your financial privacy.
//           </p>
//         </div>
//       </section>

//       {/* Main Application Interface */}
//       <main className="py-12 bg-slate-50 flex-grow">
//         <div className="mx-auto max-w-3xl px-4 sm:px-6">
          
//           {/* Progress Step Header */}
//           <div className="bg-white border border-slate-300 rounded-lg shadow-sm p-6 mb-8">
//             <div className="flex items-center justify-between">
//               {steps.map((s, idx) => {
//                 const isActive = s.id === currentStep;
//                 const isCompleted = s.id < currentStep;

//                 return (
//                   <React.Fragment key={s.id}>
//                     <div className="flex flex-col items-center">
//                       <div
//                         className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
//                           isCompleted
//                             ? 'bg-blue-600 text-white'
//                             : isActive
//                             ? 'bg-[#0A192F] text-white ring-2 ring-blue-600'
//                             : 'bg-slate-100 text-slate-400 border border-slate-300'
//                         }`}
//                       >
//                         {isCompleted ? '✓' : s.id}
//                       </div>
//                       <span
//                         className={`text-xs font-semibold uppercase mt-2 hidden sm:block ${
//                           isActive || isCompleted
//                             ? 'text-slate-900'
//                             : 'text-slate-400'
//                         }`}
//                       >
//                         {s.label}
//                       </span>
//                     </div>

//                     {idx < steps.length - 1 && (
//                       <div
//                         className={`flex-1 h-0.5 mx-2 ${
//                           s.id < currentStep ? 'bg-blue-600' : 'bg-slate-200'
//                         }`}
//                       />
//                     )}
//                   </React.Fragment>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Application Form Container */}
//           <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden">
//             <div className="bg-slate-100 border-b border-slate-300 px-8 py-5 flex justify-between items-center">
//               <h3 className="text-lg font-semibold text-slate-900">
//                 Step {currentStep} of 5: {steps[currentStep - 1].label}
//               </h3>
//               {/* <span className="text-xs uppercase font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded border border-blue-200">
//                 Manual Verification
//               </span> */}
//             </div>

//             <div className="p-8">
//               {submittedId ? (
//                 /* Success View */
//                 <div className="text-center py-8 space-y-6">
//                   <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto font-bold text-2xl border border-blue-200">
//                     ✓
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold text-slate-900 mb-2">
//                       Application Submitted Successfully
//                     </h2>
//                     <p className="text-slate-600 text-sm max-w-md mx-auto">
//                       Your file has been routed to our underwriting desk. Please retain your reference token for status tracking.
//                     </p>
//                   </div>

//                   <div className="bg-slate-50 border border-slate-300 rounded-lg p-6 max-w-sm mx-auto">
//                     <span className="text-xs uppercase font-semibold text-slate-500 block mb-1">
//                       File Reference Identifier
//                     </span>
//                     <span className="text-2xl font-mono font-bold text-slate-900">
//                       {submittedId}
//                     </span>
//                   </div>

//                   <div className="pt-4">
//                     <button
//                       onClick={() => router.push(`/?id=${submittedId}#track`)}
//                       className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base py-4 px-8 rounded transition-colors"
//                     >
//                       Track Application Status
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 /* Form Steps */
//                 <form
//                   onSubmit={
//                     currentStep < 5
//                       ? handleNext
//                       : (e) => {
//                           e.preventDefault();
//                           handleSubmit();
//                         }
//                   }
//                 >
//                   {/* STEP 1: PERSONAL */}
//                   {currentStep === 1 && (
//                     <div className="space-y-6">
//                       <div className="mb-6">
//                         <h3 className="text-xl font-bold text-slate-900 mb-2 border-l-4 border-blue-600 pl-4">
//                           1. Personal Identity
//                         </h3>
//                         <p className="text-slate-600 text-sm pl-5">
//                           Enter your personal legal details as they appear on your state ID.
//                         </p>
//                       </div>
                    
//                     {/* OLD IMPLEMENTATION */}

//                       {/* <div className="space-y-5">
//                         <div>
//                           <label className={labelStyle}>Full Legal Name</label>
//                           <input
//                             type="text"
//                             required
//                             value={formData.fullName}
//                             onChange={(e) => updateField('fullName', e.target.value)}
//                             placeholder="e.g. Johnathan Doe"
//                             className={inputStyle}
//                           />
//                         </div>
                    
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                           <div>
//                             <label className={labelStyle}>Date of Birth</label>
//                             <input
//                               type="date"
//                               required
//                               value={formData.dob}
//                               onChange={(e) => updateField('dob', e.target.value)}
//                               className={inputStyle}
//                             />
//                           </div>
//                           <div>
//                             <label className={labelStyle}>Mobile Phone</label>
//                             <input
//                               type="tel"
//                               required
//                               value={formData.phone}
//                               onChange={(e) => updateField('phone', e.target.value)}
//                               placeholder="(555) 000-0000"
//                               className={inputStyle}
//                             />
//                           </div>
//                         </div>

                                           
                        
//                         <div>
//                           <label className={labelStyle}>Email Address</label>
//                           <input
//                             type="email"
//                             required
//                             value={formData.email}
//                             onChange={(e) => updateField('email', e.target.value)}
//                             placeholder="name@example.com"
//                             className={inputStyle}
//                           />
//                         </div>
//                       </div> */}

//                       {/* NEW IMPLEMENTATION */}

//                       <div className="space-y-5">
//                         <div>
//                           <label className={labelStyle}>Full Legal Name</label>
//                           <input
//                             type="text"
//                             required
//                             value={formData.fullName}
//                             onChange={(e) => updateField('fullName', e.target.value)}
//                             placeholder="e.g. Johnathan Doe"
//                             className={`${inputStyle} !text-slate-900 !bg-white font-medium placeholder:text-slate-400`}
//                           />
//                         </div>

//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                           <div>
//                             <label className={labelStyle}>Date of Birth</label>
//                             <input
//                               type="date"
//                               required
//                               value={formData.dob}
//                               onChange={(e) => updateField('dob', e.target.value)}
//                               className={`${inputStyle} !text-slate-900 !bg-white font-medium [color-scheme:light] cursor-pointer`}
//                             />
//                           </div>
//                           <div>
//                             <label className={labelStyle}>Mobile Phone</label>
//                             <input
//                               type="tel"
//                               required
//                               value={formData.phone}
//                               onChange={(e) => updateField('phone', e.target.value)}
//                               placeholder="(555) 000-0000"
//                               className={`${inputStyle} !text-slate-900 !bg-white font-medium placeholder:text-slate-400`}
//                             />
//                           </div>
//                         </div>

//                         <div>
//                           <label className={labelStyle}>Email Address</label>
//                           <input
//                             type="email"
//                             required
//                             value={formData.email}
//                             onChange={(e) => {
//                               const val = e.target.value;
//                               updateField('email', val);
//                               // Clear the error as they type if it becomes valid
//                               if (emailError) setEmailError(validateEmail(val));
//                             }}
//                             onBlur={(e) => setEmailError(validateEmail(e.target.value))}
//                             placeholder="name@example.com"
//                             className={`${inputStyle} !text-slate-900 !bg-white font-medium placeholder:text-slate-400 ${
//                               emailError ? '!border-red-500 !ring-1 !ring-red-500' : ''
//                             }`}
//                           />
//                           {emailError && (
//                             <p className="mt-1 text-xs text-red-600 font-semibold">{emailError}</p>
//                           )}
//                         </div>
//                       </div>

//                       {/* END OF NEW IMPLEMENTATION */}

//                     </div>
//                   )}

//                   {/* STEP 2: ADDRESS */}
//                   {currentStep === 2 && (
//                     <div className="space-y-6">
//                       <div className="mb-6">
//                         <h3 className="text-xl font-bold text-slate-900 mb-2 border-l-4 border-blue-600 pl-4">
//                           2. Primary Residence
//                         </h3>
//                         <p className="text-slate-600 text-sm pl-5">
//                           Provide your current physical residential address in the US.
//                         </p>
//                       </div>

//                       <div className="space-y-5">
//                         <div>
//                           <label className={labelStyle}>Street Address</label>
//                           <input
//                             type="text"
//                             required
//                             value={formData.streetAddress}
//                             onChange={(e) => updateField('streetAddress', e.target.value)}
//                             placeholder="123 Main Street"
//                             className={inputStyle}
//                           />
//                         </div>

//                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
//                           <div>
//                             <label className={labelStyle}>City</label>
//                             <input
//                               type="text"
//                               required
//                               value={formData.city}
//                               onChange={(e) => updateField('city', e.target.value)}
//                               placeholder="New York"
//                               className={inputStyle}
//                             />
//                           </div>
//                           <div>
//                             <label className={labelStyle}>State</label>
//                             <select
//                               required
//                               value={formData.state}
//                               onChange={(e) => updateField('state', e.target.value)}
//                               className={inputStyle}
//                             >
//                               <option value="">Select State</option>
//                               {!isLoadingStates &&
//                                 usStates.map((s) => (
//                                   <option key={s.state_code} value={s.state_code}>
//                                     {s.state_code} - {s.state_name}
//                                   </option>
//                                 ))}
//                             </select>
//                           </div>
//                           <div>
//                             <label className={labelStyle}>Zip Code</label>
//                             <input
//                               type="text"
//                               required
//                               value={formData.zipCode}
//                               onChange={(e) => updateField('zipCode', e.target.value)}
//                               placeholder="10001"
//                               className={inputStyle}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* STEP 3: EMPLOYMENT */}
//                   {currentStep === 3 && (
//                     <div className="space-y-6">
//                       <div className="mb-6">
//                         <h3 className="text-xl font-bold text-slate-900 mb-2 border-l-4 border-blue-600 pl-4">
//                           3. Employment & Income
//                         </h3>
//                         <p className="text-slate-600 text-sm pl-5">
//                           Financial profile used solely to verify debt-to-income balance.
//                         </p>
//                       </div>

//                       <div className="space-y-5">
//                         <div>
//                           <label className={labelStyle}>Employment Status</label>
//                           <select
//                             required
//                             value={formData.employmentStatus}
//                             onChange={(e) => updateField('employmentStatus', e.target.value)}
//                             className={inputStyle}
//                           >
//                             <option value="Full-Time">Full-Time Employed</option>
//                             <option value="Part-Time">Part-Time Employed</option>
//                             <option value="Self-Employed">Self-Employed / Business Owner</option>
//                             <option value="Retired">Retired / Investment Income</option>
//                           </select>
//                         </div>

//                         <div>
//                           <label className={labelStyle}>Employer / Organization Name</label>
//                           <input
//                             type="text"
//                             required
//                             value={formData.employerName}
//                             onChange={(e) => updateField('employerName', e.target.value)}
//                             placeholder="e.g. Acme Corp"
//                             className={inputStyle}
//                           />
//                         </div>

//                         <div>
//                           <label className={labelStyle}>Annual Gross Income ($)</label>
//                           <input
//                             type="number"
//                             required
//                             min="0"
//                             value={formData.annualIncome}
//                             onChange={(e) => updateField('annualIncome', e.target.value)}
//                             placeholder="65000"
//                             className={inputStyle}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* STEP 4: VERIFICATION */}
//                   {currentStep === 4 && (
//                     <div className="space-y-6">
//                       <div className="mb-6">
//                         <h3 className="text-xl font-bold text-slate-900 mb-2 border-l-4 border-blue-600 pl-4">
//                           4. Offline Verification
//                         </h3>
//                         <p className="text-slate-600 text-sm pl-5">
//                           Cross-referenced offline with government database records.
//                         </p>
//                       </div>

//                       <div className="space-y-5">
//                         <div>
//                           <label className={labelStyle}>Loan Purpose</label>
//                           <select
//                             required
//                             value={formData.loanPurpose}
//                             onChange={(e) => updateField('loanPurpose', e.target.value)}
//                             className={inputStyle}
//                           >
//                             <option value="Debt Consolidation">Debt Consolidation</option>
//                             <option value="Home Improvement">Home Improvement</option>
//                             <option value="Emergency Expense">Emergency Expense</option>
//                             <option value="Business">Business Capital</option>
//                           </select>
//                         </div>

//                         <div>
//                           <label className={labelStyle}>SSN (Last 4 Digits Only)</label>
//                           <input
//                             type="text"
//                             required
//                             maxLength={4}
//                             pattern="\d{4}"
//                             value={formData.ssnLast4}
//                             onChange={(e) => updateField('ssnLast4', e.target.value)}
//                             placeholder="1234"
//                             className={inputStyle}
//                           />
//                         </div>

//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                           <div>
//                             <label className={labelStyle}>Driver's License State</label>
//                             <select
//                               required
//                               value={formData.dlState}
//                               onChange={(e) => updateField('dlState', e.target.value)}
//                               className={inputStyle}
//                             >
//                               <option value="">Select State</option>
//                               {!isLoadingStates &&
//                                 usStates.map((s) => (
//                                   <option key={s.state_code} value={s.state_code}>
//                                     {s.state_code}
//                                   </option>
//                                 ))}
//                             </select>
//                           </div>
//                           <div>
//                             <label className={labelStyle}>License Number</label>
//                             <input
//                               type="text"
//                               required
//                               value={formData.driverLicenseNumber}
//                               onChange={(e) => updateField('driverLicenseNumber', e.target.value)}
//                               placeholder="D1234567"
//                               className={inputStyle}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* STEP 5: REVIEW */}
//                   {currentStep === 5 && (
//                     <div className="space-y-6">
//                       <div className="mb-6">
//                         <h3 className="text-xl font-bold text-slate-900 mb-2 border-l-4 border-blue-600 pl-4">
//                           5. Summary Review
//                         </h3>
//                         <p className="text-slate-600 text-sm pl-5">
//                           Please verify your information before transmitting your file.
//                         </p>
//                       </div>

//                       <div className="bg-slate-50 border border-slate-300 rounded p-6">
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
//                           <div>
//                             <span className="text-xs uppercase font-semibold text-slate-500 block mb-1">
//                               Applicant Name
//                             </span>
//                             <p className="font-bold text-slate-900">{formData.fullName || '—'}</p>
//                           </div>
//                           <div>
//                             <span className="text-xs uppercase font-semibold text-slate-500 block mb-1">
//                               Requested Principal
//                             </span>
//                             <p className="font-bold text-blue-700 text-lg">
//                               ${Number(formData.loanAmount).toLocaleString()} ({formData.loanTerm} Months)
//                             </p>
//                           </div>
//                           <div className="sm:col-span-2">
//                             <span className="text-xs uppercase font-semibold text-slate-500 block mb-1">
//                               Residential Address
//                             </span>
//                             <p className="font-bold text-slate-900">
//                               {formData.streetAddress}, {formData.city}, {formData.state} {formData.zipCode}
//                             </p>
//                           </div>
//                           <div>
//                             <span className="text-xs uppercase font-semibold text-slate-500 block mb-1">
//                               Stated Gross Income
//                             </span>
//                             <p className="font-bold text-slate-900">
//                               ${Number(formData.annualIncome || 0).toLocaleString()} / year
//                             </p>
//                           </div>
//                           <div>
//                             <span className="text-xs uppercase font-semibold text-slate-500 block mb-1">
//                               Security Token SSN
//                             </span>
//                             <p className="font-bold text-slate-900">
//                               XXX-XX-{formData.ssnLast4 || 'XXXX'}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* Navigation Action Buttons */}
//                   <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
//                     {currentStep > 1 ? (
//                       <button
//                         type="button"
//                         onClick={handleBack}
//                         className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-sm py-3 px-6 rounded transition-colors"
//                       >
//                         ← Back
//                       </button>
//                     ) : (
//                       <div />
//                     )}

//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className="bg-green-700 hover:bg-green-800 text-white font-semibold text-base py-3 px-8 rounded transition-colors disabled:opacity-50 ml-auto"
//                     >
//                       {isSubmitting
//                         ? 'Transmitting File...'
//                         : currentStep === 5
//                         ? 'Submit Application'
//                         : 'Continue to Step ' + (currentStep + 1)}
//                     </button>
//                   </div>
//                 </form>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }

// export default function ApplicationPage() {
//   return (
//     <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-semibold text-slate-500">Loading Application Portal...</div>}>
//       <ApplicationFormContent />
//     </Suspense>
//   );
// }



'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface StateOption {
  state_code: string;
  state_name: string;
}

function ApplicationFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const [usStates, setUsStates] = useState<StateOption[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState<boolean>(true);

  // Removed emailError state since we no longer collect email here

  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    phone: '', // Email removed from initial state
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    employmentStatus: 'Full-Time',
    employerName: '',
    annualIncome: '',
    loanPurpose: 'Debt Consolidation',
    ssnLast4: '',
    dlState: '',
    driverLicenseNumber: '',
    loanAmount: '5000',
    loanTerm: '12',
  });

  // Load calculation parameters from homepage if present
  useEffect(() => {
    const amountParam = searchParams.get('amount');
    const termsParam = searchParams.get('terms');

    if (amountParam || termsParam) {
      setFormData((prev) => ({
        ...prev,
        loanAmount: amountParam || prev.loanAmount,
        loanTerm: termsParam || prev.loanTerm,
      }));
    }
  }, [searchParams]);

  // Fetch US States Catalog
  useEffect(() => {
    async function fetchDbStates() {
      try {
        const res = await fetch('/api/states');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setUsStates(data);
          } else if (data.rows && Array.isArray(data.rows)) {
            setUsStates(data.rows);
          }
        }
      } catch (err) {
        console.error('Error fetching states catalog:', err);
      } finally {
        setIsLoadingStates(false);
      }
    }
    fetchDbStates();
  }, []);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Removed validateEmail function entirely

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    // Removed the manual email validation check that blocked moving past Step 1

    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        fullName: formData.fullName.trim() || null,
        dob: formData.dob && formData.dob.trim() !== '' ? formData.dob : null,
        // Removed email from payload
        phone: formData.phone.trim() || null,
        streetAddress: formData.streetAddress.trim() || null,
        city: formData.city.trim() || null,
        state: formData.state || null,
        zipCode: formData.zipCode.trim() || null,
        employmentStatus: formData.employmentStatus || null,
        employerName: formData.employerName.trim() || null,
        annualIncome:
          formData.annualIncome && !isNaN(Number(formData.annualIncome))
            ? Number(formData.annualIncome)
            : null,
        loanPurpose: formData.loanPurpose || null,
        ssnLast4: formData.ssnLast4 ? formData.ssnLast4.trim() : null,
        dlState: formData.dlState || null,
        driverLicenseNumber: formData.driverLicenseNumber.trim() || null,
        loanAmount: formData.loanAmount ? Number(formData.loanAmount) : 5000,
        loanTerm: formData.loanTerm ? parseInt(formData.loanTerm, 10) : 12,
      };

      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && (data.id || data.success || data.applicationId)) {
        setSubmittedId(
          data.id ||
            data.applicationId ||
            'LN-2026-' + Math.floor(1000 + Math.random() * 9000)
        );
      } else {
        console.error('API Error Response:', data);
        alert(data.error || 'Database submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Submission network error:', err);
      alert('Network transmission error. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, label: 'Personal' },
    { id: 2, label: 'Address' },
    { id: 3, label: 'Employment' },
    { id: 4, label: 'Verification' },
    { id: 5, label: 'Review' },
  ];

  const inputStyle =
    'w-full bg-white px-4 py-3 rounded border border-slate-300 text-slate-900 text-base focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600';
  const labelStyle =
    'block text-xs uppercase font-semibold text-slate-700 tracking-wider mb-2';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      <Header />

      {/* Hero Banner Matrix */}
      <section className="bg-[#0A192F] text-white pt-16 pb-12 border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <p className="text-blue-300 font-semibold tracking-widest uppercase text-sm mb-3">
            Secure Application Portal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Personal Loan Application
          </h1>
          <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
            All submitted credentials are strictly encrypted and processed via manual offline underwriting to safeguard your financial privacy.
          </p>
        </div>
      </section>

      {/* Main Application Interface */}
      <main className="py-12 bg-slate-50 flex-grow">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          
          {/* Progress Step Header */}
          <div className="bg-white border border-slate-300 rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              {steps.map((s, idx) => {
                const isActive = s.id === currentStep;
                const isCompleted = s.id < currentStep;

                return (
                  <React.Fragment key={s.id}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                          isCompleted
                            ? 'bg-blue-600 text-white'
                            : isActive
                            ? 'bg-[#0A192F] text-white ring-2 ring-blue-600'
                            : 'bg-slate-100 text-slate-400 border border-slate-300'
                        }`}
                      >
                        {isCompleted ? '✓' : s.id}
                      </div>
                      <span
                        className={`text-xs font-semibold uppercase mt-2 hidden sm:block ${
                          isActive || isCompleted
                            ? 'text-slate-900'
                            : 'text-slate-400'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>

                    {idx < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 ${
                          s.id < currentStep ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Application Form Container */}
          <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-slate-100 border-b border-slate-300 px-8 py-5 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">
                Step {currentStep} of 5: {steps[currentStep - 1].label}
              </h3>
            </div>

            <div className="p-8">
              {submittedId ? (
                /* Success View */
                <div className="text-center py-8 space-y-6">
                  <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto font-bold text-2xl border border-blue-200">
                    ✓
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      Application Submitted Successfully
                    </h2>
                    <p className="text-slate-600 text-sm max-w-md mx-auto">
                      Your file has been routed to our underwriting desk. Please retain your reference token for status tracking.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-300 rounded-lg p-6 max-w-sm mx-auto">
                    <span className="text-xs uppercase font-semibold text-slate-500 block mb-1">
                      File Reference Identifier
                    </span>
                    <span className="text-2xl font-mono font-bold text-slate-900">
                      {submittedId}
                    </span>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => router.push(`/?id=${submittedId}#track`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base py-4 px-8 rounded transition-colors"
                    >
                      Track Application Status
                    </button>
                  </div>
                </div>
              ) : (
                /* Form Steps */
                <form
                  onSubmit={
                    currentStep < 5
                      ? handleNext
                      : (e) => {
                          e.preventDefault();
                          handleSubmit();
                        }
                  }
                >
                  {/* STEP 1: PERSONAL */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-2 border-l-4 border-blue-600 pl-4">
                          1. Personal Identity
                        </h3>
                        <p className="text-slate-600 text-sm pl-5">
                          Enter your personal legal details as they appear on your state ID.
                        </p>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label className={labelStyle}>Full Legal Name</label>
                          <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => updateField('fullName', e.target.value)}
                            placeholder="e.g. Johnathan Doe"
                            className={`${inputStyle} !text-slate-900 !bg-white font-medium placeholder:text-slate-400`}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className={labelStyle}>Date of Birth</label>
                            <input
                              type="date"
                              required
                              value={formData.dob}
                              onChange={(e) => updateField('dob', e.target.value)}
                              className={`${inputStyle} !text-slate-900 !bg-white font-medium [color-scheme:light] cursor-pointer`}
                            />
                          </div>
                          <div>
                            <label className={labelStyle}>Mobile Phone</label>
                            <input
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => updateField('phone', e.target.value)}
                              placeholder="(555) 000-0000"
                              className={`${inputStyle} !text-slate-900 !bg-white font-medium placeholder:text-slate-400`}
                            />
                          </div>
                        </div>
                        {/* Email input block has been entirely removed from here */}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: ADDRESS */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-2 border-l-4 border-blue-600 pl-4">
                          2. Primary Residence
                        </h3>
                        <p className="text-slate-600 text-sm pl-5">
                          Provide your current physical residential address in the US.
                        </p>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label className={labelStyle}>Street Address</label>
                          <input
                            type="text"
                            required
                            value={formData.streetAddress}
                            onChange={(e) => updateField('streetAddress', e.target.value)}
                            placeholder="123 Main Street"
                            className={inputStyle}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                          <div>
                            <label className={labelStyle}>City</label>
                            <input
                              type="text"
                              required
                              value={formData.city}
                              onChange={(e) => updateField('city', e.target.value)}
                              placeholder="New York"
                              className={inputStyle}
                            />
                          </div>
                          <div>
                            <label className={labelStyle}>State</label>
                            <select
                              required
                              value={formData.state}
                              onChange={(e) => updateField('state', e.target.value)}
                              className={inputStyle}
                            >
                              <option value="">Select State</option>
                              {!isLoadingStates &&
                                usStates.map((s) => (
                                  <option key={s.state_code} value={s.state_code}>
                                    {s.state_code} - {s.state_name}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div>
                            <label className={labelStyle}>Zip Code</label>
                            <input
                              type="text"
                              required
                              value={formData.zipCode}
                              onChange={(e) => updateField('zipCode', e.target.value)}
                              placeholder="10001"
                              className={inputStyle}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: EMPLOYMENT */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-2 border-l-4 border-blue-600 pl-4">
                          3. Employment & Income
                        </h3>
                        <p className="text-slate-600 text-sm pl-5">
                          Financial profile used solely to verify debt-to-income balance.
                        </p>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label className={labelStyle}>Employment Status</label>
                          <select
                            required
                            value={formData.employmentStatus}
                            onChange={(e) => updateField('employmentStatus', e.target.value)}
                            className={inputStyle}
                          >
                            <option value="Full-Time">Full-Time Employed</option>
                            <option value="Part-Time">Part-Time Employed</option>
                            <option value="Self-Employed">Self-Employed / Business Owner</option>
                            <option value="Retired">Retired / Investment Income</option>
                          </select>
                        </div>

                        <div>
                          <label className={labelStyle}>Employer / Organization Name</label>
                          <input
                            type="text"
                            required
                            value={formData.employerName}
                            onChange={(e) => updateField('employerName', e.target.value)}
                            placeholder="e.g. Acme Corp"
                            className={inputStyle}
                          />
                        </div>

                        <div>
                          <label className={labelStyle}>Annual Gross Income ($)</label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={formData.annualIncome}
                            onChange={(e) => updateField('annualIncome', e.target.value)}
                            placeholder="65000"
                            className={inputStyle}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: VERIFICATION */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-2 border-l-4 border-blue-600 pl-4">
                          4. Offline Verification
                        </h3>
                        <p className="text-slate-600 text-sm pl-5">
                          Cross-referenced offline with government database records.
                        </p>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label className={labelStyle}>Loan Purpose</label>
                          <select
                            required
                            value={formData.loanPurpose}
                            onChange={(e) => updateField('loanPurpose', e.target.value)}
                            className={inputStyle}
                          >
                            <option value="Debt Consolidation">Debt Consolidation</option>
                            <option value="Home Improvement">Home Improvement</option>
                            <option value="Emergency Expense">Emergency Expense</option>
                            <option value="Business">Business Capital</option>
                          </select>
                        </div>

                        <div>
                          <label className={labelStyle}>SSN (Last 4 Digits Only)</label>
                          <input
                            type="text"
                            required
                            maxLength={4}
                            pattern="\d{4}"
                            value={formData.ssnLast4}
                            onChange={(e) => updateField('ssnLast4', e.target.value)}
                            placeholder="1234"
                            className={inputStyle}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className={labelStyle}>Driver's License State</label>
                            <select
                              required
                              value={formData.dlState}
                              onChange={(e) => updateField('dlState', e.target.value)}
                              className={inputStyle}
                            >
                              <option value="">Select State</option>
                              {!isLoadingStates &&
                                usStates.map((s) => (
                                  <option key={s.state_code} value={s.state_code}>
                                    {s.state_code}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div>
                            <label className={labelStyle}>License Number</label>
                            <input
                              type="text"
                              required
                              value={formData.driverLicenseNumber}
                              onChange={(e) => updateField('driverLicenseNumber', e.target.value)}
                              placeholder="D1234567"
                              className={inputStyle}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: REVIEW */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-2 border-l-4 border-blue-600 pl-4">
                          5. Summary Review
                        </h3>
                        <p className="text-slate-600 text-sm pl-5">
                          Please verify your information before transmitting your file.
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-slate-300 rounded p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                          <div>
                            <span className="text-xs uppercase font-semibold text-slate-500 block mb-1">
                              Applicant Name
                            </span>
                            <p className="font-bold text-slate-900">{formData.fullName || '—'}</p>
                          </div>
                          <div>
                            <span className="text-xs uppercase font-semibold text-slate-500 block mb-1">
                              Requested Principal
                            </span>
                            <p className="font-bold text-blue-700 text-lg">
                              ${Number(formData.loanAmount).toLocaleString()} ({formData.loanTerm} Months)
                            </p>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-xs uppercase font-semibold text-slate-500 block mb-1">
                              Residential Address
                            </span>
                            <p className="font-bold text-slate-900">
                              {formData.streetAddress}, {formData.city}, {formData.state} {formData.zipCode}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs uppercase font-semibold text-slate-500 block mb-1">
                              Stated Gross Income
                            </span>
                            <p className="font-bold text-slate-900">
                              ${Number(formData.annualIncome || 0).toLocaleString()} / year
                            </p>
                          </div>
                          <div>
                            <span className="text-xs uppercase font-semibold text-slate-500 block mb-1">
                              Security Token SSN
                            </span>
                            <p className="font-bold text-slate-900">
                              XXX-XX-{formData.ssnLast4 || 'XXXX'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Action Buttons */}
                  <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-sm py-3 px-6 rounded transition-colors"
                      >
                        ← Back
                      </button>
                    ) : (
                      <div />
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-green-700 hover:bg-green-800 text-white font-semibold text-base py-3 px-8 rounded transition-colors disabled:opacity-50 ml-auto"
                    >
                      {isSubmitting
                        ? 'Transmitting File...'
                        : currentStep === 5
                        ? 'Submit Application'
                        : 'Continue to Step ' + (currentStep + 1)}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ApplicationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-semibold text-slate-500">Loading Application Portal...</div>}>
      <ApplicationFormContent />
    </Suspense>
  );
}