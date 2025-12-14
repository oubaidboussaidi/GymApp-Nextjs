import { auth } from '@/auth';
import CoachOverviewClient from './coach-overview-client';

export default async function CoachDashboard() {
  const session = await auth();
  const user = session?.user;
  
  if (!user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Aperçu Coach</h2>
        <p className="text-muted-foreground">Vos performances en un coup d'œil.</p>
      </div>

      <CoachOverviewClient userId={user.id} />
    </div>
  );
}
