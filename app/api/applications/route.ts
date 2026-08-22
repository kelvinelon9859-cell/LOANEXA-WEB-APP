// import { NextRequest, NextResponse } from 'next/server';
// import { query } from '@/lib/db';

// // Forces Next.js to treat this API route as dynamic, preventing build-time static extraction crashes
// export const dynamic = 'force-dynamic';

// // GET: Look up an application by ID with user join
// export async function GET(request: NextRequest) {
//   const id = request.nextUrl.searchParams.get('id');

//   if (!id) {
//     return NextResponse.json(
//       { error: 'Missing application token identifier' },
//       { status: 400 }
//     );
//   }

//   const normalizedId = id.trim().toUpperCase();

//   try {
//     const result = await query(
//       `SELECT 
//         a.id, 
//         u.full_name AS "fullName", 
//         a.status, 
//         a.loan_amount AS "loanAmount", 
//         a.loan_purpose AS "loanPurpose", 
//         a.external_verify_link AS "externalVerifyLink", 
//         a.created_at AS "createdAt"
//        FROM applications a
//        JOIN users u ON a.user_id = u.id
//        WHERE a.id = $1`,
//       [normalizedId]
//     );

//     if (result.rows.length === 0) {
//       return NextResponse.json(
//         { error: 'Token reference match not found' },
//         { status: 404 }
//       );
//     }

//     const application = result.rows[0];

//     // PostgreSQL NUMERIC types return as strings; cast loanAmount to Number for frontend compatibility
//     return NextResponse.json({
//       ...application,
//       loanAmount: Number(application.loanAmount),
//     });
//   } catch (error) {
//     console.error('Database application lookup error:', error);
//     return NextResponse.json(
//       { error: 'Failed to retrieve application' },
//       { status: 500 }
//     );
//   }
// }

// // POST: Save user & multi-step application payload into PostgreSQL database
// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const {
//       fullName,
//       dob,
//       email,
//       phone,
//       streetAddress,
//       city,
//       state,
//       zipCode,
//       employmentStatus,
//       employerName,
//       annualIncome,
//       loanPurpose,
//       ssnLast4,
//       dlState,
//       driverLicenseNumber,
//       loanAmount,
//       loanTerm,
//     } = body;

//     const generatedNumber = Math.floor(1000 + Math.random() * 9000);
//     const generatedId = `LN-2026-${generatedNumber}`;
//     const externalVerifyLink = `https://verify.loanexa.com/session/${generatedId}`;

//     // 1. Insert or update user first to satisfy applications.user_id foreign key constraint
//     const userQuery = `
//       INSERT INTO users (full_name, email, phone, dob, address, city, state, zip)
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//       ON CONFLICT (email) DO UPDATE 
//       SET full_name = EXCLUDED.full_name,
//           phone = EXCLUDED.phone,
//           address = EXCLUDED.address,
//           city = EXCLUDED.city,
//           state = EXCLUDED.state,
//           zip = EXCLUDED.zip
//       RETURNING id;
//     `;

//     const userValues = [
//       fullName || 'Applicant',
//       email || `applicant_${Date.now()}@loanexa.local`,
//       phone || '000-000-0000',
//       dob || '2000-01-01',
//       streetAddress || 'Not Provided',
//       city || 'Not Provided',
//       state || 'CA',
//       zipCode || '00000',
//     ];

//     const userResult = await query(userQuery, userValues);
//     const userId = userResult.rows[0].id;

//     // 2. Insert into applications using database schema column names
//     const insertQuery = `
//       INSERT INTO applications (
//         id,
//         user_id,
//         income,
//         employment_status,
//         employer_name,
//         loan_amount,
//         loan_term_months,
//         loan_purpose,
//         ssn_last_4,
//         license_number,
//         license_state,
//         external_verify_link,
//         status
//       ) VALUES (
//         $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending'
//       )
//       RETURNING id;
//     `;

//     const termMonths = parseInt(loanTerm, 10) || 12;

//     const values = [
//       generatedId,
//       userId,
//       annualIncome ? parseFloat(annualIncome) : 0,
//       employmentStatus || 'Full-Time',
//       employerName || null,
//       loanAmount ? parseFloat(loanAmount) : 5000,
//       termMonths,
//       loanPurpose || 'Debt Consolidation',
//       ssnLast4 || '0000',
//       driverLicenseNumber || 'NONE',
//       dlState || state || 'CA',
//       externalVerifyLink,
//     ];

//     const result = await query(insertQuery, values);

//     return NextResponse.json({ id: result.rows[0].id, success: true }, { status: 201 });
//   } catch (error: any) {
//     console.error('Database insert error:', error);
//     return NextResponse.json(
//       { error: 'Failed to record application in database', details: error.message },
//       { status: 500 }
//     );
//   }
// }




import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// GET: Look up an application by ID with user join
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing application token identifier' },
      { status: 400 }
    );
  }

  const normalizedId = id.trim().toUpperCase();

  try {
    const result = await query(
      `SELECT 
        a.id, 
        u.full_name AS "fullName", 
        a.status, 
        a.loan_amount AS "loanAmount", 
        a.loan_purpose AS "loanPurpose", 
        a.external_verify_link AS "externalVerifyLink", 
        a.created_at AS "createdAt"
       FROM applications a
       JOIN users u ON a.user_id = u.id
       WHERE a.id = $1`,
      [normalizedId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Token reference match not found' },
        { status: 404 }
      );
    }

    const application = result.rows[0];

    return NextResponse.json({
      ...application,
      loanAmount: Number(application.loanAmount),
    });
  } catch (error) {
    console.error('Database application lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve application' },
      { status: 500 }
    );
  }
}

// POST: Save user & multi-step application payload into PostgreSQL database
export async function POST(request: Request) {
  try {
    // 1. Securely fetch the logged-in user from Supabase via cookies
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // 2. Block unauthorized submissions
    if (authError || !user || !user.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to submit an application.' },
        { status: 401 }
      );
    }

    const email = user.email; // Use the verified email from the session

    const body = await request.json();
    const {
      fullName,
      dob,
      phone,
      streetAddress,
      city,
      state,
      zipCode,
      employmentStatus,
      employerName,
      annualIncome,
      loanPurpose,
      ssnLast4,
      dlState,
      driverLicenseNumber,
      loanAmount,
      loanTerm,
    } = body;

    const generatedNumber = Math.floor(1000 + Math.random() * 9000);
    const generatedId = `LN-2026-${generatedNumber}`;
    const externalVerifyLink = `https://verify.loanexa.com/session/${generatedId}`;

    // 3. Insert or update user. The email is now guaranteed to be accurate.
    const userQuery = `
      INSERT INTO users (full_name, email, phone, dob, address, city, state, zip)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (email) DO UPDATE 
      SET full_name = EXCLUDED.full_name,
          phone = EXCLUDED.phone,
          address = EXCLUDED.address,
          city = EXCLUDED.city,
          state = EXCLUDED.state,
          zip = EXCLUDED.zip
      RETURNING id;
    `;

    const userValues = [
      fullName || 'Applicant',
      email, 
      phone || '000-000-0000',
      dob || '2000-01-01',
      streetAddress || 'Not Provided',
      city || 'Not Provided',
      state || 'CA',
      zipCode || '00000',
    ];

    const userResult = await query(userQuery, userValues);
    const userId = userResult.rows[0].id;

    // 4. Insert into applications
    const insertQuery = `
      INSERT INTO applications (
        id,
        user_id,
        income,
        employment_status,
        employer_name,
        loan_amount,
        loan_term_months,
        loan_purpose,
        ssn_last_4,
        license_number,
        license_state,
        external_verify_link,
        status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending'
      )
      RETURNING id;
    `;

    const termMonths = parseInt(loanTerm, 10) || 12;

    const values = [
      generatedId,
      userId,
      annualIncome ? parseFloat(annualIncome) : 0,
      employmentStatus || 'Full-Time',
      employerName || null,
      loanAmount ? parseFloat(loanAmount) : 5000,
      termMonths,
      loanPurpose || 'Debt Consolidation',
      ssnLast4 || '0000',
      driverLicenseNumber || 'NONE',
      dlState || state || 'CA',
      externalVerifyLink,
    ];

    const result = await query(insertQuery, values);

    return NextResponse.json({ id: result.rows[0].id, success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Database insert error:', error);
    return NextResponse.json(
      { error: 'Failed to record application in database', details: error.message },
      { status: 500 }
    );
  }
}