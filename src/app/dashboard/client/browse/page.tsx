import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import BrowseProgramsClient from './browse-client';

export default async function BrowsePage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Parcourir les Programmes</h2>
        <p className="text-muted-foreground">Découvrez des programmes d'entraînement créés par nos coachs experts.</p>
      </div>
      <BrowseProgramsClient userId={session.user.id} />
    </div>
  );
}
