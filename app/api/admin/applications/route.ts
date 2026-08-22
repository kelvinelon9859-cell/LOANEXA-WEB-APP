// import { NextResponse } from 'next/server';
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// const supabase = createClient(supabaseUrl, supabaseKey);

// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;

//     // Explicitly reference user_id foreign key constraint
//     const { data, error } = await supabase
//       .from('applications')
//       .select(`
//         id,
//         income,
//         loan_amount,
//         loan_term_months,
//         loan_purpose,
//         status,
//         created_at,
//         users!user_id (
//           full_name,
//           email,
//           phone,
//           state
//         )
//       `)
//       .eq('id', id)
//       .single();

//     if (error || !data) {
//       console.error('Supabase fetch error:', error);
//       return NextResponse.json({ error: 'Application not found' }, { status: 404 });
//     }

//     return NextResponse.json(data);
//   } catch (err) {
//     console.error('API Error:', err);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

// export async function PATCH(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const body = await request.json();
//     const { status } = body;

//     if (!['approved', 'rejected', 'pending'].includes(status)) {
//       return NextResponse.json({ error: 'Invalid status provided' }, { status: 400 });
//     }

//     const { error } = await supabase
//       .from('applications')
//       .update({
//         status,
//         updated_at: new Date().toISOString(),
//       })
//       .eq('id', id);

//     if (error) {
//       console.error('Supabase status update error:', error);
//       return NextResponse.json({ error: 'Failed to update database record' }, { status: 500 });
//     }

//     return NextResponse.json({ success: true, status });
//   } catch (err) {
//     console.error('API Error:', err);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force Next.js to bypass static caching
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        id,
        loan_amount,
        loan_term_months,
        loan_purpose,
        income,
        status,
        created_at,
        users (
          full_name,
          email,
          phone,
          state
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase Error - GET /api/admin/applications]:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error('[API Error]:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}