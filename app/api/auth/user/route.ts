import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Determine the host origin so the magic link redirects back correctly
    const origin = new URL(request.url).origin;
    const redirectTo = `${origin}/apply`;

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true, // Automatically registers new users in auth.users
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Magic link successfully dispatched.' },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Auth API Error:', err);
    return NextResponse.json(
      { error: 'An internal server error occurred while sending the email.' },
      { status: 500 }
    );
  }
}