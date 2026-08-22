import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Formats lowercase values ('approved') into Uppercase ('APPROVED') or Title Case ('Approved')
// to prevent PostgreSQL enum errors.
function formatStatusForEnum(status: string): string {
  const clean = status.trim().toLowerCase();
  
  // If your DB expects Uppercase (e.g., 'APPROVED', 'REJECTED', 'PENDING'):
  return clean.toUpperCase();

  // NOTE: If your DB expects Title Case ('Approved', 'Rejected', 'Pending'), 
  // replace the line above with:
  // return clean.charAt(0).toUpperCase() + clean.slice(1);
}

// GET: Fetch single application details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: 'Missing application ID' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('applications')
      .select(`
        id,
        loan_amount,
        loan_term_months,
        loan_purpose,
        income,
        status,
        transaction_reference,
        created_at,
        users (
          full_name,
          email,
          phone,
          state
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH: Triggered when clicking Approve, Reject, or Save Code
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const { status, transaction_reference } = body;

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    // Format the incoming status to match PostgreSQL's expected Enum case
    if (status) {
      updatePayload.status = formatStatusForEnum(status);
    }

    if (transaction_reference !== undefined) {
      updatePayload.transaction_reference = transaction_reference;
    }

    const { data, error } = await supabase
      .from('applications')
      .update(updatePayload)
      .eq('id', id)
      .select(`
        id,
        loan_amount,
        loan_term_months,
        loan_purpose,
        income,
        status,
        transaction_reference,
        created_at,
        users (
          full_name,
          email,
          phone,
          state
        )
      `)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

