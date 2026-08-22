// app/api/admin/applications/[id]/send-code/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: applicationId } = await params;
    const body = await request.json();
    const { user_id, email, amount } = body;

    // Validate required payload fields
    if (!applicationId || !user_id || !email || amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required parameters: applicationId, user_id, email, or amount.' },
        { status: 400 }
      );
    }

    // Generate a 6-character uppercase code
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const code = `LN-${randomCode}`;

    // 1. Record in the transactions table
    await query(
      `
      INSERT INTO transactions (application_id, user_id, code, amount, type)
      VALUES ($1, $2, $3, $4, 'disbursement_confirmation')
      `,
      [applicationId, user_id, code, amount]
    );

    // 2. Record audit trail in underwriter_logs
    await query(
      `
      INSERT INTO underwriter_logs (application_id, event_type, log_message)
      VALUES ($1, 'CONFIRMATION_CODE_SENT', $2)
      `,
      [applicationId, `Sent confirmation code ${code} to applicant email: ${email}`]
    );

    // 3. Email provider dispatch logic (Replace console log with actual provider like Resend/SendGrid)
    console.log(`[MOCK EMAIL SERVER] Successfully sent code ${code} to ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Confirmation code successfully generated and logged.',
      code,
    });
  } catch (error: any) {
    console.error('Failed to send confirmation code:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}