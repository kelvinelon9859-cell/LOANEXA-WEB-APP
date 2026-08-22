// import { NextResponse } from 'next/server';
// import { query } from '@/lib/db';

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const {
//       fullName, email, phone, dob,
//       address, city, state, zip,
//       income, employmentStatus, employerName,
//       loanAmount, loanTermMonths, loanPurpose,
//       ssnLast4, licenseNumber, licenseState
//     } = body;

//     // 1. Structural Validation
//     if (!fullName || !email || !ssnLast4 || !licenseNumber) {
//       return NextResponse.json({ error: 'Missing Identity Fields' }, { status: 400 });
//     }

//     // 2. Generate custom structured ticket identifier code
//     const generatedSuffix = Math.floor(1000 + Math.random() * 9000);
//     const applicationId = `LN-2026-${generatedSuffix}`;

//     // 3. atomic user write profile session execution
//     const userResult = await query(
//       `INSERT INTO users (full_name, email, phone, dob, address, city, state, zip)
//        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//        ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name
//        RETURNING id`,
//       [fullName, email, phone, dob, address, city, state, zip]
//     );
//     const userId = userResult.rows[0].id;

//     // 4. Record credit application entry to formal tables
//     await query(
//       `INSERT INTO applications (
//         id, user_id, income, employment_status, employer_name,
//         loan_amount, loan_term_months, loan_purpose,
//         ssn_last_4, license_number, license_state, status
//        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending')`,
//       [
//         applicationId, userId, Number(income), employmentStatus, employerName,
//         Number(loanAmount), Number(loanTermMonths), loanPurpose,
//         ssnLast4, licenseNumber, licenseState
//       ]
//     );

//     // 5. Commit log telemetry sequence
//     await query(
//       `INSERT INTO underwriter_logs (application_id, event_type, log_message)
//        VALUES ($1, 'KEY_HANDSHAKE', 'Pipeline application entry finalized from consumer form context.')`,
//       [applicationId]
//     );

//     return NextResponse.json({ success: true, applicationId });
//   } catch (err: any) {
//     console.error("Critical submission crash trace:", err);
//     return NextResponse.json({ error: 'Transaction Insertion Failed', detail: err.message }, { status: 500 });
//   }
// }



// import { NextResponse } from 'next/server';
// import { query } from '@/lib/db';

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     let {
//       fullName, email, phone, dob,
//       address, city, state, zip,
//       income, employmentStatus, employerName,
//       loanAmount, loanTermMonths, loanPurpose,
//       ssnLast4, licenseNumber, licenseState
//     } = body;

//     // SAFEGUARD: Convert empty strings to null/numbers so PostgreSQL doesn't crash on DATE/NUMERIC columns
//     const safeDob = dob === "" ? null : dob;
//     const safeIncome = income === "" ? null : Number(income);
//     const safeLoanAmount = loanAmount === "" ? null : Number(loanAmount);
//     const safeLoanTermMonths = loanTermMonths === "" ? null : Number(loanTermMonths);

//     // 1. Structural Validation
//     if (!fullName || !email || !ssnLast4 || !licenseNumber) {
//       return NextResponse.json({ error: 'Missing Identity Fields' }, { status: 400 });
//     }

//     // 2. Generate custom structured ticket identifier code
//     const generatedSuffix = Math.floor(1000 + Math.random() * 9000);
//     const applicationId = `LN-2026-${generatedSuffix}`;

//     // 3. atomic user write profile session execution
//     const userResult = await query(
//       `INSERT INTO users (full_name, email, phone, dob, address, city, state, zip)
//        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//        ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name
//        RETURNING id`,
//       [fullName, email, phone, safeDob, address, city, state, zip]
//     );
//     const userId = userResult.rows[0].id;

//     // 4. Record credit application entry to formal tables
//     await query(
//       `INSERT INTO applications (
//         id, user_id, income, employment_status, employer_name,
//         loan_amount, loan_term_months, loan_purpose,
//         ssn_last_4, license_number, license_state, status
//        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending')`,
//       [
//         applicationId, userId, safeIncome, employmentStatus, employerName,
//         safeLoanAmount, safeLoanTermMonths, loanPurpose,
//         ssnLast4, licenseNumber, licenseState
//       ]
//     );

//     // 5. Commit log telemetry sequence
//     await query(
//       `INSERT INTO underwriter_logs (application_id, event_type, log_message)
//        VALUES ($1, 'KEY_HANDSHAKE', 'Pipeline application entry finalized from consumer form context.')`,
//       [applicationId]
//     );

//     return NextResponse.json({ success: true, applicationId });
//   } catch (err: any) {
//     console.error("Critical submission crash trace:", err);
//     return NextResponse.json({ error: 'Transaction Insertion Failed', detail: err.message }, { status: 500 });
//   }
// }






// import { NextResponse } from 'next/server';
// import { createClient } from '@/utils/supabase/server';

// export async function GET() {
//   try {
//     const supabase = await createClient();
    
//     const { data, error } = await supabase
//       .from('us_states')
//       .select('state_code, state_name')
//       .order('state_name', { ascending: true });

//     if (error) {
//       console.error('Supabase error fetching states:', error);
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     return NextResponse.json(data);
//   } catch (err: any) {
//     console.error('Critical states fetch error:', err);
//     return NextResponse.json({ error: 'Internal Server Error', detail: err.message }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();

    // 1. Create client to fetch logged-in user session
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Middleware handles setting cookies in edge runtime if needed
            }
          },
        },
      }
    );

    // Get current authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabaseAuth.auth.getUser();

    if (authError || !user || !user.email) {
      return NextResponse.json(
        { error: 'Unauthorized: You must be logged in to submit an application.' },
        { status: 401 }
      );
    }

    // 2. Initialize Service Role Client for database writes
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await req.json();

    // 3. Upsert user into the 'users' table (using authenticated user.email)
    const userData = {
      full_name: body.fullName?.trim(),
      email: user.email, // <--- Securely pulled from auth session!
      phone: body.phone?.trim(),
      dob: body.dob,
      address: body.streetAddress?.trim(),
      city: body.city?.trim(),
      state: body.state,
      zip: body.zipCode?.trim(),
    };

    const { data: userRecord, error: userError } = await supabaseAdmin
      .from('users')
      .upsert(userData, { onConflict: 'email' })
      .select('id')
      .single();

    if (userError) {
      console.error('Supabase user upsert error:', userError);
      return NextResponse.json({ error: userError.message }, { status: 400 });
    }

    const userId = userRecord.id;
    const applicationId = 'LN-2026-' + Math.floor(1000 + Math.random() * 9000);

    // 4. Insert into 'applications' table
    const applicationData = {
      id: applicationId,
      user_id: userId,
      income: Number(body.annualIncome) || 0,
      employment_status: body.employmentStatus || 'Full-Time',
      employer_name: body.employerName?.trim() || null,
      loan_amount: Number(body.loanAmount) || 5000,
      loan_term_months: Number(body.loanTerm) || 12,
      loan_purpose: body.loanPurpose || 'Debt Consolidation',
      ssn_last_4: body.ssnLast4?.trim() || '',
      license_number: body.driverLicenseNumber?.trim() || '',
      license_state: body.dlState || body.state,
      status: 'pending',
    };

    const { data: appRecord, error: appError } = await supabaseAdmin
      .from('applications')
      .insert([applicationData])
      .select('id')
      .single();

    if (appError) {
      console.error('Supabase application insertion error:', appError);
      return NextResponse.json({ error: appError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, id: appRecord.id });
  } catch (err: any) {
    console.error('Critical apply route error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error', detail: err.message },
      { status: 500 }
    );
  }
}