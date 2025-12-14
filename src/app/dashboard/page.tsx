import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect('/login');
  }

  if (user.role === 'admin') {
    redirect('/dashboard/admin');
  } else if (user.role === 'coach') {
    redirect('/dashboard/coach');
  } else {
    redirect('/dashboard/client');
  }
}
