// import { createServerClient } from '@supabase/ssr';
// import { NextResponse, type NextRequest } from 'next/server';

// export async function middleware(request: NextRequest) {
//   let response = NextResponse.next({
//     request: { headers: request.headers },
//   });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() { return request.cookies.getAll(); },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value, options }) =>
//             response.cookies.set(name, value, options)
//           );
//         },
//       },
//     }
//   );

//   const { data: { user } } = await supabase.auth.getUser();
//   const pathname = request.nextUrl.pathname;

//   // Allow unauthenticated access to the dedicated underwriter login URL
//   if (pathname === '/underwriter/login') {
//     if (user) {
//       return NextResponse.redirect(new URL('/underwriter', request.url));
//     }
//     return response;
//   }

//   // Intercept all other underwriter sub-routes
//   if (pathname.startsWith('/underwriter') && !user) {
//     return NextResponse.redirect(new URL('/underwriter/login', request.url));
//   }

//   return response;
// }

// export const config = {
//   matcher: ['/underwriter/:path*'],
// };





import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// 🔒 STRICT WHITELIST: ONLY THESE EXACT EMAILS ARE ALLOWED
const ALLOWED_STAFF_EMAILS = [
  'kelvin.elon.9859@gmail.com',
  'jeff@example.com', // 👈 REPLACE WITH JEFF'S EXACT EMAIL
];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  const userEmail = user?.email?.toLowerCase() || '';
  const isAuthorized =
    user && ALLOWED_STAFF_EMAILS.some((e) => e.toLowerCase() === userEmail);

  // 1. BLOCK ALL ACCESS TO /admin IF NOT LOGGED IN OR NOT AUTHORIZED
  if (pathname.startsWith('/admin')) {
    if (!user || !isAuthorized) {
      const loginUrl = new URL('/underwriter', request.url);
      loginUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. PREVENT AUTO-REDIRECT FROM LOGIN UNLESS AUTHORIZED
  if (pathname === '/underwriter' || pathname === '/underwriter/login') {
    if (user && isAuthorized) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/underwriter', '/underwriter/login'],
};






// import { createServerClient } from '@supabase/ssr';
// import { NextResponse, type NextRequest } from 'next/server';

// export async function middleware(request: NextRequest) {
//   let response = NextResponse.next({
//     request: { headers: request.headers },
//   });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll();
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value }) =>
//             request.cookies.set(name, value)
//           );
//           response = NextResponse.next({
//             request,
//           });
//           cookiesToSet.forEach(({ name, value, options }) =>
//             response.cookies.set(name, value, options)
//           );
//         },
//       },
//     }
//   );

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   const pathname = request.nextUrl.pathname;

//   // 1. Handle protected /admin routes
//   if (pathname.startsWith('/admin')) {
//     if (!user) {
//       const loginUrl = new URL('/underwriter/login', request.url);
//       loginUrl.searchParams.set('next', pathname);
//       return NextResponse.redirect(loginUrl);
//     }

//     // Check user_roles table
//     const { data: roleData } = await supabase
//       .from('user_roles')
//       .select('role')
//       .eq('user_id', user.id)
//       .maybeSingle();

//     let userRole = roleData?.role || null;

//     // Fallback: Check public.underwriters table directly if user_roles entry is missing
//     if (!userRole) {
//       const { data: underwriterData } = await supabase
//         .from('underwriters')
//         .select('id')
//         .eq('id', user.id)
//         .maybeSingle();

//       if (underwriterData) {
//         userRole = 'underwriter';
//       }
//     }

//     // Block non-staff users and redirect back to portal login instead of public home
//     if (userRole !== 'underwriter' && userRole !== 'admin') {
//       const loginUrl = new URL('/underwriter/login', request.url);
//       loginUrl.searchParams.set('error', 'unauthorized');
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   // 2. Prevent logged-in staff from seeing the login form again
//   if (pathname === '/underwriter' || pathname === '/underwriter/login') {
//     if (user) {
//       const { data: roleData } = await supabase
//         .from('user_roles')
//         .select('role')
//         .eq('user_id', user.id)
//         .maybeSingle();

//       const { data: underwriterData } = await supabase
//         .from('underwriters')
//         .select('id')
//         .eq('id', user.id)
//         .maybeSingle();

//       const isStaff =
//         roleData?.role === 'underwriter' ||
//         roleData?.role === 'admin' ||
//         Boolean(underwriterData);

//       if (isStaff) {
//         return NextResponse.redirect(new URL('/admin', request.url));
//       }
//     }
//   }

//   return response;
// }

// export const config = {
//   matcher: ['/admin', '/admin/:path*', '/underwriter', '/underwriter/login'],
// };







// import { createServerClient } from '@supabase/ssr';
// import { NextResponse, type NextRequest } from 'next/server';

// export async function middleware(request: NextRequest) {
//   let response = NextResponse.next({
//     request: { headers: request.headers },
//   });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() { return request.cookies.getAll(); },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value, options }) =>
//             response.cookies.set(name, value, options)
//           );
//         },
//       },
//     }
//   );

//   const { data: { user } } = await supabase.auth.getUser();
//   const pathname = request.nextUrl.pathname;

//   let userRole = null;

//   // 1. Fetch the user's role ONLY if they are logged in and trying to hit a restricted route
//   if (user && (pathname.startsWith('/admin') || pathname === '/underwriter/login')) {
//     const { data: roleData } = await supabase
//       .from('user_roles')
//       .select('role')
//       .eq('user_id', user.id)
//       .single();
    
//     userRole = roleData?.role;
//   }

//   // 2. Handle logged-in users trying to access the login page
//   if (pathname === '/underwriter/login') {
//     if (user) {
//       if (userRole === 'underwriter' || userRole === 'admin') {
//         return NextResponse.redirect(new URL('/admin', request.url));
//       } else {
//         // Standard customers have no business on the underwriter login page
//         return NextResponse.redirect(new URL('/', request.url));
//       }
//     }
//     return response;
//   }

//   // 3. Secure the /admin routes
//   if (pathname.startsWith('/admin')) {
//     if (!user) {
//       // Unauthenticated users get sent to login, with their destination saved
//       const loginUrl = new URL('/underwriter/login', request.url);
//       loginUrl.searchParams.set('next', pathname);
//       return NextResponse.redirect(loginUrl);
//     }

//     // Block anyone who is logged in but is just a standard customer
//     if (userRole !== 'underwriter' && userRole !== 'admin') {
//       return NextResponse.redirect(new URL('/', request.url));
//     }
//   }

//   return response;
// }

// export const config = {
//   matcher: ['/admin/:path*', '/underwriter/login'],
// };
