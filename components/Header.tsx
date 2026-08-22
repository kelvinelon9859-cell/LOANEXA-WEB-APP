// HEADER WITHOUT THE GET STARTED BUTTON


// 'use client';

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { Shield, Menu, X } from 'lucide-react';

// export default function Header() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   return (
//     <header className="border-b border-slate-200 bg-white/95 text-slate-900 sticky top-0 z-50 backdrop-blur-sm">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between">
//           {/* Logo Brand Element */}
//           <Link href="/" className="flex items-center gap-2">
//             <Shield className="h-6 w-6 text-emerald-600" />
//             <span className="text-xl font-bold tracking-tight text-slate-900">
//               LOANEXA<span className="text-emerald-600">USA</span>
//             </span>
//           </Link>

//           {/* Core Navigation Links */}
//           <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
//             <Link href="/" className="hover:text-emerald-600 transition-colors">
//               Home
//             </Link>
//             <Link href="#features" className="hover:text-emerald-600 transition-colors">
//               How It Works
//             </Link>
//             <Link href="#calculator" className="hover:text-emerald-600 transition-colors">
//               Loan Calculator
//             </Link>
//             <Link href="#track" className="hover:text-emerald-600 transition-colors">
//               Track Status
//             </Link>
//           </nav>

//           {/* Mobile Menu Toggle */}
//           <div className="flex items-center gap-4">
//             <button 
//               onClick={() => setIsMobileMenuOpen((prev) => !prev)}
//               className="md:hidden p-1 text-slate-500 hover:text-slate-900 focus:outline-none"
//               aria-label="Toggle Menu"
//             >
//               {isMobileMenuOpen ? (
//                 <X className="h-6 w-6 text-emerald-600" />
//               ) : (
//                 <Menu className="h-6 w-6" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Navigation Dropdown */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 font-medium text-sm text-slate-600 shadow-lg">
//           <Link 
//             href="/" 
//             onClick={() => setIsMobileMenuOpen(false)}
//             className="block hover:text-emerald-600 py-1 transition-colors"
//           >
//             Home
//           </Link>
//           <Link 
//             href="#features" 
//             onClick={() => setIsMobileMenuOpen(false)}
//             className="block hover:text-emerald-600 py-1 transition-colors"
//           >
//             How It Works
//           </Link>
//           <Link 
//             href="#calculator" 
//             onClick={() => setIsMobileMenuOpen(false)}
//             className="block hover:text-emerald-600 py-1 transition-colors"
//           >
//             Loan Calculator
//           </Link>
//           <Link 
//             href="#track" 
//             onClick={() => setIsMobileMenuOpen(false)}
//             className="block hover:text-emerald-600 py-1 transition-colors"
//           >
//             Track Status
//           </Link>
//         </div>
//       )}
//     </header>
//   );
// }



// HEADER WITH THE GET STARTED BUTTON



'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Menu, X } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-slate-200 bg-white/95 text-slate-900 sticky top-0 z-50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Brand Element */}
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              LOANEXA<span className="text-emerald-600">USA</span>
            </span>
          </Link>

          {/* Core Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-emerald-600 transition-colors">
              Home
            </Link>
            <Link href="#features" className="hover:text-emerald-600 transition-colors">
              How It Works
            </Link>
            <Link href="#calculator" className="hover:text-emerald-600 transition-colors">
              Loan Calculator
            </Link>
            <Link href="#track" className="hover:text-emerald-600 transition-colors">
              Track Status
            </Link>
          </nav>

          {/* Actions & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            {/* Get Started Button (Desktop) */}
            <Link 
              href="/login" 
              className="hidden md:inline-flex bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2 rounded transition-colors shadow-sm"
            >
              Get Started
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-1 text-slate-500 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-emerald-600" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 font-medium text-sm text-slate-600 shadow-lg">
          <Link 
            href="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block hover:text-emerald-600 py-1 transition-colors"
          >
            Home
          </Link>
          <Link 
            href="#features" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block hover:text-emerald-600 py-1 transition-colors"
          >
            How It Works
          </Link>
          <Link 
            href="#calculator" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block hover:text-emerald-600 py-1 transition-colors"
          >
            Loan Calculator
          </Link>
          <Link 
            href="#track" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block hover:text-emerald-600 py-1 transition-colors"
          >
            Track Status
          </Link>
          {/* Get Started Button (Mobile) */}
          <Link 
            href="/login" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block bg-emerald-600 text-white text-center font-semibold rounded py-2 mt-4 hover:bg-emerald-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}