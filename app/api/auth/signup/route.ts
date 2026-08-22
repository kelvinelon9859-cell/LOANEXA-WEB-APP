import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const cookieStore = cookies();

    // 1. Initialize secure server-side Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    // 2. Register the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // 3. Create the skeleton row in your public.users table
    // Adjust 'email' to match your exact database column name
    if (authData.user) {
      const { error: dbError } = await supabase
        .from('users') // Change 'users' if your table is named differently
        .insert([{ email: email }]); 

      if (dbError) {
        console.error("DB Insert Error:", dbError);
        // We don't throw here so we don't break the auth flow, 
        // but you should monitor this in production.
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}