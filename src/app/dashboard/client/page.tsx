import { auth } from '@/auth';
import ClientDashboardClient from './client-dashboard-client';

export default async function ClientDashboard() {
  const session = await auth();
  const user = session?.user;
  
  if (!user) return null;

  return <ClientDashboardClient userId={user.id} />;
}
