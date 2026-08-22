// import { NextResponse } from 'next/server';
// import { createServerClient } from '@supabase/ssr';
// import { cookies } from 'next/headers';

// export const dynamic = 'force-dynamic';

// export async function GET(request: Request) {
//   const { searchParams, origin } = new URL(request.url);
//   const code = searchParams.get('code');
//   const next = searchParams.get('next') ?? '/admin';

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
//       const { data: { user } } = await supabase.auth.getUser();

//       if (user) {
//         // Extract names from Google metadata
//         const fullName = user.user_metadata?.full_name || user.user_metadata?.name || '';
//         const nameParts = fullName.split(' ');
//         const firstName = user.user_metadata?.given_name || nameParts[0] || 'Staff';
//         const lastName = user.user_metadata?.family_name || nameParts.slice(1).join(' ') || 'Member';

//         // 1. Auto-insert staff entry into public.underwriters
//         await supabase.from('underwriters').upsert(
//           {
//             id: user.id,
//             email: user.email!,
//             first_name: firstName,
//             last_name: lastName,
//             clearance_level: 'junior',
//             is_active: true,
//           },
//           { onConflict: 'id' }
//         );

//         // 2. Auto-assign role in public.user_roles so middleware allows access
//         await supabase.from('user_roles').upsert(
//           {
//             user_id: user.id,
//             role: 'underwriter',
//           },
//           { onConflict: 'user_id' }
//         );
//       }

//       return NextResponse.redirect(`${origin}${next}`);
//     }
//   }

//   return NextResponse.redirect(`${origin}/underwriter?error=auth_failed`);
// }



import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// Set your authorized staff email domain
const ALLOWED_STAFF_DOMAIN = '@yourcompany.com'; 

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/admin';

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

      if (user && user.email) {
        // 1. Verify if user email is pre-authorized in public.underwriters
        const { data: existingUnderwriter } = await supabase
          .from('underwriters')
          .select('id, is_active')
          .eq('email', user.email.toLowerCase())
          .maybeSingle();

        // Check if email domain is allowed OR if they are pre-listed in the database
        const isAllowedDomain = user.email.toLowerCase().endsWith(ALLOWED_STAFF_DOMAIN);
        const isPreApproved = existingUnderwriter && existingUnderwriter.is_active;

        if (!isAllowedDomain && !isPreApproved) {
          // Reject access for unauthorized personal/customer accounts
          await supabase.auth.signOut();
          return NextResponse.redirect(`${origin}/underwriter?error=unauthorized_email`);
        }

        // 2. Assign underwriter role only after passing validation
        await supabase.from('user_roles').upsert(
          { user_id: user.id, role: 'underwriter' },
          { onConflict: 'user_id' }
        );

        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/underwriter?error=auth_failed`);
}