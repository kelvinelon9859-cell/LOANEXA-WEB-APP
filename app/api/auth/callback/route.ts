// import { NextResponse } from 'next/server';
// import { createServerClient } from '@supabase/ssr';
// import { cookies } from 'next/headers';

// export const dynamic = 'force-dynamic';

// export async function GET(request: Request) {
//   const { searchParams, origin } = new URL(request.url);
//   const code = searchParams.get('code');
//   // Default redirect destination after successful login
//   const next = searchParams.get('next') ?? '/status';

//   if (code) {
//     const cookieStore = cookies();
//     const supabase = createServerClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//       {
//         cookies: {
//           get(name: string) {
//             return cookieStore.get(name)?.value;
//           },
//           set(name: string, value: string, options: any) {
//             cookieStore.set({ name, value, ...options });
//           },
//           remove(name: string, options: any) {
//             cookieStore.set({ name, value: '', ...options });
//           },
//         },
//       }
//     );

//     const { error } = await supabase.auth.exchangeCodeForSession(code);
    
//     if (!error) {
//       return NextResponse.redirect(`${origin}${next}`);
//     }
//   }

//   // If there's no code or an error occurred, send them back to login with an error flag
//   return NextResponse.redirect(`${origin}/login?error=auth_failed`);
// }




import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        const userRole = roleData?.role;

        // Redirect staff/admin users to /admin
        if (userRole === 'underwriter' || userRole === 'admin') {
          return NextResponse.redirect(`${origin}${next || '/admin'}`);
        }
      }

      // Default redirect destination for standard users
      return NextResponse.redirect(`${origin}${next || '/status'}`);
    }
  }

  // Redirect to appropriate login page on failure
  const fallbackLogin = next?.includes('underwriter') || next?.startsWith('/admin')
    ? '/underwriter/login'
    : '/login';

  return NextResponse.redirect(`${origin}${fallbackLogin}?error=auth_failed`);
}