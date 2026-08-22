import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Authenticate underwriter token from the Authorization header
async function authenticateRequest(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return null;

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) return null;
  return user;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: 'Missing application ID' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('applications')
      .select(`
        id,
        income,
        loan_amount,
        loan_term_months,
        loan_purpose,
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
      console.error('API Fetch Error:', error?.message);
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('API Catch Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const { status, transaction_reference } = body;

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      const normalizedStatus = status.trim().toUpperCase();
      const validStatuses = ['APPROVED', 'REJECTED', 'PENDING'];
      
      if (!validStatuses.includes(normalizedStatus)) {
        return NextResponse.json({ error: 'Invalid status provided' }, { status: 400 });
      }
      
      updatePayload.status = normalizedStatus;
    }

    if (transaction_reference !== undefined) {
      updatePayload.transaction_reference = transaction_reference;
    }

    const { data, error } = await supabase
      .from('applications')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update Error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, application: data });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}




