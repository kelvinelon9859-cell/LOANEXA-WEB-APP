import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ALLOWED_STAFF_EMAILS = [
  'kelvin.elon.9859@gmail.com',
  'jeff@example.com', // 👈 REPLACE WITH JEFF'S EXACT EMAIL
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userEmail = user?.email?.toLowerCase() || '';
  const isAuthorized =
    user && ALLOWED_STAFF_EMAILS.some((e) => e.toLowerCase() === userEmail);

  if (!user || !isAuthorized) {
    redirect('/underwriter?error=unauthorized');
  }

  return <>{children}</>;
}